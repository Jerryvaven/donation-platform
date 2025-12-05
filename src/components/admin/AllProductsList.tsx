"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  FaBox,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSync,
} from "react-icons/fa";
import { fetchProducts } from "@/lib/api-client";
import type { Product } from "@/types";

interface AllProductsListProps {
  darkMode: boolean;
  refreshTrigger?: number;
  onAddProduct?: () => void;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (product: Product) => void;
}

export default function AllProductsList({
  darkMode,
  refreshTrigger,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
}: AllProductsListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const isInitialLoad = useRef(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        if (isInitialLoad.current) setLoading(true);
        const response = await fetchProducts();
        setProducts(response.data || []);
        isInitialLoad.current = false;
      } catch (error) {
        console.log("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [refreshTrigger]);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 1.2 }}
      className={`relative rounded-xl p-6 shadow-sm border ${
        darkMode ? "bg-[#242424] border-[#333333]" : "bg-white border-gray-100"
      }`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2
            className={`text-xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            All Products
          </h2>
          <p
            className={`text-sm ${
              darkMode ? "text-[#B3B3B3]" : "text-gray-500"
            }`}
          >
            Manage your product catalog
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <FaSearch
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                darkMode ? "text-[#808080]" : "text-gray-400"
              }`}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`border rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:outline-none w-48 transition-all ${
                darkMode
                  ? "bg-[#1E1E1E] border-[#333333] text-white placeholder-[#808080] focus:ring-[#3B82F6] focus:border-[#3B82F6]"
                  : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-black focus:border-black"
              }`}
            />
          </div>
          {onAddProduct && (
            <motion.button
              onClick={onAddProduct}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                darkMode
                  ? "bg-[#3B82F6] hover:bg-[#3B82F6]/80 text-white"
                  : "bg-black hover:bg-gray-800 text-white"
              }`}
            >
              <FaPlus size={14} />
              Add
            </motion.button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="relative">
          {/* Show existing content with overlay spinner */}
          <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-hide pb-12">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                  darkMode
                    ? "bg-[#1E1E1E] border-[#333333] hover:bg-[#242424]"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                }`}
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <FaBox className="text-blue-600 text-xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={`font-semibold truncate ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {product.name}
                  </div>
                  <div
                    className={`text-sm ${
                      darkMode ? "text-[#808080]" : "text-gray-500"
                    }`}
                  >
                    {product.category} • ${product.value.toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`text-xs px-2 py-1 rounded-full ${
                      darkMode
                        ? "bg-[#22C55E]/20 text-[#22C55E]"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    ${product.value.toLocaleString()}
                  </div>
                  {onEditProduct && (
                    <motion.button
                      onClick={() => onEditProduct(product)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-2 transition-colors duration-200 ${
                        darkMode
                          ? "text-[#808080] hover:text-[#3B82F6]"
                          : "text-gray-400 hover:text-blue-600"
                      }`}
                      title="Edit Product"
                    >
                      <FaEdit />
                    </motion.button>
                  )}
                  {onDeleteProduct && (
                    <motion.button
                      onClick={() => onDeleteProduct(product)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-2 transition-colors duration-200 ${
                        darkMode
                          ? "text-[#808080] hover:text-[#EF4444]"
                          : "text-gray-400 hover:text-red-600"
                      }`}
                      title="Delete Product"
                    >
                      <FaTrash />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          {/* Loading overlay */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center rounded-xl">
            <div
              className={`flex items-center gap-3 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <FaSync className="animate-spin text-xl" />
              <span>Refreshing...</span>
            </div>
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div
          className={`text-center py-8 ${
            darkMode ? "text-[#B3B3B3]" : "text-gray-600"
          }`}
        >
          {searchQuery
            ? "No products found matching your search."
            : "No products available."}
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-hide pb-12">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                darkMode
                  ? "bg-[#1E1E1E] border-[#333333] hover:bg-[#242424]"
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
              }`}
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-full h-full flex items-center justify-center font-semibold ${
                      darkMode
                        ? "bg-[#3B82F6] text-white"
                        : "bg-gray-900 text-white"
                    }`}
                  >
                    {product.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className={`font-semibold truncate ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {product.name}
                </div>
                <div
                  className={`text-sm ${
                    darkMode ? "text-[#808080]" : "text-gray-500"
                  }`}
                >
                  {product.category} • ${product.value.toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {onEditProduct && (
                  <motion.button
                    onClick={() => onEditProduct(product)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 transition-colors duration-200 ${
                      darkMode
                        ? "text-[#808080] hover:text-[#3B82F6]"
                        : "text-gray-400 hover:text-blue-600"
                    }`}
                    title="Edit Product"
                  >
                    <FaEdit />
                  </motion.button>
                )}
                {onDeleteProduct && (
                  <motion.button
                    onClick={() => onDeleteProduct(product)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 transition-colors duration-200 ${
                      darkMode
                        ? "text-[#808080] hover:text-[#EF4444]"
                        : "text-gray-400 hover:text-red-600"
                    }`}
                    title="Delete Product"
                  >
                    <FaTrash />
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div
        className={`absolute bottom-2 left-6 text-sm ${
          darkMode ? "text-[#808080]" : "text-gray-500"
        }`}
      >
        Showing {filteredProducts.length} of {products.length} products
      </div>
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </motion.div>
  );
}

