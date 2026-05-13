 import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import HeroSection from '../components/home/HeroSection';

// Standalone login page reuses the HeroSection login form
// If already logged in, redirect to appropriate dashboard
const Login = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate(user?.role === 'admin' ? '/admin/dashboard' : '/dashboard', { replace: true });
        }
    }, [isAuthenticated, user, navigate]);

    return <HeroSection />;
};

export default Login;
