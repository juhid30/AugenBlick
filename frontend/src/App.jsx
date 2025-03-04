import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import AttendancePage from "./pages/AttendancePage";
import UnauthorizedPage from "./pages/UnauthorizedPage";

function App() {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/att" element={<AttendancePage />} />
          {/* <Route path="/unauth" element={<UnauthorizedPage />} /> */}
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;
