import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ role }) => {
    const { isAuthenticated, user, loading, verifying, token } = useSelector((state) => state.auth);

    // Agar token hi nahi hai toh seedha login pe bhejo, verifying ka wait mat karo
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Token hai toh verifyAuth complete hone ka wait karo
    if (loading || verifying) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    // Token tha lekin backend ne invalid bataya (verifyAuth rejected)
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Role check - student admin panel nahi dekh sakta, admin dashboard nahi dekh sakta
    if (role && user?.role !== role) {
        return <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/'} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
