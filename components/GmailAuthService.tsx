// GmailAuthService.js - React Native Backend OAuth Implementation
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { GMAIL_OAUTH_START_ROUTE, GMAIL_OAUTH_STATUS_ROUTE } from "@env";
import * as Crypto from 'expo-crypto';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Pressable,
    StyleSheet
} from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';


export const useBackendGmailAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [authStatus, setAuthStatus] = useState('idle'); // idle, authenticating, polling, success, error

    const connectGmailAccount = async (username: string) => {
        try {
            setIsLoading(true);
            setAuthStatus('authenticating');

            // Generate unique session ID for this mobile session
            const mobileSessionId = await generateMobileSessionId();

            // Construct OAuth start URL with parameters
            const oauthUrl = `${GMAIL_OAUTH_START_ROUTE}?username=${encodeURIComponent(username)}&mobile_session_id=${mobileSessionId}`;

            console.log('Starting OAuth flow:', oauthUrl);

            // Open browser for OAuth
            const result = await WebBrowser.openBrowserAsync(oauthUrl, {
                showTitle: true,
                // toolbarColor: '#4CAF50',
                // controlsColor: '#fff',
                browserPackage: undefined, // Let user choose browser
            });

            if (result.type === 'opened') {
                // Browser opened successfully, start polling for completion
                setAuthStatus('polling');
                const pollResult = await pollForOAuthCompletion(mobileSessionId);

                if (pollResult.success) {
                    setAuthStatus('success');
                    return {
                        success: true,
                        email: pollResult.email,
                        message: 'Gmail account connected successfully!'
                    };
                } else {
                    setAuthStatus('error');
                    return {
                        success: false,
                        error: pollResult.error || 'OAuth flow was not completed'
                    };
                }
            } else {
                // User cancelled or browser failed to open
                setAuthStatus('idle');
                return {
                    success: false,
                    error: 'OAuth cancelled by user'
                };
            }

        } catch (error) {
            console.error('Gmail OAuth error:', error);
            setAuthStatus('error');
            return {
                success: false,
                error: error.message || 'Unknown error occurred'
            };
        } finally {
            setIsLoading(false);
        }
    };

    const pollForOAuthCompletion = async (mobileSessionId: string, maxAttempts = 60) => {
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            try {
                const response = await fetch(`${GMAIL_OAUTH_STATUS_ROUTE}/${mobileSessionId}`);
                let data;
                try {
                    const text = await response.text();
                    data = text ? JSON.parse(text) : {};
                } catch {
                    data = {};
                }


                console.log(`Polling attempt ${attempt + 1}:`, data);

                if (data.completed) {
                    return { success: true, email: data.email };
                }

                // setting this to 200ms to reduce the chance of timeout, delay in user experience 
                await new Promise(resolve => setTimeout(resolve, 200));
            } catch (error) {
                console.error(`Polling error attempt ${attempt + 1}:`, error);
            }
        }

        return {
            success: false,
            error: 'OAuth flow timed out. Please try again.'
        };
    };


    return {
        connectGmailAccount,
        isLoading,
        authStatus
    };
};

// Helper function to generate secure mobile session ID
const generateMobileSessionId = async () => {
    const randomBytes = await Crypto.getRandomBytesAsync(16);
    return Array.from(randomBytes, byte =>
        byte.toString(16).padStart(2, '0')
    ).join('');
};


interface ConnectionResult {
    success: boolean;
    email?: string;
    error?: string;
    message?: string;
}

interface GmailConnectButtonProps {
    username?: string;
    onConnectionResult?: (result: ConnectionResult) => void;
}

// React Component Example
export const GmailConnectButton: React.FC<GmailConnectButtonProps> = ({ username, onConnectionResult }) => {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const { connectGmailAccount, isLoading, authStatus } = useBackendGmailAuth();

    const handleConnect = async () => {
        if (!username) {
            Alert.alert('Error', 'Username is required');
            return;
        }

        const result = await connectGmailAccount(username);

        if (result.success) {
            Alert.alert(
                'Success!',
                `Gmail account ${result.email} connected successfully!`,
                [{ text: 'OK', onPress: () => onConnectionResult?.(result) }]
            );
        } else {
            Alert.alert(
                'Connection Failed',
                result.error || 'Failed to connect Gmail account',
                [{ text: 'OK' }]
            );
        }
    };

    const getStatusText = () => {
        switch (authStatus) {
            case 'authenticating':
                return 'Opening browser...';
            case 'polling':
                return 'Waiting for authorization...';
            case 'success':
                return 'Connected successfully!';
            case 'error':
                return 'Connection failed';
            default:
                return 'Connect Gmail Account';
        }
    };


    return (
        <ThemedView style={styles.container}>
            <Pressable
                style={({ pressed }) => [
                    styles.button,
                    {
                        backgroundColor: colors.buttonBackground,
                        opacity: pressed ? 0.8 : 1,
                    }
                ]}
                onPress={handleConnect}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ThemedView style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color={colors.buttonText} style={styles.spinner} />
                        <ThemedText style={[styles.buttonText, { color: colors.buttonText }]}>
                            {getStatusText()}
                        </ThemedText>
                    </ThemedView>
                ) : (
                    <ThemedText style={[styles.buttonText, { color: colors.buttonText }]}>
                        {getStatusText()}
                    </ThemedText>
                )}
            </Pressable>

            {
                authStatus === 'polling' && (
                    <ThemedText type="default" style={styles.helpText}>
                        Please complete the authorization in your browser, then return to this app.
                    </ThemedText>
                )
            }
        </ThemedView >
    );
};



const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 20,
    },
    button: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 10,
        minWidth: 200,
        alignItems: 'center',
        elevation: 2,
        borderWidth: 0,              // Prevent default highlight border
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    spinner: {
        marginRight: 12,
    },
    helpText: {
        textAlign: 'center',
        marginTop: 16,
        paddingHorizontal: 24,
        opacity: 0.8,
    },
});
