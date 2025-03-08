import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Calendar, UserCheck } from "lucide-react";

const features = [
  {
    title: "Attendance Tracking",
    description:
      "Real-time attendance tracking with geolocation and facial recognition options.",
    icon: "Clock",
  },
  {
    title: "Leave Management",
    description: "Streamlined leave requests, approvals, and balance tracking.",
    icon: "Calendar",
  },
  {
    title: "Employee Profiles",
    description:
      "Comprehensive employee profiles with performance metrics and history.",
    icon: "UserCheck",
  },
];

const About = () => {
  const renderIcon = (iconName) => {
    switch (iconName) {
      case "Clock":
        return <Clock className="h-6 w-6 text-primary-600" />;
      case "Calendar":
        return <Calendar className="h-6 w-6 text-primary-600" />;
      case "UserCheck":
        return <UserCheck className="h-6 w-6 text-primary-600" />;
      default:
        return <CheckCircle className="h-6 w-6 text-primary-600" />;
    }
  };

  return (
    <section id="about" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 mb-5 text-xs font-medium uppercase tracking-wider text-primary-700 bg-primary-100 rounded-full"
          >
            About HRBrick
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-6"
          >
            Revolutionizing HR Management Since 2020
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-600"
          >
            HRBrick was founded with a mission to simplify human resource
            management for businesses of all sizes. Our innovative HRMS solution
            focuses on attendance tracking and leave management, helping
            organizations optimize their workforce and improve employee
            satisfaction.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                {renderIcon(feature.icon)}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Team collaboration"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary-100 rounded-xl -z-10"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold font-display text-gray-900 mb-6">
              Why Choose HRBrick HRMS?
            </h3>
            <div className="space-y-4">
              {[
                "Intuitive and user-friendly interface",
                "Customizable to fit your organization's needs",
                "Real-time data and analytics",
                "Mobile-friendly for on-the-go access",
                "Secure and compliant with data protection regulations",
              ].map((item, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary-600 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-gray-700">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 text-center">
              <div className="bg-primary-50 p-4 rounded-lg">
                <p className="text-3xl font-bold text-primary-700">98%</p>
                <p className="text-sm text-gray-600">Customer Satisfaction</p>
              </div>
              <div className="bg-primary-50 p-4 rounded-lg">
                <p className="text-3xl font-bold text-primary-700">500+</p>
                <p className="text-sm text-gray-600">Companies Trust Us</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
