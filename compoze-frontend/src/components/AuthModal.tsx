import React, { useState } from 'react';
import { X, LogIn, UserPlus } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const { login, register, showToast } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regDisplayName, setRegDisplayName] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      showToast('Logged in successfully!', 'success');
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    try {
      await register({
        username: regUsername,
        email: regEmail,
        password: regPassword,
        displayName: regDisplayName || undefined,
      });
      showToast('Account created successfully! Please log in.', 'success');
      setMode('login');
      setLoginEmail(regEmail);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Clean Modal Box Without White Neumorphic Aura */}
      <div className="relative bg-surface shadow-2xl rounded-3xl max-w-md w-full p-8 z-10 text-on-surface border border-border-subtle/40 animate-modal-enter">
        <div className="flex items-center justify-between pb-4 border-b border-border-subtle/30">
          <div className="flex space-x-6">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMsg(null); }}
              className={`text-base font-serif font-bold pb-1 transition-colors cursor-pointer ${
                mode === 'login'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMsg(null); }}
              className={`text-base font-serif font-bold pb-1 transition-colors cursor-pointer ${
                mode === 'register'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Create Account
            </button>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant hover:text-primary transition-colors focus:outline-none cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 font-medium">
            {errorMsg}
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                Email Address
              </label>
              <div className="bg-surface-container/60 border border-border-subtle/30 focus-within:border-primary/50 rounded-2xl transition-colors">
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full px-4 py-3 bg-transparent border-none rounded-2xl text-xs text-on-surface placeholder-on-surface-variant/60 focus:ring-0 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                Password
              </label>
              <div className="bg-surface-container/60 border border-border-subtle/30 focus-within:border-primary/50 rounded-2xl transition-colors">
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-transparent border-none rounded-2xl text-xs text-on-surface placeholder-on-surface-variant/60 focus:ring-0 focus:outline-none"
                />
              </div>
            </div>
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 btn-primary-3d text-on-primary font-semibold rounded-full text-xs flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer ctrl-transition"
              >
                <LogIn className="w-4 h-4" />
                <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                Username
              </label>
              <div className="bg-surface-container/60 border border-border-subtle/30 focus-within:border-primary/50 rounded-2xl transition-colors">
                <input
                  type="text"
                  required
                  minLength={3}
                  maxLength={30}
                  value={regUsername}
                  onChange={e => setRegUsername(e.target.value)}
                  placeholder="harshit_dev"
                  className="w-full px-4 py-3 bg-transparent border-none rounded-2xl text-xs text-on-surface placeholder-on-surface-variant/60 focus:ring-0 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                Display Name (Optional)
              </label>
              <div className="bg-surface-container/60 border border-border-subtle/30 focus-within:border-primary/50 rounded-2xl transition-colors">
                <input
                  type="text"
                  value={regDisplayName}
                  onChange={e => setRegDisplayName(e.target.value)}
                  placeholder="Harshit Singh"
                  className="w-full px-4 py-3 bg-transparent border-none rounded-2xl text-xs text-on-surface placeholder-on-surface-variant/60 focus:ring-0 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                Email Address
              </label>
              <div className="bg-surface-container/60 border border-border-subtle/30 focus-within:border-primary/50 rounded-2xl transition-colors">
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  placeholder="harshit@example.com"
                  className="w-full px-4 py-3 bg-transparent border-none rounded-2xl text-xs text-on-surface placeholder-on-surface-variant/60 focus:ring-0 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                Password
              </label>
              <div className="bg-surface-container/60 border border-border-subtle/30 focus-within:border-primary/50 rounded-2xl transition-colors">
                <input
                  type="password"
                  required
                  minLength={8}
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full px-4 py-3 bg-transparent border-none rounded-2xl text-xs text-on-surface placeholder-on-surface-variant/60 focus:ring-0 focus:outline-none"
                />
              </div>
            </div>
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 btn-primary-3d text-on-primary font-semibold rounded-full text-xs flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer ctrl-transition"
              >
                <UserPlus className="w-4 h-4" />
                <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
