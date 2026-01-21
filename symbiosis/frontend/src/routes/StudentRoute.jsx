import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const StudentRoute = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

    return user && user.role === 'STUDENT' ? <Outlet /> : <Navigate to="/dashboard" />;
};

export default StudentRoute;
