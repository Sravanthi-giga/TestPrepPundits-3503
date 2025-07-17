import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import StudentDashboard from './StudentDashboard';
import InstructorDashboard from './InstructorDashboard';
import ClassesDashboard from './ClassesDashboard';
import LocationsManagement from './LocationsManagement';
import CourseTemplatesManagement from './CourseTemplatesManagement';
import HelpSupport from './HelpSupport';

const { FiHome, FiUsers, FiUser, FiBook, FiMapPin, FiFileText, FiHelpCircle, FiLogOut, FiSettings, FiGrid, FiList, FiTarget, FiTrendingUp, FiClock, FiArchive, FiCheck, FiArrowLeft } = FiIcons;

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('summary');
  const [viewMode, setViewMode] = useState('grid');
  const [activeSidebarItem, setActiveSidebarItem] = useState('dashboard');
  const navigate = useNavigate();

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome },
    { id: 'students', label: 'Students', icon: FiUsers },
    { id: 'instructors', label: 'Instructors', icon: FiUser },
    { id: 'classes', label: 'Classes', icon: FiBook },
    { id: 'locations', label: 'Locations', icon: FiMapPin },
    { id: 'course-templates', label: 'Course Templates', icon: FiFileText },
    { id: 'help', label: 'Help', icon: FiHelpCircle },
  ];

  const improvementData = [
    { range: 'No Gain', count: 12, color: 'bg-red-400' },
    { range: '1-49', count: 25, color: 'bg-yellow-400' },
    { range: '50-99', count: 18, color: 'bg-blue-400' },
    { range: '100-149', count: 15, color: 'bg-green-400' },
    { range: '150-199', count: 8, color: 'bg-purple-400' },
    { range: '200+', count: 5, color: 'bg-pink-400' },
  ];
  
  const maxCount = Math.max(...improvementData.map(item => item.count));

  const handleLogout = () => {
    navigate('/');
  };

  const handleBackToDashboard = () => {
    setActiveSidebarItem('dashboard');
  };

  // Add Shashi Dashboard navigation
  const handleShashiDashboard = () => {
    navigate('/shashi-dashboard');
  };

  const CircularProgress = ({ percentage, score }) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="text-orange-500 transition-all duration-1000 ease-out"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-800">{score}</span>
        </div>
      </div>
    );
  };

  // Render specific page components
  if (activeSidebarItem === 'students') {
    return <StudentDashboard onBackToDashboard={handleBackToDashboard} />;
  }
  if (activeSidebarItem === 'instructors') {
    return <InstructorDashboard onBackToDashboard={handleBackToDashboard} />;
  }
  if (activeSidebarItem === 'classes') {
    return <ClassesDashboard onBackToDashboard={handleBackToDashboard} />;
  }
  if (activeSidebarItem === 'locations') {
    return <LocationsManagement onBackToDashboard={handleBackToDashboard} />;
  }
  if (activeSidebarItem === 'course-templates') {
    return <CourseTemplatesManagement onBackToDashboard={handleBackToDashboard} />;
  }
  if (activeSidebarItem === 'help') {
    return <HelpSupport onBackToDashboard={handleBackToDashboard} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        {/* User Profile */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Shashi</h3>
              <p className="text-sm text-gray-500">Student</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSidebarItem(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeSidebarItem === item.id
                  ? 'bg-orange-50 text-orange-600 border-r-2 border-orange-500'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <SafeIcon icon={item.icon} className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Demo Button for Shashi Dashboard */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleShashiDashboard}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <SafeIcon icon={FiUser} className="w-5 h-5" />
            <span className="font-medium">Shashi Dashboard</span>
          </button>
        </div>

        {/* Logout */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <SafeIcon icon={FiLogOut} className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <div className="bg-gradient-to-r from-orange-500 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-orange-100">Welcome back, Shashi!</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              >
                <SafeIcon icon={viewMode === 'grid' ? FiList : FiGrid} className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
                <SafeIcon icon={FiSettings} className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-6">
            <nav className="flex space-x-8">
              {['summary', 'whats-new', 'download-workbook'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab === 'summary' && 'Summary'}
                  {tab === 'whats-new' && "What's New"}
                  {tab === 'download-workbook' && 'Download Workbook'}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-6">
          {activeTab === 'summary' && (
            <div className="space-y-6">
              {/* Top Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Target Scores */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Target Scores</h3>
                      <p className="text-sm text-gray-500">From assigned students</p>
                    </div>
                    <CircularProgress percentage={75} score={100} />
                  </div>
                </motion.div>

                {/* Improvement by Points */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Improvement by Points</h3>
                  <div className="space-y-3">
                    {improvementData.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-16 text-sm text-gray-600">{item.range}</div>
                        <div className="flex-1 bg-gray-100 rounded-full h-4 relative">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.count / maxCount) * 100}%` }}
                            transition={{ delay: index * 0.1, duration: 0.8 }}
                            className={`${item.color} h-4 rounded-full`}
                          />
                        </div>
                        <div className="w-8 text-sm font-medium text-gray-700">{item.count}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Pipeline Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Pipeline</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Unactivated</h4>
                        <p className="text-2xl font-bold text-orange-600 mt-1">24</p>
                      </div>
                      <div className="p-3 bg-orange-100 rounded-full">
                        <SafeIcon icon={FiClock} className="w-6 h-6 text-orange-600" />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Current</h4>
                        <p className="text-2xl font-bold text-green-600 mt-1">156</p>
                      </div>
                      <div className="p-3 bg-green-100 rounded-full">
                        <SafeIcon icon={FiCheck} className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Archived</h4>
                        <p className="text-2xl font-bold text-gray-600 mt-1">89</p>
                      </div>
                      <div className="p-3 bg-gray-100 rounded-full">
                        <SafeIcon icon={FiArchive} className="w-6 h-6 text-gray-600" />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'whats-new' && (
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">What's New</h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800">New Practice Tests Available</h4>
                  <p className="text-sm text-blue-600 mt-1">Updated SAT and ACT practice tests with latest format changes.</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800">Performance Analytics Update</h4>
                  <p className="text-sm text-green-600 mt-1">Enhanced tracking and reporting features now available.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'download-workbook' && (
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Download Workbook</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-800">SAT Math Workbook</h4>
                    <p className="text-sm text-gray-600">Complete practice problems and solutions</p>
                  </div>
                  <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                    Download
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-800">ACT English Workbook</h4>
                    <p className="text-sm text-gray-600">Grammar and writing practice materials</p>
                  </div>
                  <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                    Download
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;