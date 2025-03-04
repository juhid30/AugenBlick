import React from "react";
import clsx from "clsx";

const StatusTabs = ({ activeTab, setActiveTab, counts }) => {
  const tabs = [
    { id: "pending", label: "Pending", count: counts.pending },
    { id: "approved", label: "Approved", count: counts.approved },
    { id: "rejected", label: "Rejected", count: counts.rejected },
    { id: "onHold", label: "On Hold", count: counts.onHold },
    { id: "all", label: "All", count: counts.all },
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              activeTab === tab.id
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
              "whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center"
            )}
          >
            {tab.label}
            <span
              className={clsx(
                activeTab === tab.id
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-900",
                "ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium"
              )}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default StatusTabs;
