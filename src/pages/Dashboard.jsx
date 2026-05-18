import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiClock, FiCheckCircle, FiInfo, FiUpload, FiDownload, FiLogOut } from 'react-icons/fi';
import api from '../services/api';
import { toast } from 'react-toastify';
import { updateUser, logout } from '../redux/slices/authSlice';
import jsPDF from 'jspdf';
import QRCode from '../components/QRCode';


const Dashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [seats, setSeats] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedPlan, setSelectedPlan] = useState('');
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [paymentScreenshot, setPaymentScreenshot] = useState(null);
    const [bookingLoading, setBookingLoading] = useState(false);

    useEffect(() => {
        fetchSeats();
        fetchMe();
    }, []);

    const fetchMe = async () => {
        try {
            const res = await api.get('/auth/me');
            dispatch(updateUser(res.data.data));
        } catch (error) {
            console.error('Error fetching user', error);
        }
    };

    const fetchSeats = async () => {
        try {
            const res = await api.get('/seats');
            setSeats(res.data.data);
        } catch {
            toast.error('Failed to load seats');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
        toast.success('Logged out successfully');
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 500 * 1024) {
                toast.error('File size must be less than 500KB');
                e.target.value = null;
                return;
            }
            setPaymentScreenshot(file);
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!selectedPlan || !selectedSeat || !paymentScreenshot) {
            toast.error('Please complete all steps');
            return;
        }
        setBookingLoading(true);
        try {
            const formData = new FormData();
            formData.append('image', paymentScreenshot);
            const resUpload = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const screenshotUrl = resUpload.data.data;

            const amount = selectedPlan === '1 Month' ? 500 : 1200;
            await api.post('/seats/request', {
                seatNumber: selectedSeat.seatNumber,
                plan: selectedPlan,
                amount,
                paymentScreenshot: screenshotUrl
            });

            toast.success('Booking request submitted! Admin will review shortly.');
            await fetchMe();
            await fetchSeats();
            setSelectedPlan('');
            setSelectedSeat(null);
            setPaymentScreenshot(null);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Booking failed');
        } finally {
            setBookingLoading(false);
        }
    };

    const downloadReceipt = () => {
        if (!user || user.bookingStatus !== 'approved') {
            toast.error('No active membership to generate receipt.');
            return;
        }
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.setTextColor(79, 70, 229);
        doc.text('Infotech Library', 105, 20, null, null, 'center');
        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text('Smart Study Environment for Smart Students', 105, 28, null, null, 'center');
        doc.setLineWidth(0.5);
        doc.line(20, 35, 190, 35);
        doc.setFontSize(16);
        doc.setTextColor(0);
        doc.text('Payment Receipt', 105, 45, null, null, 'center');
        doc.setFontSize(12);
        const startY = 60;
        const ls = 10;
        doc.text(`Name: ${user.name}`, 20, startY);
        doc.text(`Email: ${user.email}`, 20, startY + ls);
        doc.text(`Mobile: ${user.mobile}`, 20, startY + ls * 2);
        doc.text(`Seat Number: #${user.seatNumber?.seatNumber || 'N/A'}`, 20, startY + ls * 3);
        doc.text(`Membership Plan: ${user.membershipPlan}`, 20, startY + ls * 4);
        doc.text(`Status: Paid & Approved`, 20, startY + ls * 5);
        doc.text(`Start Date: ${new Date(user.membershipStartDate).toLocaleDateString()}`, 20, startY + ls * 7);
        doc.text(`Expiry Date: ${new Date(user.membershipExpiryDate).toLocaleDateString()}`, 20, startY + ls * 8);
        doc.line(20, 160, 190, 160);
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text('Thank you for choosing Infotech Library!', 105, 170, null, null, 'center');
        doc.text('This is a computer-generated receipt.', 105, 175, null, null, 'center');
        doc.save(`Receipt_${user.name.replace(/\s+/g, '_')}.pdf`);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const hasActiveBooking = user?.bookingStatus === 'pending' || user?.bookingStatus === 'approved';

    return (
        <div className="min-h-screen py-12 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">My Dashboard</h1>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1">Welcome back, <span className="font-semibold text-indigo-600">{user?.name}</span></p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
                    >
                        <FiLogOut size={16} />
                        Logout
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Membership Status */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card p-6 rounded-2xl"
                        >
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <FiInfo /> Membership Status
                            </h3>

                            {user?.bookingStatus === 'none' || user?.bookingStatus === 'rejected' ? (
                                <div className="text-center p-4 bg-slate-100 dark:bg-slate-800 rounded-xl">
                                    <p className="text-slate-500 dark:text-slate-400 mb-1">No active membership</p>
                                    {user?.bookingStatus === 'rejected' && (
                                        <p className="text-red-500 text-sm mt-2">Your previous request was rejected. Please try again.</p>
                                    )}
                                </div>
                            ) : user?.bookingStatus === 'pending' ? (
                                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 rounded-xl">
                                    <FiClock className="mx-auto text-yellow-500 text-3xl mb-2" />
                                    <p className="text-yellow-700 dark:text-yellow-400 font-semibold">Request Under Review</p>
                                    <p className="text-sm text-yellow-600 dark:text-yellow-500 mt-1">Admin is verifying your payment. You'll be notified once approved.</p>
                                </div>
                            ) : (
                                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-xl">
                                    <FiCheckCircle className="mx-auto text-green-500 text-3xl mb-2" />
                                    <p className="text-green-700 dark:text-green-400 font-semibold">Membership Active ✓</p>
                                    <div className="mt-4 text-left space-y-2">
                                        <p className="text-sm text-slate-600 dark:text-slate-300">Plan: <span className="font-bold">{user.membershipPlan}</span></p>
                                        <p className="text-sm text-slate-600 dark:text-slate-300">Seat: <span className="font-bold text-indigo-600">#{user.seatNumber?.seatNumber}</span></p>
                                        <p className="text-sm text-slate-600 dark:text-slate-300">Expires: <span className="font-bold">{new Date(user.membershipExpiryDate).toLocaleDateString('en-IN')}</span></p>
                                    </div>
                                    <button
                                        onClick={downloadReceipt}
                                        className="mt-4 w-full flex items-center justify-center py-2 px-4 border border-indigo-500 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors font-medium text-sm"
                                    >
                                        <FiDownload className="mr-2" /> Download Receipt
                                    </button>
                                </div>
                            )}
                        </motion.div>

                        {/* Profile Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass-card p-6 rounded-2xl"
                        >
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <FiUser /> Profile
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-slate-500">Full Name</p>
                                    <p className="font-semibold text-slate-900 dark:text-white">{user?.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Email</p>
                                    <p className="font-medium text-slate-900 dark:text-white">{user?.email}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Mobile</p>
                                    <p className="font-medium text-slate-900 dark:text-white">{user?.mobile}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Address</p>
                                    <p className="font-medium text-slate-900 dark:text-white">{user?.address}</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Seat Booking / View */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass-card p-6 md:p-8 rounded-2xl"
                        >
                            {!hasActiveBooking ? (
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Book a Seat</h3>
                                    <form onSubmit={handleBooking} className="space-y-8">
                                        {/* Step 1 */}
                                        <div>
                                            <h4 className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-3">Step 1: Choose Plan</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {[{ label: '1 Month Plan', value: '1 Month', price: '₹500' }, { label: '3 Month Plan', value: '3 Months', price: '₹1200' }].map(plan => (
                                                    <div
                                                        key={plan.value}
                                                        onClick={() => setSelectedPlan(plan.value)}
                                                        className={`cursor-pointer border-2 rounded-xl p-4 text-center transition-all ${selectedPlan === plan.value ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'}`}
                                                    >
                                                        <p className="font-bold text-slate-900 dark:text-white">{plan.label}</p>
                                                        <p className="text-indigo-600 font-extrabold text-xl">{plan.price}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Step 2 */}
                                        {selectedPlan && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                                <h4 className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-3">Step 2: Select Seat</h4>
                                                <div className="flex gap-4 mb-3 text-xs font-medium text-slate-500">
                                                    <span className="flex items-center"><div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div> Available</span>
                                                    <span className="flex items-center"><div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div> Booked</span>
                                                    <span className="flex items-center"><div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div> Pending</span>
                                                </div>
                                                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-2 bg-slate-100 dark:bg-slate-800 p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                                                    {seats.map(seat => {
                                                        let cls = 'bg-green-500 hover:bg-green-600 cursor-pointer text-white';
                                                        if (seat.status === 'booked') cls = 'bg-red-500 cursor-not-allowed text-white opacity-50';
                                                        if (seat.status === 'pending') cls = 'bg-yellow-500 cursor-not-allowed text-white opacity-50';
                                                        if (selectedSeat?.seatNumber === seat.seatNumber) cls = 'bg-indigo-600 text-white ring-4 ring-indigo-300 dark:ring-indigo-800';
                                                        return (
                                                            <div
                                                                key={seat._id}
                                                                onClick={() => seat.status === 'available' && setSelectedSeat(seat)}
                                                                className={`aspect-square flex justify-center items-center rounded-md font-bold text-sm transition-colors ${cls}`}
                                                            >
                                                                {seat.seatNumber}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Step 3 */}
                                        {selectedSeat && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                                <h4 className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-3">Step 3: Payment</h4>
                                                <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                                                    <p className="mb-4 text-slate-700 dark:text-slate-300">
                                                        Pay <span className="font-extrabold text-indigo-600 text-xl">₹{selectedPlan === '1 Month' ? '500' : '1200'}</span> via PhonePe
                                                    </p>
                                                    <QRCode />
                                                    <div className="text-left">
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Upload Payment Screenshot</label>
                                                        <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-lg bg-white dark:bg-slate-700 hover:border-indigo-500 transition-colors">
                                                            <div className="space-y-1 text-center">
                                                                <FiUpload className="mx-auto h-10 w-10 text-slate-400" />
                                                                <label className="cursor-pointer text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                                                    <span>Upload a file</span>
                                                                    <input type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                                                                </label>
                                                                <p className="text-xs text-slate-500">PNG, JPG up to 500KB</p>
                                                                {paymentScreenshot && <p className="text-sm text-green-600 font-medium">{paymentScreenshot.name}</p>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    type="submit"
                                                    disabled={bookingLoading}
                                                    className="w-full mt-6 py-4 text-lg font-bold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg disabled:opacity-50 transition-all hover:scale-[1.02]"
                                                >
                                                    {bookingLoading ? 'Submitting...' : 'Confirm Booking'}
                                                </button>
                                            </motion.div>
                                        )}
                                    </form>
                                </div>
                            ) : (
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Seat Map</h3>
                                    {user?.bookingStatus === 'pending' && (
                                        <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 rounded-xl flex items-center gap-2">
                                            <FiClock className="text-yellow-500 flex-shrink-0" />
                                            <p className="text-sm text-yellow-700 dark:text-yellow-400">Your booking is pending admin approval. Your seat is reserved.</p>
                                        </div>
                                    )}
                                    <div className="flex gap-4 mb-4 text-xs font-medium text-slate-500">
                                        <span className="flex items-center"><div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div> Available</span>
                                        <span className="flex items-center"><div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div> Booked</span>
                                        <span className="flex items-center"><div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div> Pending</span>
                                        <span className="flex items-center"><div className="w-3 h-3 bg-indigo-600 rounded-full mr-1 ring-2 ring-offset-1 ring-indigo-300"></div> Your Seat</span>
                                    </div>
                                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-2 sm:gap-3 bg-slate-100 dark:bg-slate-800 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                                        {seats.map(seat => {
                                            let cls = 'bg-green-500 cursor-default text-white shadow-sm';
                                            if (seat.status === 'booked') cls = 'bg-red-500 cursor-default text-white opacity-50';
                                            if (seat.status === 'pending') cls = 'bg-yellow-500 cursor-default text-white opacity-50';
                                            if (user?.seatNumber?._id === seat._id || user?.seatNumber === seat._id) {
                                                cls = 'bg-indigo-600 text-white ring-4 ring-indigo-300 dark:ring-indigo-800 z-10 scale-110 shadow-lg';
                                            }
                                            return (
                                                <div key={seat._id} className={`aspect-square flex justify-center items-center rounded-xl font-bold text-lg transition-all ${cls}`}>
                                                    {seat.seatNumber}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
