import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import DashboardHome from '../pages/admin/DashboardHome';

const RoleBasedRedirect = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

    const role = user?.role?.toUpperCase();

    if (role === 'ADMIN') {
        return <DashboardHome />;
    }
    if (role === 'TEACHER') {
        return <Navigate to="teacher" replace />;
    }
    if (role === 'STUDENT') {
        return <Navigate to="student" replace />;
    }

    return <Navigate to="/login" replace />;
};

export default RoleBasedRedirect;
