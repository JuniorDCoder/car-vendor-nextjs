// app/cars/page.tsx
import { carService } from '@/lib/firestore';
import CarsClient from './CarsClient';

export default async function CarsPage() {
    const { cars } = await carService.getCars(50);

    return <CarsClient initialCars={cars} />;
}