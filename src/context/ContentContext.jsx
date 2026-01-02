import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const ContentContext = createContext();

export const useContent = () => {
    return useContext(ContentContext);
};

const DEFAULT_CONTENT = {
    home: {
        heroTitle1: 'Eat',
        heroTitle2: '&',
        heroTitle3: 'Out',
        heroSubtitle: 'Food is Happiness',
        heroDescription: 'Experience premium casual dining with authentic North Indian, Punjabi, Chinese, and Fast Food in the heart of Sri Muktsar Sahib.',
        ctaButton1: 'View Menu',
        ctaButton2: 'Book a Table',
        popularDishesTitle: 'Popular',
        popularDishesSubtitle: 'Dishes',
        popularDishesText: 'Discover our most loved dishes, crafted with authentic flavors',
        heroBackgroundImage: '/images/MAINPIC.png',
        aboutSectionImage: '/images/MAINPIC1.png'
    },
    about: {
        title: 'About',
        subtitle: 'Eat & Out',
        tagline: 'Food is Happiness',
        welcomeTitle: 'Welcome to Eat & Out',
        description1: 'Located in the vibrant Ranjit Avenue area of Sri Muktsar Sahib, Eat & Out is your destination for premium casual dining. We bring together the best of North Indian, Punjabi, Chinese, and Fast Food cuisines, all under one roof.',
        description2: 'Our restaurant is conveniently situated on Malout Road, near the Bus Stand, opposite Dhaliwal Eye Hospital. Whether you\'re looking for a quick bite or a full-course meal, we have something to satisfy every craving.',
        description3: 'We believe that food is happiness, and every dish we serve is crafted with passion, authentic flavors, and the finest ingredients.',
        image: '/images/MAINPIC2.png'
    },
    gallery: {
        title: 'Our',
        subtitle: 'Gallery',
        description: 'Take a visual journey through our restaurant, dishes, and dining experience.',
        images: ['/images/MAINPIC.png', '/images/MAINPIC1.png', '/images/MAINPIC2.png', '/images/MAINPIC3.png']
    },
    contact: {
        title: 'Contact',
        subtitle: 'Us',
        description: 'Have a question or want to make a reservation? We\'d love to hear from you!',
        email: 'info@eatandout.com',
        phone: '62837-71955',
        locationTitle: 'Location',
        addressLine1: 'Malout Road, Near Bus Stand',
        addressLine2: 'Opposite Dhaliwal Eye Hospital',
        addressLine3: 'Ranjit Avenue',
        addressLine4: 'Sri Muktsar Sahib, Punjab'
    },
    socialLinks: {
        facebook: '',
        instagram: '',
        twitter: ''
    }
};

export const ContentProvider = ({ children }) => {
    const [content, setContent] = useState(DEFAULT_CONTENT);
    const [loading, setLoading] = useState(true);

    const fetchContent = async () => {
        try {
            const res = await api.get('/content');
            if (res.data) {
                // Merge API data with defaults to ensure completeness
                setContent(prev => ({
                    ...prev,
                    ...res.data,
                    home: { ...prev.home, ...(res.data.home || {}) },
                    about: { ...prev.about, ...(res.data.about || {}) },
                    gallery: { ...prev.gallery, ...(res.data.gallery || {}) },
                    contact: { ...prev.contact, ...(res.data.contact || {}) },
                    socialLinks: { ...prev.socialLinks, ...(res.data.socialLinks || {}) },
                }));
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching content:', err);
            // Already initialized with defaults, so we are good
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
        if (!content || !content[section]) {
            return fallback || DEFAULT_CONTENT[section]?.[key] || '';
        }
        return content[section][key] || DEFAULT_CONTENT[section]?.[key] || fallback || '';
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
