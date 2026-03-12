'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function ImageCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const images = [
    { src: '/images/prices.png', title: 'Real-Time Prices' },
    { src: '/images/Map_Screen_1.png', title: 'Location Map' },
    { src: '/images/trip_planner.png', title: 'Trip Planning' },
    { src: '/images/settings_2.png', title: 'Settings' },
    { src: '/images/Map_Screen_1_TF.png', title: 'Enhanced Map' },
    { src: '/images/Freshness_Modal.png', title: 'Data Fresh' },
    { src: '/images/load_bucees.png', title: 'Load Info' },
  ];

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let scrollPos = 0;
    const scrollSpeed = 0.75;
    let direction = 1; // 1 for scrolling right, -1 for scrolling left

    const scroll = () => {
      scrollPos += scrollSpeed * direction;
      
      // Reverse direction at the boundaries
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (scrollPos >= maxScroll) {
        scrollPos = maxScroll;
        direction = -1; // Start scrolling left
      } else if (scrollPos <= 0) {
        scrollPos = 0;
        direction = 1; // Start scrolling right
      }
      
      container.scrollLeft = scrollPos;
    };

    const interval = setInterval(scroll, 30);

    // Pause on hover
    const pauseScroll = () => clearInterval(interval);
    const resumeScroll = () => {
      clearInterval(interval);
      const newInterval = setInterval(scroll, 30);
    };

    container.addEventListener('mouseenter', pauseScroll);
    container.addEventListener('mouseleave', resumeScroll);

    return () => {
      clearInterval(interval);
      container.removeEventListener('mouseenter', pauseScroll);
      container.removeEventListener('mouseleave', resumeScroll);
    };
  }, []);

  return (
    <section style={{ width: '100%', paddingTop: '6rem', paddingBottom: '6rem', backgroundColor: '#0f172a', overflow: 'hidden' }}>
      <div className="center-container">
        <motion.div
          className="text-center"
          style={{ marginBottom: '3rem' }}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="font-bold text-white" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
            Powerful Features in Action
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto" style={{ fontSize: '1.15rem', lineHeight: '1.6' }}>
            See exactly what your users get with Rest Stop, Gas Finder, and TripPlanner
          </p>
        </motion.div>

        {/* Carousel Container */}
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Gradient overlays for smooth fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none"></div>

          {/* Scrolling container */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto scroll-smooth"
            style={{ gap: '1.5rem', paddingBottom: '1rem', scrollBehavior: 'smooth' }}
          >
            {images.map((image, index) => (
              <motion.div
                key={index}
                className="flex-shrink-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="group cursor-pointer">
                  <div className="relative w-64 h-[460px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    {/* Image wrapper with aspect ratio */}
                    <div className="relative w-full h-full">
                      <Image
                        src={image.src}
                        alt={image.title}
                        fill
                        className="object-contain group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 256px"
                      />
                    </div>

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <div className="text-white">
                        <h3 className="text-lg font-bold">{image.title}</h3>
                        <p className="text-sm text-gray-300">App Screenshot</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Info text */}
        <motion.div
          className="text-center"
          style={{ marginTop: '2rem' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-400 text-sm">
            ← Scroll to see more app screenshots
          </p>
        </motion.div>
      </div>
    </section>
  );
}
