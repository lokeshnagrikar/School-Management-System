import { useState, useEffect } from 'react';
import api from '../../services/api';
import { FiBook, FiPlus, FiTrash2, FiX } from 'react-icons/fi';

const Library = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        isbn: '',
        location: '',
        totalCopies: 5,
        availableCopies: 5
    });

    const fetchBooks = async () => {
        try {
            const { data } = await api.get('/library');
            setBooks(data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch books', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Delete this book?')) {
            try {
                await api.delete(`/library/${id}`);
                fetchBooks();
            } catch (error) {
                alert('Error deleting book');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/library', formData);
            setShowModal(false);
            setFormData({
                title: '',
                author: '',
                isbn: '',
                location: '',
                totalCopies: 5,
                availableCopies: 5
            });
            fetchBooks();
        } catch (error) {
            alert('Error adding book: ' + (error.response?.data?.message || error.message));
        }
    };

    if (loading) return <div className="p-8 text-center">Loading Library...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Library Management</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage library inventory</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                    <FiPlus className="mr-2" />
                    Add Book
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book) => (
                    <div key={book._id} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                        <div>
                            <div className="flex items-start justify-between">
                                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                                    <FiBook className="text-xl" />
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${book.availableCopies > 0
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                    }`}>
                                    {book.availableCopies > 0 ? 'Available' : 'Out of Stock'}
                                </span>
                            </div>
                            <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white line-clamp-1">{book.title}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">{book.author}</p>

                            <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                                <div>
                                    <span className="block text-slate-400">ISBN</span>
                                    <span className="font-medium text-slate-700 dark:text-slate-300">{book.isbn}</span>
                                </div>
                                <div>
                                    <span className="block text-slate-400">Location</span>
                                    <span className="font-medium text-slate-700 dark:text-slate-300">{book.location}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                            <button
                                onClick={() => handleDelete(book._id)}
                                className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                                <FiTrash2 />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Book Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6 border border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Add New Book</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white">
                                <FiX size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Book Title</label>
                                <input
                                    type="text" required
                                    className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Author</label>
                                <input
                                    type="text" required
                                    className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                                    value={formData.author}
                                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">ISBN</label>
                                    <input
                                        type="text" required
                                        className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                                        value={formData.isbn}
                                        onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Location</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Total Copies</label>
                                    <input
                                        type="number" required min="1"
                                        className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                                        value={formData.totalCopies}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            totalCopies: parseInt(e.target.value),
                                            availableCopies: parseInt(e.target.value) // Reset available to total on new add
                                        })}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 mt-4">
                                Add to Library
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Library;
