// Create file: app/auth.tsx
import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function AuthScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { colors } = useTheme();

    const handleContinue = async () => {
        if (!username.trim()) return;

        setLoading(true);
        try {
            // Create user object
            const userData = {
                id: Date.now().toString(),
                username: username.trim(),
                password: password.trim()
            };

            // Save to AsyncStorage
            await AsyncStorage.setItem('user', JSON.stringify(userData));

            // Update auth context
            await login(userData);
            console.log('User loged in:', userData);

            // Navigate to chat
            router.replace('/chat');
        } catch (error) {
            console.error('Error saving user:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <View style={styles.content}>
                <ThemedText style={styles.title}>Welcome to AmaAI</ThemedText>
                <ThemedText style={styles.subtitle}>Enter your name and password to continue</ThemedText>

                <View style={styles.form}>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: colors.surface,
                                color: colors.text,
                                borderColor: colors.border,
                            },
                        ]}
                        placeholder="Your name"
                        placeholderTextColor={colors.tabIconDefault}
                        value={username}
                        onChangeText={setUsername}
                        autoFocus
                        autoCapitalize="words"
                        textContentType='username'
                        returnKeyType="done"
                        onSubmitEditing={handleContinue}
                    />
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: colors.surface,
                                color: colors.text,
                                borderColor: colors.border,
                            },
                        ]}
                        placeholder="Your password"
                        placeholderTextColor={colors.tabIconDefault}
                        value={password}
                        onChangeText={setPassword}
                        autoFocus
                        textContentType='password'
                        returnKeyType="done"
                        onSubmitEditing={handleContinue}
                    />

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: colors.tint }]}
                        onPress={handleContinue}
                        disabled={loading || !username.trim()}
                    >
                        {loading ? (
                            <ActivityIndicator color={colors.background} />
                        ) : (
                            <ThemedText style={[styles.buttonText, { color: colors.background }]}>
                                Continue
                            </ThemedText>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 32,
        opacity: 0.7,
    },
    form: {
        gap: 16,
    },
    input: {
        height: 50,
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        borderWidth: 1,
    },
    button: {
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});