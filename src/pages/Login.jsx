import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import HeroSection from '../components/home/HeroSection';

const Login = () => {
    const { isAuthenticated, user, verifying } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!verifying && isAuthenticated) {
            navigate(user?.role === 'admin' ? '/admin/dashboard' : '/dashboard', { replace: true });
        }
    }, [isAuthenticated, user, verifying, navigate]);

    return <HeroSection />;
};

export default Login;
