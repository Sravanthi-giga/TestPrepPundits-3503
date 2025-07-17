import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {
  FiSearch, FiChevronDown, FiChevronUp, FiMail, FiMessageCircle, FiHelpCircle, FiBook,
  FiSettings, FiMonitor, FiUser, FiSend, FiPhone, FiClock, FiThumbsUp, FiThumbsDown,
  FiX, FiMinimize2, FiMaximize2, FiArrowLeft, FiFileText, FiVideo, FiDownload, FiExternalLink
} = FiIcons;

const HelpSupport = ({ onBackToDashboard }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [requestForm, setRequestForm] = useState({ issueType: 'technical', priority: 'medium', subject: '', description: '' });
  const [showChat, setShowChat] = useState(false);
  const [chatMinimized, setChatMinimized] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'agent',
      message: 'Hello! Welcome to TestPrepPundits support. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState({});
  const [showContactSuccess, setShowContactSuccess] = useState(false);
  const [showRequestSuccess, setShowRequestSuccess] = useState(false);

  const chatEndRef = useRef(null);

  // FAQ Data
  const faqData = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: FiBook,
      questions: [
        {
          id: 1,
          question: 'How do I create an account?',
          answer: 'Click the "Sign Up" button on the homepage, choose your role (Student or Instructor), fill in your details, and verify your email address.'
        },
        {
          id: 2,
          question: 'What courses are available?',
          answer: 'We offer comprehensive test prep for SAT, ACT, GRE, GMAT, TOEFL, and IELTS. Each course includes practice tests, video lessons, and personalized study plans.'
        },
        {
          id: 3,
          question: 'How do I navigate the dashboard?',
          answer: 'Use the sidebar menu to access different sections. The main dashboard shows your progress, upcoming lessons, and recent activity.'
        },
        {
          id: 4,
          question: 'Can I try before purchasing?',
          answer: 'Yes! We offer a 7-day free trial with access to sample lessons and practice questions for all our courses.'
        }
      ]
    },
    {
      id: 'account-settings',
      title: 'Account & Settings',
      icon: FiSettings,
      questions: [
        {
          id: 5,
          question: 'How do I change my password?',
          answer: 'Go to Settings > Account Security > Change Password. Enter your current password and choose a new one.'
        },
        {
          id: 6,
          question: 'How do I update my profile information?',
          answer: 'Navigate to Settings > Profile, where you can update your name, email, phone number, and profile picture.'
        },
        {
          id: 7,
          question: 'Can I change my subscription plan?',
          answer: 'Yes, go to Settings > Billing to upgrade or downgrade your plan. Changes take effect at the next billing cycle.'
        },
        {
          id: 8,
          question: 'How do I delete my account?',
          answer: 'Contact our support team to request account deletion. Note that this action is permanent and cannot be undone.'
        }
      ]
    },
    {
      id: 'courses-tests',
      title: 'Courses & Tests',
      icon: FiFileText,
      questions: [
        {
          id: 9,
          question: 'How do practice tests work?',
          answer: 'Practice tests simulate real exam conditions with timing and scoring. Results include detailed analytics and improvement recommendations.'
        },
        {
          id: 10,
          question: 'Can I retake practice tests?',
          answer: 'Yes, you can retake practice tests unlimited times. We recommend spacing retakes to allow for study and improvement.'
        },
        {
          id: 11,
          question: 'How do I track my progress?',
          answer: 'Your dashboard shows overall progress, section-wise performance, and score trends over time with detailed analytics.'
        },
        {
          id: 12,
          question: 'Are there live classes?',
          answer: 'Yes, we offer live interactive sessions with expert instructors. Check your course schedule for upcoming sessions.'
        }
      ]
    },
    {
      id: 'technical-support',
      title: 'Technical Support',
      icon: FiMonitor,
      questions: [
        {
          id: 13,
          question: 'The platform is loading slowly',
          answer: 'Try refreshing your browser, clearing cache, or switching to a different browser. Check your internet connection speed.'
        },
        {
          id: 14,
          question: 'I cannot access my course materials',
          answer: 'Ensure your subscription is active and you are logged in. Try logging out and back in. Contact support if the issue persists.'
        },
        {
          id: 15,
          question: 'Video lessons are not playing',
          answer: 'Check if your browser supports HTML5 video, disable browser extensions, or try a different browser. Ensure JavaScript is enabled.'
        },
        {
          id: 16,
          question: 'Mobile app issues',
          answer: 'Update to the latest app version, restart your device, or reinstall the app. Check if your device meets minimum requirements.'
        }
      ]
    }
  ];

  // Quick Links Data
  const quickLinks = [
    {
      id: 1,
      title: 'Getting Started Guide',
      description: 'Complete walkthrough for new users',
      icon: FiBook,
      type: 'guide',
      popular: true
    },
    {
      id: 2,
      title: 'Video Tutorials',
      description: 'Step-by-step video instructions',
      icon: FiVideo,
      type: 'video',
      popular: true
    },
    {
      id: 3,
      title: 'Download Study Materials',
      description: 'PDF guides and practice sheets',
      icon: FiDownload,
      type: 'download',
      popular: false
    },
    {
      id: 4,
      title: 'System Requirements',
      description: 'Technical specifications and compatibility',
      icon: FiMonitor,
      type: 'guide',
      popular: false
    },
    {
      id: 5,
      title: 'Billing & Payments',
      description: 'Payment methods and billing questions',
      icon: FiFileText,
      type: 'guide',
      popular: true
    },
    {
      id: 6,
      title: 'Mobile App Guide',
      description: 'Using TestPrepPundits on mobile devices',
      icon: FiVideo,
      type: 'video',
      popular: false
    }
  ];

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Simulate typing indicator
  const simulateTyping = () => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  // Handle FAQ search
  const filteredFAQs = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
           q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  // Handle FAQ toggle
  const toggleFAQ = (categoryId) => {
    setExpandedFAQ(expandedFAQ === categoryId ? null : categoryId);
  };

  // Handle contact form
  const handleContactSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', contactForm);
    setShowContactSuccess(true);
    setContactForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setShowContactSuccess(false), 5000);
  };

  // Handle request form
  const handleRequestSubmit = (e) => {
    e.preventDefault();
    console.log('Request form submitted:', requestForm);
    setShowRequestSuccess(true);
    setRequestForm({ issueType: 'technical', priority: 'medium', subject: '', description: '' });
    setTimeout(() => setShowRequestSuccess(false), 5000);
  };

  // Handle chat
  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: chatMessages.length + 1,
      sender: 'user',
      message: newMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simulate agent response
    simulateTyping();
    setTimeout(() => {
      const agentResponse = {
        id: chatMessages.length + 2,
        sender: 'agent',
        message: getAgentResponse(newMessage),
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, agentResponse]);
    }, 2500);
  };

  // Simple chatbot responses
  const getAgentResponse = (message) => {
    const msg = message.toLowerCase();
    
    if (msg.includes('password') || msg.includes('login')) {
      return 'For password issues, please go to Settings > Account Security. If you\'ve forgotten your password, use the "Forgot Password" link on the login page.';
    } else if (msg.includes('course') || msg.includes('lesson')) {
      return 'Our courses include comprehensive study materials, practice tests, and live sessions. You can access all course materials from your dashboard.';
    } else if (msg.includes('payment') || msg.includes('billing')) {
      return 'For billing questions, please check Settings > Billing or contact our billing team at billing@testpreppundits.com.';
    } else if (msg.includes('technical') || msg.includes('bug')) {
      return 'For technical issues, please try refreshing your browser first. If the problem persists, I can connect you with our technical support team.';
    } else {
      return 'Thank you for your message! I\'m here to help. Could you please provide more details about your specific question or issue?';
    }
  };

  // Handle feedback
  const handleFeedback = (questionId, helpful) => {
    setFeedbackGiven({ ...feedbackGiven, [questionId]: helpful });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 flex items-center">
          <button
            onClick={onBackToDashboard}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors mr-6"
          >
            <SafeIcon icon={FiArrowLeft} className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Help & Support</h1>
            <p className="text-gray-600">Find answers to your questions and get the help you need</p>
          </div>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="relative max-w-2xl mx-auto">
            <SafeIcon icon={FiSearch} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 text-lg border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {(searchQuery ? filteredFAQs : faqData).map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200"
                  >
                    <button
                      onClick={() => toggleFAQ(category.id)}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg mr-4">
                          <SafeIcon icon={category.icon} className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                        <span className="ml-3 text-sm text-gray-500">({category.questions.length} questions)</span>
                      </div>
                      <SafeIcon
                        icon={expandedFAQ === category.id ? FiChevronUp : FiChevronDown}
                        className="w-5 h-5 text-gray-400"
                      />
                    </button>

                    <AnimatePresence>
                      {expandedFAQ === category.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 space-y-4">
                            {category.questions.map((question) => (
                              <div key={question.id} className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50 rounded-r-lg">
                                <h4 className="font-semibold text-gray-900 mb-2">{question.question}</h4>
                                <p className="text-gray-700 mb-3">{question.answer}</p>
                                
                                {/* Feedback */}
                                <div className="flex items-center space-x-4">
                                  <span className="text-sm text-gray-600">Was this helpful?</span>
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => handleFeedback(question.id, true)}
                                      className={`p-1 rounded transition-colors ${
                                        feedbackGiven[question.id] === true
                                          ? 'text-green-600 bg-green-100'
                                          : 'text-gray-400 hover:text-green-600'
                                      }`}
                                    >
                                      👍
                                    </button>
                                    <button
                                      onClick={() => handleFeedback(question.id, false)}
                                      className={`p-1 rounded transition-colors ${
                                        feedbackGiven[question.id] === false
                                          ? 'text-red-600 bg-red-100'
                                          : 'text-gray-400 hover:text-red-600'
                                      }`}
                                    >
                                      👎
                                    </button>
                                  </div>
                                  {feedbackGiven[question.id] !== undefined && (
                                    <span className="text-sm text-green-600">Thank you for your feedback!</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Contact Support Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center mb-6">
                <div className="p-3 bg-purple-100 rounded-lg mr-4">
                  <SafeIcon icon={FiMail} className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Contact Support</h2>
                  <p className="text-gray-600">Send us a message and we'll get back to you within 24 hours</p>
                </div>
              </div>

              {showContactSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
                >
                  <div className="flex items-center">
                    <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-green-800">Your message has been sent successfully! We'll get back to you soon.</span>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe your issue or question in detail..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Send Message
                </button>
              </form>
            </motion.div>

            {/* Submit Request Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center mb-6">
                <div className="p-3 bg-orange-100 rounded-lg mr-4">
                  <SafeIcon icon={FiHelpCircle} className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Submit a Request</h2>
                  <p className="text-gray-600">Create a support ticket for technical issues or account problems</p>
                </div>
              </div>

              {showRequestSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
                >
                  <div className="flex items-center">
                    <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-green-800">Support request submitted! Ticket #TPP-{Math.floor(Math.random() * 10000)} has been created.</span>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleRequestSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Issue Type</label>
                    <select
                      value={requestForm.issueType}
                      onChange={(e) => setRequestForm({ ...requestForm, issueType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="technical">Technical Issue</option>
                      <option value="account">Account Problem</option>
                      <option value="billing">Billing Question</option>
                      <option value="course">Course Content</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={requestForm.priority}
                      onChange={(e) => setRequestForm({ ...requestForm, priority: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={requestForm.subject}
                    onChange={(e) => setRequestForm({ ...requestForm, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of the issue"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={4}
                    value={requestForm.description}
                    onChange={(e) => setRequestForm({ ...requestForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Please provide detailed information about your issue..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                >
                  Submit Request
                </button>
              </form>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-3">
                {quickLinks.map((link) => (
                  <motion.button
                    key={link.id}
                    whileHover={{ scale: 1.02 }}
                    className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
                  >
                    <div className="flex items-center">
                      <div className="p-2 bg-gray-100 rounded-lg mr-3 group-hover:bg-blue-100 transition-colors">
                        <SafeIcon icon={link.icon} className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h4 className="font-medium text-gray-900">{link.title}</h4>
                          {link.popular && (
                            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Popular</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{link.description}</p>
                      </div>
                      <SafeIcon icon={FiExternalLink} className="w-4 h-4 text-gray-400" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <SafeIcon icon={FiMail} className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Email Support</p>
                    <p className="text-sm text-gray-600">support@testpreppundits.com</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <SafeIcon icon={FiPhone} className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Phone Support</p>
                    <p className="text-sm text-gray-600">1-800-TEST-PREP</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <SafeIcon icon={FiClock} className="w-5 h-5 text-orange-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Support Hours</p>
                    <p className="text-sm text-gray-600">Mon-Fri: 9 AM - 6 PM EST</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Live Chat Button */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              onClick={() => setShowChat(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
            >
              <div className="flex items-center justify-center">
                <SafeIcon icon={FiMessageCircle} className="w-5 h-5 mr-2" />
                <span className="font-semibold">Start Live Chat</span>
              </div>
              <p className="text-sm text-blue-100 mt-1">Get instant help from our support team</p>
            </motion.button>
          </div>
        </div>

        {/* Live Chat Widget */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 100 }}
              className={`fixed bottom-6 right-6 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 ${
                chatMinimized ? 'w-80 h-16' : 'w-80 h-96'
              }`}
            >
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 bg-blue-600 text-white rounded-t-xl">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                    <SafeIcon icon={FiUser} className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Support Agent</h4>
                    <p className="text-xs text-blue-100">Online</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setChatMinimized(!chatMinimized)}
                    className="p-1 hover:bg-blue-700 rounded"
                  >
                    <SafeIcon icon={chatMinimized ? FiMaximize2 : FiMinimize2} className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowChat(false)}
                    className="p-1 hover:bg-blue-700 rounded"
                  >
                    <SafeIcon icon={FiX} className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {!chatMinimized && (
                <>
                  {/* Chat Messages */}
                  <div className="flex-1 p-4 h-64 overflow-y-auto">
                    <div className="space-y-3">
                      {chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                              message.sender === 'user'
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-gray-100 text-gray-800 rounded-bl-none'
                            }`}
                          >
                            {message.message}
                          </div>
                        </div>
                      ))}

                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-gray-100 px-3 py-2 rounded-lg rounded-bl-none">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: '0.1s' }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: '0.2s' }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div ref={chatEndRef} />
                    </div>
                  </div>

                  {/* Chat Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                      <button
                        onClick={sendMessage}
                        className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <SafeIcon icon={FiSend} className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HelpSupport;