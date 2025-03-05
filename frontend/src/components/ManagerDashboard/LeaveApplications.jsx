import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { 
  FiCalendar, 
  FiSearch, 
  FiFilter, 
  FiCheck, 
  FiX,
  FiFile,
  FiExternalLink
} from 'react-icons/fi';

const RemarkModal = ({ onClose, onConfirm }) => {
  const [remarkText, setRemarkText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(remarkText);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg p-6 w-full max-w-md"
      >
        <h3 className="text-lg font-semibold mb-4">Add Rejection Remark</h3>
        <form onSubmit={handleSubmit}>
          <textarea
            value={remarkText}
            onChange={(e) => setRemarkText(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your remark..."
            rows="4"
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!remarkText.trim()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-300"
            >
              Confirm Rejection
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const LeaveApplications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  // Mock data - replace with your actual data
  const mockLeaveData = [
    {
      _id: "67c7bee7e5e1361788023ad2",
      user_email: "test1@gmail.com",
      leave_type: "Sick Leave",
      reason: "Feeling unwell, need rest",
      start_date: "2025-03-10",
      end_date: "2025-03-12",
      status: "pending",
      pdf_uploaded: "https://example.com/leave_document.pdf",
      manager_id: "mgr12345",
      created_at: {
        $date: "2025-03-05T08:33:03.201Z"
      }
    }
  ];

  const handleApprove = (leave) => {
    console.log('Approved leave:', leave);
    // Add your approval logic here
  };

  const handleReject = (leave) => {
    setSelectedLeave(leave);
    setShowRemarkModal(true);
  };

  const handleRejectConfirm = (remark) => {
    console.log('Rejected leave:', selectedLeave, 'with remark:', remark);
    // Add your rejection logic here
    setShowRemarkModal(false);
    setSelectedLeave(null);
  };

  const handleCloseModal = () => {
    setShowRemarkModal(false);
    setSelectedLeave(null);
  };

  const handleViewPDF = (pdfUrl) => {
    window.open(pdfUrl, '_blank');
  };

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
                <FiCalendar className="h-6 w-6 text-indigo-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Leave Applications</h2>
            </div>

            <div className="flex gap-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by email..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockLeaveData.map((leave) => (
                  <tr key={leave._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{leave.user_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{leave.leave_type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {format(new Date(leave.start_date), 'MMM dd')} - {format(new Date(leave.end_date), 'MMM dd, yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                        leave.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewPDF(leave.pdf_uploaded)}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <FiFile className="mr-2 h-4 w-4" />
                        View PDF
                        <FiExternalLink className="ml-1 h-4 w-4" />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {leave.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(leave)}
                            className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            <FiCheck className="mr-1 h-4 w-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(leave)}
                            className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <FiX className="mr-1 h-4 w-4" />
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showRemarkModal && (
          <RemarkModal 
            onClose={handleCloseModal}
            onConfirm={handleRejectConfirm}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LeaveApplications;