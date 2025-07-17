import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {
  FiMapPin, FiCheck, FiTool, FiUsers, FiTarget, FiStar, FiSearch, FiGrid, FiList,
  FiPlus, FiEdit, FiTrash2, FiWifi, FiTruck, FiCoffee, FiBook, FiMonitor, FiHome,
  FiPhone, FiMail, FiUpload, FiX, FiAlertTriangle, FiLoader, FiClock, FiVideo,
  FiHeadphones, FiArrowLeft
} = FiIcons;

const LocationsManagement = ({ onBackToDashboard }) => {
  // State management
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationToDelete, setLocationToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [locationForm, setLocationForm] = useState({
    name: '',
    type: 'branch',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
    email: '',
    website: '',
    capacity: '',
    classrooms: '',
    instructors: '',
    facilities: [],
    status: 'active',
    description: '',
    image: null,
    imagePreview: null
  });

  // Mock data
  const mockLocations = [
    {
      id: 1,
      name: 'TestPrepPundits Main Campus',
      type: 'main',
      address: '1234 Education Avenue',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      phone: '(212) 555-0100',
      email: 'main@testpreppundits.com',
      website: 'www.testpreppundits.com',
      capacity: 500,
      currentStudents: 387,
      classrooms: 25,
      instructors: 45,
      facilities: ['WiFi', 'Parking', 'Cafeteria', 'Library', 'Computer Lab'],
      status: 'active',
      rating: 4.8,
      reviews: 156,
      description: 'Our flagship campus with state-of-the-art facilities for comprehensive test preparation.',
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1000'
    },
    {
      id: 2,
      name: 'Downtown Learning Center',
      type: 'branch',
      address: '567 Central Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10016',
      country: 'USA',
      phone: '(212) 555-0200',
      email: 'downtown@testpreppundits.com',
      website: 'downtown.testpreppundits.com',
      capacity: 200,
      currentStudents: 185,
      classrooms: 10,
      instructors: 18,
      facilities: ['WiFi', 'Cafeteria', 'Study Rooms'],
      status: 'active',
      rating: 4.6,
      reviews: 87,
      description: 'Conveniently located downtown with focus on SAT and ACT preparation.',
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=1000'
    },
    {
      id: 3,
      name: 'West Side Study Hub',
      type: 'branch',
      address: '890 West End Boulevard',
      city: 'New York',
      state: 'NY',
      zipCode: '10024',
      country: 'USA',
      phone: '(212) 555-0300',
      email: 'westside@testpreppundits.com',
      website: 'westside.testpreppundits.com',
      capacity: 150,
      currentStudents: 122,
      classrooms: 8,
      instructors: 12,
      facilities: ['WiFi', 'Parking', 'Study Rooms'],
      status: 'maintenance',
      rating: 4.3,
      reviews: 64,
      description: 'Intimate learning environment specializing in small group instruction.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000'
    },
    {
      id: 4,
      name: 'Virtual Learning Platform',
      type: 'virtual',
      address: 'Online Only',
      city: '',
      state: '',
      zipCode: '',
      country: 'Global',
      phone: '(800) 555-0400',
      email: 'virtual@testpreppundits.com',
      website: 'virtual.testpreppundits.com',
      capacity: 1000,
      currentStudents: 734,
      classrooms: 0,
      instructors: 32,
      facilities: ['24/7 Access', 'Live Chat', 'Recorded Sessions', 'Interactive Whiteboards'],
      status: 'active',
      rating: 4.7,
      reviews: 203,
      description: 'Cutting-edge virtual learning environment accessible worldwide.',
      image: 'https://images.unsplash.com/photo-1610484826967-09c5720778c7?auto=format&fit=crop&q=80&w=1000'
    },
    {
      id: 5,
      name: 'Brooklyn Heights Academy',
      type: 'branch',
      address: '123 Heights Street',
      city: 'Brooklyn',
      state: 'NY',
      zipCode: '11201',
      country: 'USA',
      phone: '(718) 555-0500',
      email: 'brooklyn@testpreppundits.com',
      website: 'brooklyn.testpreppundits.com',
      capacity: 180,
      currentStudents: 168,
      classrooms: 9,
      instructors: 14,
      facilities: ['WiFi', 'Parking', 'Study Rooms', 'Computer Lab'],
      status: 'active',
      rating: 4.9,
      reviews: 112,
      description: 'Premium facility in Brooklyn Heights with specialized GRE and GMAT programs.',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=1000'
    },
    {
      id: 6,
      name: 'Jersey City Branch',
      type: 'branch',
      address: '456 Hudson Street',
      city: 'Jersey City',
      state: 'NJ',
      zipCode: '07302',
      country: 'USA',
      phone: '(201) 555-0600',
      email: 'jerseycity@testpreppundits.com',
      website: 'jerseycity.testpreppundits.com',
      capacity: 120,
      currentStudents: 98,
      classrooms: 6,
      instructors: 10,
      facilities: ['WiFi', 'Parking'],
      status: 'maintenance',
      rating: 4.2,
      reviews: 47,
      description: 'Newest location serving Jersey City and surrounding areas.',
      image: 'https://images.unsplash.com/photo-1573167507387-6b4b98cb7c13?auto=format&fit=crop&q=80&w=1000'
    }
  ];

  // Facility options
  const facilityOptions = [
    { id: 'wifi', name: 'WiFi', icon: FiWifi },
    { id: 'parking', name: 'Parking', icon: FiTruck },
    { id: 'cafeteria', name: 'Cafeteria', icon: FiCoffee },
    { id: 'library', name: 'Library', icon: FiBook },
    { id: 'computer-lab', name: 'Computer Lab', icon: FiMonitor },
    { id: 'study-rooms', name: 'Study Rooms', icon: FiHome },
    { id: '24-7-access', name: '24/7 Access', icon: FiClock },
    { id: 'live-chat', name: 'Live Chat', icon: FiHeadphones },
    { id: 'recorded-sessions', name: 'Recorded Sessions', icon: FiVideo }
  ];

  // Initialize data
  useEffect(() => {
    setLocations(mockLocations);
    setFilteredLocations(mockLocations);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = locations.filter(location => {
      const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           location.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || location.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesType = typeFilter === 'all' || location.type.toLowerCase() === typeFilter.toLowerCase();
      return matchesSearch && matchesStatus && matchesType;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'capacity':
          return b.capacity - a.capacity;
        case 'students':
          return b.currentStudents - a.currentStudents;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredLocations(filtered);
  }, [searchTerm, statusFilter, typeFilter, locations, sortBy]);

  // Calculate statistics
  const totalLocations = locations.length;
  const activeLocations = locations.filter(l => l.status === 'active').length;
  const maintenanceLocations = locations.filter(l => l.status === 'maintenance').length;
  const totalCapacity = locations.reduce((sum, l) => sum + l.capacity, 0);
  const totalCurrentStudents = locations.reduce((sum, l) => sum + l.currentStudents, 0);
  const avgRating = locations.length > 0 ? 
    (locations.reduce((sum, l) => sum + l.rating, 0) / locations.length).toFixed(1) : '0.0';

  // Form handlers
  const handleLocationFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLocationForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFacilityToggle = (facilityName) => {
    setLocationForm(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facilityName)
        ? prev.facilities.filter(f => f !== facilityName)
        : [...prev.facilities, facilityName]
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocationForm(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setLocationForm({
      name: '',
      type: 'branch',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      phone: '',
      email: '',
      website: '',
      capacity: '',
      classrooms: '',
      instructors: '',
      facilities: [],
      status: 'active',
      description: '',
      image: null,
      imagePreview: null
    });
    setSelectedLocation(null);
    setShowAddModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (selectedLocation) {
        // Update existing location
        const updatedLocations = locations.map(location =>
          location.id === selectedLocation.id
            ? {
                ...location,
                ...locationForm,
                capacity: parseInt(locationForm.capacity) || 0,
                classrooms: parseInt(locationForm.classrooms) || 0,
                instructors: parseInt(locationForm.instructors) || 0,
                image: locationForm.imagePreview || location.image
              }
            : location
        );
        setLocations(updatedLocations);
      } else {
        // Add new location
        const newLocation = {
          ...locationForm,
          id: Date.now(),
          capacity: parseInt(locationForm.capacity) || 0,
          classrooms: parseInt(locationForm.classrooms) || 0,
          instructors: parseInt(locationForm.instructors) || 0,
          currentStudents: 0,
          rating: 0,
          reviews: 0,
          image: locationForm.imagePreview || 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=1000'
        };
        setLocations(prev => [...prev, newLocation]);
      }

      setIsLoading(false);
      resetForm();
    }, 1000);
  };

  const handleEdit = (location) => {
    setSelectedLocation(location);
    setLocationForm({
      name: location.name,
      type: location.type,
      address: location.address,
      city: location.city,
      state: location.state,
      zipCode: location.zipCode,
      country: location.country,
      phone: location.phone,
      email: location.email,
      website: location.website,
      capacity: location.capacity.toString(),
      classrooms: location.classrooms.toString(),
      instructors: location.instructors.toString(),
      facilities: location.facilities,
      status: location.status,
      description: location.description,
      image: null,
      imagePreview: location.image
    });
    setShowAddModal(true);
  };

  const handleDelete = (location) => {
    setLocationToDelete(location);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    setLocations(prev => prev.filter(l => l.id !== locationToDelete.id));
    setShowDeleteConfirmation(false);
    setLocationToDelete(null);
  };

  // Utility functions
  const getTypeBadge = (type) => {
    const badges = {
      main: 'bg-blue-100 text-blue-800',
      branch: 'bg-purple-100 text-purple-800',
      virtual: 'bg-green-100 text-green-800'
    };
    const labels = {
      main: 'Main Campus',
      branch: 'Branch',
      virtual: 'Virtual'
    };
    return {
      className: `px-3 py-1 rounded-full text-xs font-medium ${badges[type]}`,
      label: labels[type]
    };
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      maintenance: 'bg-yellow-100 text-yellow-800'
    };
    const icons = {
      active: FiCheck,
      maintenance: FiTool
    };
    return {
      className: `px-3 py-1 rounded-full text-xs font-medium ${badges[status]}`,
      icon: icons[status]
    };
  };

  const getFacilityIcon = (facilityName) => {
    const facility = facilityOptions.find(f => f.name === facilityName);
    return facility ? facility.icon : FiHome;
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
        {/* Header */}
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Locations</h1>
            <p className="text-gray-600">Manage your test preparation centers and facilities</p>
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
                <SafeIcon icon={FiMapPin} className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Locations</p>
                <p className="text-2xl font-bold text-gray-900">{totalLocations}</p>
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
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{activeLocations}</p>
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
              <div className="p-2 bg-yellow-100 rounded-lg">
                <SafeIcon icon={FiTool} className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Maintenance</p>
                <p className="text-2xl font-bold text-gray-900">{maintenanceLocations}</p>
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
                <p className="text-sm font-medium text-gray-600">Total Capacity</p>
                <p className="text-2xl font-bold text-gray-900">{totalCapacity.toLocaleString()}</p>
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
              <div className="p-2 bg-blue-100 rounded-lg">
                <SafeIcon icon={FiTarget} className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Current Students</p>
                <p className="text-2xl font-bold text-gray-900">{totalCurrentStudents.toLocaleString()}</p>
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
              <div className="p-2 bg-orange-100 rounded-lg">
                <SafeIcon icon={FiStar} className="w-5 h-5 text-orange-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">{avgRating}</p>
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
                  placeholder="Search locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                </select>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="all">All Types</option>
                  <option value="main">Main Campus</option>
                  <option value="branch">Branch</option>
                  <option value="virtual">Virtual</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="name">Sort by Name</option>
                  <option value="rating">Sort by Rating</option>
                  <option value="capacity">Sort by Capacity</option>
                  <option value="students">Sort by Students</option>
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
                  setShowAddModal(true);
                }}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
                Add Location
              </motion.button>
            </div>
          </div>
        </div>

        {/* Locations Display */}
        {filteredLocations.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
            <SafeIcon icon={FiMapPin} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No locations found</h3>
            <p className="text-gray-600">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            <AnimatePresence>
              {filteredLocations.map((location, index) => {
                const statusBadgeInfo = getStatusBadge(location.status);
                const StatusIcon = statusBadgeInfo.icon;

                return (
                  <motion.div
                    key={location.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 ${viewMode === 'list' ? 'flex' : ''}`}
                  >
                    {/* Image */}
                    <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'h-48'}`}>
                      <img
                        src={location.image}
                        alt={location.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        <span className={getTypeBadge(location.type).className}>
                          {getTypeBadge(location.type).label}
                        </span>
                        <span className={statusBadgeInfo.className}>
                          <StatusIcon className="w-3 h-3 mr-1 inline" />
                          {location.status === 'active' ? 'Active' : 'Maintenance'}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{location.name}</h3>
                          <div className="flex items-center gap-1">
                            {renderStars(location.rating)}
                            <span className="text-sm font-medium text-gray-600 ml-1">
                              {location.rating} ({location.reviews})
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEdit(location)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit location"
                          >
                            <SafeIcon icon={FiEdit} className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(location)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete location"
                          >
                            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Address and Contact */}
                      <div className="mb-4 space-y-1">
                        <p className="text-sm text-gray-600">
                          {location.address}
                          {location.city && `, ${location.city}`}
                          {location.state && `, ${location.state}`}
                          {location.zipCode && ` ${location.zipCode}`}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <SafeIcon icon={FiPhone} className="w-3 h-3" />
                            {location.phone}
                          </div>
                          {location.email && (
                            <div className="flex items-center gap-1">
                              <SafeIcon icon={FiMail} className="w-3 h-3" />
                              {location.email}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Capacity */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Capacity</span>
                          <span className="font-medium">
                            {location.currentStudents.toLocaleString()}/{location.capacity.toLocaleString()} Students
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min((location.currentStudents / location.capacity) * 100, 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <span>{location.classrooms} Classrooms</span>
                        <span>•</span>
                        <span>{location.instructors} Instructors</span>
                      </div>

                      {/* Facilities */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {location.facilities.slice(0, 4).map((facility, idx) => {
                          const FacilityIcon = getFacilityIcon(facility);
                          return (
                            <span
                              key={idx}
                              className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium flex items-center gap-1"
                            >
                              <FacilityIcon className="w-3 h-3" />
                              {facility}
                            </span>
                          );
                        })}
                        {location.facilities.length > 4 && (
                          <span className="bg-gray-50 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                            +{location.facilities.length - 4} more
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      {viewMode === 'list' && (
                        <p className="text-sm text-gray-600">{location.description}</p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
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
                      {selectedLocation ? 'Edit Location' : 'Add New Location'}
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
                          Location Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={locationForm.name}
                          onChange={handleLocationFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Enter location name"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Type *
                        </label>
                        <select
                          name="type"
                          value={locationForm.type}
                          onChange={handleLocationFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                        >
                          <option value="main">Main Campus</option>
                          <option value="branch">Branch</option>
                          <option value="virtual">Virtual</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={locationForm.address}
                          onChange={handleLocationFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Enter street address"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            City
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={locationForm.city}
                            onChange={handleLocationFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="City"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            State
                          </label>
                          <input
                            type="text"
                            name="state"
                            value={locationForm.state}
                            onChange={handleLocationFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="State"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={locationForm.phone}
                            onChange={handleLocationFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Phone number"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={locationForm.email}
                            onChange={handleLocationFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Email address"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Image
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                          {locationForm.imagePreview ? (
                            <div className="relative">
                              <img
                                src={locationForm.imagePreview}
                                alt="Preview"
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => setLocationForm(prev => ({
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

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Capacity
                          </label>
                          <input
                            type="number"
                            name="capacity"
                            value={locationForm.capacity}
                            onChange={handleLocationFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="0"
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Classrooms
                          </label>
                          <input
                            type="number"
                            name="classrooms"
                            value={locationForm.classrooms}
                            onChange={handleLocationFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="0"
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Instructors
                          </label>
                          <input
                            type="number"
                            name="instructors"
                            value={locationForm.instructors}
                            onChange={handleLocationFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="0"
                            min="0"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          name="status"
                          value={locationForm.status}
                          onChange={handleLocationFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        >
                          <option value="active">Active</option>
                          <option value="maintenance">Maintenance</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Facilities
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {facilityOptions.map((facility) => {
                            const Icon = facility.icon;
                            return (
                              <label key={facility.id} className="flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={locationForm.facilities.includes(facility.name)}
                                  onChange={() => handleFacilityToggle(facility.name)}
                                  className="sr-only"
                                />
                                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                                  locationForm.facilities.includes(facility.name)
                                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                                }`}>
                                  <Icon className="w-4 h-4" />
                                  <span className="text-sm">{facility.name}</span>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={locationForm.description}
                      onChange={handleLocationFormChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Brief description of the location..."
                    />
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
                      {selectedLocation ? 'Update Location' : 'Add Location'}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirmation && locationToDelete && (
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
                  Delete Location
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Are you sure you want to delete <strong>{locationToDelete.name}</strong>? This action cannot be undone.
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

export default LocationsManagement;