import React, { useEffect } from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Watch } from './pages/Watch';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Navbar } from './components/Navbar';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const Footer = () => (
  <footer className="bg-[#1a0f0f] text-gray-400 py-8 sm:py-16">
    <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[2400px] mx-auto">
      <div className="flex gap-4 sm:gap-6 mb-8 justify-center sm:justify-start">
        <Facebook className="w-6 h-6 cursor-pointer hover:text-white transition" />
        <Twitter className="w-6 h-6 cursor-pointer hover:text-white transition" />
        <Instagram className="w-6 h-6 cursor-pointer hover:text-white transition" />
        <Youtube className="w-6 h-6 cursor-pointer hover:text-white transition" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 mb-8 text-xs sm:text-sm">
        <div className="space-y-4">
          <p className="hover:text-white cursor-pointer">Audio Description</p>
          <p className="hover:text-white cursor-pointer">Investor Relations</p>
          <p className="hover:text-white cursor-pointer">Legal Notices</p>
        </div>
        <div className="space-y-4">
          <p className="hover:text-white cursor-pointer">Help Center</p>
          <p className="hover:text-white cursor-pointer">Jobs</p>
          <p className="hover:text-white cursor-pointer">Cookie Preferences</p>
        </div>
        <div className="space-y-4">
          <p className="hover:text-white cursor-pointer">Gift Cards</p>
          <p className="hover:text-white cursor-pointer">Terms of Use</p>
          <p className="hover:text-white cursor-pointer">Corporate Information</p>
        </div>
        <div className="space-y-4">
          <p className="hover:text-white cursor-pointer">Media Center</p>
          <p className="hover:text-white cursor-pointer">Privacy</p>
          <p className="hover:text-white cursor-pointer">Contact Us</p>
        </div>
      </div>
      <div className="text-xs sm:text-sm text-center sm:text-left">
        <p className="mb-4">© 2025 BLCK. All rights reserved.</p>
        <p>BLCK is a eCommerce store with live videos.</p>
      </div>
    </div>
  </footer>
);

function App() {
  
  const showMainNav = true;

  return (
    <div className="min-h-screen bg-black">
      <ScrollToTop />
      {showMainNav && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/watch/:id" element={<Watch />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
      {showMainNav && <Footer />}
    </div>
  );
}

export default App;