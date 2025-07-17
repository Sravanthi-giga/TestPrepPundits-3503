import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {
  FiBook, FiUsers, FiFileText, FiDollarSign, FiStar, FiFilter, FiSearch, FiGrid, FiList,
  FiPlus, FiEdit, FiEye, FiTrash2, FiX, FiCheck, FiUpload, FiChevronDown, FiAlertTriangle,
  FiLoader, FiTag, FiClock, FiLayers, FiAward, FiBarChart2, FiCalendar, FiArrowLeft
} = FiIcons;

const CourseTemplatesManagement = ({ onBackToDashboard }) => {
  // State management
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [templateForm, setTemplateForm] = useState({
    title: '',
    category: 'SAT',
    level: 'Beginner',
    duration: '',
    lessons: '',
    description: '',
    image: null,
    imagePreview: null,
    tags: [],
    price: '',
    status: 'draft'
  });

  // Mock data for templates
  const mockTemplates = [
    {
      id: 1,
      title: 'SAT Math Complete Course',
      category: 'SAT',
      level: 'Advanced',
      duration: '12 weeks',
      lessons: 24,
      description: 'Comprehensive SAT Math preparation covering all topics with practice tests and personalized feedback.',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80',
      tags: ['Math', 'SAT', 'College Prep'],
      price: 299,
      status: 'published',
      students: 1245,
      rating: 4.8,
      reviews: 317,
      revenue: 372255
    },
    {
      id: 2,
      title: 'ACT English Mastery',
      category: 'ACT',
      level: 'Intermediate',
      duration: '8 weeks',
      lessons: 16,
      description: 'Master ACT English section with focused grammar, syntax, and reading comprehension strategies.',
      image: 'https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?auto=format&fit=crop&q=80',
      tags: ['English', 'ACT', 'Grammar'],
      price: 249,
      status: 'published',
      students: 892,
      rating: 4.6,
      reviews: 203,
      revenue: 222108
    },
    {
      id: 3,
      title: 'GRE Quantitative Reasoning',
      category: 'GRE',
      level: 'Advanced',
      duration: '10 weeks',
      lessons: 20,
      description: 'Intensive GRE math preparation focused on quantitative comparison, problem-solving and data interpretation.',
      image: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&q=80',
      tags: ['Math', 'GRE', 'Graduate'],
      price: 349,
      status: 'published',
      students: 745,
      rating: 4.7,
      reviews: 189,
      revenue: 260005
    },
    {
      id: 4,
      title: 'GMAT Critical Reasoning',
      category: 'GMAT',
      level: 'Intermediate',
      duration: '6 weeks',
      lessons: 12,
      description: 'Develop advanced critical reasoning skills for GMAT verbal section with real test examples.',
      image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80',
      tags: ['Verbal', 'GMAT', 'MBA'],
      price: 279,
      status: 'published',
      students: 523,
      rating: 4.5,
      reviews: 127,
      revenue: 145917
    },
    {
      id: 5,
      title: 'TOEFL Speaking and Writing',
      category: 'TOEFL',
      level: 'Beginner',
      duration: '8 weeks',
      lessons: 16,
      description: 'Improve TOEFL speaking and writing skills with personalized feedback and structured practice.',
      image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80',
      tags: ['English', 'TOEFL', 'ESL'],
      price: 199,
      status: 'published',
      students: 678,
      rating: 4.4,
      reviews: 152,
      revenue: 134922
    },
    {
      id: 6,
      title: 'SAT Reading and Writing',
      category: 'SAT',
      level: 'Intermediate',
      duration: '10 weeks',
      lessons: 20,
      description: 'Master SAT verbal sections with effective strategies for reading comprehension and grammar.',
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80',
      tags: ['Reading', 'Writing', 'SAT'],
      price: 289,
      status: 'draft',
      students: 0,
      rating: 0,
      reviews: 0,
      revenue: 0
    },
    {
      id: 7,
      title: 'ACT Science Techniques',
      category: 'ACT',
      level: 'Advanced',
      duration: '6 weeks',
      lessons: 12,
      description: 'Specialized course focusing on data interpretation, research summaries and conflicting viewpoints in ACT Science.',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80',
      tags: ['Science', 'ACT', 'Data Analysis'],
      price: 229,
      status: 'draft',
      students: 0,
      rating: 0,
      reviews: 0,
      revenue: 0
    },
    {
      id: 8,
      title: 'IELTS Academic Writing',
      category: 'IELTS',
      level: 'Beginner',
      duration: '5 weeks',
      lessons: 10,
      description: 'Step-by-step guidance for IELTS Academic Writing tasks with model answers and personalized feedback.',
      image: 'https://images.unsplash.com/photo-1494599948593-3dafe8338d71?auto=format&fit=crop&q=80',
      tags: ['Writing', 'IELTS', 'Academic'],
      price: 189,
      status: 'published',
      students: 412,
      rating: 4.3,
      reviews: 98,
      revenue: 77868
    }
  ];

  // Available categories, levels and tags
  const categories = ['SAT', 'ACT', 'GRE', 'GMAT', 'TOEFL', 'IELTS', 'LSAT'];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];
  const availableTags = [
    'Math', 'English', 'Reading', 'Writing', 'Science', 'Verbal', 'Grammar',
    'College Prep', 'Graduate', 'MBA', 'ESL', 'Data Analysis', 'Academic'
  ];

  // Initialize data
  useEffect(() => {
    setTemplates(mockTemplates);
    setFilteredTemplates(mockTemplates);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = templates.filter(template => {
      const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
      const matchesLevel = levelFilter === 'all' || template.level === levelFilter;
      const matchesStatus = statusFilter === 'all' || template.status === statusFilter;
      return matchesSearch && matchesCategory && matchesLevel && matchesStatus;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return b.price - a.price;
        case 'students':
          return b.students - a.students;
        case 'newest':
          return b.id - a.id;
        default:
          return a.title.localeCompare(b.title);
      }
    });

    setFilteredTemplates(filtered);
  }, [searchTerm, categoryFilter, levelFilter, statusFilter, templates, sortBy]);

  // Calculate statistics
  const totalTemplates = templates.length;
  const publishedTemplates = templates.filter(t => t.status === 'published').length;
  const draftTemplates = templates.filter(t => t.status === 'draft').length;
  const totalStudents = templates.reduce((sum, t) => sum + t.students, 0);
  const totalRevenue = templates.reduce((sum, t) => sum + t.revenue, 0);
  const avgRating = templates.filter(t => t.rating > 0).length > 0 ? 
    (templates.reduce((sum, t) => sum + t.rating * (t.rating > 0 ? 1 : 0), 0) / templates.filter(t => t.rating > 0).length).toFixed(1) : '0.0';

  // Form handlers
  const handleTemplateFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTemplateForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTagToggle = (tag) => {
    setTemplateForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag) 
        : [...prev.tags, tag]
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTemplateForm(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setTemplateForm({
      title: '',
      category: 'SAT',
      level: 'Beginner',
      duration: '',
      lessons: '',
      description: '',
      image: null,
      imagePreview: null,
      tags: [],
      price: '',
      status: 'draft'
    });
    setSelectedTemplate(null);
    setShowCreateModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (selectedTemplate) {
        // Update existing template
        const updatedTemplates = templates.map(template => 
          template.id === selectedTemplate.id
            ? {
                ...template,
                ...templateForm,
                lessons: parseInt(templateForm.lessons) || 0,
                price: parseFloat(templateForm.price) || 0,
                image: templateForm.imagePreview || template.image
              }
            : template
        );
        setTemplates(updatedTemplates);
      } else {
        // Add new template
        const newTemplate = {
          ...templateForm,
          id: Date.now(),
          lessons: parseInt(templateForm.lessons) || 0,
          price: parseFloat(templateForm.price) || 0,
          students: 0,
          rating: 0,
          reviews: 0,
          revenue: 0,
          image: templateForm.imagePreview || 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80'
        };
        setTemplates(prev => [...prev, newTemplate]);
      }

      setIsLoading(false);
      resetForm();
    }, 1000);
  };

  const handleEdit = (template) => {
    setSelectedTemplate(template);
    setTemplateForm({
      title: template.title,
      category: template.category,
      level: template.level,
      duration: template.duration,
      lessons: template.lessons.toString(),
      description: template.description,
      image: null,
      imagePreview: template.image,
      tags: template.tags,
      price: template.price.toString(),
      status: template.status
    });
    setShowCreateModal(true);
  };

  const handleDelete = (template) => {
    setTemplateToDelete(template);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    setTemplates(prev => prev.filter(t => t.id !== templateToDelete.id));
    setShowDeleteConfirmation(false);
    setTemplateToDelete(null);
  };

  // Utility functions
  const getLevelBadge = (level) => {
    const badges = {
      Beginner: 'bg-green-100 text-green-800',
      Intermediate: 'bg-blue-100 text-blue-800',
      Advanced: 'bg-purple-100 text-purple-800'
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${badges[level]}`;
  };

  const getStatusBadge = (status) => {
    const badges = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-orange-100 text-orange-800'
    };
    const icons = {
      published: FiCheck,
      draft: FiClock
    };
    return {
      className: badges[status],
      icon: icons[status]
    };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-8 flex items-center">
          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors mr-6"
            >
              <SafeIcon icon={FiArrowLeft} className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Templates</h1>
            <p className="text-gray-600">Manage and create course templates for all test preparation programs</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <SafeIcon icon={FiBook} className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Templates</p>
                <p className="text-2xl font-bold text-gray-900">{totalTemplates}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-gray-900">{publishedTemplates}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <SafeIcon icon={FiFileText} className="w-5 h-5 text-orange-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Drafts</p>
                <p className="text-2xl font-bold text-gray-900">{draftTemplates}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <SafeIcon icon={FiUsers} className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{totalStudents.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center">
              <div className="p-2 bg-amber-100 rounded-lg">
                <SafeIcon icon={FiStar} className="w-5 h-5 text-amber-600" />
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
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <SafeIcon icon={FiDollarSign} className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="all">All Levels</option>
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="name">Sort by Name</option>
                  <option value="rating">Sort by Rating</option>
                  <option value="price">Sort by Price</option>
                  <option value="students">Sort by Students</option>
                  <option value="newest">Sort by Newest</option>
                </select>
              </div>
            </div>

            {/* View Toggle and Add Button */}
            <div className="flex gap-3">
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
                >
                  <SafeIcon icon={FiGrid} className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
                >
                  <SafeIcon icon={FiList} className="w-5 h-5" />
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  resetForm();
                  setShowCreateModal(true);
                }}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
                Create Template
              </motion.button>
            </div>
          </div>
        </div>

        {/* Templates Display */}
        {filteredTemplates.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
            <SafeIcon icon={FiBook} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            <AnimatePresence>
              {filteredTemplates.map((template, index) => {
                // Extract the status badge info
                const statusBadgeInfo = getStatusBadge(template.status);
                const StatusIcon = statusBadgeInfo.icon;

                return (
                  <motion.div
                    key={template.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden template-card ${viewMode === 'list' ? 'flex' : ''}`}
                  >
                    {/* Image */}
                    <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'h-48'}`}>
                      <img src={template.image} alt={template.title} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        <span className={getLevelBadge(template.level)}>
                          {template.level}
                        </span>
                        <span className={statusBadgeInfo.className}>
                          <StatusIcon className="w-3 h-3 mr-1 inline-block" />
                          {template.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{template.title}</h3>
                          <div className="flex items-center gap-1">
                            {template.rating > 0 ? (
                              <>
                                <div className="flex">{renderStars(template.rating)}</div>
                                <span className="text-sm font-medium text-gray-600 ml-1">
                                  {template.rating} ({template.reviews})
                                </span>
                              </>
                            ) : (
                              <span className="text-sm text-gray-500">No ratings yet</span>
                            )}
                          </div>
                        </div>
                        <span className="text-lg font-bold text-blue-600">{formatCurrency(template.price)}</span>
                      </div>

                      {/* Details */}
                      <div className="mb-4 space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <SafeIcon icon={FiLayers} className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="font-medium">{template.category}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <SafeIcon icon={FiClock} className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{template.duration}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <SafeIcon icon={FiBook} className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{template.lessons} lessons</span>
                        </div>
                        {template.status === 'published' && (
                          <div className="flex items-center text-sm text-gray-600">
                            <SafeIcon icon={FiUsers} className="w-4 h-4 mr-2 text-gray-400" />
                            <span>{template.students.toLocaleString()} students</span>
                          </div>
                        )}
                      </div>

                      {/* Description - only in list view */}
                      {viewMode === 'list' && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description}</p>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {template.tags.map((tag, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end gap-2">
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit template"
                          onClick={() => handleEdit(template)}
                        >
                          <SafeIcon icon={FiEdit} className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Preview template"
                        >
                          <SafeIcon icon={FiEye} className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete template"
                          onClick={() => handleDelete(template)}
                        >
                          <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Create/Edit Template Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 modal-backdrop"
              onClick={(e) => e.target === e.currentTarget && resetForm()}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedTemplate ? 'Edit Course Template' : 'Create New Course Template'}
                    </h2>
                    <button
                      onClick={resetForm}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <SafeIcon icon={FiX} className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Course Title *
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={templateForm.title}
                          onChange={handleTemplateFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          placeholder="Enter course title"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category *
                          </label>
                          <select
                            name="category"
                            value={templateForm.category}
                            onChange={handleTemplateFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            required
                          >
                            {categories.map(category => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Level *
                          </label>
                          <select
                            name="level"
                            value={templateForm.level}
                            onChange={handleTemplateFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            required
                          >
                            {levels.map(level => (
                              <option key={level} value={level}>{level}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Duration *
                          </label>
                          <input
                            type="text"
                            name="duration"
                            value={templateForm.duration}
                            onChange={handleTemplateFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            placeholder="e.g. 8 weeks"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Lessons *
                          </label>
                          <input
                            type="number"
                            name="lessons"
                            value={templateForm.lessons}
                            onChange={handleTemplateFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            placeholder="Number of lessons"
                            min="1"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description *
                        </label>
                        <textarea
                          name="description"
                          value={templateForm.description}
                          onChange={handleTemplateFormChange}
                          rows={5}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          placeholder="Enter course description"
                          required
                        />
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Course Image
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                          {templateForm.imagePreview ? (
                            <div className="relative">
                              <img
                                src={templateForm.imagePreview}
                                alt="Preview"
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => setTemplateForm(prev => ({
                                  ...prev,
                                  image: null,
                                  imagePreview: null
                                }))}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                              >
                                <SafeIcon icon={FiX} className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div>
                              <SafeIcon icon={FiUpload} className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600">Click to upload an image</p>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="mt-2 text-sm text-gray-500"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tags
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {availableTags.map(tag => (
                            <label key={tag} className="flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={templateForm.tags.includes(tag)}
                                onChange={() => handleTagToggle(tag)}
                                className="sr-only"
                              />
                              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                                templateForm.tags.includes(tag)
                                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                              }`}>
                                <SafeIcon icon={FiTag} className="w-4 h-4" />
                                <span className="text-sm">{tag}</span>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500">$</span>
                          </div>
                          <input
                            type="number"
                            name="price"
                            value={templateForm.price}
                            onChange={handleTemplateFormChange}
                            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            placeholder="Enter price"
                            min="0"
                            step="0.01"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="status"
                              value="published"
                              checked={templateForm.status === 'published'}
                              onChange={handleTemplateFormChange}
                              className="sr-only"
                            />
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                              templateForm.status === 'published'
                                ? 'bg-green-50 border-green-200 text-green-700'
                                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                            }`}>
                              <SafeIcon icon={FiCheck} className="w-4 h-4" />
                              <span className="font-medium">Published</span>
                            </div>
                          </label>
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="status"
                              value="draft"
                              checked={templateForm.status === 'draft'}
                              onChange={handleTemplateFormChange}
                              className="sr-only"
                            />
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                              templateForm.status === 'draft'
                                ? 'bg-orange-50 border-orange-200 text-orange-700'
                                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                            }`}>
                              <SafeIcon icon={FiClock} className="w-4 h-4" />
                              <span className="font-medium">Draft</span>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      {isLoading && <SafeIcon icon={FiLoader} className="w-4 h-4 animate-spin" />}
                      {selectedTemplate ? 'Update Template' : 'Create Template'}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirmation && templateToDelete && (
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
                  Delete Template
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Are you sure you want to delete <strong>{templateToDelete.title}</strong>? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirmation(false)}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CourseTemplatesManagement;