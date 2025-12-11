'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSignOutAlt, FaMoon, FaSun, FaUser, FaChevronDown } from 'react-icons/fa';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';
import NotificationIcon from './minicomponents/NotificationIcon';
interface ActivityItem {
    id: string;
    type: 'donation' | 'match' | 'update' | 'goal';
    message: string;
    timestamp: string;
    icon: string;
    color: string;
}
interface NavbarProps {
    notificationActivity: ActivityItem[];
    showNotifications: boolean;
    setShowNotifications: (show: boolean) => void;
    unreadNotifications: boolean;
    setUnreadNotifications: (unread: boolean) => void;
    lastNotificationCheck: string;
    setLastNotificationCheck: (time: string) => void;
    darkMode: boolean;
    setDarkMode: (darkMode: boolean) => void;
    userRole?: string;
}
export default function Navbar({ notificationActivity, showNotifications, setShowNotifications, unreadNotifications, setUnreadNotifications, lastNotificationCheck, setLastNotificationCheck, darkMode, setDarkMode, userRole = 'Admin' }: NavbarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const supabase = createClient();
    const [showMenuDropdown, setShowMenuDropdown] = useState(false);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (showMenuDropdown && !(event.target as Element).closest('.menu-dropdown')) {
                setShowMenuDropdown(false);
            }
        };
        if (showMenuDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMenuDropdown]);
    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/admin/login');
    };
    return (<motion.header initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, ease: "easeOut" }} className="border-b shadow-sm sticky top-0 z-40 bg-[#1E1E1E] border-[#333333]">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <motion.div className="flex items-center gap-4" whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
            <img src="/assets/logo.png" alt="Dialed & Defend California" className="h-20 w-auto object-contain"/>
            <div>
              <h1 className="text-2xl font-bold text-white">California Donation Admin Dashboard</h1>
            </div>
          </motion.div>
          <div className="flex items-center gap-3">
            
            <div className="relative menu-dropdown">
              <motion.button onClick={() => setShowMenuDropdown(!showMenuDropdown)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-4 py-2 rounded-lg transition-colors flex items-center gap-2 bg-[#242424] text-white hover:bg-[#333333]">
                Menu
                <motion.div animate={{ rotate: showMenuDropdown ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <FaChevronDown size={12}/>
                </motion.div>
              </motion.button>

              
              {showMenuDropdown && (<motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.2 }} className="absolute right-0 mt-2 w-48 rounded-xl shadow-xl border overflow-hidden z-50 bg-[#1E1E1E] border-[#333333]">
                  <div className="py-2">
                    <button onClick={() => {
                router.push('/admin/dashboard');
                setShowMenuDropdown(false);
            }} className={`w-full px-4 py-2 text-left flex items-center gap-3 transition-colors ${pathname === '/admin/dashboard'
                ? 'bg-[#3B82F6] text-white'
                : 'text-[#B3B3B3] hover:bg-[#242424]'}`}>
                      Dashboard
                    </button>
                    <button onClick={() => {
                router.push('/admin/sauna-products');
                setShowMenuDropdown(false);
            }} className={`w-full px-4 py-2 text-left flex items-center gap-3 transition-colors ${pathname === '/admin/sauna-products'
                ? 'bg-[#3B82F6] text-white'
                : 'text-[#B3B3B3] hover:bg-[#242424]'}`}>
                      Sauna Products
                    </button>
                    <button onClick={() => {
                router.push('/admin/cold-plunge-products');
                setShowMenuDropdown(false);
            }} className={`w-full px-4 py-2 text-left flex items-center gap-3 transition-colors ${pathname === '/admin/cold-plunge-products'
                ? 'bg-[#3B82F6] text-white'
                : 'text-[#B3B3B3] hover:bg-[#242424]'}`}>
                      Cold Plunge Products
                    </button>
                    <button onClick={() => {
                router.push('/admin/coupons');
                setShowMenuDropdown(false);
            }} className={`w-full px-4 py-2 text-left flex items-center gap-3 transition-colors ${pathname === '/admin/coupons'
                ? 'bg-[#3B82F6] text-white'
                : 'text-[#B3B3B3] hover:bg-[#242424]'}`}>
                      Coupons
                    </button>
                    <button onClick={() => {
                router.push('/admin/orders');
                setShowMenuDropdown(false);
            }} className={`w-full px-4 py-2 text-left flex items-center gap-3 transition-colors ${pathname === '/admin/orders'
                ? 'bg-[#3B82F6] text-white'
                : 'text-[#B3B3B3] hover:bg-[#242424]'}`}>
                      Orders
                    </button>
                  </div>
                </motion.div>)}
            </div>

            <div className="h-8 w-px bg-[#333333]"></div>

            <NotificationIcon notificationActivity={notificationActivity} showNotifications={showNotifications} setShowNotifications={setShowNotifications} unreadNotifications={unreadNotifications} setUnreadNotifications={setUnreadNotifications} lastNotificationCheck={lastNotificationCheck} setLastNotificationCheck={setLastNotificationCheck} darkMode={darkMode}/>
            <div className="h-8 w-px bg-[#333333]"></div>
            <motion.button onClick={() => setDarkMode(!darkMode)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="p-2 rounded-lg transition-colors bg-[#242424] text-white hover:bg-[#333333]" title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              {darkMode ? <FaSun size={16}/> : <FaMoon size={16}/>}
            </motion.button>
            <div className="h-8 w-px bg-[#333333]"></div>
            <motion.button onClick={() => router.push('/admin/profile')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="p-2 rounded-lg transition-colors bg-[#242424] text-white hover:bg-[#333333]" title="Profile Settings">
              <FaUser size={16}/>
            </motion.button>
            <div className="h-8 w-px bg-[#333333]"></div>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border bg-[#242424] text-[#B3B3B3] border-[#333333]`}>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-medium">{userRole}</span>
            </div>
            <motion.button onClick={handleLogout} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 group text-white hover:bg-[#242424]">
              <FaSignOutAlt className="group-hover:translate-x-0.5 transition-transform"/>
              Logout
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>);
}
