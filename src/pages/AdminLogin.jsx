import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { gsap } from 'gsap';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isResetMode, setIsResetMode] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();
  const formRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      headerRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );

    gsap.fromTo(
      formRef.current,
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, delay: 0.2, ease: 'back.out(1.7)' }
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    if (isResetMode) {
      const result = await resetPassword(email, dob, newPassword);
      if (result.success) {
        setSuccessMessage(result.message);
        setTimeout(() => {
          setIsResetMode(false);
          setSuccessMessage('');
          setPassword('');
          setNewPassword('');
          setDob('');
        }, 2000);
      } else {
        setError(result.message);
      }
    } else {
      const result = await login(email, password);
      if (result.success) {
        navigate('/admin/dashboard');
      } else {
        setError(result.message);
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-black via-primary-dark to-primary-black pt-20 sm:pt-24 px-4">
      <div className="w-full max-w-md">
        <div ref={headerRef} className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-display font-bold mb-2">
            Admin <span className="text-gradient">{isResetMode ? 'Reset Password' : 'Login'}</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            {isResetMode ? 'Enter your details to reset password' : 'Access the admin dashboard'}
          </p>
        </div>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="bg-primary-black rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-2xl border border-gray-800"
        >
          <div className="mb-6">
            <label htmlFor="email" className="block text-white font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-primary-dark border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary-orange transition-colors"
              placeholder="admin@eatandout.com"
            />
          </div>

          {!isResetMode ? (
            <div className="mb-6">
              <label htmlFor="password" className="block text-white font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-primary-dark border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary-orange transition-colors"
                placeholder="Enter your password"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsResetMode(true);
                    setError('');
                    setSuccessMessage('');
                  }}
                  className="text-sm text-primary-orange hover:text-orange-400 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <label htmlFor="dob" className="block text-white font-semibold mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dob"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-primary-dark border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary-orange transition-colors"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="newPassword" className="block text-white font-semibold mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-primary-dark border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary-orange transition-colors"
                  placeholder="Enter new password"
                  minLength={6}
                />
              </div>
            </>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-400 text-sm">
              {successMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {loading ? 'Processing...' : (isResetMode ? 'Reset Password' : 'Login')}
          </button>

          {isResetMode && (
            <button
              type="button"
              onClick={() => {
                setIsResetMode(false);
                setError('');
                setSuccessMessage('');
              }}
              className="w-full text-center text-gray-400 hover:text-white transition-colors text-sm"
            >
              Back to Login
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

