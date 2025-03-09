import { useState, useEffect } from 'react';
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

const dummyLeaveData = [
  {
    _id: 1,
    user_email: "juhi.deore@gmail.com",
    leave_type: "Sick Leave",
    start_date: "2024-02-15",
    end_date: "2024-02-16",
    status: "pending",
    pdf_uploaded: "#",
    reason: "Medical appointment"
  },
  {
    _id: 2,
    user_email: "jash.rashne@gmail.com",
    leave_type: "Vacation",
    start_date: "2024-02-20",
    end_date: "2024-02-25",
    status: "approved",
    pdf_uploaded: "#",
    reason: "Family vacation"
  },
  {
    _id: 3,
    user_email: "amita.doshi@example.com",
    leave_type: "Personal Leave",
    start_date: "2024-02-18",
    end_date: "2024-02-19",
    status: "rejected",
    pdf_uploaded: "#",
    reason: "Personal matters"
  },
  {
    _id: 4,
    user_email: "sarah.khan@example.com",
    leave_type: "Sick Leave",
    start_date: "2024-02-16",
    end_date: "2024-02-17",
    status: "pending",
    pdf_uploaded: "#",
    reason: "Not feeling well"
  }
];

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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [leaveData, setLeaveData] = useState([]);

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token

        const response = await fetch("http://127.0.0.1:5000/get-leaves-manager", {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        
        if (!response.ok) throw new Error("Failed to fetch leave data");
        const data = await response.json();
        setLeaveData(data);
      } catch (error) {
        console.error("Error fetching leave data:", error);
        // Use dummy data if API fails
        setLeaveData(dummyLeaveData);
      }
    };

    fetchLeaveData();
  }, []);

  const handleApprove = (leave) => {
    setLeaveData(prevData => 
      prevData.map(item => 
        item._id === leave._id 
          ? { ...item, status: 'approved' } 
          : item
      )
    );
  };

  const handleReject = (leave) => {
    setSelectedLeave(leave);
    setShowRemarkModal(true);
  };

  const handleRejectConfirm = (remark) => {
    setLeaveData(prevData => 
      prevData.map(item => 
        item._id === selectedLeave._id 
          ? { ...item, status: 'rejected', remark } 
          : item
      )
    );
    setShowRemarkModal(false);
    setSelectedLeave(null);
  };

  const handleCloseModal = () => {
    setShowRemarkModal(false);
    setSelectedLeave(null);
  };

  const handleViewPDF = (pdfUrl) => {
    window.open(pdfUrl, "_blank");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
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
                {leaveData
                  .filter(leave => {
                    const matchesSearch = leave.user_email.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchesStatus = filterStatus === 'all' || leave.status === filterStatus;
                    return matchesSearch && matchesStatus;
                  })
                  .map((leave) => (
                  <tr key={leave._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{leave.user_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{leave.leave_type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {format(new Date(leave.start_date), "MMM dd")} - {format(new Date(leave.end_date), "MMM dd, yyyy")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          leave.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : leave.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
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
                      {leave.status === "pending" && (
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
        {showRemarkModal && <RemarkModal onClose={handleCloseModal} onConfirm={handleRejectConfirm} />}
      </AnimatePresence>
    </motion.div>
  );
};

export default LeaveApplications;