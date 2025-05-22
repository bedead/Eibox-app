import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useEffect, useState } from "react"
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import IconButton from '../components/IconButton'
import { useTheme } from '../context/ThemeContext'
import SettingsScreen from "./settings"

type IconName = keyof typeof Ionicons.glyphMap;

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
}

export default function App() {
    const [isListening, setIsListening] = useState(false)
    const [showSettings, setShowSettings] = useState(false)
    const { colors, theme } = useTheme();
    const [textInput, setTextInput] = useState('')
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: "Hello! How can I help you today?", sender: 'ai' }
    ]);

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

    const handleSendText = () => {
        if (textInput.trim()) {
            const newMessage: Message = {
                id: Date.now().toString(),
                text: textInput,
                sender: 'user'
            };
            setMessages(prev => [...prev, newMessage]);
            // Simulate AI response
            setTimeout(() => {
                const aiResponse: Message = {
                    id: (Date.now() + 1).toString(),
                    text: `You said: ${textInput}`,
                    sender: 'ai'
                };
                setMessages(prev => [...prev, aiResponse]);
            }, 1000);
            setTextInput('');
        }
    }

    if (showSettings) {
        return <SettingsScreen onBack={() => setShowSettings(false)} />
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                {/* Fixed Header */}
                <View style={styles.header}>
                    <View style={{ flex: 1 }} />
                    <IconButton name="settings" onPress={toggleSettings} />
                </View>

                {/* Scrollable Messages */}
                <View style={styles.messagesWrapper}>
                    <ScrollView
                        style={styles.messagesList}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.messagesContent}
                    >
                        {messages.map((message) => (
                            <View
                                key={message.id}
                                style={[
                                    styles.messageContainer,
                                    message.sender === 'user'
                                        ? [styles.userMessage, { backgroundColor: colors.surface }]
                                        : [styles.aiMessage, {
                                            backgroundColor: colors.background,
                                            borderColor: colors.surface
                                        }]
                                ]}
                            >
                                <Text style={[
                                    styles.messageText,
                                    { color: colors.text }
                                ]}>
                                    {message.text}
                                </Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
                {/* Listening Indicator */}
                {isListening && (
                    <View style={[
                        // styles.messageContainer,
                        // styles.aiMessage,
                        styles.ListeningContainer,
                        {
                            backgroundColor: colors.background,
                            borderColor: colors.surface
                        }
                    ]}>
                        <Text style={[styles.listeningText, { color: colors.text }]}>
                            Listening...
                        </Text>
                    </View>
                )}
                {/* Fixed Input Area */}
                <View style={styles.buttonContainer}>
                    <View style={styles.textInputContainer}>
                        <TextInput
                            style={[styles.textInput, {
                                color: colors.text,
                                backgroundColor: colors.surface
                            }]}
                            value={textInput}
                            onChangeText={setTextInput}
                            placeholder="Type a message..."
                            placeholderTextColor={colors.tabIconDefault}
                            onSubmitEditing={handleSendText}
                        />
                    </View>

                    <TouchableOpacity activeOpacity={0.7} onPress={handlePress} style={styles.buttonOuter}>
                        <LinearGradient
                            colors={[colors.surface, colors.text]}
                            style={styles.gradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <View style={[styles.buttonInner, { backgroundColor: colors.background }]}>
                                <Ionicons name="mic" size={28} color={colors.text} />
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    header: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        marginTop: 15,
        marginBottom: 15,
    },
    content: {
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Platform.OS === 'ios' ? 25 : 15,
        marginBottom: Platform.OS === 'ios' ? 25 : 15,
        gap: 10,
        paddingHorizontal: 15,
    },
    buttonOuter: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    gradient: {
        width: "100%",
        height: "100%",
        borderRadius: 35,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonInner: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
    },
    textInputContainer: {
        flex: 1,
    },
    textInput: {
        height: 50,
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
    },
    messagesWrapper: {
        flex: 1,
        marginHorizontal: -15,
    },
    messagesList: {
        flex: 1,
    },
    messagesContent: {
        padding: 20,
        gap: 5,
    },
    messageContainer: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
    },
    userMessage: {
        alignSelf: 'flex-end',
        borderBottomRightRadius: 4,
    },
    aiMessage: {
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 4,
        borderWidth: 1,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },
    ListeningContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Platform.OS === 'ios' ? 25 : 15,
        gap: 10,
        paddingHorizontal: 15,
    },
    listeningText: {
        fontSize: 16,
        alignSelf: 'center',
    },
})
