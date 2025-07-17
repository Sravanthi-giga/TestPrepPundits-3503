import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// Import icons - Fixed: Added FiSearch to the imports
const {
  FiHome, FiCalendar, FiBook, FiFileText, FiClipboard, FiUsers, FiSettings,
  FiPlus, FiUpload, FiDownload, FiEdit, FiTrash2, FiEye, FiCheck, FiX,
  FiMail, FiArrowLeft, FiClock, FiMapPin, FiUser, FiFilter, FiSearch
} = FiIcons;

const ClassManagement = ({ onBackToDashboard }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [selectedClass, setSelectedClass] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showWorksheetModal, setShowWorksheetModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [recurrenceEnabled, setRecurrenceEnabled] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedWorksheet, setSelectedWorksheet] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentProfileModal, setShowStudentProfileModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({ type: '', id: null });

  // Mock data for class
  const mockClass = {
    id: 1,
    name: 'SAT Math Preparation',
    instructor: 'Dr. Sarah Johnson',
    room: 'Room 101',
    totalStudents: 12,
    maxCapacity: 15,
    status: 'Active',
    schedule: ['Monday', 'Wednesday', 'Friday'],
    time: '3:00 PM - 4:30 PM',
    enableAttendanceTracking: true,
    enableProgressTracking: true,
    allowStudentUploads: false
  };

  // Mock data for events
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Midterm Review',
      date: new Date(2024, 4, 15),
      startTime: '3:00 PM',
      endTime: '4:30 PM',
      description: 'Review key concepts for midterm exam',
      recurring: false,
      recurrenceDays: []
    },
    {
      id: 2,
      title: 'Practice Test',
      date: new Date(2024, 4, 18),
      startTime: '3:00 PM',
      endTime: '5:00 PM',
      description: 'Full-length practice test',
      recurring: false,
      recurrenceDays: []
    },
    {
      id: 3,
      title: 'Regular Class',
      date: new Date(2024, 4, 22),
      startTime: '3:00 PM',
      endTime: '4:30 PM',
      description: 'Regular weekly class session',
      recurring: true,
      recurrenceDays: ['Monday', 'Wednesday', 'Friday']
    }
  ]);

  // Mock data for lessons
  const [lessons, setLessons] = useState([
    {
      id: 1,
      title: 'Introduction to Algebra',
      description: 'Fundamental algebraic concepts and equations',
      date: '2024-04-10',
      instructor: 'Dr. Sarah Johnson',
      materials: 'algebra_basics.pdf',
      completed: true
    },
    {
      id: 2,
      title: 'Geometry Essentials',
      description: 'Key geometric principles and formulas',
      date: '2024-04-17',
      instructor: 'Dr. Sarah Johnson',
      materials: 'geometry_essentials.pdf',
      completed: true
    },
    {
      id: 3,
      title: 'Advanced Functions',
      description: 'Working with complex functions and graphs',
      date: '2024-04-24',
      instructor: 'Dr. Sarah Johnson',
      materials: 'advanced_functions.pdf',
      completed: false
    }
  ]);

  // Mock data for worksheets
  const [worksheets, setWorksheets] = useState([
    {
      id: 1,
      title: 'Algebra Practice Set',
      description: 'Practice problems covering basic algebra',
      fileName: 'algebra_practice.pdf',
      assignedDate: '2024-04-10',
      dueDate: '2024-04-17',
      status: 'Closed'
    },
    {
      id: 2,
      title: 'Geometry Worksheet',
      description: 'Problems on triangles, circles, and polygons',
      fileName: 'geometry_worksheet.pdf',
      assignedDate: '2024-04-17',
      dueDate: '2024-04-24',
      status: 'Active'
    },
    {
      id: 3,
      title: 'Functions Practice',
      description: 'Advanced function problems and graphs',
      fileName: 'functions_practice.pdf',
      assignedDate: '2024-04-24',
      dueDate: '2024-05-01',
      status: 'Active'
    }
  ]);

  // Mock data for tests
  const [tests, setTests] = useState([
    {
      id: 1,
      title: 'Algebra Quiz',
      date: '2024-04-12',
      startTime: '3:00 PM',
      duration: '30 minutes',
      totalMarks: 20,
      type: 'MCQ',
      assignedStudents: 12,
      resultStatus: 'Graded'
    },
    {
      id: 2,
      title: 'Geometry Test',
      date: '2024-04-19',
      startTime: '3:00 PM',
      duration: '45 minutes',
      totalMarks: 30,
      type: 'MCQ + Free Response',
      assignedStudents: 12,
      resultStatus: 'Pending'
    },
    {
      id: 3,
      title: 'Midterm Exam',
      date: '2024-05-03',
      startTime: '3:00 PM',
      duration: '90 minutes',
      totalMarks: 60,
      type: 'Comprehensive',
      assignedStudents: 12,
      resultStatus: 'Scheduled'
    }
  ]);

  // Mock data for students
  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'Alex Johnson',
      email: 'alex.johnson@email.com',
      attendance: 95,
      progress: 85,
      grade: 'A',
      profilePic: null
    },
    {
      id: 2,
      name: 'Emma Davis',
      email: 'emma.davis@email.com',
      attendance: 88,
      progress: 78,
      grade: 'B+',
      profilePic: null
    },
    {
      id: 3,
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      attendance: 100,
      progress: 92,
      grade: 'A+',
      profilePic: null
    },
    {
      id: 4,
      name: 'Sophia Rodriguez',
      email: 'sophia.rodriguez@email.com',
      attendance: 92,
      progress: 88,
      grade: 'A-',
      profilePic: null
    },
    {
      id: 5,
      name: 'James Wilson',
      email: 'james.wilson@email.com',
      attendance: 78,
      progress: 72,
      grade: 'B',
      profilePic: null
    }
  ]);

  // Settings state
  const [settings, setSettings] = useState({
    className: mockClass.name,
    instructor: mockClass.instructor,
    days: mockClass.schedule,
    time: mockClass.time,
    room: mockClass.room,
    maxCapacity: mockClass.maxCapacity,
    enableAttendanceTracking: mockClass.enableAttendanceTracking,
    enableProgressTracking: mockClass.enableProgressTracking,
    allowStudentUploads: mockClass.allowStudentUploads
  });

  // Event form state
  const [eventForm, setEventForm] = useState({
    title: '',
    date: new Date(),
    startTime: '',
    endTime: '',
    description: '',
    recurring: false,
    recurrenceDays: []
  });

  // Lesson form state
  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    date: '',
    instructor: mockClass.instructor,
    materials: '',
    completed: false
  });

  // Worksheet form state
  const [worksheetForm, setWorksheetForm] = useState({
    title: '',
    description: '',
    fileName: '',
    assignedDate: '',
    dueDate: '',
    status: 'Active'
  });

  // Test form state
  const [testForm, setTestForm] = useState({
    title: '',
    date: '',
    startTime: '',
    duration: '',
    totalMarks: '',
    type: 'MCQ',
    assignedStudents: 0,
    resultStatus: 'Scheduled'
  });

  useEffect(() => {
    setSelectedClass(mockClass);
  }, []);

  // Handle Event Form Change
  const handleEventFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEventForm({
      ...eventForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle Lesson Form Change
  const handleLessonFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLessonForm({
      ...lessonForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle Worksheet Form Change
  const handleWorksheetFormChange = (e) => {
    const { name, value } = e.target;
    setWorksheetForm({
      ...worksheetForm,
      [name]: value
    });
  };

  // Handle Test Form Change
  const handleTestFormChange = (e) => {
    const { name, value } = e.target;
    setTestForm({
      ...testForm,
      [name]: value
    });
  };

  // Handle Settings Change
  const handleSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle Recurrence Day Toggle
  const handleRecurrenceDayToggle = (day) => {
    const updatedDays = eventForm.recurrenceDays.includes(day)
      ? eventForm.recurrenceDays.filter(d => d !== day)
      : [...eventForm.recurrenceDays, day];
    
    setEventForm({
      ...eventForm,
      recurrenceDays: updatedDays
    });
  };

  // Handle Schedule Day Toggle
  const handleScheduleDayToggle = (day) => {
    const updatedDays = settings.days.includes(day)
      ? settings.days.filter(d => d !== day)
      : [...settings.days, day];
    
    setSettings({
      ...settings,
      days: updatedDays
    });
  };

  // Submit Event Form
  const handleEventSubmit = (e) => {
    e.preventDefault();
    
    if (selectedEvent) {
      // Update existing event
      const updatedEvents = events.map(event =>
        event.id === selectedEvent.id ? { ...eventForm, id: event.id } : event
      );
      setEvents(updatedEvents);
    } else {
      // Add new event
      const newEvent = {
        ...eventForm,
        id: events.length + 1
      };
      setEvents([...events, newEvent]);
    }
    
    setEventForm({
      title: '',
      date: new Date(),
      startTime: '',
      endTime: '',
      description: '',
      recurring: false,
      recurrenceDays: []
    });
    setSelectedEvent(null);
    setShowEventModal(false);
  };

  // Submit Lesson Form
  const handleLessonSubmit = (e) => {
    e.preventDefault();
    
    if (selectedLesson) {
      // Update existing lesson
      const updatedLessons = lessons.map(lesson =>
        lesson.id === selectedLesson.id ? { ...lessonForm, id: lesson.id } : lesson
      );
      setLessons(updatedLessons);
    } else {
      // Add new lesson
      const newLesson = {
        ...lessonForm,
        id: lessons.length + 1
      };
      setLessons([...lessons, newLesson]);
    }
    
    setLessonForm({
      title: '',
      description: '',
      date: '',
      instructor: mockClass.instructor,
      materials: '',
      completed: false
    });
    setSelectedLesson(null);
    setShowLessonModal(false);
  };

  // Submit Worksheet Form
  const handleWorksheetSubmit = (e) => {
    e.preventDefault();
    
    if (selectedWorksheet) {
      // Update existing worksheet
      const updatedWorksheets = worksheets.map(worksheet =>
        worksheet.id === selectedWorksheet.id ? { ...worksheetForm, id: worksheet.id } : worksheet
      );
      setWorksheets(updatedWorksheets);
    } else {
      // Add new worksheet
      const newWorksheet = {
        ...worksheetForm,
        id: worksheets.length + 1
      };
      setWorksheets([...worksheets, newWorksheet]);
    }
    
    setWorksheetForm({
      title: '',
      description: '',
      fileName: '',
      assignedDate: '',
      dueDate: '',
      status: 'Active'
    });
    setSelectedWorksheet(null);
    setShowWorksheetModal(false);
  };

  // Submit Test Form
  const handleTestSubmit = (e) => {
    e.preventDefault();
    
    if (selectedTest) {
      // Update existing test
      const updatedTests = tests.map(test =>
        test.id === selectedTest.id ? { ...testForm, id: test.id } : test
      );
      setTests(updatedTests);
    } else {
      // Add new test
      const newTest = {
        ...testForm,
        id: tests.length + 1,
        assignedStudents: students.length
      };
      setTests([...tests, newTest]);
    }
    
    setTestForm({
      title: '',
      date: '',
      startTime: '',
      duration: '',
      totalMarks: '',
      type: 'MCQ',
      assignedStudents: 0,
      resultStatus: 'Scheduled'
    });
    setSelectedTest(null);
    setShowTestModal(false);
  };

  // Submit Settings Form
  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    
    // Update class settings
    setSelectedClass({
      ...selectedClass,
      ...settings
    });
    
    // Show success message or toast
    alert('Settings saved successfully!');
  };

  // Edit Event
  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setEventForm({
      title: event.title,
      date: new Date(event.date),
      startTime: event.startTime,
      endTime: event.endTime,
      description: event.description,
      recurring: event.recurring,
      recurrenceDays: event.recurrenceDays
    });
    setShowEventModal(true);
  };

  // Edit Lesson
  const handleEditLesson = (lesson) => {
    setSelectedLesson(lesson);
    setLessonForm({
      title: lesson.title,
      description: lesson.description,
      date: lesson.date,
      instructor: lesson.instructor,
      materials: lesson.materials,
      completed: lesson.completed
    });
    setShowLessonModal(true);
  };

  // Edit Worksheet
  const handleEditWorksheet = (worksheet) => {
    setSelectedWorksheet(worksheet);
    setWorksheetForm({
      title: worksheet.title,
      description: worksheet.description,
      fileName: worksheet.fileName,
      assignedDate: worksheet.assignedDate,
      dueDate: worksheet.dueDate,
      status: worksheet.status
    });
    setShowWorksheetModal(true);
  };

  // Edit Test
  const handleEditTest = (test) => {
    setSelectedTest(test);
    setTestForm({
      title: test.title,
      date: test.date,
      startTime: test.startTime,
      duration: test.duration,
      totalMarks: test.totalMarks,
      type: test.type,
      assignedStudents: test.assignedStudents,
      resultStatus: test.resultStatus
    });
    setShowTestModal(true);
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = () => {
    const { type, id } = itemToDelete;
    
    if (type === 'event') {
      setEvents(events.filter(event => event.id !== id));
    } else if (type === 'lesson') {
      setLessons(lessons.filter(lesson => lesson.id !== id));
    } else if (type === 'worksheet') {
      setWorksheets(worksheets.filter(worksheet => worksheet.id !== id));
    } else if (type === 'test') {
      setTests(tests.filter(test => test.id !== id));
    } else if (type === 'student') {
      setStudents(students.filter(student => student.id !== id));
    }
    
    setShowDeleteConfirmation(false);
    setItemToDelete({ type: '', id: null });
  };

  // Handle Delete Item
  const handleDeleteItem = (type, id) => {
    setItemToDelete({ type, id });
    setShowDeleteConfirmation(true);
  };

  // Handle View Student Profile
  const handleViewStudentProfile = (student) => {
    setSelectedStudent(student);
    setShowStudentProfileModal(true);
  };

  // Handle Send Message
  const handleSendMessage = (student) => {
    setSelectedStudent(student);
    setShowMessageModal(true);
  };

  // Get initials from name
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const colors = {
      Active: 'bg-green-100 text-green-800',
      Closed: 'bg-gray-100 text-gray-800',
      Scheduled: 'bg-blue-100 text-blue-800',
      Pending: 'bg-yellow-100 text-yellow-800',
      Graded: 'bg-purple-100 text-purple-800'
    };
    
    return `px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`;
  };

  // Get grade badge styling
  const getGradeBadge = (grade) => {
    const colors = {
      'A+': 'bg-green-100 text-green-800',
      'A': 'bg-green-100 text-green-800',
      'A-': 'bg-green-100 text-green-800',
      'B+': 'bg-blue-100 text-blue-800',
      'B': 'bg-blue-100 text-blue-800',
      'B-': 'bg-blue-100 text-blue-800',
      'C+': 'bg-yellow-100 text-yellow-800',
      'C': 'bg-yellow-100 text-yellow-800',
      'C-': 'bg-yellow-100 text-yellow-800',
      'D': 'bg-red-100 text-red-800',
      'F': 'bg-red-100 text-red-800'
    };
    
    return `px-2 py-1 rounded-full text-xs font-medium ${colors[grade] || 'bg-gray-100 text-gray-800'}`;
  };

  // Check if an event is on a specific date
  const isEventOnDate = (event, date) => {
    if (!event.recurring) {
      return (
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
      );
    } else {
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      return event.recurrenceDays.includes(dayName);
    }
  };

  // Get events for a specific date
  const getEventsForDate = (date) => {
    return events.filter(event => isEventOnDate(event, date));
  };

  // Calendar tile content
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const eventsForDate = getEventsForDate(date);
      return eventsForDate.length > 0 ? (
        <div className="event-dot-container">
          {eventsForDate.map((event, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1"
              title={event.title}
            />
          ))}
        </div>
      ) : null;
    }
    return null;
  };

  // Calendar tile onClick
  const handleDateClick = (date) => {
    const eventsForDate = getEventsForDate(date);
    if (eventsForDate.length > 0) {
      // Show events for this date
      console.log("Events for", date.toDateString(), ":", eventsForDate);
    }
  };

  // Render tabs
  const tabs = [
    { id: 'summary', label: 'Summary', icon: FiHome },
    { id: 'calendar', label: 'Calendar', icon: FiCalendar },
    { id: 'lessons', label: 'Lessons', icon: FiBook },
    { id: 'worksheets', label: 'Worksheets', icon: FiFileText },
    { id: 'tests', label: 'Tests', icon: FiClipboard },
    { id: 'students', label: 'Students', icon: FiUsers },
    { id: 'settings', label: 'Settings', icon: FiSettings }
  ];

  // Render tab content
  const renderTabContent = () => {
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
                    <span className="text-gray-600 ml-2">{selectedClass?.schedule.join(', ')}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <SafeIcon icon={FiClock} className="w-4 h-4 text-gray-500 mr-3" />
                    <span className="font-medium text-gray-700">Time:</span>
                    <span className="text-gray-600 ml-2">{selectedClass?.time}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <SafeIcon icon={FiMapPin} className="w-4 h-4 text-gray-500 mr-3" />
                    <span className="font-medium text-gray-700">Room:</span>
                    <span className="text-gray-600 ml-2">{selectedClass?.room}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <SafeIcon icon={FiUsers} className="w-4 h-4 text-gray-500 mr-3" />
                    <span className="font-medium text-gray-700">Capacity:</span>
                    <span className="text-gray-600 ml-2">{selectedClass?.totalStudents}/{selectedClass?.maxCapacity} students</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Class Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
              >
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <SafeIcon icon={FiBook} className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Lessons</p>
                    <p className="text-xl font-bold text-gray-900">{lessons.length}</p>
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
                    <SafeIcon icon={FiFileText} className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Worksheets</p>
                    <p className="text-xl font-bold text-gray-900">{worksheets.length}</p>
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
                    <SafeIcon icon={FiClipboard} className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Tests</p>
                    <p className="text-xl font-bold text-gray-900">{tests.length}</p>
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
                    <SafeIcon icon={FiUsers} className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Students</p>
                    <p className="text-xl font-bold text-gray-900">{students.length}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Events</h3>
              <div className="space-y-3">
                {events.slice(0, 3).map((event, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-800">{event.title}</h4>
                    <p className="text-sm text-gray-600">{event.date.toDateString()} • {event.startTime} - {event.endTime}</p>
                    <p className="text-xs text-gray-500 mt-1">{event.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'calendar':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Class Calendar</h3>
              <button
                onClick={() => {
                  setSelectedEvent(null);
                  setEventForm({
                    title: '',
                    date: new Date(),
                    startTime: '',
                    endTime: '',
                    description: '',
                    recurring: false,
                    recurrenceDays: []
                  });
                  setShowEventModal(true);
                }}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
                Add Event
              </button>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="calendar-container">
                <Calendar
                  onChange={setCalendarDate}
                  value={calendarDate}
                  tileContent={tileContent}
                  onClickDay={handleDateClick}
                  className="react-calendar custom-calendar"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">All Events</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Recurring
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {events.map((event) => (
                      <tr key={event.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {event.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {event.date.toDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {event.startTime} - {event.endTime}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {event.recurring ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              No
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditEvent(event)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <SafeIcon icon={FiEdit} className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem('event', event.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      // Additional cases for other tabs can be added here...
      default:
        return (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
            <p className="text-gray-600">Content for {activeTab} tab will be displayed here.</p>
          </div>
        );
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {selectedClass?.name || 'Class Management'}
              </h1>
              <p className="text-gray-600">
                {selectedClass?.instructor} • {selectedClass?.room} • {selectedClass?.totalStudents}/{selectedClass?.maxCapacity} students
              </p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(selectedClass?.status || 'Active')}`}>
            {selectedClass?.status || 'Active'}
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-4 px-6 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
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
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {renderTabContent()}
        </div>

        {/* Modals */}
        {showEventModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedEvent ? 'Edit Event' : 'Add Event'}
              </h3>
              <form onSubmit={handleEventSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={eventForm.title}
                    onChange={handleEventFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter event title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={eventForm.date.toISOString().split('T')[0]}
                    onChange={(e) => {
                      const newDate = new Date(e.target.value);
                      setEventForm({ ...eventForm, date: newDate });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      name="startTime"
                      value={eventForm.startTime}
                      onChange={handleEventFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      name="endTime"
                      value={eventForm.endTime}
                      onChange={handleEventFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={eventForm.description}
                    onChange={handleEventFormChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter event description"
                  />
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <input
                      id="recurring"
                      name="recurring"
                      type="checkbox"
                      checked={eventForm.recurring}
                      onChange={handleEventFormChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="recurring" className="ml-2 block text-sm text-gray-700">
                      Recurring event
                    </label>
                  </div>

                  {eventForm.recurring && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Recurrence Days
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                          <button
                            key={day}
                            type="button"
                            onClick={() => handleRecurrenceDayToggle(day)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                              eventForm.recurrenceDays.includes(day)
                                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                : 'bg-gray-100 text-gray-800 border border-gray-200'
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEventModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {selectedEvent ? 'Update' : 'Add'} Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <SafeIcon icon={FiTrash2} className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Confirm Deletion</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Are you sure you want to delete this {itemToDelete.type}? This action cannot be undone.
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirmation(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteConfirm}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassManagement;