import { useState, useEffect, useRef } from 'react';
import { useContent } from '../context/ContentContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Gallery = () => {
  const { get } = useContent();
  const [selectedImage, setSelectedImage] = useState(null);
  const headerRef = useRef(null);
  const galleryRef = useRef(null);

  /*
  const images = [
    '/images/MAINPIC.png',
    '/images/MAINPIC1.png',
    '/images/MAINPIC2.png',
    '/images/MAINPIC3.png'
  ];
  */
  // Use dynamic images. Fallback to default if empty.
  const galleryImages = get('gallery', 'images');
  const images = (galleryImages && galleryImages.length > 0) ? galleryImages : [
    '/images/MAINPIC.png',
    '/images/MAINPIC1.png',
    '/images/MAINPIC2.png',
    '/images/MAINPIC3.png'
  ];

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

    // Gallery items animation
    if (galleryRef.current?.children) {
      const children = Array.from(galleryRef.current.children);
      if (children.length > 0) {
        gsap.fromTo(
          children,
          { scale: 0.8, opacity: 0, rotation: -5 },
          {
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: galleryRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const openModal = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-b from-primary-black to-primary-dark">
      {/* Header */}
      <section className="section-padding">
        <div className="container-custom">
          <div ref={headerRef} className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
              {get('gallery', 'title')} <span className="text-gradient">{get('gallery', 'subtitle')}</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {get('gallery', 'description')}
            </p>
          </div>

          {/* Gallery Grid */}
          <div
            ref={galleryRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {images.map((image, index) => (
              <div
                key={index}
                onClick={() => openModal(image)}
                className="group relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <img
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-4xl">🔍</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          onClick={closeModal}
        >
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white text-4xl hover:text-primary-orange transition-colors z-10"
            aria-label="Close modal"
          >
            ×
          </button>
          <img
            src={selectedImage}
            alt="Gallery"
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default Gallery;

