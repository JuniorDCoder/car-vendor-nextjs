'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import AOS from 'aos';
import { ArrowRight, Filter } from 'lucide-react';
import carsData from '@/data/cars.json';

export default function CarsPage() {
  const [cars, setCars] = useState(carsData);
  const [filteredCars, setFilteredCars] = useState(carsData);
  const [filters, setFilters] = useState({
    make: '',
    minPrice: '',
    maxPrice: '',
    fuelType: '',
  });

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  useEffect(() => {
    let filtered = [...cars];

    if (filters.make) {
      filtered = filtered.filter(car => car.make === filters.make);
    }

    if (filters.minPrice) {
      filtered = filtered.filter(car => car.price >= parseInt(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(car => car.price <= parseInt(filters.maxPrice));
    }

    if (filters.fuelType) {
      filtered = filtered.filter(car => car.fuel_type === filters.fuelType);
    }

    setFilteredCars(filtered);
  }, [filters, cars]);

  const makes = Array.from(new Set(carsData.map(car => car.make)));
  const fuelTypes = Array.from(new Set(carsData.map(car => car.fuel_type)));

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      make: '',
      minPrice: '',
      maxPrice: '',
      fuelType: '',
    });
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8" data-aos="fade-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-[#001F3F] flex items-center">
              <Filter className="w-6 h-6 mr-2 text-[#D32F2F]" />
              Filters
            </h2>
            <button
              onClick={clearFilters}
              className="text-[#D32F2F] hover:text-[#B71C1C] font-semibold transition-colors"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  <option key={type} value={type}>{type}</option>
                ))}
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
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="mb-6 text-gray-600">
          Showing <span className="font-semibold text-[#D32F2F]">{filteredCars.length}</span> {filteredCars.length === 1 ? 'vehicle' : 'vehicles'}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map((car, index) => (
            <Link
              key={car.id}
              href={`/cars/${car.id}`}
              data-aos="fade-up"
              data-aos-delay={index * 50}
            >
              <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={car.images[0]}
                    alt={`${car.make} ${car.model}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-[#D32F2F] text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {car.status}
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {car.fuel_type}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-[#001F3F] mb-2">
                    {car.make} {car.model}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {car.year} • {car.mileage.toLocaleString()} miles • {car.transmission}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-[#D32F2F]">
                      £{car.price.toLocaleString()}
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

        {filteredCars.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600 mb-4">No vehicles found matching your criteria</p>
            <button
              onClick={clearFilters}
              className="bg-[#D32F2F] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#B71C1C] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
