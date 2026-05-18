import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../redux/slices/authSlice';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff, FiUser, FiShield, FiAlertTriangle, FiX, FiUserPlus } from 'react-icons/fi';

const DeletedAccountPopup = ({ onClose }) => (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 max-w-md w-full relative border border-red-100 dark:border-red-900/30"
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors"
            >
                <FiX size={18} />
            </button>

            <div className="text-center">
                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
                    <FiAlertTriangle className="text-red-500" size={36} />
                </div>

                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
                    Account Deleted
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                    Aapka account admin dwara delete kar diya gaya hai. <br />
                    Dobara library join karne ke liye naya account banayein.
                </p>

                <div className="space-y-3">
                    <Link
                        to="/register"
                        onClick={onClose}
                        className="flex items-center justify-center gap-2 w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:scale-[1.02]"
                    >
                        <FiUserPlus size={18} />
                        Create New Account
                    </Link>
                    <button
                        onClick={onClose}
                        className="w-full py-3 px-6 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </motion.div>
    </div>
);

const HeroSection = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, isAuthenticated, user, accountDeleted } = useSelector((state) => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loginRole, setLoginRole] = useState('user');
    const [showDeletedPopup, setShowDeletedPopup] = useState(false);

    // Show popup if accountDeleted flag is set (from redux or localStorage)
    useEffect(() => {
        if (accountDeleted || localStorage.getItem('accountDeleted') === 'true') {
            setShowDeletedPopup(true);
            localStorage.removeItem('accountDeleted');
        }
    }, [accountDeleted]);

    const handleLogin = async (e) => {
        e.preventDefault();
        dispatch(loginStart());
        try {
            const response = await api.post('/auth/login', { email, password });
            dispatch(loginSuccess(response.data));
            toast.success('Login successful!');
            if (response.data.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            const errMsg = error.response?.data?.error || 'Login failed';
            dispatch(loginFailure(errMsg));
            toast.error(errMsg);
        }
    };

    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-300">

            <AnimatePresence>
                {showDeletedPopup && <DeletedAccountPopup onClose={() => setShowDeletedPopup(false)} />}
            </AnimatePresence>

            {/* Background Blobs */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Left: Text Content */}
                <div className="text-center lg:text-left pt-20 lg:pt-0">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-semibold text-sm mb-6 border border-indigo-200 dark:border-indigo-800">
                            ✨ Welcome to Infotech Library
                        </span>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
                            Smart Study <br />
                            <span className="premium-gradient-text">Environment</span> <br />
                            for Smart Students
                        </h1>

                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto lg:mx-0">
                            Experience the future of studying with our premium facilities, high-speed WiFi, AC reading halls, and smart seat booking system.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link to="/register" className="btn-primary text-lg px-8 py-4">
                                Join Now
                            </Link>
                            <Link to="/dashboard" className="glass-card text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 px-8 py-4 rounded-full font-medium transition-all text-lg border border-slate-200 dark:border-slate-700 hover:-translate-y-1">
                                Book Your Seat
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Right: Login Form */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative"
                >
                    <div className="glass-card p-8 rounded-3xl relative z-10 w-full shadow-2xl">
                        {isAuthenticated ? (
                            <div className="text-center py-8">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Welcome back!</h3>
                                <p className="text-slate-500 dark:text-slate-400 mb-6">{user?.name}</p>
                                <Link
                                    to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                                    className="btn-primary w-full block text-center py-3 text-base"
                                >
                                    {user?.role === 'admin' ? '🛡 Go to Admin Panel' : '📊 Go to Dashboard'}
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Welcome Back</h2>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Sign in to your account</p>
                                </div>

                                {/* Role Toggle */}
                                <div className="flex justify-center mb-6">
                                    <div className="bg-slate-200 dark:bg-slate-700 p-1 rounded-xl inline-flex w-full">
                                        <button
                                            type="button"
                                            onClick={() => setLoginRole('user')}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${loginRole === 'user' ? 'bg-white dark:bg-slate-600 shadow-md text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                        >
                                            <FiUser size={14} /> Student
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setLoginRole('admin')}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${loginRole === 'admin' ? 'bg-white dark:bg-slate-600 shadow-md text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                        >
                                            <FiShield size={14} /> Admin
                                        </button>
                                    </div>
                                </div>

                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                            placeholder="Enter your email"
                                        />
                                    </div>

                                    <div className="relative">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white pr-12"
                                            placeholder="Enter your password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-[38px] text-slate-400 hover:text-indigo-500"
                                        >
                                            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                        </button>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3 font-bold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg disabled:opacity-50 transition-all hover:scale-[1.02] mt-2"
                                    >
                                        {loading ? 'Signing in...' : `Sign in as ${loginRole === 'admin' ? 'Admin' : 'Student'}`}
                                    </button>
                                </form>

                                <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
                                    New student?{' '}
                                    <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                        Register here
                                    </Link>
                                    {' · '}
                                    <Link to="/forgot-password" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                        Forgot password?
                                    </Link>
                                </p>
                            </>
                        )}
                    </div>


                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-slate-400 flex flex-col items-center"
            >
                <span className="text-sm mb-2">Scroll Down</span>
                <div className="w-6 h-10 rounded-full border-2 border-slate-400 flex justify-center pt-2">
                    <div className="w-1.5 h-3 bg-slate-400 rounded-full"></div>
                </div>
            </motion.div>
        </section>
    );
};

export default HeroSection;
