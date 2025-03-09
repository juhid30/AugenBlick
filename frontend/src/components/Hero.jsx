import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Calendar, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden bg-gradient-to-b from-white to-primary-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-xl"
          >
            <motion.span
              variants={itemVariants}
              className="inline-block px-4 py-1.5 mb-5 text-xs font-medium uppercase tracking-wider text-primary-700 bg-primary-100 rounded-full"
            >
              Human Resource Management System
            </motion.span>
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-gray-900 leading-tight mb-6"
            >
              Simplify Your{" "}
              <span className="text-primary-600">HR Management</span> Process
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-600 mb-8"
            >
              HRBrick's comprehensive HRMS solution streamlines attendance
              tracking and leave management, helping you focus on what matters
              most - your people.
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors group"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-white hover:bg-gray-100 text-primary-600 font-medium rounded-md border border-primary-200 transition-colors"
              >
                Contact Sales
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative"
          >
            <div className="relative z-10 bg-white p-6 rounded-xl shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-primary-50 p-4 rounded-lg">
                  <Clock className="h-8 w-8 text-primary-600 mb-2" />
                  <h3 className="font-semibold text-gray-800">Attendance</h3>
                  <p className="text-sm text-gray-600">Real-time tracking</p>
                </div>
                <div className="bg-primary-50 p-4 rounded-lg">
                  <Calendar className="h-8 w-8 text-primary-600 mb-2" />
                  <h3 className="font-semibold text-gray-800">Leave</h3>
                  <p className="text-sm text-gray-600">Simplified requests</p>
                </div>
                <div className="bg-primary-50 p-4 rounded-lg">
                  <Users className="h-8 w-8 text-primary-600 mb-2" />
                  <h3 className="font-semibold text-gray-800">Employees</h3>
                  <p className="text-sm text-gray-600">Complete profiles</p>
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Today's Attendance</h3>
                  <span className="text-sm text-primary-600">View All</span>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 bg-white rounded"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 font-medium">
                          {String.fromCharCode(64 + i)}
                        </div>
                        <span className="ml-2 text-sm font-medium">
                          Employee {i}
                        </span>
                      </div>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                        On Time
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-10 -right-6 w-24 h-24 bg-secondary-200 rounded-full opacity-50 blur-xl"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary-200 rounded-full opacity-50 blur-xl"></div>
          </motion.div>
        </div>
      </div>

      {/* Wave decoration */}
        <div className="absolute  -bottom-10 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
