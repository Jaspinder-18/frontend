import { useEffect, useRef } from 'react';
import { useContent } from '../context/ContentContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const { get } = useContent();
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const imageRef = useRef(null);
  const valuesRef = useRef(null);

  useEffect(() => {
    // Hero animation
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out'
        }
      );
    }

    // Content animation
    if (contentRef.current?.children) {
      const children = Array.from(contentRef.current.children);
      if (children.length > 0) {
        gsap.fromTo(
          children,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            scrollTrigger: {
              trigger: contentRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    }

    // Image animation
    if (imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { scale: 0.8, opacity: 0, rotation: -5 },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: imageRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // Values animation
    if (valuesRef.current?.children) {
      const children = Array.from(valuesRef.current.children);
      if (children.length > 0) {
        gsap.fromTo(
          children,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            scrollTrigger: {
              trigger: valuesRef.current,
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

  const values = [
    {
      icon: '🍽️',
      title: 'Authentic Flavors',
      description: 'We use traditional recipes and fresh ingredients to bring you authentic flavors.'
    },
    {
      icon: '❤️',
      title: 'Made with Love',
      description: 'Every dish is prepared with passion and care, ensuring the best dining experience.'
    },
    {
      icon: '🌟',
      title: 'Premium Quality',
      description: 'We maintain the highest standards of quality in every aspect of our service.'
    },
    {
      icon: '🤝',
      title: 'Customer First',
      description: 'Your satisfaction is our priority. We strive to exceed your expectations.'
    }
  ];

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-b from-primary-black to-primary-dark">
      {/* Hero Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div ref={heroRef} className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              {get('about', 'title')} <span className="text-gradient">{get('about', 'subtitle')}</span>
            </h1>
            <p className="text-2xl text-primary-cream font-medium">
              {get('about', 'tagline')}
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center mb-12 sm:mb-20">
            <div ref={contentRef}>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-4 sm:mb-6 text-white">
                {get('about', 'welcomeTitle')}
              </h2>
              <p className="text-gray-300 text-base sm:text-lg mb-3 sm:mb-4 leading-relaxed">
                {get('about', 'description1')}
              </p>
              <p className="text-gray-300 text-lg mb-4 leading-relaxed">
                {get('about', 'description2')}
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                {get('about', 'description3')}
              </p>
            </div>
            <div ref={imageRef} className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={get('about', 'image') || '/images/MAINPIC2.png'}
                alt="Eat and Out Restaurant Interior"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Location Info */}
          <div className="bg-primary-black rounded-2xl p-8 md:p-12 mb-20">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-center">
              <span className="text-gradient">Visit</span> Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-primary-orange mb-4">{get('contact', 'locationTitle')}</h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {get('contact', 'addressLine1')}<br />
                  {get('contact', 'addressLine2')}<br />
                  {get('contact', 'addressLine3')}<br />
                  {get('contact', 'addressLine4')}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-primary-orange mb-4">Contact</h3>
                <p className="text-gray-300 text-lg">
                  Phone: <a href={`tel:${get('contact', 'phone')}`} className="text-primary-orange hover:underline">{get('contact', 'phone')}</a>
                </p>
              </div>
            </div>
          </div>

          {/* Our Values */}
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-8 sm:mb-12 text-center">
              Our <span className="text-gradient">Values</span>
            </h2>
            <div
              ref={valuesRef}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
            >
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-primary-black rounded-xl p-6 text-center hover:bg-primary-black/80 transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="text-5xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-display font-bold mb-3 text-white">
                    {value.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

