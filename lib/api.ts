'use client';

// Centralized API Client for ACCP Web
const API_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');
const AUTH_UNAUTHORIZED_EVENT = 'accp-auth:unauthorized';

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

function dispatchUnauthorizedEvent() {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
    }
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
        if (response.status === 401) {
            dispatchUnauthorizedEvent();
        }

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
    token: string;
    user: {
        id: number;
        email: string;
        firstName: string;
        middleName?: string | null;
        lastName: string;
        role: string;
        country?: string;
        delegateType: string;
        isThai: boolean;
        idCard?: string;
    };
    error?: string;
}

export interface RegisterData {
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    role: string;
    thaiIdCard?: string;
    institution?: string;
    country?: string;
}

export interface LinkedSession {
    sessionId: number;
    sessionName: string;
    maxCapacity: number;
    enrolledCount: number;
    isFull: boolean;
}

export interface TicketType {
    id: number;
    eventId: number;
    category: 'primary' | 'addon';
    priority: 'early_bird' | 'regular';
    groupName: string | null;
    name: string;
    description: string | null;
    price: string;
    originalPrice: string | null;
    currency: string;
    features: string[];
    badgeText: string | null;
    displayOrder: number;
    allowedRoles: string | null;
    quota: number;
    soldCount: number;
    isAvailable: boolean;
    saleStartDate: string | null;
    saleEndDate: string | null;
    sessions?: LinkedSession[];
}

export interface TicketGroup {
    groupId: string;
    groupName: string;
    category: 'primary' | 'addon';
    tickets: TicketType[];
}

export interface MyTicketItem {
    regCode: string;
    eventId: number;
    eventCode: string;
    eventName: string;
    eventStartDate: string | null;
    eventEndDate: string | null;
    eventLocation: string | null;
    eventImageUrl: string | null;
    websiteUrl: string | null;
    status: string;
    ticketName: string;
    ticketTypeId: number;
    priority: 'early_bird' | 'regular';
    purchasedAt: string | null;
    amount: string;
    currency: string;
    includes: string[];
    receiptUrl: string | null;
    receipts: {
        orderId: number;
        orderNumber: string;
        totalAmount: string;
        currency: string;
        /** Actual charge when made in a different currency (Alipay = THB) */
        charge?: { currency: string; amount: string } | null;
        purchasedAt: string | null;
        paidAt: string | null;
        receiptUrl: string;
    }[];
    galaTicket: {
        id: string;
        status: string;
        name: string;
        purchasedAt: string | null;
        amount: string;
        currency: string;
        dateTimeStart: string | null;
        dateTimeEnd: string | null;
        venue: string | null;
        dietary: string | null;
    } | null;
    workshops: {
        id: string;
        sessionId: number;
        status: string;
        name: string;
        purchasedAt: string | null;
        amount: string;
        currency: string;
        dateTimeStart: string | null;
        dateTimeEnd: string | null;
        venue: string | null;
    }[];
}

export interface MyTicketsResponse {
    success: boolean;
    data: MyTicketItem[];
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
            fetchAPI<{ success: boolean; abstract?: Record<string, unknown> }>('/api/abstracts/submit', {
                method: 'POST',
                body: formData,
                token,
            }),

        getUserAbstracts: (token: string) =>
            fetchAPI<{ abstracts: Record<string, unknown>[] }>('/api/abstracts/user', { token }),
    },

    speakers: {
        list: () =>
            fetchAPI<{ speakers: Record<string, unknown>[] }>('/api/speakers'),
    },

    workshops: {
        list: () =>
            fetchAPI<{
                workshops: {
                    id: string;
                    sessionId: number;
                    eventId: number;
                    title: string;
                    description: string | null;
                    date: string;
                    time: string;
                    duration: 'fullDay' | 'halfDay';
                    venue: string;
                    capacity: number;
                    enrolled: number;
                    fee: string;
                    tickets: {
                        id: number;
                        name: string;
                        price: string;
                        currency: string;
                        allowedRoles: string[] | null;
                        saleStartDate: string | null;
                    }[];
                    instructors: { name: string; affiliation?: string }[];
                    agenda: { time: string; topic: string }[] | null;
                    color: string;
                    icon: string;
                    isFull: boolean;
                    saleStartDate: string | null;
                }[]
            }>('/api/workshops'),
    },

    tickets: {
        list: () =>
            fetchAPI<{ tickets: TicketType[] }>('/api/tickets'),
    },

    payments: {
        myPurchases: (token: string) =>
            fetchAPI<{
                success: boolean;
                data: {
                    hasPrimaryTicket: boolean;
                    primaryTicketName: string | null;
                    regCode: string | null;
                    purchasedAddOns: string[];
                };
            }>('/api/payments/my-purchases', { token }),

        myTickets: (token: string) =>
            fetchAPI<MyTicketsResponse>('/api/payments/my-tickets', { token }),

        preview: (token: string, data: { eventId: number; packageId?: string; addOnIds: string[]; currency: 'THB' | 'USD'; promoCode?: string; paymentMethod?: 'qr' | 'card' | 'alipay' }) =>
            fetchAPI<{
                success: boolean;
                data: {
                    subtotal: number;
                    discountAmount: number;
                    discountType: string | null;
                    discountValue: number | null;
                    netAmount: number;
                    fee: number;
                    total: number;
                    currency: string;
                    chargeCurrency?: string;
                    chargeNet?: number;
                    feeMethod: string;
                    promoValid: boolean;
                    promoError: string | null;
                };
            }>('/api/payments/preview', {
                method: 'POST',
                body: JSON.stringify(data),
                token,
            }),

        createIntent: (token: string, data: {
            eventId: number;
            packageId?: string;
            addOnIds: string[];
            currency: 'THB' | 'USD';
            promoCode?: string;
            paymentMethod?: 'qr' | 'card' | 'alipay';
            workshopSessionId?: number;
            needTaxInvoice?: boolean;
            taxName?: string;
            taxId?: string;
            taxAddress?: string;
            taxSubDistrict?: string;
            taxDistrict?: string;
            taxProvince?: string;
            taxPostalCode?: string;
        }) =>
            fetchAPI<{
                success: boolean;
                data: {
                    redirectForm: {
                        actionUrl: string;
                        method: 'POST';
                        fields: Record<string, string>;
                    };
                    refno: string;
                    orderId: number;
                    orderNumber: string;
                    subtotal: number;
                    discountAmount: number;
                    discountType: string | null;
                    discountValue: number | null;
                    netAmount: number;
                    fee: number;
                    total: number;
                    currency: string;
                    feeMethod: string;
                    paymentChannel: string;
                };
            }>('/api/payments/create-intent', {
                method: 'POST',
                body: JSON.stringify(data),
                token,
            }),

        getStatus: (token: string, orderId: number) =>
            fetchAPI<{
                success: boolean;
                data: {
                    orderId: number;
                    orderNumber: string;
                    orderStatus: string;
                    payment: {
                        status: string;
                        amount: string;
                        paidAt: string | null;
                        stripeReceiptUrl: string | null;
                        paymentChannel: string | null;
                    } | null;
                };
            }>(`/api/payments/${orderId}/status`, { token }),
    },
};

export default api;
