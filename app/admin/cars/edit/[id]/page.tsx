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

export default async function EditCarPage({ params }: { params: { id: string } }) {
    const car = await carService.getCarById(params.id);

    if (!car) {
        notFound();
    }

    return <EditCarClient car={car} />;
}