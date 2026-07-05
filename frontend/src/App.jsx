import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import LearnAggregation from './pages/LearnAggregation';
import AIIdentifier from './pages/AIIdentifier';
import FindCenters from './pages/FindCenters';
import ContactUs from './pages/ContactUs';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Dashboards
import CitizenDashboard from './pages/CitizenDashboard';
import StaffDashboard from './pages/StaffDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Navbar - hidden automatically during print via custom CSS if needed, but we also handle in print queries */}
        <div className="print-hidden">
          <Navbar />
        </div>
        
        {/* Main Content Area */}
        <main className="main-content">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/learn" element={<LearnAggregation />} />
            <Route path="/ai-identifier" element={<AIIdentifier />} />
            <Route path="/centers" element={<FindCenters />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Role-based dashboards */}
            <Route 
              path="/citizen" 
              element={
                <PrivateRoute allowedRoles={['citizen']}>
                  <CitizenDashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/staff" 
              element={
                <PrivateRoute allowedRoles={['staff']}>
                  <StaffDashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </PrivateRoute>
              } 
            />
          </Routes>
        </main>
        
        <div className="print-hidden">
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
