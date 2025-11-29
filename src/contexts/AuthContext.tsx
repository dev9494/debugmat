import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    type User,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../lib/firebase';
import { useUserStore } from '../stores/userStore';
import { createUserProfile } from '../lib/firestore';

interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const { login: storeLogin, logout: storeLogout } = useUserStore();

    useEffect(() => {
        if (!isFirebaseConfigured || !auth) {
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);

            if (user) {
                // Create/Update user profile in Firestore
                await createUserProfile(user);

                // Sync with local user store
                storeLogin('firebase-token', {
                    username: user.displayName || user.email?.split('@')[0] || 'User',
                    avatar: user.photoURL || undefined,
                    email: user.email || undefined
                });
            } else {
                storeLogout();
            }

            setLoading(false);
        });

        return unsubscribe;
    }, [storeLogin, storeLogout]);

    const signInWithGoogle = async () => {
        if (!isFirebaseConfigured || !auth) {
            alert("Firebase is not configured. Please add your API keys to the .env file.");
            return;
        }
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Error signing in with Google", error);
            throw error;
        }
    };

    const logout = async () => {
        if (!isFirebaseConfigured || !auth) return;
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out", error);
            throw error;
        }
    };

    const value = {
        currentUser,
        loading,
        signInWithGoogle,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
