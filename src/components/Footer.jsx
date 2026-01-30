import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { motion } from 'framer-motion';

const Footer = () => {
  const { get } = useContent();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <footer className="bg-dark pt-16 md:pt-24 border-t border-white/5 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />

      <div className="container-custom section-padding relative z-10">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Brand Section */}
          <motion.div variants={item} className="space-y-6">
            <h3 className="text-3xl font-display font-bold text-gradient">
              Eat & Out
            </h3>
            <p className="text-gray-400 leading-relaxed">
              {get('home', 'heroSubtitle') || 'Experience the finest culinary journey with sustainable ingredients and premium service.'}
            </p>
            <div className="flex space-x-4">
              {get('socialLinks', 'facebook') && (
                <a href={`https://facebook.com/${get('socialLinks', 'facebook')}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-dark transition-all duration-300">
                  <span className="sr-only">Facebook</span>
                  <div className="w-4 h-4 bg-current" />
                </a>
              )}
              {get('socialLinks', 'instagram') && (
                <a href={`https://instagram.com/${get('socialLinks', 'instagram')}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-dark transition-all duration-300">
                  <span className="sr-only">Instagram</span>
                  <div className="w-4 h-4 bg-current" />
                </a>
              )}
              {get('socialLinks', 'twitter') && (
                <a href={`https://twitter.com/${get('socialLinks', 'twitter')}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-dark transition-all duration-300">
                  <span className="sr-only">Twitter</span>
                  <div className="w-4 h-4 bg-current" />
                </a>
              )}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={item}>
            <h4 className="text-xl font-display font-semibold mb-6 text-white">Explore</h4>
            <ul className="space-y-4">
              {['Home', 'Menu', 'About', 'Gallery', 'Contact'].map((link) => (
                <li key={link}>
                  <Link
                    to={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
                    className="text-gray-400 hover:text-primary transition-colors flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-primary mr-0 group-hover:mr-2 transition-all duration-300" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={item}>
            <h4 className="text-xl font-display font-semibold mb-6 text-white">Visit Us</h4>
            <div className="space-y-4 text-gray-400">
              <p className="flex items-start">
                <span className="text-primary mr-3 mt-1">📍</span>
                <span>
                  {get('contact', 'addressLine1')}<br />
                  {get('contact', 'addressLine2')}<br />
                  {get('contact', 'addressLine3')}<br />
                  {get('contact', 'addressLine4')}
                </span>
              </p>
              <p className="flex items-center">
                <span className="text-primary mr-3">📞</span>
                {get('contact', 'phone')}
              </p>
              <p className="flex items-center">
                <span className="text-primary mr-3">✉️</span>
                {get('contact', 'email')}
              </p>
            </div>
          </motion.div>

          {/* Opening Hours */}
          <motion.div variants={item}>
            <h4 className="text-xl font-display font-semibold mb-6 text-white">Opening Hours</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex justify-between">
                <span>Mon - Fri</span>
                <span className="text-white">10:00 AM - 11:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sat - Sun</span>
                <span className="text-white">09:00 AM - 12:00 AM</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          className="border-t border-white/5 pt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Eat & Out via Jaspinder-18. All rights reserved.
            <Link to="/admin/login" className="ml-4 hover:text-primary">Admin</Link>
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;

