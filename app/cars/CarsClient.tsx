'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import AOS from 'aos';
import { ArrowRight, Filter, Loader, RefreshCw } from 'lucide-react';
import { carService } from '@/lib/firestore';
import { Car } from '@/types';
import toast from 'react-hot-toast';


interface CarsClientProps {
    initialCars: Car[];
}

export default function CarsClient({ initialCars }: CarsClientProps) {
    const [cars, setCars] = useState<Car[]>(initialCars);
    const [filteredCars, setFilteredCars] = useState<Car[]>(initialCars);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
    const [filters, setFilters] = useState({
        make: '',
        minPrice: '',
        maxPrice: '',
        fuelType: '',
        status: 'available',
    });

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });

        // Set up real-time listener for cars
        const unsubscribe = carService.subscribeToCars((freshCars) => {
            setCars(freshCars);
            setFilteredCars(freshCars);
            setLastRefresh(new Date());
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const refreshCars = async () => {
        try {
            setRefreshing(true);
            const { cars: freshCars } = await carService.getCars(50);
            setCars(freshCars);
            setFilteredCars(freshCars);
            setLastRefresh(new Date());
            toast.success('Cars list updated');
        } catch (error) {
            console.error('Error refreshing cars:', error);
            toast.error('Failed to refresh cars');
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        let filtered = [...cars];

        if (filters.make) {
            filtered = filtered.filter(car =>
                car.make.toLowerCase().includes(filters.make.toLowerCase())
            );
        }

        if (filters.fuelType) {
            filtered = filtered.filter(car => car.fuelType === filters.fuelType);
        }

        if (filters.status) {
            filtered = filtered.filter(car => car.status === filters.status);
        }

        if (filters.minPrice) {
            filtered = filtered.filter(car => car.price >= parseInt(filters.minPrice));
        }

        if (filters.maxPrice) {
            filtered = filtered.filter(car => car.price <= parseInt(filters.maxPrice));
        }

        setFilteredCars(filtered);
    }, [filters, cars]);

    const makes = Array.from(new Set(cars.map(car => car.make))).sort();
    const fuelTypes = Array.from(new Set(cars.map(car => car.fuelType))).sort();

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            make: '',
            minPrice: '',
            maxPrice: '',
            fuelType: '',
            status: 'available',
        });
    };

    return (
        <div className="pt-20 min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-[#001F3F] to-[#003366] text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">
                            Browse Our <span className="text-[#D32F2F]">Collection</span>
                        </h1>
                        <p className="text-xl text-[#C0C0C0]">
                            Find your perfect vehicle from our premium selection
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Refresh Button */}
                <div className="flex justify-end mb-4">
                    <button
                        onClick={refreshCars}
                        disabled={refreshing}
                        className="flex items-center gap-2 bg-[#001F3F] text-white px-4 py-2 rounded-lg hover:bg-[#003366] transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        {refreshing ? 'Refreshing...' : 'Refresh'}
                    </button>
                </div>

                {/* Filters Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8" data-aos="fade-up">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-[#001F3F] flex items-center">
                            <Filter className="w-6 h-6 mr-2 text-[#D32F2F]" />
                            Filters
                        </h2>
                        <div className="flex items-center gap-4">
                            {lastRefresh && (
                                <span className="text-sm text-gray-500">
                                    Last updated: {lastRefresh.toLocaleTimeString()}
                                </span>
                            )}
                            <button
                                onClick={clearFilters}
                                className="text-[#D32F2F] hover:text-[#B71C1C] font-semibold transition-colors"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Make
                            </label>
                            <select
                                value={filters.make}
                                onChange={(e) => handleFilterChange('make', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent"
                            >
                                <option value="">All Makes</option>
                                {makes.map(make => (
                                    <option key={make} value={make}>{make}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Fuel Type
                            </label>
                            <select
                                value={filters.fuelType}
                                onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent"
                            >
                                <option value="">All Types</option>
                                {fuelTypes.map(type => (
                                    <option key={type} value={type}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent"
                            >
                                <option value="available">Available</option>
                                <option value="pending">Pending</option>
                                <option value="sold">Sold</option>
                                <option value="">All Status</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Min Price (£)
                            </label>
                            <input
                                type="number"
                                value={filters.minPrice}
                                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                placeholder="0"
                                min="0"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Max Price (£)
                            </label>
                            <input
                                type="number"
                                value={filters.maxPrice}
                                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                placeholder="100000"
                                min="0"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-6 text-gray-600">
                    Showing <span className="font-semibold text-[#D32F2F]">{filteredCars.length}</span> {filteredCars.length === 1 ? 'vehicle' : 'vehicles'}
                    {filters.status === 'available' && ' (Available)'}
                </div>

                {/* Cars Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCars.map((car, index) => (
                        <Link
                            key={car.id}
                            href={`/cars/${car.id}`}
                            data-aos="fade-up"
                            data-aos-delay={index * 50}
                        >
                            <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                                {/* Image */}
                                <div className="relative h-64 overflow-hidden">
                                    {car.images && car.images.length > 0 ? (
                                        <Image
                                            src={car.images[0]}
                                            alt={`${car.make} ${car.model}`}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-500">No Image</span>
                                        </div>
                                    )}

                                    {/* Status Badge */}
                                    <div className={`absolute top-4 right-4 text-white px-3 py-1 rounded-full text-sm font-semibold ${
                                        car.status === 'available' ? 'bg-green-500' :
                                            car.status === 'pending' ? 'bg-yellow-500' :
                                                'bg-red-500'
                                    }`}>
                                        {car.status?.charAt(0).toUpperCase() + car.status?.slice(1)}
                                    </div>

                                    {/* Featured Badge */}
                                    {car.isFeatured && (
                                        <div className="absolute top-4 left-4 bg-[#D32F2F] text-white px-3 py-1 rounded-full text-sm font-semibold">
                                            Featured
                                        </div>
                                    )}

                                    {/* Fuel Type Badge */}
                                    <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                                        {car.fuelType?.charAt(0).toUpperCase() + car.fuelType?.slice(1)}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold text-[#001F3F] mb-2">
                                        {car.make} {car.model}
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        {car.year} • {car.mileage?.toLocaleString()} miles • {car.transmission?.charAt(0).toUpperCase() + car.transmission?.slice(1)}
                                    </p>

                                    {/* Features Preview */}
                                    {car.features && car.features.length > 0 && (
                                        <div className="mb-4">
                                            <div className="flex flex-wrap gap-1">
                                                {car.features.slice(0, 3).map((feature, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                                                    >
                                                        {feature}
                                                    </span>
                                                ))}
                                                {car.features.length > 3 && (
                                                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                                        +{car.features.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <span className="text-3xl font-bold text-[#D32F2F]">
                                            £{car.price?.toLocaleString()}
                                        </span>
                                        <span className="text-[#001F3F] group-hover:text-[#D32F2F] transition-colors flex items-center">
                                            View Details <ArrowRight className="w-4 h-4 ml-1" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* No Results */}
                {filteredCars.length === 0 && (
                    <div className="text-center py-20" data-aos="fade-up">
                        <div className="text-gray-400 mb-4">
                            <Filter className="w-16 h-16 mx-auto" />
                        </div>
                        <p className="text-xl text-gray-600 mb-4">No vehicles found matching your criteria</p>
                        <p className="text-gray-500 mb-6">
                            Try adjusting your filters or browse all available vehicles
                        </p>
                        <button
                            onClick={clearFilters}
                            className="bg-[#D32F2F] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#B71C1C] transition-colors"
                        >
                            Clear Filters & Show All
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}