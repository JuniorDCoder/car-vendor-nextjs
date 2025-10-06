// app/cars/[id]/CarDetailWrapper.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CarDetailClient from './CarDetailClient';
import { carService } from '@/lib/firestore';
import { Car } from '@/types';
import { Loader, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface CarDetailWrapperProps {
    carId: string;
    initialCar: Car | null;
}

export default function CarDetailWrapper({ carId, initialCar }: CarDetailWrapperProps) {
    const router = useRouter();
    const [car, setCar] = useState<Car | null>(initialCar);
    const [loading, setLoading] = useState(!initialCar);
    const [error, setError] = useState(false);

    useEffect(() => {
        // If we have initial data, use it and optionally refresh in background
        if (initialCar) {
            setCar(initialCar);
            setLoading(false);
            return;
        }

        // If no initial data (new car not in static build), fetch it
        async function loadCar() {
            try {
                setLoading(true);
                setError(false);

                const carData = await carService.getCarById(carId);

                if (!carData) {
                    setError(true);
                } else {
                    setCar(carData);

                    // Update document title for SEO
                    document.title = `${carData.make} ${carData.model} ${carData.year} - Paul's Auto`;
                }
            } catch (err) {
                console.error('Error loading car:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        loadCar();
    }, [carId, initialCar]);

    // Loading state (only for new cars not in static build)
    if (loading) {
        return (
            <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-12 h-12 text-[#D32F2F] animate-spin mx-auto mb-4" />
                    <p className="text-xl text-gray-600">Loading vehicle details...</p>
                    <p className="text-sm text-gray-500 mt-2">Please wait</p>
                </div>
            </div>
        );
    }

    // Error/Not found state
    if (error || !car) {
        return (
            <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <AlertCircle className="w-16 h-16 text-[#D32F2F] mx-auto mb-4" />
                    <h1 className="text-4xl font-bold text-[#001F3F] mb-4">Vehicle Not Found</h1>
                    <p className="text-gray-600 mb-6">
                        The vehicle you're looking for doesn't exist or may have been removed.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link
                            href="/cars"
                            className="bg-[#D32F2F] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#B71C1C] transition-colors inline-block"
                        >
                            Browse All Cars
                        </Link>
                        <button
                            onClick={() => router.back()}
                            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-300 transition-colors"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Render the car detail component
    return <CarDetailClient car={car} />;
}