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
import { GOOGLE_ANDROID_CLIENT_ID, GOOGLE_WEB_CLIENT_ID, SAVE_TOKENS_ROUTE } from '@env';
import { useAuthRequest, makeRedirectUri, ResponseType } from 'expo-auth-session'
// import { Prompt } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const REDIRECT_URI = makeRedirectUri({ scheme: "com.bedead.amaai" });

const discovery = {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: "https://oauth2.googleapis.com/token"
};
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.modify'];

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

    const handleAccountAccess = async () => {
        console.log('About to start OAuth with URI:', REDIRECT_URI);

        try {
            const result = await promptAsync();
            console.log('OAuth result:', result);

            if (result?.type === 'error') {
                console.error('OAuth error:', result.error, result.params || {});
            }
        } catch (err) {
            console.error('Exception during OAuth:', err);
        }
    };


    useEffect(() => {
        if (response?.type === 'success') {
            const { authentication, params } = response;

            const tokens = {
                access_token: authentication.accessToken,
                refresh_token: params.refresh_token, // Only fields result in refresh_token when conditions met
                id_token: params.id_token,
                expires_in: authentication.expiresIn,
                token_type: authentication.tokenType,
                scope: params.scope,
            };

            // 🔁 Send access token to your backend
            fetch(SAVE_TOKENS_ROUTE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tokens),
            }).then(res => res.json())
                .then(data => console.log('Tokens saved:', data))
                .catch(err => console.error('Error:', err))
        } else {
            console.log(response);
        }
    }, [response]);


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
                            handleAccountAccess();
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
