'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AOS from 'aos';
import { Award, Users, Heart, Shield, ArrowRight } from 'lucide-react';
import statsData from '@/data/stats.json';

export default function AboutPage() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <div className="pt-20 min-h-screen">
      <section className="relative h-96 flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#001F3F] via-[#003366] to-[#001F3F]">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1035108/pexels-photo-1035108.jpeg')] bg-cover bg-center opacity-20" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              About <span className="text-[#D32F2F]">Paul's Auto</span>
            </h1>
            <p className="text-xl text-[#C0C0C0]">
              Your trusted partner for premium quality vehicles
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <h2 className="text-4xl font-bold text-[#001F3F] mb-6">
                Our Story
              </h2>
              <p className="text-gray-700 text-lg mb-4 leading-relaxed">
                Welcome to Paul's Auto Car Sales, where passion for automobiles meets exceptional customer service. Founded with a vision to revolutionize the car buying experience in the UK, we've been helping customers find their perfect vehicles for years.
              </p>
              <p className="text-gray-700 text-lg mb-4 leading-relaxed">
                What started as a small family business has grown into one of the most trusted names in quality used car sales. We pride ourselves on our carefully curated selection of premium vehicles, transparent pricing, and commitment to customer satisfaction.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Every car in our showroom undergoes rigorous inspection to ensure it meets our high standards. When you buy from Paul's Auto, you're not just buying a car – you're joining a family of satisfied customers who trust us for their automotive needs.
              </p>
            </div>
            <div data-aos="fade-left" className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/3972755/pexels-photo-3972755.jpeg"
                alt="Paul's Auto Showroom"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl font-bold text-[#001F3F] mb-4">
              Why Choose Us
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the best car buying experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Shield className="w-12 h-12" />,
                title: 'Quality Assured',
                description: 'Every vehicle is thoroughly inspected and comes with warranty options',
              },
              {
                icon: <Award className="w-12 h-12" />,
                title: 'Expert Team',
                description: 'Knowledgeable staff with years of experience in the automotive industry',
              },
              {
                icon: <Heart className="w-12 h-12" />,
                title: 'Customer First',
                description: 'Your satisfaction is our priority. We go the extra mile for you',
              },
              {
                icon: <Users className="w-12 h-12" />,
                title: 'Trusted Service',
                description: '135+ happy customers and growing. Join our family today',
              },
            ].map((item, index) => (
              <div
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center"
              >
                <div className="text-[#D32F2F] flex justify-center mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-[#001F3F] mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-[#001F3F] to-[#003366] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl font-bold mb-4">
              By the Numbers
            </h2>
            <p className="text-lg text-[#C0C0C0]">
              Our track record speaks for itself
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: statsData.happyCustomers + '+', label: 'Happy Customers' },
              { number: statsData.soldCars + '+', label: 'Cars Sold' },
              { number: statsData.averageRating + '.0', label: 'Average Rating' },
              { number: statsData.availableCars + '+', label: 'Cars Available' },
            ].map((stat, index) => (
              <div
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="text-center"
              >
                <div className="text-5xl font-bold text-[#D32F2F] mb-2">{stat.number}</div>
                <div className="text-lg text-[#C0C0C0]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center" data-aos="fade-up">
          <h2 className="text-4xl font-bold text-[#001F3F] mb-6">
            Ready to Find Your Perfect Car?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Browse our collection or get in touch with our team today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cars"
              className="bg-[#D32F2F] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#B71C1C] transition-all duration-300 inline-flex items-center justify-center"
            >
              Browse Our Cars <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/contact"
              className="bg-[#001F3F] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#003366] transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
