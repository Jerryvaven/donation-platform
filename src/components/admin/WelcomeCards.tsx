"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  FaMoneyBillWave,
  FaUsers,
  FaHandshake,
  FaFire,
  FaBox,
  FaChevronDown,
  FaChevronUp,
  FaInfoCircle,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

interface DashboardStats {
  totalDonatedValue: number;
  totalProductsDonated: number;
  totalDonors: number;
  matchedProducts: number;
  saunaDonated: number;
  coldPlungeDonated: number;
  fireDepartmentsReached: number;
  todaysProducts: number;
  newDonorsToday: number;
  matchRate: number;
}

interface WelcomeCardsProps {
  stats: DashboardStats;
  formatCurrency: (amount: number) => string;
  darkMode: boolean;
}

export default function WelcomeCards({
  stats,
  formatCurrency,
  darkMode,
}: WelcomeCardsProps) {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const toggleCard = (cardId: string) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  return (
    <>
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <h2
          className={`text-2xl font-bold mb-1 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Welcome back, Admin
        </h2>
        <p className={darkMode ? "text-[#B3B3B3]" : "text-gray-600"}>
          Here's what's happening with your donations today.
        </p>
      </motion.div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Donations */}
        <div onClick={() => toggleCard("donations")} className="cursor-pointer">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -2 }}
            className={`rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 border group relative overflow-hidden ${
              darkMode
                ? "bg-[#242424] border-[#333333]"
                : "bg-white border-gray-100"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <motion.div
                  className={`p-3 rounded-lg ${
                    darkMode ? "bg-[#1E1E1E]" : "bg-gray-50"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.15 }}
                >
                  <FaMoneyBillWave
                    className={`text-2xl group-hover:text-green-500 transition-colors duration-200 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  />
                </motion.div>
                <div>
                  <h3
                    className={`text-sm font-medium ${
                      darkMode ? "text-[#B3B3B3]" : "text-gray-600"
                    }`}
                  >
                    Total Product Value
                  </h3>
                  <p
                    className={`text-xs ${
                      darkMode ? "text-[#808080]" : "text-gray-400"
                    }`}
                  >
                    {stats.totalProductsDonated} products donated
                  </p>
                </div>
              </div>
              <motion.div
                animate={{ rotate: expandedCards.has("donations") ? 180 : 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <FaChevronDown
                  className={`text-sm ${
                    darkMode ? "text-[#808080]" : "text-gray-400"
                  }`}
                />
              </motion.div>
            </div>
            <motion.div
              className={`text-3xl font-bold mb-1 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {formatCurrency(stats.totalDonatedValue)}
            </motion.div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30">
                <FaArrowUp className="text-xs text-green-600 dark:text-green-400" />
                <span className="text-xs font-medium text-green-600 dark:text-green-400">
                  12.5%
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                vs last month
              </span>
            </div>
            <AnimatePresence
              key={`donations-${expandedCards.has("donations")}`}
            >
              {expandedCards.has("donations") && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{
                    duration: 0.25,
                    ease: "easeOut",
                  }}
                  className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span
                        className={
                          darkMode ? "text-[#B3B3B3]" : "text-gray-600"
                        }
                      >
                        Today's Value:
                      </span>
                      <span
                        className={`font-medium ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {formatCurrency(stats.totalDonatedValue * 0.1)}{" "}
                        {/* Placeholder calculation */}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span
                        className={
                          darkMode ? "text-[#B3B3B3]" : "text-gray-600"
                        }
                      >
                        This Month:
                      </span>
                      <span
                        className={`font-medium ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {formatCurrency(stats.totalDonatedValue * 0.8)}{" "}
                        {/* Placeholder calculation */}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span
                        className={
                          darkMode ? "text-[#B3B3B3]" : "text-gray-600"
                        }
                      >
                        Avg. per Product:
                      </span>
                      <span
                        className={`font-medium ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {formatCurrency(
                          stats.totalDonatedValue / stats.totalProductsDonated
                        )}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Total Donors */}
        <div onClick={() => toggleCard("donors")} className="cursor-pointer">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -2 }}
            className={`rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 border group relative overflow-hidden ${
              darkMode
                ? "bg-[#242424] border-[#333333]"
                : "bg-white border-gray-100"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <motion.div
                  className={`p-3 rounded-lg ${
                    darkMode ? "bg-[#1E1E1E]" : "bg-gray-50"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.15 }}
                >
                  <FaUsers
                    className={`text-2xl group-hover:text-blue-500 transition-colors duration-200 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  />
                </motion.div>
                <div>
                  <h3
                    className={`text-sm font-medium ${
                      darkMode ? "text-[#B3B3B3]" : "text-gray-600"
                    }`}
                  >
                    Total Donors
                  </h3>
                  <p
                    className={`text-xs ${
                      darkMode ? "text-[#808080]" : "text-gray-400"
                    }`}
                  >
                    new this month
                  </p>
                </div>
              </div>
              <motion.div
                animate={{ rotate: expandedCards.has("donors") ? 180 : 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <FaChevronDown
                  className={`text-sm ${
                    darkMode ? "text-[#808080]" : "text-gray-400"
                  }`}
                />
              </motion.div>
            </div>
            <motion.div
              className={`text-3xl font-bold mb-1 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {stats.totalDonors}
            </motion.div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30">
                <FaArrowUp className="text-xs text-green-600 dark:text-green-400" />
                <span className="text-xs font-medium text-green-600 dark:text-green-400">
                  8.3%
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                vs last month
              </span>
            </div>
            <AnimatePresence key={`donors-${expandedCards.has("donors")}`}>
              {expandedCards.has("donors") && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{
                    duration: 0.25,
                    ease: "easeOut",
                  }}
                  className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span
                        className={
                          darkMode ? "text-[#B3B3B3]" : "text-gray-600"
                        }
                      >
                        New Today:
                      </span>
                      <span
                        className={`font-medium ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {stats.newDonorsToday}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span
                        className={
                          darkMode ? "text-[#B3B3B3]" : "text-gray-600"
                        }
                      >
                        This Month:
                      </span>
                      <span
                        className={`font-medium ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {stats.totalDonors}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span
                        className={
                          darkMode ? "text-[#B3B3B3]" : "text-gray-600"
                        }
                      >
                        Active Rate:
                      </span>
                      <span
                        className={`font-medium ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        95.2%
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Matched Funds */}
        <div onClick={() => toggleCard("matched")} className="cursor-pointer">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ y: -2 }}
            className={`rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 border group relative overflow-hidden ${
              darkMode
                ? "bg-[#242424] border-[#333333]"
                : "bg-white border-gray-100"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <motion.div
                  className={`p-3 rounded-lg ${
                    darkMode ? "bg-[#1E1E1E]" : "bg-gray-50"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.15 }}
                >
                  <FaHandshake
                    className={`text-2xl group-hover:text-purple-500 transition-colors duration-200 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  />
                </motion.div>
                <div>
                  <h3
                    className={`text-sm font-medium ${
                      darkMode ? "text-[#B3B3B3]" : "text-gray-600"
                    }`}
                  >
                    Matched Products
                  </h3>
                  <p
                    className={`text-xs ${
                      darkMode ? "text-[#808080]" : "text-gray-400"
                    }`}
                  >
                    {stats.matchRate.toFixed(1)}% match rate
                  </p>
                </div>
              </div>
              <motion.div
                animate={{ rotate: expandedCards.has("matched") ? 180 : 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <FaChevronDown
                  className={`text-sm ${
                    darkMode ? "text-[#808080]" : "text-gray-400"
                  }`}
                />
              </motion.div>
            </div>
            <motion.div
              className={`text-3xl font-bold mb-1 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {stats.matchedProducts}
            </motion.div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30">
                <FaArrowUp className="text-xs text-green-600 dark:text-green-400" />
                <span className="text-xs font-medium text-green-600 dark:text-green-400">
                  15.7%
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                vs last month
              </span>
            </div>
            <AnimatePresence key={`matched-${expandedCards.has("matched")}`}>
              {expandedCards.has("matched") && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{
                    duration: 0.25,
                    ease: "easeOut",
                  }}
                  className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span
                        className={
                          darkMode ? "text-[#B3B3B3]" : "text-gray-600"
                        }
                      >
                        Saunas:
                      </span>
                      <span
                        className={`font-medium ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {stats.saunaDonated}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span
                        className={
                          darkMode ? "text-[#B3B3B3]" : "text-gray-600"
                        }
                      >
                        Cold Plunges:
                      </span>
                      <span
                        className={`font-medium ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {stats.coldPlungeDonated}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span
                        className={
                          darkMode ? "text-[#B3B3B3]" : "text-gray-600"
                        }
                      >
                        Match Rate:
                      </span>
                      <span
                        className={`font-medium ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {stats.matchRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Counties Reached */}
        <div
          onClick={() => toggleCard("departments")}
          className="cursor-pointer"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ y: -2 }}
            className={`rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 border group relative overflow-hidden ${
              darkMode
                ? "bg-[#242424] border-[#333333]"
                : "bg-white border-gray-100"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <motion.div
                  className={`p-3 rounded-lg ${
                    darkMode ? "bg-[#1E1E1E]" : "bg-gray-50"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.15 }}
                >
                  <FaFire
                    className={`text-2xl group-hover:text-red-500 transition-colors duration-200 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  />
                </motion.div>
                <div>
                  <h3
                    className={`text-sm font-medium ${
                      darkMode ? "text-[#B3B3B3]" : "text-gray-600"
                    }`}
                  >
                    Fire Departments
                  </h3>
                  <p
                    className={`text-xs ${
                      darkMode ? "text-[#808080]" : "text-gray-400"
                    }`}
                  >
                    receiving products
                  </p>
                </div>
              </div>
              <motion.div
                animate={{ rotate: expandedCards.has("departments") ? 180 : 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <FaChevronDown
                  className={`text-sm ${
                    darkMode ? "text-[#808080]" : "text-gray-400"
                  }`}
                />
              </motion.div>
            </div>
            <motion.div
              className={`text-3xl font-bold mb-1 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {stats.fireDepartmentsReached}
            </motion.div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30">
                <FaArrowUp className="text-xs text-green-600 dark:text-green-400" />
                <span className="text-xs font-medium text-green-600 dark:text-green-400">
                  6.2%
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                vs last month
              </span>
            </div>
            <AnimatePresence
              key={`departments-${expandedCards.has("departments")}`}
            >
              {expandedCards.has("departments") && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{
                    duration: 0.25,
                    ease: "easeOut",
                  }}
                  className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span
                        className={
                          darkMode ? "text-[#B3B3B3]" : "text-gray-600"
                        }
                      >
                        Active Departments:
                      </span>
                      <span
                        className={`font-medium ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {stats.fireDepartmentsReached}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span
                        className={
                          darkMode ? "text-[#B3B3B3]" : "text-gray-600"
                        }
                      >
                        Products Delivered:
                      </span>
                      <span
                        className={`font-medium ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {stats.totalProductsDonated}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span
                        className={
                          darkMode ? "text-[#B3B3B3]" : "text-gray-600"
                        }
                      >
                        Avg. per Department:
                      </span>
                      <span
                        className={`font-medium ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {(
                          stats.totalProductsDonated /
                          stats.fireDepartmentsReached
                        ).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </>
  );
}
