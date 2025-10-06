'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Car, MessageSquare, Star, TrendingUp, LogOut, Mail } from 'lucide-react';
import { authService } from '@/lib/auth';
import { carService } from '@/lib/firestore';
import { reviewService } from '@/lib/firestore';
import { Car as CarType, Review } from '@/types';

export default function AdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false); // Changed to false since layout handles auth
    const [cars, setCars] = useState<CarType[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [stats, setStats] = useState({
        totalCars: 0,
        availableCars: 0,
        soldCars: 0,
        totalReviews: 0,
        unreadMessages: 0,
    });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);
            const [carsData, reviewsData] = await Promise.all([
                carService.getCars(),
                reviewService.getReviews()
            ]);

            setCars(carsData.cars);
            setReviews(reviewsData);

            const availableCars = carsData.cars.filter(car => car.status === 'available').length;
            const soldCars = carsData.cars.filter(car => car.status === 'sold').length;
            const approvedReviews = reviewsData.filter(review => review.isApproved).length;

            setStats({
                totalCars: carsData.cars.length,
                availableCars,
                soldCars,
                totalReviews: approvedReviews,
                unreadMessages: 0,
            });
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
            router.push('/admin/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#D32F2F]"></div>
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Cars',
            value: stats.totalCars,
            icon: <Car className="w-8 h-8" />,
            color: 'bg-blue-500',
            link: '/admin/cars',
        },
        {
            title: 'Available Cars',
            value: stats.availableCars,
            icon: <Car className="w-8 h-8" />,
            color: 'bg-green-500',
            link: '/admin/cars?filter=available',
        },
        {
            title: 'Cars Sold',
            value: stats.soldCars,
            icon: <TrendingUp className="w-8 h-8" />,
            color: 'bg-[#D32F2F]',
            link: '/admin/cars?filter=sold',
        },
        {
            title: 'Customer Reviews',
            value: stats.totalReviews,
            icon: <Star className="w-8 h-8" />,
            color: 'bg-yellow-500',
            link: '/admin/reviews',
        },
        {
            title: 'Contact Messages',
            value: stats.unreadMessages > 0 ? `${stats.unreadMessages} new` : 'View',
            icon: <Mail className="w-8 h-8" />,
            color: 'bg-purple-500',
            link: '/admin/contacts',
        },
    ];

    return (
        <div className="pt-20 min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-[#001F3F] mb-2">Admin Dashboard</h1>
                        <p className="text-gray-600">Manage your car dealership</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-[#D32F2F] text-white px-6 py-3 rounded-lg hover:bg-[#B71C1C] transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    {statCards.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={stat.link}>
                                <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer h-full">
                                    <div className={`${stat.color} text-white w-16 h-16 rounded-lg flex items-center justify-center mb-4`}>
                                        {stat.icon}
                                    </div>
                                    <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                                    <p className="text-2xl font-bold text-[#001F3F]">{stat.value}</p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-[#001F3F] mb-6">Quick Actions</h2>
                        <div className="space-y-3">
                            <Link
                                href="/admin/cars/new"
                                className="block w-full bg-[#D32F2F] text-white px-6 py-4 rounded-lg hover:bg-[#B71C1C] transition-colors text-center font-semibold"
                            >
                                Add New Car
                            </Link>
                            <Link
                                href="/admin/cars"
                                className="block w-full bg-[#001F3F] text-white px-6 py-4 rounded-lg hover:bg-[#003366] transition-colors text-center font-semibold"
                            >
                                Manage Cars
                            </Link>
                            <Link
                                href="/admin/reviews"
                                className="block w-full bg-yellow-500 text-white px-6 py-4 rounded-lg hover:bg-yellow-600 transition-colors text-center font-semibold"
                            >
                                Manage Reviews
                            </Link>
                            <Link
                                href="/admin/contacts"
                                className="block w-full bg-purple-500 text-white px-6 py-4 rounded-lg hover:bg-purple-600 transition-colors text-center font-semibold"
                            >
                                View Messages
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-[#001F3F] mb-6">Recent Activity</h2>
                        <div className="space-y-4">
                            {cars.slice(0, 3).map((car) => (
                                <div key={car.id} className="border-l-4 border-[#D32F2F] pl-4 py-2">
                                    <p className="font-semibold text-[#001F3F]">
                                        {car.make} {car.model} ({car.year})
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        £{car.price?.toLocaleString()} • {car.status}
                                        {car.isFeatured && (
                                            <span className="ml-2 bg-[#D32F2F] text-white px-2 py-1 rounded text-xs">
                                                Featured
                                            </span>
                                        )}
                                    </p>
                                </div>
                            ))}
                            {reviews.slice(0, 2).map((review) => (
                                <div key={review.id} className="border-l-4 border-yellow-500 pl-4 py-2">
                                    <p className="font-semibold text-[#001F3F]">
                                        New Review from {review.customerName}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {review.rating} stars • {review.isApproved ? 'Approved' : 'Pending'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}