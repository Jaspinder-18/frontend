import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import { AuthProvider } from './context/AuthContext';
import { ContentProvider } from './context/ContentContext';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/CartDrawer';
import ProtectedRoute from './components/ProtectedRoute';
import Checkout from './pages/Checkout';
import MainLayout from './components/MainLayout';

// Admin Imports
import AdminLayout from './pages/admin/AdminLayout';
import DashboardOverview from './pages/admin/DashboardOverview';
import OfferManager from './pages/admin/OfferManager';
import MenuManager from './pages/admin/MenuManager';
import CategoryManager from './pages/admin/CategoryManager';
import OrderManager from './pages/admin/OrderManager';
import UserManager from './pages/admin/UserManager';
import MessageManager from './pages/admin/MessageManager';
import ContentManager from './pages/admin/ContentManager';
import Settings from './pages/admin/Settings';

function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen flex flex-col">
              {/* Navbar and Footer are now handled by layouts */}

              <Routes>
                {/* Public Routes with MainLayout */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                </Route>

                {/* Admin Routes with AdminLayout */}
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<DashboardOverview />} />
                  <Route path="offers" element={<OfferManager />} />
                  <Route path="menu" element={<MenuManager />} />
                  <Route path="categories" element={<CategoryManager />} />
                  <Route path="orders" element={<OrderManager />} />
                  <Route path="users" element={<UserManager />} />
                  <Route path="messages" element={<MessageManager />} />
                  <Route path="content" element={<ContentManager />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Routes>

              <CartDrawer />
            </div>
          </Router>
        </CartProvider>
      </ContentProvider>
    </AuthProvider>
  );
}

export default App;
