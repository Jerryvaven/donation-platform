'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPlus, FaCheckCircle, FaSync } from 'react-icons/fa';
import { addProduct, updateProduct } from '@/lib/api-client';
import type { Product } from '@/types';
interface AddProductModalProps {
    showAddProductModal: boolean;
    setShowAddProductModal: (show: boolean) => void;
    onProductAdded: (product: Product) => void;
    onProductUpdated?: (product: Product) => void;
    onProductDeleted?: (productId: string) => void;
    editProduct?: Product | null;
    darkMode?: boolean;
}
export default function AddProductModal({ showAddProductModal, setShowAddProductModal, onProductAdded, onProductUpdated, onProductDeleted, editProduct = null, darkMode = false }: AddProductModalProps) {
    const [newProductName, setNewProductName] = useState('');
    const [newProductCategory, setNewProductCategory] = useState('');
    const [newProductValue, setNewProductValue] = useState('');
    const [newProductDescription, setNewProductDescription] = useState('');
    const [newProductImageUrl, setNewProductImageUrl] = useState('');
    const [imagePreview, setImagePreview] = useState<string>('');
    const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
    const [addingProduct, setAddingProduct] = useState(false);
    const [message, setMessage] = useState<{
        type: 'success' | 'error';
        text: string;
    } | null>(null);
    React.useEffect(() => {
        if (editProduct) {
            setNewProductName(editProduct.name);
            setNewProductCategory(editProduct.category);
            setNewProductValue(editProduct.value.toString());
            setNewProductDescription(editProduct.description || '');
            setNewProductImageUrl(editProduct.image_url || '');
            setImagePreview(editProduct.image_url || '');
        }
        else {
            setNewProductName('');
            setNewProductCategory('');
            setNewProductValue('');
            setNewProductDescription('');
            setNewProductImageUrl('');
            setImagePreview('');
        }
    }, [editProduct]);
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProductName.trim() || !newProductCategory.trim() || !newProductValue.trim()) {
            setMessage({ type: 'error', text: 'Please fill in all required fields.' });
            return;
        }
        setAddingProduct(true);
        setMessage(null);
        try {
            const productData = {
                name: newProductName.trim(),
                category: newProductCategory.trim(),
                value: parseFloat(newProductValue),
                description: newProductDescription.trim() || undefined,
                image_url: uploadMethod === 'url' ? newProductImageUrl.trim() || undefined : imagePreview || undefined
            };
            let response;
            if (editProduct) {
                response = await updateProduct(editProduct.id, productData);
                setMessage({ type: 'success', text: 'Product updated successfully!' });
                if (onProductUpdated) {
                    onProductUpdated(response.data);
                }
            }
            else {
                response = await addProduct(productData);
                setMessage({ type: 'success', text: 'Product added successfully!' });
                onProductAdded(response.data);
            }
            setNewProductName('');
            setNewProductCategory('');
            setNewProductValue('');
            setNewProductDescription('');
            setNewProductImageUrl('');
            setImagePreview('');
            setUploadMethod('url');
            setTimeout(() => {
                setShowAddProductModal(false);
                setMessage(null);
            }, 1500);
        }
        catch (error: unknown) {
            console.log(`Error ${editProduct ? 'updating' : 'adding'} product:`, error);
            const errorMessage = error instanceof Error ? error.message : `Failed to ${editProduct ? 'update' : 'add'} product.`;
            setMessage({ type: 'error', text: errorMessage });
        }
        finally {
            setAddingProduct(false);
        }
    };
    return (<AnimatePresence>
      {showAddProductModal && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className={`${darkMode ? 'bg-[#1E1E1E]' : 'bg-white'} rounded-2xl max-w-lg w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-hide`} style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
            }}>
            <style jsx>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <motion.div className={`p-3 ${darkMode ? 'bg-[#3B82F6]' : 'bg-black'} rounded-xl`} whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                  <FaPlus className="text-xl text-white"/>
                </motion.div>
                <div>
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {editProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {editProduct ? 'Update the product details' : 'Fill in the details to add a new product'}
                  </p>
                </div>
              </div>
              <motion.button onClick={() => setShowAddProductModal(false)} whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} className={`p-2 rounded-lg transition-all ${darkMode ? 'text-[#808080] hover:text-white hover:bg-[#242424]' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}>
                <FaTimes className="text-xl"/>
              </motion.button>
            </div>

            
            <AnimatePresence>
              {message && (<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`mb-4 p-4 rounded-lg flex items-center gap-3 ${message.type === 'success'
                    ? darkMode ? 'bg-[#22C55E]/20 border border-[#22C55E]/30' : 'bg-green-50 border border-green-200'
                    : darkMode ? 'bg-[#EF4444]/20 border border-[#EF4444]/30' : 'bg-red-50 border border-red-200'}`}>
                  {message.type === 'success' ? (<FaCheckCircle className="text-green-600 text-xl flex-shrink-0"/>) : (<FaTimes className="text-red-600 text-xl flex-shrink-0"/>)}
                  <p className={`text-sm font-medium ${message.type === 'success'
                    ? darkMode ? 'text-[#22C55E]' : 'text-green-800'
                    : darkMode ? 'text-[#EF4444]' : 'text-red-800'}`}>
                    {message.text}
                  </p>
                </motion.div>)}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="productName" className={`block text-sm font-semibold ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-700'} mb-2`}>
                  Product Name *
                </label>
                <input type="text" id="productName" value={newProductName} onChange={(e) => setNewProductName(e.target.value)} required className={`w-full px-4 py-2.5 ${darkMode ? 'bg-[#242424] border-[#333333] text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 ${darkMode ? 'focus:ring-[#3B82F6] focus:border-[#3B82F6]' : 'focus:ring-black focus:border-black'} transition-all`} placeholder="e.g., King Sauna"/>
              </div>

              <div>
                <label htmlFor="productCategory" className={`block text-sm font-semibold ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-700'} mb-2`}>
                  Category *
                </label>
                <input type="text" id="productCategory" value={newProductCategory} onChange={(e) => setNewProductCategory(e.target.value)} required className={`w-full px-4 py-2.5 ${darkMode ? 'bg-[#242424] border-[#333333] text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 ${darkMode ? 'focus:ring-[#3B82F6] focus:border-[#3B82F6]' : 'focus:ring-black focus:border-black'} transition-all`} placeholder="e.g., Sauna"/>
              </div>

              <div>
                <label htmlFor="productValue" className={`block text-sm font-semibold ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-700'} mb-2`}>
                  Value ($) *
                </label>
                <input type="number" id="productValue" value={newProductValue} onChange={(e) => setNewProductValue(e.target.value)} required min="0" step="0.01" className={`w-full px-4 py-2.5 ${darkMode ? 'bg-[#242424] border-[#333333] text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 ${darkMode ? 'focus:ring-[#3B82F6] focus:border-[#3B82F6]' : 'focus:ring-black focus:border-black'} transition-all`} placeholder="0.00"/>
              </div>

              <div>
                <label htmlFor="productDescription" className={`block text-sm font-semibold ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-700'} mb-2`}>
                  Description
                </label>
                <textarea id="productDescription" value={newProductDescription} onChange={(e) => setNewProductDescription(e.target.value)} rows={3} className={`w-full px-4 py-2.5 ${darkMode ? 'bg-[#242424] border-[#333333] text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 ${darkMode ? 'focus:ring-[#3B82F6] focus:border-[#3B82F6]' : 'focus:ring-black focus:border-black'} transition-all resize-none`} placeholder="Optional product description..."/>
              </div>

              <div>
                <label className={`block text-sm font-semibold ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-700'} mb-2`}>
                  Image Upload Method
                </label>
                <div className="flex gap-6 mb-4">
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" name="uploadMethod" value="url" checked={uploadMethod === 'url'} onChange={(e) => setUploadMethod(e.target.value as 'url' | 'file')} className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500"/>
                    <span className={`text-sm font-medium ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-700'}`}>URL</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" name="uploadMethod" value="file" checked={uploadMethod === 'file'} onChange={(e) => setUploadMethod(e.target.value as 'url' | 'file')} className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500"/>
                    <span className={`text-sm font-medium ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-700'}`}>File Upload</span>
                  </label>
                </div>

                {uploadMethod === 'url' ? (<input type="url" value={newProductImageUrl} onChange={(e) => setNewProductImageUrl(e.target.value)} className={`w-full px-4 py-2.5 ${darkMode ? 'bg-[#242424] border-[#333333] text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 ${darkMode ? 'focus:ring-[#3B82F6] focus:border-[#3B82F6]' : 'focus:ring-black focus:border-black'} transition-all`} placeholder="https://example.com/image.jpg"/>) : (<div>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="imageUpload"/>
                    <label htmlFor="imageUpload" className={`block w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${darkMode ? 'border-[#333333] hover:border-[#3B82F6] hover:bg-[#242424]' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}`}>
                      {imagePreview ? (<div className="text-center">
                          <div className="flex justify-center mb-3">
                            <Image src={imagePreview} alt="Preview" width={96} height={96} className="w-24 h-24 object-cover rounded-lg shadow-md"/>
                          </div>
                          <p className={`text-sm font-medium ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-600'}`}>Click to change image</p>
                          <p className={`text-xs mt-1 ${darkMode ? 'text-[#808080]' : 'text-gray-500'}`}>PNG, JPG up to 10MB</p>
                        </div>) : (<div className="text-center">
                          <div className={`mx-auto mb-3 w-16 h-16 rounded-full flex items-center justify-center ${darkMode ? 'bg-[#242424]' : 'bg-gray-100'}`}>
                            <FaPlus className={`text-2xl ${darkMode ? 'text-[#808080]' : 'text-gray-400'}`}/>
                          </div>
                          <p className={`text-sm font-medium ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-600'}`}>Click to upload image</p>
                          <p className={`text-xs mt-1 ${darkMode ? 'text-[#808080]' : 'text-gray-500'}`}>PNG, JPG up to 10MB</p>
                        </div>)}
                    </label>
                  </div>)}
              </div>

              <div className="flex gap-4 pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
                <motion.button type="button" onClick={() => setShowAddProductModal(false)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${darkMode ? 'bg-[#242424] text-[#B3B3B3] hover:bg-[#333333] hover:text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  Cancel
                </motion.button>
                <motion.button type="submit" disabled={addingProduct} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${darkMode ? 'bg-[#3B82F6] text-white hover:bg-[#2563EB]' : 'bg-black text-white hover:bg-gray-800'} disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}>
                  {addingProduct ? (<>
                      <FaSync className="animate-spin"/>
                      {editProduct ? 'Updating...' : 'Adding...'}
                    </>) : (<>
                      <FaPlus />
                      {editProduct ? 'Update Product' : 'Add Product'}
                    </>)}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>)}
    </AnimatePresence>);
}
