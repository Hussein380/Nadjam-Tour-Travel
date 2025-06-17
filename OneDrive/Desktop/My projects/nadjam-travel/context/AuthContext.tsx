'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextValue {
    user: User | null;
    loading: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue>({
    user: null,
    loading: true,
    isAdmin: false
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setLoading(true);
            if (currentUser) {
                setUser(currentUser);
                // Get the ID token result which contains custom claims
                const idTokenResult = await currentUser.getIdTokenResult();
                // Check for the 'isAdmin' custom claim
                const userIsAdmin = !!idTokenResult.claims.isAdmin;
                setIsAdmin(userIsAdmin);
                console.log('AuthProvider: User authenticated.', { email: currentUser.email, isAdmin: userIsAdmin });
            } else {
                setUser(null);
                setIsAdmin(false);
                console.log('AuthProvider: User signed out.');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, isAdmin }}>
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