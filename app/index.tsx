// Update file: app/index.tsx
import { useAuth } from '@/context/AuthContext';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

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

    // If no Gmail accounts or Gmail accounts are empty, redirect to Gmail OAuth page
    if (!gmailAccounts || gmailAccounts.length === 0) {
        return <Redirect href="/gmail_oauth" />;
    }

    // If user exists and has Gmail accounts, redirect to chat page
    return <Redirect href="/chat" />;
}