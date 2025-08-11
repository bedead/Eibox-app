import AppHeader from '@/components/AppHeader';
import SettingItem from '@/components/SettingItem';
import SettingSwitch from '@/components/SettingSwitch';
import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { router } from 'expo-router';
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, View, Linking } from 'react-native';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { GOOGLE_ANDROID_CLIENT_ID, GMAIL_OAUTH_TOKEN_ROUTE } from '@env';
import { useAuthRequest, makeRedirectUri, ResponseType } from 'expo-auth-session'
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

const REDIRECT_URI = makeRedirectUri({ scheme: "com.bedead.amaai" });

const discovery = {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: "https://oauth2.googleapis.com/token"
};
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.modify', 'email',
    'profile'];

const SettingsScreen = () => {
    const [accessToken, setAccessToken] = React.useState(null);
    const [voiceEnabled, setVoiceEnabled] = React.useState(false);
    const [notifications, setNotifications] = React.useState(true);
    const { theme, colors, toggleTheme } = useTheme();
    const { user, logout } = useAuth();


    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: GOOGLE_ANDROID_CLIENT_ID,
            redirectUri: REDIRECT_URI,
            scopes: SCOPES,
            responseType: ResponseType.Code
        },
        discovery
    );


    useEffect(() => {
        (async () => {
            if (response?.type === 'success') {
                try {
                    const { code } = response.params;

                    // Exchange the code for tokens *in the app*
                    const tokenResult = await AuthSession.exchangeCodeAsync(
                        {
                            code,
                            clientId: GOOGLE_ANDROID_CLIENT_ID,
                            redirectUri: REDIRECT_URI,
                            extraParams: {
                                code_verifier: request.codeVerifier, // PKCE magic
                            },
                        },
                        discovery
                    );

                    console.log('Token result:', tokenResult);

                    // 🔹 Get Gmail account email
                    const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                        headers: { Authorization: `Bearer ${tokenResult.accessToken}` },
                    });
                    const userInfo = await userInfoRes.json();
                    console.log('Google account info:', userInfo);

                    // Send tokens to backend
                    const saveResp = await fetch(GMAIL_OAUTH_TOKEN_ROUTE, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            user_id: user?.id,
                            username: user?.username,
                            account_email: userInfo.email,
                            token: tokenResult
                        }),
                    });
                    
                    if (tokenResult.refreshToken) {
                        await AsyncStorage.setItem('google_refresh_token', tokenResult.refreshToken);
                    }

                    console.log('Backend save response:', await saveResp.json());
                } catch (err) {
                    console.error('Token exchange failed:', err);
                }
            } else if (response) {
                console.log('OAuth response:', response);
            }
        })();
    }, [response]);


    const refreshAccessToken = async () => {
        try {
            const refreshToken = await AsyncStorage.getItem('google_refresh_token');
            if (!refreshToken) {
                console.warn('No refresh token found, re-login needed');
                return null;
            }

            const refreshed = await AuthSession.refreshAsync(
                {
                    clientId: GOOGLE_ANDROID_CLIENT_ID,
                    refreshToken,
                },
                discovery
            );

            console.log('Refreshed token:', refreshed);
            setAccessToken(refreshed.accessToken);
            return refreshed.accessToken;
        } catch (err) {
            console.error('Token refresh failed:', err);
            return null;
        }
    };

    const logoutUser = async () => {
        await logout();
        router.replace('/');
        console.log('Logging out user:', user?.username);
    }

    const handleBack = () => {
        router.back();
    };

    const openPrivacyPolicy = () => {
        Linking.openURL('https://your-privacy-policy-url.com');
    };

    const openTerms = () => {
        Linking.openURL('https://your-terms-url.com');
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <AppHeader title="Settings" onBack={handleBack} />
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Account Section */}
                <ThemedText type='subtitle' style={styles.sectionHeader}>Account</ThemedText>
                <View style={styles.section}>
                    <SettingItem
                        icon="person-circle-outline"
                        title="Username"
                        subtitle={user?.username || 'Not set'}
                    />
                    <SettingItem
                        icon="person-outline"
                        title="Name"
                        subtitle={user?.full_name || 'Not set'}
                    />
                    <SettingItem
                        icon="mail-outline"
                        title="Email"
                        subtitle={user?.email || 'Not set'}
                    />
                </View>
                {/* Connect Gmail Account */}
                <ThemedText type='subtitle' style={styles.sectionHeader}>Connect Gmail Account</ThemedText>
                <View style={styles.section}>
                    <SettingItem
                        disabled={!request}
                        icon="send-outline"
                        title="Connect"
                        onPress={() => {
                            promptAsync();
                        }}
                        showArrow
                    // subtitle={user?.username || 'Not set'}
                    // showArrow={true}
                    />
                </View>

                {/* Preferences Section */}
                <ThemedText type='subtitle' style={styles.sectionHeader}>Preferences</ThemedText>
                <View style={styles.section}>
                    <SettingSwitch
                        icon="moon-outline"
                        title="Dark Mode"
                        subtitle="Switch between light and dark themes"
                        value={theme === 'dark'}
                        onValueChange={toggleTheme}
                    />
                    <SettingSwitch
                        icon="mic-outline"
                        title="Voice Input"
                        subtitle="Enable voice commands and dictation"
                        value={voiceEnabled}
                        onValueChange={setVoiceEnabled}
                    />
                    <SettingSwitch
                        icon="notifications-outline"
                        title="Notifications"
                        subtitle="Receive chat and update notifications"
                        value={notifications}
                        onValueChange={setNotifications}
                    />
                </View>

                {/* Help & Legal Section */}
                <ThemedText type='subtitle' style={styles.sectionHeader}>Help & Legal</ThemedText>
                <View style={styles.section}>
                    <SettingItem
                        icon="shield-outline"
                        title="Privacy Policy"
                        onPress={openPrivacyPolicy}
                    />
                    <SettingItem
                        icon="document-text-outline"
                        title="Terms of Service"
                        onPress={openTerms}
                    />
                    <SettingItem
                        icon="information-circle-outline"
                        title="App Version"
                        subtitle={Constants.expoConfig?.version || '1.0.0'}
                        showArrow={false}
                    />
                </View>

                {/* Account Actions Section */}
                <ThemedText type='subtitle' style={styles.sectionHeader}>Account Actions</ThemedText>
                <View style={styles.section}>
                    <SettingItem
                        icon="log-out-outline"
                        title="Logout"
                        onPress={logoutUser}
                        textColor={colors.accent}
                    />
                </View>

                {/* Bottom Spacing */}
                <View style={styles.bottomPadding} />
            </ScrollView>
        </View>
    );
}

export default SettingsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15
    },
    content: {
        flex: 1,
    },
    sectionHeader: {
        // paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontSize: 13,
    },
    section: {
        borderRadius: 12,
        overflow: 'hidden',
        // marginHorizontal: 16,
    },
    bottomPadding: {
        height: 40,
    }
});
