import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Plus, Trash2, Edit2, Check, X, Image as ImageIcon } from 'lucide-react';
import { getImageUrl } from '../../utils/imageHelper';

const OfferManager = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingOffer, setEditingOffer] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        buttonText: 'Claim Offer',
        redirectLink: '',
        priority: 'Medium',
        displayLocation: [], // Array
        startDate: '',
        endDate: '',
        isActive: true
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const displayLocations = [
        { id: 'Homepage Popup', label: 'Homepage Popup' },
        { id: 'Menu Page', label: 'Menu Page' },
        { id: 'Product Page', label: 'Product Page' },
        { id: 'Dashboard Banner', label: 'Dashboard Banner' }
    ];

    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        try {
            const res = await api.get('/offers');
            setOffers(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            if (name === 'isActive') {
                setFormData(prev => ({ ...prev, isActive: checked }));
            } else if (name === 'displayLocation') {
                const val = e.target.value;
                setFormData(prev => {
                    const newLocs = checked
                        ? [...prev.displayLocation, val]
                        : prev.displayLocation.filter(l => l !== val);
                    return { ...prev, displayLocation: newLocs };
                });
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            category: '',
            buttonText: 'Claim Offer',
            redirectLink: '',
            priority: 'Medium',
            displayLocation: ['Homepage Popup'],
            startDate: new Date().toISOString().split('T')[0],
            endDate: '',
            isActive: true
        });
        setImageFile(null);
        setImagePreview(null);
        setEditingOffer(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'displayLocation') {
                data.append(key, JSON.stringify(formData[key]));
            } else {
                data.append(key, formData[key]);
            }
        });
        if (imageFile) {
            data.append('image', imageFile);
        }

        try {
            if (editingOffer) {
                await api.put(`/offers/${editingOffer._id}`, data);
            } else {
                await api.post('/offers', data);
            }
            fetchOffers();
            resetForm();
        } catch (err) {
            alert('Failed to save offer: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleEdit = (offer) => {
        setEditingOffer(offer);
        setFormData({
            title: offer.title,
            description: offer.description,
            category: offer.category || '',
            buttonText: offer.buttonText || 'Claim Offer',
            redirectLink: offer.redirectLink || '',
            priority: offer.priority || 'Medium',
            displayLocation: offer.displayLocation || [],
            startDate: offer.startDate ? offer.startDate.split('T')[0] : '',
            endDate: offer.endDate ? offer.endDate.split('T')[0] : '',
            isActive: offer.isActive
        });
        setImagePreview(getImageUrl(offer.image));
        setImageFile(null);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this offer?')) return;
        try {
            await api.delete(`/offers/${id}`);
            fetchOffers();
        } catch (err) {
            alert('Error deleting offer');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-display font-bold text-white">Offer <span className="text-primary">Management</span></h2>
                <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary flex items-center gap-2">
                    <Plus size={20} /> Add New Offer
                </button>
            </div>

            {showForm && (
                <div className="bg-dark-card border border-gray-800 rounded-xl p-6 animate-fade-in">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">{editingOffer ? 'Edit Offer' : 'Create New Offer'}</h3>
                        <button onClick={resetForm} className="text-gray-400 hover:text-white"><X size={24} /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Col */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Offer Title</label>
                                <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="input-field w-full bg-dark-lighter border-gray-700 rounded-lg p-2 text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} required className="input-field w-full bg-dark-lighter border-gray-700 rounded-lg p-2 text-white h-24" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                                    <input type="text" name="category" value={formData.category} onChange={handleInputChange} placeholder="e.g. Dessert" required className="input-field w-full bg-dark-lighter border-gray-700 rounded-lg p-2 text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Priority</label>
                                    <select name="priority" value={formData.priority} onChange={handleInputChange} className="input-field w-full bg-dark-lighter border-gray-700 rounded-lg p-2 text-white">
                                        <option>High</option>
                                        <option>Medium</option>
                                        <option>Low</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Start Date</label>
                                    <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className="input-field w-full bg-dark-lighter border-gray-700 rounded-lg p-2 text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">End Date</label>
                                    <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} className="input-field w-full bg-dark-lighter border-gray-700 rounded-lg p-2 text-white" />
                                </div>
                            </div>
                        </div>

                        {/* Right Col */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Offer Image</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-24 h-24 bg-dark-lighter rounded-lg overflow-hidden border border-gray-700 flex items-center justify-center">
                                        {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-500" />}
                                    </div>
                                    <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm text-gray-400" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Display Locations</label>
                                <div className="space-y-2">
                                    {displayLocations.map(loc => (
                                        <label key={loc.id} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="displayLocation"
                                                value={loc.id}
                                                checked={formData.displayLocation.includes(loc.id)}
                                                onChange={handleInputChange}
                                                className="form-checkbox text-primary rounded border-gray-700 bg-dark-lighter"
                                            />
                                            <span className="text-sm text-gray-300">{loc.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Button Text</label>
                                    <input type="text" name="buttonText" value={formData.buttonText} onChange={handleInputChange} className="input-field w-full bg-dark-lighter border-gray-700 rounded-lg p-2 text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Redirect Link (Opt)</label>
                                    <input type="text" name="redirectLink" value={formData.redirectLink} onChange={handleInputChange} className="input-field w-full bg-dark-lighter border-gray-700 rounded-lg p-2 text-white" />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button type="submit" className="btn-primary flex-1 py-2 rounded-lg font-bold">Save Offer</button>
                                <button type="button" onClick={resetForm} className="bg-gray-700 hover:bg-gray-600 text-white flex-1 py-2 rounded-lg font-bold">Cancel</button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* Offers List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {offers.map(offer => (
                    <div key={offer._id} className="bg-dark-card border border-gray-800 rounded-xl overflow-hidden hover:border-primary transition-colors group">
                        <div className="h-48 relative overflow-hidden">
                            <img src={getImageUrl(offer.image)} alt={offer.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${offer.isActive ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                {offer.isActive ? 'Active' : 'Inactive'}
                            </div>
                            <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur rounded text-xs text-white">
                                {offer.category}
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-bold text-white mb-1">{offer.title}</h3>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{offer.description}</p>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {offer.displayLocation && offer.displayLocation.map((loc, i) => (
                                    <span key={i} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-700">{loc}</span>
                                ))}
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t border-gray-800">
                                <div className="text-xs text-gray-500">
                                    Expires: {offer.endDate ? new Date(offer.endDate).toLocaleDateString() : 'Never'}
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(offer)} className="p-2 hover:bg-primary/20 hover:text-primary rounded-lg transition-colors"><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete(offer._id)} className="p-2 hover:bg-red-500/20 hover:text-red-500 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OfferManager;
