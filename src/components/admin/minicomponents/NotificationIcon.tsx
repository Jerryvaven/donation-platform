'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell } from 'react-icons/fa';
interface ActivityItem {
    id: string;
    type: 'donation' | 'match' | 'update' | 'goal';
    message: string;
    timestamp: string;
    icon: string;
    color: string;
}
interface NotificationIconProps {
    notificationActivity: ActivityItem[];
    showNotifications: boolean;
    setShowNotifications: (show: boolean) => void;
    unreadNotifications: boolean;
    setUnreadNotifications: (unread: boolean) => void;
    lastNotificationCheck: string;
    setLastNotificationCheck: (time: string) => void;
    darkMode?: boolean;
}
export default function NotificationIcon({ notificationActivity, showNotifications, setShowNotifications, unreadNotifications, setUnreadNotifications, lastNotificationCheck, setLastNotificationCheck, darkMode = false }: NotificationIconProps) {
    const notificationRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };
        if (showNotifications) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNotifications, setShowNotifications]);
    return (<div className="relative" ref={notificationRef}>
      <motion.button onClick={() => {
            setShowNotifications(!showNotifications);
            if (!showNotifications) {
                setUnreadNotifications(false);
                const now = new Date().toISOString();
                localStorage.setItem('lastNotificationCheck', now);
                setLastNotificationCheck(now);
            }
        }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative p-2.5 rounded-lg transition-colors text-[#B3B3B3] hover:text-white hover:bg-[#242424]">
        <FaBell className="text-lg"/>
        {unreadNotifications && notificationActivity.length > 0 && (<motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"/>)}
      </motion.button>

      
      <AnimatePresence>
        {showNotifications && (<motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.2 }} className="absolute right-0 mt-2 w-80 rounded-xl shadow-xl border overflow-hidden z-50 bg-[#1E1E1E] border-[#333333]">
            <div className="p-4 border-b border-[#333333] bg-[#242424]">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">Notifications</h3>
                {notificationActivity.length > 0 && (<button onClick={() => {
                    setShowNotifications(false);
                }} className="text-xs font-medium hover:underline text-[#EF4444] hover:text-[#DC2626]">
                    Clear all
                  </button>)}
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notificationActivity.length === 0 ? (<div className="p-6 text-center text-sm text-[#808080]">
                  No notifications yet
                </div>) : (<div className="divide-y divide-[#333333]">
                  {notificationActivity.map((activity) => (<motion.div key={activity.id} whileHover={{ backgroundColor: '#242424' }} className="p-4 cursor-pointer transition-colors">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          {activity.type === 'donation' && <span className="text-xl">💵</span>}
                          {activity.type === 'match' && <span className="text-xl">🤝</span>}
                          {activity.type === 'goal' && <span className="text-xl">🎯</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium leading-snug mb-1 text-white">
                            {activity.message}
                          </p>
                          <p className="text-xs text-[#808080]">{activity.timestamp}</p>
                        </div>
                      </div>
                    </motion.div>))}
                </div>)}
            </div>
            {notificationActivity.length > 0 && (<div className="p-3 border-t border-[#333333] bg-[#242424]">
                <button className="w-full text-center text-sm font-medium text-[#3B82F6] hover:text-[#2563EB]">
                  View all notifications
                </button>
              </div>)}
          </motion.div>)}
      </AnimatePresence>
    </div>);
}
