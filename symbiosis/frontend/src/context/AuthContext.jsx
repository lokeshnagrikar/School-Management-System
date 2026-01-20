import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/users/login', { email, password });
            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed',
            };
        }
    };

    const loginWithGoogle = async (token) => {
        try {
            // Set token in localStorage temporarily to allow api interceptor to pick it up if configured, 
            // or we manually pass header. Assuming api instance picks up token from localStorage 'userInfo'.
            // But 'userInfo' is an object. 
            // Better to explicitly pass header here.

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const { data } = await api.get('/users/profile', config);

            // Construct user object matching normal login response
            const userInfo = { ...data, token };

            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            setUser(userInfo);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Google Login failed',
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, loginWithGoogle, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
