import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiArrowLeft, FiCalendar, FiClock, FiUsers, FiMapPin, FiPlus,
  FiBook, FiFileText, FiClipboard, FiSettings, FiCheck, FiX,
  FiTarget, FiTrendingUp, FiBookOpen, FiEdit, FiTrash2,
  FiChevronLeft, FiChevronRight, FiHome, FiStar, FiActivity
} = FiIcons;

const ClassesDashboard = ({ onBackToDashboard }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('summary');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());

  // Mock data for classes
  const mockClasses = [
    {
      id: 1,
      name: 'SAT Math Preparation',
      instructor: 'Dr. Sarah Johnson',
      room: 'Room 101',
      totalStudents: 12,
      maxCapacity: 15,
      status: 'Active',
      schedule: ['Monday', 'Wednesday', 'Friday'],
      time: '3:00 PM - 4:30 PM',
      totalLessons: 18,
      completedLessons: 30,
      avgScore: 85,
      attendance: 95,
      testsDue: 2,
      nextClass: new Date(2024, 0, 22, 15, 0), // Today at 3:00 PM
      recentActivity: [
        { type: 'lesson', message: 'Lesson 18 completed', time: '2 hours ago', icon: FiCheck },
        { type: 'worksheet', message: 'New worksheet assigned', time: '1 day ago', icon: FiFileText },
        { type: 'test', message: 'Quiz 5 graded', time: '2 days ago', icon: FiClipboard },
        { type: 'student', message: 'Alex Johnson joined class', time: '3 days ago', icon: FiUsers }
      ]
    },
    {
      id: 2,
      name: 'ACT English Mastery',
      instructor: 'Michael Chen',
      room: 'Room 203',
      totalStudents: 8,
      maxCapacity: 12,
      status: 'Active',
      schedule: ['Tuesday', 'Thursday'],
      time: '2:00 PM - 3:30 PM',
      totalLessons: 12,
      completedLessons: 20,
      avgScore: 78,
      attendance: 92,
      testsDue: 1,
      nextClass: new Date(2024, 0, 23, 14, 0), // Tomorrow at 2:00 PM
      recentActivity: [
        { type: 'lesson', message: 'Lesson 12 completed', time: '1 day ago', icon: FiCheck },
        { type: 'test', message: 'Midterm scheduled', time: '2 days ago', icon: FiClipboard }
      ]
    },
    {
      id: 3,
      name: 'GRE Quantitative Reasoning',
      instructor: 'Dr. Emily Rodriguez',
      room: 'Room 305',
      totalStudents: 15,
      maxCapacity: 16,
      status: 'Active',
      schedule: ['Monday', 'Wednesday'],
      time: '6:00 PM - 7:30 PM',
      totalLessons: 10,
      completedLessons: 24,
      avgScore: 91,
      attendance: 98,
      testsDue: 0,
      nextClass: new Date(2024, 0, 24, 18, 0), // Wednesday at 6:00 PM
      recentActivity: [
        { type: 'lesson', message: 'Lesson 10 completed', time: '3 hours ago', icon: FiCheck },
        { type: 'worksheet', message: 'Practice problems assigned', time: '1 day ago', icon: FiFileText }
      ]
    }
  ];

  const [classes, setClasses] = useState(mockClasses);

  useEffect(() => {
    // Set the first class as selected by default
    if (classes.length > 0) {
      setSelectedClass(classes[0]);
    }
  }, [classes]);

  // Calendar functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSelectedDate = (date) => {
    return date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getClassesForDate = (date) => {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    return classes.filter(cls => cls.schedule.includes(dayName));
  };

  const getTodaysClasses = () => {
    return getClassesForDate(new Date());
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentCalendarDate);
    const firstDay = getFirstDayOfMonth(currentCalendarDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth(), day);
      const hasClasses = getClassesForDate(date).length > 0;
      
      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
            isToday(date)
              ? 'bg-orange-500 text-white'
              : isSelectedDate(date)
              ? 'bg-blue-500 text-white'
              : hasClasses
              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          aria-label={`Select ${formatDate(date)}`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const navigateCalendar = (direction) => {
    const newDate = new Date(currentCalendarDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentCalendarDate(newDate);
  };

  const getStatusBadge = (status) => {
    const colors = {
      Active: 'bg-green-100 text-green-800',
      Inactive: 'bg-red-100 text-red-800',
      Pending: 'bg-yellow-100 text-yellow-800'
    };
    return `px-3 py-1 rounded-full text-sm font-medium ${colors[status]}`;
  };

  const tabs = [
    { id: 'summary', label: 'Summary', icon: FiHome },
    { id: 'calendar', label: 'Calendar', icon: FiCalendar },
    { id: 'lessons', label: 'Lessons', icon: FiBook },
    { id: 'worksheets', label: 'Worksheets', icon: FiFileText },
    { id: 'tests', label: 'Tests', icon: FiClipboard },
    { id: 'students', label: 'Students', icon: FiUsers },
    { id: 'settings', label: 'Settings', icon: FiSettings }
  ];

  const renderTabContent = () => {
    if (!selectedClass) return null;

    switch (activeTab) {
      case 'summary':
        return (
          <div className="space-y-6">
            {/* Class Overview */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Class Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <SafeIcon icon={FiCalendar} className="w-4 h-4 text-gray-500 mr-3" />
                    <span className="font-medium text-gray-700">Schedule:</span>
                    <span className="text-gray-600 ml-2">{selectedClass.schedule.join(', ')}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <SafeIcon icon={FiClock} className="w-4 h-4 text-gray-500 mr-3" />
                    <span className="font-medium text-gray-700">Time:</span>
                    <span className="text-gray-600 ml-2">{selectedClass.time}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <SafeIcon icon={FiMapPin} className="w-4 h-4 text-gray-500 mr-3" />
                    <span className="font-medium text-gray-700">Room:</span>
                    <span className="text-gray-600 ml-2">{selectedClass.room}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <SafeIcon icon={FiUsers} className="w-4 h-4 text-gray-500 mr-3" />
                    <span className="font-medium text-gray-700">Capacity:</span>
                    <span className="text-gray-600 ml-2">{selectedClass.totalStudents}/{selectedClass.maxCapacity} students</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {selectedClass.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <SafeIcon icon={activity.icon} className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'calendar':
        return (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Class Calendar</h3>
            <p className="text-gray-600">Calendar view with class schedules and events will be displayed here.</p>
          </div>
        );
      
      case 'lessons':
        return (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Lessons</h3>
            <p className="text-gray-600">Lesson plans and curriculum content will be displayed here.</p>
          </div>
        );
      
      case 'worksheets':
        return (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Worksheets</h3>
            <p className="text-gray-600">Assigned worksheets and practice materials will be displayed here.</p>
          </div>
        );
      
      case 'tests':
        return (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tests</h3>
            <p className="text-gray-600">Scheduled tests and assessment results will be displayed here.</p>
          </div>
        );
      
      case 'students':
        return (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Students</h3>
            <p className="text-gray-600">Student roster and individual progress will be displayed here.</p>
          </div>
        );
      
      case 'settings':
        return (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Class Settings</h3>
            <p className="text-gray-600">Class configuration and preferences will be displayed here.</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onBackToDashboard}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors mr-6"
            >
              <SafeIcon icon={FiArrowLeft} className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Classes</h1>
              <p className="text-gray-600">Manage class schedules, lessons, and student progress</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            Create Class
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Calendar */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {currentCalendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="flex space-x-1">
                  <button
                    onClick={() => navigateCalendar(-1)}
                    className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="Previous month"
                  >
                    <SafeIcon icon={FiChevronLeft} className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => navigateCalendar(1)}
                    className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="Next month"
                  >
                    <SafeIcon icon={FiChevronRight} className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                  <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {renderCalendar()}
              </div>
            </div>

            {/* Today's Classes */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Classes</h3>
              <div className="space-y-3">
                {getTodaysClasses().map((cls, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-800">{cls.name}</h4>
                    <p className="text-sm text-gray-600">{cls.time}</p>
                    <p className="text-xs text-gray-500">{cls.room}</p>
                  </div>
                ))}
                {getTodaysClasses().length === 0 && (
                  <p className="text-gray-500 text-sm">No classes scheduled for today</p>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Class Selection */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex flex-wrap gap-4 mb-4">
                {classes.map((cls) => (
                  <button
                    key={cls.id}
                    onClick={() => setSelectedClass(cls)}
                    className={`flex-1 min-w-0 p-4 rounded-lg border-2 transition-all ${
                      selectedClass?.id === cls.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-800 truncate">{cls.name}</h3>
                      <p className="text-sm text-gray-600">{cls.instructor}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-500">{cls.room}</span>
                        <span className="text-sm text-gray-500">{cls.totalStudents}/{cls.maxCapacity}</span>
                      </div>
                      <div className="mt-2">
                        <span className={getStatusBadge(cls.status)}>
                          {cls.status}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {selectedClass && (
              <>
                {/* Class Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <SafeIcon icon={FiBookOpen} className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-600">Total Lessons</p>
                        <p className="text-xl font-bold text-gray-900">{selectedClass.totalLessons}/{selectedClass.completedLessons}</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <SafeIcon icon={FiTarget} className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-600">Avg Score</p>
                        <p className="text-xl font-bold text-gray-900">{selectedClass.avgScore}%</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <SafeIcon icon={FiUsers} className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-600">Attendance</p>
                        <p className="text-xl font-bold text-gray-900">{selectedClass.attendance}%</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <SafeIcon icon={FiClipboard} className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-600">Tests Due</p>
                        <p className="text-xl font-bold text-gray-900">{selectedClass.testsDue}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                      {tabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === tab.id
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <SafeIcon icon={tab.icon} className="w-4 h-4 mr-2" />
                          {tab.label}
                        </button>
                      ))}
                    </nav>
                  </div>
                  
                  <div className="p-6">
                    {renderTabContent()}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Create Class Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Class</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter class name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Select instructor</option>
                      <option value="sarah">Dr. Sarah Johnson</option>
                      <option value="michael">Michael Chen</option>
                      <option value="emily">Dr. Emily Rodriguez</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter room number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Capacity</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter max capacity"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Days</label>
                  <div className="flex flex-wrap gap-2">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                      <label key={day} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter class description"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Class
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassesDashboard;