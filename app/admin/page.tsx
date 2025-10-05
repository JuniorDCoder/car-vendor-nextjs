'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Car, MessageSquare, Star, TrendingUp } from 'lucide-react';
import statsData from '@/data/stats.json';
import carsData from '@/data/cars.json';
import reviewsData from '@/data/reviews.json';

export default function AdminDashboard() {
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuth');
    if (!isAuthenticated) {
      window.location.href = '/admin/login';
    }
  }, []);

  const stats = [
    {
      title: 'Total Cars',
      value: carsData.length,
      icon: <Car className="w-8 h-8" />,
      color: 'bg-blue-500',
      link: '/admin/cars',
    },
    {
      title: 'Total Reviews',
      value: reviewsData.length,
      icon: <Star className="w-8 h-8" />,
      color: 'bg-yellow-500',
      link: '/admin/reviews',
    },
    {
      title: 'Pending Inquiries',
      value: statsData.pendingInquiries,
      icon: <MessageSquare className="w-8 h-8" />,
      color: 'bg-green-500',
      link: '#',
    },
    {
      title: 'Cars Sold',
      value: statsData.soldCars,
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'bg-[#D32F2F]',
      link: '#',
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
            onClick={() => {
              localStorage.removeItem('adminAuth');
              window.location.href = '/admin/login';
            }}
            className="bg-[#D32F2F] text-white px-6 py-3 rounded-lg hover:bg-[#B71C1C] transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={stat.link}>
                <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className={`${stat.color} text-white w-16 h-16 rounded-lg flex items-center justify-center mb-4`}>
                    {stat.icon}
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                  <p className="text-3xl font-bold text-[#001F3F]">{stat.value}</p>
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
                className="block w-full bg-gray-200 text-[#001F3F] px-6 py-4 rounded-lg hover:bg-gray-300 transition-colors text-center font-semibold"
              >
                Manage Reviews
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-[#001F3F] mb-6">Recent Activity</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-[#D32F2F] pl-4 py-2">
                <p className="font-semibold text-[#001F3F]">New car added</p>
                <p className="text-sm text-gray-600">BMW 3 Series - 2 hours ago</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <p className="font-semibold text-[#001F3F]">Review approved</p>
                <p className="text-sm text-gray-600">5-star review - 5 hours ago</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="font-semibold text-[#001F3F]">Car sold</p>
                <p className="text-sm text-gray-600">Mercedes C-Class - Yesterday</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
