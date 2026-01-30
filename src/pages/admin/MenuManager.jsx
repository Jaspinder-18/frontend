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
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
        <div className="flex flex-col h-full overflow-x-hidden">
            {/* Top Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-display font-bold text-white">Menu <span className="text-primary">Management</span></h2>
                    <p className="text-gray-400 text-sm mt-1">Manage your restaurant offerings and pricing</p>
                </div>
                <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center">
                    <Plus size={20} /> Add New Item
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 relative max-w-full">
                {/* Category Sidebar - Collapsible on Mobile */}
                <div className={`lg:w-64 flex-shrink-0 space-y-2 transition-all duration-300 ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
                    <div className="bg-dark-card border border-gray-800 rounded-2xl p-4 sticky top-24">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <div className="flex items-center gap-2">
                                <Filter size={18} className="text-primary" />
                                <h3 className="font-bold text-white uppercase tracking-wider text-xs">Categories</h3>
                            </div>
                            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="space-y-1 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
                            <button
                                onClick={() => setFilterCategory('All')}
                                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-between group \${
                                    filterCategory === 'All'
                                    ? 'bg-primary/20 text-primary border-r-4 border-primary'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                All Items
                                {filterCategory === 'All' && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat._id}
                                    onClick={() => setFilterCategory(cat.displayName)}
                                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-between group \${
                                        filterCategory === cat.displayName
                                        ? 'bg-primary/20 text-primary border-r-4 border-primary'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    <span className="truncate pr-2">{cat.displayName}</span>
                                    {filterCategory === cat.displayName && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 min-w-0 max-w-full overflow-x-hidden">
                    {/* Search & Mobile Toggle */}
                    <div className="flex gap-4 mb-6">
                        {!isSidebarOpen && (
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="p-3 bg-dark-card border border-gray-800 rounded-xl text-primary flex items-center gap-2"
                            >
                                <Filter size={20} />
                                <span className="text-xs font-bold uppercase lg:hidden">Filter</span>
                            </button>
                        )}
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                            <input
                                type="text"
                                placeholder={`Search in \${filterCategory === 'All' ? 'Menu' : filterCategory}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-dark-card border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all shadow-lg"
                            />
                        </div>
                    </div>

                    {/* Form Overlay */}
                    {showForm && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                            <div className="bg-dark-card border border-gray-800 rounded-2xl p-6 w-full max-w-2xl shadow-2xl relative animate-fade-in max-h-[95vh] overflow-y-auto custom-scrollbar">
                                <div className="flex justify-between items-center mb-6 sticky top-0 bg-dark-card py-2 z-10">
                                    <h3 className="text-2xl font-display font-bold">{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
                                    <button onClick={resetForm} className="text-gray-400 hover:text-white bg-white/5 p-2 rounded-lg transition-colors"><X size={24} /></button>
                                </div>
                                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-300 mb-2">Item Name</label>
                                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full bg-dark-lighter border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-300 mb-2">Price (₹)</label>
                                                <input type="number" name="price" value={formData.price} onChange={handleInputChange} required className="w-full bg-dark-lighter border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-300 mb-2">Category</label>
                                                <select name="category" value={formData.category} onChange={handleInputChange} required className="w-full bg-dark-lighter border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none appearance-none">
                                                    {categories.map(cat => <option key={cat._id} value={cat.displayName}>{cat.displayName}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-300 mb-2">Description</label>
                                            <textarea name="description" value={formData.description} onChange={handleInputChange} required className="w-full bg-dark-lighter border border-gray-700 rounded-xl px-4 py-3 text-white h-32 focus:border-primary focus:outline-none resize-none" />
                                        </div>
                                        <div className="flex gap-8">
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <input type="checkbox" name="isAvailable" checked={formData.isAvailable} onChange={handleInputChange} className="w-5 h-5 rounded border-gray-700 text-primary focus:ring-primary bg-dark-lighter" />
                                                <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">Available</span>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <input type="checkbox" name="featured" checked={formData.featured} onChange={handleInputChange} className="w-5 h-5 rounded border-gray-700 text-primary focus:ring-primary bg-dark-lighter" />
                                                <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">Featured</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-300 mb-2">Item Image</label>
                                            <div className="flex flex-col gap-4">
                                                <div className="aspect-video bg-dark-lighter rounded-2xl overflow-hidden border-2 border-dashed border-gray-700 flex items-center justify-center relative group">
                                                    {imagePreview ? (
                                                        <>
                                                            <img src={imagePreview} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                                <p className="text-white font-bold text-xs bg-primary px-3 py-1 rounded-full">Change Photo</p>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="text-center">
                                                            <ImageIcon className="text-gray-600 mx-auto mb-2" size={40} />
                                                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Click to upload</p>
                                                        </div>
                                                    )}
                                                    <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" title="" />
                                                </div>
                                                <p className="text-[10px] text-gray-500 text-center uppercase tracking-tighter">Recommended: 16:9 Aspect Ratio</p>
                                            </div>
                                        </div>
                                        <div className="pt-4">
                                            <button type="submit" className="w-full bg-primary hover:bg-primary-light text-dark font-bold py-4 rounded-xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
                                                {editingItem ? <Edit2 size={18} /> : <Plus size={18} />}
                                                {editingItem ? 'Update Menu Item' : 'Add to Menu'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Items Grid - Optimized columns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredItems.map(item => (
                            <div key={item._id} className="bg-dark-card border border-gray-800 rounded-2xl overflow-hidden hover:border-primary/50 transition-all group flex flex-col shadow-lg hover:shadow-primary/5 max-w-full">
                                <div className="h-48 relative overflow-hidden flex-shrink-0">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    ) : (
                                        <div className="w-full h-full bg-dark-lighter flex items-center justify-center text-gray-600">
                                            <ImageIcon size={40} />
                                        </div>
                                    )}
                                    {!item.isAvailable && (
                                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-sm z-10">
                                            <span className="bg-red-500 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-xl">Unavailable</span>
                                        </div>
                                    )}
                                    {item.featured && (
                                        <div className="absolute top-4 left-4 z-10">
                                            <span className="bg-primary text-dark px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Featured</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-5 flex-1 flex flex-col min-w-0">
                                    <div className="flex justify-between items-start mb-3 gap-2">
                                        <h3 className="font-bold text-white text-base leading-tight group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem] flex-1 min-w-0">{item.name}</h3>
                                        <div className="text-right flex-shrink-0">
                                            <span className="text-primary font-black text-lg">
                                                {item.variants && item.variants.length > 0
                                                    ? `₹\${item.variants[0].price}+`
                                                    : `₹\${item.price}`}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-gray-400 text-xs line-clamp-2 mb-6 flex-1 italic min-h-[2rem]">"{item.description}"</p>
                                    <div className="flex flex-wrap justify-between items-center pt-4 border-t border-gray-800/50 mt-auto gap-2">
                                        <span className="text-[9px] bg-dark-lighter text-gray-500 font-bold px-2 py-1 rounded-full uppercase tracking-widest border border-gray-700/50 truncate max-w-[100px]">{item.category}</span>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(item)} className="p-2 bg-white/5 hover:bg-primary/20 hover:text-primary rounded-lg transition-all shadow-sm" title="Edit"><Edit2 size={14} /></button>
                                            <button onClick={() => handleDelete(item._id)} className="p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-lg transition-all shadow-sm" title="Delete"><Trash2 size={14} /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredItems.length === 0 && (
                        <div className="text-center py-20 bg-dark-card border border-gray-800 rounded-3xl mt-8">
                            <div className="bg-dark-lighter w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search size={30} className="text-gray-600" />
                            </div>
                            <h3 className="text-xl font-display font-bold text-white mb-2">No items found</h3>
                            <p className="text-gray-500 text-sm">Try adjusting your filters</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MenuManager;
