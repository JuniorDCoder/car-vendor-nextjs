export interface Car {
    id?: string;
    make: string;
    model: string;
    year: number;
    price: number;
    downPayment?: number;
    mileage: number;
    fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
    transmission: 'manual' | 'automatic';
    bodyType: 'sedan' | 'suv' | 'hatchback' | 'coupe' | 'convertible' | 'estate';
    color: string;
    description: string;
    features: string[];
    images: string[];
    status: 'available' | 'sold' | 'pending';
    isFeatured: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Review {
    id?: string;
    customerName: string;
    rating: number;
    comment: string;
    carId?: string;
    isApproved: boolean;
    createdAt?: Date;
}

export interface CarFormData extends Omit<Car, 'id' | 'createdAt' | 'updatedAt'> {
    id?: string;
}

export interface AdminUser {
    uid: string;
    email: string;
    displayName?: string;
}

export interface CloudinaryUploadResult {
    public_id: string;
    secure_url: string;
    width: number;
    height: number;
}