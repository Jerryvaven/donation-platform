import React from "react";
import { indoorProducts, outdoorProducts, Product } from "../../../constants/saunaProducts";

const Products: React.FC<{ type: "indoor" | "outdoor"; onProductClick: (product: Product) => void; darkMode?: boolean }> = ({ type, onProductClick, darkMode = false }) => {
  const products = type === "indoor" ? indoorProducts : outdoorProducts;
  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="flex flex-wrap justify-center gap-8">
        {products.map((product, idx) => (
          <div key={idx} className={`rounded-lg shadow-lg overflow-hidden w-full max-w-sm ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
          {/* Image */}
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-48 object-cover cursor-pointer" 
            onClick={() => onProductClick(product)}
          />
          
          <div className="p-6">
            {/* Name */}
            <h3 className="text-lg font-bold mb-2">{product.name}</h3>
            
            {/* Rate/Price */}
            <p className="text-xl font-semibold mb-4 text-green-600">{product.price}</p>
            
            {/* Divider */}
            <div className={`border-t mb-4 ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}></div>
            
            {/* Key Points/Benefits */}
            <div className="space-y-2 mb-6">
              {product.benefits.slice(0, 4).map((benefit, i) => (
                <div key={i} className="flex items-center">
                  <span className="text-green-500 mr-2">•</span>
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{benefit}</span>
                </div>
              ))}
            </div>
            
            {/* Button */}
            <button 
              className={`px-4 py-2 rounded transition w-full ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-black text-white hover:bg-gray-800'}`}
              onClick={() => onProductClick(product)}
            >
              {product.button}
            </button>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
};

export default Products;
