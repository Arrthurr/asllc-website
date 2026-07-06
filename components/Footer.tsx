'use client';

import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import Link from 'next/link';
import Logo from './Logo';
import { usePrefersReducedMotion } from '@/lib/motion';

export default function Footer() {
  const reduced = usePrefersReducedMotion();

  return (
    <footer className="bg-black text-white py-20">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 px-4">
          <div className="space-y-6">
            <Logo className="text-white" />
            <p className="text-gray-400">
              Working AI, built into your business. A founder-led AI build studio for small businesses.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Navigation</h4>
            <ul className="space-y-4">
              <li><Link href="/#services" className="text-gray-400 hover:text-white transition-colors">Services</Link></li>
              <li><Link href="/#process" className="text-gray-400 hover:text-white transition-colors">Process</Link></li>
              <li><Link href="/#team" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Contact</h4>
            <ul className="space-y-4 text-gray-400">
              <li>
                <a href="mailto:start@arturosolo.com" className="hover:text-white transition-colors">
                  start@arturosolo.com
                </a>
              </li>
              <li>Phoenix, AZ</li>
            </ul>
            <div className="mt-6">
              <motion.a
                href="mailto:start@arturosolo.com"
                className="inline-flex p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                whileHover={reduced ? undefined : { scale: 1.1 }}
                whileTap={reduced ? undefined : { scale: 0.9 }}
                aria-label="Email Arturo Solo"
              >
                <Mail className="h-5 w-5" />
              </motion.a>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto border-t border-gray-800 mt-16 pt-8 px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Arturo Solo LLC. All rights reserved.</p>
            <div className="flex gap-8 text-sm text-gray-400">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
