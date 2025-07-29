// Create file: context/AuthContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

interface User {
    id: string;
    account_created: string;
    username: string;
    full_name: string | null | undefined;
    email: string,
    password: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isLoggingOut: boolean;
    login: (userData: User) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                setUser(JSON.parse(userData));
            }
        } catch (error) {
            console.error('Error loading user:', error);
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
        setIsLoggingOut(true); // trigger WS cleanup
        try {
            await AsyncStorage.removeItem('user');
            setUser(null);
        } finally {
            setIsLoggingOut(false); // reset after cleanup
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isLoggingOut, }}>
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