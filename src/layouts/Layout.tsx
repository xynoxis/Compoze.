import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Edit3, 
  Bookmark, 
  User, 
  LayoutDashboard, 
  Search, 
  Menu, 
  X, 
  ChevronDown, 
  LogOut, 
  Compass,
  Home,
  Settings,
  UserCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Toast } from '../components/Toast';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    currentUser, 
    notifications, 
    switchUser, 
    authors 
  } = useApp();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/explore', label: 'Explore', icon: Compass },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 bg-white/95 dark:bg-zinc-950/95 border-b border-zinc-100 dark:border-zinc-900 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-serif text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center">
                Compoze
                <span className="w-1.5 h-1.5 bg-brand-700 dark:bg-brand-500 rounded-full ml-1 self-end mb-1.5"></span>
              </span>
            </Link>

            {/* Global Search Bar (Hidden on Mobile) */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative">
              <Search className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search articles, writers, topics..."
                className="pl-9 pr-4 py-1.5 w-64 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-brand-500 dark:focus:border-brand-600 focus:bg-white dark:focus:bg-zinc-950 focus:w-80 transition-all duration-300"
              />
            </form>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map(link => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => 
                    `text-sm font-medium transition-colors duration-200 flex items-center space-x-1 py-1 ${
                      isActive 
                        ? 'text-brand-700 dark:text-brand-400 border-b-2 border-brand-700 dark:border-brand-400' 
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}

            {/* Divider */}
            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />

            {/* Write Button */}
            <Link 
              to="/write" 
              className="flex items-center space-x-1.5 text-xs font-semibold text-white bg-brand-700 hover:bg-brand-800 px-4 py-2 rounded-full transition-colors btn-primary-depth shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Write</span>
            </Link>

            {/* Notifications Icon */}
            <Link to="/notifications" className="relative p-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-955 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-200">
              <Bell className="w-5 h-5" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-700 dark:bg-brand-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white dark:border-zinc-950">
                  {unreadNotifCount}
                </span>
              )}
            </Link>

            {/* User Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2 p-1 focus:outline-none"
              >
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-8 h-8 rounded-full object-cover border border-zinc-200 dark:border-zinc-800 hover:opacity-90 transition-opacity"
                />
                <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileDropdownOpen && (
                <>
                  {/* Backdrop to close dropdown */}
                  <div 
                    className="fixed inset-0 z-50" 
                    onClick={() => setProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-lg shadow-lg py-1 z-50 animate-bounce-in text-zinc-700 dark:text-zinc-300">
                    <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800">
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{currentUser.name}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-450 truncate">@{currentUser.username}</p>
                    </div>
                    <Link 
                      to={`/profile/${currentUser.username}`} 
                      className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <User className="w-4 h-4 text-zinc-400" />
                      <span>View Profile</span>
                    </Link>
                    <Link 
                      to="/dashboard" 
                      className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4 text-zinc-400" />
                      <span>Dashboard</span>
                    </Link>
                    <Link 
                      to="/bookmarks" 
                      className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <Bookmark className="w-4 h-4 text-zinc-400" />
                      <span>Bookmarks</span>
                    </Link>
                    {/* Settings Trigger */}
                    <button 
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setIsSettingsOpen(true);
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-left hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    >
                      <Settings className="w-4 h-4 text-zinc-400" />
                      <span>Settings</span>
                    </button>
                    <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />
                    <button 
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 text-left"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        alert('Logout simulation: local states are retained.');
                      }}
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* Mobile Menu Buttons */}
          <div className="flex items-center md:hidden space-x-3">
            {/* Search Icon to navigate to Search Page */}
            <Link to="/search" className="p-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100">
              <Search className="w-5 h-5" />
            </Link>

            {/* Notifications Button */}
            <Link to="/notifications" className="relative p-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100">
              <Bell className="w-5 h-5" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-700 dark:bg-brand-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white dark:border-zinc-950">
                  {unreadNotifCount}
                </span>
              )}
            </Link>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-955 hover:text-zinc-900 dark:hover:text-zinc-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/25 dark:bg-black/50 z-45 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-16 right-0 w-64 h-[calc(100vh-4rem)] bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-xl z-45 md:hidden flex flex-col justify-between py-4 animate-bounce-in text-zinc-650 dark:text-zinc-300">
            <div className="space-y-1 px-2">
              <div className="flex items-center space-x-3 p-3 border-b border-zinc-100 dark:border-zinc-800 mb-2">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-10 h-10 rounded-full object-cover border border-zinc-200 dark:border-zinc-800"
                />
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{currentUser.name}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">@{currentUser.username}</p>
                </div>
              </div>

              {navLinks.map(link => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => 
                      `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive 
                          ? 'bg-brand-50 dark:bg-brand-950/20 text-brand-800 dark:text-brand-400' 
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-zinc-100'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5 text-zinc-400 dark:text-zinc-500" />
                    <span>{link.label}</span>
                  </NavLink>
                );
              })}

              <NavLink
                to={`/profile/${currentUser.username}`}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => 
                  `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-brand-50 dark:bg-brand-950/20 text-brand-800 dark:text-brand-400' 
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-zinc-100'
                  }`
                }
              >
                <User className="w-5 h-5 text-zinc-400 dark:text-zinc-500" />
                <span>My Profile</span>
              </NavLink>

              {/* Mobile Settings button */}
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsSettingsOpen(true);
                }}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors"
              >
                <Settings className="w-5 h-5 text-zinc-400 dark:text-zinc-500" />
                <span>Settings</span>
              </button>

              <NavLink
                to="/write"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/30 hover:bg-brand-100 dark:hover:bg-brand-950/60 transition-colors"
              >
                <Edit3 className="w-5 h-5" />
                <span>Write New Article</span>
              </NavLink>
            </div>

            <div className="px-4 py-2 border-t border-zinc-100 dark:border-zinc-800">
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  alert('Logout simulation');
                }}
                className="w-full flex items-center space-x-3 py-2 text-sm font-medium text-red-600 hover:text-red-700"
              >
                <LogOut className="w-5 h-5 text-red-500" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Main Content Area */}
      <main className="flex-1 bg-white dark:bg-zinc-950 transition-colors duration-200">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200/50 dark:border-zinc-900 py-12 px-4 sm:px-6 lg:px-8 mt-auto transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 text-sm text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center space-x-2">
            <span className="font-serif text-lg font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              Compoze
            </span>
            <span>— Share ideas, craft stories.</span>
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a href="#" className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors">About</a>
            <a href="#" className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors">Careers</a>
            <a href="#" className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors">Help</a>
          </div>

          <div>
            <p className="text-xs">© 2026 Compoze. For educational demonstration.</p>
          </div>
        </div>
      </footer>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-zinc-950/60 dark:bg-black/75 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsSettingsOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative bg-white dark:bg-zinc-900 border border-zinc-205 border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl max-w-md w-full p-6 z-10 flex flex-col max-h-[85vh] animate-bounce-in text-zinc-900 dark:text-zinc-100">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 mb-6">
              <h2 className="text-lg font-serif font-bold flex items-center gap-2">
                <Settings className="w-5 h-5 text-brand-700 dark:text-brand-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Preferences & Switching</span>
              </h2>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-750 dark:hover:text-zinc-200 focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Settings Panel */}
            <div className="flex-1 overflow-y-auto space-y-6 pr-1 no-scrollbar">


              {/* Account Switching Section */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Account Switcher</h3>
                <div className="space-y-2 max-h-[35vh] overflow-y-auto pr-1 no-scrollbar border border-zinc-200 dark:border-zinc-800 rounded-xl divide-y divide-zinc-150 dark:divide-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/30">
                  {authors.map((author) => {
                    const isCurrent = author.id === currentUser.id;
                    return (
                      <div 
                        key={author.id} 
                        className={`flex items-center justify-between p-3 transition-colors ${
                          isCurrent ? 'bg-brand-50/20 dark:bg-brand-950/20' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                        }`}
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <img 
                            src={author.avatar} 
                            alt={author.name} 
                            className={`w-9 h-9 rounded-full object-cover border ${
                              isCurrent ? 'border-brand-500' : 'border-zinc-200 dark:border-zinc-700'
                            }`}
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">{author.name}</p>
                            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">@{author.username}</p>
                          </div>
                        </div>
                        {isCurrent ? (
                          <span className="flex items-center space-x-1 text-[10px] font-bold text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50 border border-brand-100 dark:border-brand-900 px-2 py-0.5 rounded-full flex-shrink-0">
                            <UserCheck className="w-3 h-3" />
                            <span>Active</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => switchUser(author.id)}
                            className="px-3 py-1 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-250 border-zinc-200 dark:border-zinc-700 text-[10px] font-bold rounded-full transition-colors flex-shrink-0"
                          >
                            Switch
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-zinc-150 dark:border-zinc-800 mt-6 text-right">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-5 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-full text-xs font-semibold shadow-sm transition-colors"
              >
                Close Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Toast */}
      <Toast />
    </div>
  );
};
