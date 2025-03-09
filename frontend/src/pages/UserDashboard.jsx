import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { FiUser, FiCalendar, FiClock, FiFileText, FiLogOut, FiPlus, FiMapPin, FiBriefcase, FiMail } from "react-icons/fi";
import AttendanceList from "../components/UserDashboard/AttendanceList";
import AttendanceSummary from "../components/UserDashboard/AttendanceSummary";
import LeaveList from "../components/UserDashboard/LeaveList";

const attendanceDataa = [
  { date: "2025-05-01", status: "present", check_in_time: "09:00 AM", check_out_time: "05:30 PM", work_hours: 8.5, overtime: 1.5 },
  { date: "2025-05-02", status: "late", check_in_time: "10:15 AM", check_out_time: "06:45 PM", work_hours: 8.5, overtime: 1.5 },
  { date: "2025-05-03", status: "absent", check_in_time: "-", check_out_time: "-", work_hours: 0, overtime: 0 },
  { date: "2025-05-04", status: "present", check_in_time: "08:45 AM", check_out_time: "05:00 PM", work_hours: 8.25, overtime: 1.25 },
  { date: "2025-05-05", status: "present", check_in_time: "09:00 AM", check_out_time: "04:30 PM", work_hours: 7.5, overtime: 0.5 }
];

const leaveDataa = [
  { id: 1, leave_type: "Sick Leave", reason: "Fever and cold", start_date: "2025-04-10", end_date: "2025-04-12", status: "approved", pdf_link: "https://example.com/leave-docs/sick-leave-1.pdf" },
  { id: 2, leave_type: "Vacation", reason: "Family trip", start_date: "2025-06-15", end_date: "2025-06-22", status: "pending", pdf_link: "https://example.com/leave-docs/vacation-1.pdf" },
  { id: 3, leave_type: "Personal Leave", reason: "Personal matters", start_date: "2025-03-05", end_date: "2025-03-05", status: "approved", pdf_link: "https://example.com/leave-docs/personal-1.pdf" }
];

const token = localStorage.getItem("token");

function maskString(str) {
  if (!str || str.length <= 8) {
    return '*'.repeat(str ? str.length : 8); // If too short or undefined, mask everything
  }
  return str.slice(0, 4) + '*'.repeat(str.length - 8) + str.slice(-4);
}

const UserDashboard = () => {
  const [activeView, setActiveView] = useState("attendance"); // 'attendance' or 'leave'
  const [user, setUser] = useState(null);
  const [leaveData, setLeaveData] = useState(leaveDataa);
  const [attendanceData, setAttendanceData] = useState(attendanceDataa);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getLeaves = async () => {
    const token = localStorage.getItem("token"); // Get token from localStorage

    if (!token) {
      console.error("No token found in localStorage");
      throw new Error("No token found in localStorage");
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/get-leaves", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token as Bearer
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch leave data");
      }

      setLeaveData((prevLeaveData) => [...prevLeaveData, ...data]);
    } catch (err) {
      console.error("Error fetching leave data:", err.message);
      throw err; // Rethrow the error to be caught by useEffect's try-catch
    }
  };

  const getAttendance = async () => {
    const token = localStorage.getItem("token"); // Get token from localStorage

    if (!token) {
      console.error("No token found in localStorage");
      throw new Error("No token found in localStorage");
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/get-attendance", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token as Bearer
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch attendance data");
      }

      setAttendanceData((prevAttendanceData) => [...prevAttendanceData, ...data]);
    } catch (err) {
      console.error("Error fetching attendance data:", err.message);
      throw err; // Rethrow the error to be caught by useEffect's try-catch
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const localUser = JSON.parse(localStorage.getItem("user"));
      setUser({
        name: localUser?.fullname || "John Doe",
        position: "Senior Developer",
        department: localUser?.team || "Development",
        email: localUser?.email || "john.doe@example.com",
        location: "San Francisco, CA",
        avatar: localUser?.avatar || "https://firebasestorage.googleapis.com/v0/b/librarymanagementmpr.appspot.com/o/Screenshot%202025-03-05%20at%201.00.26%E2%80%AFPM.png?alt=media&token=f0b24fb4-44c5-4d9a-9b80-4d68959e0189",
        id: localUser?._id || "12345",
      });

      try {
        setIsLoading(true); // Set loading state to true while fetching data
        setError(null); // Reset any previous errors

        // Call both functions concurrently
        await Promise.all([getLeaves(), getAttendance()]);
      } catch (err) {
        // Handle any error from either of the functions
        setError("An error occurred while fetching data: " + err.message);
      } finally {
        setIsLoading(false); // Set loading state to false when done
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  return (
    <div>
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {activeView === "attendance" ? "Attendance Dashboard" : "Leave Management"}
              </h1>
              <p className="mt-1 text-sm text-gray-500">{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-1">
                <button
                  onClick={() => setActiveView("attendance")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeView === "attendance" ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <FiClock className="inline-block mr-2 h-4 w-4" />
                  Attendance
                </button>
                <button
                  onClick={() => setActiveView("leave")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeView === "leave" ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <FiCalendar className="inline-block mr-2 h-4 w-4" />
                  Leave
                </button>
              </div>

              {activeView === "leave" && (
                <Link
                  to="/leave"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  <FiPlus className="mr-2 h-4 w-4" />
                  Apply Leave
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8"
        >
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full ring-4 ring-indigo-50">
                  <img src={user?.avatar || "https://randomuser.me/api/portraits/men/32.jpg"} alt={user?.name || "User"} className="h-full w-full rounded-full object-cover" />
                </div>
                <div className="absolute bottom-0 right-0 h-5 w-5 bg-green-400 rounded-full ring-4 ring-white"></div>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-gray-900">{user?.name || "John Doe"}</h2>
                <p className="text-indigo-600 font-medium">{user?.position || "Position"}</p>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-500">
                    <FiBriefcase className="h-5 w-5 text-gray-400 mr-2" />
                    {user?.department || "Department"}
                  </div>
                  <div className="flex items-center text-gray-500">
                    <FiMapPin className="h-5 w-5 text-gray-400 mr-2" />
                    {user?.location || "Location"}
                  </div>
                  <div className="flex items-center text-gray-500">
                    <FiMail className="h-5 w-5 text-gray-400 mr-2" />
                    {user?.email || "user@example.com"}
                  </div>
                  <div className="flex items-center text-gray-500">
                    <FiClock className="h-5 w-5 text-gray-400 mr-2" />
                    9:00 AM - 5:00 PM
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:text-right">
                <div className="px-4 py-2 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Status</p>
                  <p className="text-green-700 font-semibold">Active</p>
                </div>
                <div className="px-4 py-2 bg-indigo-50 rounded-lg">
                  <p className="text-sm text-indigo-600 font-medium">Employee ID</p>
                  <p className="text-indigo-700 font-semibold">{maskString(user?.id) || maskString("67c80aa223ab541149f01d47")}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex justify-between items-center text-sm">
              <div className="text-gray-500">
                Member since {format(new Date("2022-01-15"), "MMMM yyyy")}
              </div>
              <Link to="/profile" className="text-indigo-600 hover:text-indigo-800 font-medium">
                View Full Profile
              </Link>
            </div>
          </div>
        </motion.div>

        {activeView === "attendance" ? (
          <>
            <AttendanceSummary attendanceData={attendanceData} />
            <div className="mt-8">
              <AttendanceList attendanceData={attendanceData} />
            </div>
          </>
        ) : (
          <LeaveList leaveData={leaveData} />
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
