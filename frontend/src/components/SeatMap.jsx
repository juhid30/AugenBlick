import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  UserX,
  Coffee,
  Printer,
  Monitor,
  DoorOpen,
} from "lucide-react";
import EmployeeDetails from "./EmployeeDetails";
import { getEmployeeById } from "../data/mockData";

const SeatMap = ({ seatMap, loading }) => {
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleSeatClick = (seat) => {
    if (seat.employeeId) {
      setSelectedSeat(seat);
      setShowDetails(true);
    }
  };

  const closeDetails = () => {
    setShowDetails(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-blue-500"
        >
          <Users size={40} />
        </motion.div>
      </div>
    );
  }

  // Group seats by floor areas
  const mainArea = seatMap.seats.filter((seat) => seat.row <= 2);
  const secondaryArea = seatMap.seats.filter((seat) => seat.row > 2);

  return (
    <div className="relative">
      <div className="mb-6">
        <div className="flex items-center gap-6 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-green-500"></div>
            <span className="text-sm">Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-red-500"></div>
            <span className="text-sm">Absent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-gray-300"></div>
            <span className="text-sm">Unassigned</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 p-8 rounded-lg">
        {/* Office Layout */}
        <div className="relative mb-10">
          {/* Office Entrance */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
            <DoorOpen size={28} className="text-blue-800 mb-1" />
            <div className="bg-blue-800 text-white py-2 px-8 rounded-md text-sm">
              Office Entrance
            </div>
          </div>

          {/* Office Border */}
          <div className="border-4 border-gray-400 rounded-lg p-6 pt-10">
            {/* Facilities */}
            <div className="flex justify-between mb-10">
              <motion.div
                className="bg-blue-100 p-3 rounded-lg flex items-center"
                whileHover={{ scale: 1.05 }}
              >
                <Coffee size={20} className="text-blue-800 mr-2" />
                <span className="text-sm font-medium">Coffee Area</span>
              </motion.div>

              <motion.div
                className="bg-blue-100 p-3 rounded-lg flex items-center"
                whileHover={{ scale: 1.05 }}
              >
                <Printer size={20} className="text-blue-800 mr-2" />
                <span className="text-sm font-medium">Printer Station</span>
              </motion.div>
            </div>

            {/* Main Workspace Area */}
            <div className="mb-12">
              <div className="flex items-center mb-4">
                <Monitor size={18} className="text-blue-800 mr-2" />
                <h3 className="text-lg font-medium">Main Workspace</h3>
              </div>

              {/* Workstation Clusters */}
              <div className="flex justify-center gap-16">
                {/* Left Cluster */}
                <div className="flex flex-col items-center">
                  <div className="w-40 h-3 bg-gray-400 rounded-t-md"></div>
                  <div className="flex gap-4 mb-4">
                    {mainArea
                      .slice(0, 3)
                      .map((seat) => renderSeat(seat, handleSeatClick))}
                  </div>
                  <div className="w-40 h-3 bg-gray-400 rounded-t-md transform rotate-180"></div>
                  <div className="flex gap-4">
                    {mainArea
                      .slice(3, 6)
                      .map((seat) => renderSeat(seat, handleSeatClick))}
                  </div>
                </div>

                {/* Right Cluster */}
                <div className="flex flex-col items-center">
                  <div className="w-40 h-3 bg-gray-400 rounded-t-md"></div>
                  <div className="flex gap-4 mb-4">
                    {mainArea
                      .slice(6, 9)
                      .map((seat) => renderSeat(seat, handleSeatClick))}
                  </div>
                  <div className="w-40 h-3 bg-gray-400 rounded-t-md transform rotate-180"></div>
                  <div className="flex gap-4">
                    {mainArea
                      .slice(9, 12)
                      .map((seat) => renderSeat(seat, handleSeatClick))}
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Area */}
            <div>
              <div className="flex items-center mb-4">
                <Monitor size={18} className="text-blue-800 mr-2" />
                <h3 className="text-lg font-medium">Development Team</h3>
              </div>

              {/* Single Row of Workstations */}
              <div className="flex justify-center">
                <div className="flex flex-col items-center">
                  <div className="w-full h-3 bg-gray-400 rounded-t-md"></div>
                  <div className="flex gap-4">
                    {secondaryArea.map((seat) =>
                      renderSeat(seat, handleSeatClick)
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDetails && selectedSeat && selectedSeat.employeeId && (
        <EmployeeDetails
          employee={getEmployeeById(selectedSeat.employeeId)}
          isPresent={selectedSeat.isPresent}
          onClose={closeDetails}
        />
      )}
    </div>
  );
};

// Helper function to render individual seats
const renderSeat = (seat, handleClick) => {
  const employee = seat.employeeId ? getEmployeeById(seat.employeeId) : null;

  let bgColor = "bg-gray-300"; // Unassigned
  if (seat.employeeId) {
    bgColor = seat.isPresent ? "bg-green-500" : "bg-red-500";
  }

  return (
    <motion.div
      key={seat.id}
      className={`${bgColor} rounded-md w-12 h-12 cursor-pointer transition-colors duration-200 flex flex-col items-center justify-center shadow-md`}
      whileHover={{
        scale: 1.1,
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      }}
      whileTap={{ scale: 0.95 }}
      onClick={() => handleClick(seat)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: seat.row * 0.1 + seat.column * 0.05 }}
    >
      <div className="text-white text-xs font-medium mb-1">
        {seat.row}-{seat.column}
      </div>
      {employee && (
        <div className="flex flex-col items-center">
          {seat.isPresent ? (
            <UserCheck size={16} className="text-white" />
          ) : (
            <UserX size={16} className="text-white" />
          )}
        </div>
      )}
    </motion.div>
  );
};

export default SeatMap;
