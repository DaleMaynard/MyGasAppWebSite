'use client';

import { motion } from 'framer-motion';
import { FaClock, FaMoneyBill, FaMapMarkerAlt, FaTimes } from 'react-icons/fa';

export default function Problem() {
  const problems = [
    {
      icon: FaClock,
      title: 'Outdated Data',
      description: 'API data is 12 hrs to multiple days old. Fuel prices change hourly.'
    },
    {
      icon: FaMoneyBill,
      title: 'Expensive APIs',
      description: 'Real-time futures data costs money. Only commodity futures available.'
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Inaccurate Pricing',
      description: 'No spot prices. Futures don\'t match what you actually pay at the pump.'
    },
    {
      icon: FaTimes,
      title: 'Limited Coverage',
      description: 'APIs miss regional variations and local gas station pricing.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section style={{ width: '100%', paddingTop: '6rem', paddingBottom: '6rem', backgroundColor: '#f9fafb' }}>
      <div className="center-container">
        <motion.div
          className="text-center"
          style={{ marginBottom: '3rem' }}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="font-bold text-gray-900" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>The Problem</h2>
          <p className="text-gray-600 max-w-3xl mx-auto" style={{ fontSize: '1.15rem', lineHeight: '1.6' }}>
            Current fuel pricing solutions are outdated, expensive, and inaccurate. Here's what travelers really need:
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto"
          style={{ gap: '1.5rem' }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow text-center"
                style={{ padding: '2rem' }}
                variants={itemVariants}
              >
                <div className="flex flex-col items-center" style={{ gap: '1rem' }}>
                  <div className="text-red-500" style={{ fontSize: '2rem' }}>
                    <Icon />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{problem.title}</h3>
                    <p className="text-gray-600" style={{ lineHeight: '1.6', fontSize: '0.95rem' }}>{problem.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Key insight */}
        <motion.div
          className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-lg max-w-4xl mx-auto text-center"
          style={{ marginTop: '3rem', padding: '2rem' }}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-900 font-semibold" style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>The Real Issue:</p>
          <p className="text-gray-700 max-w-2xl mx-auto" style={{ lineHeight: '1.6', fontSize: '0.95rem' }}>
            Travelers are at the pump every day. They see real prices in real-time. But this invaluable data is never captured or shared. Existing solutions rely on outdated APIs instead of tapping into the knowledge of people actually buying fuel.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
