const API_URL = '/api/v1';

interface ApiErrorDetail {
    msg?: string;
    message?: string;
}

export interface RegisterData {
    email: string;
    password: string;
    [key: string]: unknown;
}

interface CaseData {
    title: string;
    description: string;
}

interface MessageData {
    receiver_id: string;
    subject: string;
    body: string;
}

interface ProfileData {
    first_name?: string;
    last_name?: string;
    [key: string]: unknown;
}

interface PasswordChangeData {
    current_password: string;
    new_password: string;
}


const getErrorMessage = (errorData: unknown, fallback: string) => {
    const detail = (errorData as { detail?: string | ApiErrorDetail[] | Record<string, unknown> })?.detail;
    if (!detail) return fallback;
    if (typeof detail === 'string') return detail;

    if (Array.isArray(detail)) {
        const parts = detail
            .map((d: unknown) => {
                const msg = (d as ApiErrorDetail)?.msg ?? (d as ApiErrorDetail)?.message;
                if (typeof msg === 'string' && msg) return msg;
                return JSON.stringify(d);
            })
            .filter(Boolean);
        return parts.join('; ') || fallback;
    }

    if (typeof detail === 'object') {
        try {
            return JSON.stringify(detail);
        } catch {
            return fallback;
        }
    }

    return String(detail);
};

export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(getErrorMessage(errorData, 'Something went wrong'));
    }

    return response.json();
};

export const authApi = {
    login: (loginData: { email: string, password: string }) => {
        const body = new URLSearchParams();
        body.append('username', loginData.email);
        body.append('password', loginData.password);

        return fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body,
        }).then(res => {
            if (!res.ok) return res.json().then(err => { throw new Error(getErrorMessage(err, 'Login failed')) });
            return res.json();
        });
    },
    register: (userData: RegisterData) => apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    }),
    getMe: () => apiCall('/users/me'),
    forgotPassword: (email: string) => apiCall('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
    }),
};

export const casesApi = {
    list: () => apiCall('/cases/'),
    get: (id: string) => apiCall(`/cases/${id}`),
    create: (data: CaseData) => apiCall('/cases/', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    uploadDocument: (id: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const token = localStorage.getItem('token');
        return fetch(`${API_URL}/cases/${id}/documents`, {
            method: 'POST',
            body: formData,
            headers: {
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
        }).then(res => {
             if (!res.ok) return res.json().then(err => { throw new Error(getErrorMessage(err, 'Upload failed')) });
             return res.json();
        });
    },
};

export const messagesApi = {
    list: () => apiCall('/messages/'),
    send: (data: MessageData) => apiCall('/messages/', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    markRead: (id: string) => apiCall(`/messages/${id}/read`, {
        method: 'POST',
    }),
};

export const usersApi = {
    updateProfile: (data: ProfileData) => apiCall('/users/me', {
        method: 'PATCH',
        body: JSON.stringify(data),
    }),
    changePassword: (data: PasswordChangeData) => apiCall('/users/change-password', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
};

export const notificationsApi = {
    list: () => apiCall('/notifications/'),
    markRead: (id: string) => apiCall(`/notifications/${id}/read`, {
        method: 'POST',
    }),
};
