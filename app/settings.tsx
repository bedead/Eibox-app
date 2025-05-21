"use client"

import React from "react"
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Switch, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface SettingsScreenProps {
    onBack: () => void
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
    const [voiceEnabled, setVoiceEnabled] = React.useState(true)
    const [darkMode, setDarkMode] = React.useState(true)
    const [notifications, setNotifications] = React.useState(true)

    return (
        <SafeAreaView style={styles.container}>
            {/* Header with back button */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={onBack}>
                    <Ionicons name="arrow-back" size={24} color="#bb86fc" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView style={styles.content}>
                {/* Voice Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Voice Assistant</Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Ionicons name="mic" size={22} color="#bb86fc" style={styles.settingIcon} />
                            <Text style={styles.settingText}>Voice Response</Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#3e3e3e", true: "rgba(187, 134, 252, 0.4)" }}
                            thumbColor={voiceEnabled ? "#bb86fc" : "#f4f3f4"}
                            onValueChange={() => setVoiceEnabled(!voiceEnabled)}
                            value={voiceEnabled}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Ionicons name="moon" size={22} color="#bb86fc" style={styles.settingIcon} />
                            <Text style={styles.settingText}>Dark Mode</Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#3e3e3e", true: "rgba(187, 134, 252, 0.4)" }}
                            thumbColor={darkMode ? "#bb86fc" : "#f4f3f4"}
                            onValueChange={() => setDarkMode(!darkMode)}
                            value={darkMode}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Ionicons name="notifications" size={22} color="#bb86fc" style={styles.settingIcon} />
                            <Text style={styles.settingText}>Notifications</Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#3e3e3e", true: "rgba(187, 134, 252, 0.4)" }}
                            thumbColor={notifications ? "#bb86fc" : "#f4f3f4"}
                            onValueChange={() => setNotifications(!notifications)}
                            value={notifications}
                        />
                    </View>
                </View>

                {/* About Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About</Text>

                    <TouchableOpacity style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Ionicons name="information-circle" size={22} color="#bb86fc" style={styles.settingIcon} />
                            <Text style={styles.settingText}>App Version</Text>
                        </View>
                        <Text style={styles.versionText}>1.0.0</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Ionicons name="document-text" size={22} color="#bb86fc" style={styles.settingIcon} />
                            <Text style={styles.settingText}>Privacy Policy</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#bb86fc" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Ionicons name="help-circle" size={22} color="#bb86fc" style={styles.settingIcon} />
                            <Text style={styles.settingText}>Help & Support</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#bb86fc" />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
        padding: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 30,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(187, 134, 252, 0.1)",
    },
    headerTitle: {
        color: "#bb86fc",
        fontSize: 20,
        fontWeight: "600",
        textShadowColor: "#bb86fc",
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 5,
    },
    content: {
        flex: 1,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        color: "#bb86fc",
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 15,
        textShadowColor: "#bb86fc",
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 3,
    },
    settingItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(187, 134, 252, 0.2)",
    },
    settingInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    settingIcon: {
        marginRight: 12,
    },
    settingText: {
        color: "#ffffff",
        fontSize: 16,
    },
    versionText: {
        color: "#bb86fc",
        fontSize: 14,
    },
})

export default SettingsScreen
