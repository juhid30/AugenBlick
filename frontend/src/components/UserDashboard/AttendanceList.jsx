import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { motion } from 'framer-motion'
import { FiClock, FiArrowUp, FiArrowDown, FiFilter, FiSearch, FiCalendar, FiDownload, FiPrinter, FiChevronRight } from 'react-icons/fi'

const AttendanceList = ({ attendanceData }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedRow, setExpandedRow] = useState(null);

  // Sort function
  const sortedData = [...attendanceData].sort((a, b) => {
    if (sortConfig.key === 'date') {
      return sortConfig.direction === 'asc' 
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    }
    
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Filter function
  const filteredData = sortedData.filter(item => {
    const matchesSearch = item.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.status.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (name) => {
    if (sortConfig.key === name) {
      return sortConfig.direction === 'asc' 
        ? <FiArrowUp className="ml-1 h-4 w-4" />
        : <FiArrowDown className="ml-1 h-4 w-4" />;
    }
    return null;
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'present': return 'status-present';
      case 'absent': return 'status-absent';
      case 'late': return 'status-late';
      default: return 'status-badge';
    }
  };

  const toggleRowExpand = (index) => {
    if (expandedRow === index) {
      setExpandedRow(null);
    } else {
      setExpandedRow(index);
    }
  };

  return (
    <div className="card">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Attendance History</h2>
          <p className="text-sm text-gray-500">View and manage your attendance records</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto mt-4 lg:mt-0">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 w-full shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white w-full shadow-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
            </select>
          </div>
          
          <button className="btn-outline flex items-center justify-center">
            <FiDownload className="mr-2 h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('date')}
              >
                <div className="flex items-center">
                  <FiCalendar className="mr-1 h-4 w-4" />
                  Date
                  {getSortIcon('date')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('status')}
              >
                <div className="flex items-center">
                  Status
                  {getSortIcon('status')}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check In
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check Out
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('work_hours')}
              >
                <div className="flex items-center">
                  <FiClock className="mr-1 h-4 w-4" />
                  Work Hours
                  {getSortIcon('work_hours')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('overtime')}
              >
                <div className="flex items-center">
                  Overtime
                  {getSortIcon('overtime')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <motion.tr 
                  key={item.date}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-gray-50 table-row-hover"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {format(parseISO(item.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusClass(item.status)}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.status !== 'absent' ? (
                      <span className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        {item.check_in_time}
                      </span>
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.status !== 'absent' ? (
                      <span className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                        {item.check_out_time}
                      </span>
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="font-medium">{item.work_hours}</span> hrs
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {item.overtime > 0 ? (
                      <span className="text-primary-600 font-medium flex items-center">
                        <FiArrowUp className="mr-1 h-3 w-3" />
                        +{item.overtime} hrs
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-10 text-center text-sm text-gray-500">
                  <div className="flex flex-col items-center">
                    <FiCalendar className="h-10 w-10 text-gray-300 mb-2" />
                    <p className="text-gray-500 font-medium">No attendance records found</p>
                    <p className="text-gray-400 text-xs mt-1">Try adjusting your search or filter</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <motion.div 
              key={item.date}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
            >
              <div 
                className="p-4 flex justify-between items-center cursor-pointer"
                onClick={() => toggleRowExpand(index)}
              >
                <div>
                  <p className="font-medium text-gray-900">{format(parseISO(item.date), 'MMM dd, yyyy')}</p>
                  <div className="flex items-center mt-1">
                    <span className={getStatusClass(item.status)}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-right mr-2">
                    <p className="text-sm text-gray-500"><span className="font-medium">{item.work_hours}</span> hrs</p>
                    {item.overtime > 0 && (
                      <p className="text-xs text-primary-600 font-medium">+{item.overtime} hrs overtime</p>
                    )}
                  </div>
                  <FiChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${expandedRow === index ? 'transform rotate-90' : ''}`} />
                </div>
              </div>
              
              {expandedRow === index && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Check In</p>
                      {item.status !== 'absent' ? (
                        <p className="text-sm text-gray-700 flex items-center">
                          <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                          {item.check_in_time}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-700">-</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Check Out</p>
                      {item.status !== 'absent' ? (
                        <p className="text-sm text-gray-700 flex items-center">
                          <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                          {item.check_out_time}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-700">-</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <FiCalendar className="h-10 w-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 font-medium">No attendance records found</p>
            <p className="text-gray-400 text-xs mt-1">Try adjusting your search or filter</p>
          </div>
        )}
      </div>
      
      <div className="mt-6 flex justify-between items-center text-sm text-gray-500">
        <div>
          Showing <span className="font-medium">{filteredData.length}</span> of <span className="font-medium">{attendanceData.length}</span> records
        </div>
        <div className="flex items-center">
          <button className="p-2 rounded-md hover:bg-gray-100 text-gray-500">
             <FiPrinter className="h-5 w-5" />
          </button>
          <button className="ml-2 p-2 rounded-md hover:bg-gray-100 text-gray-500">
            <FiDownload className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default AttendanceList