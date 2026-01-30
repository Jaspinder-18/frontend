import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import api from '../utils/api';
import { getImageUrl } from '../utils/imageHelper';

const OfferPopup = () => {
    const [offer, setOffer] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Fetch active offers
        api.get('/offers/active')
            .then(res => {
                if (res.data && res.data.length > 0) {
                    // Filter for Homepage Popup and Sort by Priority (High > Medium > Low)
                    const priorityMap = { 'High': 3, 'Medium': 2, 'Low': 1 };

                    const popupOffers = res.data.filter(o =>
                        o.displayLocation && o.displayLocation.includes('Homepage Popup')
                    ).sort((a, b) => {
                        const pA = priorityMap[a.priority] || 0;
                        const pB = priorityMap[b.priority] || 0;
                        return pB - pA; // Descending
                    });

                    if (popupOffers.length > 0) {
                        setOffer(popupOffers[0]);
                        // Delay opening slightly for effect
                        setTimeout(() => setIsOpen(true), 2000);
                    }
                }
            })
            .catch(err => console.error('Error fetching offers:', err));
    }, []);

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleClaim = () => {
        if (offer.redirectLink) {
            window.location.href = offer.redirectLink;
        } else {
            handleClose();
        }
    };

    if (!offer || !isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={handleClose}
            ></div>

            {/* Popup Content */}
            <div className="relative bg-primary-black border border-primary text-center rounded-2xl overflow-hidden max-w-md w-full shadow-2xl transform transition-all animate-popup">
                <button
                    onClick={handleClose}
                    className="absolute top-2 right-2 text-white bg-black/50 rounded-full p-2 hover:bg-white/20 transition-colors z-10"
                >
                    ✕
                </button>

                <div className="relative h-64 overflow-hidden">
                    <img
                        src={getImageUrl(offer.image)}
                        alt={offer.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-black to-transparent"></div>
                    {offer.category && (
                        <div className="absolute bottom-4 left-4 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                            {offer.category}
                        </div>
                    )}
                </div>

                <div className="p-6 text-center">
                    <h3 className="text-2xl font-display font-bold text-white mb-2">
                        {offer.title}
                    </h3>
                    <p className="text-gray-300 mb-6 font-display">
                        {offer.description}
                    </p>
                    <button
                        onClick={handleClaim}
                        className="btn-primary w-full font-bold py-3"
                    >
                        {offer.buttonText || 'Claim Offer'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OfferPopup;
