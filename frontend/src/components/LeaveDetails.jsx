import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import {
  Calendar,
  Clock,
  User,
  Briefcase,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

const LeaveDetails = ({ leave, updateLeaveStatus }) => {
  const [remarks, setRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStatusUpdate = (status) => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      updateLeaveStatus(leave.id, status, remarks);
      setIsSubmitting(false);
      setRemarks("");
    }, 500);
  };

  const isPending = leave.status === "Pending";
  const isPast = new Date(leave.endDate) < new Date();

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "text-green-600";
      case "Rejected":
        return "text-red-600";
      case "On Hold":
        return "text-amber-600";
      default:
        return "text-blue-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "Rejected":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "On Hold":
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      default:
        return <Clock className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">
          Leave Application Details
        </h3>
        <div className="flex items-center space-x-2">
          {getStatusIcon(leave.status)}
          <span className={`font-medium ${getStatusColor(leave.status)}`}>
            {leave.status}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <div className="flex items-center mb-3">
            <User className="w-5 h-5 text-gray-500 mr-2" />
            <h4 className="text-sm font-medium text-gray-700">
              Employee Information
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded-md border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Name</p>
              <p className="text-sm font-medium">{leave.employeeName}</p>
            </div>
            <div className="bg-white p-3 rounded-md border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">ID</p>
              <p className="text-sm font-medium">{leave.employeeId}</p>
            </div>
            <div className="bg-white p-3 rounded-md border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Department</p>
              <div className="flex items-center">
                <Briefcase className="w-3.5 h-3.5 text-gray-400 mr-1" />
                <p className="text-sm font-medium">{leave.department}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <div className="flex items-center mb-3">
            <Calendar className="w-5 h-5 text-gray-500 mr-2" />
            <h4 className="text-sm font-medium text-gray-700">Leave Details</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded-md border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Leave Type</p>
              <p className="text-sm font-medium">{leave.leaveType}</p>
            </div>
            <div className="bg-white p-3 rounded-md border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Duration</p>
              <div className="flex items-center">
                <Clock className="w-3.5 h-3.5 text-gray-400 mr-1" />
                <p className="text-sm font-medium">
                  {leave.daysCount} day{leave.daysCount !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <div className="bg-white p-3 rounded-md border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Start Date</p>
              <p className="text-sm font-medium">
                {format(parseISO(leave.startDate), "EEEE, MMM d, yyyy")}
              </p>
            </div>
            <div className="bg-white p-3 rounded-md border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">End Date</p>
              <p className="text-sm font-medium">
                {format(parseISO(leave.endDate), "EEEE, MMM d, yyyy")}
              </p>
            </div>
            <div className="bg-white p-3 rounded-md border border-gray-100 md:col-span-2">
              <p className="text-xs text-gray-500 mb-1">Applied On</p>
              <p className="text-sm font-medium">
                {format(parseISO(leave.appliedOn), "MMMM d, yyyy")}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <div className="flex items-center mb-3">
            <MessageSquare className="w-5 h-5 text-gray-500 mr-2" />
            <h4 className="text-sm font-medium text-gray-700">Reason</h4>
          </div>
          <div className="bg-white p-3 rounded-md border border-gray-100">
            <p className="text-sm">{leave.reason}</p>
          </div>
        </div>

        {leave.remarks && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex items-center mb-3">
              <MessageSquare className="w-5 h-5 text-gray-500 mr-2" />
              <h4 className="text-sm font-medium text-gray-700">
                Manager Remarks
              </h4>
            </div>
            <div className="bg-white p-3 rounded-md border border-gray-100">
              <p className="text-sm">{leave.remarks}</p>
            </div>
          </div>
        )}

        {(isPending || isPast) && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex items-center mb-3">
              <MessageSquare className="w-5 h-5 text-gray-500 mr-2" />
              <h4 className="text-sm font-medium text-gray-700">Add Remarks</h4>
            </div>
            <textarea
              id="remarks"
              rows={3}
              className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your remarks here..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />

            <div className="mt-4 flex flex-wrap gap-3">
              {isPending && (
                <>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    onClick={() => handleStatusUpdate("Approved")}
                    disabled={isSubmitting}
                  >
                    <CheckCircle className="w-4 h-4 mr-1.5" />
                    Approve
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    onClick={() => handleStatusUpdate("Rejected")}
                    disabled={isSubmitting}
                  >
                    <XCircle className="w-4 h-4 mr-1.5" />
                    Reject
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
                    onClick={() => handleStatusUpdate("On Hold")}
                    disabled={isSubmitting}
                  >
                    <AlertCircle className="w-4 h-4 mr-1.5" />
                    Hold
                  </button>
                </>
              )}

              {isPast && !isPending && (
                <>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    onClick={() => handleStatusUpdate("Approved")}
                    disabled={isSubmitting}
                  >
                    <CheckCircle className="w-4 h-4 mr-1.5" />
                    Approve
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    onClick={() => handleStatusUpdate("Rejected")}
                    disabled={isSubmitting}
                  >
                    <XCircle className="w-4 h-4 mr-1.5" />
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveDetails;
