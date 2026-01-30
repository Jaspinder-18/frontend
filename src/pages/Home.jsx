import { useEffect, useRef, useState } from 'react';
import { useContent } from '../context/ContentContext';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ThreeFood from '../components/ThreeFood';
import api from '../utils/api';
import { getImageUrl } from '../utils/imageHelper';
import OfferPopup from '../components/OfferPopup';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const threeRef = useRef(null);
  const aboutRef = useRef(null);
  const dishesRef = useRef(null);
  const { get } = useContent();
  const [popularDishes, setPopularDishes] = useState([]);

  useEffect(() => {
    // Fetch popular dishes
    api.get('/menu?featured=true').then(res => {
      const featured = res.data.slice(0, 6);
      if (featured.length === 0) {
        // If no featured items, get all items
        api.get('/menu').then(res => {
          setPopularDishes(res.data.slice(0, 6));
        }).catch(err => console.error(err));
      } else {
        setPopularDishes(featured);
      }
    }).catch(err => {
      console.error(err);
      // Fallback to all items
      api.get('/menu').then(res => {
        setPopularDishes(res.data.slice(0, 6));
      }).catch(err => console.error(err));
    });
  }, []);

  useEffect(() => {
    // Wait for refs to be ready
    if (!titleRef.current || !subtitleRef.current || !ctaRef.current || !threeRef.current) {
      return;
    }

    // Hero animations
    const tl = gsap.timeline();

    tl.fromTo(
      titleRef.current,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    )
      .fromTo(
        subtitleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        '-=0.5'
      )
      .fromTo(
        ctaRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' },
        '-=0.3'
      )
      .fromTo(
        threeRef.current,
        { scale: 0, rotation: -180, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 1.2, ease: 'elastic.out(1, 0.5)' },
        '-=0.8'
      );

    // Parallax effect on scroll
    if (threeRef.current && heroRef.current) {
      gsap.to(threeRef.current, {
        y: -100,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      });
    }

    // About section animation
    if (aboutRef.current) {
      gsap.fromTo(
        aboutRef.current,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: aboutRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  useEffect(() => {
    // Popular dishes animation - only when dishes are loaded
    if (!dishesRef.current || popularDishes.length === 0) {
      return;
    }

    const children = Array.from(dishesRef.current.children);
    if (children.length === 0) return;

    gsap.fromTo(
      children,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        scrollTrigger: {
          trigger: dishesRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars?.trigger === dishesRef.current) {
          trigger.kill();
        }
      });
    };
  }, [popularDishes]);

  return (
    <div className="overflow-hidden">
      <OfferPopup />
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-primary-black via-primary-dark to-primary-black"
      >
        {/* Background Image Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url(${get('home', 'heroBackgroundImage') || '/images/MAINPIC.png'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-4 sm:left-10 w-48 h-48 sm:w-72 sm:h-72 bg-primary-orange rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-40 right-4 sm:right-10 w-48 h-48 sm:w-72 sm:h-72 bg-primary-red rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-1/2 w-48 h-48 sm:w-72 sm:h-72 bg-primary-gold rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        <div className="container-custom relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              <h1
                ref={titleRef}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold mb-4 sm:mb-6"
              >
                <span className="text-white">{get('home', 'heroTitle1')}</span>{' '}
                <span className="text-gradient">{get('home', 'heroTitle2')}</span>{' '}
                <span className="text-white">{get('home', 'heroTitle3')}</span>
              </h1>
              <p
                ref={subtitleRef}
                className="text-xl sm:text-2xl md:text-3xl text-primary-cream mb-3 sm:mb-4 font-medium"
              >
                {get('home', 'heroSubtitle')}
              </p>
              <p
                ref={subtitleRef}
                className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0 px-2 sm:px-0"
              >
                {get('home', 'heroDescription')}
              </p>
              <div ref={ctaRef} className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Link to="/menu" className="btn-primary text-center text-sm sm:text-base py-2.5 sm:py-3 px-6 sm:px-8">
                  {get('home', 'ctaButton1')}
                </Link>
                <Link to="/contact" className="btn-secondary text-center text-sm sm:text-base py-2.5 sm:py-3 px-6 sm:px-8">
                  {get('home', 'ctaButton2')}
                </Link>
              </div>
            </div>

            {/* Right - 3D Model */}
            <div ref={threeRef} className="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] order-1 lg:order-2">
              <ThreeFood />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary-orange rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary-orange rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="section-padding bg-primary-black">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                <span className="text-gradient">{get('about', 'subtitle')}</span> {get('about', 'subtitle').toLowerCase() === 'eat & out' ? '' : 'Us'}
              </h2>
              <p className="text-gray-300 text-lg mb-4 leading-relaxed">
                {get('about', 'description1')}
              </p>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                {get('about', 'description2')}
              </p>
              <Link to="/about" className="btn-primary inline-block">
                Learn More
              </Link>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={get('home', 'aboutSectionImage') || '/images/MAINPIC1.png'}
                alt="Eat and Out Restaurant"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Dishes Section */}
      <section className="section-padding bg-gradient-to-b from-primary-black to-primary-dark">
        <div className="container-custom">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-center mb-4">
            <span className="text-gradient">{get('home', 'popularDishesTitle')}</span> {get('home', 'popularDishesSubtitle')}
          </h2>
          <p className="text-gray-400 text-center mb-8 sm:mb-12 text-base sm:text-lg px-4">
            {get('home', 'popularDishesText')}
          </p>

          {popularDishes.length > 0 ? (
            <div
              ref={dishesRef}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
            >
              {popularDishes.map((dish, index) => (
                <div
                  key={dish._id}
                  className="group relative bg-primary-black rounded-xl sm:rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                    {dish.image ? (
                      <img
                        src={getImageUrl(dish.image)}
                        alt={dish.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-orange to-primary-red flex items-center justify-center">
                        <span className="text-4xl">🍽️</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-display font-bold text-white mb-1">
                        {dish.name}
                      </h3>
                      <p className="text-primary-orange font-semibold text-xl">
                        {dish.variants && dish.variants.length > 0
                          ? `₹${dish.variants[0].price}+`
                          : `₹${dish.price}`}
                      </p>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {dish.description}
                    </p>
                    <span className="inline-block px-3 py-1 bg-primary-orange/20 text-primary-orange rounded-full text-sm font-medium">
                      {dish.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading popular dishes...</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/menu" className="btn-primary">
              View Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
      <section className="section-padding bg-primary-black relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-red/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-gold/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="container-custom relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 bg-gradient-to-r from-dark-card to-dark border border-white/5 rounded-3xl p-8 md:p-12 overflow-hidden">
            <div className="w-full md:w-1/2 space-y-6">
              <span className="text-primary-orange font-bold tracking-wider uppercase text-sm">Special Deal</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">
                Taste the Legend <br />
                <span className="text-gradient">Get 20% Off</span>
              </h2>
              <p className="text-gray-400 text-lg">
                Book a table now and enjoy a generous discount on our premium thalis and signature dishes. Limited time offer!
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/contact" className="btn-primary">
                  Book a Table
                </Link>
                <Link to="/menu" className="btn-secondary">
                  Order Online
                </Link>
              </div>
            </div>

            <div className="w-full md:w-1/2 relative h-[300px] md:h-[400px]">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-orange/20 to-transparent rounded-full animate-pulse" />
              <img
                src="/images/MAINPIC.png"
                alt="Special Offer Dish"
                className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-dark">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              What Our <span className="text-gradient">Guests Say</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              We take pride in serving our customers. Here's what they have to share about their dining experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Rajesh Kumar",
                role: "Food Blogger",
                image: "https://randomuser.me/api/portraits/men/32.jpg",
                text: "The ambiance is stunning, and the food is absolutely authentic. The Butter Chicken is a must-try! Highly recommended for family dinners."
              },
              {
                name: "Priya Sharma",
                role: "Frequent Visitor",
                image: "https://randomuser.me/api/portraits/women/44.jpg",
                text: "Best place in town for North Indian cuisine. The service is impeccable, and the staff is very courteous. Love the vibe!"
              },
              {
                name: "Amit Patel",
                role: "Foodie",
                image: "https://randomuser.me/api/portraits/men/86.jpg",
                text: "A hidden gem! The presentation of the dishes is top-notch, and the flavors are spot on. Definitely coming back for more."
              }
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-dark-card p-8 rounded-2xl border border-white/5 hover:border-primary-orange/30 transition-all duration-300 hover:-translate-y-2 shadow-xl"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-primary-orange"
                  />
                  <div>
                    <h4 className="text-white font-bold text-lg">{testimonial.name}</h4>
                    <p className="text-primary-orange text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="mb-6">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-gray-400 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter / CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-dark to-primary-black border-t border-white/5">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Subscribe to Our <span className="text-gradient">Newsletter</span>
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Stay updated with our latest menu additions, special offers, and exclusive events.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-grow px-6 py-4 bg-dark/50 border border-gray-700 rounded-full text-white focus:outline-none focus:border-primary-orange transition-colors"
                required
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div >
  );
};

export default Home;
