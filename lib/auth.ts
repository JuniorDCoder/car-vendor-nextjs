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

    // Get current user
    getCurrentUser: (): Promise<User | null> => {
        return new Promise((resolve) => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                unsubscribe();
                resolve(user);
            });
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