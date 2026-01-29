'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { FiHeart, FiShield, FiUsers, FiStar, FiArrowRight } from 'react-icons/fi'

export default function Home() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lavender-400 to-rose-400 flex items-center justify-center">
                <FiHeart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-lavender-800">Maternal Wellness</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              {session ? (
                <Link
                  href="/dashboard"
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-lavender-500 to-rose-400 text-white font-medium hover:shadow-lg transition-shadow btn-glow"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-lavender-700 hover:text-lavender-900 font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="px-6 py-2 rounded-full bg-gradient-to-r from-lavender-500 to-rose-400 text-white font-medium hover:shadow-lg transition-shadow btn-glow"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-lavender-600 via-rose-500 to-peach-500 bg-clip-text text-transparent">
                Your Journey,
              </span>
              <br />
              <span className="text-lavender-800">Supported</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-lavender-700 max-w-2xl mx-auto mb-10"
            >
              A gentle, supportive space for mothers during pregnancy and beyond.
              Take care of your mental wellness with guided resources made just for you.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/register"
                className="group inline-flex items-center justify-center px-8 py-4 rounded-full bg-gradient-to-r from-lavender-500 to-rose-400 text-white text-lg font-semibold hover:shadow-xl transition-all btn-glow"
              >
                Start Your Journey
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full glass text-lavender-700 text-lg font-semibold hover:bg-white/80 transition-all"
              >
                Learn More
              </Link>
            </motion.div>
          </div>

          {/* Floating illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-16 relative"
          >
            <div className="max-w-3xl mx-auto">
              <div className="glass rounded-3xl p-8 shadow-2xl">
                <div className="aspect-video rounded-2xl bg-gradient-to-br from-lavender-100 via-rose-50 to-peach-50 flex items-center justify-center">
                  <div className="text-center">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-lavender-300 to-rose-300 flex items-center justify-center"
                    >
                      <FiHeart className="w-16 h-16 text-white" />
                    </motion.div>
                    <p className="text-lavender-600 text-lg font-medium">
                      Personalized wellness tracks await you
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-lavender-800 mb-4">
              Supporting You Every Step
            </h2>
            <p className="text-xl text-lavender-600 max-w-2xl mx-auto">
              Comprehensive resources designed by experts, delivered with love
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: FiHeart,
                title: 'Emotional Support',
                description: 'Understand and manage your emotions with guided resources',
                color: 'from-rose-400 to-rose-500',
              },
              {
                icon: FiShield,
                title: 'Safe Space',
                description: 'A judgment-free environment focused on your wellbeing',
                color: 'from-lavender-400 to-lavender-500',
              },
              {
                icon: FiUsers,
                title: 'Expert Content',
                description: 'Resources created with maternal mental health experts',
                color: 'from-sky-400 to-sky-500',
              },
              {
                icon: FiStar,
                title: 'Track Progress',
                description: 'Visual journey through your wellness milestones',
                color: 'from-peach-400 to-peach-500',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-6 card-lift"
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-lavender-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-lavender-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-lavender-800 mb-4">
              5 Wellness Categories
            </h2>
            <p className="text-xl text-lavender-600 max-w-2xl mx-auto">
              Explore comprehensive tracks designed to support every aspect of your journey
            </p>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-4">
            {[
              { name: 'Emotional Wellness', color: 'bg-rose-400', icon: '💜' },
              { name: 'Physical Health', color: 'bg-sage-400', icon: '🌿' },
              { name: 'Relationships', color: 'bg-sky-400', icon: '🤝' },
              { name: 'Baby Care', color: 'bg-peach-400', icon: '👶' },
              { name: 'Self-Care', color: 'bg-lavender-400', icon: '✨' },
            ].map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="glass rounded-2xl p-6 text-center card-lift cursor-pointer"
              >
                <div
                  className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 text-2xl`}
                >
                  {category.icon}
                </div>
                <h3 className="font-semibold text-lavender-800">{category.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-12 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-lavender-800 mb-4">
              Ready to Begin?
            </h2>
            <p className="text-xl text-lavender-600 mb-8 max-w-xl mx-auto">
              Join thousands of mothers who have found support and guidance on their journey.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-gradient-to-r from-lavender-500 to-rose-400 text-white text-lg font-semibold hover:shadow-xl transition-all btn-glow"
            >
              Create Free Account
              <FiArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-lavender-200/50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-lavender-400 to-rose-400 flex items-center justify-center">
              <FiHeart className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-lavender-700">Maternal Wellness</span>
          </div>
          <p className="text-lavender-500">
            Made with 💜 to support mothers everywhere
          </p>
          <p className="text-lavender-400 text-sm mt-2">
            © 2024 Maternal Wellness. A project for maternal mental health support.
          </p>
        </div>
      </footer>
    </div>
  )
}
