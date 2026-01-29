import { useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { getImageUrl } from '../utils/imageHelper';

const CartDrawer = () => {
    const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity, cartTotal } = useCart();
    const drawerRef = useRef(null);
    const overlayRef = useRef(null);

    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
            gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, display: 'block' });
            gsap.to(drawerRef.current, { x: 0, duration: 0.4, ease: 'power3.out' });
        } else {
            document.body.style.overflow = 'unset';
            gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, display: 'none' });
            gsap.to(drawerRef.current, { x: '100%', duration: 0.4, ease: 'power3.in' });
        }
    }, [isCartOpen]);

    if (!isCartOpen && !drawerRef.current) return null;

    return (
        <>
            <div
                ref={overlayRef}
                className="fixed inset-0 bg-black/60 z-50 hidden opacity-0 backdrop-blur-sm"
                onClick={toggleCart}
            />
            <div
                ref={drawerRef}
                className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-primary-dark border-l border-white/10 z-50 transform translate-x-full shadow-2xl flex flex-col"
            >
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-primary-black">
                    <h2 className="text-2xl font-display font-bold text-white">Your Order</h2>
                    <button onClick={toggleCart} className="text-gray-400 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center">
                            <span className="text-6xl mb-4">🛒</span>
                            <p className="text-xl text-gray-300 font-medium">Your cart is empty</p>
                            <p className="text-gray-500 mt-2">Add some delicious items from the menu!</p>
                            <button
                                onClick={toggleCart}
                                className="mt-6 btn-primary"
                            >
                                Browse Menu
                            </button>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item._id} className="flex gap-4">
                                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                                    {item.image ? (
                                        <img
                                            src={getImageUrl(item.image)}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-semibold text-white line-clamp-1">{item.name}</h3>
                                        <button
                                            onClick={() => removeFromCart(item._id)}
                                            className="text-red-500 hover:text-red-400 text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <p className="text-primary-orange font-medium mb-2">₹{item.price}</p>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                            className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 text-white"
                                        >
                                            -
                                        </button>
                                        <span className="text-white w-4 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                            className="w-6 h-6 rounded-full bg-primary text-dark flex items-center justify-center hover:bg-primary-light"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="p-6 border-t border-white/10 bg-primary-black">
                        <div className="flex justify-between items-center mb-4 text-lg font-medium text-white">
                            <span>Total</span>
                            <span className="text-primary-orange text-xl font-bold">₹{cartTotal}</span>
                        </div>
                        <Link
                            to="/checkout"
                            onClick={toggleCart}
                            className="btn-primary block text-center w-full"
                        >
                            Proceed to Checkout
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartDrawer;
