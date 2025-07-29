import { AuthProvider } from '@/context/AuthContext';
import { Stack } from 'expo-router';
import React from 'react';
import { StatusBar } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import { ThemeProvider } from '../context/ThemeContext';

export default function RootLayout(): React.JSX.Element {
    return (
        <ThemeProvider>
            <AuthProvider>
                <MenuProvider>
                    <StatusBar barStyle="light-content" backgroundColor="#000" />
                    <Stack
                        screenOptions={{
                            headerShown: false,
                            contentStyle: { backgroundColor: '#111' },
                            animation: 'fade',
                        }}
                    >
                        <Stack.Screen name="index" />
                        <Stack.Screen name="chat" />
                        <Stack.Screen name="login" />
                        <Stack.Screen name="register" />
                        <Stack.Screen name="settings" />
                    </Stack>
                </MenuProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}