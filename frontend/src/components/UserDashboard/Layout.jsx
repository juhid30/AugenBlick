import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FiUser, 
  FiCalendar, 
  FiLogOut, 
  FiBell,
  FiMenu,
  FiChevronDown,
} from 'react-icons/fi'

// Mock data
const user = {
  name: "Alex Johnson",
  position: "Senior Developer",
  department: "Engineering",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg"
}

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const navigate = useNavigate()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen)
  }

  return (
    <div className="min-h-screen bg-gray-50 bg-hero-pattern">
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 lg:w-[280px] bg-white shadow-lg z-30 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out sidebar-width`}>
        <div className="flex flex-col h-full">
          <div className="px-6 py-8 border-b border-gray-200">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">HR Portal</h1>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <NavLink to="/" className={({isActive}) => `flex items-center px-4 py-3 rounded-lg nav-item ${isActive ? 'text-gray-700 bg-primary-50' : 'text-gray-600 hover:bg-gray-50'}`}>
              <FiCalendar className={({isActive}) => `w-5 h-5 ${isActive ? 'text-primary-500' : 'text-gray-500'}`} />
              <span className="ml-3">Attendance & Leave</span>
            </NavLink>
          </nav>
          
          <div className="px-4 py-6 border-t border-gray-200">
            <div className="flex items-center">
              <img 
                className="h-10 w-10 rounded-full object-cover border-2 border-primary-200" 
                src={user.avatar} 
                alt={user.name} 
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user.name}</p>
                <p className="text-xs text-gray-500">{user.position}</p>
              </div>
            </div>
            <button className="mt-4 w-full btn-outline flex items-center justify-center">
              <FiLogOut className="mr-2 h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:ml-[280px] py-4 flex justify-between items-center main-content">
          <div className="flex items-center">
            <button 
              className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 mr-2"
              onClick={toggleSidebar}
            >
              <FiMenu className="h-6 w-6" />
            </button>
            <div className="flex-shrink-0 lg:hidden">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">HR Portal</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 relative">
                <FiBell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span>
              </button>
            </div>
            <div className="relative">
              <button 
                className="flex items-center space-x-2 focus:outline-none"
                onClick={toggleUserMenu}
              >
                <img 
                  className="h-10 w-10 rounded-full object-cover border-2 border-primary-200" 
                  src={user.avatar} 
                  alt={user.name} 
                />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-700">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.position}</p>
                </div>
                <FiChevronDown className="h-4 w-4 text-gray-500 hidden md:block" />
              </button>
              
              {/* User dropdown menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:ml-[280px] py-8 main-content">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 lg:ml-[280px] main-content">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © 2025 HR Management Portal. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                Help
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout