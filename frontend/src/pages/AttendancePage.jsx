import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SeatMap from "../components/SeatMap";
import AttendanceHeader from "../components/AttendanceHeader";
import {
  fetchAttendanceData,
  mockSeatMap,
  getDepartmentStats,
} from "../data/mockData";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto"; // Automatically includes necessary chart types like Bar, Doughnut, etc.
import { SignalZero } from "lucide-react";

const AttendancePage = () => {
  const [loading, setLoading] = useState(true);
  const [seatMap, setSeatMap] = useState(mockSeatMap);
  const [attendanceData, setAttendanceData] = useState([]);
  const [departmentStats, setDepartmentStats] = useState([]);

  // Load Attendance Data
  const loadAttendanceData = async () => {
    setLoading(true);
    try {
      const data = await fetchAttendanceData();
      setAttendanceData(data);
      setSeatMap({
        ...mockSeatMap,
        seats: data,
      });
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load Department Stats
  const loadDepartmentStats = async () => {
    try {
      const stats = await getDepartmentStats();
      setDepartmentStats(stats);
    } catch (error) {
      console.error("Error fetching department stats:", error);
    }
  };

  useEffect(() => {
    loadAttendanceData();
    loadDepartmentStats();
  }, []);

  // Calculate attendance stats
  const totalEmployees = attendanceData.filter(
    (seat) => seat.employeeId
  ).length;
  const presentCount = attendanceData.filter(
    (seat) => seat.employeeId && seat.isPresent
  ).length;
  const absentCount = totalEmployees - presentCount;

  // Overall attendance data for doughnut chart
  const attendanceChartData = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        data: [presentCount, absentCount],
        backgroundColor: ["#4caf50", "#f44336"],
        hoverBackgroundColor: ["#388e3c", "#d32f2f"],
      },
    ],
  };

  // Department-wise attendance data for bar chart
  const departmentChartData = {
    labels: departmentStats.map((dept) => dept.department),
    datasets: [
      {
        label: "Present Employees",
        data: departmentStats.map((dept) => dept.presentCount),
        backgroundColor: "#4caf50",
        borderColor: "#388e3c",
        borderWidth: 1,
      },
      {
        label: "Total Employees",
        data: departmentStats.map((dept) => dept.totalEmployees),
        backgroundColor: "#f44336",
        borderColor: "#d32f2f",
        borderWidth: 1,
      },
    ],
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto px-6 py-10 space-y-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section */}
      <AttendanceHeader
        totalEmployees={totalEmployees}
        presentCount={presentCount}
        onRefresh={loadAttendanceData}
        isLoading={loading}
      />

      {/* Attendance Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">Overall Attendance</h2>
          <Doughnut data={attendanceChartData} />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">
            Department-wise Attendance
          </h2>
          <Bar data={departmentChartData} />
        </div>
      </div>

      {/* Seat Map Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">Office Seat Map</h2>
        <SeatMap seatMap={seatMap} loading={loading} />
      </div>
    </motion.div>
  );
};

export default AttendancePage;
