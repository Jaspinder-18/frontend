import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { ShoppingBag, DollarSign, Users, Utensils, TrendingUp, Clock } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
    <div className="bg-dark-card border border-gray-800 p-6 rounded-xl flex items-center gap-4 hover:border-gray-700 transition-colors">
        <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center shrink-0`}>
            <Icon size={24} className="text-white" />
        </div>
        <div>
            <p className="text-gray-400 text-sm font-medium">{title}</p>
            <h3 className="text-2xl font-bold font-display text-white">{value}</h3>
            {subtext && <p className="text-xs text-green-400 flex items-center gap-1"><TrendingUp size={12} /> {subtext}</p>}
        </div>
    </div>
);

const DashboardOverview = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        dailyVisitors: 0,
        popularDishes: []
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Parallel fetch
            const [statsRes, ordersRes] = await Promise.all([
                api.get('/orders/stats'),
                api.get('/orders?limit=5') // Assuming endpoint supports limit or just slice it
            ]);

            setStats(statsRes.data);
            setRecentOrders(ordersRes.data.slice(0, 5));
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-display font-bold text-white">Dashboard <span className="text-primary">Overview</span></h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`₹${stats.totalRevenue.toLocaleString()}`}
                    icon={DollarSign}
                    color="bg-green-500/20"
                    subtext="+12% from last month"
                />
                <StatCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon={ShoppingBag}
                    color="bg-primary/20"
                    subtext="+5 new today"
                />
                <StatCard
                    title="Daily Visitors"
                    value={stats.dailyVisitors}
                    icon={Users}
                    color="bg-blue-500/20"
                    subtext="Currently active"
                />
                <StatCard
                    title="Popular Item"
                    value={stats.popularDishes[0]?._id || 'N/A'}
                    icon={Utensils}
                    color="bg-orange-500/20"
                    subtext={`${stats.popularDishes[0]?.count || 0} orders`}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-dark-card border border-gray-800 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">Recent Orders</h3>
                        <button className="text-primary text-sm hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-gray-400 text-sm border-b border-gray-800">
                                    <th className="py-3 font-medium">Order ID</th>
                                    <th className="py-3 font-medium">Customer</th>
                                    <th className="py-3 font-medium">Status</th>
                                    <th className="py-3 font-medium">Amount</th>
                                    <th className="py-3 font-medium">Time</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {recentOrders.length > 0 ? recentOrders.map(order => (
                                    <tr key={order._id} className="border-b border-gray-800/50 hover:bg-dark-lighter transition-colors">
                                        <td className="py-4 text-gray-300">#{order._id.slice(-6).toUpperCase()}</td>
                                        <td className="py-4 font-medium text-white">{order.customerDetails?.name || order.user?.name || 'Guest'}</td>
                                        <td className="py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' :
                                                    order.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        order.status === 'Cancelled' ? 'bg-red-500/20 text-red-400' :
                                                            'bg-blue-500/20 text-blue-400'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-white font-bold">₹{order.totalAmount}</td>
                                        <td className="py-4 text-gray-400 flex items-center gap-1">
                                            <Clock size={12} />
                                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="py-8 text-center text-gray-500">No orders found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Popular Dishes */}
                <div className="bg-dark-card border border-gray-800 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-white mb-6">Popular Dishes</h3>
                    <div className="space-y-4">
                        {stats.popularDishes.map((dish, i) => (
                            <div key={dish._id} className="flex items-center justify-between p-3 rounded-lg hover:bg-dark-lighter transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className="w-6 h-6 rounded-full bg-dark border border-gray-700 flex items-center justify-center text-xs text-gray-400 font-mono">
                                        {i + 1}
                                    </span>
                                    <span className="font-medium text-gray-200">{dish._id}</span>
                                </div>
                                <span className="text-primary font-bold text-sm">{dish.count} Sold</span>
                            </div>
                        ))}
                        {stats.popularDishes.length === 0 && <p className="text-gray-500 text-center">No data available</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
