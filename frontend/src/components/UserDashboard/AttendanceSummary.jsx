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
import { FiClock, FiCalendar, FiCheckCircle, FiAlertCircle, FiTrendingUp } from 'react-icons/fi'

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
        date: item.date.split('-')[2], // Just the day
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
    <>
      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="stats-grid"
      >
        <div className="card bg-gradient-to-br from-green-50 to-green-100 border border-green-200 hover:shadow-green-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-500 bg-opacity-10">
              <FiCheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">Attendance Rate</p>
              <p className="text-3xl font-bold text-green-700">{stats.attendanceRate}%</p>
            </div>
          </div>
          <div className="mt-6 flex justify-between text-sm">
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-1">
                <span className="font-semibold text-green-700">{stats.present}</span>
              </div>
              <p className="text-gray-500">Present</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-1">
                <span className="font-semibold text-red-700">{stats.absent}</span>
              </div>
              <p className="text-gray-500">Absent</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-1">
                <span className="font-semibold text-yellow-700">{stats.late}</span>
              </div>
              <p className="text-gray-500">Late</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 hover:shadow-indigo-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-500 bg-opacity-10">
              <FiClock className="h-6 w-6 text-indigo-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-indigo-600">Total Hours</p>
              <p className="text-3xl font-bold text-indigo-700">{stats.totalWorkHours}h</p>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">Overtime</p>
              <p className="text-sm font-medium text-indigo-700">{stats.totalOvertime}h</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-indigo-400 to-indigo-600 h-2.5 rounded-full" 
                style={{ width: `${Math.min((stats.totalOvertime / stats.totalWorkHours) * 100, 100)}%` }}
              ></div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-indigo-200 flex items-center justify-between">
              <div className="flex items-center text-xs text-indigo-600">
                <FiTrendingUp className="mr-1 h-3 w-3" />
                <span>+2.5% from last week</span>
              </div>
              <div className="text-xs text-gray-500">
                Target: 40h/week
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="card chart-container"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Work Hours Overview</h3>
            <p className="text-sm text-gray-500 mt-1">Daily work hours with status indicators</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 sm:mt-0 text-xs sm:text-sm">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-green-500 mr-1.5"></span>
              <span className="text-gray-600">Present</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-yellow-500 mr-1.5"></span>
              <span className="text-gray-600">Late</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-red-500 mr-1.5"></span>
              <span className="text-gray-600">Absent</span>
            </div>
          </div>
        </div>
        
        <div className="h-60 sm:h-72 lg:h-80">
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
              <Bar 
                dataKey="hours" 
                radius={[4, 4, 0, 0]}
              >
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
        
        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between text-xs sm:text-sm text-gray-500">
          <div className="flex items-center mb-2 sm:mb-0">
            <FiCalendar className="mr-1.5 h-4 w-4 text-gray-400" />
            <span>May 1 - May 10, 2023</span>
          </div>
          <div className="flex items-center">
            <FiAlertCircle className="mr-1.5 h-4 w-4 text-gray-400" />
            <span>Standard work day: 7 hours</span>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default AttendanceSummary