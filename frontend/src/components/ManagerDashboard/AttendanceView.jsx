import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { FiClock, FiSearch, FiFilter, FiCalendar } from 'react-icons/fi';

const initialAttendanceData = [
  {
    id: 1,
    employeeName: 'Amit Sharma',
    date: '2024-02-15',
    checkIn: '09:00 AM',
    checkOut: '06:00 PM',
    status: 'checked-out'
  },
  {
    id: 2,
    employeeName: 'Juhi Deore',
    date: '2024-02-15',
    checkIn: '08:45 AM',
    checkOut: '',
    status: 'checked-in'
  },
  {
    id: 3,
    employeeName: 'Rajesh Verma',
    date: '2024-02-15',
    checkIn: '09:15 AM',
    checkOut: '06:15 PM',
    status: 'checked-out'
  },
  {
    id: 4,
    employeeName: 'Sneha Iyer',
    date: '2024-02-14',
    checkIn: '09:30 AM',
    checkOut: '06:30 PM',
    status: 'checked-out'
  },
  {
    id: 5,
    employeeName: 'Arjun Patil',
    date: '2024-02-14',
    checkIn: '08:30 AM',
    checkOut: '05:45 PM',
    status: 'checked-out'
  },
  {
    id: 6,
    employeeName: 'Pooja Nair',
    date: '2024-02-14',
    checkIn: '09:05 AM',
    checkOut: '06:00 PM',
    status: 'checked-out'
  },
  {
    id: 7,
    employeeName: 'Vikram Singh',
    date: '2024-02-13',
    checkIn: '08:55 AM',
    checkOut: '05:55 PM',
    status: 'checked-out'
  },
  {
    id: 8,
    employeeName: 'Jash Rashne',
    date: '2024-02-13',
    checkIn: '09:10 AM',
    checkOut: '06:10 PM',
    status: 'checked-out'
  }
];


const AttendanceView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [attendanceData, setAttendanceData] = useState(initialAttendanceData);

  const getStatusColor = (status) => {
    return status === 'checked-in' 
      ? 'bg-blue-100 text-blue-800'
      : 'bg-green-100 text-green-800';
  };

  const filteredAttendance = attendanceData.filter(record => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !filterDate || record.date === filterDate;
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    return matchesSearch && matchesDate && matchesStatus;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <FiClock className="h-6 w-6 text-indigo-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Attendance Records</h2>
            </div>

            <div className="flex gap-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </div>

              <div className="relative">
                <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAttendance.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{record.employeeName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{format(new Date(record.date), 'MMM dd, yyyy')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{record.checkIn}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{record.checkOut || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AttendanceView;