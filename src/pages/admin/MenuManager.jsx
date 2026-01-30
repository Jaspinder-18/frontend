import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Plus, Edit2, Trash2, Search, Filter, X, Image as ImageIcon } from 'lucide-react';

const MenuManager = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [filterCategory, setFilterCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    // Form
    const [formData, setFormData] = useState({
        name: '', description: '', price: '', category: '', isAvailable: true, featured: false
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [menuRes, catRes] = await Promise.all([
                api.get('/menu'),
                api.get('/categories/all')
            ]);
            setMenuItems(menuRes.data);
            setCategories(catRes.data);
            if (!formData.category && catRes.data.length > 0) {
                setFormData(prev => ({ ...prev, category: catRes.data[0].displayName }));
            }
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
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
            name: '', description: '', price: '',
            category: categories[0]?.displayName || '',
            isAvailable: true, featured: false
        });
        setImageFile(null);
        setImagePreview(null);
        setEditingItem(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (imageFile) data.append('image', imageFile);

        try {
            if (editingItem) {
                await api.put(`/menu/${editingItem._id}`, data);
            } else {
                await api.post('/menu', data);
            }
            fetchData(); // Refetch to get updated list
            resetForm();
        } catch (err) {
            alert('Failed to save menu item');
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            isAvailable: item.isAvailable,
            featured: item.featured
        });
        setImagePreview(item.image); // Assuming image is URL
        setImageFile(null);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this item?')) return;
        try {
            await api.delete(`/menu/${id}`);
            setMenuItems(menuItems.filter(i => i._id !== id));
        } catch (err) {
            alert('Error deleting item');
        }
    };

    const filteredItems = menuItems.filter(item => {
        const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-display font-bold text-white">Menu <span className="text-primary">Management</span></h2>
                <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary flex items-center gap-2">
                    <Plus size={20} /> Add New Item
                </button>
            </div>

            {/* Controls */}
            <div className="bg-dark-card border border-gray-800 rounded-xl overflow-hidden shadow-lg mb-8">
                <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-800">
                    <div className="p-4 lg:w-80 flex-shrink-0">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search items..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-dark-lighter border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-primary focus:outline-none transition-all placeholder:text-gray-500"
                            />
                        </div>
                    </div>

                    <div className="flex-1 min-w-0 bg-dark-card/50">
                        <div className="flex items-center h-full">
                            <div className="flex gap-2 w-full overflow-x-auto px-4 py-4 custom-scrollbar scroll-smooth">
                                <button
                                    onClick={() => setFilterCategory('All')}
                                    className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${filterCategory === 'All'
                                            ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                            : 'bg-dark-lighter text-gray-400 hover:text-white hover:bg-dark-light ring-1 ring-gray-700/50'
                                        }`}
                                >
                                    All Items
                                </button>
                                {categories.map(cat => (
                                    <button
                                        key={cat._id}
                                        onClick={() => setFilterCategory(cat.displayName)}
                                        className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${filterCategory === cat.displayName
                                                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                                : 'bg-dark-lighter text-gray-400 hover:text-white hover:bg-dark-light ring-1 ring-gray-700/50'
                                            }`}
                                    >
                                        {cat.displayName}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-dark-card border border-gray-800 rounded-xl p-6 animate-fade-in">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
                        <button onClick={resetForm} className="text-gray-400 hover:text-white"><X size={24} /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Item Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="input-field w-full bg-dark-lighter border-gray-700 rounded-lg p-2 text-white" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Price (₹)</label>
                                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} required className="input-field w-full bg-dark-lighter border-gray-700 rounded-lg p-2 text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Category</label>
                                    <select name="category" value={formData.category} onChange={handleInputChange} required className="input-field w-full bg-dark-lighter border-gray-700 rounded-lg p-2 text-white">
                                        {categories.map(cat => <option key={cat._id} value={cat.displayName}>{cat.displayName}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Description</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} required className="input-field w-full bg-dark-lighter border-gray-700 rounded-lg p-2 text-white h-24" />
                            </div>
                            <div className="flex gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" name="isAvailable" checked={formData.isAvailable} onChange={handleInputChange} className="form-checkbox text-primary rounded bg-dark-lighter border-gray-700" />
                                    <span className="text-sm text-gray-300">Available</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" name="featured" checked={formData.featured} onChange={handleInputChange} className="form-checkbox text-primary rounded bg-dark-lighter border-gray-700" />
                                    <span className="text-sm text-gray-300">Featured</span>
                                </label>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Image</label>
                                <div className="flex flex-col gap-4">
                                    <div className="w-full h-48 bg-dark-lighter rounded-lg overflow-hidden border border-gray-700 flex items-center justify-center">
                                        {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-500" size={48} />}
                                    </div>
                                    <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm text-gray-400" />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="submit" className="btn-primary flex-1 py-2 rounded-lg font-bold">Save Item</button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map(item => (
                    <div key={item._id} className="bg-dark-card border border-gray-800 rounded-xl overflow-hidden hover:border-primary/50 transition-all group">
                        <div className="h-40 relative overflow-hidden">
                            {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full bg-dark-lighter flex items-center justify-center text-gray-600"><ImageIcon /></div>}
                            {!item.isAvailable && <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold backdrop-blur-sm">SOLD OUT</div>}
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-white text-lg">{item.name}</h3>
                                <span className="text-primary font-bold">
                                    {item.variants && item.variants.length > 0
                                        ? `₹${item.variants[0].price}+`
                                        : `₹${item.price}`}
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm line-clamp-2 mb-4">{item.description}</p>
                            <div className="flex justify-between items-center pt-2 border-t border-gray-800">
                                <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded">{item.category}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(item)} className="p-1.5 hover:bg-primary/20 hover:text-primary rounded-lg transition-colors"><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete(item._id)} className="p-1.5 hover:bg-red-500/20 hover:text-red-500 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MenuManager;
