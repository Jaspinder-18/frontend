import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const { get } = useContent();
  const footerRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current && footerRef.current) {
      gsap.fromTo(
        contentRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars?.trigger === footerRef.current) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <footer ref={footerRef} className="bg-primary-black border-t border-gray-800">
      <div ref={contentRef} className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-2xl font-display font-bold text-primary-orange mb-4">
              {get('home', 'heroTitle1')} & {get('home', 'heroTitle3')}
            </h3>
            <p className="text-gray-400 mb-4">
              {get('home', 'heroDescription')}
            </p>
            <p className="text-primary-cream font-semibold">
              {get('home', 'heroSubtitle')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-display font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary-orange transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" className="text-gray-400 hover:text-primary-orange transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-primary-orange transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-400 hover:text-primary-orange transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-primary-orange transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-gray-400 hover:text-primary-orange transition-colors">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-display font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-gray-400">
              <p>
                <span className="text-primary-orange">Location:</span><br />
                {get('contact', 'addressLine1')}<br />
                {get('contact', 'addressLine2')}<br />
                {get('contact', 'addressLine3')}<br />
                {get('contact', 'addressLine4')}
              </p>
              <p>
                <span className="text-primary-orange">Phone:</span> {get('contact', 'phone')}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Eat & Out. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

