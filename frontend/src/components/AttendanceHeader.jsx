import React from "react";
import { motion } from "framer-motion";
import { Calendar, Users, UserCheck, UserX, RefreshCw } from "lucide-react";

const AttendanceHeader = ({
  totalEmployees,
  presentCount,
  onRefresh,
  isLoading,
}) => {
  const absentCount = totalEmployees - presentCount;
  const presentPercentage =
    totalEmployees > 0 ? Math.round((presentCount / totalEmployees) * 100) : 0;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Calendar className="mr-2" />
          Office Attendance
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw
            size={18}
            className={`mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </motion.button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <motion.div
          className="bg-white rounded-lg shadow-md p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <Users className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Employees</p>
              <p className="text-2xl font-bold">{totalEmployees}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg shadow-md p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <UserCheck className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Present</p>
              <p className="text-2xl font-bold">
                {presentCount}{" "}
                <span className="text-sm text-gray-500 font-normal">
                  ({presentPercentage}%)
                </span>
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg shadow-md p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-full mr-4">
              <UserX className="text-red-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Absent</p>
              <p className="text-2xl font-bold">
                {absentCount}{" "}
                <span className="text-sm text-gray-500 font-normal">
                  ({100 - presentPercentage}%)
                </span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AttendanceHeader;
