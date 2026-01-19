import { useState, useEffect } from 'react';
import api from '../../services/api';
import { FiTrash2, FiPlus, FiImage } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ title: '', imageUrl: '', category: 'Events' });

    const fetchGallery = async () => {
        try {
            const { data } = await api.get('/cms/gallery');
            setImages(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGallery();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/cms/gallery', formData);
            setShowModal(false);
            setFormData({ title: '', imageUrl: '', category: 'Events' });
            fetchGallery();
        } catch (error) {
            alert('Failed to add image');
        }
    };


    const handleDelete = async (id) => {
        if (window.confirm('Delete this image?')) {
            try {
                await api.delete(`/cms/gallery/${id}`);
                setImages(images.filter(img => img._id !== id));
            } catch (error) {
                alert('Failed to delete');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Media Gallery</h1>
                <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <FiPlus /> Add Image
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnimatePresence>
                    {images.map(img => (
                        <motion.div
                            key={img._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group"
                        >
                            <div className="relative h-48 bg-gray-100">
                                <img src={img.imageUrl} alt={img.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button onClick={() => handleDelete(img._id)} className="p-2 bg-white rounded-full text-red-600 hover:scale-110 transition-transform">
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-800">{img.title}</h3>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {images.length === 0 && !loading && (
                <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed">
                    <FiImage className="mx-auto text-4xl mb-2 text-gray-400" />
                    <p>No images in gallery</p>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Add Image</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Title</label>
                                <input type="text" required className="w-full border rounded-lg px-3 py-2" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Category</label>
                                <select className="w-full border rounded-lg px-3 py-2" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                    <option value="Events">Events</option>
                                    <option value="Academic">Academic</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Facilities">Facilities</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Image URL</label>
                                <input type="url" required placeholder="https://..." className="w-full border rounded-lg px-3 py-2" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg">Cancel</button>
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;
