// context/AuthContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

export interface GmailAccount {
    email: string;
    // Add other fields you store for Gmail accounts if needed
}

export interface User {
    user_id: string;
    account_created: string;
    username: string;
    full_name?: string | null;
    email: string;
    password: string;
    gmail_accounts: string[];
}

interface AuthContextType {
    user: User | null;
    gmailAccounts: GmailAccount[];
    loading: boolean;
    isLoggingOut: boolean;
    login: (userData: User) => Promise<void>;
    logout: () => Promise<void>;
    addGmailAccount: (account: GmailAccount) => Promise<void>;
    removeGmailAccount: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [gmailAccounts, setGmailAccounts] = useState<GmailAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

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
    };

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
        setIsLoggingOut(true);
        try {
            await AsyncStorage.multiRemove(['user', 'gmail_accounts']);
            setUser(null);
            setGmailAccounts([]);
        } finally {
            setIsLoggingOut(false);
        }
    };

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

    return (
        <AuthContext.Provider
            value={{
                user,
                gmailAccounts,
                loading,
                isLoggingOut,
                login,
                logout,
                addGmailAccount,
                removeGmailAccount,
            }}
        >
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
