import React from "react";
import { Calendar } from "lucide-react";

const DateRangeFilter = ({ dateFilter, setDateFilter }) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Calendar className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="date"
          className="pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={dateFilter.startDate || ""}
          onChange={(e) =>
            setDateFilter({ ...dateFilter, startDate: e.target.value })
          }
        />
      </div>
      <span className="text-gray-500">to</span>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Calendar className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="date"
          className="pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={dateFilter.endDate || ""}
          onChange={(e) =>
            setDateFilter({ ...dateFilter, endDate: e.target.value })
          }
        />
      </div>
    </div>
  );
};

export default DateRangeFilter;
