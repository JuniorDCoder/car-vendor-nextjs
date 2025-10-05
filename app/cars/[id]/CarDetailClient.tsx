'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AOS from 'aos';
import { ArrowLeft, Phone, MessageCircle, Mail, Calendar, Gauge, Fuel, Settings, Palette, CircleCheck as CheckCircle, Star } from 'lucide-react';
import carsData from '@/data/cars.json';
import reviewsData from '@/data/reviews.json';

export default function CarDetailClient({ id }: { id: string }) {
  const car = carsData.find(c => c.id === id);
  const carReviews = reviewsData.filter(r => r.car_id === id);

  const [selectedImage, setSelectedImage] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  if (!car) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#001F3F] mb-4">Car Not Found</h1>
          <Link
            href="/cars"
            className="inline-block bg-[#D32F2F] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#B71C1C] transition-colors"
          >
            Browse All Cars
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you! We will contact you shortly.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/cars"
          className="inline-flex items-center text-[#001F3F] hover:text-[#D32F2F] transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to All Cars
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div data-aos="fade-right">
            <div className="relative h-96 rounded-2xl overflow-hidden mb-4">
              <Image
                src={car.images[selectedImage]}
                alt={`${car.make} ${car.model}`}
                fill
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {car.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-24 rounded-lg overflow-hidden ${
                    selectedImage === index ? 'ring-4 ring-[#D32F2F]' : ''
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${car.make} ${car.model} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div data-aos="fade-left">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-4xl font-bold text-[#001F3F]">
                  {car.make} {car.model}
                </h1>
                <span className="bg-[#D32F2F] text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {car.status}
                </span>
              </div>

              <p className="text-5xl font-bold text-[#D32F2F] mb-6">
                £{car.price.toLocaleString()}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Calendar className="w-6 h-6 text-[#D32F2F]" />
                  <div>
                    <p className="text-sm text-gray-600">Year</p>
                    <p className="font-semibold text-[#001F3F]">{car.year}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Gauge className="w-6 h-6 text-[#D32F2F]" />
                  <div>
                    <p className="text-sm text-gray-600">Mileage</p>
                    <p className="font-semibold text-[#001F3F]">{car.mileage.toLocaleString()} mi</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Fuel className="w-6 h-6 text-[#D32F2F]" />
                  <div>
                    <p className="text-sm text-gray-600">Fuel Type</p>
                    <p className="font-semibold text-[#001F3F]">{car.fuel_type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Settings className="w-6 h-6 text-[#D32F2F]" />
                  <div>
                    <p className="text-sm text-gray-600">Transmission</p>
                    <p className="font-semibold text-[#001F3F]">{car.transmission}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Palette className="w-6 h-6 text-[#D32F2F]" />
                  <div>
                    <p className="text-sm text-gray-600">Color</p>
                    <p className="font-semibold text-[#001F3F]">{car.color}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <CarIcon className="w-6 h-6 text-[#D32F2F]" />
                  <div>
                    <p className="text-sm text-gray-600">Body Type</p>
                    <p className="font-semibold text-[#001F3F]">{car.body_type}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <a
                  href="tel:+447868364455"
                  className="flex-1 bg-[#D32F2F] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#B71C1C] transition-colors flex items-center justify-center"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call Now
                </a>
                <a
                  href={`https://wa.me/447868364455?text=I'm interested in the ${car.make} ${car.model}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition-colors flex items-center justify-center"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8" data-aos="fade-up">
              <h2 className="text-3xl font-bold text-[#001F3F] mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">{car.description}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8" data-aos="fade-up">
              <h2 className="text-3xl font-bold text-[#001F3F] mb-6">Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {car.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#D32F2F]" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {carReviews.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8" data-aos="fade-up">
                <h2 className="text-3xl font-bold text-[#001F3F] mb-6">Customer Reviews</h2>
                <div className="space-y-6">
                  {carReviews.map(review => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                      <div className="flex items-center mb-2">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-[#D32F2F] text-[#D32F2F]" />
                        ))}
                      </div>
                      <p className="text-gray-700 mb-2 italic">"{review.comment}"</p>
                      <p className="font-semibold text-[#001F3F]">{review.customer_name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24" data-aos="fade-left">
              <h2 className="text-2xl font-bold text-[#001F3F] mb-6">Contact Seller</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent"
                    placeholder={`I'm interested in the ${car.make} ${car.model}...`}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#D32F2F] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#B71C1C] transition-colors flex items-center justify-center"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Send Inquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CarIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2" />
      <circle cx="6.5" cy="16.5" r="2.5" />
      <circle cx="16.5" cy="16.5" r="2.5" />
    </svg>
  );
}
