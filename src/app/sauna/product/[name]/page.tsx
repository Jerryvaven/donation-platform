'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SaunaProduct from '@/components/user/sauna/saunaproduct';
import Navbar from '@/components/user/Navbar';
import { indoorProducts, outdoorProducts } from '@/constants/saunaProducts';
import { useCart } from '@/context/CartContext';
export default function ProductPage() {
    const params = useParams();
    const router = useRouter();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('adminDarkMode');
            setDarkMode(saved ? JSON.parse(saved) : true);
        }
    }, []);
    useEffect(() => {
        if (mounted) {
            localStorage.setItem('adminDarkMode', JSON.stringify(darkMode));
        }
    }, [darkMode, mounted]);
    useEffect(() => {
        if (mounted) {
            if (darkMode) {
                document.body.style.backgroundColor = "#121212";
                document.documentElement.style.backgroundColor = "#121212";
            }
            else {
                document.body.style.backgroundColor = "";
                document.documentElement.style.backgroundColor = "";
            }
        }
    }, [darkMode, mounted]);
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const productName = decodeURIComponent(params.name as string);
                const response = await fetch('/api/ecommerce-products?category=Sauna');
                const data = await response.json();
                if (data.data && data.data.length > 0) {
                    const dbProduct = data.data.find((p: any) => p.name === productName);
                    if (dbProduct) {
                        setProduct({
                            id: dbProduct.id,
                            sku: dbProduct.sku,
                            name: dbProduct.name,
                            price: `$${dbProduct.price?.toLocaleString()}`,
                            images: dbProduct.gallery_images || [dbProduct.image_url] || [],
                            features: dbProduct.features || [],
                            specifications: dbProduct.specifications_array || [],
                            warranty: dbProduct.warranty_info || 'Standard warranty applies',
                            shipping: dbProduct.shipping_info || 'Standard shipping available',
                            description: dbProduct.description || '',
                            productDescription: dbProduct.product_description || '',
                            healthBenefitsDescription: dbProduct.health_benefits_description || '',
                            specificationsImage: dbProduct.specifications_image || '',
                            dimensionsImage: dbProduct.dimensions_image || '',
                            questionsAndAnswers: dbProduct.questions_answers || [],
                            featureSlides: dbProduct.feature_slides || [],
                            includedAccessories: dbProduct.included_accessories || [],
                        });
                        setLoading(false);
                        return;
                    }
                }
                const allProducts = [...indoorProducts, ...outdoorProducts];
                const staticProduct = allProducts.find(p => p.name === productName);
                if (staticProduct) {
                    setProduct(staticProduct);
                }
                setLoading(false);
            }
            catch (error) {
                console.log('Error fetching product:', error);
                const productName = decodeURIComponent(params.name as string);
                const allProducts = [...indoorProducts, ...outdoorProducts];
                const staticProduct = allProducts.find(p => p.name === productName);
                if (staticProduct) {
                    setProduct(staticProduct);
                }
                setLoading(false);
            }
        };
        if (params.name) {
            fetchProduct();
        }
    }, [params.name]);
    if (!mounted || loading) {
        return (<div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-[#121212]" : "bg-gray-50"}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>);
    }
    if (!product) {
        return <div>Product not found</div>;
    }
    const handleBack = () => {
        router.push('/sauna');
    };
    const handleAddToCart = () => {
        if (product) {
            addToCart({
                id: product.id || product.name.toLowerCase().replace(/\s+/g, '-'),
                name: product.name,
                price: product.price,
                image: product.images && product.images[0] ? product.images[0] : '/assets/placeholder.png',
                type: 'sauna',
                category: 'Sauna',
                sku: product.sku
            });
        }
    };
    return (<div className={`min-h-screen transition-colors ${darkMode ? "bg-[#121212]" : "bg-gray-50"}`}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode}/>
      <SaunaProduct name={product.name} price={product.price} images={product.images} features={product.features} specifications={product.specifications} warranty={product.warranty} shipping={product.shipping} onAddToCart={handleAddToCart} darkMode={darkMode} description={product.description} productDescription={product.productDescription} healthBenefitsDescription={product.healthBenefitsDescription} specificationsImage={product.specificationsImage} dimensionsImage={product.dimensionsImage} questionsAndAnswers={product.questionsAndAnswers} featureSlides={product.featureSlides} onBack={handleBack} includedAccessories={product.includedAccessories}/>
    </div>);
}
