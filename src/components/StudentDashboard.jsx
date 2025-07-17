import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import StudentProfileDetail from './StudentProfileDetail';

const {
  FiUsers, FiCheck, FiClock, FiX, FiTrendingUp, FiTarget, FiSearch, FiFilter,
  FiDownload, FiPlus, FiChevronDown, FiEdit, FiTrash2, FiMail, FiPhone,
  FiMoreVertical, FiArrowLeft, FiEye, FiUser, FiMapPin, FiCalendar, FiBook,
  FiFileText, FiSend, FiAlertTriangle
} = FiIcons;

const StudentDashboard = ({ onBackToDashboard }) => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [viewingStudentProfile, setViewingStudentProfile] = useState(null);

  // Form states
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    targetScore: '',
    address: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    notes: ''
  });

  const [emailForm, setEmailForm] = useState({
    subject: '',
    message: ''
  });

  // Enhanced mock data for students with detailed profiles
  const mockStudents = [
    {
      id: 1,
      name: 'Alex Johnson',
      email: 'alex.johnson@email.com',
      phone: '+1 (555) 123-4567',
      course: 'SAT Prep',
      targetScore: 1500,
      currentScore: 1320,
      initialScore: 1200,
      progress: 75,
      lessonsCompleted: 15,
      totalLessons: 20,
      status: 'Active',
      grade: 'A',
      payment: 'Paid',
      totalHours: 45,
      avatar: null,
      address: '123 Main St, New York, NY 10001',
      parentName: 'Robert Johnson',
      parentEmail: 'robert.johnson@email.com',
      parentPhone: '+1 (555) 123-4568',
      joinDate: '2024-01-15',
      notes: 'Excellent progress in math section. Needs more practice with reading comprehension.',
      // Enhanced profile data
      instructors: [
        { id: 1, name: 'Dr. Sarah Johnson', subject: 'SAT Math' },
        { id: 2, name: 'Michael Chen', subject: 'SAT English' }
      ],
      class: 'SAT Prep - Premium',
      sectionScores: {
        math: { current: 680, target: 750 },
        reading: { current: 640, target: 750 }
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
        { date: '2023-11-15', composite: 1200, math: 600, reading: 600 },
        { date: '2023-12-10', composite: 1260, math: 630, reading: 630 },
        { date: '2024-01-05', composite: 1320, math: 680, reading: 640 }
      ],
      accountInfo: {
        courseStartDate: '2024-01-15',
        courseEndDate: '2024-06-15',
        highSchool: 'Lincoln High School',
        graduationYear: '2025',
        parents: [
          {
            id: 1,
            name: 'Robert Johnson',
            email: 'robert.johnson@email.com',
            phone: '+1 (555) 123-4568'
          }
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
    },
    {
      id: 2,
      name: 'Sarah Williams',
      email: 'sarah.williams@email.com',
      phone: '+1 (555) 987-6543',
      course: 'ACT Prep',
      targetScore: 32,
      currentScore: 28,
      initialScore: 24,
      progress: 60,
      lessonsCompleted: 12,
      totalLessons: 20,
      status: 'Trial',
      grade: 'B+',
      payment: 'Trial',
      totalHours: 32,
      avatar: null,
      address: '456 Oak Ave, Brooklyn, NY 11201',
      parentName: 'Linda Williams',
      parentEmail: 'linda.williams@email.com',
      parentPhone: '+1 (555) 987-6544',
      joinDate: '2024-02-20',
      notes: 'Strong in English, working on science section improvement.',
      // Enhanced profile data
      instructors: [
        { id: 3, name: 'Dr. Emily Rodriguez', subject: 'ACT English' },
        { id: 4, name: 'James Wilson', subject: 'ACT Science' }
      ],
      class: 'ACT Prep - Standard',
      sectionScores: {
        english: { current: 30, target: 34 },
        math: { current: 26, target: 30 },
        reading: { current: 28, target: 32 },
        science: { current: 28, target: 32 }
      },
      overdueWork: [
        { id: 1, type: 'worksheet', name: 'Science Reasoning Practice', dueDate: '2024-02-18' }
      ],
      upcomingWork: [
        { id: 2, type: 'lesson', name: 'English Grammar Review', date: '2024-02-25' },
        { id: 3, type: 'test', name: 'ACT Practice Test 3', date: '2024-02-28' }
      ],
      scoreHistory: [
        { date: '2024-01-15', composite: 24, english: 26, math: 22, reading: 25, science: 23 },
        { date: '2024-02-05', composite: 26, english: 28, math: 24, reading: 27, science: 25 },
        { date: '2024-02-15', composite: 28, english: 30, math: 26, reading: 28, science: 28 }
      ],
      accountInfo: {
        courseStartDate: '2024-02-01',
        courseEndDate: '2024-07-01',
        highSchool: 'Brooklyn Academy',
        graduationYear: '2025',
        parents: [
          {
            id: 1,
            name: 'Linda Williams',
            email: 'linda.williams@email.com',
            phone: '+1 (555) 987-6544'
          }
        ],
        progressReports: {
          sendToStudent: true,
          sendToParent: true,
          frequency: 'biweekly',
          nextReport: '2024-02-28'
        },
        settings: {
          loginRestriction: false,
          archived: false,
          excludeFromStats: false
        }
      }
    },
    {
      id: 3,
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+1 (555) 456-7890',
      course: 'GRE Prep',
      targetScore: 320,
      currentScore: 310,
      initialScore: 295,
      progress: 85,
      lessonsCompleted: 17,
      totalLessons: 20,
      status: 'Active',
      grade: 'A',
      payment: 'Paid',
      totalHours: 52,
      avatar: null,
      address: '789 Pine St, Manhattan, NY 10016',
      parentName: 'David Chen',
      parentEmail: 'david.chen@email.com',
      parentPhone: '+1 (555) 456-7891',
      joinDate: '2024-01-08',
      notes: 'Exceptional analytical writing skills. Consistent performance across all sections.',
      // Enhanced profile data
      instructors: [
        { id: 5, name: 'Dr. Patricia Moore', subject: 'GRE Verbal' },
        { id: 6, name: 'Dr. Kevin Zhang', subject: 'GRE Quantitative' }
      ],
      class: 'GRE Prep - Premium Plus',
      sectionScores: {
        verbal: { current: 155, target: 160 },
        quantitative: { current: 155, target: 160 },
        writing: { current: 4.0, target: 4.5 }
      },
      overdueWork: [],
      upcomingWork: [
        { id: 1, type: 'lesson', name: 'Advanced Vocabulary', date: '2024-01-30' },
        { id: 2, type: 'test', name: 'GRE Practice Test 4', date: '2024-02-02' }
      ],
      scoreHistory: [
        { date: '2023-12-01', composite: 295, verbal: 148, quantitative: 147, writing: 3.5 },
        { date: '2023-12-20', composite: 302, verbal: 151, quantitative: 151, writing: 3.5 },
        { date: '2024-01-15', composite: 310, verbal: 155, quantitative: 155, writing: 4.0 }
      ],
      accountInfo: {
        courseStartDate: '2023-11-15',
        courseEndDate: '2024-04-15',
        university: 'Columbia University',
        graduationYear: '2024',
        parents: [
          {
            id: 1,
            name: 'David Chen',
            email: 'david.chen@email.com',
            phone: '+1 (555) 456-7891'
          }
        ],
        progressReports: {
          sendToStudent: true,
          sendToParent: false,
          frequency: 'weekly',
          nextReport: '2024-01-30'
        },
        settings: {
          loginRestriction: false,
          archived: false,
          excludeFromStats: false
        }
      }
    },
    {
      id: 4,
      name: 'Emma Davis',
      email: 'emma.davis@email.com',
      phone: '+1 (555) 321-0987',
      course: 'GMAT Prep',
      targetScore: 700,
      currentScore: 650,
      initialScore: 580,
      progress: 40,
      lessonsCompleted: 8,
      totalLessons: 20,
      status: 'Inactive',
      grade: 'B',
      payment: 'Pending',
      totalHours: 25,
      avatar: null,
      address: '321 Elm St, Queens, NY 11375',
      parentName: 'Michelle Davis',
      parentEmail: 'michelle.davis@email.com',
      parentPhone: '+1 (555) 321-0988',
      joinDate: '2024-03-10',
      notes: 'Taking a break due to work commitments. Plans to resume next month.',
      // Enhanced profile data
      instructors: [
        { id: 7, name: 'Dr. Amanda Roberts', subject: 'GMAT Verbal' },
        { id: 8, name: 'Dr. Thomas Kim', subject: 'GMAT Quantitative' }
      ],
      class: 'GMAT Prep - Executive',
      sectionScores: {
        verbal: { current: 32, target: 38 },
        quantitative: { current: 45, target: 48 },
        writing: { current: 5.0, target: 5.5 },
        reasoning: { current: 6, target: 7 }
      },
      overdueWork: [
        { id: 1, type: 'worksheet', name: 'Critical Reasoning Practice', dueDate: '2024-03-15' },
        { id: 2, type: 'lesson', name: 'Data Sufficiency Review', dueDate: '2024-03-18' }
      ],
      upcomingWork: [],
      scoreHistory: [
        { date: '2024-02-15', composite: 580, verbal: 28, quantitative: 41, writing: 4.5, reasoning: 5 },
        { date: '2024-03-01', composite: 620, verbal: 30, quantitative: 43, writing: 4.5, reasoning: 5 },
        { date: '2024-03-15', composite: 650, verbal: 32, quantitative: 45, writing: 5.0, reasoning: 6 }
      ],
      accountInfo: {
        courseStartDate: '2024-02-01',
        courseEndDate: '2024-08-01',
        company: 'McKinsey & Company',
        position: 'Business Analyst',
        parents: [
          {
            id: 1,
            name: 'Michelle Davis',
            email: 'michelle.davis@email.com',
            phone: '+1 (555) 321-0988'
          }
        ],
        progressReports: {
          sendToStudent: true,
          sendToParent: false,
          frequency: 'monthly',
          nextReport: '2024-04-01'
        },
        settings: {
          loginRestriction: false,
          archived: false,
          excludeFromStats: false
        }
      }
    },
    {
      id: 5,
      name: 'David Rodriguez',
      email: 'david.rodriguez@email.com',
      phone: '+1 (555) 654-3210',
      course: 'SAT Prep',
      targetScore: 1400,
      currentScore: 1280,
      initialScore: 1150,
      progress: 70,
      lessonsCompleted: 14,
      totalLessons: 20,
      status: 'Active',
      grade: 'B+',
      payment: 'Paid',
      totalHours: 40,
      avatar: null,
      address: '654 Cedar Ave, Bronx, NY 10451',
      parentName: 'Carlos Rodriguez',
      parentEmail: 'carlos.rodriguez@email.com',
      parentPhone: '+1 (555) 654-3211',
      joinDate: '2024-02-05',
      notes: 'Great improvement trajectory. Very motivated and consistent with practice.',
      // Enhanced profile data
      instructors: [
        { id: 1, name: 'Dr. Sarah Johnson', subject: 'SAT Math' },
        { id: 9, name: 'Lisa Thompson', subject: 'SAT Reading' }
      ],
      class: 'SAT Prep - Standard',
      sectionScores: {
        math: { current: 650, target: 700 },
        reading: { current: 630, target: 700 }
      },
      overdueWork: [
        { id: 1, type: 'worksheet', name: 'Reading Passage Analysis', dueDate: '2024-02-20' }
      ],
      upcomingWork: [
        { id: 2, type: 'lesson', name: 'Math Problem Solving Strategies', date: '2024-02-26' },
        { id: 3, type: 'session', name: 'Mock Test Review', date: '2024-02-28' }
      ],
      scoreHistory: [
        { date: '2024-01-15', composite: 1150, math: 580, reading: 570 },
        { date: '2024-02-01', composite: 1220, math: 620, reading: 600 },
        { date: '2024-02-15', composite: 1280, math: 650, reading: 630 }
      ],
      accountInfo: {
        courseStartDate: '2024-01-20',
        courseEndDate: '2024-06-20',
        highSchool: 'Bronx Science High School',
        graduationYear: '2025',
        parents: [
          {
            id: 1,
            name: 'Carlos Rodriguez',
            email: 'carlos.rodriguez@email.com',
            phone: '+1 (555) 654-3211'
          }
        ],
        progressReports: {
          sendToStudent: true,
          sendToParent: true,
          frequency: 'weekly',
          nextReport: '2024-02-28'
        },
        settings: {
          loginRestriction: false,
          archived: false,
          excludeFromStats: false
        }
      }
    }
  ];

  useEffect(() => {
    setStudents(mockStudents);
    setFilteredStudents(mockStudents);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.course.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || student.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesCourse = courseFilter === 'all' || student.course === courseFilter;

      return matchesSearch && matchesStatus && matchesCourse;
    });

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredStudents(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, courseFilter, students, sortConfig]);

  // Calculate summary statistics
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'Active').length;
  const trialStudents = students.filter(s => s.status === 'Trial').length;
  const inactiveStudents = students.filter(s => s.status === 'Inactive').length;
  const avgProgress = Math.round(students.reduce((sum, s) => sum + s.progress, 0) / students.length);
  const avgImprovement = Math.round(students.reduce((sum, s) => sum + (s.currentScore - s.initialScore), 0) / students.length);

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredStudents.length / recordsPerPage);

  // Handle functions
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStudents(currentStudents.map(s => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Email', 'Course', 'Status', 'Progress', 'Current Score', 'Improvement', 'Grade', 'Payment'],
      ...filteredStudents.map(student => [
        student.name,
        student.email,
        student.course,
        student.status,
        `${student.progress}%`,
        student.currentScore,
        `+${student.currentScore - student.initialScore}`,
        student.grade,
        student.payment
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Action handlers
  const handleViewProfile = (student) => {
    setSelectedStudent(student);
    setShowProfileModal(true);
  };

  const handleViewDetailedProfile = (student) => {
    setViewingStudentProfile(student);
  };

  const handleBackToStudentList = () => {
    setViewingStudentProfile(null);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setStudentForm({
      name: student.name,
      email: student.email,
      phone: student.phone,
      course: student.course,
      targetScore: student.targetScore.toString(),
      address: student.address,
      parentName: student.parentName,
      parentEmail: student.parentEmail,
      parentPhone: student.parentPhone,
      notes: student.notes
    });
    setShowEditModal(true);
  };

  const handleSendEmail = (student) => {
    setSelectedStudent(student);
    setEmailForm({
      subject: `Regarding ${student.name}'s Progress in ${student.course}`,
      message: `Dear ${student.name},\n\nI hope this email finds you well. I wanted to reach out regarding your progress in the ${student.course} program.\n\nBest regards,\nTestPrepPundits Team`
    });
    setShowEmailModal(true);
  };

  const handleDeleteStudent = (student) => {
    setStudentToDelete(student);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    setStudents(prev => prev.filter(s => s.id !== studentToDelete.id));
    setShowDeleteConfirmation(false);
    setStudentToDelete(null);
  };

  const handleStudentFormSubmit = (e) => {
    e.preventDefault();
    
    if (selectedStudent) {
      // Update existing student
      setStudents(prev => prev.map(student =>
        student.id === selectedStudent.id
          ? {
              ...student,
              name: studentForm.name,
              email: studentForm.email,
              phone: studentForm.phone,
              course: studentForm.course,
              targetScore: parseInt(studentForm.targetScore),
              address: studentForm.address,
              parentName: studentForm.parentName,
              parentEmail: studentForm.parentEmail,
              parentPhone: studentForm.parentPhone,
              notes: studentForm.notes
            }
          : student
      ));
    } else {
      // Add new student
      const newStudent = {
        id: students.length + 1,
        ...studentForm,
        targetScore: parseInt(studentForm.targetScore),
        currentScore: 0,
        initialScore: 0,
        progress: 0,
        lessonsCompleted: 0,
        totalLessons: 20,
        status: 'Trial',
        grade: 'N/A',
        payment: 'Trial',
        totalHours: 0,
        avatar: null,
        joinDate: new Date().toISOString().split('T')[0],
        // Add basic profile structure
        instructors: [],
        class: `${studentForm.course} - Standard`,
        sectionScores: {},
        overdueWork: [],
        upcomingWork: [],
        scoreHistory: [],
        accountInfo: {
          courseStartDate: new Date().toISOString().split('T')[0],
          courseEndDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          parents: studentForm.parentName ? [{
            id: 1,
            name: studentForm.parentName,
            email: studentForm.parentEmail,
            phone: studentForm.parentPhone
          }] : [],
          progressReports: {
            sendToStudent: true,
            sendToParent: true,
            frequency: 'weekly',
            nextReport: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          },
          settings: {
            loginRestriction: false,
            archived: false,
            excludeFromStats: false
          }
        }
      };
      setStudents(prev => [...prev, newStudent]);
    }

    setShowAddModal(false);
    setShowEditModal(false);
    setStudentForm({
      name: '',
      email: '',
      phone: '',
      course: '',
      targetScore: '',
      address: '',
      parentName: '',
      parentEmail: '',
      parentPhone: '',
      notes: ''
    });
    setSelectedStudent(null);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Simulate sending email
    alert(`Email sent successfully to ${selectedStudent.name}!\n\nSubject: ${emailForm.subject}\n\nMessage: ${emailForm.message}`);
    setShowEmailModal(false);
    setEmailForm({ subject: '', message: '' });
    setSelectedStudent(null);
  };

  const getStatusBadge = (status) => {
    const colors = {
      Active: 'bg-green-100 text-green-800',
      Trial: 'bg-yellow-100 text-yellow-800',
      Inactive: 'bg-red-100 text-red-800'
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`;
  };

  const getPaymentBadge = (payment) => {
    const colors = {
      Paid: 'bg-green-100 text-green-800',
      Trial: 'bg-blue-100 text-blue-800',
      Pending: 'bg-orange-100 text-orange-800'
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${colors[payment]}`;
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // If viewing a detailed student profile, show the StudentProfileDetail component
  if (viewingStudentProfile) {
    return (
      <StudentProfileDetail
        student={viewingStudentProfile}
        onBackToStudentList={handleBackToStudentList}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-8 flex items-center">
          <button
            onClick={onBackToDashboard}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors mr-6"
          >
            <SafeIcon icon={FiArrowLeft} className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Students</h1>
            <p className="text-gray-600">Manage and track student progress across all courses</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <SafeIcon icon={FiUsers} className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{activeStudents}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <SafeIcon icon={FiClock} className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Trial</p>
                <p className="text-2xl font-bold text-gray-900">{trialStudents}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <SafeIcon icon={FiX} className="w-5 h-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <p className="text-2xl font-bold text-gray-900">{inactiveStudents}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <SafeIcon icon={FiTarget} className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Avg Progress</p>
                <p className="text-2xl font-bold text-gray-900">{avgProgress}%</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Avg Improvement</p>
                <p className="text-2xl font-bold text-gray-900">{avgImprovement} pts</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <SafeIcon icon={FiFilter} className="w-4 h-4 mr-2" />
                  Filters
                  <SafeIcon icon={FiChevronDown} className="w-4 h-4 ml-2" />
                </button>

                {showFilters && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <div className="p-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="all">All Status</option>
                          <option value="active">Active</option>
                          <option value="trial">Trial</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                        <select
                          value={courseFilter}
                          onChange={(e) => setCourseFilter(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="all">All Courses</option>
                          <option value="SAT Prep">SAT Prep</option>
                          <option value="ACT Prep">ACT Prep</option>
                          <option value="GRE Prep">GRE Prep</option>
                          <option value="GMAT Prep">GMAT Prep</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={exportToCSV}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
                Export
              </button>
              <button
                onClick={() => {
                  setSelectedStudent(null);
                  setStudentForm({
                    name: '',
                    email: '',
                    phone: '',
                    course: '',
                    targetScore: '',
                    address: '',
                    parentName: '',
                    parentEmail: '',
                    parentPhone: '',
                    notes: ''
                  });
                  setShowAddModal(true);
                }}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
                Add Student
              </button>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedStudents.length === currentStudents.length && currentStudents.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    Student
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('course')}
                  >
                    Course
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('status')}
                  >
                    Status
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('progress')}
                  >
                    Progress
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('currentScore')}
                  >
                    Current Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Improvement
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('grade')}
                  >
                    Grade
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('payment')}
                  >
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentStudents.map((student) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => handleSelectStudent(student.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {getInitials(student.name)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <SafeIcon icon={FiMail} className="w-3 h-3 mr-1" />
                            {student.email}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <SafeIcon icon={FiPhone} className="w-3 h-3 mr-1" />
                            {student.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.course}</div>
                      <div className="text-sm text-gray-500">Target: {student.targetScore}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(student.status)}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${student.progress}%` }}
                        ></div>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {student.progress}% • {student.lessonsCompleted}/{student.totalLessons} lessons
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{student.currentScore}</div>
                      <div className="text-sm text-gray-500">Initial: {student.initialScore}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">
                        +{student.currentScore - student.initialScore} pts
                      </div>
                      <div className="text-sm text-gray-500">{student.totalHours} hours</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{student.grade}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getPaymentBadge(student.payment)}>
                        {student.payment}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleViewDetailedProfile(student)}
                          className="text-purple-600 hover:text-purple-900 p-1 rounded-lg hover:bg-purple-50 transition-colors"
                          title="View Detailed Profile"
                        >
                          <SafeIcon icon={FiUser} className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleViewProfile(student)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-lg hover:bg-blue-50 transition-colors"
                          title="Quick View Profile"
                        >
                          <SafeIcon icon={FiEye} className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEditStudent(student)}
                          className="text-green-600 hover:text-green-900 p-1 rounded-lg hover:bg-green-50 transition-colors"
                          title="Edit Student"
                        >
                          <SafeIcon icon={FiEdit} className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleSendEmail(student)}
                          className="text-orange-600 hover:text-orange-900 p-1 rounded-lg hover:bg-orange-50 transition-colors"
                          title="Send Email"
                        >
                          <SafeIcon icon={FiMail} className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteStudent(student)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete Student"
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

          {/* Pagination */}
          <div className="bg-white px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Show</span>
                <select
                  value={recordsPerPage}
                  onChange={(e) => setRecordsPerPage(Number(e.target.value))}
                  className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-700">per page</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredStudents.length)} of {filteredStudents.length} results
                </span>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 border rounded text-sm ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <AnimatePresence>
          {/* Quick View Profile Modal */}
          {showProfileModal && selectedStudent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={(e) => e.target === e.currentTarget && setShowProfileModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Student Profile</h2>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => {
                          setShowProfileModal(false);
                          handleViewDetailedProfile(selectedStudent);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        View Detailed Profile
                      </button>
                      <button
                        onClick={() => setShowProfileModal(false)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <SafeIcon icon={FiX} className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Student Header */}
                  <div className="flex items-start space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-700">
                        {getInitials(selectedStudent.name)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900">{selectedStudent.name}</h3>
                      <p className="text-gray-600">{selectedStudent.course}</p>
                      <div className="flex items-center mt-2 space-x-4">
                        <span className={getStatusBadge(selectedStudent.status)}>
                          {selectedStudent.status}
                        </span>
                        <span className={getPaymentBadge(selectedStudent.payment)}>
                          {selectedStudent.payment}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Student Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contact Information */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <SafeIcon icon={FiMail} className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-700">{selectedStudent.email}</span>
                        </div>
                        <div className="flex items-center">
                          <SafeIcon icon={FiPhone} className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-700">{selectedStudent.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <SafeIcon icon={FiMapPin} className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-700">{selectedStudent.address}</span>
                        </div>
                      </div>
                    </div>

                    {/* Academic Information */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Academic Information</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Course:</span>
                          <span className="text-sm font-medium text-gray-900">{selectedStudent.course}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Target Score:</span>
                          <span className="text-sm font-medium text-gray-900">{selectedStudent.targetScore}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Current Score:</span>
                          <span className="text-sm font-medium text-gray-900">{selectedStudent.currentScore}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Progress:</span>
                          <span className="text-sm font-medium text-gray-900">{selectedStudent.progress}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Grade:</span>
                          <span className="text-sm font-medium text-gray-900">{selectedStudent.grade}</span>
                        </div>
                      </div>
                    </div>

                    {/* Parent Information */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Parent/Guardian</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <SafeIcon icon={FiUser} className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-700">{selectedStudent.parentName}</span>
                        </div>
                        <div className="flex items-center">
                          <SafeIcon icon={FiMail} className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-700">{selectedStudent.parentEmail}</span>
                        </div>
                        <div className="flex items-center">
                          <SafeIcon icon={FiPhone} className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-700">{selectedStudent.parentPhone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Statistics */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Progress Statistics</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Lessons Completed:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {selectedStudent.lessonsCompleted}/{selectedStudent.totalLessons}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Total Hours:</span>
                          <span className="text-sm font-medium text-gray-900">{selectedStudent.totalHours}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Join Date:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {new Date(selectedStudent.joinDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Improvement:</span>
                          <span className="text-sm font-medium text-green-600">
                            +{selectedStudent.currentScore - selectedStudent.initialScore} pts
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedStudent.notes && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Notes</h4>
                      <p className="text-sm text-gray-700">{selectedStudent.notes}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Add/Edit Student Modal */}
          {(showAddModal || showEditModal) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={(e) => e.target === e.currentTarget && (setShowAddModal(false) || setShowEditModal(false))}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedStudent ? 'Edit Student' : 'Add New Student'}
                    </h2>
                    <button
                      onClick={() => {
                        setShowAddModal(false);
                        setShowEditModal(false);
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <SafeIcon icon={FiX} className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <form onSubmit={handleStudentFormSubmit} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        value={studentForm.name}
                        onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter student name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        value={studentForm.email}
                        onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                      <input
                        type="tel"
                        value={studentForm.phone}
                        onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Course *</label>
                      <select
                        value={studentForm.course}
                        onChange={(e) => setStudentForm({ ...studentForm, course: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select a course</option>
                        <option value="SAT Prep">SAT Prep</option>
                        <option value="ACT Prep">ACT Prep</option>
                        <option value="GRE Prep">GRE Prep</option>
                        <option value="GMAT Prep">GMAT Prep</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Target Score *</label>
                      <input
                        type="number"
                        value={studentForm.targetScore}
                        onChange={(e) => setStudentForm({ ...studentForm, targetScore: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter target score"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input
                        type="text"
                        value={studentForm.address}
                        onChange={(e) => setStudentForm({ ...studentForm, address: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Parent/Guardian Name</label>
                      <input
                        type="text"
                        value={studentForm.parentName}
                        onChange={(e) => setStudentForm({ ...studentForm, parentName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter parent name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Parent Email</label>
                      <input
                        type="email"
                        value={studentForm.parentEmail}
                        onChange={(e) => setStudentForm({ ...studentForm, parentEmail: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter parent email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Parent Phone</label>
                      <input
                        type="tel"
                        value={studentForm.parentPhone}
                        onChange={(e) => setStudentForm({ ...studentForm, parentPhone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter parent phone"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={studentForm.notes}
                      onChange={(e) => setStudentForm({ ...studentForm, notes: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter any additional notes"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false);
                        setShowEditModal(false);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {selectedStudent ? 'Update Student' : 'Add Student'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}

          {/* Email Modal */}
          {showEmailModal && selectedStudent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={(e) => e.target === e.currentTarget && setShowEmailModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl w-full max-w-lg"
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Send Email</h2>
                    <button
                      onClick={() => setShowEmailModal(false)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <SafeIcon icon={FiX} className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <form onSubmit={handleEmailSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                    <input
                      type="email"
                      value={selectedStudent.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                    <input
                      type="text"
                      value={emailForm.subject}
                      onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter email subject"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                    <textarea
                      value={emailForm.message}
                      onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your message"
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowEmailModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <SafeIcon icon={FiSend} className="w-4 h-4 mr-2" />
                      Send Email
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteConfirmation && studentToDelete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={(e) => e.target === e.currentTarget && setShowDeleteConfirmation(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl p-6 w-full max-w-md"
              >
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                  <SafeIcon icon={FiAlertTriangle} className="w-6 h-6 text-red-600" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                  Delete Student
                </h3>
                
                <p className="text-gray-600 text-center mb-6">
                  Are you sure you want to delete <strong>{studentToDelete.name}</strong>? 
                  This action cannot be undone and will remove all associated data.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirmation(false)}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StudentDashboard;