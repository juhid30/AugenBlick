import { useState } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import { 
  FiUser, 
  FiCalendar, 
  FiClock, 
  FiFileText, 
  FiLogOut,
  FiPlus
} from 'react-icons/fi'
import AttendanceList from '../components/UserDashboard/AttendanceList'
import AttendanceSummary from '../components/UserDashboard/AttendanceSummary'
import LeaveList from '../components/UserDashboard/LeaveList'

// Mock data
const user = {
  name: "Alex Johnson",
  position: "Senior Developer",
  department: "Engineering",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg"
}

const attendanceData = [
  { 
    date: "2023-05-01", 
    status: "present", 
    check_in_time: "09:00 AM", 
    check_out_time: "05:30 PM", 
    work_hours: 8.5,
    overtime: 1.5
  },
  { 
    date: "2023-05-02", 
    status: "late", 
    check_in_time: "10:15 AM", 
    check_out_time: "06:45 PM", 
    work_hours: 8.5,
    overtime: 1.5
  },
  { 
    date: "2023-05-03", 
    status: "absent", 
    check_in_time: "-", 
    check_out_time: "-", 
    work_hours: 0,
    overtime: 0
  },
  { 
    date: "2023-05-04", 
    status: "present", 
    check_in_time: "08:45 AM", 
    check_out_time: "05:00 PM", 
    work_hours: 8.25,
    overtime: 1.25
  },
  { 
    date: "2023-05-05", 
    status: "present", 
    check_in_time: "09:00 AM", 
    check_out_time: "04:30 PM", 
    work_hours: 7.5,
    overtime: 0.5
  }
];

const leaveData = [
  {
    id: 1,
    leave_type: "Sick Leave",
    reason: "Fever and cold",
    start_date: "2023-04-10",
    end_date: "2023-04-12",
    status: "approved",
    pdf_link: "https://example.com/leave-docs/sick-leave-1.pdf"
  },
  {
    id: 2,
    leave_type: "Vacation",
    reason: "Family trip",
    start_date: "2023-06-15",
    end_date: "2023-06-22",
    status: "pending",
    pdf_link: "https://example.com/leave-docs/vacation-1.pdf"
  },
  {
    id: 3,
    leave_type: "Personal Leave",
    reason: "Personal matters",
    start_date: "2023-03-05",
    end_date: "2023-03-05",
    status: "approved",
    pdf_link: "https://example.com/leave-docs/personal-1.pdf"
  }
];

const Dashboard = () => {
  const [activeView, setActiveView] = useState('attendance') // 'attendance' or 'leave'

  return (
    <>
      {/* Page Title */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              {activeView === 'attendance' ? 'Attendance History' : 'Leave Management'}
            </h1>
            <p className="mt-2 text-gray-600 lg:text-lg">
              {activeView === 'attendance' 
                ? 'Track your attendance and work hours' 
                : 'Manage your leave requests and applications'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-white rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => setActiveView('attendance')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'attendance'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Attendance
              </button>
              <button
                onClick={() => setActiveView('leave')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'leave'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Leave
              </button>
            </div>
            {activeView === 'leave' && (
              <Link 
                to="/apply-leave"
                className="btn-primary flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
              >
                <FiPlus className="mr-2 h-4 w-4" />
                Apply Leave
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* User Profile Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="gradient-border mb-8"
      >
        <div className="bg-gradient-to-r from-gray-50 to-white">
          <div className="flex flex-col md:flex-row items-center p-4 sm:p-6 lg:p-8">
            <div className="flex-shrink-0 mb-4 md:mb-0 relative">
              <div className="h-24 w-24 sm:h-28 sm:w-28 lg:h-32 lg:w-32 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 flex items-center justify-center p-1">
                <img 
                  className="h-full w-full rounded-full object-cover border-4 border-white" 
                  src={user.avatar} 
                  alt={user.name} 
                />
              </div>
              <div className="absolute bottom-0 right-0 bg-green-500 h-5 w-5 rounded-full border-2 border-white"></div>
            </div>
            <div className="md:ml-8 text-center md:text-left">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600 lg:text-lg">{user.position} • {user.department}</p>
              
              <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2 sm:gap-4">
                <div className="flex items-center text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 sm:px-3 py-1.5 rounded-full">
                  <FiUser className="mr-1 sm:mr-1.5 h-3 w-3 sm:h-4 sm:w-4 text-primary-500" />
                  <span>ID: EMP10234</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 sm:px-3 py-1.5 rounded-full">
                  <FiCalendar className="mr-1 sm:mr-1.5 h-3 w-3 sm:h-4 sm:w-4 text-primary-500" />
                  <span>Joined: Jan 15, 2022</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 sm:px-3 py-1.5 rounded-full">
                  <FiClock className="mr-1 sm:mr-1.5 h-3 w-3 sm:h-4 sm:w-4 text-primary-500" />
                  <span>9:00 AM - 5:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {activeView === 'attendance' ? (
        <>
          {/* Attendance Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="analytics-grid"
          >
            <AttendanceSummary attendanceData={attendanceData} />
          </motion.div>

          {/* Attendance List */}
          <div className="mt-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <AttendanceList attendanceData={attendanceData} />
            </motion.div>
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <LeaveList leaveData={leaveData} />
        </motion.div>
      )}
    </>
  )
}

export default Dashboard