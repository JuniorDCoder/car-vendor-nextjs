import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import EditCarClient from './EditCarClient';
import { carService } from '@/lib/firestore';

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const car = await carService.getCarById(params.id);

    if (!car) {
        return {
            title: 'Car Not Found - Admin',
        };
    }

    return {
        title: `Edit ${car.make} ${car.model} - Admin`,
    };
}

// Generate static paths for all cars
export async function generateStaticParams() {
    try {
        const { cars } = await carService.getCars(50); // Adjust limit as needed
        return cars.map((car) => ({
            id: car.id!,
        }));
    } catch (error) {
        console.error('Error generating static params:', error);
        return [];
    }
}

// This will be statically generated at build time
export default async function EditCarPage({ params }: { params: { id: string } }) {
    const car = await carService.getCarById(params.id);

    if (!car) {
        notFound();
    }

    return <EditCarClient car={car} />;
}