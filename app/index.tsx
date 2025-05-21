"use client"

import { useState, useEffect } from "react"
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, StatusBar } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import SettingsScreen from "./settings"

export default function App() {
    const [isListening, setIsListening] = useState(false)
    const [responseText, setResponseText] = useState(
        "Create a futuristic, cyberpunk-style chatbot app featuring a sleek, dark interface. The chatbot should be displayed with neon purple text and glow. The background should include vibrant neon purple, pink, and blue, blending into the dark environment...",
    )
    const [showSettings, setShowSettings] = useState(false)

    // Simulate listening state
    useEffect(() => {
        if (isListening) {
            const timer = setTimeout(() => {
                setIsListening(false)
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [isListening])

    const handlePress = () => {
        setIsListening(true)
    }

    const toggleSettings = () => {
        setShowSettings(!showSettings)
    }

    if (showSettings) {
        return <SettingsScreen onBack={() => setShowSettings(false)} />
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header with settings button */}
            <View style={styles.header}>
                <View style={{ flex: 1 }} />
                <TouchableOpacity style={styles.settingsButton} onPress={toggleSettings}>
                    <Ionicons name="settings" size={24} color="#bb86fc" />
                </TouchableOpacity>
            </View>

            {/* Main content area */}
            <View style={styles.content}>
                <View style={styles.responseContainer}>
                    <Text style={styles.responseText}>{responseText}</Text>
                    {isListening && <Text style={styles.listeningText}>Listening...</Text>}
                </View>
            </View>

            {/* Microphone button */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity activeOpacity={0.7} onPress={handlePress} style={styles.buttonOuter}>
                    <LinearGradient
                        colors={["#9c27b0", "#e91e63"]}
                        style={styles.gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <View style={styles.buttonInner}>
                            <Ionicons name="mic" size={28} color="#ffffff" />
                        </View>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
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
        justifyContent: "flex-end",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 20,
    },
    settingsButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(187, 134, 252, 0.1)",
        shadowColor: "#bb86fc",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    content: {
        flex: 1,
        justifyContent: "center",
    },
    responseContainer: {
        width: "100%",
        paddingHorizontal: 10,
    },
    responseText: {
        color: "#bb86fc",
        fontSize: 18,
        lineHeight: 26,
        textAlign: "left",
        textShadowColor: "#bb86fc",
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    listeningText: {
        color: "#bb86fc",
        marginTop: 20,
        fontSize: 16,
        textAlign: "left",
        textShadowColor: "#bb86fc",
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 5,
    },
    buttonContainer: {
        alignItems: "center",
        marginBottom: 40,
    },
    buttonOuter: {
        width: 70,
        height: 70,
        borderRadius: 35,
        shadowColor: "#bb86fc",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 15,
        elevation: 10,
    },
    gradient: {
        width: "100%",
        height: "100%",
        borderRadius: 35,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
})
