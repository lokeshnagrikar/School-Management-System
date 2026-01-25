import { useState, useEffect } from 'react';
import api from '../../services/api';
import { FiTruck, FiPlus, FiTrash2 } from 'react-icons/fi';

const Transport = () => {
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRoutes = async () => {
        try {
            const { data } = await api.get('/transport');
            setRoutes(data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch routes', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoutes();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Delete this route?')) {
            try {
                await api.delete(`/transport/${id}`);
                fetchRoutes();
            } catch (error) {
                alert('Error deleting route');
            }
        }
    };

    if (loading) return <div className="p-8 text-center">Loading Transport Routes...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Transport Management</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage bus routes and drivers</p>
                </div>
                <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    <FiPlus className="mr-2" />
                    Add Route
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden border border-slate-200 dark:border-slate-700">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-900/50">
                        <tr>
                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Route Name</th>
                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Driver</th>
                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Vehicle</th>
                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Charges</th>
                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {routes.map((route) => (
                            <tr key={route._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                <td className="p-4 font-medium text-slate-900 dark:text-white">{route.routeName}</td>
                                <td className="p-4 text-slate-600 dark:text-slate-300">
                                    <div>{route.driverName}</div>
                                    <div className="text-xs text-slate-400">{route.driverPhone}</div>
                                </td>
                                <td className="p-4 text-slate-600 dark:text-slate-300">{route.vehicleNumber}</td>
                                <td className="p-4 font-semibold text-slate-900 dark:text-white">₹{route.routeCharges}</td>
                                <td className="p-4">
                                    <button
                                        onClick={() => handleDelete(route._id)}
                                        className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Transport;
