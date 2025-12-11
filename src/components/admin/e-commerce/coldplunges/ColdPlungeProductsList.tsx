"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaSnowflake, FaSearch, FaPlus, FaEdit, FaTrash, FaSync, } from "react-icons/fa";
import { fetchEcommerceProducts, deleteEcommerceProduct } from "@/lib/api-client";
import type { EcommerceProduct } from "@/types";
import Image from "next/image";
interface ColdPlungeProductsListProps {
    darkMode: boolean;
    refreshTrigger?: number;
    onAddProduct?: () => void;
    onEditProduct?: (product: EcommerceProduct) => void;
    onDeleteProduct?: (product: EcommerceProduct) => void;
    onViewDetails?: (product: any) => void;
}
export default function ColdPlungeProductsList({ darkMode, refreshTrigger, onAddProduct, onEditProduct, onDeleteProduct, onViewDetails, }: ColdPlungeProductsListProps) {
    const [products, setProducts] = useState<EcommerceProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [deleting, setDeleting] = useState<string | null>(null);
    const isInitialLoad = useRef(true);
    useEffect(() => {
        loadProducts();
    }, [refreshTrigger]);
    const loadProducts = async () => {
        try {
            if (isInitialLoad.current)
                setLoading(true);
            try {
                const response = await fetchEcommerceProducts('Cold Plunge');
                setProducts(response.data || []);
            }
            catch (ecommerceError) {
                console.log('ecommerce_products table not found, using products table');
                const response = await fetch('/api/products');
                const data = await response.json();
                const coldPlungeProducts = (data.data || []).filter((p: any) => p.category === 'Cold Plunge').map((p: any) => ({
                    ...p,
                    price: p.value
                }));
                setProducts(coldPlungeProducts);
            }
            isInitialLoad.current = false;
        }
        catch (error) {
            console.log("Error fetching cold plunge products:", error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleDelete = async (product: EcommerceProduct) => {
        if (!confirm(`Are you sure you want to delete "${product.name}"?`)) {
            return;
        }
        setDeleting(product.id);
        try {
            await deleteEcommerceProduct(product.id);
            setProducts(products.filter((p) => p.id !== product.id));
            onDeleteProduct?.(product);
        }
        catch (error) {
            console.log("Error deleting product:", error);
            alert("Failed to delete product");
        }
        finally {
            setDeleting(null);
        }
    };
    const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (loading) {
        return (<div className="flex items-center justify-center h-64">
        <FaSync className={`animate-spin text-4xl ${darkMode ? "text-[#3B82F6]" : "text-black"}`}/>
      </div>);
    }
    return (<div className={`${darkMode ? "bg-[#242424]" : "bg-white"} rounded-2xl p-6 shadow-lg`}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">Cold Plunge Products</h2>
        </div>
        <button onClick={onAddProduct} className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:from-cyan-600 hover:to-cyan-700 transition-all">
          <FaPlus />
          Add Cold Plunge Product
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}/>
          <input type="text" placeholder="Search cold plunge products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`w-full pl-10 pr-4 py-3 rounded-lg ${darkMode
            ? "bg-gray-700 text-white border-gray-600"
            : "bg-gray-100 text-gray-900 border-gray-300"} border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}/>
        </div>
      </div>

      {filteredProducts.length === 0 ? (<div className="text-center py-12">
          <FaSnowflake className="text-6xl text-gray-400 mx-auto mb-4"/>
          <p className={`text-xl ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            {searchQuery ? "No cold plunge products found" : "No cold plunge products yet"}
          </p>
          <p className={`${darkMode ? "text-gray-500" : "text-gray-500"} mt-2`}>
            {searchQuery ? "Try a different search" : "Add your first cold plunge product to get started"}
          </p>
        </div>) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (<motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`${darkMode ? "bg-gray-700" : "bg-gray-50"} rounded-xl p-4 shadow-md hover:shadow-xl transition-all`}>
              {product.image_url && (<div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                  <Image src={product.image_url} alt={product.name} fill className="object-contain"/>
                </div>)}
              <h3 className="text-xl font-bold mb-2">{product.name}</h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Cold Plunge
                </span>
              </div>
              <p className={`text-2xl font-bold mb-3 ${darkMode ? 'text-cyan-600' : 'text-black'}`}>
                ${product.price.toLocaleString()}
              </p>
              {product.description && (<p className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm mb-4 line-clamp-3`}>
                  {product.description}
                </p>)}
              <div className="flex flex-col gap-2">
                <button onClick={() => onViewDetails?.(product)} className="w-full bg-cyan-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-cyan-700 transition-colors">
                  <FaSearch />
                  View Details
                </button>
                <div className="flex gap-2">
                  <button onClick={() => onEditProduct?.(product)} className="flex-1 bg-cyan-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-cyan-700 transition-colors">
                    <FaEdit />
                    Edit
                  </button>
                  <button onClick={() => handleDelete(product)} disabled={deleting === product.id} className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700 transition-colors disabled:opacity-50">
                    {deleting === product.id ? (<FaSync className="animate-spin"/>) : (<FaTrash />)}
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>))}
        </div>)}
    </div>);
}
