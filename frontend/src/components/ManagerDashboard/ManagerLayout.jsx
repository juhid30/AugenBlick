import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUsers, FiUserPlus, FiCalendar, FiClock, FiLogOut } from 'react-icons/fi';

const ManagerLayout = ({ children }) => {
  const [activeTab, setActiveTab] = useState('teams');
  const navigate = useNavigate();

  // Clone children and pass activeTab as prop
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { activeView: activeTab, setActiveView: setActiveTab });
    }
    return child;
  });

  const tabs = [
    { id: 'teams', label: 'Teams', icon: FiUsers },
    { id: 'create-user', label: 'Create User', icon: FiUserPlus },
    { id: 'leaves', label: 'Leave Applications', icon: FiCalendar },
    { id: 'attendance', label: 'Attendance', icon: FiClock },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-xl font-bold text-indigo-600">
                  MinG Baby
                </Link>
              </div>

              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                        activeTab === tab.id
                          ? 'text-indigo-600 border-b-2 border-indigo-600'
                          : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex-shrink-0">
                <button
                  onClick={() => {
                    localStorage.clear();
                    navigate('/login');
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FiLogOut className="mr-2 h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {childrenWithProps}
        </div>
      </main>
    </div>
  );
};

export default ManagerLayout;