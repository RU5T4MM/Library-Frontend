import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyAuth } from './redux/slices/authSlice';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Private Pages
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ForgotPassword from './pages/ForgotPassword';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const dispatch = useDispatch();
  const { verifying } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(verifyAuth());
  }, [dispatch]);

  if (verifying) return <div className="flex items-center justify-center min-h-screen"><div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>;
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* User Routes */}
            <Route element={<ProtectedRoute role="user" />}>
                <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute role="admin" />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>

            {/* Add more routes here */}
          </Routes>
        </main>
        <Footer />
      </div>
      <ToastContainer position="bottom-right" theme="colored" />
    </Router>
  );
}

export default App;
