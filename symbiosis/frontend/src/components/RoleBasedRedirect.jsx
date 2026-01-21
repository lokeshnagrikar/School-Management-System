import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import DashboardHome from '../pages/admin/DashboardHome';

const RoleBasedRedirect = () => {
    const { user } = useContext(AuthContext);

    if (user?.role === 'ADMIN') {
        return <DashboardHome />;
    }
    if (user?.role === 'TEACHER') {
        return <Navigate to="teacher" replace />;
    }
    if (user?.role === 'STUDENT') {
        return <Navigate to="student" replace />;
    }

    return null;
};

export default RoleBasedRedirect;
