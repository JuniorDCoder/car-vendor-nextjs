// app/cars/[id]/page.tsx (Server Component)
import { notFound } from 'next/navigation';
import CarDetailWrapper from './CarDetailWrapper';
import { carService } from '@/lib/firestore';

// Generate static params for build time
export async function generateStaticParams() {
    try {
        const { cars } = await carService.getCars(50);
        return cars.map((car) => ({
            id: car.id!,
        }));
    } catch (error) {
        console.error('Error generating static params:', error);
        return [];
    }
}

// Server component that fetches initial data
export default async function CarDetailPage({ params }: { params: { id: string } }) {
    // Try to fetch car data server-side for SEO
    let initialCar = null;

    try {
        initialCar = await carService.getCarById(params.id);
    } catch (error) {
        console.error('Error fetching car:', error);
    }

    // Pass the car ID and initial data to client component
    return <CarDetailWrapper carId={params.id} initialCar={initialCar} />;
}