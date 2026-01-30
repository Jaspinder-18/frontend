import { useState, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useContent } from '../context/ContentContext';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import api from '../utils/api';
import { getImageUrl } from '../utils/imageHelper';

const Checkout = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const { get } = useContent();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zip: '',
        paymentMethod: 'cod' // default to Cash on Delivery
    });
    const [loading, setLoading] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        if (cart.length === 0 && !orderPlaced) {
            navigate('/menu');
        }

        if (containerRef.current) {
            gsap.fromTo(
                containerRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
            );
        }
    }, [cart.length, navigate, orderPlaced]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        try {
            // In a real app, you would send this to the backend
            // await api.post('/orders', { items: cart, ...formData, total: cartTotal });

            console.log('Order Data:', { items: cart, ...formData, total: cartTotal });

            // Artificial delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            setOrderPlaced(true);
            clearCart();
        } catch (err) {
            console.error('Order failed:', err);
        } finally {
            setLoading(false);
        }
    };

    if (orderPlaced) {
        return (
            <div className="min-h-screen pt-24 bg-gradient-to-b from-primary-black to-primary-dark flex items-center justify-center p-4">
                <div className="bg-primary-black/80 backdrop-blur-md p-8 md:p-12 rounded-2xl border border-white/10 text-center max-w-lg w-full shadow-2xl animate-blob">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-display font-bold text-white mb-4">Order Placed!</h2>
                    <p className="text-gray-300 text-lg mb-8">
                        Thank you for your order, <span className="text-primary-orange font-semibold">{formData.firstName}</span>!
                        We've received your order and are preparing it with love.
                    </p>
                    <Link to="/" className="btn-primary inline-block w-full">
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 bg-primary-black relative">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
            </div>

            <div ref={containerRef} className="container-custom relative z-10 py-12">
                <h1 className="text-4xl md:text-5xl font-display font-bold mb-8 text-center">
                    Checkout
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Form Section */}
                    <div>
                        <div className="bg-dark-card rounded-2xl p-6 sm:p-8 border border-white/5">
                            <h2 className="text-2xl font-display font-bold text-white mb-6">Delivery Details</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            required
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="w-full bg-dark/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                            placeholder="John"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            required
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="w-full bg-dark/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-dark/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full bg-dark/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Address</label>
                                    <textarea
                                        name="address"
                                        required
                                        value={formData.address}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full bg-dark/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none"
                                        placeholder="123 Main St, Apt 4B"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            required
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="w-full bg-dark/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                            placeholder="New York"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">ZIP Code</label>
                                        <input
                                            type="text"
                                            name="zip"
                                            required
                                            value={formData.zip}
                                            onChange={handleChange}
                                            className="w-full bg-dark/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                            placeholder="10001"
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/10 mt-6">
                                    <h3 className="text-xl font-display font-bold text-white mb-4">Payment Method</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <label className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${formData.paymentMethod === 'cod'
                                            ? 'bg-primary/20 border-primary text-primary'
                                            : 'bg-dark/50 border-gray-700 text-gray-400 hover:border-gray-500'
                                            }`}>
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="cod"
                                                checked={formData.paymentMethod === 'cod'}
                                                onChange={handleChange}
                                                className="hidden"
                                            />
                                            <span className="text-2xl">💵</span>
                                            <span className="font-semibold text-sm">Cash on Delivery</span>
                                        </label>

                                        <label className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${formData.paymentMethod === 'online'
                                            ? 'bg-primary/20 border-primary text-primary'
                                            : 'bg-dark/50 border-gray-700 text-gray-400 hover:border-gray-500'
                                            }`}>
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="online"
                                                checked={formData.paymentMethod === 'online'}
                                                onChange={handleChange}
                                                className="hidden"
                                            />
                                            <span className="text-2xl">💳</span>
                                            <span className="font-semibold text-sm">Online Payment</span>
                                        </label>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn-primary mt-6 !py-4 text-lg shadow-lg shadow-primary/20"
                                >
                                    {loading ? 'Processing Order...' : `Pay ₹${cartTotal}`}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:h-fit sticky top-28">
                        <div className="bg-dark-card rounded-2xl p-6 sm:p-8 border border-white/5">
                            <h2 className="text-2xl font-display font-bold text-white mb-6">Order Summary</h2>
                            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                                {cart.map((item) => {
                                    const itemKey = item.selectedVariant ? `${item._id}-${item.selectedVariant.name}` : item._id;
                                    return (
                                        <div key={itemKey} className="flex gap-4 items-center">
                                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                                                {item.image ? (
                                                    <img
                                                        src={getImageUrl(item.image)}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xl">🍽️</div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between">
                                                    <div>
                                                        <h3 className="font-semibold text-white">{item.name}</h3>
                                                        {item.selectedVariant && (
                                                            <p className="text-[10px] text-primary">{item.selectedVariant.name}</p>
                                                        )}
                                                    </div>
                                                    <span className="text-gray-400 text-sm">x{item.quantity}</span>
                                                </div>
                                                <p className="text-primary-orange text-sm font-medium">₹{item.price * item.quantity}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="space-y-3 pt-6 border-t border-white/10">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal</span>
                                    <span>₹{cartTotal}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Delivery Fee</span>
                                    <span>₹40</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Tax (5%)</span>
                                    <span>₹{Math.round(cartTotal * 0.05)}</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-white pt-4 border-t border-white/10">
                                    <span>Total</span>
                                    <span className="text-primary-orange">₹{cartTotal + 40 + Math.round(cartTotal * 0.05)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
