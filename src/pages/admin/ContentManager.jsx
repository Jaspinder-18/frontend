import { useState, useEffect } from 'react';
import { useContent } from '../../context/ContentContext';
import {
    Save,
    Home,
    Info,
    Image as ImageIcon,
    Mail,
    Share2,
    Loader2,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';

const ContentManager = () => {
    const { content, updateContent, loading } = useContent();
    const [localContent, setLocalContent] = useState(null);
    const [activeTab, setActiveTab] = useState('home');
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (content) {
            setLocalContent(JSON.parse(JSON.stringify(content)));
        }
    }, [content]);

    const handleSave = async () => {
        setIsSaving(true);
        setMessage({ type: '', text: '' });
        try {
            await updateContent(localContent);
            setMessage({ type: 'success', text: 'Content updated successfully!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update content. Please try again.' });
        } finally {
            setIsSaving(false);
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

    if (loading || !localContent) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-gray-400 font-medium">Loading website content...</p>
            </div>
        );
    }

    const tabs = [
        { id: 'home', name: 'Home Hero', icon: <Home size={18} /> },
        { id: 'menu', name: 'Menu Page', icon: <Info size={18} /> },
        { id: 'about', name: 'About Page', icon: <Info size={18} /> },
        { id: 'gallery', name: 'Gallery', icon: <ImageIcon size={18} /> },
        { id: 'contact', name: 'Contact Info', icon: <Mail size={18} /> },
        { id: 'social', name: 'Social Links', icon: <Share2 size={18} /> },
    ];

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-display font-bold text-white">
                        Website <span className="text-primary">Content</span> Editor
                    </h2>
                    <p className="text-gray-400 mt-1">Customize all website text and information dynamically.</p>
                </div>

                <div className="flex items-center gap-4">
                    {message.text && (
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                            {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                            {message.text}
                        </div>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="btn-primary flex items-center gap-2 px-6 py-2.5"
                    >
                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {isSaving ? 'Saving...' : 'Save All Changes'}
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Tabs Sidebar */}
                <aside className="lg:w-64 flex-shrink-0">
                    <nav className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 bg-dark-card p-2 rounded-xl border border-gray-800">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                {tab.icon}
                                <span className="font-medium">{tab.name}</span>
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Content Area */}
                <main className="flex-1 bg-dark-card border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="p-6 md:p-8">
                        {activeTab === 'home' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Home className="text-primary" size={20} />
                                    Hero Section Content
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Hero Title 1 (e.g. "Eat")</label>
                                        <input
                                            type="text"
                                            value={localContent.home?.heroTitle1 || ''}
                                            onChange={e => handleChange('home', 'heroTitle1', e.target.value)}
                                            className="w-full bg-dark-lighter border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Hero Title 2 (e.g. "&")</label>
                                        <input
                                            type="text"
                                            value={localContent.home?.heroTitle2 || ''}
                                            onChange={e => handleChange('home', 'heroTitle2', e.target.value)}
                                            className="w-full bg-dark-lighter border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Hero Title 3 (e.g. "Out")</label>
                                        <input
                                            type="text"
                                            value={localContent.home?.heroTitle3 || ''}
                                            onChange={e => handleChange('home', 'heroTitle3', e.target.value)}
                                            className="w-full bg-dark-lighter border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Hero Subtitle</label>
                                    <input
                                        type="text"
                                        value={localContent.home?.heroSubtitle || ''}
                                        onChange={e => handleChange('home', 'heroSubtitle', e.target.value)}
                                        className="w-full bg-dark-lighter border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Hero Description</label>
                                    <textarea
                                        rows="3"
                                        value={localContent.home?.heroDescription || ''}
                                        onChange={e => handleChange('home', 'heroDescription', e.target.value)}
                                        className="w-full bg-dark-lighter border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-800">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Primary Button Text</label>
                                        <input
                                            type="text"
                                            value={localContent.home?.ctaButton1 || ''}
                                            onChange={e => handleChange('home', 'ctaButton1', e.target.value)}
                                            className="w-full bg-dark-lighter border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Secondary Button Text</label>
                                        <input
                                            type="text"
                                            value={localContent.home?.ctaButton2 || ''}
                                            onChange={e => handleChange('home', 'ctaButton2', e.target.value)}
                                            className="w-full bg-dark-lighter border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6 pt-4 border-t border-gray-800">
                                    <h4 className="font-semibold text-white">Popular Dishes Section</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">Section Title (e.g. "Popular")</label>
                                            <input
                                                type="text"
                                                value={localContent.home?.popularDishesTitle || ''}
                                                onChange={e => handleChange('home', 'popularDishesTitle', e.target.value)}
                                                className="w-full bg-dark-lighter border border-gray-700 rounded-lg px-4 py-2.5 text-white"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">Section Subtitle (e.g. "Dishes")</label>
                                            <input
                                                type="text"
                                                value={localContent.home?.popularDishesSubtitle || ''}
                                                onChange={e => handleChange('home', 'popularDishesSubtitle', e.target.value)}
                                                className="w-full bg-dark-lighter border border-gray-700 rounded-lg px-4 py-2.5 text-white"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Section Description</label>
                                        <textarea
                                            rows="2"
                                            value={localContent.home?.popularDishesText || ''}
                                            onChange={e => handleChange('home', 'popularDishesText', e.target.value)}
                                            className="w-full bg-dark-lighter border border-gray-700 rounded-lg px-4 py-2.5 text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'menu' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Info className="text-primary" size={20} />
                                    Menu Page Content
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Page Title (e.g. "Our")</label>
                                        <input
                                            type="text"
                                            value={localContent.menu?.title || ''}
                                            onChange={e => handleChange('menu', 'title', e.target.value)}
                                            className="w-full bg-dark-lighter border border-gray-700 rounded-lg px-4 py-2.5 text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Page Subtitle (e.g. "Menu")</label>
                                        <input
                                            type="text"
                                            value={localContent.menu?.subtitle || ''}
                                            onChange={e => handleChange('menu', 'subtitle', e.target.value)}
                                            className="w-full bg-dark-lighter border border-gray-700 rounded-lg px-4 py-2.5 text-white"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Page Description</label>
                                    <textarea
                                        rows="3"
                                        value={localContent.menu?.description || ''}
                                        onChange={e => handleChange('menu', 'description', e.target.value)}
                                        className="w-full bg-dark-lighter border border-gray-700 rounded-lg px-4 py-2.5 text-white"
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === 'about' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Info className="text-primary" size={20} />
                                    About Page Content
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Main Title</label>
                                        <input
                                            type="text"
                                            value={localContent.about?.title || ''}
                                            onChange={e => handleChange('about', 'title', e.target.value)}
                                            className="w-full bg-dark-lighter border border-gray-700 rounded-lg px-4 py-2.5 text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Subtitle</label>
                                        <input
                                            type="text"
                                            value={localContent.about?.subtitle || ''}
                                            onChange={e => handleChange('about', 'subtitle', e.target.value)}
                                            className="w-full bg-dark-lighter border border-gray-700 rounded-lg px-4 py-2.5 text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Tagline</label>
                                        <input
                                            type="text"
                                            value={localContent.about?.tagline || ''}
                                            onChange={e => handleChange('about', 'tagline', e.target.value)}
                                            className="w-full bg-dark-lighter border border-gray-700 rounded-lg px-4 py-2.5 text-white"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Welcome Title (H2)</label>
                                    <input
                                        type="text"
                                        value={localContent.about?.welcomeTitle || ''}
                                        onChange={e => handleChange('about', 'welcomeTitle', e.target.value)}
                                        className="w-full bg-dark-lighter border border-gray-700 rounded-lg px-4 py-2.5 text-white"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Description Paragraph 1</label>
                                        <textarea
                                            rows="3"
                                            value={localContent.about?.description1 || ''}
                                            onChange={e => handleChange('about', 'description1', e.target.value)}
                                            className="w-full bg-dark-lighter border border-gray-700 rounded-lg px-4 py-2.5 text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Description Paragraph 2</label>
                                        <textarea
                                            rows="3"
                                            value={localContent.about?.description2 || ''}
                                            onChange={e => handleChange('about', 'description2', e.target.value)}
                                            className="w-full bg-dark-lighter border border-gray-700 rounded-lg px-4 py-2.5 text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Description Paragraph 3</label>
                                        <textarea
                                            rows="3"
                                            value={localContent.about?.description3 || ''}
                                            onChange={e => handleChange('about', 'description3', e.target.value)}
                                            className="w-full bg-dark-lighter border border-gray-700 rounded-lg px-4 py-2.5 text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'gallery' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <ImageIcon className="text-primary" size={20} />
                                    Gallery Page Content
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Gallery Title</label>
                                        <input
                                            type="text"
                                            value={localContent.gallery?.title || ''}
                                            onChange={e => handleChange('gallery', 'title', e.target.value)}
                                            className="w-full bg-dark-lighter border border-gray-700 rounded-lg px-4 py-2.5 text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Gallery Subtitle</label>
                                        <input
                                            type="text"
                                            value={localContent.gallery?.subtitle || ''}
                                            onChange={e => handleChange('gallery', 'subtitle', e.target.value)}
                                            className="w-full bg-dark-lighter border border-gray-700 rounded-lg px-4 py-2.5 text-white"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Section Description</label>
                                    <textarea
                                        rows="3"
                                        value={localContent.gallery?.description || ''}
                                        onChange={e => handleChange('gallery', 'description', e.target.value)}
                                        className="w-full bg-dark-lighter border border-gray-700 rounded-lg px-4 py-2.5 text-white"
                                    />
                                </div>

                                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                                    <p className="text-sm text-primary-cream">
                                        <strong>Note:</strong> Gallery images are currently managed through the theme assets. Contact developers to change specific background images.
                                    </p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'contact' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Mail className="text-primary" size={20} />
                                    Contact Page & Information
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Page Title</label>
                                        <input
                                            type="text"
                                            value={localContent.contact?.title || ''}
                                            onChange={e => handleChange('contact', 'title', e.target.value)}
                                            className="w-full bg-dark-lighter border border-gray-700 rounded-lg px-4 py-2.5 text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Page Subtitle</label>
                                        <input
                                            type="text"
                                            value={localContent.contact?.subtitle || ''}
                                            onChange={e => handleChange('contact', 'subtitle', e.target.value)}
                                            className="w-full bg-dark-lighter border border-gray-700 rounded-lg px-4 py-2.5 text-white"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Intro Description</label>
                                    <textarea
                                        rows="2"
                                        value={localContent.contact?.description || ''}
                                        onChange={e => handleChange('contact', 'description', e.target.value)}
                                        className="w-full bg-dark-lighter border border-gray-700 rounded-lg px-4 py-2.5 text-white"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-800">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Email Address</label>
                                        <input
                                            type="email"
                                            value={localContent.contact?.email || ''}
                                            onChange={e => handleChange('contact', 'email', e.target.value)}
                                            className="w-full bg-dark-lighter border border-gray-700 rounded-lg px-4 py-2.5 text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Phone Number</label>
                                        <input
                                            type="text"
                                            value={localContent.contact?.phone || ''}
                                            onChange={e => handleChange('contact', 'phone', e.target.value)}
                                            className="w-full bg-dark-lighter border border-gray-700 rounded-lg px-4 py-2.5 text-white"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-gray-800">
                                    <h4 className="font-semibold text-white">Full Address</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">Address Line 1</label>
                                            <input
                                                type="text"
                                                value={localContent.contact?.addressLine1 || ''}
                                                onChange={e => handleChange('contact', 'addressLine1', e.target.value)}
                                                className="w-full bg-dark-lighter border border-gray-700 rounded-lg px-4 py-2.5 text-white"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">Address Line 2</label>
                                            <input
                                                type="text"
                                                value={localContent.contact?.addressLine2 || ''}
                                                onChange={e => handleChange('contact', 'addressLine2', e.target.value)}
                                                className="w-full bg-dark-lighter border border-gray-700 rounded-lg px-4 py-2.5 text-white"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">Address Line 3</label>
                                            <input
                                                type="text"
                                                value={localContent.contact?.addressLine3 || ''}
                                                onChange={e => handleChange('contact', 'addressLine3', e.target.value)}
                                                className="w-full bg-dark-lighter border border-gray-700 rounded-lg px-4 py-2.5 text-white"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">Address Line 4</label>
                                            <input
                                                type="text"
                                                value={localContent.contact?.addressLine4 || ''}
                                                onChange={e => handleChange('contact', 'addressLine4', e.target.value)}
                                                className="w-full bg-dark-lighter border border-gray-700 rounded-lg px-4 py-2.5 text-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'social' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Share2 className="text-primary" size={20} />
                                    Social Media Links
                                </h3>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Facebook URL</label>
                                        <div className="flex">
                                            <span className="inline-flex items-center px-4 bg-dark border border-r-0 border-gray-700 rounded-l-lg text-gray-500 text-sm">facebook.com/</span>
                                            <input
                                                type="text"
                                                value={localContent.socialLinks?.facebook || ''}
                                                onChange={e => handleChange('socialLinks', 'facebook', e.target.value)}
                                                className="flex-1 bg-dark-lighter border border-gray-700 rounded-r-lg px-4 py-2.5 text-white focus:border-primary outline-none"
                                                placeholder="username"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Instagram URL</label>
                                        <div className="flex">
                                            <span className="inline-flex items-center px-4 bg-dark border border-r-0 border-gray-700 rounded-l-lg text-gray-500 text-sm">instagram.com/</span>
                                            <input
                                                type="text"
                                                value={localContent.socialLinks?.instagram || ''}
                                                onChange={e => handleChange('socialLinks', 'instagram', e.target.value)}
                                                className="flex-1 bg-dark-lighter border border-gray-700 rounded-r-lg px-4 py-2.5 text-white focus:border-primary outline-none"
                                                placeholder="username"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Twitter URL</label>
                                        <div className="flex">
                                            <span className="inline-flex items-center px-4 bg-dark border border-r-0 border-gray-700 rounded-l-lg text-gray-500 text-sm">twitter.com/</span>
                                            <input
                                                type="text"
                                                value={localContent.socialLinks?.twitter || ''}
                                                onChange={e => handleChange('socialLinks', 'twitter', e.target.value)}
                                                className="flex-1 bg-dark-lighter border border-gray-700 rounded-r-lg px-4 py-2.5 text-white focus:border-primary outline-none"
                                                placeholder="username"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ContentManager;
