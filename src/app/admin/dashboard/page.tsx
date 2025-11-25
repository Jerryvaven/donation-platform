"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUserPlus,
  FaFileExport,
  FaFileUpload,
  FaChartBar,
  FaSync,
  FaCheckCircle,
  FaTimes,
  FaInfoCircle,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import Navbar from "@/components/admin/Navbar";
import WelcomeCards from "@/components/admin/WelcomeCards";
import DonorTrends from "@/components/admin/DonorTrends";
import RecentDonors from "@/components/admin/RecentDonors";
import RecentActivity from "@/components/admin/RecentActivity";
import AllProductsList from "@/components/admin/AllProductsList";
import AllFireStationsList from "@/components/admin/AllFireStationsList";
import AddProductModal from "@/components/admin/AddProductModal";
import AddFireStationModal from "@/components/admin/AddFireStationModal";
import AddProductDonationModal from "@/components/admin/AddDonationModal";
import MatchDonationModal from "@/components/admin/MatchDonationModal";
import AccessDeniedModal from "@/components/admin/minicomponents/AccessDeniedModal";
import DeleteConfirmModal from "@/components/admin/minicomponents/DeleteConfirmModal";
import { useDashboard } from "@/hooks/useDashboard";

export default function AdminDashboard() {
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [currentDonation, setCurrentDonation] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddFireStationModal, setShowAddFireStationModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [currentFireStation, setCurrentFireStation] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState<{
    type: "product" | "fireStation";
    item: any;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [productsRefreshTrigger, setProductsRefreshTrigger] = useState(0);
  const [fireStationsRefreshTrigger, setFireStationsRefreshTrigger] =
    useState(0);

  const {
    // State
    user,
    stats,
    recentDonors,
    recentActivity,
    notificationActivity,
    monthlyData,
    loading,
    showAddDonorModal,
    setShowAddDonorModal,
    showAccessDeniedModal,
    setShowAccessDeniedModal,
    message,
    setMessage,
    showNotifications,
    setShowNotifications,
    unreadNotifications,
    setUnreadNotifications,
    lastNotificationCheck,
    setLastNotificationCheck,
    notificationRef,
    modalRef,

    // Functions
    formatCurrency,
    handleQuickMatch,
    handleExport,
    handleImport,
    handleReport,
    refreshData,
    showMatchModal,
    setShowMatchModal,
    donationToMatch,
    setDonationToMatch,
  } = useDashboard();

  // Local refresh functions for specific containers
  const refreshProducts = () => {
    setProductsRefreshTrigger((prev) => prev + 1);
  };

  const refreshFireStations = () => {
    setFireStationsRefreshTrigger((prev) => prev + 1);
  };

  // Prevent background scrolling when modals are open
  useEffect(() => {
    const isAnyModalOpen =
      showAddDonorModal ||
      showAddProductModal ||
      showAddFireStationModal ||
      showDeleteModal ||
      showMatchModal ||
      showAccessDeniedModal;

    if (isAnyModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [
    showAddDonorModal,
    showAddProductModal,
    showAddFireStationModal,
    showDeleteModal,
    showMatchModal,
    showAccessDeniedModal,
  ]);

  // Delete functions
  const handleDeleteProduct = async () => {
    if (!deleteItem || deleteItem.type !== "product") return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/products/${deleteItem.item.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Product deleted successfully!" });
        refreshProducts();
      } else {
        const error = await response.json();
        setMessage({
          type: "error",
          text: error.error || "Failed to delete product",
        });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setMessage({ type: "error", text: "Failed to delete product" });
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setDeleteItem(null);
    }
  };

  const handleDeleteFireStation = async () => {
    if (!deleteItem || deleteItem.type !== "fireStation") return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/fire-departments/${deleteItem.item.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Fire station deleted successfully!",
        });
        refreshFireStations();
      } else {
        const error = await response.json();
        setMessage({
          type: "error",
          text: error.error || "Failed to delete fire station",
        });
      }
    } catch (error) {
      console.error("Error deleting fire station:", error);
      setMessage({ type: "error", text: "Failed to delete fire station" });
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setDeleteItem(null);
    }
  };

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

  if (!user)
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? "bg-[#121212]" : "bg-gray-50"
        }`}
      >
        <div
          className={`flex items-center gap-3 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          <FaSync
            className={`animate-spin text-2xl ${
              darkMode ? "text-[#3B82F6]" : "text-black"
            }`}
          />
          <span className="text-lg">Loading...</span>
        </div>
      </div>
    );

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-[#121212] text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Navbar
        notificationActivity={notificationActivity}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        unreadNotifications={unreadNotifications}
        setUnreadNotifications={setUnreadNotifications}
        lastNotificationCheck={lastNotificationCheck}
        setLastNotificationCheck={setLastNotificationCheck}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <WelcomeCards
          stats={stats}
          formatCurrency={formatCurrency}
          darkMode={darkMode}
        />

        <DonorTrends monthlyData={monthlyData} darkMode={darkMode} />

        {/* Message Toast */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 rounded-lg flex items-center gap-3 shadow-lg ${
                message.type === "success"
                  ? darkMode
                    ? "bg-[#22C55E]/20 border border-[#22C55E]/50"
                    : "bg-green-50 border border-green-200"
                  : message.type === "error"
                  ? darkMode
                    ? "bg-[#EF4444]/20 border border-[#EF4444]/50"
                    : "bg-red-50 border border-red-200"
                  : darkMode
                  ? "bg-[#3B82F6]/20 border border-[#3B82F6]/50"
                  : "bg-blue-50 border border-blue-200"
              }`}
            >
              {message.type === "success" ? (
                <FaCheckCircle
                  className={`text-xl flex-shrink-0 ${
                    darkMode ? "text-[#22C55E]" : "text-green-600"
                  }`}
                />
              ) : message.type === "error" ? (
                <FaTimes
                  className={`text-xl flex-shrink-0 ${
                    darkMode ? "text-[#EF4444]" : "text-red-600"
                  }`}
                />
              ) : (
                <FaInfoCircle
                  className={`text-xl flex-shrink-0 ${
                    darkMode ? "text-[#3B82F6]" : "text-blue-600"
                  }`}
                />
              )}
              <p
                className={`text-sm font-medium ${
                  message.type === "success"
                    ? darkMode
                      ? "text-[#22C55E]"
                      : "text-green-800"
                    : message.type === "error"
                    ? darkMode
                      ? "text-[#EF4444]"
                      : "text-red-800"
                    : darkMode
                    ? "text-[#3B82F6]"
                    : "text-blue-800"
                }`}
              >
                {message.text}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex flex-wrap gap-3 mb-8"
        >
          <motion.button
            onClick={() => {
              setModalMode("add");
              setCurrentDonation(null);
              setShowAddDonorModal(true);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all duration-200 shadow-sm group ${
              darkMode
                ? "bg-[#3B82F6] hover:bg-[#3B82F6]/80 text-white"
                : "bg-black hover:bg-gray-800 text-white"
            }`}
          >
            <motion.div className="group-hover:scale-110 transition-transform duration-200">
              <FaUserPlus />
            </motion.div>
            Add Donation
          </motion.button>
          <motion.button
            onClick={handleQuickMatch}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all duration-200 border group ${
              darkMode
                ? "bg-[#242424] hover:bg-[#333333] text-white border-[#333333]"
                : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
            }`}
          >
            <motion.div className="group-hover:rotate-12 transition-transform duration-200">
              <HiSparkles />
            </motion.div>
            Quick Match
          </motion.button>
          <motion.button
            onClick={handleExport}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all duration-200 border group ${
              darkMode
                ? "bg-[#242424] hover:bg-[#333333] text-white border-[#333333]"
                : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
            }`}
          >
            <motion.div className="group-hover:translate-x-1 transition-transform duration-200">
              <FaFileExport />
            </motion.div>
            Export
          </motion.button>
          <motion.button
            onClick={handleImport}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all duration-200 border group ${
              darkMode
                ? "bg-[#242424] hover:bg-[#333333] text-white border-[#333333]"
                : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
            }`}
          >
            <motion.div className="group-hover:-translate-y-1 transition-transform duration-200">
              <FaFileUpload />
            </motion.div>
            Import
          </motion.button>
          <motion.button
            onClick={handleReport}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all duration-200 border group ${
              darkMode
                ? "bg-[#242424] hover:bg-[#333333] text-white border-[#333333]"
                : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
            }`}
          >
            <motion.div className="group-hover:scale-110 transition-transform duration-200">
              <FaChartBar />
            </motion.div>
            Report
          </motion.button>
          <motion.button
            onClick={refreshData}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all duration-200 border group ${
              darkMode
                ? "bg-[#242424] hover:bg-[#333333] text-white border-[#333333]"
                : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
            }`}
          >
            <motion.div className="group-hover:rotate-180 transition-transform duration-300">
              <FaSync />
            </motion.div>
            Refresh
          </motion.button>
        </motion.div>

        {/* Recent Donors and Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <RecentDonors
            recentDonors={recentDonors}
            loading={loading}
            onDataRefresh={refreshData}
            onViewDonation={(donation) => {
              setCurrentDonation(donation);
              setModalMode("view");
              setShowAddDonorModal(true);
            }}
            onEditDonation={(donation) => {
              setCurrentDonation(donation);
              setModalMode("edit");
              setShowAddDonorModal(true);
            }}
            darkMode={darkMode}
          />
          <RecentActivity recentActivity={recentActivity} darkMode={darkMode} />
        </div>

        {/* Products and Fire Stations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AllProductsList
            key={`products-${productsRefreshTrigger}`}
            darkMode={darkMode}
            refreshTrigger={productsRefreshTrigger}
            onAddProduct={() => {
              setCurrentProduct(null);
              setShowAddProductModal(true);
            }}
            onEditProduct={(product) => {
              setCurrentProduct(product);
              setShowAddProductModal(true);
            }}
            onDeleteProduct={(product) => {
              setDeleteItem({ type: "product", item: product });
              setShowDeleteModal(true);
            }}
          />
          <AllFireStationsList
            key={`firestations-${fireStationsRefreshTrigger}`}
            darkMode={darkMode}
            refreshTrigger={fireStationsRefreshTrigger}
            onAddFireStation={() => {
              setCurrentFireStation(null);
              setShowAddFireStationModal(true);
            }}
            onEditFireStation={(fireStation) => {
              setCurrentFireStation(fireStation);
              setShowAddFireStationModal(true);
            }}
            onDeleteFireStation={(fireStation) => {
              setDeleteItem({ type: "fireStation", item: fireStation });
              setShowDeleteModal(true);
            }}
          />
        </div>
      </main>

      {/* Add Product Donation Modal */}
      <AddProductDonationModal
        showAddDonorModal={showAddDonorModal}
        setShowAddDonorModal={(show) => {
          setShowAddDonorModal(show);
          // Reset modal state when closing
          if (!show) {
            setTimeout(() => {
              setModalMode("add");
              setCurrentDonation(null);
            }, 300); // Small delay to allow modal close animation
          }
        }}
        onDataRefresh={refreshData}
        mode={modalMode}
        donation={currentDonation}
        darkMode={darkMode}
      />

      {/* Match Donation Modal (for quick match) */}
      <MatchDonationModal
        showModal={showMatchModal}
        setShowModal={setShowMatchModal}
        donation={donationToMatch}
        onDataRefresh={refreshData}
        darkMode={darkMode}
      />

      {/* Access Denied Modal */}
      <AccessDeniedModal
        showAccessDeniedModal={showAccessDeniedModal}
        setShowAccessDeniedModal={setShowAccessDeniedModal}
        darkMode={darkMode}
      />

      {/* Add Product Modal */}
      <AddProductModal
        showAddProductModal={showAddProductModal}
        setShowAddProductModal={setShowAddProductModal}
        onProductAdded={refreshProducts}
        onProductUpdated={refreshProducts}
        editProduct={currentProduct}
        darkMode={darkMode}
      />

      {/* Add Fire Station Modal */}
      <AddFireStationModal
        showAddFireStationModal={showAddFireStationModal}
        setShowAddFireStationModal={setShowAddFireStationModal}
        onFireStationAdded={refreshFireStations}
        onFireStationUpdated={refreshFireStations}
        editStation={currentFireStation}
        darkMode={darkMode}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteItem(null);
        }}
        onConfirm={
          deleteItem?.type === "product"
            ? handleDeleteProduct
            : handleDeleteFireStation
        }
        title={
          deleteItem?.type === "product"
            ? "Delete Product"
            : "Delete Fire Station"
        }
        description={`This will permanently remove the ${
          deleteItem?.type === "product" ? "product" : "fire station"
        } from the system`}
        itemName={deleteItem?.item?.name}
        itemValue={
          deleteItem?.type === "product"
            ? deleteItem?.item?.description
            : deleteItem?.item?.city
        }
        isDeleting={isDeleting}
        darkMode={darkMode}
      />
    </div>
  );
}
