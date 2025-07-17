import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {
  FiUser, FiMail, FiCalendar, FiBook, FiFileText, FiClipboard,
  FiSettings, FiArrowLeft, FiPlus, FiFilter, FiSearch, FiEdit,
  FiDownload, FiEye, FiTrash2, FiCheck, FiX, FiLoader, FiClock,
  FiBarChart2, FiTarget, FiCheckCircle, FiAlertCircle, FiChevronDown,
  FiChevronUp, FiUsers, FiLock, FiArchive, FiStar, FiChevronLeft,
  FiChevronRight, FiPhone, FiMapPin, FiAward, FiTrendingUp
} = FiIcons;

// Score Progress Component
const ScoreProgressBar = ({ value, maxValue, label, color }) => {
  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100));
  
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-700">{value}/{maxValue}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full transition-all duration-500 ${color}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <SafeIcon icon={FiLoader} className="animate-spin h-8 w-8 text-blue-500" />
    <span className="ml-2 text-lg text-gray-600">Loading data...</span>
  </div>
);

// Circular Progress Component for Scores
const CircularProgress = ({ percentage, score, maxScore }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-32 h-32">
      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-gray-200"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="text-blue-500 transition-all duration-1000 ease-out"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-800">{score}</span>
        <span className="text-xs text-gray-500">/{maxScore}</span>
      </div>
    </div>
  );
};

