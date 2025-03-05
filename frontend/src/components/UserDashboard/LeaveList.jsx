import { useState } from 'react'
import { format, parseISO, differenceInDays } from 'date-fns'
import { motion } from 'framer-motion'
import { FiFileText, FiCalendar, FiPlus, FiDownload, FiFilter, FiSearch, FiX, FiCheck, FiClock, FiAlertCircle, FiChevronRight, FiChevronDown, FiEdit, FiTrash2 } from 'react-icons/fi'

const LeaveList = ({ leaveData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [expandedLeave, setExpandedLeave] = useState(null);

  // Filter function
  const filteredData = leaveData.filter(item => {
    const matchesSearch = 
      item.leave_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      case 'pending': return 'status-pending';
      default: return 'status-badge';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <FiCheck className="h-4 w-4 mr-1.5" />;
      case 'rejected': return <FiX className="h-4 w-4 mr-1.5" />;
      case 'pending': return <FiClock className="h-4 w-4 mr-1.5" />;
      default: return null;
    }
  };

  const calculateDuration = (startDate, endDate) => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const days = differenceInDays(end, start) + 1;
    return days === 1 ? '1 day' : `${days} days`;
  };

  const toggleExpandLeave = (id) => {
    if (expandedLeave === id) {
      setExpandedLeave(null);
    } else {
      setExpandedLeave(id);
    }
  };

  return (
    <>
      <div className="card">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Leave Management</h2>
            <p className="text-sm text-gray-500">View your leave history and apply for new leaves</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto mt-4 lg:mt-0">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 w-full shadow-sm bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white w-full shadow-sm text-gray-700"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            
            <div className="hidden md:flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
              <button 
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'bg-white text-gray-500'}`}
                onClick={() => setViewMode('grid')}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
              </button>
              <button 
                className={`px-3 py-2 ${viewMode === 'table' ? 'bg-primary-50 text-primary-600' : 'bg-white text-gray-500'}`}
                onClick={() => setViewMode('table')}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
              </button>
            </div>
            
            <button 
              className="btn-primary flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
              onClick={() => setIsModalOpen(true)}
            >
              <FiPlus className="mr-2 h-4 w-4" />
              Apply Leave
            </button>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 sm:gap-8">
            {filteredData.length > 0 ? (
              filteredData.map((leave, index) => (
                <motion.div 
                  key={leave.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="p-6 sm:p-8">
                    <div className="flex justify-between items-start mb-5">
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{leave.leave_type}</h3>
                        <p className="text-xs text-gray-500 mt-1">Request ID: #{leave.id}</p>
                      </div>
                      <span className={getStatusClass(leave.status)}>
                        {getStatusIcon(leave.status)}
                        {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-5">
                      <p className="text-gray-600 text-sm">{leave.reason}</p>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-4 bg-primary-50 rounded-lg p-3">
                      <FiCalendar className="mr-2 h-4 w-4 text-primary-500" />
                      <span>
                        {format(parseISO(leave.start_date), 'MMM dd, yyyy')}
                        {leave.start_date !== leave.end_date && ` - ${format(parseISO(leave.end_date), 'MMM dd, yyyy')}`}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-5">
                      <div className="flex items-center">
                        <FiClock className="mr-1.5 h-4 w-4 text-gray-400" />
                        <span className="font-medium">{calculateDuration(leave.start_date, leave.end_date)}</span>
                      </div>
                      
                      {leave.status === 'pending' && (
                        <div className="flex items-center text-yellow-600">
                          <FiAlertCircle className="mr-1.5 h-4 w-4" />
                          <span className="text-xs">Awaiting approval</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <div className="flex space-x-2">
                        {leave.status === 'pending' && (
                          <>
                            <button className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-colors">
                              <FiEdit className="h-4 w-4" />
                            </button>
                            <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-full transition-colors">
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                      <a 
                        href={leave.pdf_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-800 bg-primary-50 px-3 py-1.5 rounded-lg transition-colors duration-200"
                      >
                        <FiDownload className="mr-1.5 h-4 w-4" />
                        View Document
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-gray-200">
                <FiCalendar className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-lg font-medium text-gray-600">No leave records found</p>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filter</p>
                <button 
                  className="mt-4 btn-primary"
                  onClick={() => setIsModalOpen(true)}
                >
                  Apply for a Leave
                </button>
              </div>
            )}
          </div>
        )}

        {/* Table View (for larger screens) */}
        {viewMode === 'table' && (
          <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
            {filteredData.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Leave Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((leave, index) => (
                    <React.Fragment key={leave.id}>
                      <motion.tr 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => toggleExpandLeave(leave.id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-primary-100 text-primary-600">
                              <FiFileText className="h-5 w-5" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{leave.leave_type}</div>
                              <div className="text-xs text-gray-500">ID: #{leave.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{calculateDuration(leave.start_date, leave.end_date)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {format(parseISO(leave.start_date), 'MMM dd, yyyy')}
                            {leave.start_date !== leave.end_date && (
                              <span> - <br className="md:hidden" />{format(parseISO(leave.end_date), 'MMM dd, yyyy')}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getStatusClass(leave.status)}>
                            {getStatusIcon(leave.status)}
                            {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-3">
                            <a 
                              href={leave.pdf_link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary-600 hover:text-primary-900"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FiDownload className="h-5 w-5" />
                            </a>
                            {leave.status === 'pending' && (
                              <>
                                <button 
                                  className="text-gray-500 hover:text-primary-600"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Edit functionality
                                  }}
                                >
                                  <FiEdit className="h-5 w-5" />
                                </button>
                                <button 
                                  className="text-gray-500 hover:text-red-600"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Delete functionality
                                  }}
                                >
                                  <FiTrash2 className="h-5 w-5" />
                                </button>
                              </>
                            )}
                            <button className="text-gray-400">
                              <FiChevronDown className={`h-5 w-5 transition-transform ${expandedLeave === leave.id ? 'transform rotate-180' : ''}`} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                      
                      {/* Expanded Row */}
                      {expandedLeave === leave.id && (
                        <tr className="bg-gray-50">
                          <td colSpan="5" className="px-6 py-4">
                            <div className="text-sm text-gray-700">
                              <div className="font-medium mb-2">Reason:</div>
                              <div className="bg-white p-3 rounded-lg border border-gray-200 mb-3">
                                {leave.reason}
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <div className="font-medium mb-1">Request Details:</div>
                                  <ul className="text-xs space-y-1 text-gray-500">
                                    <li>Submitted on: {format(parseISO(leave.start_date), 'MMMM dd, yyyy')}</li>
                                    <li>Leave Type: {leave.leave_type}</li>
                                    <li>Duration: {calculateDuration(leave.start_date, leave.end_date)}</li>
                                  </ul>
                                </div>
                                
                                <div>
                                  <div className="font-medium mb-1">Supporting Document:</div>
                                  <a 
                                    href={leave.pdf_link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-800 bg-primary-50 px-3 py-1.5 rounded-lg transition-colors duration-200"
                                  >
                                    <FiDownload className="mr-1.5 h-4 w-4" />
                                    View Document
                                  </a>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <FiCalendar className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-lg font-medium text-gray-600">No leave records found</p>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filter</p>
                <button 
                  className="mt-4 btn-primary"
                  onClick={() => setIsModalOpen(true)}
                >
                  Apply for a Leave
                </button>
              </div>
            )}
          </div>
        )}

        {/* Summary and Actions Footer */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-gray-500">
          <div className="mb-4 sm:mb-0">
            Showing <span className="font-medium">{filteredData.length}</span> of <span className="font-medium">{leaveData.length}</span> leave requests
          </div>
          <div className="flex items-center space-x-4">
            <button className="btn-outline flex items-center justify-center text-xs sm:text-sm bg-white">
              <FiDownload className="mr-2 h-4 w-4" />
              Export as CSV
            </button>
            <div className="hidden lg:flex items-center text-xs text-gray-400">
              <span>Last updated: {format(new Date(), 'MMM dd, yyyy, h:mm a')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Leave Application Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Apply for Leave</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors duration-200"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              
              <form className="space-y-5">
                <div>
                  <label htmlFor="leave_type" className="block text-sm font-medium text-gray-700 mb-1">
                    Leave Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="leave_type"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm bg-white text-gray-700"
                  >
                    <option value="">Select Leave Type</option>
                    <option value="sick">Sick Leave</option>
                    <option value="vacation">Vacation</option>
                    <option value="personal">Personal Leave</option>
                    <option value="wfh">Work From Home</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="start_date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
                      End Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="end_date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm bg-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                    Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="reason"
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm bg-white"
                    placeholder="Please provide a reason for your leave request"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supporting Document (optional)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors duration-200 bg-white">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                        >
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn-outline bg-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}

export default LeaveList