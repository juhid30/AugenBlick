import React from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Calendar,
  UserCheck,
  FileText,
  PieChart,
  Shield,
} from "lucide-react";

const services = [
  {
    title: "Attendance Management",
    description:
      "Track employee attendance with precision using our advanced biometric and geolocation features.",
    icon: "Clock",
    imageUrl:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Leave Management",
    description:
      "Streamline leave requests and approvals with automated workflows and balance tracking.",
    icon: "Calendar",
    imageUrl:
      "https://images.unsplash.com/photo-1586473219010-2ffc57b0d282?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Employee Profiles",
    description:
      "Maintain comprehensive employee records with performance metrics and career development tracking.",
    icon: "UserCheck",
    imageUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Reporting & Analytics",
    description:
      "Generate insightful reports on attendance patterns, leave utilization, and workforce metrics.",
    icon: "PieChart",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Document Management",
    description:
      "Securely store and manage employee documents with version control and access permissions.",
    icon: "FileText",
    imageUrl:
      "https://images.unsplash.com/photo-1568992687947-868a62a9f521?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Data Security",
    description:
      "Protect sensitive HR data with enterprise-grade security features and compliance measures.",
    icon: "Shield",
    imageUrl:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
  },
];

const Services = () => {
  const renderIcon = (iconName) => {
    switch (iconName) {
      case "Clock":
        return <Clock className="h-6 w-6 text-white" />;
      case "Calendar":
        return <Calendar className="h-6 w-6 text-white" />;
      case "UserCheck":
        return <UserCheck className="h-6 w-6 text-white" />;
      case "PieChart":
        return <PieChart className="h-6 w-6 text-white" />;
      case "FileText":
        return <FileText className="h-6 w-6 text-white" />;
      case "Shield":
        return <Shield className="h-6 w-6 text-white" />;
      default:
        return <Clock className="h-6 w-6 text-white" />;
    }
  };

  return (
    <section id="services" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 mb-5 text-xs font-medium uppercase tracking-wider text-primary-700 bg-primary-100 rounded-full"
          >
            Our Services
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-6"
          >
            Comprehensive HR Solutions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-600"
          >
            HRBrick offers a suite of integrated HR services designed to
            streamline your workforce management and enhance employee
            experience.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                />
                <div className="absolute top-4 left-4 w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center">
                  {renderIcon(service.icon)}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
