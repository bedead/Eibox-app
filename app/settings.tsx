import AppHeader from '@/components/AppHeader';
import SettingItem from '@/components/SettingItem';
import SettingSwitch from '@/components/SettingSwitch';
import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { router } from 'expo-router';
import React from "react";
import { ScrollView, StyleSheet, View, Linking } from 'react-native';
import Constants from 'expo-constants';

export default function SettingsScreen() {
    const [voiceEnabled, setVoiceEnabled] = React.useState(true);
    const [notifications, setNotifications] = React.useState(true);
    const { theme, colors, toggleTheme } = useTheme();
    const { user, logout } = useAuth();

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
                        icon="person-outline"
                        title="Name"
                        subtitle={user?.username || 'Not set'}
                        showArrow={false}
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
