import { useState, useEffect } from 'react';
import api from '../../services/api';
import { FiEdit2, FiSave, FiMonitor } from 'react-icons/fi';
import LoadingSpinner from '../../components/LoadingSpinner';

const SECTIONS = [
    { id: 'home-hero', name: 'Home: Hero Section', defaultTitle: 'Welcome to ISBM', defaultSubtitle: 'Empowering future leaders through excellence in education', defaultImg: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop' },
    { id: 'home-about', name: 'Home: About Section', defaultTitle: 'About Our School', defaultBody: 'ISBM creates a supportive environment...', defaultImg: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop' },
    { id: 'admissions-info', name: 'Admissions: Info', defaultTitle: 'Join Our Community', defaultBody: 'Admissions are open for 2024...', defaultImg: '' }
];

const WebsiteContent = () => {
    const [contents, setContents] = useState({}); // Map: section -> contentObj
    const [loading, setLoading] = useState(true);
    const [editingSection, setEditingSection] = useState(null);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const { data } = await api.get('/cms/content');
            // Convert array to map
            const contentMap = {};
            data.forEach(c => contentMap[c.section] = c);
            setContents(contentMap);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleEdit = (sectionId) => {
        const existing = contents[sectionId];
        const defaultSec = SECTIONS.find(s => s.id === sectionId);

        setFormData({
            title: existing?.title || defaultSec.defaultTitle || '',
            subtitle: existing?.subtitle || defaultSec.defaultSubtitle || '',
            body: existing?.body || defaultSec.defaultBody || '',
            imageUrl: existing?.imageUrl || defaultSec.defaultImg || ''
        });
        setEditingSection(sectionId);
    };

    const handleSave = async () => {
        try {
            const { data } = await api.put(`/cms/content/${editingSection}`, formData);
            setContents(prev => ({ ...prev, [editingSection]: data }));
            setEditingSection(null);
            alert('Section updated successfully!');
        } catch (error) {
            alert('Failed to update section');
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Website Content Manager</h1>
            <p className="text-gray-500 dark:text-gray-400">Edit the public facing content of your website instantly.</p>

            <div className="grid gap-6">
                {SECTIONS.map(sec => {
                    const content = contents[sec.id];
                    return (
                        <div key={sec.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                            <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-900/50">
                                <h3 className="font-bold text-lg dark:text-white flex items-center gap-2">
                                    <FiMonitor /> {sec.name}
                                </h3>
                                <button
                                    onClick={() => handleEdit(sec.id)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm flex items-center gap-2"
                                >
                                    <FiEdit2 /> Edit
                                </button>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Title</p>
                                    <h4 className="text-xl font-bold mb-2 dark:text-white">{content?.title || sec.defaultTitle || 'Default Title'}</h4>

                                    {sec.defaultSubtitle && (
                                        <>
                                            <p className="text-xs font-bold text-gray-400 uppercase mb-1 mt-4">Subtitle</p>
                                            <p className="text-gray-600 dark:text-gray-300">{content?.subtitle || sec.defaultSubtitle || 'Default Subtitle'}</p>
                                        </>
                                    )}

                                    {sec.defaultBody && (
                                        <>
                                            <p className="text-xs font-bold text-gray-400 uppercase mb-1 mt-4">Body Text</p>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">{content?.body || sec.defaultBody || 'Default Body'}</p>
                                        </>
                                    )}
                                </div>
                                {(content?.imageUrl || sec.defaultImg) && (
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Image Preview</p>
                                        <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                                            <img
                                                src={content?.imageUrl || sec.defaultImg}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Edit Modal */}
            {editingSection && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6 dark:text-white">Edit {SECTIONS.find(s => s.id === editingSection)?.name}</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1 dark:text-gray-300">Title</label>
                                <input
                                    className="w-full p-2 border rounded dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                                    value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            {SECTIONS.find(s => s.id === editingSection)?.defaultSubtitle !== undefined && (
                                <div>
                                    <label className="block text-sm font-semibold mb-1 dark:text-gray-300">Subtitle</label>
                                    <input
                                        className="w-full p-2 border rounded dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                                        value={formData.subtitle} onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                                    />
                                </div>
                            )}

                            {SECTIONS.find(s => s.id === editingSection)?.defaultBody !== undefined && (
                                <div>
                                    <label className="block text-sm font-semibold mb-1 dark:text-gray-300">Body Text</label>
                                    <textarea
                                        rows="4"
                                        className="w-full p-2 border rounded dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                                        value={formData.body} onChange={e => setFormData({ ...formData, body: e.target.value })}
                                    />
                                </div>
                            )}

                            {SECTIONS.find(s => s.id === editingSection)?.defaultImg !== undefined && (
                                <div>
                                    <label className="block text-sm font-semibold mb-1 dark:text-gray-300">Image URL</label>
                                    <input
                                        className="w-full p-2 border rounded dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                                        value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Paste a URL from Unsplash or your uploads.</p>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end gap-2 mt-8">
                            <button onClick={() => setEditingSection(null)} className="px-4 py-2 text-gray-500">Cancel</button>
                            <button onClick={handleSave} className="bg-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-purple-700">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WebsiteContent;
