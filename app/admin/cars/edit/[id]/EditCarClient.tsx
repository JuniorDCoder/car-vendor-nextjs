'use client';

import { Car } from '@/types';
import CarForm from "@/components/sections/CarForm";

interface EditCarClientProps {
    car: Car;
}

export default function EditCarClient({ car }: EditCarClientProps) {
    return <CarForm car={car} isEdit />;
}