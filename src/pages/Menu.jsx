import { useState, useEffect, useRef } from 'react';
import { useContent } from '../context/ContentContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCart } from '../context/CartContext';
import api from '../utils/api';

gsap.registerPlugin(ScrollTrigger);

// Helper to get image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath; // Already absolute

  // In development, use relative path (proxied)
  if (import.meta.env.DEV) {
    return imagePath;
  }

  // In production, prepend backend URL
  // Assumes VITE_API_URL is like 'https://backend.com/api' or 'https://backend.com'
  const apiBase = import.meta.env.VITE_API_URL || '';
  const domain = apiBase.replace(/\/api\/?$/, ''); // Remove trailing /api or /api/
  return `${domain}${imagePath}`;
};

const MenuItemCard = ({ item, addToCart }) => {
  const hasVariants = item.variants && item.variants.length > 0;
  const [selectedVariant, setSelectedVariant] = useState(hasVariants ? item.variants[0] : null);

  const currentPrice = selectedVariant ? selectedVariant.price : item.price;

  return (
    <div className="group bg-primary-black rounded-xl sm:rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
        {item.image ? (
          <img
            src={getImageUrl(item.image)}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-orange to-primary-red flex items-center justify-center">
            <span className="text-6xl">🍽️</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-primary-orange/90 text-white rounded-full text-sm font-semibold">
            ₹{currentPrice}
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-2xl font-display font-bold text-white group-hover:text-primary-orange transition-colors">
            {item.name}
          </h3>
        </div>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {item.description}
        </p>

        {hasVariants && (
          <div className="mb-4">
            <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-2 font-bold">Select Size:</p>
            <div className="flex gap-2">
              {item.variants.map((variant, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedVariant(variant)}
                  className={`px-3 py-1 text-xs rounded-lg border transition-all ${selectedVariant?.name === variant.name
                      ? 'bg-primary text-dark border-primary font-bold'
                      : 'border-gray-700 text-gray-400 hover:border-gray-500'
                    }`}
                >
                  {variant.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="px-3 py-1 bg-primary-orange/20 text-primary-orange rounded-full text-xs font-medium">
            {item.category}
          </span>
          <div className="flex items-center gap-2">
            {item.featured && (
              <span className="px-3 py-1 bg-primary-red/20 text-primary-red rounded-full text-xs font-medium">
                ⭐ Featured
              </span>
            )}
            <button
              onClick={() => addToCart(item, selectedVariant)}
              className="p-2 bg-primary rounded-full text-dark hover:bg-primary-light transition-colors transform active:scale-95"
              title="Add to Cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Menu = () => {
  const { get } = useContent();
  const { addToCart } = useCart();
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const headerRef = useRef(null);
  const categoriesRef = useRef(null);
  const itemsRef = useRef(null);

  useEffect(() => {
    // Fetch categories
    api.get('/categories')
      .then(res => {
        setCategories(res.data);
      })
      .catch(err => {
        console.error('Error fetching categories:', err);
        // Fallback to default categories
        setCategories([
          { displayName: 'Punjabi' },
          { displayName: 'Chinese' },
          { displayName: 'Fast Food' },
          { displayName: 'North Indian' }
        ]);
      });

    // Fetch menu items
    api.get('/menu')
      .then(res => {
        setMenuItems(res.data);
        setFilteredItems(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Filter items by category
    if (selectedCategory === 'All') {
      setFilteredItems(menuItems);
    } else {
      setFilteredItems(menuItems.filter(item => item.category === selectedCategory));
    }
  }, [selectedCategory, menuItems]);

  useEffect(() => {
    // Header animation
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { y: -50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out'
        }
      );
    }

    // Categories animation
    if (categoriesRef.current?.children) {
      const categoryButtons = Array.from(categoriesRef.current.children);
      if (categoryButtons.length > 0) {
        gsap.fromTo(
          categoryButtons,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: 'back.out(1.7)',
            delay: 0.3
          }
        );
      }
    }

    // Menu items animation - only when items are loaded
    if (itemsRef.current && filteredItems.length > 0) {
      const menuItems = Array.from(itemsRef.current.children);
      if (menuItems.length > 0) {
        // Kill existing ScrollTriggers for this element
        ScrollTrigger.getAll().forEach(trigger => {
          if (trigger.vars?.trigger === itemsRef.current) {
            trigger.kill();
          }
        });

        gsap.fromTo(
          menuItems,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.05,
            scrollTrigger: {
              trigger: itemsRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    }

    return () => {
      // Cleanup ScrollTriggers when component unmounts or filteredItems change
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars?.trigger === itemsRef.current) {
          trigger.kill();
        }
      });
    };
  }, [filteredItems]);

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-b from-primary-black to-primary-dark">
      {/* Header */}
      <section className="section-padding">
        <div className="container-custom">
          <div ref={headerRef} className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
              {get('menu', 'title')} <span className="text-gradient">{get('menu', 'subtitle')}</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {get('menu', 'description')}
            </p>
          </div>

          {/* Category Filters */}
          <div ref={categoriesRef} className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12 px-2">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 ${selectedCategory === 'All'
                ? 'bg-primary-orange text-white shadow-lg'
                : 'bg-primary-black text-gray-300 hover:bg-primary-black/80 border border-gray-700'
                }`}
            >
              All
            </button>
            {categories
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((category) => (
                <button
                  key={category._id || category.displayName}
                  onClick={() => setSelectedCategory(category.displayName)}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 ${selectedCategory === category.displayName
                    ? 'bg-primary-orange text-white shadow-lg'
                    : 'bg-primary-black text-gray-300 hover:bg-primary-black/80 border border-gray-700'
                    }`}
                >
                  {category.displayName}
                </button>
              ))}
          </div>

          {/* Menu Items Grid */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-orange"></div>
              <p className="text-gray-400 mt-4">Loading menu...</p>
            </div>
          ) : filteredItems.length > 0 ? (
            <div
              ref={itemsRef}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
            >
              {filteredItems.map((item) => (
                <MenuItemCard key={item._id} item={item} addToCart={addToCart} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 text-xl">No items found in this category.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Menu;
