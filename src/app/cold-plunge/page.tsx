'use client';
import { useState, useEffect } from 'react';
import ColdPlunge from '@/components/user/cold-plunge/ColdPlunge';
import Navbar from '@/components/user/Navbar';
export default function ColdPlungePage() {
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('adminDarkMode');
            return saved ? JSON.parse(saved) : true;
        }
        return true;
    });
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        localStorage.setItem('adminDarkMode', JSON.stringify(darkMode));
    }, [darkMode]);
    useEffect(() => {
        if (mounted) {
            if (darkMode) {
                document.body.style.backgroundColor = "#121212";
                document.documentElement.style.backgroundColor = "#121212";
            }
            else {
                document.body.style.backgroundColor = "";
                document.documentElement.style.backgroundColor = "";
            }
        }
    }, [darkMode, mounted]);
    useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted) {
        return null;
    }
    return (<div className={`min-h-screen transition-colors ${darkMode ? "bg-[#121212]" : "bg-gray-50"}`}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode}/>
      <ColdPlunge darkMode={darkMode}/>
    </div>);
}