const ShashiDashboard = ({ onBackToDashboard }) => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('summary');
  
  // State for modal visibility
  const [showAssignLessonModal, setShowAssignLessonModal] = useState(false);
  const [showAssignWorksheetModal, setShowAssignWorksheetModal] = useState(false);
  const [showAssignTestModal, setShowAssignTestModal] = useState(false);
  const [showAddParentModal, setShowAddParentModal] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  
  // State for loading indicators
  const [loadingWorksheets, setLoadingWorksheets] = useState(true);
  
  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Form states
  const [lessonForm, setLessonForm] = useState({ name: '', page: '', notes: '' });
  const [worksheetForm, setWorksheetForm] = useState({ name: '', instructions: '', dueDate: '' });
  const [testForm, setTestForm] = useState({ version: '', instructions: '', dueDate: '' });
  const [parentForm, setParentForm] = useState({ name: '', email: '', phone: '' });
  const [eventForm, setEventForm] = useState({ title: '', type: 'lesson', date: '', duration: '60' });
  
  // Search and filter states
  const [lessonSearch, setLessonSearch] = useState('');
  const [worksheetSearch, setWorksheetSearch] = useState('');
  const [testSearch, setTestSearch] = useState('');
  
  // Student data for Shashi
  const studentData = {
    id: 1,
    name: 'Shashi',
    email: 'shashi@testpreppundits.com',
    status: 'Active',
    profileImage: null,
    instructors: [
      { id: 1, name: 'Dr. Sarah Johnson', subject: 'SAT Math' },
      { id: 2, name: 'Michael Chen', subject: 'SAT English' }
    ],
    class: 'SAT Prep - Premium',
    targetScore: 1500,
    currentScore: 1320,
    initialScore: 1100,
    sectionScores: {
      math: { current: 680, target: 750 },
      reading: { current: 640, target: 750 }
    },
    progress: {
      lessons: { completed: 18, total: 24 },
      tests: { completed: 5, total: 8 },
      worksheets: { completed: 14, total: 20 },
      sessions: { completed: 10, total: 12 }
    },
    overdueWork: [
      { id: 1, type: 'worksheet', name: 'Advanced Algebra Practice', dueDate: '2024-01-20' },
      { id: 2, type: 'test', name: 'SAT Practice Test 6', dueDate: '2024-01-22' }
    ],
    upcomingWork: [
      { id: 3, type: 'lesson', name: 'Reading Comprehension Strategies', date: '2024-01-25' },
      { id: 4, type: 'session', name: 'One-on-One Math Review', date: '2024-01-26' }
    ],
    scoreHistory: [
      { date: '2023-11-15', composite: 1100, math: 550, reading: 550 },
      { date: '2023-12-10', composite: 1220, math: 610, reading: 610 },
      { date: '2024-01-05', composite: 1320, math: 680, reading: 640 }
    ],
    accountInfo: {
      courseStartDate: '2023-10-15',
      courseEndDate: '2024-06-15',
      highSchool: 'Lincoln High School',
      graduationYear: '2025',
      parents: [
        { id: 1, name: 'Raj Patel', email: 'raj.patel@email.com', phone: '555-123-4567' }
      ],
      progressReports: {
        sendToStudent: true,
        sendToParent: true,
        frequency: 'weekly',
        nextReport: '2024-01-28'
      },
      settings: {
        loginRestriction: false,
        archived: false,
        excludeFromStats: false
      }
    }
  };

  // Lessons data
  const [lessons, setLessons] = useState([
    { id: 1, name: 'SAT Math Foundations', page: 'Unit 1, Pages 1-15', status: 'completed', score: 95, completionDate: '2023-11-20' },
    { id: 2, name: 'Linear Equations & Inequalities', page: 'Unit 2, Pages 16-30', status: 'completed', score: 88, completionDate: '2023-11-27' },
    { id: 3, name: 'Quadratic Functions', page: 'Unit 3, Pages 31-45', status: 'completed', score: 92, completionDate: '2023-12-05' },
    { id: 4, name: 'Reading Comprehension Basics', page: 'Unit 4, Pages 46-60', status: 'completed', score: 86, completionDate: '2023-12-12' },
    { id: 5, name: 'Grammar & Usage Rules', page: 'Unit 5, Pages 61-75', status: 'completed', score: 90, completionDate: '2023-12-20' },
    { id: 6, name: 'Advanced Algebra Concepts', page: 'Unit 6, Pages 76-90', status: 'in-progress', score: null, completionDate: null },
    { id: 7, name: 'Essay Writing Techniques', page: 'Unit 7, Pages 91-105', status: 'not-started', score: null, completionDate: null },
  ]);
  
  // Worksheets data
  const [worksheets, setWorksheets] = useState([]);
  
  // Tests data
  const [tests, setTests] = useState([
    { id: 1, version: 'SAT Practice Test 1', dateAssigned: '2023-11-10', status: 'completed', score: 1100, reviewStatus: 'reviewed' },
    { id: 2, version: 'SAT Practice Test 2', dateAssigned: '2023-12-05', status: 'completed', score: 1180, reviewStatus: 'reviewed' },
    { id: 3, version: 'SAT Practice Test 3', dateAssigned: '2023-12-20', status: 'completed', score: 1220, reviewStatus: 'reviewed' },
    { id: 4, version: 'SAT Practice Test 4', dateAssigned: '2024-01-05', status: 'completed', score: 1280, reviewStatus: 'reviewed' },
    { id: 5, version: 'SAT Practice Test 5', dateAssigned: '2024-01-15', status: 'completed', score: 1320, reviewStatus: 'pending' },
    { id: 6, version: 'SAT Practice Test 6', dateAssigned: '2024-01-20', status: 'assigned', score: null, reviewStatus: 'not-started' },
  ]);
  
  // Calendar events data
  const [calendarEvents, setCalendarEvents] = useState([
    { id: 1, title: 'SAT Math Foundations', type: 'lesson', date: new Date(2024, 0, 5), status: 'completed' },
    { id: 2, title: 'Reading Strategies', type: 'lesson', date: new Date(2024, 0, 8), status: 'completed' },
    { id: 3, title: 'Practice Test 5', type: 'test', date: new Date(2024, 0, 15), status: 'completed' },
    { id: 4, title: 'Math Tutoring Session', type: 'session', date: new Date(2024, 0, 18), status: 'completed' },
    { id: 5, title: 'Advanced Algebra', type: 'lesson', date: new Date(2024, 0, 22), status: 'in-progress' },
    { id: 6, title: 'Practice Test 6', type: 'test', date: new Date(2024, 0, 25), status: 'assigned' },
    { id: 7, title: 'Essay Workshop', type: 'lesson', date: new Date(2024, 0, 28), status: 'not-started' },
  ]);
  
  // Simulate loading worksheets data
  useEffect(() => {
    const timer = setTimeout(() => {
      setWorksheets([
        { id: 1, name: 'Linear Equations Practice', status: 'completed', score: 94, reviewStatus: 'reviewed' },
        { id: 2, name: 'Reading Comprehension Set A', status: 'completed', score: 87, reviewStatus: 'reviewed' },
        { id: 3, name: 'Grammar Fundamentals', status: 'completed', score: 91, reviewStatus: 'reviewed' },
        { id: 4, name: 'Quadratic Functions Worksheet', status: 'completed', score: 89, reviewStatus: 'reviewed' },
        { id: 5, name: 'Critical Reading Practice', status: 'completed', score: 85, reviewStatus: 'reviewed' },
        { id: 6, name: 'Advanced Algebra Practice', status: 'in-progress', score: null, reviewStatus: 'pending' },
        { id: 7, name: 'Essay Structure Worksheet', status: 'assigned', score: null, reviewStatus: 'not-started' },
      ]);
      setLoadingWorksheets(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Form handlers
  const handleLessonFormSubmit = (e) => {
    e.preventDefault();
    const newLesson = {
      id: lessons.length + 1,
      name: lessonForm.name,
      page: lessonForm.page,
      status: 'not-started',
      score: null,
      completionDate: null
    };
    setLessons([...lessons, newLesson]);
    setShowAssignLessonModal(false);
    setLessonForm({ name: '', page: '', notes: '' });
  };
  
  const handleWorksheetFormSubmit = (e) => {
    e.preventDefault();
    const newWorksheet = {
      id: worksheets.length + 1,
      name: worksheetForm.name,
      status: 'assigned',
      score: null,
      reviewStatus: 'not-started'
    };
    setWorksheets([...worksheets, newWorksheet]);
    setShowAssignWorksheetModal(false);
    setWorksheetForm({ name: '', instructions: '', dueDate: '' });
  };
  
  const handleTestFormSubmit = (e) => {
    e.preventDefault();
    const newTest = {
      id: tests.length + 1,
      version: testForm.version,
      dateAssigned: new Date().toISOString().split('T')[0],
      status: 'assigned',
      score: null,
      reviewStatus: 'not-started'
    };
    setTests([...tests, newTest]);
    setShowAssignTestModal(false);
    setTestForm({ version: '', instructions: '', dueDate: '' });
  };
  
  const handleParentFormSubmit = (e) => {
    e.preventDefault();
    const newParent = {
      id: studentData.accountInfo.parents.length + 1,
      name: parentForm.name,
      email: parentForm.email,
      phone: parentForm.phone
    };
    studentData.accountInfo.parents.push(newParent);
    setShowAddParentModal(false);
    setParentForm({ name: '', email: '', phone: '' });
  };
  
  const handleEventFormSubmit = (e) => {
    e.preventDefault();
    const newEvent = {
      id: calendarEvents.length + 1,
      title: eventForm.title,
      type: eventForm.type,
      date: new Date(eventForm.date),
      status: 'not-started'
    };
    setCalendarEvents([...calendarEvents, newEvent]);
    setShowAddEventModal(false);
    setEventForm({ title: '', type: 'lesson', date: '', duration: '60' });
  };

  // Calendar functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };
  
  const changeMonth = (offset) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + offset);
    setCurrentMonth(newMonth);
  };
  
  const getEventsForDate = (date) => {
    return calendarEvents.filter(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };
  
  const getEventTypeColor = (type, status) => {
    if (status === 'completed') return 'bg-green-500';
    if (status === 'in-progress') return 'bg-yellow-500';
    
    switch (type) {
      case 'lesson':
        return 'bg-blue-500';
      case 'test':
        return 'bg-purple-500';
      case 'session':
        return 'bg-orange-500';
      case 'worksheet':
        return 'bg-indigo-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  // Filter functions
  const getFilteredLessons = () => {
    return lessons.filter(lesson =>
      lesson.name.toLowerCase().includes(lessonSearch.toLowerCase()) ||
      lesson.page.toLowerCase().includes(lessonSearch.toLowerCase())
    );
  };
  
  const getFilteredWorksheets = () => {
    return worksheets.filter(worksheet =>
      worksheet.name.toLowerCase().includes(worksheetSearch.toLowerCase())
    );
  };
  
  const getFilteredTests = () => {
    return tests.filter(test =>
      test.version.toLowerCase().includes(testSearch.toLowerCase())
    );
  };
  
  // Status badge function
  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Completed</span>;
      case 'in-progress':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">In Progress</span>;
      case 'assigned':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Assigned</span>;
      case 'not-started':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">Not Started</span>;
      case 'reviewed':
        return <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">Reviewed</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">Pending</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">{status}</span>;
    }
  };
  
  // Render calendar
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200 bg-gray-50"></div>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();
      const dayEvents = getEventsForDate(date);
      
      days.push(
        <div 
          key={day} 
          className={`h-24 border border-gray-200 p-1 overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors ${isToday ? 'bg-blue-50' : ''} ${isSelected ? 'border-blue-500 border-2' : ''}`}
          onClick={() => setSelectedDate(date)}
        >
          <div className="flex justify-between items-center mb-1">
            <span className={`text-sm font-medium ${isToday ? 'text-blue-600' : ''}`}>{day}</span>
            {dayEvents.length === 0 && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setEventForm({ ...eventForm, date: date.toISOString().split('T')[0] });
                  setShowAddEventModal(true);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <SafeIcon icon={FiPlus} className="w-3 h-3" />
              </button>
            )}
          </div>
          <div className="space-y-1">
            {dayEvents.map(event => {
              const isCompleted = event.status === 'completed';
              const completionText = isCompleted ? '1/1' : '0/1';
              
              return (
                <div 
                  key={event.id} 
                  className={`${getEventTypeColor(event.type, event.status)} text-white px-1 py-0.5 rounded text-xs truncate relative`}
                >
                  <div className="flex justify-between items-center">
                    <span className="truncate">{event.title}</span>
                    <span className="text-xs ml-1">{completionText}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    
    return days;
  };

  // Render score chart
  const renderScoreChart = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Score Progress Chart</h3>
        <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded border border-gray-200">
          {studentData.scoreHistory.length > 0 ? (
            <div className="w-full h-full p-4">
              {/* Chart representation */}
              <div className="h-full flex items-end justify-around space-x-4">
                {studentData.scoreHistory.map((record, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className="flex space-x-1 items-end">
                      <div 
                        className="bg-blue-500 rounded-t w-6 transition-all duration-1000" 
                        style={{ height: `${(record.math / 800) * 180}px` }}
                        title={`Math: ${record.math}`}
                      ></div>
                      <div 
                        className="bg-green-500 rounded-t w-6 transition-all duration-1000" 
                        style={{ height: `${(record.reading / 800) * 180}px` }}
                        title={`Reading: ${record.reading}`}
                      ></div>
                      <div 
                        className="bg-purple-500 rounded-t w-6 transition-all duration-1000" 
                        style={{ height: `${(record.composite / 1600) * 180}px` }}
                        title={`Composite: ${record.composite}`}
                      ></div>
                    </div>
                    <div className="text-xs mt-2 text-gray-600 text-center">
                      {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="text-xs font-medium text-gray-800">{record.composite}</div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center space-x-6 mt-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                  <span className="text-xs text-gray-600">Math</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                  <span className="text-xs text-gray-600">Reading & Writing</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-purple-500 rounded mr-2"></div>
                  <span className="text-xs text-gray-600">Composite</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500">No score data available yet</div>
          )}
        </div>
      </div>
    );
  };

  // Get initials for avatar
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 flex items-center">
          <button
            onClick={onBackToDashboard}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-white/50 rounded-lg transition-all mr-6 backdrop-blur-sm"
          >
            <SafeIcon icon={FiArrowLeft} className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Dashboard - Shashi</h1>
            <p className="text-gray-600">Comprehensive learning management and progress tracking</p>
          </div>
        </div>

        {/* Student Info Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 mb-6 backdrop-blur-sm"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <div className="flex items-center mb-4 md:mb-0 md:mr-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mr-4 shadow-lg">
                {getInitials(studentData.name)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{studentData.name}</h2>
                <div className="flex items-center mt-1">
                  <SafeIcon icon={FiMail} className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-gray-600 text-sm">{studentData.email}</span>
                </div>
                <div className="flex items-center mt-1">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    {studentData.status}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 ml-auto">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-3 rounded-lg border border-blue-200">
                <span className="text-sm text-blue-600 font-medium">Class</span>
                <div className="font-bold text-blue-800">{studentData.class}</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 px-4 py-3 rounded-lg border border-purple-200">
                <span className="text-sm text-purple-600 font-medium">Current Score</span>
                <div className="font-bold text-purple-800">{studentData.currentScore}/1600</div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 px-4 py-3 rounded-lg border border-green-200">
                <span className="text-sm text-green-600 font-medium">Target Score</span>
                <div className="font-bold text-green-800">{studentData.targetScore}/1600</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-t-xl shadow-lg border border-gray-200 overflow-hidden">
          <nav className="flex overflow-x-auto">
            {['summary', 'calendar', 'lessons', 'worksheets', 'tests', 'account'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 font-medium text-sm border-b-2 whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <SafeIcon
                    icon={
                      tab === 'summary' ? FiUser :
                      tab === 'calendar' ? FiCalendar :
                      tab === 'lessons' ? FiBook :
                      tab === 'worksheets' ? FiFileText :
                      tab === 'tests' ? FiClipboard :
                      FiSettings
                    }
                    className="w-4 h-4 mr-2"
                  />
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </div>
              </button>
            ))}
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="bg-white rounded-b-xl shadow-lg border-x border-b border-gray-200 p-6">
          {/* Summary Tab */}
          {activeTab === 'summary' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Score Summary Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Score Display */}
                <div className="lg:col-span-2 bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Score Summary</h3>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveTab('tests')}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                    >
                      Go To Tests
                    </motion.button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Current Score Display */}
                    <div className="text-center">
                      <CircularProgress 
                        percentage={(studentData.currentScore / 1600) * 100}
                        score={studentData.currentScore}
                        maxScore={1600}
                      />
                      <div className="mt-3">
                        <div className="text-sm text-gray-600">Current Score</div>
                        <div className="text-lg font-bold text-gray-800">{studentData.currentScore}</div>
                        <div className="text-xs text-green-600 font-medium">
                          +{studentData.currentScore - studentData.initialScore} pts improvement
                        </div>
                      </div>
                    </div>
                    
                    {/* Section Scores */}
                    <div className="space-y-4">
                      <div className="text-sm font-bold text-gray-700 mb-3">Section Scores</div>
                      <ScoreProgressBar 
                        value={studentData.sectionScores.math.current} 
                        maxValue={800} 
                        label="SAT Math" 
                        color="bg-blue-500" 
                      />
                      <ScoreProgressBar 
                        value={studentData.sectionScores.reading.current} 
                        maxValue={800} 
                        label="Reading & Writing" 
                        color="bg-green-500" 
                      />
                    </div>
                    
                    {/* Target Progress */}
                    <div className="space-y-4">
                      <div className="text-sm font-bold text-gray-700 mb-3">Target Progress</div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{studentData.targetScore}</div>
                        <div className="text-sm text-gray-600 mb-3">Target Score</div>
                      </div>
                      <ScoreProgressBar 
                        value={studentData.currentScore} 
                        maxValue={studentData.targetScore} 
                        label="Progress to Target" 
                        color="bg-purple-500" 
                      />
                      <div className="text-xs text-center text-gray-600">
                        {studentData.targetScore - studentData.currentScore} points to go
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Course Progress */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Course Progress</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <SafeIcon icon={FiBook} className="w-4 h-4 text-blue-500 mr-2" />
                          <span className="text-sm font-medium text-gray-700">Lessons</span>
                        </div>
                        <span className="text-sm font-bold text-gray-700">
                          {studentData.progress.lessons.completed}/{studentData.progress.lessons.total}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(studentData.progress.lessons.completed / studentData.progress.lessons.total) * 100}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="bg-blue-500 rounded-full h-3"
                        ></motion.div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <SafeIcon icon={FiClipboard} className="w-4 h-4 text-purple-500 mr-2" />
                          <span className="text-sm font-medium text-gray-700">Tests</span>
                        </div>
                        <span className="text-sm font-bold text-gray-700">
                          {studentData.progress.tests.completed}/{studentData.progress.tests.total}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(studentData.progress.tests.completed / studentData.progress.tests.total) * 100}%` }}
                          transition={{ duration: 1, delay: 0.4 }}
                          className="bg-purple-500 rounded-full h-3"
                        ></motion.div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <SafeIcon icon={FiFileText} className="w-4 h-4 text-yellow-500 mr-2" />
                          <span className="text-sm font-medium text-gray-700">Worksheets</span>
                        </div>
                        <span className="text-sm font-bold text-gray-700">
                          {studentData.progress.worksheets.completed}/{studentData.progress.worksheets.total}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(studentData.progress.worksheets.completed / studentData.progress.worksheets.total) * 100}%` }}
                          transition={{ duration: 1, delay: 0.6 }}
                          className="bg-yellow-500 rounded-full h-3"
                        ></motion.div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <SafeIcon icon={FiUsers} className="w-4 h-4 text-orange-500 mr-2" />
                          <span className="text-sm font-medium text-gray-700">Sessions</span>
                        </div>
                        <span className="text-sm font-bold text-gray-700">
                          {studentData.progress.sessions.completed}/{studentData.progress.sessions.total}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(studentData.progress.sessions.completed / studentData.progress.sessions.total) * 100}%` }}
                          transition={{ duration: 1, delay: 0.8 }}
                          className="bg-orange-500 rounded-full h-3"
                        ></motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Work Status Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Overdue Work */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-red-50 p-6 rounded-xl border border-red-200"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-red-800">Overdue Work</h3>
                    <span className="px-3 py-1 bg-red-200 text-red-800 text-sm font-medium rounded-full">
                      {studentData.overdueWork.length} items
                    </span>
                  </div>
                  
                  {studentData.overdueWork.length > 0 ? (
                    <div className="space-y-3">
                      {studentData.overdueWork.map(item => (
                        <motion.div 
                          key={item.id} 
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center p-3 bg-white rounded-lg shadow-sm border border-red-100"
                        >
                          <div className="p-2 bg-red-100 rounded-lg mr-3">
                            <SafeIcon
                              icon={
                                item.type === 'worksheet' ? FiFileText :
                                item.type === 'test' ? FiClipboard :
                                item.type === 'lesson' ? FiBook :
                                FiCalendar
                              }
                              className="w-5 h-5 text-red-600"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-900">{item.name}</span>
                              <span className="text-red-600 text-sm font-medium">
                                Due: {new Date(item.dueDate).toLocaleDateString()}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500 capitalize">{item.type}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32 bg-white rounded-lg border border-red-100">
                      <div className="text-center">
                        <SafeIcon icon={FiCheck} className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <p className="text-gray-500">No overdue work</p>
                      </div>
                    </div>
                  )}
                </motion.div>
                
                {/* Upcoming Work */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-blue-50 p-6 rounded-xl border border-blue-200"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-blue-800">Upcoming Work</h3>
                    <span className="px-3 py-1 bg-blue-200 text-blue-800 text-sm font-medium rounded-full">
                      {studentData.upcomingWork.length} items
                    </span>
                  </div>
                  
                  {studentData.upcomingWork.length > 0 ? (
                    <div className="space-y-3">
                      {studentData.upcomingWork.map(item => (
                        <motion.div 
                          key={item.id} 
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center p-3 bg-white rounded-lg shadow-sm border border-blue-100"
                        >
                          <div className="p-2 bg-blue-100 rounded-lg mr-3">
                            <SafeIcon
                              icon={
                                item.type === 'worksheet' ? FiFileText :
                                item.type === 'test' ? FiClipboard :
                                item.type === 'lesson' ? FiBook :
                                FiCalendar
                              }
                              className="w-5 h-5 text-blue-600"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-900">{item.name}</span>
                              <span className="text-blue-600 text-sm font-medium">
                                {new Date(item.date).toLocaleDateString()}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500 capitalize">{item.type}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32 bg-white rounded-lg border border-blue-100">
                      <p className="text-gray-500">No upcoming work scheduled</p>
                    </div>
                  )}
                </motion.div>
              </div>
              
              {/* Score Chart */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {renderScoreChart()}
              </motion.div>
            </motion.div>
          )}
          
          {/* Calendar Tab */}
          {activeTab === 'calendar' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <button 
                    onClick={() => changeMonth(-1)}
                    className="p-2 mr-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <SafeIcon icon={FiChevronLeft} className="w-5 h-5" />
                  </button>
                  <h3 className="text-xl font-bold text-gray-800">
                    {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </h3>
                  <button 
                    onClick={() => changeMonth(1)}
                    className="p-2 ml-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <SafeIcon icon={FiChevronRight} className="w-5 h-5" />
                  </button>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddEventModal(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                >
                  <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
                  Add New
                </motion.button>
              </div>
              
              {/* Calendar Legend */}
              <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Lesson</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Test</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Session</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Worksheet</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Completed</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">In Progress</span>
                </div>
              </div>
              
              {/* Calendar Grid */}
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                {/* Day headers */}
                <div className="grid grid-cols-7 text-center bg-gray-50 border-b border-gray-200">
                  {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                    <div key={day} className="py-3 font-medium text-gray-500 text-sm">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar days */}
                <div className="grid grid-cols-7">
                  {renderCalendar()}
                </div>
              </div>
              
              {/* Selected Date Events */}
              <div className="mt-8">
                <h4 className="text-lg font-bold text-gray-800 mb-4">
                  Events for {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </h4>
                
                {getEventsForDate(selectedDate).length > 0 ? (
                  <div className="space-y-3">
                    {getEventsForDate(selectedDate).map(event => (
                      <motion.div 
                        key={event.id} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.01 }}
                        className="flex items-center p-4 bg-white rounded-lg shadow-md border border-gray-200"
                      >
                        <div className={`p-3 ${getEventTypeColor(event.type, event.status)} rounded-lg mr-4 shadow-sm`}>
                          <SafeIcon
                            icon={
                              event.type === 'lesson' ? FiBook :
                              event.type === 'test' ? FiClipboard :
                              event.type === 'worksheet' ? FiFileText :
                              FiCalendar
                            }
                            className="w-5 h-5 text-white"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium text-gray-900">{event.title}</span>
                            <div className="flex items-center">
                              {getStatusBadge(event.status)}
                              <span className="ml-2 text-sm text-gray-500">
                                {event.status === 'completed' ? '1/1' : '0/1'} completed
                              </span>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500 capitalize">{event.type}</span>
                        </div>
                        <div className="ml-4 flex space-x-2">
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <SafeIcon icon={FiEdit} className="w-4 h-4" />
                          </motion.button>
                          {event.status !== 'completed' && (
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            >
                              <SafeIcon icon={FiCheck} className="w-4 h-4" />
                            </motion.button>
                          )}
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-center">
                      <p className="text-gray-500 mb-3">No events scheduled for this day</p>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setEventForm({ ...eventForm, date: selectedDate.toISOString().split('T')[0] });
                          setShowAddEventModal(true);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                      >
                        <SafeIcon icon={FiPlus} className="w-4 h-4 mr-1 inline-block" />
                        Add Event
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
          
          {/* Lessons Tab */}
          {activeTab === 'lessons' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="relative flex-1 max-w-md">
                  <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder="Search lessons..." 
                    value={lessonSearch}
                    onChange={(e) => setLessonSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <SafeIcon icon={FiFilter} className="w-4 h-4 mr-2" />
                    Filter
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAssignLessonModal(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                  >
                    <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
                    Assign New Lesson
                  </motion.button>
                </div>
              </div>
              
              {/* Lessons Table */}
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Lesson Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Page Reference
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Performance Score
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Completion Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getFilteredLessons().map((lesson, index) => (
                        <motion.tr 
                          key={lesson.id} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{lesson.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {lesson.page}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(lesson.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {lesson.score ? (
                              <div className="flex items-center">
                                <div className="w-20 bg-gray-200 rounded-full h-2.5 mr-3">
                                  <div 
                                    className={`h-2.5 rounded-full transition-all duration-500 ${
                                      lesson.score >= 90 ? 'bg-green-500' : 
                                      lesson.score >= 80 ? 'bg-blue-500' : 
                                      lesson.score >= 70 ? 'bg-yellow-500' : 
                                      'bg-red-500'
                                    }`} 
                                    style={{ width: `${lesson.score}%` }}
                                  ></div>
                                </div>
                                <span className="text-gray-900 font-medium">{lesson.score}%</span>
                              </div>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {lesson.completionDate ? new Date(lesson.completionDate).toLocaleDateString() : '—'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex space-x-2">
                              <motion.button 
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                              >
                                <SafeIcon icon={FiEdit} className="w-4 h-4" />
                              </motion.button>
                              <motion.button 
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="text-purple-600 hover:text-purple-900 p-1 rounded transition-colors"
                              >
                                <SafeIcon icon={FiEye} className="w-4 h-4" />
                              </motion.button>
                              <motion.button 
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                              >
                                <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {getFilteredLessons().length === 0 && (
                  <div className="py-8 text-center">
                    <p className="text-gray-500">No lessons found matching your search</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
          
          {/* Worksheets Tab */}
          {activeTab === 'worksheets' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="relative flex-1 max-w-md">
                  <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder="Search worksheets..." 
                    value={worksheetSearch}
                    onChange={(e) => setWorksheetSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <SafeIcon icon={FiFilter} className="w-4 h-4 mr-2" />
                    Filter
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAssignWorksheetModal(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                  >
                    <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
                    Assign New Worksheet
                  </motion.button>
                </div>
              </div>
              
              {/* Worksheets Table or Loading State */}
              {loadingWorksheets ? (
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Worksheet Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Performance
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Review Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {getFilteredWorksheets().map((worksheet, index) => (
                          <motion.tr 
                            key={worksheet.id} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900">{worksheet.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(worksheet.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {worksheet.score ? (
                                <div className="flex items-center">
                                  <div className="w-20 bg-gray-200 rounded-full h-2.5 mr-3">
                                    <div 
                                      className={`h-2.5 rounded-full transition-all duration-500 ${
                                        worksheet.score >= 90 ? 'bg-green-500' : 
                                        worksheet.score >= 80 ? 'bg-blue-500' : 
                                        worksheet.score >= 70 ? 'bg-yellow-500' : 
                                        'bg-red-500'
                                      }`} 
                                      style={{ width: `${worksheet.score}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-gray-900 font-medium">{worksheet.score}%</span>
                                </div>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(worksheet.reviewStatus)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex space-x-2">
                                <motion.button 
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                                >
                                  <SafeIcon icon={FiEdit} className="w-4 h-4" />
                                </motion.button>
                                <motion.button 
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="text-green-600 hover:text-green-900 p-1 rounded transition-colors"
                                >
                                  <SafeIcon icon={FiDownload} className="w-4 h-4" />
                                </motion.button>
                                <motion.button 
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                                >
                                  <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                                </motion.button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {getFilteredWorksheets().length === 0 && !loadingWorksheets && (
                    <div className="py-8 text-center">
                      <p className="text-gray-500">No worksheets found matching your search</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
          
          {/* Tests Tab */}
          {activeTab === 'tests' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="relative flex-1 max-w-md">
                  <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder="Search tests..." 
                    value={testSearch}
                    onChange={(e) => setTestSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <SafeIcon icon={FiFilter} className="w-4 h-4 mr-2" />
                    Filter
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAssignTestModal(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                  >
                    <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
                    Assign New Test
                  </motion.button>
                </div>
              </div>
              
              {/* Tests Table */}
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Test Version
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date Assigned
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Score
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Review Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getFilteredTests().map((test, index) => (
                        <motion.tr 
                          key={test.id} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{test.version}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {new Date(test.dateAssigned).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(test.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {test.score ? (
                              <span className="font-bold text-lg text-gray-900">{test.score}</span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(test.reviewStatus)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex space-x-2">
                              {test.status === 'assigned' && (
                                <motion.button 
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="text-green-600 hover:text-green-900 p-1 rounded transition-colors"
                                  title="Start Test"
                                >
                                  <SafeIcon icon={FiEye} className="w-4 h-4" />
                                </motion.button>
                              )}
                              {test.status === 'completed' && (
                                <motion.button 
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                                  title="View Analytics"
                                >
                                  <SafeIcon icon={FiBarChart2} className="w-4 h-4" />
                                </motion.button>
                              )}
                              <motion.button 
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="text-purple-600 hover:text-purple-900 p-1 rounded transition-colors"
                                title="View Details"
                              >
                                <SafeIcon icon={FiEye} className="w-4 h-4" />
                              </motion.button>
                              <motion.button 
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                                title="Delete"
                              >
                                <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {getFilteredTests().length === 0 && (
                  <div className="py-8 text-center">
                    <p className="text-gray-500">No tests found matching your search</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
          
          {/* Account Tab */}
          {activeTab === 'account' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Instructors and Class Information */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                  <h3 className="text-lg font-bold text-blue-800 mb-4">Instructors</h3>
                  <div className="space-y-4 mb-6">
                    {studentData.instructors.map((instructor) => (
                      <div key={instructor.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-blue-100">
                        <div className="flex items-center">
                          <div className="p-3 bg-blue-100 rounded-lg mr-4">
                            <SafeIcon icon={FiUser} className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{instructor.name}</p>
                            <p className="text-sm text-gray-600">{instructor.subject}</p>
                          </div>
                        </div>
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        >
                          <SafeIcon icon={FiX} className="w-4 h-4" />
                        </motion.button>
                      </div>
                    ))}
                  </div>
                  
                  <h3 className="text-lg font-bold text-blue-800 mb-4">Class Assignment</h3>
                  <div className="p-4 bg-white rounded-lg shadow-sm border border-blue-100 mb-6">
                    <p className="font-medium text-gray-900">{studentData.class}</p>
                    <div className="flex justify-end mt-3">
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                      >
                        <SafeIcon icon={FiEdit} className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-blue-800 mb-4">Parent/Guardian Information</h3>
                  <div className="space-y-4 mb-4">
                    {studentData.accountInfo.parents.map((parent) => (
                      <div key={parent.id} className="p-4 bg-white rounded-lg shadow-sm border border-blue-100">
                        <p className="font-medium text-gray-900">{parent.name}</p>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <SafeIcon icon={FiMail} className="w-4 h-4 mr-2" />
                          {parent.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <SafeIcon icon={FiPhone} className="w-4 h-4 mr-2" />
                          {parent.phone}
                        </div>
                        <div className="flex justify-end mt-3">
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                          >
                            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddParentModal(true)}
                    className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                  >
                    <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
                    Add Parent/Guardian
                  </motion.button>
                </div>
              </div>
              
              {/* Progress Reports and Account Settings */}
              <div className="space-y-6">
                {/* Progress Reports */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                  <h3 className="text-lg font-bold text-green-800 mb-4">Progress Reports</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="sendToStudent"
                          checked={studentData.accountInfo.progressReports.sendToStudent}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label htmlFor="sendToStudent" className="ml-3 block text-sm text-gray-700 font-medium">
                          Send to student
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="sendToParent"
                          checked={studentData.accountInfo.progressReports.sendToParent}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label htmlFor="sendToParent" className="ml-3 block text-sm text-gray-700 font-medium">
                          Send to parent/guardian
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        defaultValue={studentData.accountInfo.progressReports.frequency}
                      >
                        <option value="weekly">Weekly</option>
                        <option value="biweekly">Bi-Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg border border-green-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 font-medium">Next report:</span>
                        <span className="text-sm font-bold text-gray-900">
                          {new Date(studentData.accountInfo.progressReports.nextReport).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Account Information */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                  <h3 className="text-lg font-bold text-purple-800 mb-4">Account Information</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Course Start Date</label>
                        <input 
                          type="date" 
                          defaultValue={studentData.accountInfo.courseStartDate}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Course End Date</label>
                        <input 
                          type="date" 
                          defaultValue={studentData.accountInfo.courseEndDate}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Target Score</label>
                      <input 
                        type="number" 
                        min="400"
                        max="1600"
                        defaultValue={studentData.targetScore}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">High School</label>
                        <input 
                          type="text" 
                          defaultValue={studentData.accountInfo.highSchool}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
                        <input 
                          type="text" 
                          defaultValue={studentData.accountInfo.graduationYear}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Account Settings */}
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200">
                  <h3 className="text-lg font-bold text-yellow-800 mb-4">Account Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-yellow-200">
                      <div className="flex items-center">
                        <SafeIcon icon={FiLock} className="w-5 h-5 text-gray-500 mr-3" />
                        <span className="text-gray-700 font-medium">Login Restriction</span>
                      </div>
                      <div className="relative inline-block w-12 mr-2 align-middle select-none">
                        <input 
                          type="checkbox" 
                          id="loginRestriction" 
                          checked={studentData.accountInfo.settings.loginRestriction}
                          className="sr-only"
                        />
                        <label 
                          htmlFor="loginRestriction"
                          className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${
                            studentData.accountInfo.settings.loginRestriction ? 'bg-blue-500' : 'bg-gray-300'
                          }`}
                        >
                          <span 
                            className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${
                              studentData.accountInfo.settings.loginRestriction ? 'translate-x-6' : 'translate-x-0'
                            }`} 
                          ></span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-yellow-200">
                      <div className="flex items-center">
                        <SafeIcon icon={FiArchive} className="w-5 h-5 text-gray-500 mr-3" />
                        <span className="text-gray-700 font-medium">Archive Student</span>
                      </div>
                      <div className="relative inline-block w-12 mr-2 align-middle select-none">
                        <input 
                          type="checkbox" 
                          id="archiveStudent" 
                          checked={studentData.accountInfo.settings.archived}
                          className="sr-only"
                        />
                        <label 
                          htmlFor="archiveStudent"
                          className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${
                            studentData.accountInfo.settings.archived ? 'bg-blue-500' : 'bg-gray-300'
                          }`}
                        >
                          <span 
                            className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${
                              studentData.accountInfo.settings.archived ? 'translate-x-6' : 'translate-x-0'
                            }`} 
                          ></span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-yellow-200">
                      <div className="flex items-center">
                        <SafeIcon icon={FiStar} className="w-5 h-5 text-gray-500 mr-3" />
                        <span className="text-gray-700 font-medium">Exclude From Statistics</span>
                      </div>
                      <div className="relative inline-block w-12 mr-2 align-middle select-none">
                        <input 
                          type="checkbox" 
                          id="excludeFromStats" 
                          checked={studentData.accountInfo.settings.excludeFromStats}
                          className="sr-only"
                        />
                        <label 
                          htmlFor="excludeFromStats"
                          className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${
                            studentData.accountInfo.settings.excludeFromStats ? 'bg-blue-500' : 'bg-gray-300'
                          }`}
                        >
                          <span 
                            className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${
                              studentData.accountInfo.settings.excludeFromStats ? 'translate-x-6' : 'translate-x-0'
                            }`} 
                          ></span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="pt-4 flex justify-end">
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md"
                      >
                        Save Changes
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Modals */}
        <AnimatePresence>
          {/* Assign Lesson Modal */}
          {showAssignLessonModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Assign New Lesson</h3>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowAssignLessonModal(false)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
                  >
                    <SafeIcon icon={FiX} className="w-6 h-6" />
                  </motion.button>
                </div>
                
                <form onSubmit={handleLessonFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Name</label>
                    <input 
                      type="text" 
                      value={lessonForm.name}
                      onChange={(e) => setLessonForm({ ...lessonForm, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter lesson name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Page Reference</label>
                    <input 
                      type="text" 
                      value={lessonForm.page}
                      onChange={(e) => setLessonForm({ ...lessonForm, page: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="e.g., Unit 7, Pages 106-120"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                    <textarea 
                      value={lessonForm.notes}
                      onChange={(e) => setLessonForm({ ...lessonForm, notes: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Add any additional notes or instructions"
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <motion.button 
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowAssignLessonModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button 
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                    >
                      Assign Lesson
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
          
          {/* Assign Worksheet Modal */}
          {showAssignWorksheetModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Assign New Worksheet</h3>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowAssignWorksheetModal(false)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
                  >
                    <SafeIcon icon={FiX} className="w-6 h-6" />
                  </motion.button>
                </div>
                
                <form onSubmit={handleWorksheetFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Worksheet Name</label>
                    <input 
                      type="text" 
                      value={worksheetForm.name}
                      onChange={(e) => setWorksheetForm({ ...worksheetForm, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter worksheet name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                    <input 
                      type="date" 
                      value={worksheetForm.dueDate}
                      onChange={(e) => setWorksheetForm({ ...worksheetForm, dueDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
                    <textarea 
                      value={worksheetForm.instructions}
                      onChange={(e) => setWorksheetForm({ ...worksheetForm, instructions: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter worksheet instructions"
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <motion.button 
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowAssignWorksheetModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button 
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                    >
                      Assign Worksheet
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
          
          {/* Assign Test Modal */}
          {showAssignTestModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Assign New Test</h3>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowAssignTestModal(false)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
                  >
                    <SafeIcon icon={FiX} className="w-6 h-6" />
                  </motion.button>
                </div>
                
                <form onSubmit={handleTestFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Test Version</label>
                    <select
                      value={testForm.version}
                      onChange={(e) => setTestForm({ ...testForm, version: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="">Select a test</option>
                      <option value="SAT Practice Test 7">SAT Practice Test 7</option>
                      <option value="SAT Practice Test 8">SAT Practice Test 8</option>
                      <option value="SAT Practice Test 9">SAT Practice Test 9</option>
                      <option value="SAT Practice Test 10">SAT Practice Test 10</option>
                      <option value="Custom SAT Practice Test">Custom SAT Practice Test</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                    <input 
                      type="date" 
                      value={testForm.dueDate}
                      onChange={(e) => setTestForm({ ...testForm, dueDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
                    <textarea 
                      value={testForm.instructions}
                      onChange={(e) => setTestForm({ ...testForm, instructions: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter test instructions"
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <motion.button 
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowAssignTestModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button 
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                    >
                      Assign Test
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
          
          {/* Add Parent Modal */}
          {showAddParentModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Add Parent/Guardian</h3>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowAddParentModal(false)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
                  >
                    <SafeIcon icon={FiX} className="w-6 h-6" />
                  </motion.button>
                </div>
                
                <form onSubmit={handleParentFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      value={parentForm.name}
                      onChange={(e) => setParentForm({ ...parentForm, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input 
                      type="email" 
                      value={parentForm.email}
                      onChange={(e) => setParentForm({ ...parentForm, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input 
                      type="tel" 
                      value={parentForm.phone}
                      onChange={(e) => setParentForm({ ...parentForm, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <motion.button 
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowAddParentModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button 
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                    >
                      Add Parent
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
          
          {/* Add Calendar Event Modal */}
          {showAddEventModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Add New Event</h3>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowAddEventModal(false)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
                  >
                    <SafeIcon icon={FiX} className="w-6 h-6" />
                  </motion.button>
                </div>
                
                <form onSubmit={handleEventFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
                    <input 
                      type="text" 
                      value={eventForm.title}
                      onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter event title"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                    <select
                      value={eventForm.type}
                      onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="lesson">Lesson</option>
                      <option value="test">Test</option>
                      <option value="worksheet">Worksheet</option>
                      <option value="session">Session</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input 
                      type="date" 
                      value={eventForm.date}
                      onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                    <input 
                      type="number" 
                      value={eventForm.duration}
                      onChange={(e) => setEventForm({ ...eventForm, duration: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      min="15"
                      step="15"
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <motion.button 
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowAddEventModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button 
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                    >
                      Add Event
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ShashiDashboard;