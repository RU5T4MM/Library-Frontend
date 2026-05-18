import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiUsers, FiMapPin, FiCreditCard, FiActivity, FiCheckCircle,
    FiLogOut, FiEye, FiX, FiRefreshCw, FiHome, FiList, FiUserCheck,
    FiTrash2, FiUnlock
} from 'react-icons/fi';
import api from '../services/api';
import { toast } from 'react-toastify';
import { logout } from '../redux/slices/authSlice';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [requests, setRequests] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [statsRes, reqRes, usersRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/requests'),
                api.get('/admin/users'),
            ]);
            setStats(statsRes.data.data);
            setRequests(reqRes.data.data);
            setUsers(usersRes.data.data);
        } catch {
            toast.error('Failed to load admin data');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, status) => {
        setActionLoading(id + status);
        try {
            await api.put(`/admin/requests/${id}`, { status });
            toast.success(`Request ${status} successfully`);
            fetchAll();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Action failed');
        } finally {
            setActionLoading(null);
        }
    };

    const handleFreeSeat = async (seatId, userName) => {
        if (!window.confirm(`Free seat for ${userName}? This will remove their membership.`)) return;
        try {
            await api.put(`/admin/seats/${seatId}/free`);
            toast.success('Seat freed — now available for booking');
            setSelectedUser(null);
            fetchAll();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to free seat');
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        if (!window.confirm(`Delete ${userName}? Their seat will be freed and made available.`)) return;
        try {
            await api.delete(`/admin/users/${userId}`);
            toast.success(`${userName} deleted. Seat is now available.`);
            setSelectedUser(null);
            fetchAll();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to delete student');
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
        toast.success('Logged out successfully');
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-600 dark:text-slate-400">Loading Admin Panel...</p>
            </div>
        </div>
    );

    const chartData = [
        { name: 'Total Users', value: stats.totalUsers },
        { name: 'Active', value: stats.activeMembers },
        { name: 'Available Seats', value: stats.availableSeats },
        { name: 'Booked', value: stats.bookedSeats },
        { name: 'Pending', value: stats.pendingRequests },
    ];

    const statCards = [
        { label: 'Total Users', value: stats.totalUsers, icon: FiUsers, color: 'blue' },
        { label: 'Active Members', value: stats.activeMembers, icon: FiUserCheck, color: 'green' },
        { label: 'Available Seats', value: stats.availableSeats, icon: FiMapPin, color: 'emerald' },
        { label: 'Booked Seats', value: stats.bookedSeats, icon: FiCheckCircle, color: 'indigo' },
        { label: 'Pending Requests', value: stats.pendingRequests, icon: FiActivity, color: 'yellow' },
        { label: 'Total Revenue', value: `₹${stats.totalRevenue}`, icon: FiCreditCard, color: 'purple' },
    ];

    const colorMap = {
        blue: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600',
        green: 'bg-green-100 dark:bg-green-900/40 text-green-600',
        emerald: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600',
        indigo: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600',
        yellow: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600',
        purple: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600',
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: FiHome },
        { id: 'requests', label: `Requests ${stats.pendingRequests > 0 ? `(${stats.pendingRequests})` : ''}`, icon: FiList },
        { id: 'users', label: 'All Students', icon: FiUsers },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            {/* Top Header */}
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-16 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-3 py-3 min-h-[3.5rem]">
                        
                        {/* Mobile Title + Actions */}
                        <div className="flex items-center justify-between w-full sm:hidden">
                            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Admin Panel</h1>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={fetchAll}
                                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                    title="Refresh"
                                >
                                    <FiRefreshCw size={16} />
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                                >
                                    <FiLogOut size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Desktop row: Title + Tabs + Desktop Actions */}
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-6 w-full sm:w-auto">
                                <h1 className="text-lg font-bold text-slate-900 dark:text-white hidden sm:block flex-shrink-0">Admin Panel</h1>
                                <div className="flex gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-hide">
                                    {tabs.map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                                                activeTab === tab.id
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                                            }`}
                                        >
                                            <tab.icon size={14} />
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Desktop Actions */}
                            <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
                                <button
                                    onClick={fetchAll}
                                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                    title="Refresh"
                                >
                                    <FiRefreshCw size={16} />
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                                >
                                    <FiLogOut size={14} />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                            {statCards.map((card, i) => (
                                <motion.div
                                    key={card.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="glass-card p-5 rounded-2xl"
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colorMap[card.color]}`}>
                                        <card.icon size={18} />
                                    </div>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{card.value}</p>
                                    <p className="text-xs text-slate-500 mt-1">{card.label}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Chart */}
                        <div className="glass-card p-6 rounded-2xl">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Library Overview</h3>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} barSize={40}>
                                        <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                                        <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                                        <Tooltip
                                            contentStyle={{
                                                background: '#1e293b',
                                                border: 'none',
                                                borderRadius: '12px',
                                                color: '#fff'
                                            }}
                                            cursor={{ fill: 'rgba(99,102,241,0.1)' }}
                                        />
                                        <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* REQUESTS TAB */}
                {activeTab === 'requests' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="glass-card rounded-2xl overflow-hidden">
                            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    Pending Booking Requests
                                    {requests.length > 0 && (
                                        <span className="ml-2 px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 text-sm rounded-full">
                                            {requests.length}
                                        </span>
                                    )}
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-800/50">
                                        <tr>
                                            {['Student', 'Mobile', 'Seat', 'Plan', 'Amount', 'Payment Proof', 'Actions'].map(h => (
                                                <th key={h} className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {requests.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="py-16 text-center text-slate-400">
                                                    <FiCheckCircle className="mx-auto text-4xl mb-3 text-green-400" />
                                                    <p>No pending requests</p>
                                                </td>
                                            </tr>
                                        ) : requests.map((req) => (
                                            <tr key={req._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                                <td className="py-4 px-4 whitespace-nowrap">
                                                    <p className="font-semibold text-slate-900 dark:text-white">{req.userId?.name}</p>
                                                    <p className="text-xs text-slate-500">{req.userId?.email}</p>
                                                </td>
                                                <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{req.userId?.mobile}</td>
                                                <td className="py-4 px-4 whitespace-nowrap">
                                                    <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full font-bold text-sm">
                                                        #{req.seatNumber?.seatNumber}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 whitespace-nowrap">
                                                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium">
                                                        {req.plan}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">₹{req.amount}</td>
                                                <td className="py-4 px-4 whitespace-nowrap">
                                                    <a
                                                        href={req.paymentScreenshot}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                                    >
                                                        <FiEye size={14} /> View
                                                    </a>
                                                </td>
                                                <td className="py-4 px-4 whitespace-nowrap">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleAction(req._id, 'approved')}
                                                            disabled={actionLoading === req._id + 'approved'}
                                                            className="px-3 py-1.5 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-colors"
                                                        >
                                                            {actionLoading === req._id + 'approved' ? '...' : 'Approve'}
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction(req._id, 'rejected')}
                                                            disabled={actionLoading === req._id + 'rejected'}
                                                            className="px-3 py-1.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-colors"
                                                        >
                                                            {actionLoading === req._id + 'rejected' ? '...' : 'Reject'}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* USERS TAB */}
                {activeTab === 'users' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="glass-card rounded-2xl overflow-hidden">
                            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    All Students
                                    <span className="ml-2 px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-sm rounded-full">
                                        {users.length}
                                    </span>
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-800/50">
                                        <tr>
                                            {['Student', 'Mobile', 'Seat', 'Plan', 'Status', 'Expiry', 'Actions'].map(h => (
                                                <th key={h} className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {users.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="py-16 text-center text-slate-400">No students registered yet</td>
                                            </tr>
                                        ) : users.map((u) => (
                                            <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                                <td className="py-4 px-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 font-bold text-sm flex-shrink-0">
                                                            {u.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-slate-900 dark:text-white">{u.name}</p>
                                                            <p className="text-xs text-slate-500">{u.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{u.mobile}</td>
                                                <td className="py-4 px-4 whitespace-nowrap">
                                                    {u.seatNumber ? (
                                                        <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full font-bold text-sm">
                                                            #{u.seatNumber.seatNumber}
                                                        </span>
                                                    ) : u.pendingPayment?.seatNumber ? (
                                                        <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 rounded-full font-bold text-sm">
                                                            #{u.pendingPayment.seatNumber.seatNumber}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-400 text-sm">—</span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                                                    {u.membershipPlan !== 'None' ? u.membershipPlan : (u.pendingPayment?.plan || 'None')}
                                                </td>
                                                <td className="py-4 px-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                        u.bookingStatus === 'approved' ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400' :
                                                        u.bookingStatus === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400' :
                                                        u.bookingStatus === 'rejected' ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400' :
                                                        'bg-slate-100 dark:bg-slate-700 text-slate-500'
                                                    }`}>
                                                        {u.bookingStatus || 'none'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                                                    {u.membershipExpiryDate
                                                        ? new Date(u.membershipExpiryDate).toLocaleDateString('en-IN')
                                                        : '—'}
                                                </td>
                                                <td className="py-4 px-4 whitespace-nowrap">
                                                    <div className="flex flex-wrap gap-2">
                                                        <button
                                                            onClick={() => setSelectedUser(u)}
                                                            className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-xs font-bold transition-colors"
                                                        >
                                                            Profile
                                                        </button>
                                                        {/* Pending: show Approve + Reject */}
                                                        {u.bookingStatus === 'pending' && u.pendingPayment && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleAction(u.pendingPayment._id, 'approved')}
                                                                    disabled={actionLoading === u.pendingPayment._id + 'approved'}
                                                                    className="px-3 py-1.5 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-colors"
                                                                >
                                                                    {actionLoading === u.pendingPayment._id + 'approved' ? '...' : '✓ Approve'}
                                                                </button>
                                                                <button
                                                                    onClick={() => handleAction(u.pendingPayment._id, 'rejected')}
                                                                    disabled={actionLoading === u.pendingPayment._id + 'rejected'}
                                                                    className="px-3 py-1.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-colors"
                                                                >
                                                                    {actionLoading === u.pendingPayment._id + 'rejected' ? '...' : '✗ Reject'}
                                                                </button>
                                                            </>
                                                        )}
                                                        {/* Approved: show Free Seat */}
                                                        {u.seatNumber && u.bookingStatus === 'approved' && (
                                                            <button
                                                                onClick={() => handleFreeSeat(
                                                                    u.seatNumber._id || u.seatNumber,
                                                                    u.name
                                                                )}
                                                                className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold transition-colors"
                                                            >
                                                                Free Seat
                                                            </button>
                                                        )}
                                                        {/* Delete button in table */}
                                                        <button
                                                            onClick={() => handleDeleteUser(u._id, u.name)}
                                                            className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-colors"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Student Profile Modal */}
            <AnimatePresence>
                {selectedUser && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedUser(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 relative">
                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                                >
                                    <FiX size={20} />
                                </button>
                                <div className="flex items-center gap-4">
                                    {selectedUser.profilePhoto && selectedUser.profilePhoto !== 'no-photo.jpg' ? (
                                        <img
                                            src={selectedUser.profilePhoto}
                                            alt={selectedUser.name}
                                            className="w-16 h-16 rounded-full object-cover border-2 border-white/50"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
                                            {selectedUser.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{selectedUser.name}</h3>
                                        <p className="text-white/70 text-sm">{selectedUser.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl">
                                        <p className="text-xs text-slate-500 mb-1">Mobile</p>
                                        <p className="font-semibold text-slate-900 dark:text-white text-sm">{selectedUser.mobile}</p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl">
                                        <p className="text-xs text-slate-500 mb-1">Seat Number</p>
                                        <p className="font-semibold text-slate-900 dark:text-white text-sm">
                                            {selectedUser.seatNumber ? `#${selectedUser.seatNumber.seatNumber}` : 'Not Assigned'}
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl">
                                        <p className="text-xs text-slate-500 mb-1">Membership Plan</p>
                                        <p className="font-semibold text-slate-900 dark:text-white text-sm">{selectedUser.membershipPlan || 'None'}</p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl">
                                        <p className="text-xs text-slate-500 mb-1">Status</p>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                            selectedUser.bookingStatus === 'approved' ? 'bg-green-100 text-green-700' :
                                            selectedUser.bookingStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                            selectedUser.bookingStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                                            'bg-slate-100 text-slate-500'
                                        }`}>
                                            {selectedUser.bookingStatus || 'none'}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl">
                                    <p className="text-xs text-slate-500 mb-1">Address</p>
                                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{selectedUser.address}</p>
                                </div>

                                {selectedUser.membershipStartDate && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl">
                                            <p className="text-xs text-slate-500 mb-1">Start Date</p>
                                            <p className="font-semibold text-slate-900 dark:text-white text-sm">
                                                {new Date(selectedUser.membershipStartDate).toLocaleDateString('en-IN')}
                                            </p>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl">
                                            <p className="text-xs text-slate-500 mb-1">Expiry Date</p>
                                            <p className="font-semibold text-slate-900 dark:text-white text-sm">
                                                {new Date(selectedUser.membershipExpiryDate).toLocaleDateString('en-IN')}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {selectedUser.aadhaarPhoto && (
                                    <div>
                                        <p className="text-xs text-slate-500 mb-2">Aadhaar Card</p>
                                        <a
                                            href={selectedUser.aadhaarPhoto}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                        >
                                            <FiEye size={14} /> View Aadhaar Document
                                        </a>
                                    </div>
                                )}

                                {/* Pending payment actions inside modal */}
                                {selectedUser.bookingStatus === 'pending' && selectedUser.pendingPayment && (
                                    <div className="border border-yellow-200 dark:border-yellow-700/50 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4">
                                        <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-400 mb-3 uppercase tracking-wide">Pending Payment Request</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 text-sm">
                                            <div>
                                                <p className="text-xs text-slate-500">Plan</p>
                                                <p className="font-bold text-slate-900 dark:text-white">{selectedUser.pendingPayment.plan}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500">Amount</p>
                                                <p className="font-bold text-slate-900 dark:text-white">₹{selectedUser.pendingPayment.amount}</p>
                                            </div>
                                        </div>
                                        <a
                                            href={selectedUser.pendingPayment.paymentScreenshot}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm font-medium mb-3"
                                        >
                                            <FiEye size={14} /> View Payment Screenshot
                                        </a>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    handleAction(selectedUser.pendingPayment._id, 'approved');
                                                    setSelectedUser(null);
                                                }}
                                                disabled={actionLoading === selectedUser.pendingPayment._id + 'approved'}
                                                className="flex-1 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-lg text-sm font-bold transition-colors"
                                            >
                                                ✓ Approve
                                            </button>
                                            <button
                                                onClick={() => {
                                                    handleAction(selectedUser.pendingPayment._id, 'rejected');
                                                    setSelectedUser(null);
                                                }}
                                                disabled={actionLoading === selectedUser.pendingPayment._id + 'rejected'}
                                                className="flex-1 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-lg text-sm font-bold transition-colors"
                                            >
                                                ✗ Reject
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <p className="text-xs text-slate-400 text-center">
                                    Registered: {new Date(selectedUser.createdAt).toLocaleDateString('en-IN')}
                                </p>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                                    {/* Free Seat button — show for approved OR pending */}
                                    {(selectedUser.bookingStatus === 'approved' && selectedUser.seatNumber) && (
                                        <button
                                            onClick={() => handleFreeSeat(selectedUser.seatNumber._id, selectedUser.name)}
                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-bold transition-colors"
                                        >
                                            <FiUnlock size={14} /> Free Seat
                                        </button>
                                    )}
                                    {selectedUser.bookingStatus === 'pending' && selectedUser.pendingPayment?.seatNumber && (
                                        <button
                                            onClick={() => handleFreeSeat(selectedUser.pendingPayment.seatNumber._id || selectedUser.pendingPayment.seatNumber, selectedUser.name)}
                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-bold transition-colors"
                                        >
                                            <FiUnlock size={14} /> Free Seat
                                        </button>
                                    )}
                                    {/* Delete button — always visible */}
                                    <button
                                        onClick={() => handleDeleteUser(selectedUser._id, selectedUser.name)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition-colors"
                                    >
                                        <FiTrash2 size={14} /> Delete Student
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
