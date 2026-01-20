import { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';

const PublicGallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                // Public endpoint might not need auth if configured correctly, but our API uses standard routes.
                // Assuming GET /cms/gallery is public or requires simple adjustment. 
                // Currently cmsRoutes.js: router.route('/gallery').get(getGallery) -> It is NOT protected by default in previous step viewing, which is good.
                const { data } = await api.get('/cms/gallery');
                setImages(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchGallery();
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen pt-20 pb-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 font-serif mb-4">Campus Gallery</h1>
                    <p className="text-lg text-gray-600">Glimpses of life at ISBM School</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {images.map((img, index) => (
                        <motion.div
                            key={img._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                        >
                            <div className="h-64 overflow-hidden">
                                <img src={img.imageUrl} alt={img.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-800">{img.title}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {images.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500">No images available in the gallery.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicGallery;
