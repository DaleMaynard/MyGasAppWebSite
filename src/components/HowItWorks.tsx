'use client';

import { motion } from 'framer-motion';
import { FaMobileAlt, FaFirefox, FaDatabase, FaMap } from 'react-icons/fa';

export default function HowItWorks() {
  const steps = [
    {
      number: '1',
      icon: FaMobileAlt,
      title: 'Open Your App',
      description: 'Open MyGasApp or Trip Planner and navigate to a gas station'
    },
    {
      number: '2',
      icon: FaFirefox,
      title: 'Submit Price Data',
      description: 'Quick submit: fuel type, price, time, and station. Takes 10 seconds.'
    },
    {
      number: '3',
      icon: FaDatabase,
      title: 'Data Aggregation',
      description: 'Your data combines with thousands of other users to create real-time pricing'
    },
    {
      number: '4',
      icon: FaMap,
      title: 'Get Insights',
      description: 'See market trends, find the cheapest stations, plan your fuel stops'
    }
  ];

  return (
    <section id="how-it-works" style={{ width: '100%', paddingTop: '6rem', paddingBottom: '6rem', backgroundColor: '#f9fafb' }}>
      <div className="center-container">
        <motion.div
          className="text-center"
          style={{ marginBottom: '3rem' }}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="font-bold text-gray-900" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>How It Works</h2>
          <p className="text-gray-600 max-w-3xl mx-auto" style={{ fontSize: '1.15rem', lineHeight: '1.6' }}>
            Simple, seamless, and secure. Contribute to the network and get real-time fuel insights.
          </p>
        </motion.div>

        {/* Steps Timeline */}
        <div style={{ marginBottom: '4rem' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto" style={{ gap: '1.5rem' }}>
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  {/* Connection line */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-16 left-1/2 w-full h-1 bg-gradient-to-r from-blue-400 to-cyan-400 transform translate-y-full" style={{ width: 'calc(100% + 2rem)', left: '50%' }}></div>
                  )}

                  <div className="bg-white rounded-xl shadow-md relative z-10" style={{ padding: '2rem' }}>
                    <div className="flex items-center justify-center" style={{ marginBottom: '1.25rem' }}>
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white text-2xl">
                          <Icon />
                        </div>
                        <span className="absolute -top-2 -right-2 bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">{step.number}</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-900 text-center" style={{ fontSize: '1.125rem', marginBottom: '0.75rem' }}>{step.title}</h3>
                    <p className="text-gray-600 text-center" style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* User Experience Highlight */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg max-w-5xl mx-auto"
          style={{ padding: '2.5rem' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 text-center" style={{ gap: '1.5rem' }}>
            <div className="bg-gray-50 rounded-xl" style={{ padding: '2rem' }}>
              <h3 className="font-bold text-gray-900" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Quick Participation</h3>
              <p className="text-gray-600" style={{ lineHeight: '1.6', fontSize: '0.95rem' }}>Submit data in seconds. One tap to confirm price and fuel type.</p>
            </div>
            <div className="bg-gray-50 rounded-xl" style={{ padding: '2rem' }}>
              <h3 className="font-bold text-gray-900" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Real-Time Dashboard</h3>
              <p className="text-gray-600" style={{ lineHeight: '1.6', fontSize: '0.95rem' }}>See prices update across stations as users submit data from the road.</p>
            </div>
            <div className="bg-gray-50 rounded-xl" style={{ padding: '2rem' }}>
              <h3 className="font-bold text-gray-900" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Smart Recommendations</h3>
              <p className="text-gray-600" style={{ lineHeight: '1.6', fontSize: '0.95rem' }}>Get alerts for best prices and plan fuel stops on your routes.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
