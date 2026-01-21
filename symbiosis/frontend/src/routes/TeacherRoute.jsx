import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const TeacherRoute = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

    return user && user.role === 'TEACHER' ? <Outlet /> : <Navigate to="/dashboard" />;
};

export default TeacherRoute;
