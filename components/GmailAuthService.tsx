// GmailAuthService.js - React Native Backend OAuth Implementation
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Crypto from 'expo-crypto';
import { GMAIL_OAUTH_START_ROUTE, GMAIL_OAUTH_STATUS_ROUTE } from "@env"


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


// React Component Example
export const GmailConnectButton = ({ username, onConnectionResult }) => {
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

    const getStatusColor = () => {
        switch (authStatus) {
            case 'success':
                return '#4CAF50';
            case 'error':
                return '#f44336';
            case 'authenticating':
            case 'polling':
                return '#2196F3';
            default:
                return '#4CAF50';
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.button, { backgroundColor: getStatusColor() }]}
                onPress={handleConnect}
                disabled={isLoading}
            >
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color="#fff" style={styles.spinner} />
                        <Text style={styles.buttonText}>{getStatusText()}</Text>
                    </View>
                ) : (
                    <Text style={styles.buttonText}>{getStatusText()}</Text>
                )}
            </TouchableOpacity>

            {authStatus === 'polling' && (
                <Text style={styles.helpText}>
                    Please complete the authorization in your browser, then return to this app.
                </Text>
            )}
        </View>
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
        borderRadius: 8,
        minWidth: 200,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    spinner: {
        marginRight: 8,
    },
    helpText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 14,
        marginTop: 12,
        paddingHorizontal: 20,
    },
    screen: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
    },
});
