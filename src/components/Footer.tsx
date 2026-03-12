'use client';

import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ width: '100%', backgroundColor: '#111827', color: '#d1d5db' }}>
      <div className="center-container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="grid grid-cols-1 md:grid-cols-4" style={{ gap: '2rem', marginBottom: '2rem' }}>
          {/* Brand */}
          <div>
            <h3 className="font-bold text-white" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>MyGasApp</h3>
            <p className="text-gray-400">
              Real-time fuel prices powered by your travels. Making smarter fuel decisions for everyone.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-bold text-white" style={{ marginBottom: '1rem' }}>Product</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><Link href="#" className="hover:text-white transition">MyGasApp</Link></li>
              <li><Link href="#" className="hover:text-white transition">Trip Planner</Link></li>
              <li><Link href="#" className="hover:text-white transition">Features</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-bold text-white" style={{ marginBottom: '1rem' }}>Company</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><Link href="#" className="hover:text-white transition">About</Link></li>
                            <li><Link href="#" className="hover:text-white transition">Contact</Link></li>
              <li><Link href="#" className="hover:text-white transition">Careers</Link></li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h4 className="font-bold text-white" style={{ marginBottom: '1rem' }}>Legal</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><Link href="#" className="hover:text-white transition">Privacy</Link></li>
              <li><Link href="#" className="hover:text-white transition">Terms</Link></li>
              <li><Link href="#" className="hover:text-white transition">Credits</Link></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 flex flex-col md:flex-row items-center justify-between" style={{ paddingTop: '2rem' }}>
          <p className="text-gray-400" style={{ fontSize: '0.875rem', marginBottom: '0' }}>
            © {currentYear} MyGasApp. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex" style={{ gap: '1.5rem' }}>
            <a href="#" className="text-gray-400 hover:text-white transition text-xl">
              <FaFacebook />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition text-xl">
              <FaTwitter />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition text-xl">
              <FaInstagram />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition text-xl">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
