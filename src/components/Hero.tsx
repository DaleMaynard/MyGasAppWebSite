'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

export default function Hero() {
  return (
    <section style={{ width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', background: 'linear-gradient(to bottom right, #0f172a, #1e293b, #0f172a)' }}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{ y: [0, 50, 0], x: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{ y: [0, -50, 0], x: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 center-container py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <motion.div
              className="inline-block mb-4 px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <span className="text-sm font-semibold text-blue-300">Real-Time Fuel Network</span>
            </motion.div>

            <motion.h1
              className="text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Stop Guessing.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Start Saving.
              </span>
            </motion.h1>

            <motion.p
              className="text-xl text-gray-300 mb-8 leading-relaxed max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Real-time fuel prices from travelers like you. Know the best prices before you pump. Download now and start saving.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link 
                href="#download" 
                className="group bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                Download Free
                <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link 
                href="#features" 
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-slate-900 transition-all duration-300"
              >
                Learn More
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div>
                <div className="text-3xl font-bold text-cyan-400">Real-Time</div>
                <div className="text-gray-400 text-sm">Live Updates</div>
              </div>
              <div className="w-px bg-gray-700"></div>
              <div>
                <div className="text-3xl font-bold text-blue-400">Crowdsourced</div>
                <div className="text-gray-400 text-sm">User Data</div>
              </div>
              <div className="w-px bg-gray-700"></div>
              <div>
                <div className="text-3xl font-bold text-cyan-400">Accurate</div>
                <div className="text-gray-400 text-sm">On the Spot</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right side - Visual element */}
          <motion.div
            className="relative hidden lg:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              {/* Glowing background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
              
              {/* Card */}
              <div className="relative bg-gradient-to-br from-slate-700 to-slate-800 rounded-3xl p-1 overflow-hidden border border-slate-600">
                <div className="bg-slate-800 rounded-3xl p-8 h-96 flex flex-col items-center justify-center">
                  {/* Placeholder for featured image */}
                  <motion.div
                    className="text-7xl mb-4"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ⛽
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white text-center mb-2">App Interface Preview</h3>
                  <p className="text-gray-400 text-center">Scroll down to see the full app in action</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="text-cyan-400 text-2xl">↓</div>
      </motion.div>
    </section>
  );
}
