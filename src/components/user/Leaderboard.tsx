"use client";

import { useState, useEffect, useMemo } from "react";
import { useDonors } from "@/hooks/useDonors";
import LoadingSpinner from "./minicomponents/LoadingSpinner";
import DonorMap from "./DonorMap";
import {
  FaMoon,
  FaSun,
  FaGift,
  FaFire,
  FaCheckCircle,
  FaSearch,
  FaTrophy,
  FaMedal,
  FaAward,
  FaSortAmountDown,
  FaSortAmountUp,
  FaCalendarAlt,
  FaChevronDown,
  FaChevronUp,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import type { ProductDonation } from "@/types";

type TimePeriod = "all" | "month" | "week";
type SortBy = "amount" | "date" | "products";
type SortOrder = "desc" | "asc";

const ITEMS_PER_PAGE = 10;

export default function Leaderboard() {
  const { donors, loading, error } = useDonors();
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("all");
  const [sortBy, setSortBy] = useState<SortBy>("amount");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [expandedDonor, setExpandedDonor] = useState<string | null>(null);
  const [donorPage, setDonorPage] = useState(1);
  const [matchedPage, setMatchedPage] = useState(1);

  // Apply dark mode to the entire page
  useEffect(() => {
    if (darkMode) {
      document.body.style.backgroundColor = "#121212";
      document.documentElement.style.backgroundColor = "#121212";
    } else {
      document.body.style.backgroundColor = "";
      document.documentElement.style.backgroundColor = "";
    }
  }, [darkMode]);

  // Filter donors by time period
  const filteredByTime = useMemo(() => {
    // Filter out donors with zero donations
    const validDonors = donors.filter((donor) => donor.total_donated_value > 0);

    if (timePeriod === "all") return validDonors;

    const now = new Date();
    const cutoffDate = new Date();

    if (timePeriod === "week") {
      const dayOfWeek = now.getDay();
      cutoffDate.setDate(now.getDate() - dayOfWeek);
      cutoffDate.setHours(0, 0, 0, 0);
    } else if (timePeriod === "month") {
      cutoffDate.setDate(1);
      cutoffDate.setHours(0, 0, 0, 0);
    }

    return validDonors
      .map((donor) => {
        const recentDonations =
          donor.product_donations?.filter(
            (pd) => new Date(pd.donation_date) >= cutoffDate
          ) || [];

        const recentValue = recentDonations.reduce(
          (sum, pd) => sum + (pd.products?.value || 0) * pd.quantity,
          0
        );

        const recentProducts = recentDonations.reduce(
          (sum, pd) => sum + pd.quantity,
          0
        );

        return {
          ...donor,
          product_donations: recentDonations,
          total_donated_value: recentValue,
          total_products_donated: recentProducts,
        };
      })
      .filter((donor) => donor.total_donated_value > 0);
  }, [donors, timePeriod]);

  // Filter donors by search query
  const searchFiltered = useMemo(() => {
    if (!searchQuery.trim()) return filteredByTime;

    const query = searchQuery.toLowerCase();
    return filteredByTime.filter(
      (donor) =>
        donor.name.toLowerCase().includes(query) ||
        donor.city?.toLowerCase().includes(query) ||
        donor.county?.toLowerCase().includes(query)
    );
  }, [filteredByTime, searchQuery]);

  // Sort donors
  const sortedDonors = useMemo(() => {
    const sorted = [...searchFiltered].sort((a, b) => {
      let comparison = 0;

      if (sortBy === "amount") {
        comparison = a.total_donated_value - b.total_donated_value;
      } else if (sortBy === "products") {
        comparison = a.total_products_donated - b.total_products_donated;
      } else if (sortBy === "date") {
        const aDate = a.product_donations?.[0]?.donation_date || "";
        const bDate = b.product_donations?.[0]?.donation_date || "";
        comparison = new Date(aDate).getTime() - new Date(bDate).getTime();
      }

      return sortOrder === "desc" ? -comparison : comparison;
    });

    return sorted;
  }, [searchFiltered, sortBy, sortOrder]);

  // Animated counter hook
  const useCounter = (end: number, duration: number = 2000) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let startTime: number | null = null;
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    }, [end, duration]);

    return count;
  };

  // Get all product donations with matched status
  const allProductDonations: (ProductDonation & {
    donorName: string;
    donorCity?: string;
  })[] = [];
  sortedDonors.forEach((donor) => {
    donor.product_donations?.forEach((donation) => {
      allProductDonations.push({
        ...donation,
        donorName: donor.name,
        donorCity: donor.city,
      });
    });
  });

  // Separate matched and unmatched donations
  const matchedDonations = allProductDonations.filter((d) => d.matched);
  const totalRaised = sortedDonors.reduce(
    (sum, d) => sum + d.total_donated_value,
    0
  );
  const totalProducts = sortedDonors.reduce(
    (sum, d) => sum + d.total_products_donated,
    0
  );
  const totalDonors = sortedDonors.length;
  const averageDonation =
    totalDonors > 0 ? Math.round(totalRaised / totalDonors) : 0;
  const matchingRate =
    allProductDonations.length > 0
      ? Math.round((matchedDonations.length / allProductDonations.length) * 100)
      : 0;

  // Animated counters
  const animatedTotal = useCounter(totalRaised);
  const animatedProducts = useCounter(totalProducts);
  const animatedDonors = useCounter(totalDonors);
  const animatedFDs = useCounter(
    new Set(matchedDonations.map((d) => d.fire_department_id)).size
  );

  // Pagination calculations
  const totalDonorPages = Math.ceil(sortedDonors.length / ITEMS_PER_PAGE);
  const totalMatchedPages = Math.ceil(matchedDonations.length / ITEMS_PER_PAGE);

  const paginatedDonors = sortedDonors.slice(
    (donorPage - 1) * ITEMS_PER_PAGE,
    donorPage * ITEMS_PER_PAGE
  );

  const paginatedMatched = matchedDonations.slice(
    (matchedPage - 1) * ITEMS_PER_PAGE,
    matchedPage * ITEMS_PER_PAGE
  );

  // Reset pages when filters change
  useEffect(() => {
    setDonorPage(1);
    setMatchedPage(1);
  }, [searchQuery, timePeriod, sortBy, sortOrder]);

  if (loading) {
    return <LoadingSpinner message="Loading leaderboard..." />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">Error</div>
          <div className="text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors ${
        darkMode ? "bg-[#121212]" : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <header
        className={`shadow ${
          darkMode ? "bg-[#1E1E1E] border-b border-[#333333]" : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1
              className={`text-3xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Donor Leaderboard
            </h1>
            <p
              className={`text-sm mt-1 ${
                darkMode ? "text-[#B3B3B3]" : "text-gray-600"
              }`}
            >
              Celebrating Our Generous Contributors
            </p>
          </div>
          {/* Dark Mode Toggle */}
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
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Search and Filters Bar */}
        <div
          className={`p-4 rounded-xl ${
            darkMode
              ? "bg-[#1E1E1E] border border-[#333333]"
              : "bg-white border border-gray-200"
          } shadow-sm`}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Box */}
            <div className="flex-1 relative">
              <FaSearch
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  darkMode ? "text-[#808080]" : "text-gray-400"
                }`}
              />
              <input
                type="text"
                placeholder="Search donors by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-[#242424] border-[#333333] text-white placeholder-[#808080]"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            {/* Time Period Filter */}
            <div className="flex gap-2">
              {(["all", "month", "week"] as TimePeriod[]).map((period) => (
                <button
                  key={period}
                  onClick={() => setTimePeriod(period)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    timePeriod === period
                      ? darkMode
                        ? "bg-[#3B82F6] text-white"
                        : "bg-blue-600 text-white"
                      : darkMode
                      ? "bg-[#242424] text-[#B3B3B3] hover:bg-[#333333]"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {period === "all"
                    ? "All Time"
                    : period === "month"
                    ? "This Month"
                    : "This Week"}
                </button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className={`px-4 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-[#242424] border-[#333333] text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="amount">Sort by Amount</option>
                <option value="date">Sort by Date</option>
                <option value="products">Sort by Products</option>
              </select>

              <button
                onClick={() =>
                  setSortOrder(sortOrder === "desc" ? "asc" : "desc")
                }
                className={`px-3 py-2 rounded-lg transition-colors ${
                  darkMode
                    ? "bg-[#242424] text-white hover:bg-[#333333]"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
                title={sortOrder === "desc" ? "Descending" : "Ascending"}
              >
                {sortOrder === "desc" ? (
                  <FaSortAmountDown />
                ) : (
                  <FaSortAmountUp />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div
            className={`p-6 rounded-xl ${
              darkMode
                ? "bg-[#1E1E1E] border border-[#333333]"
                : "bg-white border border-gray-200"
            } shadow-sm`}
          >
            <div
              className={`text-sm font-medium ${
                darkMode ? "text-[#B3B3B3]" : "text-gray-600"
              }`}
            >
              Total Raised
            </div>
            <div
              className={`text-3xl font-bold mt-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              ${animatedTotal.toLocaleString()}
            </div>
          </div>
          <div
            className={`p-6 rounded-xl ${
              darkMode
                ? "bg-[#1E1E1E] border border-[#333333]"
                : "bg-white border border-gray-200"
            } shadow-sm`}
          >
            <div
              className={`text-sm font-medium ${
                darkMode ? "text-[#B3B3B3]" : "text-gray-600"
              }`}
            >
              Products Donated
            </div>
            <div
              className={`text-3xl font-bold mt-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {animatedProducts.toLocaleString()}
            </div>
          </div>
          <div
            className={`p-6 rounded-xl ${
              darkMode
                ? "bg-[#1E1E1E] border border-[#333333]"
                : "bg-white border border-gray-200"
            } shadow-sm`}
          >
            <div
              className={`text-sm font-medium ${
                darkMode ? "text-[#B3B3B3]" : "text-gray-600"
              }`}
            >
              Total Donors
            </div>
            <div
              className={`text-3xl font-bold mt-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {animatedDonors}
            </div>
          </div>
          <div
            className={`p-6 rounded-xl ${
              darkMode
                ? "bg-[#1E1E1E] border border-[#333333]"
                : "bg-white border border-gray-200"
            } shadow-sm`}
          >
            <div
              className={`text-sm font-medium ${
                darkMode ? "text-[#B3B3B3]" : "text-gray-600"
              }`}
            >
              Avg Donation
            </div>
            <div
              className={`text-3xl font-bold mt-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              ${averageDonation.toLocaleString()}
            </div>
          </div>
          <div
            className={`p-6 rounded-xl ${
              darkMode
                ? "bg-[#1E1E1E] border border-[#333333]"
                : "bg-white border border-gray-200"
            } shadow-sm`}
          >
            <div
              className={`text-sm font-medium ${
                darkMode ? "text-[#B3B3B3]" : "text-gray-600"
              }`}
            >
              Fire Departments
            </div>
            <div
              className={`text-3xl font-bold mt-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {animatedFDs}
            </div>
          </div>
          <div
            className={`p-6 rounded-xl ${
              darkMode
                ? "bg-[#1E1E1E] border border-[#333333]"
                : "bg-white border border-gray-200"
            } shadow-sm`}
          >
            <div
              className={`text-sm font-medium ${
                darkMode ? "text-[#B3B3B3]" : "text-gray-600"
              }`}
            >
              Match Rate
            </div>
            <div
              className={`text-3xl font-bold mt-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {matchingRate}%
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div
          className={`rounded-xl overflow-hidden shadow-lg ${
            darkMode
              ? "bg-[#1E1E1E] border border-[#333333]"
              : "bg-white border border-gray-200"
          }`}
        >
          <div
            className={`px-6 py-4 border-b ${
              darkMode
                ? "border-[#333333] bg-[#242424]"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <h2
              className={`text-xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              🔥 Fire Departments Equipped
            </h2>
          </div>
          <DonorMap donors={donors} darkMode={darkMode} />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Latest Donors Column */}
          <div
            className={`rounded-xl overflow-hidden shadow-lg ${
              darkMode
                ? "bg-[#1E1E1E] border border-[#333333]"
                : "bg-white border border-gray-200"
            }`}
          >
            <div
              className={`px-6 py-4 border-b ${
                darkMode
                  ? "border-[#333333] bg-[#242424]"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <FaGift
                  className={`text-xl ${
                    darkMode ? "text-[#3B82F6]" : "text-black"
                  }`}
                />
                <h2
                  className={`text-xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Latest Donors
                </h2>
              </div>
            </div>
            <div
              className="divide-y max-h-[600px] overflow-y-auto scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {paginatedDonors.map((donor, index) => {
                const actualIndex = (donorPage - 1) * ITEMS_PER_PAGE + index;
                const isExpanded = expandedDonor === donor.id;
                const getMedalIcon = (position: number) => {
                  if (position === 0)
                    return <FaTrophy className="text-yellow-400" size={16} />;
                  if (position === 1)
                    return <FaMedal className="text-gray-400" size={16} />;
                  if (position === 2)
                    return <FaAward className="text-orange-400" size={16} />;
                  return null;
                };

                return (
                  <div
                    key={donor.id}
                    className={`px-6 py-4 transition-all ${
                      darkMode
                        ? "divide-[#333333] hover:bg-[#242424]"
                        : "divide-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className="flex items-start justify-between cursor-pointer"
                      onClick={() =>
                        setExpandedDonor(isExpanded ? null : donor.id)
                      }
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 relative ${
                            actualIndex < 3
                              ? actualIndex === 0
                                ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-900 shadow-lg shadow-yellow-500/50"
                                : actualIndex === 1
                                ? "bg-gradient-to-br from-gray-300 to-gray-500 text-gray-800 shadow-lg shadow-gray-500/50"
                                : "bg-gradient-to-br from-orange-300 to-orange-500 text-orange-800 shadow-lg shadow-orange-500/50"
                              : darkMode
                              ? "bg-[#3B82F6] text-white"
                              : "bg-black text-white"
                          }`}
                        >
                          {actualIndex + 1}
                          {actualIndex < 3 && (
                            <div className="absolute -top-1 -right-1">
                              {getMedalIcon(actualIndex)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div
                              className={`font-semibold ${
                                darkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {donor.name}
                            </div>
                            {actualIndex < 3 && (
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                  actualIndex === 0
                                    ? "bg-yellow-400/20 text-yellow-400"
                                    : actualIndex === 1
                                    ? "bg-gray-400/20 text-gray-400"
                                    : "bg-orange-400/20 text-orange-400"
                                }`}
                              >
                                Top {actualIndex + 1}
                              </span>
                            )}
                          </div>
                          <div
                            className={`text-sm ${
                              darkMode ? "text-[#808080]" : "text-gray-500"
                            }`}
                          >
                            {donor.city && donor.county
                              ? `${donor.city}, ${donor.county}`
                              : donor.county || donor.city || "California"}
                          </div>
                          {!isExpanded &&
                            donor.product_donations &&
                            donor.product_donations.length > 0 && (
                              <div
                                className={`text-xs mt-1 ${
                                  darkMode ? "text-[#B3B3B3]" : "text-gray-600"
                                }`}
                              >
                                {donor.product_donations
                                  .map((pd) => pd.products?.name)
                                  .filter(Boolean)
                                  .slice(0, 2)
                                  .join(", ")}
                                {donor.product_donations.length > 2 && "..."}
                              </div>
                            )}
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <div>
                          <div
                            className={`text-lg font-bold ${
                              darkMode ? "text-[#22C55E]" : "text-green-600"
                            }`}
                          >
                            ${donor.total_donated_value.toLocaleString()}
                          </div>
                          <div
                            className={`text-xs ${
                              darkMode ? "text-[#808080]" : "text-gray-500"
                            }`}
                          >
                            {donor.total_products_donated} product
                            {donor.total_products_donated !== 1 ? "s" : ""}
                          </div>
                        </div>
                        {isExpanded ? (
                          <FaChevronUp
                            className={
                              darkMode ? "text-[#808080]" : "text-gray-500"
                            }
                          />
                        ) : (
                          <FaChevronDown
                            className={
                              darkMode ? "text-[#808080]" : "text-gray-500"
                            }
                          />
                        )}
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded &&
                      donor.product_donations &&
                      donor.product_donations.length > 0 && (
                        <div
                          className={`mt-4 pt-4 border-t ${
                            darkMode ? "border-[#333333]" : "border-gray-200"
                          } space-y-2`}
                        >
                          <div
                            className={`text-sm font-semibold ${
                              darkMode ? "text-[#B3B3B3]" : "text-gray-700"
                            } mb-2`}
                          >
                            Donation History
                          </div>
                          <div
                            className="max-h-[300px] overflow-y-auto space-y-2 scrollbar-hide"
                            style={{
                              scrollbarWidth: "none",
                              msOverflowStyle: "none",
                            }}
                          >
                            {donor.product_donations.map((pd, pdIndex) => (
                              <div
                                key={pdIndex}
                                className={`flex justify-between items-center text-sm p-2 rounded ${
                                  darkMode ? "bg-[#242424]" : "bg-gray-50"
                                }`}
                              >
                                <div className="flex-1">
                                  <div
                                    className={`font-medium ${
                                      darkMode ? "text-white" : "text-gray-900"
                                    }`}
                                  >
                                    {pd.products?.name || "Product"} ×{" "}
                                    {pd.quantity}
                                  </div>
                                  {pd.products?.description && (
                                    <div
                                      className={`text-xs mt-1 italic ${
                                        darkMode
                                          ? "text-[#B3B3B3]"
                                          : "text-gray-600"
                                      }`}
                                    >
                                      {pd.products.description}
                                    </div>
                                  )}
                                  <div
                                    className={`text-xs ${
                                      darkMode
                                        ? "text-[#808080]"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {new Date(
                                      pd.donation_date
                                    ).toLocaleDateString()}
                                  </div>
                                  {pd.matched && (
                                    <div className={`mt-1`}>
                                      <span
                                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                          darkMode
                                            ? "bg-[#22C55E]/20 text-[#22C55E]"
                                            : "bg-green-100 text-green-700"
                                        }`}
                                      >
                                        ✓ Matched
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div
                                  className={`font-bold ${
                                    darkMode
                                      ? "text-[#22C55E]"
                                      : "text-green-600"
                                  }`}
                                >
                                  $
                                  {(
                                    (pd.products?.value || 0) * pd.quantity
                                  ).toLocaleString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                );
              })}
              {sortedDonors.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <div
                    className={`text-sm ${
                      darkMode ? "text-[#808080]" : "text-gray-500"
                    }`}
                  >
                    No donors found matching your filters
                  </div>
                </div>
              )}
            </div>

            {/* Pagination for Donors */}
            {totalDonorPages > 1 && (
              <div
                className={`px-6 py-4 border-t ${
                  darkMode
                    ? "border-[#333333] bg-[#242424]"
                    : "border-gray-200 bg-gray-50"
                } flex items-center justify-between`}
              >
                <div
                  className={`text-sm ${
                    darkMode ? "text-[#B3B3B3]" : "text-gray-600"
                  }`}
                >
                  Showing {(donorPage - 1) * ITEMS_PER_PAGE + 1}-
                  {Math.min(donorPage * ITEMS_PER_PAGE, sortedDonors.length)} of{" "}
                  {sortedDonors.length}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDonorPage((p) => Math.max(1, p - 1))}
                    disabled={donorPage === 1}
                    className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                      donorPage === 1
                        ? darkMode
                          ? "bg-[#1E1E1E] text-[#666666] cursor-not-allowed"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : darkMode
                        ? "bg-[#242424] text-white hover:bg-[#333333]"
                        : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                    }`}
                  >
                    <FaChevronLeft size={12} />
                    Prev
                  </button>

                  <div
                    className={`text-sm font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Page {donorPage} of {totalDonorPages}
                  </div>

                  <button
                    onClick={() =>
                      setDonorPage((p) => Math.min(totalDonorPages, p + 1))
                    }
                    disabled={donorPage === totalDonorPages}
                    className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                      donorPage === totalDonorPages
                        ? darkMode
                          ? "bg-[#1E1E1E] text-[#666666] cursor-not-allowed"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : darkMode
                        ? "bg-[#242424] text-white hover:bg-[#333333]"
                        : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                    }`}
                  >
                    Next
                    <FaChevronRight size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Matched Donations Column */}
          <div
            className={`rounded-xl overflow-hidden shadow-lg ${
              darkMode
                ? "bg-[#1E1E1E] border border-[#333333]"
                : "bg-white border border-gray-200"
            }`}
          >
            <div
              className={`px-6 py-4 border-b ${
                darkMode
                  ? "border-[#333333] bg-[#242424]"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <FaFire
                  className={`text-xl ${
                    darkMode ? "text-orange-500" : "text-orange-600"
                  }`}
                />
                <h2
                  className={`text-xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Matched Donations
                </h2>
              </div>
            </div>
            <div
              className="divide-y max-h-[600px] overflow-y-auto scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {paginatedMatched.map((donation, index) => (
                <div
                  key={donation.id}
                  className={`px-6 py-4 transition-colors ${
                    darkMode
                      ? "divide-[#333333] hover:bg-[#242424]"
                      : "divide-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src="/assets/fire.png"
                      alt="Fire Department Badge"
                      className="w-20 h-15 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`font-semibold ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {donation.fire_departments?.name || "Fire Department"}
                        </span>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ml-auto ${
                            darkMode
                              ? "bg-[#22C55E]/20 text-[#22C55E]"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          MATCHED
                        </span>
                      </div>
                      <div
                        className={`text-sm ${
                          darkMode ? "text-[#B3B3B3]" : "text-gray-600"
                        }`}
                      >
                        Dialed {donation.products?.name || "Product"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-lg font-bold ${
                          darkMode ? "text-[#22C55E]" : "text-green-600"
                        }`}
                      >
                        $
                        {(
                          (donation.products?.value || 0) * donation.quantity
                        ).toLocaleString()}{" "}
                        Donated
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {matchedDonations.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <div
                    className={`text-sm ${
                      darkMode ? "text-[#808080]" : "text-gray-500"
                    }`}
                  >
                    No matched donations yet
                  </div>
                </div>
              )}
            </div>

            {/* Pagination for Matched Donations */}
            {totalMatchedPages > 1 && (
              <div
                className={`px-6 py-4 border-t ${
                  darkMode
                    ? "border-[#333333] bg-[#242424]"
                    : "border-gray-200 bg-gray-50"
                } flex items-center justify-between`}
              >
                <div
                  className={`text-sm ${
                    darkMode ? "text-[#B3B3B3]" : "text-gray-600"
                  }`}
                >
                  Showing {(matchedPage - 1) * ITEMS_PER_PAGE + 1}-
                  {Math.min(
                    matchedPage * ITEMS_PER_PAGE,
                    matchedDonations.length
                  )}{" "}
                  of {matchedDonations.length}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMatchedPage((p) => Math.max(1, p - 1))}
                    disabled={matchedPage === 1}
                    className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                      matchedPage === 1
                        ? darkMode
                          ? "bg-[#1E1E1E] text-[#666666] cursor-not-allowed"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : darkMode
                        ? "bg-[#242424] text-white hover:bg-[#333333]"
                        : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                    }`}
                  >
                    <FaChevronLeft size={12} />
                    Prev
                  </button>

                  <div
                    className={`text-sm font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Page {matchedPage} of {totalMatchedPages}
                  </div>

                  <button
                    onClick={() =>
                      setMatchedPage((p) => Math.min(totalMatchedPages, p + 1))
                    }
                    disabled={matchedPage === totalMatchedPages}
                    className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                      matchedPage === totalMatchedPages
                        ? darkMode
                          ? "bg-[#1E1E1E] text-[#666666] cursor-not-allowed"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : darkMode
                        ? "bg-[#242424] text-white hover:bg-[#333333]"
                        : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                    }`}
                  >
                    Next
                    <FaChevronRight size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
