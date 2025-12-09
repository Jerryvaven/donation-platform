'use client'

import { useState, useEffect } from 'react'
import Sauna from '@/components/user/sauna/Sauna'
import Navbar from '@/components/user/Navbar'

export default function SaunaPage() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : true;
    }
    return true;
  })
  const [mounted, setMounted] = useState(false)

  // Save dark mode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Apply dark mode to the entire page
  useEffect(() => {
    if (mounted) {
      if (darkMode) {
        document.body.style.backgroundColor = "#121212";
        document.documentElement.style.backgroundColor = "#121212";
      } else {
        document.body.style.backgroundColor = "";
        document.documentElement.style.backgroundColor = "";
      }
    }
  }, [darkMode, mounted]);

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null // or a loading spinner
  }

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? "bg-[#121212]" : "bg-gray-50"}`}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <Sauna darkMode={darkMode} />
    </div>
  )
}