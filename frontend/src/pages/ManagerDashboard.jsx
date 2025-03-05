import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import CreateUser from '../components/ManagerDashboard/CreateUser';
import TeamView from '../components/ManagerDashboard/TeamView';
import LeaveApplications from '../components/ManagerDashboard/LeaveApplications';
import AttendanceView from '../components/ManagerDashboard/AttendanceView';

const ManagerDashboard = ({ activeView = 'teams', setActiveView }) => {
  const renderContent = () => {
    switch (activeView) {
      case 'create-user':
        return <CreateUser />;
      case 'teams':
        return <TeamView />;
      case 'leaves':
        return <LeaveApplications />;
      case 'attendance':
        return <AttendanceView />;
      default:
        return <TeamView />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {renderContent()}
    </motion.div>
  );
};

export default ManagerDashboard;