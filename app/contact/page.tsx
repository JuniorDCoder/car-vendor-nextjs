'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AOS from 'aos';
import { Phone, Mail, MapPin, Clock, Send, Loader, CheckCircle, Bell } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [notificationsSupported, setNotificationsSupported] = useState(false);

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });

        // Check if browser notifications are supported
        setNotificationsSupported('Notification' in window);

        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                console.log('Notification permission:', permission);
            });
        }

    }, []);

    const sendBrowserNotification = (title: string, options?: NotificationOptions) => {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                ...options
            });
        }
    };

    const sendAdminNotification = () => {
        // This would typically call your notification service
        // For now, we'll just log it and show browser notification
        console.log('📧 New contact form submission:', {
            name: formData.name,
            email: formData.email,
            subject: formData.subject
        });

        // Browser notification for admin (you'd see this if you have the admin panel open)
        sendBrowserNotification('📧 New Contact Form', {
            body: `From: ${formData.name} - ${formData.subject}`,
            tag: 'contact-form'
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // 1. Store in Firestore
            await addDoc(collection(db, 'contactSubmissions'), {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                subject: formData.subject,
                message: formData.message,
                status: 'new',
                read: false,
                createdAt: serverTimestamp(),
            });

            // 2. Send notifications
            sendAdminNotification();

            // 3. Browser notification for user
            if (notificationsSupported) {
                sendBrowserNotification('Message Sent Successfully!', {
                    body: `Thank you ${formData.name}! We'll contact you soon.`,
                });
            }

            toast.success('Message sent successfully! We will get back to you within 24 hours.');
            setSubmitted(true);
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });

        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message. Please try again or contact us directly.');
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
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
                                Thank <span className="text-[#D32F2F]">You!</span>
                            </h1>
                            <p className="text-xl text-[#C0C0C0]">
                                Your message has been received
                            </p>
                        </motion.div>
                    </div>
                </section>

                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="bg-white rounded-2xl shadow-lg p-12"
                    >
                        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-[#001F3F] mb-4">
                            Message Sent Successfully!
                        </h2>
                        <p className="text-gray-600 mb-6 text-lg">
                            Thank you for contacting Paul's Auto. We have received your message and will get back to you within 24 hours.
                        </p>
                        <div className="space-y-3 text-gray-500">
                            <p>📧 We'll respond to: <strong>{formData.email}</strong></p>
                            {formData.phone && <p>📞 We'll call: <strong>{formData.phone}</strong></p>}
                        </div>
                        <button
                            onClick={() => setSubmitted(false)}
                            className="mt-8 bg-[#D32F2F] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#B71C1C] transition-colors"
                        >
                            Send Another Message
                        </button>
                    </motion.div>
                </div>
            </div>
        );
    }

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
                            content: 'info@paulsautocarsales.uk',
                            link: 'mailto:info@paulsautocarsales.uk',
                        },
                        {
                            icon: <MapPin className="w-8 h-8" />,
                            title: 'Location',
                            content: 'London, United Kingdom',
                            link: '#',
                        },
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
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
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
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
                                            placeholder="Your full name"
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
                                            placeholder="your.email@example.com"
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
                                            placeholder="Your phone number"
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
                                            placeholder="What is this regarding?"
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
                                        placeholder="Tell us how we can help you find your perfect car..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-[#D32F2F] text-white px-6 py-4 rounded-full font-semibold hover:bg-[#B71C1C] transition-colors flex items-center justify-center text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader className="w-5 h-5 mr-2 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5 mr-2" />
                                            Send Message
                                        </>
                                    )}
                                </button>
                                <p className="text-sm text-gray-500 text-center">
                                    We typically respond within 2-4 hours during business hours
                                </p>
                            </form>
                        </div>
                    </motion.div>

                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
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
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
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
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <div className="bg-gradient-to-br from-[#001F3F] to-[#003366] rounded-2xl p-8 text-white">
                                <h3 className="text-2xl font-bold mb-4">Prefer to Chat?</h3>
                                <p className="text-[#C0C0C0] mb-6">
                                    Get instant answers to your questions via WhatsApp.
                                </p>
                                <a
                                    href="https://wa.me/447868364455?text=Hi%20Paul's%20Auto%2C%20I%20have%20a%20question%20about%20your%20cars"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition-colors text-center"
                                >
                                    WhatsApp Us
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}