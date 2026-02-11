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
    login: (userData: User, authToken?: string, rememberMe?: boolean) => void;
    logout: () => void;
    setToken: (token: string | null) => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function isTokenExpired(token: string): boolean {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 < Date.now();
    } catch {
        return true;
    }
}

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

        // Check token expiry before restoring session
        if (storedToken && isTokenExpired(storedToken)) {
            logger.warn('Token expired, clearing session', { component: 'AuthContext' });
            localStorage.removeItem('accp_user');
            localStorage.removeItem('accp_token');
            sessionStorage.removeItem('accp_user');
            sessionStorage.removeItem('accp_token');
            setIsLoading(false);
            return;
        }

        // Force logout users from old version (had user but no token)
        // Safety net: prevents "looks logged in but can't do anything" state
        if (storedUser && !storedToken) {
            localStorage.removeItem('accp_user');
            sessionStorage.removeItem('accp_user');
            setIsLoading(false);
            return;
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

    const login = (userData: User, authToken?: string, rememberMe: boolean = true) => {
        setUser(userData);
        setTokenState(authToken || null);

        const storage = rememberMe ? localStorage : sessionStorage;
        const otherStorage = rememberMe ? sessionStorage : localStorage;

        storage.setItem('accp_user', JSON.stringify(userData));
        if (authToken) {
            storage.setItem('accp_token', authToken);
        }

        otherStorage.removeItem('accp_user');
        otherStorage.removeItem('accp_token');
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

