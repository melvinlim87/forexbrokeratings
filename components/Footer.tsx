'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-t from-black via-gray-900 to-black/60 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="py-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">Forex Broker Ratings</span>
              </div>
              <p className="text-cyan-100 mb-6 max-w-md leading-relaxed">
                Your trusted partner in finding the perfect forex broker. We provide transparent, 
                real-time data to help you make informed trading decisions.
              </p>
              <div className="flex items-center space-x-2 text-cyan-200">
                <Mail className="w-4 h-4" />
                <span className="text-sm">hello@forexbrokerratings.com</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {['Compare Brokers', 'Broker Reviews', 'Trading Guides', 'Market Analysis', 'Contact Us'].map((link) => (
                  <li key={link}>
                    <a 
                      href="#" 
                      className="text-cyan-100 hover:text-cyan-300 transition-colors text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                {['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Disclaimer', 'Risk Warning'].map((link) => (
                  <li key={link}>
                    <a 
                      href="#" 
                      className="text-cyan-100 hover:text-cyan-300 transition-colors text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-white/60 text-sm mb-4 md:mb-0">
              © 2024 Forex Broker Ratings. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <p className="text-white/60 text-sm">
                Risk Warning: Trading forex involves substantial risk and may not be suitable for all investors.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}