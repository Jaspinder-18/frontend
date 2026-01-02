import { useState, useRef, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from '../utils/api';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const { get } = useContent();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const headerRef = useRef(null);
  const formRef = useRef(null);
  const mapRef = useRef(null);

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

    // Form animation
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // Map animation
    if (mapRef.current) {
      gsap.fromTo(
        mapRef.current,
        { x: 50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: mapRef.current,
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Validate form data
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      console.log('Submitting contact form:', formData);
      // Ensure we hit the /api/contact endpoint
      // If VITE_API_URL is root (https://server.com), we need /api/contact
      // If VITE_API_URL includes /api, this might double up, but usually env var is root.
      // Safest is to rely on uniform contract.
      // The previous error showed 404, implying it didn't find the route.
      console.log('Submitting contact form:', formData);
      const response = await api.post('/contact', formData);
      console.log('Contact form success:', response.data);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error('Contact form error:', err);
      console.error('Error response:', err.response);
      // Handle validation errors
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        const errorMessages = err.response.data.errors.map(e => e.msg || e.message).join(', ');
        setError(errorMessages || 'Please check your input and try again.');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to send message. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-b from-primary-black to-primary-dark">
      <section className="section-padding">
        <div className="container-custom">
          {/* Header */}
          <div ref={headerRef} className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
              <span className="text-gradient">{get('contact', 'title')}</span> {get('contact', 'subtitle')}
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {get('contact', 'description')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {/* Contact Form */}
            <div ref={formRef}>
              <form onSubmit={handleSubmit} className="bg-primary-black rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl">
                <div className="mb-6">
                  <label htmlFor="name" className="block text-white font-semibold mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-primary-dark border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary-orange transition-colors"
                    placeholder="Your Name"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="email" className="block text-white font-semibold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-primary-dark border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary-orange transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="phone" className="block text-white font-semibold mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-primary-dark border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary-orange transition-colors"
                    placeholder="Your Phone Number"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="block text-white font-semibold mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 bg-primary-dark border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary-orange transition-colors resize-none"
                    placeholder="Your Message"
                  />
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-400 text-sm">
                    Thank you! Your message has been sent successfully. We'll get back to you soon.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Contact Info & Map */}
            <div ref={mapRef} className="space-y-6 sm:space-y-8">
              {/* Contact Information */}
              <div className="bg-primary-black rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl">
                <h2 className="text-2xl font-display font-bold mb-6 text-white">
                  Get in Touch
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-primary-orange font-semibold mb-2">{get('contact', 'locationTitle')}</h3>
                    <p className="text-gray-300">
                      {get('contact', 'addressLine1')}<br />
                      {get('contact', 'addressLine2')}<br />
                      {get('contact', 'addressLine3')}<br />
                      {get('contact', 'addressLine4')}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-primary-orange font-semibold mb-2">Phone</h3>
                    <a
                      href={`tel:${get('contact', 'phone')}`}
                      className="text-gray-300 hover:text-primary-orange transition-colors"
                    >
                      {get('contact', 'phone')}
                    </a>
                  </div>
                  <div>
                    <h3 className="text-primary-orange font-semibold mb-2">Email</h3>
                    <a
                      href={`mailto:${get('contact', 'email')}`}
                      className="text-gray-300 hover:text-primary-orange transition-colors"
                    >
                      {get('contact', 'email')}
                    </a>
                  </div>
                </div>
              </div>

              {/* Google Map Embed */}
              <div className="bg-primary-black rounded-xl sm:rounded-2xl overflow-hidden shadow-xl">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27511.890156640256!2d74.5183333!3d30.464826999999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391769e3f97e0735%3A0x639d24cd37bc0d7b!2sEat%20and%20out!5e0!3m2!1sen!2sin!4v1767174729314!5m2!1sen!2sin"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Eat and Out Restaurant Location - Malout Road, Near Bus Stand, Opposite Dhaliwal Eye Hospital, Ranjit Avenue, Sri Muktsar Sahib, Punjab"
                  className="w-full sm:h-[400px] lg:h-[450px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

