import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Toast } from '../components/Toast';
import { AuthModal } from '../components/AuthModal';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    currentUser,
    isAuthenticated,
    logout,
  } = useApp();

  const location = useLocation();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="app-shell flex flex-col relative bg-surface">
      {/* BEGIN: Top Navigation Bar */}
      <header className="w-full bg-surface/80 backdrop-blur-md sticky top-0 z-30 border-b border-border-subtle/30">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16 py-4 flex justify-between items-center">
          {/* Brand Logo */}
          <div className="flex items-center">
            <Link className="font-serif text-2xl font-bold tracking-tight text-on-surface hover:text-primary ctrl-transition" to="/">
              Compoze.
            </Link>
          </div>

          {/* Centered Navigation Links */}
          <nav className="hidden lg:flex items-center gap-10 justify-center">
            <NavLink 
              to="/" 
              end
              className={({ isActive }) => 
                `relative flex items-center gap-2 py-1 ctrl-transition ${isActive ? 'text-primary font-semibold text-xs border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary text-xs font-medium'}`
              }
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
              Home
            </NavLink>
            <NavLink 
              to="/explore" 
              className={({ isActive }) => 
                `relative flex items-center gap-2 py-1 ctrl-transition ${isActive ? 'text-primary font-semibold text-xs border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary text-xs font-medium'}`
              }
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
              Explore
            </NavLink>
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => 
                `relative flex items-center gap-2 py-1 ctrl-transition ${isActive ? 'text-primary font-semibold text-xs border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary text-xs font-medium'}`
              }
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
              Dashboard
            </NavLink>
            <NavLink 
              to="/bookmarks" 
              className={({ isActive }) => 
                `relative flex items-center gap-2 py-1 ctrl-transition ${isActive ? 'text-primary font-semibold text-xs border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary text-xs font-medium'}`
              }
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
              Bookmarks
            </NavLink>
          </nav>

          {/* Trailing Actions */}
          <div className="flex items-center gap-6 justify-end">
            {(location.pathname.startsWith('/explore') || location.pathname.startsWith('/bookmarks')) && (
              <Link to="/write" className="btn-primary-3d text-on-primary px-6 py-2.5 rounded-full font-semibold text-xs sm:text-sm flex items-center gap-1.5 ctrl-transition">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                Write
              </Link>
            )}
            <Link to="/notifications" className="text-on-surface-variant hover:text-primary ctrl-transition relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            </Link>

            {!isAuthenticated ? (
              <button 
                onClick={() => openAuthModal('login')} 
                className="bg-surface shadow-neumorphic text-on-surface px-6 py-2.5 rounded-full font-semibold text-xs sm:text-sm hover:shadow-neumorphic-float ctrl-transition cursor-pointer"
              >
                Sign In
              </button>
            ) : (
              <div className="relative">
                <div 
                  onClick={() => setProfileDropdownOpen(v => !v)}
                  className="flex items-center gap-1.5 cursor-pointer shadow-neumorphic p-1 rounded-full bg-surface ctrl-transition"
                >
                  <img alt="User Profile" className="w-7 h-7 rounded-full object-cover" src={currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"} />
                  <svg className="w-3.5 h-3.5 text-on-surface-variant mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </div>

                {profileDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-44 bg-surface border border-border-subtle/40 rounded-2xl shadow-neumorphic-raised p-2 z-50 text-xs animate-dropdown-enter">
                      <div className="px-3 py-1.5 border-b border-border-subtle/30">
                        <p className="font-semibold text-on-surface truncate">{currentUser.name}</p>
                        <p className="text-[10px] text-on-surface-variant truncate">@{currentUser.username}</p>
                      </div>
                      <button 
                        onClick={() => { setProfileDropdownOpen(false); logout(); }} 
                        className="w-full text-left px-3 py-1.5 text-red-600 hover:bg-surface-container rounded-xl ctrl-transition mt-1 cursor-pointer"
                      >
                        Log Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
      {/* END: Top Navigation Bar */}

      {/* App-Level Page Transition Wrapper */}
      <main key={location.pathname} className="animate-page-enter flex-grow flex flex-col">
        {children}
      </main>

      <Toast />
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
};
