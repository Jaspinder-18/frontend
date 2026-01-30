import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        try {
            const localData = localStorage.getItem('eatandout_cart');
            return localData ? JSON.parse(localData) : [];
        } catch (e) {
            return [];
        }
    });

    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('eatandout_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item, selectedVariant = null) => {
        setCart((prevCart) => {
            const itemKey = selectedVariant ? `${item._id}-${selectedVariant.name}` : item._id;
            const existingItem = prevCart.find((cartItem) => {
                const cartItemKey = cartItem.selectedVariant ? `${cartItem._id}-${cartItem.selectedVariant.name}` : cartItem._id;
                return cartItemKey === itemKey;
            });

            const itemPrice = selectedVariant ? selectedVariant.price : item.price;

            if (existingItem) {
                return prevCart.map((cartItem) => {
                    const cartItemKey = cartItem.selectedVariant ? `${cartItem._id}-${cartItem.selectedVariant.name}` : cartItem._id;
                    return cartItemKey === itemKey
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem;
                });
            } else {
                return [...prevCart, { ...item, quantity: 1, selectedVariant, price: itemPrice }];
            }
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (itemKey) => {
        setCart((prevCart) => prevCart.filter((item) => {
            const currentKey = item.selectedVariant ? `${item._id}-${item.selectedVariant.name}` : item._id;
            return currentKey !== itemKey;
        }));
    };

    const updateQuantity = (itemKey, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(itemKey);
            return;
        }
        setCart((prevCart) =>
            prevCart.map((item) => {
                const currentKey = item.selectedVariant ? `${item._id}-${item.selectedVariant.name}` : item._id;
                return currentKey === itemKey ? { ...item, quantity: newQuantity } : item;
            })
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartTotal = cart.reduce((total, item) => total + (item.selectedVariant ? item.selectedVariant.price : item.price) * item.quantity, 0);
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    const toggleCart = () => setIsCartOpen(!isCartOpen);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartTotal,
                cartCount,
                isCartOpen,
                setIsCartOpen,
                toggleCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
