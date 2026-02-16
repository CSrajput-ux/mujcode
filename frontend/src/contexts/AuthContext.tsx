import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    isPasswordChanged: boolean;
    isApproved: boolean;
    department?: string;
    section?: string;
    branch?: string;
    year?: string;
    semester?: string;
    course?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (userData: User, token?: string) => void;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch current user from /auth/me on mount
    const fetchUser = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = sessionStorage.getItem('token');
            const headers: HeadersInit = {
                'Content-Type': 'application/json'
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch('http://localhost:5000/api/auth/me', {
                method: 'GET',
                credentials: 'include', // Keep cookies for fallback
                headers: headers
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                // Token invalid or expired
                sessionStorage.removeItem('token');
                setUser(null);
            }
        } catch (err) {
            console.error('Failed to fetch user:', err);
            setUser(null);
            setError('Failed to fetch user data');
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch on mount
    useEffect(() => {
        fetchUser();
    }, []);

    // Login handler (called after successful login)
    const login = (userData: User, token?: string) => {
        if (token) {
            sessionStorage.setItem('token', token);
        }
        setUser(userData);
        setError(null);
    };

    // Logout handler
    const logout = async () => {
        try {
            sessionStorage.removeItem('token'); // Clear session token

            await fetch('http://localhost:5000/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });

            setUser(null);
            // Redirect to login
            window.location.href = '/login';
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    // Refresh user data
    const refreshUser = async () => {
        await fetchUser();
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
