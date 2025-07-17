import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBook, FiUsers, FiTrendingUp, FiAward } = FiIcons;

const Features = () => {
  const features = [
    {
      icon: FiBook,
      title: 'Comprehensive Test Prep',
      description: 'Access thousands of practice questions, detailed explanations, and study materials for all major standardized tests.'
    },
    {
      icon: FiUsers,
      title: 'Expert Instructors',
      description: 'Learn from certified teachers and test prep specialists with proven track records of student success.'
    },
    {
      icon: FiTrendingUp,
      title: 'Track Progress',
      description: 'Monitor your improvement with detailed analytics, performance insights, and personalized study recommendations.'
    },
    {
      icon: FiAward,
      title: 'Proven Results',
      description: 'Join thousands of students who have improved their scores and achieved their academic goals with our platform.'
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Why Choose TestPrepPundits?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Discover the features that make our platform the top choice for test preparation
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mb-6">
                <SafeIcon icon={feature.icon} className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;