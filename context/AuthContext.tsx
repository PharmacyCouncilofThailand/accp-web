'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { logger } from '@/utils/logger';

interface User {
    firstName: string;
    lastName: string;
    email: string;
    country?: string;
    idCard?: string;  // Thai ID card (13 digits) for Thai users
    isThai: boolean;  // Determines currency: true = THB, false = USD
    delegateType: 'thai_student' | 'international_student' | 'thai_pharmacist' | 'international_pharmacist';
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (userData: User, authToken?: string) => void;
    logout: () => void;
    setToken: (token: string | null) => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setTokenState] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user and token from localStorage or sessionStorage on mount
    useEffect(() => {
        // Check localStorage first (Remember Me), then sessionStorage
        let storedUser = localStorage.getItem('accp_user');
        let storedToken = localStorage.getItem('accp_token');
        
        // If not in localStorage, check sessionStorage
        if (!storedUser || !storedToken) {
            storedUser = storedUser || sessionStorage.getItem('accp_user');
            storedToken = storedToken || sessionStorage.getItem('accp_token');
        }
        
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                logger.error('Failed to parse stored user', error, { component: 'AuthContext' });
                localStorage.removeItem('accp_user');
                sessionStorage.removeItem('accp_user');
            }
        }
        
        if (storedToken) {
            setTokenState(storedToken);
        }
        
        setIsLoading(false);
    }, []);

    const login = (userData: User, authToken?: string) => {
        setUser(userData);
        localStorage.setItem('accp_user', JSON.stringify(userData));
        
        if (authToken) {
            setTokenState(authToken);
            localStorage.setItem('accp_token', authToken);
        }
    };

    const logout = () => {
        setUser(null);
        setTokenState(null);
        localStorage.removeItem('accp_user');
        localStorage.removeItem('accp_token');
        sessionStorage.removeItem('accp_user');
        sessionStorage.removeItem('accp_token');
    };

    const setToken = (newToken: string | null) => {
        setTokenState(newToken);
        if (newToken) {
            localStorage.setItem('accp_token', newToken);
        } else {
            localStorage.removeItem('accp_token');
        }
    };

    const value = {
        user,
        token,
        login,
        logout,
        setToken,
        isAuthenticated: !!user
    };

    // Don't render children until we've checked localStorage
    if (isLoading) {
        return null;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

