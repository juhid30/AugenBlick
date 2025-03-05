import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import LeaveList from "../components/LeaveList";
import LeaveDetails from "../components/LeaveDetails";
import DateRangeFilter from "../components/DateRangeFilter";
import StatusTabs from "../components/StatusTabs";
import { Search, Filter, RefreshCw } from "lucide-react";

// Sample data for leaves
const initialLeaves = [
  {
    id: 1,
    employeeId: 101,
    employeeName: "John Doe",
    department: "Engineering",
    leaveType: "Sick Leave",
    startDate: "2023-10-15",
    endDate: "2023-10-17",
    reason: "Medical appointment and recovery",
    status: "Pending",
    appliedOn: "2023-10-10",
    remarks: "",
    daysCount: 3,
  },
  {
    id: 2,
    employeeId: 102,
    employeeName: "Jane Smith",
    department: "Marketing",
    leaveType: "Annual Leave",
    startDate: "2023-10-20",
    endDate: "2023-10-27",
    reason: "Family vacation",
    status: "Pending",
    appliedOn: "2023-10-05",
    remarks: "",
    daysCount: 8,
  },
  {
    id: 3,
    employeeId: 103,
    employeeName: "Robert Johnson",
    department: "Finance",
    leaveType: "Personal Leave",
    startDate: "2023-10-18",
    endDate: "2023-10-18",
    reason: "Personal matters",
    status: "Approved",
    appliedOn: "2023-10-11",
    remarks: "Approved as requested",
    daysCount: 1,
  },
  {
    id: 4,
    employeeId: 104,
    employeeName: "Emily Davis",
    department: "Human Resources",
    leaveType: "Sick Leave",
    startDate: "2023-09-28",
    endDate: "2023-09-29",
    reason: "Flu recovery",
    status: "Approved",
    appliedOn: "2023-09-27",
    remarks: "Get well soon",
    daysCount: 2,
  },
  {
    id: 5,
    employeeId: 105,
    employeeName: "Michael Wilson",
    department: "Engineering",
    leaveType: "Annual Leave",
    startDate: "2023-11-01",
    endDate: "2023-11-05",
    reason: "Personal time off",
    status: "Pending",
    appliedOn: "2023-10-15",
    remarks: "",
    daysCount: 5,
  },
  {
    id: 6,
    employeeId: 106,
    employeeName: "Sarah Brown",
    department: "Marketing",
    leaveType: "Maternity Leave",
    startDate: "2023-11-15",
    endDate: "2024-02-15",
    reason: "Maternity leave",
    status: "Pending",
    appliedOn: "2023-10-01",
    remarks: "",
    daysCount: 93,
  },
  {
    id: 7,
    employeeId: 107,
    employeeName: "David Miller",
    department: "Sales",
    leaveType: "Sick Leave",
    startDate: "2023-10-05",
    endDate: "2023-10-06",
    reason: "Dental surgery",
    status: "Rejected",
    appliedOn: "2023-10-03",
    remarks: "Insufficient notice period",
    daysCount: 2,
  },
  {
    id: 8,
    employeeId: 108,
    employeeName: "Jennifer Taylor",
    department: "Customer Support",
    leaveType: "Annual Leave",
    startDate: "2023-12-20",
    endDate: "2023-12-31",
    reason: "Year-end holidays",
    status: "Pending",
    appliedOn: "2023-10-12",
    remarks: "",
    daysCount: 12,
  },
  {
    id: 9,
    employeeId: 109,
    employeeName: "Thomas Anderson",
    department: "IT",
    leaveType: "Personal Leave",
    startDate: "2023-10-12",
    endDate: "2023-10-12",
    reason: "Family emergency",
    status: "On Hold",
    appliedOn: "2023-10-11",
    remarks: "Waiting for additional information",
    daysCount: 1,
  },
  {
    id: 10,
    employeeId: 110,
    employeeName: "Lisa White",
    department: "Finance",
    leaveType: "Sick Leave",
    startDate: "2023-09-18",
    endDate: "2023-09-22",
    reason: "COVID-19 recovery",
    status: "Approved",
    appliedOn: "2023-09-17",
    remarks: "Approved with work from home option after recovery",
    daysCount: 5,
  },
];

const LeaveReviewPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [dateFilter, setDateFilter] = useState({
    startDate: null,
    endDate: null,
  });
  const [activeTab, setActiveTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    setIsRefreshing(true);
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token"); // Get token from localStorage

      const response = await fetch("/get-manager-leaves", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Add Authorization header
        },
        // credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch leaves");
      }

      const data = await response.json();
      console.log(data);
      setLeaves(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  };

  const updateLeaveStatus = (leaveId, status, remarks) => {
    setLeaves((prevLeaves) =>
      prevLeaves.map((leave) =>
        leave.id === leaveId
          ? {
              ...leave,
              status,
              remarks,
              updatedOn: format(new Date(), "yyyy-MM-dd"),
            }
          : leave
      )
    );

    // If the updated leave is the currently selected one, update it
    if (selectedLeave && selectedLeave.id === leaveId) {
      setSelectedLeave((prev) => ({
        ...prev,
        status,
        remarks,
        updatedOn: format(new Date(), "yyyy-MM-dd"),
      }));
    }
  };

  const getFilteredLeaves = () => {
    let filtered = [...leaves];

    // Filter by search term
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (leave) =>
          leave.employeeName.toLowerCase().includes(term) ||
          leave.department.toLowerCase().includes(term) ||
          leave.leaveType.toLowerCase().includes(term) ||
          leave.employeeId.toString().includes(term)
      );
    }

    // Filter by tab (status)
    if (activeTab === "pending") {
      filtered = filtered.filter((leave) => leave.status === "Pending");
    } else if (activeTab === "approved") {
      filtered = filtered.filter((leave) => leave.status === "Approved");
    } else if (activeTab === "rejected") {
      filtered = filtered.filter((leave) => leave.status === "Rejected");
    } else if (activeTab === "onHold") {
      filtered = filtered.filter((leave) => leave.status === "On Hold");
    }

    // Filter by date range
    if (dateFilter.startDate && dateFilter.endDate) {
      filtered = filtered.filter((leave) => {
        const leaveStart = parseISO(leave.startDate);
        const leaveEnd = parseISO(leave.endDate);
        const filterStart = parseISO(dateFilter.startDate);
        const filterEnd = parseISO(dateFilter.endDate);

        // Check if there's any overlap between the leave period and filter period
        return (
          (leaveStart >= filterStart && leaveStart <= filterEnd) ||
          (leaveEnd >= filterStart && leaveEnd <= filterEnd) ||
          (leaveStart <= filterStart && leaveEnd >= filterEnd)
        );
      });
    }

    return filtered;
  };

  const clearFilters = () => {
    setDateFilter({ startDate: null, endDate: null });
    setSearchTerm("");
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const filteredLeaves = getFilteredLeaves();

  return (
    <div className="flex flex-col space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              Leave Management Dashboard
              <button
                onClick={handleRefresh}
                className="ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                title="Refresh data"
              >
                <RefreshCw
                  size={16}
                  className={`text-gray-500 ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
              </button>
            </h2>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, department..."
                className="pl-10 pr-3 py-2 w-full md:w-64 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <StatusTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              counts={{
                pending: leaves.filter((leave) => leave.status === "Pending")
                  .length,
                approved: leaves.filter((leave) => leave.status === "Approved")
                  .length,
                rejected: leaves.filter((leave) => leave.status === "Rejected")
                  .length,
                onHold: leaves.filter((leave) => leave.status === "On Hold")
                  .length,
                all: leaves.length,
              }}
            />

            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-white rounded-md border border-gray-200 p-1">
                <Filter className="h-4 w-4 text-gray-400 ml-2" />
                <span className="text-xs font-medium text-gray-500 mx-2">
                  Filter by date:
                </span>
                <DateRangeFilter
                  dateFilter={dateFilter}
                  setDateFilter={setDateFilter}
                />
              </div>
              {(dateFilter.startDate || dateFilter.endDate || searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
            <div className="lg:w-1/2">
              <LeaveList
                leaves={filteredLeaves}
                selectedLeaveId={selectedLeave?.id}
                onSelectLeave={setSelectedLeave}
              />
            </div>

            <div className="lg:w-1/2">
              {selectedLeave ? (
                <LeaveDetails
                  leave={selectedLeave}
                  updateLeaveStatus={updateLeaveStatus}
                />
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 h-full flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-indigo-500"
                    >
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                      <line x1="16" x2="16" y1="2" y2="6" />
                      <line x1="8" x2="8" y1="2" y2="6" />
                      <line x1="3" x2="21" y1="10" y2="10" />
                      <path d="M8 14h.01" />
                      <path d="M12 14h.01" />
                      <path d="M16 14h.01" />
                      <path d="M8 18h.01" />
                      <path d="M12 18h.01" />
                      <path d="M16 18h.01" />
                    </svg>
                  </div>
                  <p className="text-gray-700 font-medium text-center">
                    Select a leave application to view details
                  </p>
                  <p className="text-gray-500 text-sm text-center mt-2 max-w-xs">
                    Click on any leave application from the list to view and
                    manage its details
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveReviewPage;
