import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {
  FiUsers, FiCheck, FiClock, FiX, FiStar, FiTrendingUp, FiSearch, FiFilter,
  FiDownload, FiPlus, FiChevronDown, FiEdit, FiTrash2, FiEye, FiMail, FiArrowLeft,
  FiMapPin, FiCalendar, FiDollarSign, FiBook, FiAward, FiPhone, FiUser,
  FiSend, FiAlertTriangle
} = FiIcons;

const InstructorDashboard = ({ onBackToDashboard }) => {
  const [instructors, setInstructors] = useState([]);
  const [filteredInstructors, setFilteredInstructors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [selectedInstructors, setSelectedInstructors] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [instructorToDelete, setInstructorToDelete] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Form states
  const [instructorForm, setInstructorForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    subjects: '',
    experience: '',
    hourlyRate: '',
    employmentType: '',
    bio: '',
    qualifications: '',
    specializations: '',
    languages: '',
    availability: ''
  });

  const [emailForm, setEmailForm] = useState({
    subject: '',
    message: ''
  });

  // Mock data for instructors
  const mockInstructors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@testpreppundits.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      subjects: ['SAT Math', 'ACT Math', 'Algebra'],
      status: 'Active',
      rating: 4.9,
      totalStudents: 45,
      totalLessons: 320,
      experience: 8,
      hourlyRate: 85,
      employmentType: 'Full-time',
      joinDate: '2019-03-15',
      avatar: null,
      bio: 'Experienced mathematics instructor with PhD in Applied Mathematics.',
      qualifications: ['PhD in Applied Mathematics', 'Certified SAT Tutor'],
      specializations: ['Advanced Calculus', 'Statistics', 'Algebra'],
      languages: ['English', 'Spanish'],
      availability: 'Mon-Fri 9AM-6PM',
      achievements: ['Top Rated Instructor 2023'],
      totalRevenue: 272000,
      avgScoreImprovement: 150
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@testpreppundits.com',
      phone: '+1 (555) 987-6543',
      location: 'San Francisco, CA',
      subjects: ['SAT Reading', 'ACT English', 'Essay Writing'],
      status: 'Active',
      rating: 4.7,
      totalStudents: 38,
      totalLessons: 285,
      experience: 6,
      hourlyRate: 75,
      employmentType: 'Part-time',
      joinDate: '2020-08-22',
      avatar: null,
      bio: 'English Literature graduate with expertise in reading comprehension.',
      qualifications: ['MA in English Literature', 'TESOL Certification'],
      specializations: ['Critical Reading', 'Essay Writing', 'Grammar'],
      languages: ['English', 'Mandarin'],
      availability: 'Tue-Thu 2PM-8PM',
      achievements: ['Rising Star 2022'],
      totalRevenue: 213750,
      avgScoreImprovement: 120
    }
  ];

  useEffect(() => {
    setInstructors(mockInstructors);
    setFilteredInstructors(mockInstructors);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = instructors.filter(instructor => {
      const matchesSearch = instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           instructor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           instructor.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || instructor.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesSubject = subjectFilter === 'all' || instructor.subjects.some(subject => subject.includes(subjectFilter));
      
      let matchesExperience = true;
      if (experienceFilter !== 'all') {
        const [min, max] = experienceFilter.split('-').map(Number);
        matchesExperience = max ? instructor.experience >= min && instructor.experience <= max : instructor.experience >= min;
      }

      return matchesSearch && matchesStatus && matchesSubject && matchesExperience;
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

    setFilteredInstructors(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, subjectFilter, experienceFilter, instructors, sortConfig]);

  // Calculate summary statistics
  const totalInstructors = instructors.length;
  const activeInstructors = instructors.filter(i => i.status === 'Active').length;
  const inactiveInstructors = instructors.filter(i => i.status === 'Inactive').length;
  const pendingInstructors = instructors.filter(i => i.status === 'Pending').length;
  const avgRating = instructors.length > 0 ? (instructors.reduce((sum, i) => sum + i.rating, 0) / instructors.length).toFixed(1) : '0.0';
  const totalStudents = instructors.reduce((sum, i) => sum + i.totalStudents, 0);

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentInstructors = filteredInstructors.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredInstructors.length / recordsPerPage);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedInstructors(currentInstructors.map(i => i.id));
    } else {
      setSelectedInstructors([]);
    }
  };

  const handleSelectInstructor = (instructorId) => {
    setSelectedInstructors(prev =>
      prev.includes(instructorId)
        ? prev.filter(id => id !== instructorId)
        : [...prev, instructorId]
    );
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Email', 'Location', 'Subjects', 'Status', 'Rating', 'Students', 'Experience', 'Rate', 'Join Date'],
      ...filteredInstructors.map(instructor => [
        instructor.name,
        instructor.email,
        instructor.location,
        instructor.subjects.join(';'),
        instructor.status,
        instructor.rating,
        instructor.totalStudents,
        `${instructor.experience} years`,
        `$${instructor.hourlyRate}/hr`,
        instructor.joinDate
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'instructors.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Action handlers
  const handleViewProfile = (instructor) => {
    setSelectedInstructor(instructor);
    setShowProfileModal(true);
  };

  const handleEditInstructor = (instructor) => {
    setSelectedInstructor(instructor);
    setInstructorForm({
      name: instructor.name,
      email: instructor.email,
      phone: instructor.phone,
      location: instructor.location,
      subjects: instructor.subjects.join(', '),
      experience: instructor.experience.toString(),
      hourlyRate: instructor.hourlyRate.toString(),
      employmentType: instructor.employmentType,
      bio: instructor.bio,
      qualifications: instructor.qualifications ? instructor.qualifications.join(', ') : '',
      specializations: instructor.specializations ? instructor.specializations.join(', ') : '',
      languages: instructor.languages ? instructor.languages.join(', ') : '',
      availability: instructor.availability || ''
    });
    setShowEditModal(true);
  };

  const handleSendEmail = (instructor) => {
    setSelectedInstructor(instructor);
    setEmailForm({
      subject: `Regarding Your Teaching Schedule - ${instructor.name}`,
      message: `Dear ${instructor.name},\n\nI hope this message finds you well. I wanted to reach out regarding your current teaching schedule and upcoming classes.\n\nBest regards,\nTestPrepPundits Administration`
    });
    setShowEmailModal(true);
  };

  const handleDeleteInstructor = (instructor) => {
    setInstructorToDelete(instructor);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    setInstructors(prev => prev.filter(i => i.id !== instructorToDelete.id));
    setShowDeleteConfirmation(false);
    setInstructorToDelete(null);
  };

  const handleInstructorFormSubmit = (e) => {
    e.preventDefault();
    
    if (selectedInstructor) {
      // Update existing instructor
      setInstructors(prev => prev.map(instructor =>
        instructor.id === selectedInstructor.id
          ? {
              ...instructor,
              name: instructorForm.name,
              email: instructorForm.email,
              phone: instructorForm.phone,
              location: instructorForm.location,
              subjects: instructorForm.subjects.split(',').map(s => s.trim()),
              experience: parseInt(instructorForm.experience),
              hourlyRate: parseInt(instructorForm.hourlyRate),
              employmentType: instructorForm.employmentType,
              bio: instructorForm.bio,
              qualifications: instructorForm.qualifications.split(',').map(s => s.trim()).filter(s => s),
              specializations: instructorForm.specializations.split(',').map(s => s.trim()).filter(s => s),
              languages: instructorForm.languages.split(',').map(s => s.trim()).filter(s => s),
              availability: instructorForm.availability
            }
          : instructor
      ));
    } else {
      // Add new instructor
      const newInstructor = {
        id: instructors.length + 1,
        name: instructorForm.name,
        email: instructorForm.email,
        phone: instructorForm.phone,
        location: instructorForm.location,
        subjects: instructorForm.subjects.split(',').map(s => s.trim()),
        status: 'Pending',
        rating: 0,
        totalStudents: 0,
        totalLessons: 0,
        experience: parseInt(instructorForm.experience),
        hourlyRate: parseInt(instructorForm.hourlyRate),
        employmentType: instructorForm.employmentType,
        joinDate: new Date().toISOString().split('T')[0],
        avatar: null,
        bio: instructorForm.bio,
        qualifications: instructorForm.qualifications.split(',').map(s => s.trim()).filter(s => s),
        specializations: instructorForm.specializations.split(',').map(s => s.trim()).filter(s => s),
        languages: instructorForm.languages.split(',').map(s => s.trim()).filter(s => s),
        availability: instructorForm.availability,
        achievements: [],
        totalRevenue: 0,
        avgScoreImprovement: 0
      };
      setInstructors(prev => [...prev, newInstructor]);
    }

    setShowAddModal(false);
    setShowEditModal(false);
    setInstructorForm({
      name: '',
      email: '',
      phone: '',
      location: '',
      subjects: '',
      experience: '',
      hourlyRate: '',
      employmentType: '',
      bio: '',
      qualifications: '',
      specializations: '',
      languages: '',
      availability: ''
    });
    setSelectedInstructor(null);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    alert(`Email sent successfully to ${selectedInstructor.name}!\n\nSubject: ${emailForm.subject}\n\nMessage: ${emailForm.message}`);
    setShowEmailModal(false);
    setEmailForm({ subject: '', message: '' });
    setSelectedInstructor(null);
  };

  const getStatusBadge = (status) => {
    const colors = {
      Active: 'bg-green-100 text-green-800',
      Inactive: 'bg-red-100 text-red-800',
      Pending: 'bg-yellow-100 text-yellow-800'
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`;
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<SafeIcon key={i} icon={FiStar} className="w-4 h-4 text-yellow-400 fill-current" />);
    }
    if (hasHalfStar) {
      stars.push(<SafeIcon key="half" icon={FiStar} className="w-4 h-4 text-yellow-400 fill-current opacity-50" />);
    }
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<SafeIcon key={`empty-${i}`} icon={FiStar} className="w-4 h-4 text-gray-300" />);
    }
    return stars;
  };

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Instructors</h1>
            <p className="text-gray-600">Manage and track instructor performance across all subjects</p>
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
                <p className="text-sm font-medium text-gray-600">Total Instructors</p>
                <p className="text-2xl font-bold text-gray-900">{totalInstructors}</p>
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
                <p className="text-2xl font-bold text-gray-900">{activeInstructors}</p>
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
              <div className="p-2 bg-red-100 rounded-lg">
                <SafeIcon icon={FiX} className="w-5 h-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <p className="text-2xl font-bold text-gray-900">{inactiveInstructors}</p>
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
              <div className="p-2 bg-yellow-100 rounded-lg">
                <SafeIcon icon={FiClock} className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{pendingInstructors}</p>
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
                <SafeIcon icon={FiStar} className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">{avgRating}</p>
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
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{totalStudents.toLocaleString()}</p>
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
                  placeholder="Search instructors..."
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
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
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
                          <option value="inactive">Inactive</option>
                          <option value="pending">Pending</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                        <select
                          value={subjectFilter}
                          onChange={(e) => setSubjectFilter(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="all">All Subjects</option>
                          <option value="SAT">SAT</option>
                          <option value="ACT">ACT</option>
                          <option value="GRE">GRE</option>
                          <option value="GMAT">GMAT</option>
                          <option value="Math">Math</option>
                          <option value="English">English</option>
                          <option value="Writing">Writing</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                        <select
                          value={experienceFilter}
                          onChange={(e) => setExperienceFilter(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="all">All Experience</option>
                          <option value="0-2">0-2 years</option>
                          <option value="3-5">3-5 years</option>
                          <option value="6-10">6-10 years</option>
                          <option value="10">10+ years</option>
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
                  setSelectedInstructor(null);
                  setInstructorForm({
                    name: '',
                    email: '',
                    phone: '',
                    location: '',
                    subjects: '',
                    experience: '',
                    hourlyRate: '',
                    employmentType: '',
                    bio: '',
                    qualifications: '',
                    specializations: '',
                    languages: '',
                    availability: ''
                  });
                  setShowAddModal(true);
                }}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
                Add Instructor
              </button>
            </div>
          </div>
        </div>

        {/* Instructors Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedInstructors.length === currentInstructors.length && currentInstructors.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subjects
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('status')}
                  >
                    Status
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('rating')}
                  >
                    Rating
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('totalStudents')}
                  >
                    Students
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('experience')}
                  >
                    Experience
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('hourlyRate')}
                  >
                    Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentInstructors.map((instructor) => (
                  <tr key={instructor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedInstructors.includes(instructor.id)}
                        onChange={() => handleSelectInstructor(instructor.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {getInitials(instructor.name)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{instructor.name}</div>
                          <div className="text-sm text-gray-500">{instructor.email}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <SafeIcon icon={FiMapPin} className="w-3 h-3 mr-1" />
                            {instructor.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {instructor.subjects.map((subject, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(instructor.status)}>
                        {instructor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex mr-2">
                          {renderStars(instructor.rating)}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{instructor.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{instructor.totalStudents}</div>
                      <div className="text-sm text-gray-500">{instructor.totalLessons} lessons</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{instructor.experience} years</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">${instructor.hourlyRate}/hr</div>
                      <div className="text-sm text-gray-500">{instructor.employmentType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleViewProfile(instructor)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-lg hover:bg-blue-50 transition-colors"
                          title="View Profile"
                        >
                          <SafeIcon icon={FiEye} className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEditInstructor(instructor)}
                          className="text-green-600 hover:text-green-900 p-1 rounded-lg hover:bg-green-50 transition-colors"
                          title="Edit Instructor"
                        >
                          <SafeIcon icon={FiEdit} className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleSendEmail(instructor)}
                          className="text-purple-600 hover:text-purple-900 p-1 rounded-lg hover:bg-purple-50 transition-colors"
                          title="Send Email"
                        >
                          <SafeIcon icon={FiMail} className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteInstructor(instructor)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete Instructor"
                        >
                          <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </tr>
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
                  Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredInstructors.length)} of {filteredInstructors.length} results
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
          {/* View Profile Modal */}
          {showProfileModal && selectedInstructor && (
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
                    <h2 className="text-xl font-semibold text-gray-900">Instructor Profile</h2>
                    <button
                      onClick={() => setShowProfileModal(false)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <SafeIcon icon={FiX} className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Instructor Header */}
                  <div className="flex items-start space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-700">
                        {getInitials(selectedInstructor.name)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900">{selectedInstructor.name}</h3>
                      <p className="text-gray-600">{selectedInstructor.subjects.join(', ')}</p>
                      <div className="flex items-center mt-2 space-x-4">
                        <span className={getStatusBadge(selectedInstructor.status)}>
                          {selectedInstructor.status}
                        </span>
                        <div className="flex items-center">
                          {renderStars(selectedInstructor.rating)}
                          <span className="ml-2 text-sm text-gray-600">{selectedInstructor.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contact Information */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <SafeIcon icon={FiMail} className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-700">{selectedInstructor.email}</span>
                        </div>
                        <div className="flex items-center">
                          <SafeIcon icon={FiPhone} className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-700">{selectedInstructor.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <SafeIcon icon={FiMapPin} className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-700">{selectedInstructor.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Professional Information */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Professional Information</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Experience:</span>
                          <span className="text-sm font-medium text-gray-900">{selectedInstructor.experience} years</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Hourly Rate:</span>
                          <span className="text-sm font-medium text-gray-900">${selectedInstructor.hourlyRate}/hr</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Employment:</span>
                          <span className="text-sm font-medium text-gray-900">{selectedInstructor.employmentType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Join Date:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {new Date(selectedInstructor.joinDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Performance Statistics */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Performance Statistics</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Total Students:</span>
                          <span className="text-sm font-medium text-gray-900">{selectedInstructor.totalStudents}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Total Lessons:</span>
                          <span className="text-sm font-medium text-gray-900">{selectedInstructor.totalLessons}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Average Rating:</span>
                          <span className="text-sm font-medium text-gray-900">{selectedInstructor.rating}/5.0</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Score Improvement:</span>
                          <span className="text-sm font-medium text-green-600">+{selectedInstructor.avgScoreImprovement} pts avg</span>
                        </div>
                      </div>
                    </div>

                    {/* Qualifications */}
                    {selectedInstructor.qualifications && selectedInstructor.qualifications.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Qualifications</h4>
                        <div className="space-y-1">
                          {selectedInstructor.qualifications.map((qual, index) => (
                            <div key={index} className="flex items-center text-sm text-gray-700">
                              <SafeIcon icon={FiAward} className="w-3 h-3 text-blue-500 mr-2" />
                              {qual}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Specializations */}
                  {selectedInstructor.specializations && selectedInstructor.specializations.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Specializations</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedInstructor.specializations.map((spec, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Languages */}
                  {selectedInstructor.languages && selectedInstructor.languages.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Languages</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedInstructor.languages.map((lang, index) => (
                          <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bio */}
                  {selectedInstructor.bio && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Bio</h4>
                      <p className="text-sm text-gray-700">{selectedInstructor.bio}</p>
                    </div>
                  )}

                  {/* Availability */}
                  {selectedInstructor.availability && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Availability</h4>
                      <p className="text-sm text-gray-700">{selectedInstructor.availability}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Add/Edit Instructor Modal */}
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
                className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedInstructor ? 'Edit Instructor' : 'Add New Instructor'}
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

                <form onSubmit={handleInstructorFormSubmit} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        value={instructorForm.name}
                        onChange={(e) => setInstructorForm({ ...instructorForm, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter instructor name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        value={instructorForm.email}
                        onChange={(e) => setInstructorForm({ ...instructorForm, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                      <input
                        type="tel"
                        value={instructorForm.phone}
                        onChange={(e) => setInstructorForm({ ...instructorForm, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                      <input
                        type="text"
                        value={instructorForm.location}
                        onChange={(e) => setInstructorForm({ ...instructorForm, location: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter location"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subjects *</label>
                      <input
                        type="text"
                        value={instructorForm.subjects}
                        onChange={(e) => setInstructorForm({ ...instructorForm, subjects: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter subjects (comma separated)"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years) *</label>
                      <input
                        type="number"
                        value={instructorForm.experience}
                        onChange={(e) => setInstructorForm({ ...instructorForm, experience: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter years of experience"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate ($) *</label>
                      <input
                        type="number"
                        value={instructorForm.hourlyRate}
                        onChange={(e) => setInstructorForm({ ...instructorForm, hourlyRate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter hourly rate"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type *</label>
                      <select
                        value={instructorForm.employmentType}
                        onChange={(e) => setInstructorForm({ ...instructorForm, employmentType: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select employment type</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      value={instructorForm.bio}
                      onChange={(e) => setInstructorForm({ ...instructorForm, bio: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter instructor bio"
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
                      {selectedInstructor ? 'Update Instructor' : 'Add Instructor'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}

          {/* Email Modal */}
          {showEmailModal && selectedInstructor && (
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
                      value={selectedInstructor.email}
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
          {showDeleteConfirmation && instructorToDelete && (
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
                  Delete Instructor
                </h3>
                
                <p className="text-gray-600 text-center mb-6">
                  Are you sure you want to delete <strong>{instructorToDelete.name}</strong>? 
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

export default InstructorDashboard;