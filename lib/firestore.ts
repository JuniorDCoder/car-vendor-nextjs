import { db } from "./firebase";
import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    DocumentData,
    QueryDocumentSnapshot,
} from "firebase/firestore";
import { Car, Review } from "@/types";

// Car operations
export const carService = {
    // Add new car
    addCar: async (carData: Omit<Car, 'id'>): Promise<string> => {
        const docRef = await addDoc(collection(db, "cars"), {
            ...carData,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return docRef.id;
    },

    // Get all cars with pagination
    getCars: async (itemsPerPage: number = 50, lastDoc: QueryDocumentSnapshot<DocumentData> | null = null) => {
        let q = query(
            collection(db, "cars"),
            orderBy("createdAt", "desc"),
            limit(itemsPerPage)
        );

        if (lastDoc) {
            q = query(q, startAfter(lastDoc));
        }

        const querySnapshot = await getDocs(q);
        const cars: Car[] = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        } as Car));

        return {
            cars,
            lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1]
        };
    },

    // Get car by ID
    getCarById: async (id: string): Promise<Car | null> => {
        const docSnap = await getDoc(doc(db, "cars", id));
        return docSnap.exists() ? {id: docSnap.id, ...docSnap.data()} as Car : null;
    },

    // Update car
    updateCar: async (id: string, updatedData: Partial<Car>): Promise<void> => {
        const carRef = doc(db, "cars", id);
        await updateDoc(carRef, {
            ...updatedData,
            updatedAt: new Date()
        });
    },

    // Delete car
    deleteCar: async (id: string): Promise<void> => {
        await deleteDoc(doc(db, "cars", id));
    },

    // Get featured cars
    getFeaturedCars: async (): Promise<Car[]> => {
        try {
            const q = query(
                collection(db, "cars"),
                where("isFeatured", "==", true),
                where("status", "==", "available"),
                orderBy("createdAt", "desc"),
                limit(6)
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            } as Car));
        } catch (error) {
            console.error('Error fetching featured cars:', error);
            return [];
        }
    },

}

// Review operations
export const reviewService = {
    // Add new review
    addReview: async (reviewData: Omit<Review, 'id'>): Promise<string> => {
        const docRef = await addDoc(collection(db, "reviews"), {
            ...reviewData,
            createdAt: new Date(),
        });
        return docRef.id;
    },

    // Get all reviews
    getReviews: async (): Promise<Review[]> => {
        const querySnapshot = await getDocs(
            query(collection(db, "reviews"), orderBy("createdAt", "desc"))
        );
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        } as Review));
    },

    // Get reviews by car ID
    getReviewsByCarId: async (carId: string): Promise<Review[]> => {
        try {
            // First get all approved reviews
            const q = query(
                collection(db, "reviews"),
                where("isApproved", "==", true),
                orderBy("createdAt", "desc")
            );

            const querySnapshot = await getDocs(q);
            const allApprovedReviews = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            } as Review));

            // Then filter by carId on the client side
            return allApprovedReviews.filter(review => review.carId === carId);
        } catch (error) {
            console.error('Error fetching reviews by car ID:', error);

            // Fallback: get all reviews and filter
            const allReviews = await reviewService.getReviews();
            return allReviews.filter(review =>
                review.carId === carId && review.isApproved === true
            );
        }
    },
    // Update review
    updateReview: async (id: string, updatedData: Partial<Review>): Promise<void> => {
        const reviewRef = doc(db, "reviews", id);
        await updateDoc(reviewRef, updatedData);
    },

    // Delete review
    deleteReview: async (id: string): Promise<void> => {
        await deleteDoc(doc(db, "reviews", id));
    },

    getReviewById: async (id: string): Promise<Review | null> => {
        const docSnap = await getDoc(doc(db, "reviews", id));
        return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Review : null;
    },
};