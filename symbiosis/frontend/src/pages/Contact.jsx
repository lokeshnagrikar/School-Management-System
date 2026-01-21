import { useState, useEffect } from 'react';
import api from '../services/api';

const Contact = () => {
    const [formData, setFormData] = useState({
        studentName: '',
        parentName: '',
        email: '',
        phone: '',
        grade: '',
        message: ''
    });

    const [classes, setClasses] = useState([]);
    const [status, setStatus] = useState('');

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const { data } = await api.get('/academic/classes');
                setClasses(data);
            } catch (error) {
                console.error("Failed to fetch classes", error);
            }
        };
        fetchClasses();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/enquiries', formData);
            setStatus('success');
            setFormData({
                studentName: '',
                parentName: '',
                email: '',
                phone: '',
                grade: '',
                message: ''
            });
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-28 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">

                {/* LEFT SIDE */}
                <div>
                    <h1 className="text-4xl font-extrabold mb-6
                         bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600
                         bg-clip-text text-transparent animate-gradient">
                        Contact Us
                    </h1>

                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 transition-colors">
                        Have questions about admissions? Our team is happy to help you.
                    </p>

                    <div className="space-y-8">

                        {/* Address */}
                        <div className="flex items-start gap-4 group">
                            <div className="h-12 w-12 flex items-center justify-center rounded-full
                              bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400
                              transition-all duration-300
                              group-hover:bg-blue-600 group-hover:text-white
                              group-hover:scale-110 animate-pulse">
                                <i className="fas fa-map-marker-alt text-lg"></i>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors">Address</h3>
                                <p className="text-gray-500 dark:text-gray-400 transition-colors">
                                    123 School Lane, Education City, State, 123456
                                </p>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="flex items-start gap-4 group">
                            <div className="h-12 w-12 flex items-center justify-center rounded-full
                              bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400
                              transition-all duration-300
                              group-hover:bg-green-600 group-hover:text-white
                              group-hover:scale-110 animate-pulse">
                                <i className="fas fa-phone text-lg"></i>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors">Phone</h3>
                                <p className="text-gray-500 dark:text-gray-400 transition-colors">+91 98765 43210</p>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-start gap-4 group">
                            <div className="h-12 w-12 flex items-center justify-center rounded-full
                              bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400
                              transition-all duration-300
                              group-hover:bg-purple-600 group-hover:text-white
                              group-hover:scale-110 animate-pulse">
                                <i className="fas fa-envelope text-lg"></i>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors">Email</h3>
                                <p className="text-gray-500 dark:text-gray-400 transition-colors">info@isbm.com</p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* RIGHT SIDE FORM */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl dark:shadow-slate-900/50 hover:shadow-2xl transition-all border border-gray-100 dark:border-slate-700">

                    <h2 className="text-2xl font-bold mb-6
                         bg-gradient-to-r from-blue-600 to-purple-600
                         bg-clip-text text-transparent">
                        Admission Enquiry
                    </h2>

                    {status === 'success' && (
                        <div className="mb-4 text-green-600 dark:text-green-400 font-medium animate-bounce">
                            Enquiry sent successfully! We will contact you soon.
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="mb-4 text-red-600 dark:text-red-400 font-medium animate-pulse">
                            Something went wrong. Please try again.
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <input
                            type="text"
                            name="studentName"
                            placeholder="Student Name"
                            required
                            value={formData.studentName}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-4 py-3
                         bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         outline-none transition-all"
                        />

                        <input
                            type="text"
                            name="parentName"
                            placeholder="Parent Name"
                            required
                            value={formData.parentName}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-4 py-3
                         bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         outline-none transition-all"
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-4 py-3
                           bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />

                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-4 py-3
                           bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>

                        <select
                            name="grade"
                            required
                            value={formData.grade}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-4 py-3
                         bg-white dark:bg-slate-900 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        >
                            <option value="" className="dark:bg-slate-900">Select Grade</option>
                            {classes.length > 0 ? (
                                classes.map((cls) => (
                                    <option key={cls._id} value={cls.name} className="dark:bg-slate-900">
                                        {cls.name}
                                    </option>
                                ))
                            ) : (
                                <option disabled className="text-gray-500">Loading grades...</option>
                            )}
                        </select>

                        <textarea
                            name="message"
                            rows="4"
                            placeholder="Your message"
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-4 py-3
                         bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />

                        <button
                            type="submit"
                            className="w-full py-3 rounded-lg font-semibold text-white
                         bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600
                         animate-gradient
                         hover:scale-[1.02] transition-transform
                         shadow-lg">
                            Submit Enquiry
                        </button>

                    </form>
                </div>

            </div>
        </div>
    );
};

export default Contact;
