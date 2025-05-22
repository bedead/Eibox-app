"use client"

import { Ionicons } from "@expo/vector-icons"
import React from "react"
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native"
import AppHeader from "../components/AppHeader"
import SettingItem from "../components/SettingItem"
import SettingSwitch from "../components/SettingSwitch"
import { useTheme } from '../context/ThemeContext'

interface SettingsScreenProps {
    onBack: () => void
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
    const [voiceEnabled, setVoiceEnabled] = React.useState(true)
    const [notifications, setNotifications] = React.useState(true)
    const { theme, colors, toggleTheme } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <AppHeader title="Settings" onBack={onBack} />

            <ScrollView style={styles.content}>
                {/* Voice Settings */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.accent }]}>Voice Assistant</Text>
                    
                    <SettingSwitch
                        icon="mic"
                        title="Voice Response"
                        value={voiceEnabled}
                        onValueChange={setVoiceEnabled}
                    />
                    
                    <SettingSwitch
                        icon="moon"
                        title="Dark Mode"
                        value={theme === 'dark'}
                        onValueChange={toggleTheme}
                    />
                    
                    <SettingSwitch
                        icon="notifications"
                        title="Notifications"
                        value={notifications}
                        onValueChange={setNotifications}
                    />
                </View>

                {/* About Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>

                    <SettingItem
                        icon="information-circle"
                        title="App Version"
                        rightElement={<Text style={[styles.versionText, { color: colors.text }]}>1.0.0</Text>}
                    />

                    <SettingItem
                        icon="document-text"
                        title="Privacy Policy"
                        rightElement={<Ionicons name="chevron-forward" size={20} color={colors.text} />}
                        onPress={() => {}}
                    />

                    <SettingItem
                        icon="help-circle"
                        title="Help & Support"
                        rightElement={<Ionicons name="chevron-forward" size={20} color={colors.text} />}
                        onPress={() => {}}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    content: {
        flex: 1,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 15,
    },
    versionText: {
        fontSize: 14,
    },
});

export default SettingsScreen;
