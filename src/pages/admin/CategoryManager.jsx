import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        displayName: '', description: '', order: 0, isActive: true
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories/all');
            setCategories(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await api.put(`/categories/${editingCategory._id}`, formData);
            } else {
                await api.post('/categories', formData);
            }
            fetchCategories();
            resetForm();
        } catch (err) {
            alert('Failed to save category');
        }
    };

    const resetForm = () => {
        setFormData({ displayName: '', description: '', order: 0, isActive: true });
        setEditingCategory(null);
        setShowForm(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete category?')) return;
        try {
            await api.delete(`/categories/${id}`);
            fetchCategories();
        } catch (err) {
            alert('Failed to delete category');
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-display font-bold text-white">Category <span className="text-primary">Management</span></h2>
                <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary flex items-center gap-2">
                    <Plus size={20} /> Add New Category
                </button>
            </div>

            {showForm && (
                <div className="bg-dark-card border border-gray-800 rounded-xl p-6 animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">{editingCategory ? 'Edit Category' : 'New Category'}</h3>
                        <button onClick={resetForm} className="text-gray-400 hover:text-white"><X size={24} /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Name</label>
                                <input type="text" value={formData.displayName} onChange={e => setFormData({ ...formData, displayName: e.target.value })} required className="input-field w-full bg-dark-lighter border-gray-700 rounded-lg p-2 text-white" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Order</label>
                                <input type="number" value={formData.order} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })} className="input-field w-full bg-dark-lighter border-gray-700 rounded-lg p-2 text-white" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Description</label>
                            <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="input-field w-full bg-dark-lighter border-gray-700 rounded-lg p-2 text-white h-20" />
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} className="form-checkbox text-primary rounded bg-dark-lighter border-gray-700" />
                            <span className="text-sm text-gray-300">Active</span>
                        </label>
                        <button type="submit" className="btn-primary w-full py-2 rounded-lg font-bold">Save Category</button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.sort((a, b) => (a.order || 0) - (b.order || 0)).map(cat => (
                    <div key={cat._id} className={`bg-dark-card border ${cat.isActive ? 'border-gray-800' : 'border-gray-800 opacity-60'} rounded-xl p-4 flex justify-between items-center`}>
                        <div>
                            <h3 className="font-bold text-white text-lg">{cat.displayName}</h3>
                            <p className="text-sm text-gray-400">{cat.description}</p>
                            <span className="text-xs text-gray-500">Order: {cat.order}</span>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => { setEditingCategory(cat); setFormData({ displayName: cat.displayName, description: cat.description, order: cat.order, isActive: cat.isActive }); setShowForm(true); }} className="p-2 hover:bg-primary/20 hover:text-primary rounded-lg transition-colors"><Edit2 size={18} /></button>
                            <button onClick={() => handleDelete(cat._id)} className="p-2 hover:bg-red-500/20 hover:text-red-500 rounded-lg transition-colors"><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryManager;
