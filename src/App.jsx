import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './App.css';

// Import components
import Dashboard from './components/Dashboard';
import AuthPage from './components/AuthPage';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Pricing from './components/Pricing';
import CTA from './components/CTA';
import Footer from './components/Footer';
import StudentProfile from './components/StudentProfile';
import ShashiDashboard from './components/ShashiDashboard';

// Landing Page Component
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Features />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
};

// Main App Component
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/student-profile" element={<StudentProfile onBackToDashboard={() => window.location.href = "#/dashboard"} />} />
          <Route path="/shashi-dashboard" element={<ShashiDashboard onBackToDashboard={() => window.location.href = "#/dashboard"} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;