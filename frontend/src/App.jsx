import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import AttendancePage from "./pages/AttendancePage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import LeavePage from "./pages/LeavePage";
import LeaveReviewPage from "./pages/LeaveReviewPage";
import UserDashboard from "./pages/UserDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import UserLayout from "./components/UserDashboard/UserLayout";
import ManagerLayout from "./components/ManagerDashboard/ManagerLayout";

function App() {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/att" element={<AttendancePage />} />
          <Route path="/leave" element={<LeavePage />} />
          <Route path="/rev" element={<LeaveReviewPage />} />
          <Route 
            path="/user-dashboard" 
            element={
              <UserLayout>
                <UserDashboard />
              </UserLayout>
            } 
          />
          <Route 
            path="/manager-dashboard" 
            element={
              <ManagerLayout>
                <ManagerDashboard />
              </ManagerLayout>
            } 
          />
          <Route path="/unauth" element={<UnauthorizedPage />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;