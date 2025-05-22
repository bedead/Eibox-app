import { Stack } from 'expo-router';
import React from 'react';
import { StatusBar } from 'react-native';
import { ThemeProvider } from '../context/ThemeContext';

export default function Layout(): React.JSX.Element {
    return (
        <ThemeProvider>
            <StatusBar barStyle="light-content" backgroundColor="#000" />
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: '#111' },
                    animation: 'fade',
                }}
            >
                <Stack.Screen name="index" />
                <Stack.Screen name="settings" />
            </Stack>
        </ThemeProvider>
    );
}