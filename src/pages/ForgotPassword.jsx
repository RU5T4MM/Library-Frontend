import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: email, 2: otp+newpass
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            toast.success('OTP sent to your email!');
            setStep(2);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        try {
            await api.post('/auth/reset-password', { email, otp, newPassword });
            toast.success('Password reset successful! Please login.');
            setStep(1);
            setEmail('');
            setOtp('');
            setNewPassword('');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Invalid or expired OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-20 bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-4 transition-colors duration-300">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full glass-card p-10 rounded-3xl"
            >
                <h2 className="text-center text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                    {step === 1 ? 'Forgot Password' : 'Reset Password'}
                </h2>
                <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-8">
                    {step === 1
                        ? 'Enter your registered email to receive an OTP'
                        : `OTP sent to ${email}`}
                </p>

                {step === 1 ? (
                    <form onSubmit={handleSendOtp} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                placeholder="Enter your email"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 font-bold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg disabled:opacity-50 transition-all"
                        >
                            {loading ? 'Sending OTP...' : 'Send OTP'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">OTP</label>
                            <input
                                type="text"
                                required
                                value={otp}
                                onChange={e => setOtp(e.target.value)}
                                maxLength={6}
                                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white tracking-widest text-center text-lg font-bold"
                                placeholder="Enter 6-digit OTP"
                            />
                        </div>
                        <div className="relative">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white pr-12"
                                placeholder="Enter new password"
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
                            className="w-full py-3 font-bold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg disabled:opacity-50 transition-all"
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-full text-sm text-slate-500 hover:text-indigo-500 transition-colors"
                        >
                            ← Change email
                        </button>
                    </form>
                )}

                <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
                    Remember your password?{' '}
                    <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
