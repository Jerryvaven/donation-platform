"use client";
import { FaMoon, FaSun, FaShoppingCart } from "react-icons/fa";
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
interface NavbarProps {
    darkMode: boolean;
    setDarkMode: (dark: boolean) => void;
}
export default function Navbar({ darkMode, setDarkMode }: NavbarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { cart } = useCart();
    const [mounted, setMounted] = useState(false);
    const showCart = pathname.startsWith('/sauna') || pathname.startsWith('/cold-plunge');
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    useEffect(() => {
        setMounted(true);
    }, []);
    return (<header className="shadow bg-[#1E1E1E] border-b border-[#333333]">
      <div className="max-w-7xl mx-auto px-2 sm:px-2 lg:px-2 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/assets/logo.png" alt="Dialed & Defend California" className="h-30 w-auto object-contain"/>
          <p className="text-md mt-6 text-[#B3B3B3]">
            Supporting the Strength and Recovery of California's First
            Responders
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={() => router.push('/')} className={`px-4 py-2 rounded-lg transition-colors ${pathname === '/' ? 'nav-button-active-dark' : 'nav-button-inactive-dark'}`}>
            Home
          </button>
          <button onClick={() => router.push('/sauna')} className={`px-4 py-2 rounded-lg transition-colors ${pathname.startsWith('/sauna') ? 'nav-button-active-dark' : 'nav-button-inactive-dark'}`}>
            Saunas
          </button>
          <button onClick={() => router.push('/cold-plunge')} className={`px-4 py-2 rounded-lg transition-colors ${pathname.startsWith('/cold-plunge') ? 'nav-button-active-dark' : 'nav-button-inactive-dark'}`}>
            Cold Plunges
          </button>
          {showCart && (<button onClick={() => router.push('/cart')} className="relative p-3 rounded-full shadow-lg transition-colors bg-[#242424] text-white hover:bg-[#333333]" title="Shopping Cart">
              <FaShoppingCart size={20}/>
              {mounted && cartCount > 0 && (<span className="absolute -top-2 -right-2 bg-[#D4AF37] text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>)}
            </button>)}
          <button onClick={() => setDarkMode(!darkMode)} className="p-3 rounded-full shadow-lg transition-colors bg-[#242424] text-white hover:bg-[#333333]" title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            {darkMode ? <FaSun size={20}/> : <FaMoon size={20}/>}
          </button>
        </div>
      </div>
    </header>);
}
