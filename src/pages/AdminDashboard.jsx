import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useContent } from '../context/ContentContext';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import api from '../utils/api';
import ImageUploader from '../components/ImageUploader';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    isAvailable: true,
    featured: false
  });
  const { updateContent, content: globalContent } = useContent();
  const [activeContentSection, setActiveContentSection] = useState('home');
  const [contentForm, setContentForm] = useState(null);

  useEffect(() => {
    if (globalContent) {
      setContentForm(globalContent);
    }
  }, [globalContent]);

  const [categoryFormData, setCategoryFormData] = useState({
    displayName: '',
    description: '',
    order: 0,
    isActive: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [offers, setOffers] = useState([]);
  const [offerForm, setOfferForm] = useState({ title: '', description: '', isActive: true });
  const [offerImage, setOfferImage] = useState(null);
  const [activeTab, setActiveTab] = useState('menu');
  const dashboardRef = useRef(null);

  useEffect(() => {
    fetchMenuItems();
    fetchMessages();
    fetchCategories();
    fetchOffers();

    gsap.fromTo(
      dashboardRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 }
    );
  }, []);

  const fetchMenuItems = async () => {
    try {
      const res = await api.get('/menu');
      setMenuItems(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await api.get('/contact');
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories/all');
      setCategories(res.data);
      // Set default category if form is empty
      if (!formData.category && res.data.length > 0) {
        const activeCategory = res.data.find(cat => cat.isActive) || res.data[0];
        setFormData(prev => ({ ...prev, category: activeCategory.displayName }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOffers = async () => {
    try {
      const res = await api.get('/offers');
      setOffers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOfferSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', offerForm.title);
    data.append('description', offerForm.description);
    data.append('isActive', offerForm.isActive);
    if (offerImage) {
      data.append('image', offerImage);
    }

    try {
      await api.post('/offers', data);
      setOfferForm({ title: '', description: '', isActive: true });
      setOfferImage(null);
      fetchOffers();
      alert('Offer added successfully!');
    } catch (err) {
      alert('Failed to add offer');
    }
  };

  const handleDeleteOffer = async (id) => {
    if (!window.confirm('Delete this active offer?')) return;
    try {
      await api.delete(`/offers/${id}`);
      fetchOffers();
    } catch (err) {
      alert('Failed to delete offer');
    }
  };

  const handleToggleOffer = async (id) => {
    try {
      await api.put(`/offers/${id}/toggle`);
      fetchOffers();
    } catch (err) {
      alert('Failed to toggle offer status');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

    const formDataToSend = new FormData();

    // Append all form fields
    formDataToSend.append('name', formData.name.trim());
    formDataToSend.append('description', formData.description.trim());
    formDataToSend.append('price', formData.price.toString());
    formDataToSend.append('category', formData.category);
    // Convert booleans to strings for FormData
    formDataToSend.append('isAvailable', formData.isAvailable ? 'true' : 'false');
    formDataToSend.append('featured', formData.featured ? 'true' : 'false');

    if (imageFile) {
      formDataToSend.append('image', imageFile);
    }

    // Log for debugging
    console.log('Submitting menu item:', {
      name: formData.name,
      price: formData.price,
      category: formData.category,
      isAvailable: formData.isAvailable,
      featured: formData.featured,
      hasImage: !!imageFile
    });

    try {
      let response;
      if (editingItem) {
        response = await api.put(`/menu/${editingItem._id}`, formDataToSend);
      } else {
        response = await api.post('/menu', formDataToSend);
      }

      console.log('Success:', response.data);
      fetchMenuItems();
      resetForm();
      alert(editingItem ? 'Menu item updated successfully!' : 'Menu item added successfully!');
    } catch (err) {
      console.error('Full error:', err);
      console.error('Error response:', err.response);
      const errorMsg = err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Error saving menu item. Please check console for details.';
      alert(errorMsg);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      isAvailable: item.isAvailable,
      featured: item.featured
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(`/menu/${id}`);
      fetchMenuItems();
    } catch (err) {
      alert('Error deleting item');
    }
  };

  const resetForm = () => {
    const defaultCategory = categories.find(cat => cat.isActive)?.displayName || (categories[0]?.displayName || '');
    setFormData({
      name: '',
      description: '',
      price: '',
      category: defaultCategory,
      isAvailable: true,
      featured: false
    });
    setImageFile(null);
    setEditingItem(null);
    setShowForm(false);
  };

  // Category Handlers
  const resetCategoryForm = () => {
    setCategoryFormData({
      displayName: '',
      description: '',
      order: 0,
      isActive: true
    });
    setEditingCategory(null);
    setShowCategoryForm(false);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, categoryFormData);
      } else {
        await api.post('/categories', categoryFormData);
      }
      fetchCategories();
      resetCategoryForm();
      alert(editingCategory ? 'Category updated!' : 'Category added!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving category');
    }
  };

  const handleCategoryEdit = (cat) => {
    setEditingCategory(cat);
    setCategoryFormData({
      displayName: cat.displayName,
      description: cat.description,
      order: cat.order,
      isActive: cat.isActive
    });
    setShowCategoryForm(true);
  };

  const handleCategoryDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert('Error deleting category');
    }
  };

  const handleMessageDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await api.delete(`/contact/${id}`);
      setMessages(messages.filter(m => m._id !== id));
    } catch (err) {
      alert('Error deleting message');
      console.error(err);
    }
  };

  // Content Handlers
  const handleContentChange = (section, field, value) => {
    setContentForm(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleContentSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateContent(contentForm);
      alert('Content updated successfully!');
    } catch (err) {
      alert('Error updating content');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-24 bg-gradient-to-b from-primary-black to-primary-dark">
      <div ref={dashboardRef} className="container-custom section-padding relative">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold">
            Admin <span className="text-gradient">Dashboard</span>
          </h1>
          <button onClick={handleLogout} className="btn-secondary w-full sm:w-auto text-sm sm:text-base">
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-8 border-b border-gray-700 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-4 sm:px-6 py-2 sm:py-3 font-semibold transition-colors whitespace-nowrap text-sm sm:text-base ${activeTab === 'menu'
              ? 'text-primary-orange border-b-2 border-primary-orange'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            Menu Items
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 sm:px-6 py-2 sm:py-3 font-semibold transition-colors whitespace-nowrap text-sm sm:text-base ${activeTab === 'categories'
              ? 'text-primary-orange border-b-2 border-primary-orange'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 sm:px-6 py-2 sm:py-3 font-semibold transition-colors whitespace-nowrap text-sm sm:text-base ${activeTab === 'content'
              ? 'text-primary-orange border-b-2 border-primary-orange'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            Page Content
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 sm:px-6 py-2 sm:py-3 font-semibold transition-colors whitespace-nowrap text-sm sm:text-base ${activeTab === 'messages'
              ? 'text-primary-orange border-b-2 border-primary-orange'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            Messages <span className="bg-primary-orange text-white px-2 py-0.5 rounded-full text-xs">({messages.filter(m => !m.read).length})</span>
          </button>
          <button
            onClick={() => setActiveTab('offers')}
            className={`px-4 sm:px-6 py-2 sm:py-3 font-semibold transition-colors whitespace-nowrap text-sm sm:text-base ${activeTab === 'offers'
              ? 'text-primary-orange border-b-2 border-primary-orange'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            Offers & Events
          </button>
        </div>

        {/* Menu Items Tab */}
        {activeTab === 'menu' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-2xl sm:text-3xl font-display font-bold">Menu Management</h2>
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="btn-primary w-full sm:w-auto text-sm sm:text-base px-4 sm:px-8"
              >
                + Add New Menu Item
              </button>
            </div>

            {/* Form */}
            {showForm && (
              <div className="bg-primary-black rounded-2xl p-4 sm:p-6 mb-8 border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg sm:text-xl font-bold">
                    {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                  </h3>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-gray-400 hover:text-white text-2xl leading-none"
                    aria-label="Close form"
                  >
                    ×
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        required
                        className="w-full px-4 py-2 bg-dark-card border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-2">Price (₹)</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.01"

                        className="w-full px-4 py-2 bg-dark-card border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required

                      rows="3"
                      className="w-full px-4 py-2 bg-dark-card border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-semibold mb-2 text-sm sm:text-base">Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required

                        className="w-full px-3 sm:px-4 py-2 bg-dark-card border border-gray-700 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:border-primary"
                      >
                        {categories.filter(cat => cat.isActive).length > 0 ? (
                          categories
                            .filter(cat => cat.isActive)
                            .sort((a, b) => (a.order || 0) - (b.order || 0))
                            .map(cat => (
                              <option key={cat._id} value={cat.displayName}>
                                {cat.displayName}
                              </option>
                            ))
                        ) : (
                          <option value="">No categories available - Add categories first</option>
                        )}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Manage categories in the Categories tab</p>
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-2 text-sm sm:text-base">Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files[0])}
                        className="w-full px-3 sm:px-4 py-2 bg-dark-card border border-gray-700 rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:border-primary file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-dark hover:file:bg-primary-light"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center text-white text-sm sm:text-base cursor-pointer">
                      <input
                        type="checkbox"
                        name="isAvailable"
                        checked={formData.isAvailable}
                        onChange={handleInputChange}
                        className="mr-2 w-4 h-4"
                      />
                      Available
                    </label>
                    <label className="flex items-center text-white text-sm sm:text-base cursor-pointer">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleInputChange}
                        className="mr-2 w-4 h-4"
                      />
                      Featured
                    </label>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button type="submit" className="btn-primary w-full sm:w-auto text-sm sm:text-base">
                      {editingItem ? 'Update' : 'Add'} Item
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="btn-secondary w-full sm:w-auto text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Menu Items List */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-orange"></div>
                <p className="text-gray-400 mt-4 text-sm sm:text-base">Loading menu items...</p>
              </div>
            ) : menuItems.length === 0 ? (
              <div className="text-center py-12 bg-primary-black rounded-xl border border-gray-700">
                <p className="text-gray-400 text-lg mb-4">No menu items yet.</p>
                <button
                  onClick={() => {
                    resetForm();
                    setShowForm(true);
                  }}
                  className="btn-primary"
                >
                  + Add Your First Menu Item
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {menuItems.map((item) => (
                  <div
                    key={item._id}
                    className="bg-primary-black rounded-xl p-4 sm:p-6 border border-gray-700 hover:border-primary-orange/50 transition-all"
                  >
                    {item.image && (
                      <img
                        src={(() => {
                          const imagePath = item.image;
                          if (!imagePath) return '';
                          if (imagePath.startsWith('http')) return imagePath;
                          if (import.meta.env.DEV) return imagePath;
                          const apiBase = import.meta.env.VITE_API_URL || '';
                          const domain = apiBase.replace(/\/api\/?$/, '');
                          return `${domain}${imagePath}`;
                        })()}
                        alt={item.name}
                        className="w-full h-40 sm:h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h3 className="text-lg sm:text-xl font-bold mb-2">{item.name}</h3>
                    <p className="text-gray-400 text-xs sm:text-sm mb-2 line-clamp-2">{item.description}</p>
                    <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                      <span className="text-primary-orange font-bold text-lg sm:text-xl">₹{item.price}</span>
                      <span className="px-2 py-1 bg-primary-orange/20 text-primary-orange rounded text-xs">
                        {item.category}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="flex-1 px-3 sm:px-4 py-2 bg-primary-orange/20 text-primary-orange rounded-lg hover:bg-primary-orange/30 transition-colors text-sm sm:text-base"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="flex-1 px-3 sm:px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm sm:text-base"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-2xl sm:text-3xl font-display font-bold">Categories Management</h2>
              <button
                onClick={() => {
                  resetCategoryForm();
                  setShowCategoryForm(true);
                }}
                className="btn-primary w-full sm:w-auto text-sm sm:text-base"
              >
                + Add New Category
              </button>
            </div>

            {/* Category Form */}
            {showCategoryForm && (
              <div className="bg-primary-black rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-8 border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg sm:text-xl font-bold">
                    {editingCategory ? 'Edit Category' : 'Add New Category'}
                  </h3>
                  <button
                    type="button"
                    onClick={resetCategoryForm}
                    className="text-gray-400 hover:text-white text-2xl leading-none"
                    aria-label="Close form"
                  >
                    ×
                  </button>
                </div>
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-semibold mb-2 text-sm sm:text-base">Category Name</label>
                      <input
                        type="text"
                        name="displayName"
                        value={categoryFormData.displayName}
                        onChange={(e) => setCategoryFormData({ ...categoryFormData, displayName: e.target.value })}
                        required
                        placeholder="e.g., Punjabi, Chinese"
                        className="w-full px-3 sm:px-4 py-2 bg-dark-card border border-gray-700 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-2 text-sm sm:text-base">Order</label>
                      <input
                        type="number"
                        name="order"
                        value={categoryFormData.order}
                        onChange={(e) => setCategoryFormData({ ...categoryFormData, order: parseInt(e.target.value) || 0 })}
                        min="0"
                        className="w-full px-3 sm:px-4 py-2 bg-dark-card border border-gray-700 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2 text-sm sm:text-base">Description</label>
                    <textarea
                      name="description"
                      value={categoryFormData.description}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                      rows="2"
                      placeholder="Optional description"
                      className="w-full px-3 sm:px-4 py-2 bg-dark-card border border-gray-700 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:border-primary resize-none"
                    />
                  </div>
                  <div>
                    <label className="flex items-center text-white text-sm sm:text-base cursor-pointer">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={categoryFormData.isActive}
                        onChange={(e) => setCategoryFormData({ ...categoryFormData, isActive: e.target.checked })}
                        className="mr-2 w-4 h-4"
                      />
                      Active (visible in menu)
                    </label>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button type="submit" className="btn-primary w-full sm:w-auto text-sm sm:text-base">
                      {editingCategory ? 'Update' : 'Add'} Category
                    </button>
                    <button
                      type="button"
                      onClick={resetCategoryForm}
                      className="btn-secondary w-full sm:w-auto text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Categories List */}
            {categories.length === 0 ? (
              <div className="text-center py-12 bg-primary-black rounded-xl border border-gray-700">
                <p className="text-gray-400 text-lg mb-4">No categories yet.</p>
                <button
                  onClick={() => {
                    resetCategoryForm();
                    setShowCategoryForm(true);
                  }}
                  className="btn-primary"
                >
                  + Add Your First Category
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {categories
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((category) => (
                    <div
                      key={category._id}
                      className={`bg-primary-black rounded-xl p-4 sm:p-6 border ${category.isActive ? 'border-gray-700' : 'border-gray-800 opacity-60'
                        } hover:border-primary-orange/50 transition-all`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg sm:text-xl font-bold mb-1">{category.displayName}</h3>
                          {category.description && (
                            <p className="text-gray-400 text-xs sm:text-sm mb-2">{category.description}</p>
                          )}
                          <div className="flex gap-2 items-center">
                            <span className={`px-2 py-1 rounded text-xs ${category.isActive
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-gray-500/20 text-gray-400'
                              }`}>
                              {category.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <span className="text-gray-500 text-xs">Order: {category.order || 0}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => handleCategoryEdit(category)}
                          className="flex-1 px-3 sm:px-4 py-2 bg-primary-orange/20 text-primary-orange rounded-lg hover:bg-primary-orange/30 transition-colors text-sm sm:text-base"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleCategoryDelete(category._id)}
                          className="flex-1 px-3 sm:px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm sm:text-base"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-6">Contact Messages</h2>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`bg-primary-black rounded-xl p-4 sm:p-6 border ${message.read ? 'border-gray-700' : 'border-primary-orange'
                    }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-2">
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-bold">{message.name}</h3>
                      <p className="text-gray-400 text-xs sm:text-sm break-all">{message.email}</p>
                      <p className="text-gray-400 text-xs sm:text-sm">{message.phone}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-300 mt-4 text-sm sm:text-base">{message.message}</p>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleMessageDelete(message._id)}
                      className="text-red-400 hover:text-red-300 text-sm font-semibold transition-colors"
                    >
                      Delete Message
                    </button>
                  </div>
                </div>
              ))}
              {messages.length === 0 && (
                <div className="text-center text-gray-400 py-12 bg-primary-black rounded-xl border border-gray-700">
                  <p className="text-lg">No messages yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Offers Tab */}
        {activeTab === 'offers' && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-6">Offers & Events</h2>

            {/* Add Offer Form */}
            <div className="bg-primary-black rounded-xl p-6 border border-gray-700 mb-8">
              <h3 className="text-xl font-bold mb-4">Add New Offer</h3>
              <form onSubmit={handleOfferSubmit} className="space-y-4">
                <div>
                  <label className="block text-white mb-2">Title</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 bg-dark-card border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                    value={offerForm.title}
                    onChange={e => setOfferForm({ ...offerForm, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Description</label>
                  <textarea
                    required
                    className="w-full px-4 py-2 bg-dark-card border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                    value={offerForm.description}
                    onChange={e => setOfferForm({ ...offerForm, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Image</label>
                  <input
                    type="file"
                    required
                    accept="image/*"
                    className="w-full text-white"
                    onChange={e => setOfferImage(e.target.files[0])}
                  />
                </div>
                <div>
                  <label className="flex items-center text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={offerForm.isActive}
                      onChange={e => setOfferForm({ ...offerForm, isActive: e.target.checked })}
                      className="mr-2"
                    />
                    Active Logic
                  </label>
                </div>
                <button type="submit" className="btn-primary">Add Offer</button>
              </form>
            </div>

            {/* Offers List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {offers.map(offer => (
                <div key={offer._id} className="bg-primary-black rounded-xl border border-gray-700 overflow-hidden relative group">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={(() => {
                        const imagePath = offer.image;
                        if (!imagePath) return '';
                        if (imagePath.startsWith('http')) return imagePath;
                        if (import.meta.env.DEV) return imagePath;
                        const apiBase = import.meta.env.VITE_API_URL || '';
                        const domain = apiBase.replace(/\/api\/?$/, '');
                        return `${domain}${imagePath}`;
                      })()}
                      alt={offer.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold">{offer.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${offer.isActive ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                        {offer.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">{offer.description}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleOffer(offer._id)}
                        className="flex-1 btn-secondary text-sm py-2"
                      >
                        {offer.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteOffer(offer._id)}
                        className="flex-1 bg-red-600/20 text-red-500 hover:bg-red-600/30 rounded-lg py-2 transition text-sm font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Page Content Tab */}
        {activeTab === 'content' && contentForm && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-6">Page Content Management</h2>

            <div className="flex flex-wrap gap-2 mb-6">
              {['home', 'about', 'gallery', 'contact'].map(section => (
                <button
                  key={section}
                  onClick={() => setActiveContentSection(section)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${activeContentSection === section
                    ? 'bg-primary-orange text-white'
                    : 'bg-primary-black border border-gray-700 text-gray-400 hover:text-white'
                    }`}
                >
                  {section}
                </button>
              ))}
            </div>

            <form onSubmit={handleContentSubmit} className="bg-primary-black rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 capitalize">{activeContentSection} Page Content</h3>
              <div className="grid grid-cols-1 gap-4">
                {Object.keys(contentForm[activeContentSection] || {}).map(field => {
                  if (field === '_id') return null;
                  const value = contentForm[activeContentSection][field];

                  // Image fields (Strings)
                  if (['heroBackgroundImage', 'aboutSectionImage', 'image'].includes(field)) {
                    return (
                      <div key={field} className="mb-6">
                        <ImageUploader
                          currentImage={value}
                          label={field.replace(/([A-Z])/g, ' $1').trim()}
                          onImageUpload={(url) => handleContentChange(activeContentSection, field, url)}
                        />
                      </div>
                    );
                  }

                  // Gallery Images (Array)
                  if (field === 'images' && Array.isArray(value)) {
                    return (
                      <div key={field} className="mb-6">
                        <label className="block text-gray-400 text-sm mb-3">Gallery Images</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                          {value.map((img, idx) => (
                            <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-800 border border-gray-700">
                              <img
                                src={img}
                                alt={`Gallery ${idx}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newImages = value.filter((_, i) => i !== idx);
                                  handleContentChange(activeContentSection, field, newImages);
                                }}
                                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white w-8 h-8 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110 shadow-lg"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="bg-primary-dark/30 rounded-lg p-4 border border-dashed border-gray-700">
                          <p className="text-gray-400 text-sm mb-2">Add new image to gallery:</p>
                          <ImageUploader
                            currentImage=""
                            label=""
                            onImageUpload={(url) => {
                              handleContentChange(activeContentSection, field, [...value, url]);
                            }}
                          />
                        </div>
                      </div>
                    );
                  }

                  // Default text input
                  return (
                    <div key={field} className="mb-4">
                      <label className="block text-gray-400 text-sm mb-1 capitalize">
                        {field.replace(/([A-Z])/g, ' $1').trim()}
                      </label>

                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleContentChange(activeContentSection, field, e.target.value)}
                        className="w-full px-4 py-2 bg-dark-card border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                      />
                    </div>
                  )
                })}
              </div>
              <div className="mt-6">
                <button type="submit" className="btn-primary px-8">Save Changes</button>
              </div>
            </form>
          </div>
        )
        }

        {/* Floating Add Buttons */}
        {
          !showForm && !showCategoryForm && activeTab === 'menu' && (
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="fixed bottom-6 right-6 z-50 bg-primary-orange hover:bg-primary-red text-white rounded-full p-4 sm:p-5 shadow-2xl hover:shadow-primary-orange/50 transition-all duration-300 transform hover:scale-110 flex items-center justify-center group"
              aria-label="Add new menu item"
            >
              <span className="text-2xl sm:text-3xl font-bold group-hover:rotate-90 transition-transform duration-300">+</span>
              <span className="ml-2 text-sm sm:text-base font-semibold hidden sm:inline">Add Item</span>
            </button>
          )
        }
        {
          !showCategoryForm && activeTab === 'categories' && (
            <button
              onClick={() => {
                resetCategoryForm();
                setShowCategoryForm(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="fixed bottom-6 right-6 z-50 bg-primary-orange hover:bg-primary-red text-white rounded-full p-4 sm:p-5 shadow-2xl hover:shadow-primary-orange/50 transition-all duration-300 transform hover:scale-110 flex items-center justify-center group"
              aria-label="Add new category"
            >
              <span className="text-2xl sm:text-3xl font-bold group-hover:rotate-90 transition-transform duration-300">+</span>
              <span className="ml-2 text-sm sm:text-base font-semibold hidden sm:inline">Add Category</span>
            </button>
          )
        }
      </div >
    </div >
  );
};

export default AdminDashboard;

