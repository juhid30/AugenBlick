import React from "react";
import { format, parseISO } from "date-fns";
import clsx from "clsx";
import { Calendar, Clock, User } from "lucide-react";

const LeaveList = ({ leaves, selectedLeaveId, onSelectLeave }) => {
  if (leaves.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col items-center justify-center py-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-300 mb-4"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
          <p className="text-gray-500 text-center font-medium">
            No leave applications found
          </p>
          <p className="text-gray-400 text-sm text-center mt-1">
            Try adjusting your filters
          </p>
        </div>
      </div>
    );
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-50 text-green-700 ring-1 ring-green-600/20";
      case "Rejected":
        return "bg-red-50 text-red-700 ring-1 ring-red-600/20";
      case "On Hold":
        return "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20";
      default:
        return "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20";
    }
  };

  const getLeaveTypeIcon = (leaveType) => {
    if (leaveType.toLowerCase().includes("sick")) {
      return (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-500">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 19h8a2 2 0 0 0 2-2v-1a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3v1a2 2 0 0 0 2 2Z"></path>
            <path d="M10 3v3"></path>
            <path d="M14 3v3"></path>
            <path d="M12 14v3"></path>
            <path d="M12 3a5 5 0 0 1 5 5v1H7V8a5 5 0 0 1 5-5Z"></path>
          </svg>
        </span>
      );
    } else if (
      leaveType.toLowerCase().includes("annual") ||
      leaveType.toLowerCase().includes("vacation")
    ) {
      return (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-500">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 12h20"></path>
            <path d="M7 12v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-5"></path>
            <path d="M5 12V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v5"></path>
          </svg>
        </span>
      );
    } else if (
      leaveType.toLowerCase().includes("maternity") ||
      leaveType.toLowerCase().includes("paternity")
    ) {
      return (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-500">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 12h.01"></path>
            <path d="M15 12h.01"></path>
            <path d="M10 16c.5.3 1.5.5 2 .5s1.5-.2 2-.5"></path>
            <path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"></path>
          </svg>
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-500">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
            <line x1="16" x2="16" y1="2" y2="6"></line>
            <line x1="8" x2="8" y1="2" y2="6"></line>
            <line x1="3" x2="21" y1="10" y2="10"></line>
          </svg>
        </span>
      );
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
        <h3 className="text-sm font-medium text-gray-700">
          Leave Applications ({leaves.length})
        </h3>
      </div>
      <ul className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
        {leaves.map((leave) => (
          <li
            key={leave.id}
            className={clsx(
              "p-4 hover:bg-gray-50 cursor-pointer transition-colors",
              selectedLeaveId === leave.id
                ? "bg-indigo-50 hover:bg-indigo-50 border-l-4 border-indigo-500"
                : ""
            )}
            onClick={() => onSelectLeave(leave)}
          >
            <div className="flex items-start space-x-3">
              {getLeaveTypeIcon(leave.leaveType)}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900 truncate">
                      {leave.employeeName}
                    </p>
                    <div className="flex items-center mt-1">
                      <User size={14} className="text-gray-400 mr-1" />
                      <p className="text-xs text-gray-500">
                        {leave.department}
                      </p>
                    </div>
                  </div>
                  <span
                    className={clsx(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                      getStatusBadgeClass(leave.status)
                    )}
                  >
                    {leave.status}
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700">
                    {leave.leaveType}
                    <span className="ml-2 text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {leave.daysCount} day{leave.daysCount !== 1 ? "s" : ""}
                    </span>
                  </p>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <Calendar size={14} className="text-gray-400 mr-1" />
                    <span>
                      {format(parseISO(leave.startDate), "MMM d, yyyy")}
                      {leave.startDate !== leave.endDate &&
                        ` - ${format(parseISO(leave.endDate), "MMM d, yyyy")}`}
                    </span>
                  </div>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <Clock size={14} className="text-gray-400 mr-1" />
                    <span>
                      Applied on{" "}
                      {format(parseISO(leave.appliedOn), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaveList;
