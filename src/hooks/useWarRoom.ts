import { useEffect, useState } from 'react';
import {
    doc,
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
    setDoc,
    deleteDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export interface ChatMessage {
    id: string;
    text: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    timestamp: any;
}

export interface ActiveUser {
    userId: string;
    userName: string;
    userAvatar?: string;
    lastActive: any;
}

export const useWarRoom = (errorId: string | null) => {
    const { currentUser } = useAuth();
    const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!errorId || !currentUser) return;

        setLoading(true);

        // 1. Presence System: Register as active user
        const userRef = doc(db, `errors/${errorId}/activeUsers/${currentUser.uid}`);

        // Set initial presence
        setDoc(userRef, {
            userId: currentUser.uid,
            userName: currentUser.displayName || 'Anonymous',
            userAvatar: currentUser.photoURL,
            lastActive: serverTimestamp()
        });

        // Keep alive heartbeat
        const heartbeat = setInterval(() => {
            setDoc(userRef, {
                lastActive: serverTimestamp()
            }, { merge: true });
        }, 30000);

        // Listen for active users
        const usersQuery = collection(db, `errors/${errorId}/activeUsers`);
        const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
            const users: ActiveUser[] = [];
            const now = Date.now();

            snapshot.forEach((doc) => {
                const data = doc.data();
                // Filter out users inactive for > 2 minutes
                // Note: Firestore timestamp needs conversion
                const lastActive = data.lastActive?.toMillis?.() || 0;
                if (now - lastActive < 2 * 60 * 1000) {
                    users.push(data as ActiveUser);
                }
            });
            setActiveUsers(users);
        });

        // 2. Chat System: Listen for messages
        const messagesQuery = query(
            collection(db, `errors/${errorId}/messages`),
            orderBy('timestamp', 'asc')
        );

        const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
            const msgs: ChatMessage[] = [];
            snapshot.forEach((doc) => {
                msgs.push({ id: doc.id, ...doc.data() } as ChatMessage);
            });
            setMessages(msgs);
            setLoading(false);
        });

        // Cleanup: Remove presence on unmount
        return () => {
            clearInterval(heartbeat);
            deleteDoc(userRef);
            unsubscribeUsers();
            unsubscribeMessages();
        };
    }, [errorId, currentUser]);

    const sendMessage = async (text: string) => {
        if (!errorId || !currentUser || !text.trim()) return;

        await addDoc(collection(db, `errors/${errorId}/messages`), {
            text,
            userId: currentUser.uid,
            userName: currentUser.displayName || 'Anonymous',
            userAvatar: currentUser.photoURL,
            timestamp: serverTimestamp()
        });
    };

    return { activeUsers, messages, sendMessage, loading };
};
