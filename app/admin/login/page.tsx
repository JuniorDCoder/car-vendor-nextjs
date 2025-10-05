'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Mail } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.email === 'admin@paulsauto.co.uk' && formData.password === 'admin123') {
      localStorage.setItem('adminAuth', 'true');
      router.push('/admin');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#001F3F] via-[#003366] to-[#001F3F]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#001F3F] mb-2">Admin Login</h1>
          <p className="text-gray-600">Paul's Auto Car Sales</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent"
                placeholder="admin@paulsauto.co.uk"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#D32F2F] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#B71C1C] transition-colors"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Demo Credentials:</p>
          <p>Email: admin@paulsauto.co.uk</p>
          <p>Password: admin123</p>
        </div>
      </motion.div>
    </div>
  );
}
