// Update file: app/index.tsx
import { useAuth } from '@/context/AuthContext';
import { Redirect, router } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
    const { user, gmailAccounts, loading } = useAuth();
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

    // if gmail accounts are empty, redirect to gmail oauth page
    if (!gmailAccounts || gmailAccounts.length === 0) {
        router.replace("/gmail_oauth");
    }
    // If user exists, redirect to chat page
    return <Redirect href="/chat" />;
}