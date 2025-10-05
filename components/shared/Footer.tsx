import Link from 'next/link';
import { Car, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#001F3F] text-white border-t border-[#C0C0C0]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Car className="w-8 h-8 text-[#D32F2F]" />
              <div>
                <h3 className="text-lg font-bold">Paul's Auto</h3>
                <p className="text-sm text-[#C0C0C0]">Car Sales</p>
              </div>
            </div>
            <p className="text-[#C0C0C0] text-sm">
              Drive Your Dream, Today.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-[#C0C0C0] hover:text-[#D32F2F] transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/cars" className="text-[#C0C0C0] hover:text-[#D32F2F] transition-colors text-sm">
                  Browse Cars
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="text-[#C0C0C0] hover:text-[#D32F2F] transition-colors text-sm">
                  Reviews
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[#C0C0C0] hover:text-[#D32F2F] transition-colors text-sm">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-[#C0C0C0] text-sm">
                <Phone className="w-4 h-4 text-[#D32F2F]" />
                <a href="tel:+447868364455" className="hover:text-[#D32F2F] transition-colors">
                  +44 7868 364455
                </a>
              </li>
              <li className="flex items-center space-x-2 text-[#C0C0C0] text-sm">
                <Mail className="w-4 h-4 text-[#D32F2F]" />
                <a href="mailto:info@paulsauto.co.uk" className="hover:text-[#D32F2F] transition-colors">
                  info@paulsauto.co.uk
                </a>
              </li>
              <li className="flex items-start space-x-2 text-[#C0C0C0] text-sm">
                <MapPin className="w-4 h-4 text-[#D32F2F] mt-0.5" />
                <span>London, United Kingdom</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Opening Hours</h4>
            <ul className="space-y-2 text-[#C0C0C0] text-sm">
              <li>Mon - Fri: 9:00 AM - 6:00 PM</li>
              <li>Saturday: 10:00 AM - 5:00 PM</li>
              <li>Sunday: 11:00 AM - 4:00 PM</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#C0C0C0]/20 mt-8 pt-8 text-center text-[#C0C0C0] text-sm">
          <p>&copy; {new Date().getFullYear()} Paul's Auto Car Sales. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
