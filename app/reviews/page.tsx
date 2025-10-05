'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AOS from 'aos';
import { Star } from 'lucide-react';
import reviewsData from '@/data/reviews.json';

export default function ReviewsPage() {
  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    comment: '',
  });

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your review! It will be published after approval.');
    setFormData({ name: '', rating: 5, comment: '' });
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
              Customer <span className="text-[#D32F2F]">Reviews</span>
            </h1>
            <p className="text-xl text-[#C0C0C0]">
              See what our happy customers have to say
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {reviewsData.map((review, index) => (
                <div
                  key={review.id}
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 fill-[#D32F2F] text-[#D32F2F]" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic text-lg">"{review.comment}"</p>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-[#001F3F] text-lg">{review.customer_name}</p>
                    <p className="text-gray-500 text-sm">
                      {new Date(review.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24" data-aos="fade-left">
              <h2 className="text-2xl font-bold text-[#001F3F] mb-6">Leave a Review</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
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
                    Rating *
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating })}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            rating <= formData.rating
                              ? 'fill-[#D32F2F] text-[#D32F2F]'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent"
                    placeholder="Tell us about your experience..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#D32F2F] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#B71C1C] transition-colors"
                >
                  Submit Review
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
