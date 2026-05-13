import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { FiMenu, FiX, FiUser, FiShield, FiBell } from 'react-icons/fi';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

const NotificationDropdown = ({ notifications, unreadCount, onMarkOne, onMarkAll }) => {
    const getIcon = (type) => {
        const icons = { request_approved: '✅', request_rejected: '❌', new_request: '📋', expired: '🔴', expiry_warning: '⚠️' };
        return icons[type] || '🔔';
    };
    const timeAgo = (date) => {
        const diff = Date.now() - new Date(date).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'just now';
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        return `${Math.floor(hrs / 24)}d ago`;
    };

    return (
        <div className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-[999]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    Notifications {unreadCount > 0 && <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full">{unreadCount}</span>}
                </h3>
                {unreadCount > 0 && (
                    <button onClick={onMarkAll} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                        Mark all read
                    </button>
                )}
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50">
                {notifications.length === 0 ? (
                    <div className="py-10 text-center text-slate-400 text-sm">
                        <div className="text-3xl mb-2">🔔</div>
                        No notifications yet
                    </div>
                ) : notifications.map(n => (
                    <div
                        key={n._id}
                        onClick={() => !n.isRead && onMarkOne(n._id)}
                        className={`px-4 py-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${!n.isRead ? 'bg-indigo-50/70 dark:bg-indigo-900/20' : ''}`}
                    >
                        <div className="flex gap-3 items-start">
                            <span className="text-lg flex-shrink-0 mt-0.5">{getIcon(n.type)}</span>
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-semibold leading-tight ${!n.isRead ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                                    {n.title}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                                <p className="text-xs text-slate-400 mt-1">{timeAgo(n.createdAt)}</p>
                            </div>
                            {!n.isRead && <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 mt-2"></div>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Navbar = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotif, setShowNotif] = useState(false);

    const dashboardPath = user?.role === 'admin' ? '/admin/dashboard' : '/dashboard';

    useEffect(() => {
        if (!isAuthenticated) { setNotifications([]); setUnreadCount(0); return; }
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [isAuthenticated]);

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (!e.target.closest('.notif-container')) {
                setShowNotif(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data.data || []);
            setUnreadCount(res.data.unreadCount || 0);
        } catch { /* silent */ }
    };

    const handleMarkAll = async () => {
        try {
            await api.put('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch { /* silent */ }
    };

    const handleMarkOne = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch { /* silent */ }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
        toast.success('Logged out successfully');
        setIsOpen(false);
        setShowNotif(false);
    };

    return (
        <nav className="sticky top-0 z-50 glass-card">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    <Link to="/" className="text-2xl font-bold premium-gradient-text flex-shrink-0">
                        Infotech Library
                    </Link>

                    {/* Desktop */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="hover:text-indigo-500 font-medium transition-colors text-sm">Home</Link>
                        <Link to="/about" className="hover:text-indigo-500 font-medium transition-colors text-sm">About</Link>
                        
                        <div className="relative group">
                            <button className="hover:text-indigo-500 font-medium transition-colors text-sm flex items-center gap-1 py-4">
                                e-Newspaper <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold animate-pulse">LIVE</span>
                            </button>
                            <div className="absolute left-0 mt-0 w-60 bg-white dark:bg-slate-800 rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-slate-100 dark:border-slate-700">
                                <a href="https://www.readwhere.com/newspaper" target="_blank" rel="noopener noreferrer" className="block px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 transition-colors">🌍 All India (Multiple)</a>
                                <a href="https://epaper.livehindustan.com/" target="_blank" rel="noopener noreferrer" className="block px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 transition-colors">🇮🇳 Bihar State (Hindustan)</a>
                                <a href="https://epaper.jagran.com/" target="_blank" rel="noopener noreferrer" className="block px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 transition-colors">📍 Deoria City (Dainik Jagran)</a>
                            </div>
                        </div>

                        <Link to="/contact" className="hover:text-indigo-500 font-medium transition-colors text-sm">Contact</Link>

                        {isAuthenticated ? (
                            <div className="flex items-center gap-3">
                                {/* Bell */}
                                <div className="relative notif-container">
                                    <button
                                        onClick={() => setShowNotif(v => !v)}
                                        className="relative p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        <FiBell size={18} />
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                                {unreadCount > 9 ? '9+' : unreadCount}
                                            </span>
                                        )}
                                    </button>
                                    {showNotif && (
                                        <NotificationDropdown
                                            notifications={notifications}
                                            unreadCount={unreadCount}
                                            onMarkOne={handleMarkOne}
                                            onMarkAll={handleMarkAll}
                                        />
                                    )}
                                </div>

                                <Link to={dashboardPath} className="flex items-center gap-2 btn-primary py-2 px-4 text-sm">
                                    {user?.role === 'admin' ? <FiShield size={14} /> : <FiUser size={14} />}
                                    {user?.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                                </Link>
                            </div>
                        ) : (
                            <Link to="/register" className="btn-primary py-2 px-4 text-sm">Sign Up</Link>
                        )}
                    </div>

                    {/* Mobile right */}
                    <div className="md:hidden flex items-center gap-1">
                        {isAuthenticated && (
                            <div className="relative notif-container">
                                <button
                                    onClick={() => setShowNotif(v => !v)}
                                    className="relative p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <FiBell size={18} />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </button>
                                {showNotif && (
                                    <NotificationDropdown
                                        notifications={notifications}
                                        unreadCount={unreadCount}
                                        onMarkOne={handleMarkOne}
                                        onMarkAll={handleMarkAll}
                                    />
                                )}
                            </div>
                        )}

                        <button onClick={() => setIsOpen(!isOpen)} className="p-2">
                            {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white dark:bg-slate-800 shadow-xl absolute w-full border-t border-slate-200 dark:border-slate-700">
                    <div className="px-4 py-3 space-y-1">
                        <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md font-medium hover:bg-slate-100 dark:hover:bg-slate-700">Home</Link>
                        <Link to="/about" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md font-medium hover:bg-slate-100 dark:hover:bg-slate-700">About</Link>
                        
                        <div className="py-2 border-y border-slate-100 dark:border-slate-700 my-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                            <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                🗞 e-Newspapers <span className="text-[10px] bg-red-500 text-white px-1.5 py-0 rounded-full animate-pulse">LIVE</span>
                            </p>
                            <a href="https://www.readwhere.com/newspaper" target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">🌍 All India Newspapers</a>
                            <a href="https://epaper.livehindustan.com/" target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">🇮🇳 Bihar State (Hindustan)</a>
                            <a href="https://epaper.jagran.com/" target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">📍 Deoria City (Dainik Jagran)</a>
                        </div>

                        <Link to="/contact" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md font-medium hover:bg-slate-100 dark:hover:bg-slate-700">Contact</Link>
                        {isAuthenticated ? (
                            <>
                                <Link to={dashboardPath} onClick={() => setIsOpen(false)} className="block px-3 py-2 text-indigo-600 dark:text-indigo-400 font-bold">
                                    {user?.role === 'admin' ? '🛡 Admin Panel' : '📊 Dashboard'}
                                </Link>
                            </>
                        ) : (
                            <Link to="/register" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md font-medium text-indigo-600">Sign Up</Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
