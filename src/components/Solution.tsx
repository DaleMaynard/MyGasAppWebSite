'use client';

import { motion } from 'framer-motion';
import { FaCheckCircle, FaUsers, FaChartLine, FaLock } from 'react-icons/fa';

export default function Solution() {
  const features = [
    {
      icon: FaUsers,
      title: 'Crowdsourced Data',
      description: 'Every app user contributes real-time fuel prices from actual gas stations they visit.'
    },
    {
      icon: FaChartLine,
      title: 'Accuracy They Can\'t Match',
      description: 'Spot prices from your network beat any paid API. Real data from real locations.'
    },
    {
      icon: FaLock,
      title: 'Competitive Advantage',
      description: 'This data is unique to your apps. No other platform has access to it.'
    },
    {
      icon: FaCheckCircle,
      title: 'Instant Updates',
      description: 'Price changes are reflected immediately across your entire network.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
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
    <section style={{ width: '100%', paddingTop: '6rem', paddingBottom: '6rem', backgroundColor: '#ffffff' }}>
      <div className="center-container">
        <motion.div
          className="text-center"
          style={{ marginBottom: '3rem' }}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="font-bold text-gray-900" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>The Solution</h2>
          <p className="text-gray-600 max-w-3xl mx-auto" style={{ fontSize: '1.15rem', lineHeight: '1.6' }}>
            Harness the power of your user base to create the most accurate fuel pricing network ever built.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto"
          style={{ gap: '1.5rem', marginBottom: '3rem' }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center"
                style={{ padding: '2rem' }}
                variants={itemVariants}
              >
                <div className="flex flex-col items-center" style={{ gap: '1rem' }}>
                  <div className="text-blue-600" style={{ fontSize: '2rem' }}>
                    <Icon />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{feature.title}</h3>
                    <p className="text-gray-700" style={{ lineHeight: '1.6', fontSize: '0.95rem' }}>{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* How it works overview */}
        <motion.div
          className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl max-w-4xl mx-auto text-center"
          style={{ padding: '2.5rem' }}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="font-bold text-center" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>What Users Do:</h3>
          <ul className="max-w-xl mx-auto text-left" style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li className="flex items-center gap-3">
              <span className="text-lg">✓</span>
              <span>Confirm fuel prices when they fill up at any station</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-lg">✓</span>
              <span>Report availability (diesel out, premium available, etc.)</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-lg">✓</span>
              <span>See real market insights across your travel network</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-lg">✓</span>
              <span>Earn badges and rewards for participation</span>
            </li>
          </ul>
          <p className="opacity-90 text-center max-w-xl mx-auto" style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
            The network becomes more valuable the more people participate. This is how you build an unbeatable competitive advantage.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
