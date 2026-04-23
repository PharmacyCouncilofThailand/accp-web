'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { logger } from '@/utils/logger';

interface User {
    firstName: string;
    middleName?: string | null;
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

type AuthStorageMode = 'local' | 'session';

const AUTH_UNAUTHORIZED_EVENT = 'accp-auth:unauthorized';

function clearStoredAuth() {
    localStorage.removeItem('accp_user');
    localStorage.removeItem('accp_token');
    sessionStorage.removeItem('accp_user');
    sessionStorage.removeItem('accp_token');
}

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
    const [storageMode, setStorageMode] = useState<AuthStorageMode>('local');
    const [isLoading, setIsLoading] = useState(true);

    // Load user and token from storage on mount
    useEffect(() => {
        const localUser = localStorage.getItem('accp_user');
        const localToken = localStorage.getItem('accp_token');
        const sessionUser = sessionStorage.getItem('accp_user');
        const sessionToken = sessionStorage.getItem('accp_token');

        let storedUser: string | null = null;
        let storedToken: string | null = null;
        let detectedStorageMode: AuthStorageMode = 'local';

        // Prefer complete localStorage session first (remember me), then sessionStorage
        if (localUser && localToken) {
            storedUser = localUser;
            storedToken = localToken;
            detectedStorageMode = 'local';
        } else if (sessionUser && sessionToken) {
            storedUser = sessionUser;
            storedToken = sessionToken;
            detectedStorageMode = 'session';
        }

        // Incomplete auth state should be cleared to avoid ghost login/session mismatch
        if (!storedUser && !storedToken && (localUser || localToken || sessionUser || sessionToken)) {
            logger.warn('Incomplete auth data found, clearing session', { component: 'AuthContext' });
            clearStoredAuth();
            setIsLoading(false);
            return;
        }

        // Check token expiry before restoring session
        if (storedToken && isTokenExpired(storedToken)) {
            logger.warn('Token expired, clearing session', { component: 'AuthContext' });
            clearStoredAuth();
            setIsLoading(false);
            return;
        }

        // Force logout users from old version (had user but no token)
        // Safety net: prevents "looks logged in but can't do anything" state
        if (storedUser && !storedToken) {
            clearStoredAuth();
            setIsLoading(false);
            return;
        }
        
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
                setStorageMode(detectedStorageMode);
            } catch (error) {
                logger.error('Failed to parse stored user', error, { component: 'AuthContext' });
                clearStoredAuth();
            }
        }
        
        if (storedToken) {
            setTokenState(storedToken);
        }
        
        setIsLoading(false);
    }, []);

    // Auto-clear auth state if an in-memory token expires while app is open
    useEffect(() => {
        if (!token) return;

        if (isTokenExpired(token)) {
            logger.warn('Token expired during active session, clearing auth', { component: 'AuthContext' });
            setUser(null);
            setTokenState(null);
            setStorageMode('local');
            clearStoredAuth();
        }
    }, [token]);

    // Centralized 401 handling from API client
    useEffect(() => {
        const handleUnauthorized = () => {
            logger.warn('Unauthorized API response received, logging out', { component: 'AuthContext' });
            setUser(null);
            setTokenState(null);
            setStorageMode('local');
            clearStoredAuth();
        };

        window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);

        return () => {
            window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
        };
    }, []);

    const login = (userData: User, authToken?: string, rememberMe: boolean = true) => {
        setUser(userData);
        setTokenState(authToken || null);
        const nextStorageMode: AuthStorageMode = rememberMe ? 'local' : 'session';
        setStorageMode(nextStorageMode);

        const storage = rememberMe ? localStorage : sessionStorage;
        const otherStorage = rememberMe ? sessionStorage : localStorage;

        storage.setItem('accp_user', JSON.stringify(userData));
        if (authToken) {
            storage.setItem('accp_token', authToken);
        } else {
            storage.removeItem('accp_token');
        }

        otherStorage.removeItem('accp_user');
        otherStorage.removeItem('accp_token');
    };

    const logout = () => {
        setUser(null);
        setTokenState(null);
        setStorageMode('local');
        clearStoredAuth();
    };

    const setToken = (newToken: string | null) => {
        setTokenState(newToken);
        const storage = storageMode === 'local' ? localStorage : sessionStorage;
        const otherStorage = storageMode === 'local' ? sessionStorage : localStorage;

        if (newToken) {
            storage.setItem('accp_token', newToken);
            otherStorage.removeItem('accp_token');
        } else {
            storage.removeItem('accp_token');
            otherStorage.removeItem('accp_token');
        }
    };

    const hasValidToken = !!token && !isTokenExpired(token);

    const value = {
        user,
        token,
        login,
        logout,
        setToken,
        isAuthenticated: !!user && hasValidToken
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

