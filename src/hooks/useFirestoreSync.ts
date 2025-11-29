import { useEffect, useRef } from 'react';
import { doc, onSnapshot, collection, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useErrorStore, type ErrorHistoryItem } from '../stores/errorStore';
import { useUserStore } from '../stores/userStore';
import { useGamificationStore } from '../stores/gamificationStore';
import { updateUserStats } from '../lib/firestore';

export const useFirestoreSync = () => {
    const { currentUser } = useAuth();
    const { setHistory } = useErrorStore();
    const { login, upgradeTier } = useUserStore();
    const { setStats, stats } = useGamificationStore();

    // Ref to track if the update is coming from Firestore to avoid loops
    const isRemoteUpdate = useRef(false);

    useEffect(() => {
        if (!currentUser) return;

        // Sync User Profile & Stats (Firestore -> Local)
        const userDocRef = doc(db, 'users', currentUser.uid);
        const unsubscribeUser = onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data();

                // Sync Tier
                if (data.tier) upgradeTier(data.tier);

                // Sync Gamification Stats
                if (data.stats) {
                    isRemoteUpdate.current = true;
                    setStats(data.stats);
                    // Reset flag after a short delay to allow state to settle
                    setTimeout(() => { isRemoteUpdate.current = false; }, 100);
                }
            }
        });

        // Sync Error History (Firestore -> Local)
        const errorsQuery = query(
            collection(db, 'errors'),
            where('userId', '==', currentUser.uid),
            orderBy('timestamp', 'desc')
        );

        const unsubscribeErrors = onSnapshot(errorsQuery, (snapshot) => {
            const history: ErrorHistoryItem[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                history.push({
                    id: doc.id,
                    ...data
                } as ErrorHistoryItem);
            });
            setHistory(history);
        });

        return () => {
            unsubscribeUser();
            unsubscribeErrors();
        };
    }, [currentUser, setHistory, upgradeTier, setStats]);

    // Sync Gamification Stats (Local -> Firestore)
    useEffect(() => {
        if (!currentUser || isRemoteUpdate.current) return;

        const timeoutId = setTimeout(() => {
            updateUserStats(currentUser.uid, stats);
        }, 2000); // Debounce updates by 2 seconds

        return () => clearTimeout(timeoutId);
    }, [stats, currentUser]);
};
