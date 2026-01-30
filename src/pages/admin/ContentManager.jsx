import { useState, useEffect } from 'react';
import { useContent } from '../../context/ContentContext';

const ContentManager = () => {
    const { content, updateContent, loading } = useContent();
    const [localContent, setLocalContent] = useState(null);

    useEffect(() => {
        if (content) {
            setLocalContent(JSON.parse(JSON.stringify(content)));
        }
    }, [content]);

    const handleSave = async () => {
        try {
            await updateContent(localContent);
            alert('Content updated successfully!');
        } catch (err) {
            alert('Error updating content');
        }
    };

    const handleChange = (section, field, value) => {
        setLocalContent(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    if (loading || !localContent) return <div>Loading content...</div>;

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-display font-bold text-white">Website <span className="text-primary">Content</span></h2>
                <button onClick={handleSave} className="btn-primary">Save Changes</button>
            </div>

            <div className="space-y-8">
                {/* Home Hero */}
                <section className="bg-dark-card border border-gray-800 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4 text-white">Home - Hero Section</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Title</label>
                            <input
                                type="text"
                                value={localContent.home?.heroTitle || ''}
                                onChange={e => handleChange('home', 'heroTitle', e.target.value)}
                                className="input-field w-full bg-dark-lighter border-gray-700 rounded-lg p-2 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Subtitle</label>
                            <input
                                type="text"
                                value={localContent.home?.heroSubtitle || ''}
                                onChange={e => handleChange('home', 'heroSubtitle', e.target.value)}
                                className="input-field w-full bg-dark-lighter border-gray-700 rounded-lg p-2 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Button Text</label>
                            <input
                                type="text"
                                value={localContent.home?.heroButtonText || ''}
                                onChange={e => handleChange('home', 'heroButtonText', e.target.value)}
                                className="input-field w-full bg-dark-lighter border-gray-700 rounded-lg p-2 text-white"
                            />
                        </div>
                    </div>
                </section>

                {/* About */}
                <section className="bg-dark-card border border-gray-800 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4 text-white">About Section</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Title</label>
                            <input
                                type="text"
                                value={localContent.about?.title || ''}
                                onChange={e => handleChange('about', 'title', e.target.value)}
                                className="input-field w-full bg-dark-lighter border-gray-700 rounded-lg p-2 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Description</label>
                            <textarea
                                value={localContent.about?.description || ''}
                                onChange={e => handleChange('about', 'description', e.target.value)}
                                className="input-field w-full bg-dark-lighter border-gray-700 rounded-lg p-2 text-white h-32"
                            />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ContentManager;
