"use client";

import { useState, useEffect, useMemo, useRef } from "react";
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
  FaSortAmountDown,
  FaSortAmountUp,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import type { ProductDonation } from "@/types";
import { formatCurrency } from "@/lib/utils";

type TimePeriod = "all" | "month" | "week";
type SortBy = "amount" | "date" | "products";
type SortOrder = "desc" | "asc";

const ITEMS_PER_PAGE = 10;

export default function Leaderboard() {
  const { donors, loading, initialLoading, error } = useDonors();
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("all");
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [expandedDonor, setExpandedDonor] = useState<string | null>(null);
  const [donorPage, setDonorPage] = useState(1);
  const [matchedPage, setMatchedPage] = useState(1);
  const [donationPage, setDonationPage] = useState(1);

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
        donor.state?.toLowerCase().includes(query)
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
        // Find the latest donation date for each donor
        const aLatestDate =
          a.product_donations?.reduce((latest, pd) => {
            const pdDate = new Date(pd.donation_date).getTime();
            return pdDate > latest ? pdDate : latest;
          }, 0) || 0;
        const bLatestDate =
          b.product_donations?.reduce((latest, pd) => {
            const pdDate = new Date(pd.donation_date).getTime();
            return pdDate > latest ? pdDate : latest;
          }, 0) || 0;
        comparison = aLatestDate - bLatestDate;
      }

      return sortOrder === "desc" ? -comparison : comparison;
    });

    return sorted;
  }, [searchFiltered, sortBy, sortOrder]);

  // Animated counter hook
  const useCounter = (end: number, duration: number = 2000) => {
    const [count, setCount] = useState(end);
    const currentCountRef = useRef(end);

    useEffect(() => {
      const start = currentCountRef.current;
      if (start === end) return;

      let startTime: number | null = null;
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const newCount = Math.floor(start + progress * (end - start));
        setCount(newCount);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          currentCountRef.current = end;
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

  // Sort donations for latest donations list
  const sortedDonationsByDate = useMemo(() => {
    return [...allProductDonations].sort((a, b) => {
      let comparison = 0;

      if (sortBy === "amount") {
        comparison = ((a.products?.value || 0) * a.quantity) - ((b.products?.value || 0) * b.quantity);
      } else if (sortBy === "products") {
        comparison = a.quantity - b.quantity;
      } else if (sortBy === "date") {
        comparison = new Date(a.donation_date).getTime() - new Date(b.donation_date).getTime();
      }

      return sortOrder === "desc" ? -comparison : comparison;
    });
  }, [allProductDonations, sortBy, sortOrder]);

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

  // Animated counters
  const animatedTotal = useCounter(totalRaised);
  const animatedProducts = useCounter(totalProducts);
  const animatedFDs = useCounter(
    new Set(matchedDonations.map((d) => d.fire_department_id)).size
  );

  // Pagination calculations
  const totalDonorPages = Math.ceil(sortedDonors.length / ITEMS_PER_PAGE);
  const totalMatchedPages = Math.ceil(matchedDonations.length / ITEMS_PER_PAGE);
  const totalDonationPages = Math.ceil(
    sortedDonationsByDate.length / ITEMS_PER_PAGE
  );

  const paginatedDonors = sortedDonors.slice(
    (donorPage - 1) * ITEMS_PER_PAGE,
    donorPage * ITEMS_PER_PAGE
  );

  const paginatedMatched = matchedDonations.slice(
    (matchedPage - 1) * ITEMS_PER_PAGE,
    matchedPage * ITEMS_PER_PAGE
  );

  const paginatedDonations = sortedDonationsByDate.slice(
    (donationPage - 1) * ITEMS_PER_PAGE,
    donationPage * ITEMS_PER_PAGE
  );

  // Reset pages when filters change
  useEffect(() => {
    setDonorPage(1);
    setMatchedPage(1);
    setDonationPage(1);
  }, [searchQuery, timePeriod, sortBy, sortOrder]);

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

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
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
        <div className="max-w-7xl mx-auto px-2 sm:px-2 lg:px-2 flex justify-between items-center">
          <div className="flex items-center ">
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
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
              {paginatedDonations.map((donation, index) => {
                const actualIndex = (donationPage - 1) * ITEMS_PER_PAGE + index;

                return (
                  <div
                    key={`${donation.id}-${index}`}
                    className={`px-6 py-4 transition-all ${
                      darkMode
                        ? "divide-[#333333] hover:bg-[#242424]"
                        : "divide-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
                        {donation.products?.image_url ? (
                          <img
                            src={donation.products.image_url}
                            alt={donation.products.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div
                            className={`w-full h-full flex items-center justify-center font-semibold text-white ${
                              darkMode ? "bg-[#3B82F6]" : "bg-gray-900"
                            }`}
                          >
                            {donation.products?.name.charAt(0).toUpperCase() ||
                              "P"}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div
                          className={`font-semibold ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {donation.donorName}
                        </div>
                        <div
                          className={`text-sm ${
                            darkMode ? "text-[#B3B3B3]" : "text-gray-600"
                          }`}
                        >
                          Donated {donation.products?.name || "Product"} ×{" "}
                          {donation.quantity}
                        </div>
                        <div
                          className={`text-xs ${
                            darkMode ? "text-[#808080]" : "text-gray-500"
                          }`}
                        >
                          {new Date(donation.donation_date).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-lg font-bold ${
                            darkMode ? "text-[#22C55E]" : "text-green-600"
                          }`}
                        >
                          {formatCurrency((donation.products?.value || 0) * donation.quantity)}
                        </div>
                        <div
                          className={`text-xs ${
                            donation.matched
                              ? darkMode
                                ? "text-[#22C55E]"
                                : "text-green-600"
                              : darkMode
                              ? "text-[#808080]"
                              : "text-gray-500"
                          }`}
                        >
                          {donation.matched ? "Matched" : "Pending"}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {sortedDonationsByDate.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <div
                    className={`text-sm ${
                      darkMode ? "text-[#808080]" : "text-gray-500"
                    }`}
                  >
                    No donations found matching your filters
                  </div>
                </div>
              )}
            </div>

            {/* Pagination for Donations */}
            {totalDonationPages > 1 &&
              sortedDonationsByDate.length % ITEMS_PER_PAGE !== 1 && (
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
                    Showing {(donationPage - 1) * ITEMS_PER_PAGE + 1}-
                    {Math.min(
                      donationPage * ITEMS_PER_PAGE,
                      sortedDonationsByDate.length
                    )}{" "}
                    of {sortedDonationsByDate.length}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDonationPage((p) => Math.max(1, p - 1))}
                      disabled={donationPage === 1}
                      className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                        donationPage === 1
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
                      Page {donationPage} of {totalDonationPages}
                    </div>

                    <button
                      onClick={() =>
                        setDonationPage((p) =>
                          Math.min(totalDonationPages, p + 1)
                        )
                      }
                      disabled={donationPage === totalDonationPages}
                      className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                        donationPage === totalDonationPages
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
            {totalMatchedPages > 1 &&
              matchedDonations.length % ITEMS_PER_PAGE !== 1 && (
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
                        setMatchedPage((p) =>
                          Math.min(totalMatchedPages, p + 1)
                        )
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
