import React, { useState, useEffect } from "react";
import { Product } from "../../../constants/saunaProducts";
interface DbProduct {
    id: string;
    name: string;
    category: string;
    price?: number;
    value?: number;
    description?: string;
    image_url?: string;
    features?: string[];
    card_features?: string[];
}
const Products: React.FC<{
    type: "indoor" | "outdoor";
    onProductClick: (product: Product) => void;
    darkMode?: boolean;
}> = ({ type, onProductClick, darkMode = false }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let response = await fetch('/api/ecommerce-products?category=Sauna');
                let data = await response.json();
                if (!data.data || data.data.length === 0 || data.error) {
                    console.log('Fetching from regular products table as fallback');
                    response = await fetch('/api/products');
                    data = await response.json();
                    const saunaProducts = (data.data || [])
                        .filter((p: DbProduct) => p.category === 'Sauna')
                        .map((p: DbProduct) => ({
                        name: p.name,
                        price: `$${(p.value || 0).toLocaleString()}`,
                        image: p.image_url || '/assets/saunas/product/default.png',
                        benefits: p.features || [
                            p.description || 'Premium quality sauna',
                            'Full spectrum infrared',
                            'Easy assembly',
                            'Warranty included'
                        ],
                        button: 'Shop Now'
                    }));
                    setProducts(saunaProducts);
                }
                else {
                    const saunaProducts = (data.data || []).map((p: DbProduct) => ({
                        name: p.name,
                        price: `$${(p.price || 0).toLocaleString()}`,
                        image: p.image_url || '/assets/saunas/product/default.png',
                        benefits: p.card_features || p.features || [
                            p.description || 'Premium quality sauna',
                            'Full spectrum infrared',
                            'Easy assembly',
                            'Warranty included'
                        ],
                        button: 'Shop Now'
                    }));
                    setProducts(saunaProducts);
                }
            }
            catch (error) {
                console.log('Error fetching sauna products:', error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);
    if (loading) {
        return (<div className="w-full max-w-7xl mx-auto px-4 flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B82F6]"></div>
      </div>);
    }
    if (products.length === 0) {
        return (<div className="w-full max-w-7xl mx-auto px-4 text-center py-12">
        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>No sauna products available at the moment.</p>
      </div>);
    }
    return (<div className="w-full max-w-7xl mx-auto px-4">
      <div className="flex flex-wrap justify-center gap-8">
        {products.map((product, idx) => (<div key={idx} className="rounded-lg shadow-lg overflow-hidden w-full max-w-sm bg-white text-gray-900">
          
          <div className="w-full h-64 overflow-hidden p-4">
            <img src={product.image} alt={product.name} className="w-full h-full object-contain cursor-pointer drop-shadow-lg" onClick={() => onProductClick(product)}/>
          </div>
          
          <div className="p-6 text-center">
            
            <h3 className="text-lg font-bold mb-2">{product.name}</h3>
            
            
            <p className="text-xl font-semibold mb-4 text-black">{product.price}</p>
            
            
            <div className="border-t mb-4 border-gray-200"></div>
            
            
            <div className="space-y-2 mb-6">
              {product.benefits.slice(0, 4).map((benefit, i) => (<div key={i} className="flex items-center">
                  <span className="text-black mr-2">•</span>
                  <span className="text-sm text-gray-700">{benefit}</span>
                </div>))}
            </div>
            
            
            <button className="px-4 py-2 rounded transition w-full bg-black text-white hover:bg-gray-800" onClick={() => onProductClick(product)}>
              {product.button}
            </button>
          </div>
        </div>))}
      </div>
    </div>);
};
export default Products;
