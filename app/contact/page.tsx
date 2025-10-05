'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AOS from 'aos';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for contacting us! We will get back to you shortly.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
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
              Get In <span className="text-[#D32F2F]">Touch</span>
            </h1>
            <p className="text-xl text-[#C0C0C0]">
              We're here to help you find your perfect car
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: <Phone className="w-8 h-8" />,
              title: 'Phone',
              content: '+44 7868 364455',
              link: 'tel:+447868364455',
            },
            {
              icon: <Mail className="w-8 h-8" />,
              title: 'Email',
              content: 'info@paulsauto.co.uk',
              link: 'mailto:info@paulsauto.co.uk',
            },
            {
              icon: <MapPin className="w-8 h-8" />,
              title: 'Location',
              content: 'London, United Kingdom',
              link: '#',
            },
          ].map((item, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center"
            >
              <div className="text-[#D32F2F] flex justify-center mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-[#001F3F] mb-2">{item.title}</h3>
              <a
                href={item.link}
                className="text-gray-600 hover:text-[#D32F2F] transition-colors"
              >
                {item.content}
              </a>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div data-aos="fade-right">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-[#001F3F] mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent"
                    placeholder="Tell us how we can help you..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#D32F2F] text-white px-6 py-4 rounded-full font-semibold hover:bg-[#B71C1C] transition-colors flex items-center justify-center text-lg"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-8">
            <div data-aos="fade-left">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <Clock className="w-8 h-8 text-[#D32F2F] flex-shrink-0" />
                  <div>
                    <h3 className="text-2xl font-bold text-[#001F3F] mb-4">Opening Hours</h3>
                    <div className="space-y-2 text-gray-700">
                      <div className="flex justify-between">
                        <span className="font-medium">Monday - Friday</span>
                        <span>9:00 AM - 6:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Saturday</span>
                        <span>10:00 AM - 5:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Sunday</span>
                        <span>11:00 AM - 4:00 PM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div data-aos="fade-left" data-aos-delay="100">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.5283578832973!2d-0.1277583!3d51.5073509!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487604b900d26973%3A0x4291f3172409ea92!2slondon!5e0!3m2!1sen!2suk!4v1234567890"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Paul's Auto Location"
                />
              </div>
            </div>

            <div data-aos="fade-left" data-aos-delay="200">
              <div className="bg-gradient-to-br from-[#001F3F] to-[#003366] rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Prefer to Chat?</h3>
                <p className="text-[#C0C0C0] mb-6">
                  Get instant answers to your questions via WhatsApp or our live chat.
                </p>
                <div className="space-y-3">
                  <a
                    href="https://wa.me/447868364455"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition-colors text-center"
                  >
                    WhatsApp Us
                  </a>
                  <button
                    onClick={() => alert('Live chat opening...')}
                    className="block w-full bg-[#D32F2F] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#B71C1C] transition-colors"
                  >
                    Live Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
