// Create file: context/AuthContext.tsx
import { GOOGLE_ANDROID_CLIENT_ID } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import * as AuthSession from 'expo-auth-session';

interface User {
    user_id: string;
    account_created: string;
    username: string;
    full_name: string | null | undefined;
    email: string,
    password: string;
}

export interface GmailAccount {
    email: string;
    refreshToken?: string;
    accessToken: string;
    expiresIn?: number;
    tokenType?: string;
    scope?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isLoggingOut: boolean;
    gmailAccounts: GmailAccount[];
    login: (userData: User) => Promise<void>;
    logout: () => Promise<void>;
    addGmailAccount: (account: GmailAccount) => Promise<void>;
    removeGmailAccount: (email: string) => Promise<void>;
    refreshAllGmailTokens: () => Promise<void>;
}

// --- OAuth constants ---
const discovery = {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};


const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [gmailAccounts, setGmailAccounts] = useState<GmailAccount[]>([]);

    useEffect(() => {
        loadUser();
        loadGmailAccounts();
    }, []);

    const loadUser = async () => {
        try {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                setUser(JSON.parse(userData));
            }
        } catch (error) {
            console.error('Error loading user:', error);
        }
    };

    const loadGmailAccounts = async () => {
        try {
            const stored = await AsyncStorage.getItem('gmail_accounts');
            if (stored) {
                setGmailAccounts(JSON.parse(stored));
            }
        } catch (error) {
            console.error('Error loading Gmail accounts:', error);
        } finally {
            setLoading(false);
        }
    }

    const login = async (userData: User) => {
        try {
            await AsyncStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
        } catch (error) {
            console.error('Error saving user:', error);
            throw error;
        }
    };

    const logout = async () => {
        setIsLoggingOut(true); // trigger WS cleanup
        try {
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('gmail_accounts');
            setUser(null);
            setGmailAccounts([]);
        } finally {
            setIsLoggingOut(false); // reset after cleanup
        }
    };

    // --- Gmail account management ---
    const saveGmailAccounts = async (accounts: GmailAccount[]) => {
        setGmailAccounts(accounts);
        await AsyncStorage.setItem('gmail_accounts', JSON.stringify(accounts));
    };

    const addGmailAccount = async (account: GmailAccount) => {
        const updated = gmailAccounts.filter(acc => acc.email !== account.email);
        updated.push(account);
        await saveGmailAccounts(updated);
    };

    const removeGmailAccount = async (email: string) => {
        const updated = gmailAccounts.filter(acc => acc.email !== email);
        await saveGmailAccounts(updated);
    };

    const refreshAllGmailTokens = async () => {
        try {
            const updated = await Promise.all(
                gmailAccounts.map(async (account) => {
                    if (!account.refreshToken) return account;
                    try {
                        const refreshed = await AuthSession.refreshAsync(
                            {
                                clientId: GOOGLE_ANDROID_CLIENT_ID,
                                refreshToken: account.refreshToken,
                            },
                            discovery
                        );

                        return {
                            ...account,
                            accessToken: refreshed.accessToken,
                            expiresIn: refreshed.expiresIn,
                            tokenType: refreshed.tokenType,
                            scope: refreshed.scope || account.scope,
                        };
                    } catch (err) {
                        console.error(`Failed to refresh token for ${account.email}:`, err);
                        return account;
                    }
                })
            );

            await saveGmailAccounts(updated);
        } catch (err) {
            console.error('Error refreshing Gmail tokens:', err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isLoggingOut, gmailAccounts, addGmailAccount, removeGmailAccount, refreshAllGmailTokens }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};