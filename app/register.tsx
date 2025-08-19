// Create file: app/register.tsx
import uuid from 'react-native-uuid';
import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { USER_REGISTER_ROUTE } from '@env';

export default function RegisterScreen() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { colors } = useTheme();

    const handleContinue = async () => {
        if (!username.trim()) return;
        if (!email.trim()) return;
        if (!password.trim()) return;

        setLoading(true);
        try {
            // Create user object
            const userData = {
                user_id: uuid.v4(),
                account_created: new Date().toISOString(),
                username: username.trim().toLowerCase(),
                full_name: null,
                email: email.trim(),
                password: password.trim()
            };

            // 1. Send POST request to backend
            const response = await fetch(USER_REGISTER_ROUTE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Registration failed:', data);
                Alert.alert('Registration Failed', data.detail || 'Please try again.');
                return;
            }

            // 3. Update auth context
            await login(userData);
            console.log('User logged in:', userData);

            // 4. Navigate to chat
            router.replace('/chat');
        } catch (error) {
            console.error('Error saving user:', error);
        } finally {
            setLoading(false);
        }
    };


    const navigateToLogin = () => {
        router.replace('/login');
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <View style={styles.content}>
                <ThemedText style={styles.title}>Welcome to Ama.AI</ThemedText>
                <ThemedText style={styles.subtitle}>Register yourself.</ThemedText>

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
                        placeholder="Your username"
                        placeholderTextColor={colors.tabIconDefault}
                        value={username}
                        onChangeText={setUsername}
                        autoFocus
                        textContentType='username'
                        returnKeyType="done"
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
                        placeholder="Your email"
                        placeholderTextColor={colors.tabIconDefault}
                        value={email}
                        onChangeText={setEmail}
                        autoFocus
                        textContentType='emailAddress'
                        returnKeyType="done"
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
                    <TouchableOpacity onPress={navigateToLogin}>
                        <ThemedText style={{ color: colors.tint, textAlign: 'center' }}>
                            Already have an account? Login
                        </ThemedText>
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
        fontSize: 20,
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