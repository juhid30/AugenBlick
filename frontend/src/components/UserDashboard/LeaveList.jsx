import { useState } from 'react'
import { format, parseISO, isValid } from 'date-fns'
import { motion } from 'framer-motion'
import { 
  FiFileText, 
  FiCalendar, 
  FiClock, 
  FiDownload, 
  FiPlus,
  FiCheck,
  FiX,
  FiAlertCircle,
  FiMoreVertical
} from 'react-icons/fi'

const LeaveList = ({ leaveData }) => {
  const [selectedLeave, setSelectedLeave] = useState(null);

  // Add this helper function for safe date formatting
  const formatDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) {
        return 'Invalid date';
      }
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-100 text-emerald-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <FiCheck className="h-4 w-4" />;
      case 'rejected':
        return <FiX className="h-4 w-4" />;
      case 'pending':
        return <FiClock className="h-4 w-4" />;
      default:
        return <FiAlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Leave Management</h2>
          <p className="text-sm text-gray-500 mt-1">Track and manage your leave applications</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <FiPlus className="mr-2 h-4 w-4" />
          Apply for Leave
        </button>
      </div>

      {/* Leave Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <FiCheck className="h-6 w-6" />
            </div>
            <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">Available</span>
          </div>
          <h3 className="text-3xl font-bold mb-1">15 Days</h3>
          <p className="text-emerald-100">Annual Leave Balance</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <FiClock className="h-6 w-6" />
            </div>
            <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">Pending</span>
          </div>
          <h3 className="text-3xl font-bold mb-1">2</h3>
          <p className="text-blue-100">Leave Requests</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <FiCalendar className="h-6 w-6"/>
            </div>
            <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">This Year</span>
          </div>
          <h3 className="text-3xl font-bold mb-1">8 Used</h3>
          <p className="text-purple-100">Leave Days Taken</p>
        </motion.div>
      </div>

      {/* Leave List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
          {/* Leave Applications List */}
          <div>
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Leave Applications</h3>
              <p className="text-sm text-gray-500 mt-1">Recent leave requests and their status</p>
            </div>
            
            <div className="divide-y divide-gray-200">
              {leaveData.map((leave, index) => (
                <motion.div
                  key={leave.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-6 cursor-pointer transition-colors ${
                    selectedLeave?.id === leave.id ? 'bg-indigo-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedLeave(leave)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <FiFileText className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{leave.leave_type}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(leave.start_date)} - {formatDate(leave.end_date)}
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}>
                      {getStatusIcon(leave.status)}
                      <span className="ml-1">{leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}</span>
                    </span>
                  </div>
                  
                  <p className="mt-4 text-sm text-gray-600 line-clamp-2">{leave.reason}</p>
                  
                  <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <FiCalendar className="h-4 w-4 mr-1" />
                      Applied on {formatDate(leave.start_date)}
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                      <FiDownload className="h-4 w-4 mr-1" />
                      Download
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Leave Details */}
          <div className="bg-gray-50">
            {selectedLeave ? (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Leave Details</h3>
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                    <FiMoreVertical className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Leave Type</h4>
                    <p className="text-base font-medium text-gray-900">{selectedLeave.leave_type}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Duration</h4>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Start Date</p>
                          <p className="text-base font-medium text-gray-900">
                            {formatDate(selectedLeave.start_date)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">End Date</p>
                          <p className="text-base font-medium text-gray-900">
                            {formatDate(selectedLeave.end_date)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Reason</h4>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <p className="text-gray-700">{selectedLeave.reason}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Status</h4>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedLeave.status)}`}>
                          {getStatusIcon(selectedLeave.status)}
                          <span className="ml-1">{selectedLeave.status.charAt(0).toUpperCase() + selectedLeave.status.slice(1)}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <a
                      href={selectedLeave.pdf_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <FiDownload className="mr-2 h-4 w-4" />
                      Download Application
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-6">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FiFileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Leave Selected</h3>
                  <p className="text-gray-500 text-sm">Select a leave application to view its details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default LeaveList

