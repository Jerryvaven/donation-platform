'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPlus, FaCheckCircle, FaSync } from 'react-icons/fa';
import { addEcommerceProduct, updateEcommerceProduct } from '@/lib/api-client';
import type { EcommerceProduct } from '@/types';
interface AddSaunaProductModalProps {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    onProductAdded: (product: EcommerceProduct) => void;
    onProductUpdated?: (product: EcommerceProduct) => void;
    editProduct?: EcommerceProduct | null;
    darkMode?: boolean;
}
export default function AddSaunaProductModal({ showModal, setShowModal, onProductAdded, onProductUpdated, editProduct = null, darkMode = false }: AddSaunaProductModalProps) {
    const [productName, setProductName] = useState('');
    const [productValue, setProductValue] = useState('');
    const [productImageUrl, setProductImageUrl] = useState('');
    const [productFeatures, setProductFeatures] = useState<string[]>(['', '', '', '', '']);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
    const [addingProduct, setAddingProduct] = useState(false);
    const [message, setMessage] = useState<{
        type: 'success' | 'error';
        text: string;
    } | null>(null);
    React.useEffect(() => {
        if (editProduct) {
            setProductName(editProduct.name);
            setProductValue(editProduct.price.toString());
            setProductImageUrl(editProduct.image_url || '');
            setProductFeatures(editProduct.card_features || ['', '', '', '', '']);
            setImagePreview(editProduct.image_url || '');
        }
        else {
            resetForm();
        }
    }, [editProduct]);
    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        };
    }, [showModal]);
    const resetForm = () => {
        setProductName('');
        setProductValue('');
        setProductImageUrl('');
        setProductFeatures(['', '', '', '', '']);
        setImagePreview('');
        setUploadMethod('url');
        setMessage(null);
    };
    const handleImageUrlChange = (url: string) => {
        setProductImageUrl(url);
        setImagePreview(url);
    };
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setProductImageUrl(result);
                setImagePreview(result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setAddingProduct(true);
        setMessage(null);
        try {
            const productData = {
                name: productName,
                category: 'Sauna' as const,
                price: parseFloat(productValue),
                image_url: productImageUrl,
                card_features: productFeatures.filter(f => f.trim() !== '')
            };
            if (editProduct) {
                try {
                    const response = await updateEcommerceProduct(editProduct.id, productData);
                    if (response.data) {
                        setMessage({ type: 'success', text: 'Sauna product updated successfully!' });
                        onProductUpdated?.(response.data);
                        setTimeout(() => {
                            setShowModal(false);
                            resetForm();
                        }, 1500);
                    }
                }
                catch (ecommerceError) {
                    const fallbackData = { ...productData, value: productData.price };
                    delete (fallbackData as any).price;
                    const response = await fetch(`/api/products/${editProduct.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(fallbackData)
                    });
                    const result = await response.json();
                    if (result.data) {
                        setMessage({ type: 'success', text: 'Sauna product updated successfully!' });
                        onProductUpdated?.({ ...result.data, price: result.data.value });
                        setTimeout(() => {
                            setShowModal(false);
                            resetForm();
                        }, 1500);
                    }
                }
            }
            else {
                try {
                    const response = await addEcommerceProduct(productData);
                    if (response.data) {
                        setMessage({ type: 'success', text: 'Sauna product added successfully!' });
                        onProductAdded(response.data);
                        setTimeout(() => {
                            setShowModal(false);
                            resetForm();
                        }, 1500);
                    }
                }
                catch (ecommerceError) {
                    const fallbackData = { ...productData, value: productData.price };
                    delete (fallbackData as any).price;
                    const response = await fetch('/api/products', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(fallbackData)
                    });
                    const result = await response.json();
                    if (result.data) {
                        setMessage({ type: 'success', text: 'Sauna product added successfully!' });
                        onProductAdded({ ...result.data, price: result.data.value });
                        setTimeout(() => {
                            setShowModal(false);
                            resetForm();
                        }, 1500);
                    }
                }
            }
        }
        catch (error: any) {
            console.log('Error saving sauna product:', error);
            setMessage({
                type: 'error',
                text: error.message || 'Failed to save sauna product'
            });
        }
        finally {
            setAddingProduct(false);
        }
    };
    return (<AnimatePresence>
      {showModal && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className={`${darkMode ? 'bg-[#242424] text-white' : 'bg-white text-gray-900'} rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide shadow-2xl`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">
                {editProduct ? 'Edit' : 'Add'} Sauna Product
              </h2>
              <button onClick={() => setShowModal(false)} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} p-2 rounded-lg transition-colors`}>
                <FaTimes size={24}/>
              </button>
            </div>

            {message && (<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`p-4 rounded-lg mb-6 flex items-center gap-3 ${message.type === 'success'
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-red-100 text-red-800 border border-red-200'}`}>
                {message.type === 'success' ? (<FaCheckCircle className="text-green-600"/>) : (<FaTimes className="text-red-600"/>)}
                <span>{message.text}</span>
              </motion.div>)}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Product Name *
                </label>
                <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g., King Sauna, Barrel Sauna" required className={`w-full px-4 py-3 rounded-lg border ${darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-gray-50 border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}/>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Value ($) *
                </label>
                <input type="number" step="0.01" value={productValue} onChange={(e) => setProductValue(e.target.value)} placeholder="e.g., 4999.99" required className={`w-full px-4 py-3 rounded-lg border ${darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-gray-50 border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}/>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Product Benefits/Features (5 Points)
                </label>
                <div className="space-y-3">
                  {[0, 1, 2, 3, 4].map((index) => (<input key={index} type="text" value={productFeatures[index] || ''} onChange={(e) => {
                    const newFeatures = [...productFeatures];
                    newFeatures[index] = e.target.value;
                    setProductFeatures(newFeatures);
                }} placeholder={`Feature ${index + 1} (e.g., Full spectrum infrared)`} className={`w-full px-4 py-3 rounded-lg border ${darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-gray-50 border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}/>))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Product Image
                </label>
                <div className="flex gap-4 mb-4">
                  <button type="button" onClick={() => setUploadMethod('url')} className={`px-4 py-2 rounded-lg ${uploadMethod === 'url'
                ? 'bg-blue-600 text-white'
                : darkMode
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-gray-200 text-gray-700'}`}>
                    URL
                  </button>
                  <button type="button" onClick={() => setUploadMethod('file')} className={`px-4 py-2 rounded-lg ${uploadMethod === 'file'
                ? 'bg-blue-600 text-white'
                : darkMode
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-gray-200 text-gray-700'}`}>
                    Upload File
                  </button>
                </div>

                {uploadMethod === 'url' ? (<input type="url" value={productImageUrl} onChange={(e) => handleImageUrlChange(e.target.value)} placeholder="https://example.com/image.jpg" className={`w-full px-4 py-3 rounded-lg border ${darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-gray-50 border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}/>) : (<input type="file" accept="image/*" onChange={handleFileUpload} className={`w-full px-4 py-3 rounded-lg border ${darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-gray-50 border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}/>)}

                {imagePreview && (<div className="mt-4">
                    <p className="text-sm font-medium mb-2">Preview:</p>
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                      <Image src={imagePreview} alt="Product preview" fill className="object-contain"/>
                    </div>
                  </div>)}
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" disabled={addingProduct || !productName || !productValue} className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {addingProduct ? (<>
                      <FaSync className="animate-spin"/>
                      {editProduct ? 'Updating...' : 'Adding...'}
                    </>) : (<>
                      <FaPlus />
                      {editProduct ? 'Update Product' : 'Add Product'}
                    </>)}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className={`px-6 py-3 rounded-lg font-semibold ${darkMode
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}>
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>)}
    </AnimatePresence>);
}
