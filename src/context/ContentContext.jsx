import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const ContentContext = createContext();

export const useContent = () => {
    return useContext(ContentContext);
};

export const ContentProvider = ({ children }) => {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchContent = async () => {
        try {
            const res = await api.get('/content');
            setContent(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching content:', err);
            // Fallback to null/default structure if needed, or just let components handle undefined
            setLoading(false);
        }
    };

    const updateContent = async (newContent) => {
        try {
            const res = await api.put('/content', newContent);
            setContent(res.data);
            return res.data;
        } catch (err) {
            console.error('Error updating content:', err);
            throw err;
        }
    };

    useEffect(() => {
        fetchContent();
    }, []);

    // Helper to safely access nested content with fallbacks
    const getHelper = (section, key, fallback = '') => {
        if (!content || !content[section] || !content[section][key]) {
            return fallback;
        }
        return content[section][key];
    };

    const value = {
        content,
        loading,
        updateContent,
        refreshContent: fetchContent,
        get: getHelper
    };

    return (
        <ContentContext.Provider value={value}>
            {children}
        </ContentContext.Provider>
    );
};
