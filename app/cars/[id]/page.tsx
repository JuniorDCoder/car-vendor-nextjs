import CarDetailClient from './CarDetailClient';
import carsData from '@/data/cars.json';

export function generateStaticParams() {
  return carsData.map((car) => ({
    id: car.id,
  }));
}

export default function CarDetailPage({ params }: { params: { id: string } }) {
  return <CarDetailClient id={params.id} />;
}
