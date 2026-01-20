'use client';

// Centralized API Client for ACCP Web
const API_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

interface ApiOptions {
    method?: string;
    body?: BodyInit;
    token?: string;
    headers?: Record<string, string>;
}

interface ApiError extends Error {
    code?: string;
    status?: number;
}

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { method = 'GET', body, token, headers = {} } = options;

    const requestHeaders: Record<string, string> = {
        ...headers,
    };

    // Add content-type if body is JSON string (not FormData)
    if (body && typeof body === 'string') {
        requestHeaders['Content-Type'] = 'application/json';
    }

    if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers: requestHeaders,
        body,
        credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
        const error: ApiError = new Error(data.error || data.message || 'API request failed');
        error.code = data.code;
        error.status = response.status;
        throw error;
    }

    return data;
}

// ============================================================================
// Auth API
// ============================================================================
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    token?: string;
    user?: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
    };
    error?: string;
}

export interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    role: string;
    thaiIdCard?: string;
    institution?: string;
    country?: string;
}

// ============================================================================
// API Object
// ============================================================================
export const api = {
    auth: {
        login: (credentials: LoginCredentials) =>
            fetchAPI<LoginResponse>('/auth/login', {
                method: 'POST',
                body: JSON.stringify(credentials),
            }),

        register: (formData: FormData) =>
            fetchAPI<{ success: boolean; message?: string; error?: string }>('/auth/register', {
                method: 'POST',
                body: formData, // FormData for file uploads
            }),
    },

    user: {
        getProfile: (token: string) =>
            fetchAPI<{ user: Record<string, unknown> }>('/api/users/profile', { token }),

        updateProfile: (token: string, data: Record<string, unknown>) =>
            fetchAPI<{ success: boolean }>('/api/users/profile', {
                method: 'PATCH',
                body: JSON.stringify(data),
                token,
            }),
    },

    abstracts: {
        submit: (token: string, formData: FormData) =>
            fetchAPI<{ success: boolean; abstract?: Record<string, unknown> }>('/api/abstracts', {
                method: 'POST',
                body: formData,
                token,
            }),

        getUserAbstracts: (token: string, email: string) =>
            fetchAPI<{ abstracts: Record<string, unknown>[] }>(`/api/abstracts/user?email=${encodeURIComponent(email)}`, { token }),
    },

    speakers: {
        list: () =>
            fetchAPI<{ speakers: Record<string, unknown>[] }>('/api/speakers'),
    },
};

export default api;
