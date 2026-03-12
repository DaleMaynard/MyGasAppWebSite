'use client';

import { motion } from 'framer-motion';
import { FaApple, FaGooglePlay, FaEnvelope } from 'react-icons/fa';
import { useState } from 'react';

export default function Download() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send to an API
    console.log('Email submitted:', email);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail('');
    }, 3000);
  };

  return (
    <section id="download" style={{ width: '100%', paddingTop: '6rem', paddingBottom: '6rem', background: 'linear-gradient(to bottom right, #111827, #1f2937)', color: '#ffffff' }}>
      <div className="center-container">
        <motion.div
          className="text-center"
          style={{ marginBottom: '3rem' }}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="font-bold" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Get Started Today</h2>
          <p className="opacity-90 max-w-3xl mx-auto" style={{ fontSize: '1.15rem', lineHeight: '1.6' }}>
            Download our apps and start contributing to the most accurate fuel pricing network.
          </p>
        </motion.div>

        {/* App Stores */}
        <motion.div
          className="flex flex-col md:flex-row justify-center"
          style={{ gap: '1.5rem', marginBottom: '3rem' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* RestStop */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex-1 max-w-sm hover:bg-white/20 transition-all duration-300" style={{ padding: '2rem' }}>
            <h3 className="font-bold" style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>RestStop</h3>
            <p className="opacity-80" style={{ marginBottom: '1.5rem', lineHeight: '1.6', fontSize: '0.95rem' }}>Find rest stops and fuel along your highway journey.</p>
            <div className="flex" style={{ gap: '1rem' }}>
              <button className="flex-1 bg-black text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition">
                <FaApple /> App Store
              </button>
              <button className="flex-1 bg-black text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition">
                <FaGooglePlay /> Play Store
              </button>
            </div>
          </div>

          {/* FuelFinder */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex-1 max-w-sm hover:bg-white/20 transition-all duration-300" style={{ padding: '2rem' }}>
            <h3 className="font-bold" style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>FuelFinder</h3>
            <p className="opacity-80" style={{ marginBottom: '1.5rem', lineHeight: '1.6', fontSize: '0.95rem' }}>Compare prices and find the cheapest fuel near you.</p>
            <div className="flex" style={{ gap: '1rem' }}>
              <button className="flex-1 bg-black text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition">
                <FaApple /> App Store
              </button>
              <button className="flex-1 bg-black text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition">
                <FaGooglePlay /> Play Store
              </button>
            </div>
          </div>

          {/* TripPlanner */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex-1 max-w-sm hover:bg-white/20 transition-all duration-300" style={{ padding: '2rem' }}>
            <h3 className="font-bold" style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>TripPlanner</h3>
            <p className="opacity-80" style={{ marginBottom: '1.5rem', lineHeight: '1.6', fontSize: '0.95rem' }}>Plan your trip and optimize fuel stops for savings.</p>
            <div className="flex" style={{ gap: '1rem' }}>
              <button className="flex-1 bg-black text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition">
                <FaApple /> App Store
              </button>
              <button className="flex-1 bg-black text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition">
                <FaGooglePlay /> Play Store
              </button>
            </div>
          </div>
        </motion.div>

        {/* Waitlist CTA */}
        <motion.div
          className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl max-w-2xl mx-auto"
          style={{ padding: '2.5rem' }}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="font-bold" style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Join Our Community</h3>
          <p className="opacity-90" style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Coming soon to your app store. Get notified when we launch!
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex" style={{ gap: '0.5rem' }}>
              <div className="flex-1 relative">
                <FaEnvelope className="absolute left-4 top-4 text-gray-600" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <button
                type="submit"
                className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Notify Me
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-500 text-white py-3 rounded-lg text-center font-semibold"
            >
              ✓ Thanks! We'll be in touch.
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
