'use client';

import { motion } from 'framer-motion';
import { FaBolt, FaLocationDot, FaMoneyBillWave, FaTrophy, FaShield, FaBullseye } from 'react-icons/fa6';

export default function Features() {
  const features = [
    {
      icon: FaBolt,
      title: 'Real-Time Updates',
      description: 'Prices update instantly as users submit data. No more waiting for weekly government reports.'
    },
    {
      icon: FaLocationDot,
      title: 'Hyper-Local Data',
      description: 'Spot prices specific to each station and region. Know exactly what you\'ll pay before you pump.'
    },
    {
      icon: FaMoneyBillWave,
      title: 'Save on Fuel',
      description: 'Find the cheapest stations on your route and optimize your fuel stops for maximum savings.'
    },
    {
      icon: FaTrophy,
      title: 'Rewards Program - Coming soon',
      description: 'Earn badges and points for contributions. Unlock special perks and community status.'
    },
    {
      icon: FaShield,
      title: 'Data Privacy',
      description: 'Your data is secure and anonymized. We never share personal information with third parties.'
    },
    {
      icon: FaBullseye,
      title: 'Accurate Insights',
      description: 'Machine learning validates submissions to ensure accuracy and prevent manipulation.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
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
          <h2 className="font-bold text-gray-900" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Powerful Features</h2>
          <p className="text-gray-600 max-w-3xl mx-auto" style={{ fontSize: '1.15rem', lineHeight: '1.6' }}>
            Everything you need for smarter fuel decisions and better savings.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          style={{ gap: '1.5rem' }}
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
                className="group bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl hover:shadow-lg hover:border-blue-300 transition-all duration-300"
                style={{ padding: '2rem' }}
                variants={itemVariants}
              >
                <div className="text-blue-600 group-hover:scale-110 transition-transform duration-300" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                  <Icon />
                </div>
                <h3 className="font-bold text-gray-900" style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{feature.title}</h3>
                <p className="text-gray-600" style={{ lineHeight: '1.6' }}>{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Competitive Advantages */}
        <motion.div
          className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl max-w-5xl mx-auto"
          style={{ marginTop: '3rem', padding: '2.5rem' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="font-bold" style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Why We're Different</h3>
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '2rem' }}>
            <div>
              <h4 className="font-semibold" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Traditional APIs</h4>
              <ul className="opacity-90" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li>❌ 12 hrs to days delayed</li>
                <li>❌ Does not rely on commodity futures</li>
                <li>❌ High cost</li>
                <li>❌ Limited coverage</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Our Network</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li>✅ Instant real-time data</li>
                <li>✅ Actual spot prices</li>
                <li>✅ Cost-effective at scale</li>
                <li>✅ Complete coverage</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
