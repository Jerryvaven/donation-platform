'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/admin/Navbar';
import AddColdPlungeProductModal from '@/components/admin/e-commerce/coldplunges/AddColdPlungeProductModal';
import ColdPlungeProductsList from '@/components/admin/e-commerce/coldplunges/ColdPlungeProductsList';
import ProductDetailModal from '@/components/admin/e-commerce/ProductDetailModal';
import EditProductDetailModal from '@/components/admin/e-commerce/EditProductDetailModal';
import { createClient } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import type { EcommerceProduct } from '@/types';
export default function ColdPlungeProductsPage() {
    const [darkMode, setDarkMode] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editProduct, setEditProduct] = useState<EcommerceProduct | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadNotifications, setUnreadNotifications] = useState(false);
    const [lastNotificationCheck, setLastNotificationCheck] = useState(new Date().toISOString());
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showEditDetailModal, setShowEditDetailModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const router = useRouter();
    const supabase = createClient();
    useEffect(() => {
        const savedDarkMode = localStorage.getItem('adminDarkMode');
        if (savedDarkMode !== null) {
            setDarkMode(JSON.parse(savedDarkMode));
        }
    }, []);
    useEffect(() => {
        localStorage.setItem('adminDarkMode', JSON.stringify(darkMode));
    }, [darkMode]);
    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const response = await fetch('/api/admin-auth/check', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userId: user.id }),
                    });
                    if (!response.ok) {
                        console.log('Admin check failed');
                        await supabase.auth.signOut();
                        router.push('/admin/login');
                    }
                    else {
                        const result = await response.json();
                        setIsSuperAdmin(result.isSuperAdmin || false);
                    }
                }
            }
            catch (error) {
                console.log('Error checking admin status:', error);
            }
        };
        checkAdminStatus();
    }, [router, supabase.auth]);
    const handleAddProduct = () => {
        setEditProduct(null);
        setShowAddModal(true);
    };
    const handleEditProduct = (product: EcommerceProduct) => {
        setEditProduct(product);
        setShowAddModal(true);
    };
    const handleProductAdded = (product: EcommerceProduct) => {
        setRefreshTrigger((prev) => prev + 1);
    };
    const handleProductUpdated = (product: EcommerceProduct) => {
        setRefreshTrigger((prev) => prev + 1);
    };
    const handleProductDeleted = (product: EcommerceProduct) => {
        setRefreshTrigger((prev) => prev + 1);
    };
    const handleViewDetails = (product: any) => {
        const mappedProduct = {
            ...product,
            images: product.gallery_images || [product.image_url] || [],
            specifications: product.specifications_array || product.specifications || [],
            warranty: product.warranty_info || '',
            shipping: product.shipping_info || '',
            productDescription: product.product_description || '',
            healthBenefitsDescription: product.health_benefits_description || '',
            specificationsImage: product.specifications_image || '',
            dimensionsImage: product.dimensions_image || '',
            questionsAndAnswers: product.questions_answers || [],
            featureSlides: product.feature_slides || [],
            includedAccessories: product.included_accessories || [],
        };
        setSelectedProduct(mappedProduct);
        setShowDetailModal(true);
    };
    const handleOpenEditDetail = async () => {
        setShowDetailModal(false);
        if (selectedProduct?.id) {
            try {
                const response = await fetch(`/api/ecommerce-products?category=Cold Plunge`);
                const data = await response.json();
                if (data.data) {
                    const fullProduct = data.data.find((p: any) => p.id === selectedProduct.id);
                    if (fullProduct) {
                        setSelectedProduct({
                            ...fullProduct,
                            images: fullProduct.gallery_images || [fullProduct.image_url] || [],
                            specifications: fullProduct.specifications_array || [],
                            warranty: fullProduct.warranty_info || '',
                            shipping: fullProduct.shipping_info || '',
                            productDescription: fullProduct.product_description || '',
                            healthBenefitsDescription: fullProduct.health_benefits_description || '',
                            specificationsImage: fullProduct.specifications_image || '',
                            dimensionsImage: fullProduct.dimensions_image || '',
                            questionsAndAnswers: fullProduct.questions_answers || [],
                            featureSlides: fullProduct.feature_slides || [],
                            includedAccessories: fullProduct.included_accessories || [],
                        });
                    }
                }
            }
            catch (error) {
                console.log('Error fetching product details:', error);
            }
        }
        setShowEditDetailModal(true);
    };
    const handleSaveProductDetails = async (updatedProduct: any) => {
        const response = await fetch(`/api/ecommerce-products?id=${updatedProduct.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...updatedProduct,
                gallery_images: updatedProduct.images,
                specifications_array: updatedProduct.specifications,
                warranty_info: updatedProduct.warranty,
                shipping_info: updatedProduct.shipping,
                product_description: updatedProduct.productDescription,
                health_benefits_description: updatedProduct.benefits ? updatedProduct.benefits.join('\n') : '',
                specifications_image: updatedProduct.specificationsImage,
                dimensions_image: updatedProduct.dimensionsImage,
                questions_answers: updatedProduct.questionsAndAnswers,
                feature_slides: updatedProduct.featureSlides,
                included_accessories: updatedProduct.includedAccessories,
            }),
        });
        if (!response.ok) {
            throw new Error('Failed to update product');
        }
        setRefreshTrigger((prev) => prev + 1);
        setShowEditDetailModal(false);
        setSelectedProduct(null);
        setShowSuccessModal(true);
    };
    return (<div className={`min-h-screen ${darkMode ? 'bg-[#121212] text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} notificationActivity={[]} showNotifications={showNotifications} setShowNotifications={setShowNotifications} unreadNotifications={unreadNotifications} setUnreadNotifications={setUnreadNotifications} lastNotificationCheck={lastNotificationCheck} setLastNotificationCheck={setLastNotificationCheck} userRole={isSuperAdmin ? 'Super Admin' : 'Admin'}/>
      
      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Cold Plunge Products Management</h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage all cold plunge products in your inventory
          </p>
        </motion.div>

        <ColdPlungeProductsList darkMode={darkMode} refreshTrigger={refreshTrigger} onAddProduct={handleAddProduct} onEditProduct={handleEditProduct} onDeleteProduct={handleProductDeleted} onViewDetails={handleViewDetails}/>
      </main>

      <AddColdPlungeProductModal showModal={showAddModal} setShowModal={setShowAddModal} onProductAdded={handleProductAdded} onProductUpdated={handleProductUpdated} editProduct={editProduct} darkMode={darkMode}/>

      <ProductDetailModal isOpen={showDetailModal} onClose={() => {
            setShowDetailModal(false);
            setSelectedProduct(null);
        }} onEdit={handleOpenEditDetail} product={selectedProduct} darkMode={darkMode}/>

      <EditProductDetailModal isOpen={showEditDetailModal} onClose={() => {
            setShowEditDetailModal(false);
            setSelectedProduct(null);
        }} onSave={handleSaveProductDetails} product={selectedProduct} darkMode={darkMode}/>

      
      {showSuccessModal && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className={`relative w-full max-w-md p-6 rounded-lg shadow-2xl ${darkMode ? "bg-[#242424] text-white" : "bg-white text-gray-900"}`}>
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Success!</h3>
              <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                Product has been updated successfully.
              </p>
              <button onClick={() => setShowSuccessModal(false)} className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-semibold">
                OK
              </button>
            </div>
          </div>
        </div>)}
    </div>);
}
