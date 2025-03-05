import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts'
import { FiClock, FiCalendar, FiCheckCircle, FiAlertCircle, FiTrendingUp, FiStar } from 'react-icons/fi'

const AttendanceSummary = ({ attendanceData }) => {
  const stats = useMemo(() => {
    const present = attendanceData.filter(item => item.status === 'present').length;
    const absent = attendanceData.filter(item => item.status === 'absent').length;
    const late = attendanceData.filter(item => item.status === 'late').length;
    const totalWorkHours = attendanceData.reduce((sum, item) => sum + item.work_hours, 0);
    const totalOvertime = attendanceData.reduce((sum, item) => sum + item.overtime, 0);
    
    return {
      present,
      absent,
      late,
      totalWorkHours: totalWorkHours.toFixed(1),
      totalOvertime: totalOvertime.toFixed(1),
      attendanceRate: ((present / attendanceData.length) * 100).toFixed(0)
    };
  }, [attendanceData]);

  const chartData = useMemo(() => {
    return attendanceData
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(item => ({
        date: item.date.split('-')[2],
        hours: item.work_hours,
        status: item.status,
        overtime: item.overtime
      }));
  }, [attendanceData]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return '#10b981';
      case 'absent': return '#ef4444';
      case 'late': return '#f59e0b';
      default: return '#6366f1';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* Attendance Rate Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <FiCheckCircle className="h-6 w-6" />
            </div>
            <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">This Month</span>
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats.attendanceRate}%</h3>
          <p className="text-emerald-100">Attendance Rate</p>
          <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center text-sm">
            <span>Target: 95%</span>
            <div className="flex items-center text-emerald-100">
              <FiTrendingUp className="mr-1" />
              +2.5%
            </div>
          </div>
        </motion.div>

        {/* Total Hours Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <FiClock className="h-6 w-6" />
            </div>
            <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">This Month</span>
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats.totalWorkHours}h</h3>
          <p className="text-indigo-100">Total Hours</p>
          <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center text-sm">
            <span>Overtime: {stats.totalOvertime}h</span>
            <div className="flex items-center text-indigo-100">
              <FiStar className="mr-1" />
              Excellent
            </div>
          </div>
        </motion.div>

        {/* Present/Absent Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-700 font-semibold">Attendance Stats</h3>
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <FiCalendar className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                  <span className="text-sm text-gray-600">Present</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{stats.present}</p>
              </div>
              <div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-sm text-gray-600">Absent</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{stats.absent}</p>
              </div>
              <div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="text-sm text-gray-600">Late</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{stats.late}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Performance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-700 font-semibold">Performance</h3>
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <FiTrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Punctuality</span>
                <span className="text-sm font-medium text-emerald-600">95%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div className="h-2 bg-emerald-500 rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Productivity</span>
                <span className="text-sm font-medium text-blue-600">88%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div className="h-2 bg-blue-500 rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Work Hours Overview</h3>
            <p className="text-sm text-gray-500 mt-1">Daily work hours with status indicators</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-4 sm:mt-0">
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                <span className="text-sm text-gray-600">Present</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-sm text-gray-600">Late</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span className="text-sm text-gray-600">Absent</span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
              barSize={36}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                domain={[0, 10]}
                ticks={[0, 2, 4, 6, 8, 10]}
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
                formatter={(value, name) => {
                  if (name === 'hours') return [`${value} hours`, 'Work Hours'];
                  if (name === 'overtime') return [`${value} hours`, 'Overtime'];
                  return [value, name];
                }}
                labelFormatter={(value) => `Day ${value}`}
                cursor={{ fill: '#f3f4f6', opacity: 0.4 }}
              />
              <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getStatusColor(entry.status)} 
                    fillOpacity={0.8}
                  />
                ))}
              </Bar>
              <Line 
                type="monotone" 
                dataKey="overtime" 
                stroke="#4f46e5" 
                strokeWidth={2} 
                dot={{ r: 4, fill: "#4f46e5", strokeWidth: 2, stroke: "#fff" }} 
                activeDot={{ r: 6 }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between text-sm text-gray-500">
          <div className="flex items-center mb-2 sm:mb-0">
            <FiCalendar className="mr-2 h-4 w-4 text-gray-400" />
            <span>Last 7 Days Overview</span>
          </div>
          <div className="flex items-center">
            <FiAlertCircle className="mr-2 h-4 w-4 text-gray-400" />
            <span>Standard work day: 8 hours</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AttendanceSummary