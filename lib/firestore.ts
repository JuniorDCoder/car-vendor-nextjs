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
    QueryDocumentSnapshot, onSnapshot,
    Timestamp,
    writeBatch,
    setDoc,
} from "firebase/firestore";
import { Car, Review, ScreenshotReview, SiteSettings } from "@/types";

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
    getCars: async (itemsPerPage: number = 500, lastDoc: QueryDocumentSnapshot<DocumentData> | null = null) => {
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

    subscribeToCars: (callback: (cars: Car[]) => void) => {
        const q = query(
            collection(db, 'cars'),
            orderBy('createdAt', 'desc'),
            limit(500)
        );

        return onSnapshot(q, (querySnapshot) => {
            const cars: Car[] = [];
            querySnapshot.forEach((doc) => {
                cars.push({ id: doc.id, ...doc.data() } as Car);
            });
            callback(cars);
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
    // Add new review with custom createdAt
    addReview: async (reviewData: Omit<Review, 'id'> & { createdAt?: Date }): Promise<string> => {
        const docRef = await addDoc(collection(db, "reviews"), {
            ...reviewData,
            createdAt: reviewData.createdAt || new Date(),
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

    // Update review with custom createdAt
    updateReview: async (id: string, updatedData: Partial<Review> & { createdAt?: Date }): Promise<void> => {
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


// Screenshot reviews: images of real customer messages, shown in the order the admin sets
const SCREENSHOT_REVIEWS = "screenshotReviews";

export const screenshotReviewService = {
    // All screenshots, in display order (admin view)
    getAll: async (): Promise<ScreenshotReview[]> => {
        const snapshot = await getDocs(query(collection(db, SCREENSHOT_REVIEWS), orderBy("order", "asc")));
        return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as ScreenshotReview));
    },

    // Published screenshots only, in display order (public pages).
    // Filtered client-side so no composite Firestore index is needed.
    getPublished: async (max?: number): Promise<ScreenshotReview[]> => {
        const all = await screenshotReviewService.getAll();
        const published = all.filter((review) => review.isPublished);
        return max ? published.slice(0, max) : published;
    },

    // Adds new screenshots after the existing ones, keeping the upload order
    addMany: async (items: Omit<ScreenshotReview, 'id' | 'order' | 'createdAt'>[], startOrder: number): Promise<void> => {
        const batch = writeBatch(db);
        items.forEach((item, index) => {
            batch.set(doc(collection(db, SCREENSHOT_REVIEWS)), {
                ...item,
                order: startOrder + index,
                createdAt: new Date(),
            });
        });
        await batch.commit();
    },

    update: async (id: string, data: Partial<Omit<ScreenshotReview, 'id'>>): Promise<void> => {
        await updateDoc(doc(db, SCREENSHOT_REVIEWS, id), data);
    },

    // Persists a new display order: position in the array becomes the `order` value
    reorder: async (orderedIds: string[]): Promise<void> => {
        const batch = writeBatch(db);
        orderedIds.forEach((id, index) => batch.update(doc(db, SCREENSHOT_REVIEWS, id), { order: index }));
        await batch.commit();
    },

    delete: async (id: string): Promise<void> => {
        await deleteDoc(doc(db, SCREENSHOT_REVIEWS, id));
    },
};

// Site-wide settings editable from the admin panel (e.g. the homepage photo)
const SETTINGS_DOC = doc(db, "settings", "site");

export const siteSettingsService = {
    get: async (): Promise<SiteSettings> => {
        const snap = await getDoc(SETTINGS_DOC);
        return snap.exists() ? (snap.data() as SiteSettings) : {};
    },

    update: async (data: Partial<SiteSettings>): Promise<void> => {
        await setDoc(SETTINGS_DOC, { ...data, updatedAt: new Date() }, { merge: true });
    },
};
