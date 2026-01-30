import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Search, Filter, ChevronDown, Eye } from 'lucide-react';

const OrderManager = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const statuses = ['All', 'Pending', 'Confirmed', 'Preparing', 'Ready', 'Delivered', 'Cancelled'];

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders');
            setOrders(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await api.put(`/orders/${id}/status`, { status: newStatus });
            // Optimistic update
            setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
        const matchesSearch =
            (order._id && order._id.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (order.customerDetails?.name && order.customerDetails.name.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesStatus && matchesSearch;
    });

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Orders...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-display font-bold text-white">Order <span className="text-primary">Management</span></h2>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-dark-card border border-gray-800 p-4 rounded-xl">
                {/* Search */}
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search ID or Name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-dark-lighter border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:border-primary focus:outline-none"
                    />
                </div>

                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    {statuses.map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filterStatus === status
                                    ? 'bg-primary text-white'
                                    : 'bg-dark-lighter text-gray-400 hover:text-white hover:bg-gray-800'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-dark-card border border-gray-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-dark-lighter text-gray-400 text-sm border-b border-gray-800">
                                <th className="p-4 font-medium">Order ID</th>
                                <th className="p-4 font-medium">Date & Time</th>
                                <th className="p-4 font-medium">Customer</th>
                                <th className="p-4 font-medium">Items</th>
                                <th className="p-4 font-medium">Total</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {filteredOrders.length > 0 ? filteredOrders.map(order => (
                                <tr key={order._id} className="border-b border-gray-800/50 hover:bg-dark-lighter/50 transition-colors">
                                    <td className="p-4 font-mono text-gray-300">#{order._id.slice(-6).toUpperCase()}</td>
                                    <td className="p-4 text-gray-400">
                                        <div className="font-medium text-gray-300">{new Date(order.createdAt).toLocaleDateString()}</div>
                                        <div className="text-xs">{new Date(order.createdAt).toLocaleTimeString()}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-white">{order.customerDetails?.name || order.user?.name || 'Guest'}</div>
                                        <div className="text-xs text-gray-500">{order.customerDetails?.phone || order.user?.email || 'No contact'}</div>
                                    </td>
                                    <td className="p-4 text-gray-300">
                                        <div className="flex flex-col gap-1">
                                            {order.items.slice(0, 2).map((item, i) => (
                                                <span key={i} className="text-xs">
                                                    {item.quantity}x {item.name}
                                                </span>
                                            ))}
                                            {order.items.length > 2 && <span className="text-xs text-gray-500">+{order.items.length - 2} more...</span>}
                                        </div>
                                    </td>
                                    <td className="p-4 font-bold text-primary text-base">₹{order.totalAmount}</td>
                                    <td className="p-4">
                                        <div className="relative group">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                className={`appearance-none cursor-pointer pl-3 pr-8 py-1 rounded-lg text-xs font-bold border border-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 ${order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' :
                                                        order.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-500' :
                                                            order.status === 'Cancelled' ? 'bg-red-500/20 text-red-400' :
                                                                'bg-blue-500/20 text-blue-400'
                                                    }`}
                                            >
                                                {statuses.slice(1).map(s => (
                                                    <option key={s} value={s} className="bg-dark text-gray-300">{s}</option>
                                                ))}
                                            </select>
                                            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <button className="p-2 text-gray-400 hover:text-white hover:bg-primary/20 rounded-lg transition-colors">
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-gray-500">No orders found matching filters.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderManager;
