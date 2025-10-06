import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User
} from "firebase/auth";
import { auth } from "./firebase";

export const authService = {
    // Admin login
    login: async (email: string, password: string): Promise<User> => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    },

    // Logout
    logout: async (): Promise<void> => {
        await signOut(auth);
    },

    // Enhanced getCurrentUser with timeout
    getCurrentUser: (): Promise<User | null> => {
        return new Promise((resolve) => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                unsubscribe();
                resolve(user);
            });

            // Timeout after 10 seconds
            setTimeout(() => {
                unsubscribe();
                resolve(null);
            }, 10000);
        });
    },

    // Check if user is admin (you can add custom claims in Firebase)
    isAdmin: async (user: User): Promise<boolean> => {
        // You can implement custom logic here, like checking Firestore for admin role
        // const allowedDomains = ['paulsauto.co.uk'];
        // return allowedDomains.some(domain => user.email?.endsWith(domain));

        return true;
    }
};