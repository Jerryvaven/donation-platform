"use client";

import { FaMoon, FaSun } from "react-icons/fa";
import { useRouter, usePathname } from 'next/navigation';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function Navbar({ darkMode, setDarkMode }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <header
      className={`shadow ${
        darkMode ? "bg-[#1E1E1E] border-b border-[#333333]" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-2 lg:px-2 flex justify-between items-center">
        <div className="flex items-center">
          <img
            src="/assets/logo.png"
            alt="Dialed & Defend California"
            className="h-30 w-auto object-contain"
          />
          <p
            className={`text-md mt-6 ${
              darkMode ? "text-[#B3B3B3]" : "text-gray-600"
            }`}
          >
            Supporting the Strength and Recovery of California's First
            Responders
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              pathname === '/'
                ? darkMode ? 'nav-button-active-dark' : 'nav-button-active-light'
                : darkMode ? 'nav-button-inactive-dark' : 'nav-button-inactive-light'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => router.push('/sauna')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              pathname.startsWith('/sauna')
                ? darkMode ? 'nav-button-active-dark' : 'nav-button-active-light'
                : darkMode ? 'nav-button-inactive-dark' : 'nav-button-inactive-light'
            }`}
          >
            Saunas
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-full shadow-lg transition-colors ${
              darkMode
                ? "bg-[#242424] text-white hover:bg-[#333333]"
                : "bg-black text-white hover:bg-gray-800"
            }`}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}