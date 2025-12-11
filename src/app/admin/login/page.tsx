"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSignInAlt, FaEnvelope, FaLock, FaExclamationTriangle, FaEye, FaEyeSlash, } from "react-icons/fa";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [darkMode, setDarkMode] = useState(true);
    const router = useRouter();
    const supabase = createClient();
    useEffect(() => {
        const savedDarkMode = localStorage.getItem('adminDarkMode');
        if (savedDarkMode !== null) {
            setDarkMode(JSON.parse(savedDarkMode));
        }
    }, []);
    useEffect(() => {
        if (darkMode) {
            document.body.style.backgroundColor = "#121212";
            document.documentElement.style.backgroundColor = "#121212";
        }
        else {
            document.body.style.backgroundColor = "";
            document.documentElement.style.backgroundColor = "";
        }
    }, [darkMode]);
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            setError(error.message);
        }
        else {
            const response = await fetch('/api/admin-auth/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ checkAdmin: true }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error || "Access denied: Admin role required.");
                await supabase.auth.signOut();
            }
            else {
                router.push("/admin/dashboard");
            }
        }
        setLoading(false);
    };
    return (<div className={`min-h-screen ${darkMode ? 'bg-[#121212]' : 'bg-gray-50'} flex items-center justify-center px-4`}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-md w-full space-y-8">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-center">
          <motion.div whileHover={{ scale: 1.1 }} className={`mx-auto h-16 w-16 ${darkMode ? 'bg-[#1E1E1E]' : 'bg-black'} rounded-full flex items-center justify-center mb-4`}>
            <FaSignInAlt className={`${darkMode ? 'text-white' : 'text-white'} text-2xl`}/>
          </motion.div>
          <h2 className={`text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Admin Login</h2>
          <p className={`mt-2 text-sm ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-600'}`}>
            Sign in to access the admin dashboard
          </p>
        </motion.div>

        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className={`mt-8 space-y-6 ${darkMode ? 'bg-[#1E1E1E]' : 'bg-white'} p-8 rounded-xl shadow-lg`} onSubmit={handleLogin}>
          {error && (<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className={`border px-4 py-3 rounded-md flex items-center gap-2 ${darkMode
                ? 'bg-[#EF4444]/20 border-[#EF4444]/30 text-[#EF4444]'
                : 'bg-red-50 border-red-200 text-red-700'}`}>
              <FaExclamationTriangle />
              <span className="text-sm">{error}</span>
            </motion.div>)}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-700'}`}>
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <FaEnvelope className={`group-focus-within:text-black transition-colors duration-200 ${darkMode ? 'text-[#808080]' : 'text-gray-400'}`}/>
                </div>
                <motion.input whileFocus={{ scale: 1.02 }} id="email" name="email" type="email" required className={`appearance-none block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 ${darkMode
            ? 'bg-[#242424] border-[#333333] text-white placeholder-[#808080]'
            : 'border-gray-300 placeholder-gray-500 text-gray-900'}`} placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)}/>
              </div>
            </div>

            <div>
              <label htmlFor="password" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-700'}`}>
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <FaLock className={`group-focus-within:text-black transition-colors duration-200 ${darkMode ? 'text-[#808080]' : 'text-gray-400'}`}/>
                </div>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer z-10" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (<FaEyeSlash className={`group-focus-within:text-black transition-colors duration-200 ${darkMode ? 'text-[#808080]' : 'text-gray-400'}`}/>) : (<FaEye className={`group-focus-within:text-black transition-colors duration-200 ${darkMode ? 'text-[#808080]' : 'text-gray-400'}`}/>)}
                </div>
                <motion.input whileFocus={{ scale: 1.02 }} id="password" name="password" type={showPassword ? "text" : "password"} required className={`appearance-none block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 ${darkMode
            ? 'bg-[#242424] border-[#333333] text-white placeholder-[#808080]'
            : 'border-gray-300 placeholder-gray-500 text-gray-900'}`} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}/>
              </div>
            </div>
          </div>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className={`w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${darkMode
            ? 'bg-[#1E1E1E] hover:bg-[#333333] focus:ring-[#1E1E1E]'
            : 'bg-black hover:bg-gray-800 focus:ring-black'} disabled:opacity-50 disabled:cursor-not-allowed`}>
            {loading ? (<motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"/>) : (<>
                <FaSignInAlt className="mr-2"/>
                Sign In
              </>)}
          </motion.button>
        </motion.form>
      </motion.div>
    </div>);
}
