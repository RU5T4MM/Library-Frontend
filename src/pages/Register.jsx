import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../redux/slices/authSlice';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Register = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [aadhaarPhoto, setAadhaarPhoto] = useState(null);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.auth);

    const password = watch('password');

    const handleFileChange = (e, setFile) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 200 * 1024) {
                toast.error('File size must be less than 200KB');
                e.target.value = null;
                return;
            }
            setFile(file);
        }
    };

    const onSubmit = async (data) => {
        if (!aadhaarPhoto) {
            toast.error('Aadhaar photo is required');
            return;
        }

        dispatch(loginStart());

        try {
            // 1. Upload images if exist
            let profileUrl = '';
            let aadhaarUrl = '';

            if (profilePhoto) {
                const formData = new FormData();
                formData.append('image', profilePhoto);
                const res = await api.post('/upload/register', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                profileUrl = res.data.data;
            }

            const formDataAadhaar = new FormData();
            formDataAadhaar.append('image', aadhaarPhoto);
            const resAadhaar = await api.post('/upload/register', formDataAadhaar, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            aadhaarUrl = resAadhaar.data.data;

            // 2. Register user
            const userData = {
                name: data.name,
                email: data.email,
                password: data.password,
                mobile: data.mobile,
                address: data.address,
                profilePhoto: profileUrl,
                aadhaarPhoto: aadhaarUrl
            };

            const response = await api.post('/auth/register', userData);
            dispatch(loginSuccess(response.data));
            toast.success('Registration successful!');
            navigate('/dashboard');

        } catch (error) {
            dispatch(loginFailure(error.response?.data?.error || 'Registration failed'));
            toast.error(error.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen py-20 bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl w-full space-y-8 glass-card p-10 rounded-3xl"
            >
                <div>
                    <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900 dark:text-white">
                        Create an account
                    </h2>
                    <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
                        Or{' '}
                        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                            sign in to your existing account
                        </Link>
                        {' '}·{' '}
                        <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                            Forgot password?
                        </Link>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                            <input
                                {...register("name", { required: "Name is required" })}
                                className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email address</label>
                            <input
                                type="email"
                                {...register("email", { 
                                    required: "Email is required",
                                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                                })}
                                className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                            />
                            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register("password", { 
                                    required: "Password is required",
                                    minLength: { value: 6, message: "Minimum 6 characters" }
                                })}
                                className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white pr-10"
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-9 text-slate-400 hover:text-indigo-500"
                            >
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Confirm Password</label>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                {...register("confirmPassword", { 
                                    validate: value => value === password || "Passwords do not match"
                                })}
                                className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white pr-10"
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-9 text-slate-400 hover:text-indigo-500"
                            >
                                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                            {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
                        </div>

                        {/* Mobile */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Mobile Number</label>
                            <input
                                {...register("mobile", { 
                                    required: "Mobile number is required",
                                    pattern: { value: /^[0-9]{10}$/, message: "Must be exactly 10 digits" }
                                })}
                                className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                            />
                            {errors.mobile && <p className="mt-1 text-xs text-red-500">{errors.mobile.message}</p>}
                        </div>

                        {/* Address */}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Address</label>
                            <input
                                {...register("address", { required: "Address is required" })}
                                className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                            />
                            {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>}
                        </div>

                        {/* Profile Photo */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Profile Photo (Max 200KB)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, setProfilePhoto)}
                                className="mt-1 block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            />
                        </div>

                        {/* Aadhaar Photo */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Aadhaar Card (Max 200KB)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, setAadhaarPhoto)}
                                className="mt-1 block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg disabled:opacity-50 transition-all"
                        >
                            {loading ? 'Creating Account...' : 'Sign up'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Register;
