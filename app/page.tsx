'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import AOS from 'aos';
import { ArrowRight, Star, CircleCheck as CheckCircle, Award, Users } from 'lucide-react';
import carsData from '@/data/cars.json';
import reviewsData from '@/data/reviews.json';
import statsData from '@/data/stats.json';

export default function Home() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const featuredCars = carsData.filter(car => car.is_featured).slice(0, 6);
  const recentReviews = reviewsData.slice(0, 3);

  return (
    <div className="pt-20">
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#001F3F] via-[#003366] to-[#001F3F]">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg')] bg-cover bg-center opacity-20" />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Drive Your Dream,
              <span className="text-[#D32F2F]"> Today</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#C0C0C0] mb-8 max-w-3xl mx-auto">
              Premium quality used cars from trusted UK dealership. Over 135 happy customers and counting.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/cars"
              className="bg-[#D32F2F] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#B71C1C] transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 flex items-center space-x-2"
            >
              <span>Browse Our Cars</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300 border-2 border-white/30"
            >
              Contact Us
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 flex justify-center gap-8 text-white"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-[#D32F2F]">{statsData.happyCustomers}+</div>
              <div className="text-sm text-[#C0C0C0]">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#D32F2F]">{statsData.soldCars}+</div>
              <div className="text-sm text-[#C0C0C0]">Cars Sold</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#D32F2F]">{statsData.averageRating}</div>
              <div className="text-sm text-[#C0C0C0]">Star Rating</div>
            </div>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl md:text-5xl font-bold text-[#001F3F] mb-4">
              Featured <span className="text-[#D32F2F]">Vehicles</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hand-picked premium vehicles ready for their next owner
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCars.map((car, index) => (
              <Link
                key={car.id}
                href={`/cars/${car.id}`}
                data-aos="fade-up"
                data-aos-delay={index * 100}
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
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-[#001F3F] mb-2">
                      {car.make} {car.model}
                    </h3>
                    <p className="text-gray-600 mb-4">{car.year} • {car.mileage.toLocaleString()} miles</p>
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

          <div className="text-center mt-12" data-aos="fade-up">
            <Link
              href="/cars"
              className="inline-block bg-[#001F3F] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#003366] transition-all duration-300"
            >
              View All Vehicles
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-[#001F3F] to-[#003366] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose <span className="text-[#D32F2F]">Paul's Auto?</span>
            </h2>
            <p className="text-lg text-[#C0C0C0] max-w-2xl mx-auto">
              Your trusted partner for premium quality vehicles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <CheckCircle className="w-12 h-12" />,
                title: 'Quality Assured',
                description: 'Every vehicle undergoes rigorous inspection before sale',
              },
              {
                icon: <Award className="w-12 h-12" />,
                title: 'Trusted Service',
                description: 'Over 135 satisfied customers and 5-star reviews',
              },
              {
                icon: <Users className="w-12 h-12" />,
                title: 'Expert Support',
                description: 'Friendly team ready to help you find your perfect car',
              },
            ].map((feature, index) => (
              <div
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300"
              >
                <div className="text-[#D32F2F] mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-[#C0C0C0]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl md:text-5xl font-bold text-[#001F3F] mb-4">
              Customer <span className="text-[#D32F2F]">Reviews</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See what our happy customers have to say
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentReviews.map((review, index) => (
              <div
                key={review.id}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <div className="flex items-center mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#D32F2F] text-[#D32F2F]" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{review.comment}"</p>
                <p className="font-semibold text-[#001F3F]">{review.customer_name}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12" data-aos="fade-up">
            <Link
              href="/reviews"
              className="inline-block bg-[#D32F2F] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#B71C1C] transition-all duration-300"
            >
              Read All Reviews
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#001F3F] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Find Your Perfect Car?
          </h2>
          <p className="text-xl text-[#C0C0C0] mb-8">
            Get in touch today and let us help you drive away in your dream vehicle
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+447868364455"
              className="bg-[#D32F2F] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#B71C1C] transition-all duration-300 shadow-lg hover:shadow-2xl"
            >
              Call: +44 7868 364455
            </a>
            <Link
              href="/contact"
              className="bg-white text-[#001F3F] px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300"
            >
              Send Message
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
