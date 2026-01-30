import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    UtensilsCrossed,
    ListOrdered,
    Gift,
    ShoppingBag,
    Users,
    FileText,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    X
} from 'lucide-react';

const AdminLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Menu Items', path: '/admin/menu', icon: <UtensilsCrossed size={20} /> },
        { name: 'Categories', path: '/admin/categories', icon: <ListOrdered size={20} /> },
        { name: 'Offers & Popups', path: '/admin/offers', icon: <Gift size={20} /> },
        { name: 'Orders', path: '/admin/orders', icon: <ShoppingBag size={20} /> },
        { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
        { name: 'Content', path: '/admin/content', icon: <FileText size={20} /> },
        { name: 'Analytics', path: '/admin/analytics', icon: <BarChart3 size={20} /> },
        { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-dark text-white font-sans flex">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-dark-card border-r border-gray-800 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
            >
                <div className="h-full flex flex-col">
                    <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                        <h1 className="text-2xl font-bold font-display text-primary">Eat & Out</h1>
                        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400">
                            <X size={24} />
                        </button>
                    </div>

                    <nav className="flex-1 overflow-y-auto py-4">
                        <ul className="space-y-1 px-3">
                            {navItems.map((item) => (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(item.path)
                                                ? 'bg-primary/10 text-primary border-r-2 border-primary'
                                                : 'text-gray-400 hover:bg-dark-lighter hover:text-white'
                                            }`}
                                    >
                                        {item.icon}
                                        <span className="font-medium">{item.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="p-4 border-t border-gray-800">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                            <LogOut size={20} />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
                {/* Top Header */}
                <header className="sticky top-0 z-40 bg-dark/80 backdrop-blur-md border-b border-gray-800 p-4 flex items-center justify-between lg:justify-end">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden text-white"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                            A
                        </div>
                        <span className="text-sm font-medium">Admin Profile</span>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
