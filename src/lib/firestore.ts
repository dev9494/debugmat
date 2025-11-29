import {
    collection,
    doc,
    setDoc,
    addDoc,
    deleteDoc,
    updateDoc,
    serverTimestamp,
    getDoc
} from 'firebase/firestore';
import { db } from './firebase';
import type { ErrorHistoryItem, ErrorAnalysis } from '../stores/errorStore';

export const saveErrorToFirestore = async (userId: string, error: ErrorHistoryItem) => {
    try {
        const errorRef = doc(db, 'errors', error.id);
        await setDoc(errorRef, {
            ...error,
            userId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
    } catch (err) {
        console.error("Error saving to Firestore:", err);
        throw err;
    }
};

export const deleteErrorFromFirestore = async (errorId: string) => {
    try {
        await deleteDoc(doc(db, 'errors', errorId));
    } catch (err) {
        console.error("Error deleting from Firestore:", err);
        throw err;
    }
};

export const createUserProfile = async (user: any) => {
    try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            await setDoc(userRef, {
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                createdAt: serverTimestamp(),
                tier: 'free',
                settings: {
                    theme: 'system',
                    notifications: true
                }
            });
        }
    } catch (err) {
        console.error("Error creating user profile:", err);
        throw err;
    }
};

export const updateUserStats = async (userId: string, stats: any) => {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            stats,
            updatedAt: serverTimestamp()
        });
    } catch (err) {
        console.error("Error updating stats:", err);
    }
};
