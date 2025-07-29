// Update file: app/index.tsx
import { useAuth } from '@/context/AuthContext';
import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    // If no user, redirect to auth page
    if (!user) {
        return <Redirect href="/register" />;
    }

    // If user exists, redirect to chat page
    return <Redirect href="/chat" />;
}