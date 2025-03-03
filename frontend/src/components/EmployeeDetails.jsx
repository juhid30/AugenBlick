import React from "react";
import { motion } from "framer-motion";
import {
  X,
  Mail,
  Phone,
  UserCheck,
  UserX,
  Building,
  Briefcase,
} from "lucide-react";

const EmployeeDetails = ({ employee, isPresent, onClose }) => {
  if (!employee) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <div
            className={`h-24 ${isPresent ? "bg-green-500" : "bg-red-500"}`}
          ></div>
          <button
            className="absolute top-4 right-4 bg-white rounded-full p-1 shadow-md"
            onClick={onClose}
          >
            <X size={20} />
          </button>
          <div className="absolute -bottom-12 left-6">
            <div className="rounded-full border-4 border-white overflow-hidden h-24 w-24">
              <img
                src={
                  employee.imageUrl ||
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                }
                alt={employee.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="pt-16 pb-6 px-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold">{employee.name}</h3>
              <div className="flex items-center mt-1 text-gray-600">
                <Briefcase size={16} className="mr-1" />
                <span className="text-sm">{employee.position}</span>
              </div>
            </div>
            <div
              className={`flex items-center ${
                isPresent ? "text-green-500" : "text-red-500"
              } font-medium`}
            >
              {isPresent ? (
                <>
                  <UserCheck size={20} className="mr-1" />
                  <span>Present</span>
                </>
              ) : (
                <>
                  <UserX size={20} className="mr-1" />
                  <span>Absent</span>
                </>
              )}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center">
              <Building size={18} className="text-gray-500 mr-3" />
              <div>
                <div className="text-sm text-gray-500">Department</div>
                <div>{employee.department}</div>
              </div>
            </div>

            <div className="flex items-center">
              <Mail size={18} className="text-gray-500 mr-3" />
              <div>
                <div className="text-sm text-gray-500">Email</div>
                <div>{employee.email}</div>
              </div>
            </div>

            {employee.phone && (
              <div className="flex items-center">
                <Phone size={18} className="text-gray-500 mr-3" />
                <div>
                  <div className="text-sm text-gray-500">Phone</div>
                  <div>{employee.phone}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EmployeeDetails;
