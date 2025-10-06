'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
    Car,
    Plus,
    Edit,
    Trash2,
    Eye,
    Search,
    Filter,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { carService } from '@/lib/firestore';
import { authService } from '@/lib/auth';
import { Car as CarType } from '@/types';
import toast from 'react-hot-toast';

export default function CarsPage() {
    const router = useRouter();
    const [cars, setCars] = useState<CarType[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    useEffect(() => {
        checkAuth();
        loadCars();
    }, []);

    const checkAuth = async () => {
        try {
            const user = await authService.getCurrentUser();
            if (!user) {
                router.push('/admin/login');
                return;
            }
            const isAdmin = await authService.isAdmin(user);
            if (!isAdmin) {
                router.push('/admin/login');
                return;
            }
        } catch (error) {
            router.push('/admin/login');
        }
    };

    const loadCars = async () => {
        try {
            const { cars } = await carService.getCars();
            setCars(cars);
        } catch (error) {
            toast.error('Error loading cars');
            console.error('Error loading cars:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCar = async (carId: string, carName: string) => {
        if (!confirm(`Are you sure you want to delete ${carName}?`)) return;

        try {
            await carService.deleteCar(carId);
            setCars(cars.filter(car => car.id !== carId));
            toast.success('Car deleted successfully');
        } catch (error) {
            toast.error('Error deleting car');
            console.error('Error deleting car:', error);
        }
    };

    const filteredCars = cars.filter(car => {
        const matchesSearch = car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
            car.model.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || car.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#D32F2F]"></div>
            </div>
        );
    }

    return (
        <div className="pt-20 min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-[#001F3F] mb-2">Manage Cars</h1>
                        <p className="text-gray-600">Add, edit, and manage your car inventory</p>
                    </div>
                    <Link
                        href="/admin/cars/new"
                        className="flex items-center gap-2 bg-[#D32F2F] text-white px-6 py-3 rounded-lg hover:bg-[#B71C1C] transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Add New Car
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search cars by make or model..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent"
                            />
                        </div>
                        <div className="flex gap-4">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent"
                            >
                                <option value="all">All Status</option>
                                <option value="available">Available</option>
                                <option value="sold">Sold</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Cars Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCars.map((car, index) => (
                        <motion.div
                            key={car.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                        >
                            {/* Image */}
                            <div className="relative h-48">
                                <Image
                                    src={car.images[0] || '/placeholder-car.jpg'}
                                    alt={`${car.make} ${car.model}`}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-3 right-3 flex gap-2">
                                    {car.isFeatured && (
                                        <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Featured
                    </span>
                                    )}
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                        car.status === 'available' ? 'bg-green-500 text-white' :
                                            car.status === 'sold' ? 'bg-red-500 text-white' :
                                                'bg-yellow-500 text-white'
                                    }`}>
                    {car.status}
                  </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-[#001F3F] mb-2">
                                    {car.make} {car.model}
                                </h3>
                                <p className="text-2xl font-bold text-[#D32F2F] mb-3">
                                    £{car.price.toLocaleString()}
                                </p>

                                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                                    <div>Year: {car.year}</div>
                                    <div>Mileage: {car.mileage.toLocaleString()} mi</div>
                                    <div>Fuel: {car.fuelType}</div>
                                    <div>Trans: {car.transmission}</div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <Link
                                        href={`/cars/${car.id}`}
                                        className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        <Eye className="w-4 h-4" />
                                        View
                                    </Link>
                                    <Link
                                        href={`/admin/cars/edit/${car.id}`}
                                        className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDeleteCar(car.id!, `${car.make} ${car.model}`)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredCars.length === 0 && (
                    <div className="text-center py-12">
                        <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No cars found</h3>
                        <p className="text-gray-500 mb-4">
                            {searchTerm || statusFilter !== 'all'
                                ? 'Try adjusting your search filters'
                                : 'Get started by adding your first car'
                            }
                        </p>
                        <Link
                            href="/admin/cars/new"
                            className="inline-flex items-center gap-2 bg-[#D32F2F] text-white px-6 py-3 rounded-lg hover:bg-[#B71C1C] transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Add New Car
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}