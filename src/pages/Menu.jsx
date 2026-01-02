import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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

const Menu = () => {
  // ... existing code ...
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
                        ₹{item.price}
                      </span>
                    </div>
                  </div >
  <div className="p-6">
    <div className="flex items-start justify-between mb-2">
      <h3 className="text-2xl font-display font-bold text-white group-hover:text-primary-orange transition-colors">
        {item.name}
      </h3>
    </div>
    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
      {item.description}
    </p>
    <div className="flex items-center justify-between">
      <span className="px-3 py-1 bg-primary-orange/20 text-primary-orange rounded-full text-xs font-medium">
        {item.category}
      </span>
      {item.featured && (
        <span className="px-3 py-1 bg-primary-red/20 text-primary-red rounded-full text-xs font-medium">
          ⭐ Featured
        </span>
      )}
    </div>
  </div>
                </div >
              ))}
            </div >
          ) : (
  <div className="text-center py-20">
    <p className="text-gray-400 text-xl">No items found in this category.</p>
  </div>
)}
        </div >
      </section >
    </div >
  );
};

export default Menu;

