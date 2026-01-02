import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const linksRef = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    // Wait for refs to be ready
    if (!navRef.current || !logoRef.current) {
      return;
    }

    // Animate navbar on mount
    gsap.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    );

    gsap.fromTo(
      logoRef.current,
      { scale: 0, rotation: -180 },
      { scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.7)', delay: 0.2 }
    );

    // Animate links with delay to ensure they're rendered
    setTimeout(() => {
      linksRef.current.forEach((link, index) => {
        if (link) {
          gsap.fromTo(
            link,
            { y: -20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, delay: 0.3 + index * 0.1, ease: 'power2.out' }
          );
        }
      });
    }, 100);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/menu', label: 'Menu' },
    { path: '/about', label: 'About' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/contact', label: 'Contact' }
  ];

  return (
    <>
      {/* Backdrop overlay for mobile menu */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${scrolled || isOpen || location.pathname !== '/'
            ? 'bg-primary-black/98 backdrop-blur-lg shadow-xl border-b border-gray-800/50'
            : 'bg-transparent'
          }`}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16">
          <div className="flex items-center justify-between py-3 sm:py-4 min-h-[60px] sm:min-h-[70px]">
            {/* Logo */}
            <Link
              ref={logoRef}
              to="/"
              className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-gradient whitespace-nowrap z-50 relative hover:scale-105 transition-transform duration-300"
              onClick={() => setIsOpen(false)}
            >
              Eat & Out
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
              {navLinks.map((link, index) => (
                <Link
                  key={link.path}
                  ref={(el) => (linksRef.current[index] = el)}
                  to={link.path}
                  className={`relative font-medium text-sm lg:text-base transition-all duration-300 whitespace-nowrap px-2 py-1 rounded-lg group ${location.pathname === link.path
                      ? 'text-primary-orange'
                      : 'text-white hover:text-primary-orange'
                    }`}
                >
                  <span className="relative z-10">{link.label}</span>
                  {location.pathname === link.path ? (
                    <>
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-orange rounded-full" />
                      <span className="absolute inset-0 bg-primary-orange/10 rounded-lg -z-0" />
                    </>
                  ) : (
                    <span className="absolute inset-0 bg-primary-orange/0 group-hover:bg-primary-orange/10 rounded-lg -z-0 transition-all duration-300" />
                  )}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-white focus:outline-none z-50 p-2 -mr-2 relative"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1.5">
                <span
                  className={`block h-0.5 w-full bg-primary-orange transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''
                    }`}
                />
                <span
                  className={`block h-0.5 w-full bg-primary-orange transition-all duration-300 ${isOpen ? 'opacity-0' : ''
                    }`}
                />
                <span
                  className={`block h-0.5 w-full bg-primary-orange transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''
                    }`}
                />
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden w-full overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0 pointer-events-none'
              }`}
          >
            <div className="w-full px-2 py-3 space-y-1 border-t border-gray-700/50 mt-2 bg-primary-black/50 rounded-b-lg">
              {navLinks.map((link, index) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block w-full py-3 px-4 font-medium text-base transition-all duration-200 rounded-lg transform hover:translate-x-2 ${location.pathname === link.path
                      ? 'text-primary-orange bg-primary-orange/20 border-l-4 border-primary-orange shadow-lg shadow-primary-orange/20'
                      : 'text-white hover:text-primary-orange hover:bg-primary-black/70 hover:border-l-4 hover:border-primary-orange/50'
                    }`}
                  style={{
                    animationDelay: isOpen ? `${index * 0.1}s` : '0s'
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

