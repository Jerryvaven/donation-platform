'use client';
import React, { useState, useEffect } from 'react';
import { FaTimes, FaEdit, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
interface ProductDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEdit: () => void;
    product: any;
    darkMode?: boolean;
}
const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ isOpen, onClose, onEdit, product, darkMode = false, }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    useEffect(() => {
        if (isOpen) {
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
    }, [isOpen]);
    if (!isOpen || !product)
        return null;
    const images = product.images || [product.image];
    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };
    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };
    return (<div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`relative w-full max-w-6xl max-h-[90vh] overflow-y-auto scrollbar-hide rounded-lg shadow-2xl ${darkMode ? 'bg-[#242424] text-white' : 'bg-white text-gray-900'}`}>
        
        <div className={`sticky top-0 z-10 flex justify-between items-center p-6 border-b ${darkMode ? 'bg-[#242424] border-[#333333]' : 'bg-white border-gray-200'}`}>
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <div className="flex gap-2">
            <button onClick={onEdit} className={`p-2 rounded-lg transition ${darkMode
            ? 'hover:bg-gray-700 text-blue-400'
            : 'hover:bg-gray-100 text-blue-600'}`} title="Edit Product">
              <FaEdit size={20}/>
            </button>
            <button onClick={onClose} className={`p-2 rounded-lg transition ${darkMode
            ? 'hover:bg-gray-700 text-gray-400'
            : 'hover:bg-gray-100 text-gray-600'}`}>
              <FaTimes size={24}/>
            </button>
          </div>
        </div>

        <div className="p-6">
          
          {images.length > 0 && (<div className="mb-8">
              <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
                <img src={images[currentImageIndex]} alt={`${product.name} - Image ${currentImageIndex + 1}`} className="w-full h-full object-contain"/>
                {images.length > 1 && (<>
                    <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition">
                      <FaChevronLeft size={24}/>
                    </button>
                    <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition">
                      <FaChevronRight size={24}/>
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_: string, idx: number) => (<button key={idx} onClick={() => setCurrentImageIndex(idx)} className={`w-2 h-2 rounded-full transition ${idx === currentImageIndex
                        ? 'bg-white'
                        : 'bg-white bg-opacity-50'}`}/>))}
                    </div>
                  </>)}
              </div>
              
              {images.length > 1 && (<div className="flex gap-2 mt-4 overflow-x-auto">
                  {images.map((img: string, idx: number) => (<button key={idx} onClick={() => setCurrentImageIndex(idx)} className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${idx === currentImageIndex
                        ? 'border-blue-500'
                        : darkMode
                            ? 'border-gray-700'
                            : 'border-gray-300'}`}>
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover"/>
                    </button>))}
                </div>)}
            </div>)}

          
          <div className="mb-6">
            <p className={`text-3xl font-bold ${darkMode ? 'text-cyan-600' : 'text-black'}`}>
              {product.price}
            </p>
          </div>

          
          {product.description && (<div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Description</h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                {product.description}
              </p>
            </div>)}

          
          {product.productDescription && (<div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Product Description</h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                {product.productDescription}
              </p>
            </div>)}

          
          {product.features && product.features.length > 0 && (<div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Detailed Features</h3>
              <p className="text-sm text-gray-500 mb-3">Comprehensive product features (separate from card features)</p>
              <ul className="space-y-2">
                {product.features.map((feature: string, idx: number) => (<li key={idx} className="flex items-start">
                    <span className="text-blue-500 mr-2">✓</span>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {feature}
                    </span>
                  </li>))}
              </ul>
            </div>)}

          
          {product.benefits && product.benefits.length > 0 && (<div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Benefits</h3>
              <ul className="space-y-2">
                {product.benefits.map((benefit: string, idx: number) => (<li key={idx} className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {benefit}
                    </span>
                  </li>))}
              </ul>
            </div>)}

          
          {product.healthBenefitsDescription && (<div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Health Benefits</h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                {product.healthBenefitsDescription}
              </p>
            </div>)}

          
          {product.specifications && product.specifications.length > 0 && (<div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Specifications</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.specifications.map((spec: string, idx: number) => (<li key={idx} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    {spec}
                  </li>))}
              </ul>
            </div>)}

          
          {product.specificationsImage && (<div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Technical Specifications</h3>
              <img src={product.specificationsImage} alt="Technical Specifications" className="w-full rounded-lg"/>
            </div>)}

          
          {product.featureSlides && product.featureSlides.length > 0 && (<div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Feature Highlights</h3>
              <div className="space-y-4">
                {product.featureSlides.map((slide: any, idx: number) => (<div key={idx} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    {slide.image && (<img src={slide.image} alt={slide.title} className="w-full h-48 object-cover rounded-lg mb-3"/>)}
                    <h4 className="font-semibold mb-2">{slide.title}</h4>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {slide.description}
                    </p>
                  </div>))}
              </div>
            </div>)}

          
          {product.includedAccessories && product.includedAccessories.length > 0 && (<div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Included Accessories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.includedAccessories.map((accessory: any, idx: number) => (<div key={idx} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    {accessory.image && (<img src={accessory.image} alt={accessory.title} className="w-20 h-20 object-contain rounded mb-3"/>)}
                    <h4 className="font-semibold mb-2">{accessory.title}</h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {accessory.description}
                    </p>
                  </div>))}
              </div>
            </div>)}

          
          {product.dimensionsImage && (<div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Dimensions</h3>
              <img src={product.dimensionsImage} alt="Product Dimensions" className="w-full rounded-lg"/>
            </div>)}

          
          {product.questionsAndAnswers && product.questionsAndAnswers.length > 0 && (<div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Questions & Answers</h3>
              <div className="space-y-4">
                {product.questionsAndAnswers.map((qa: any, idx: number) => (<div key={idx} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h4 className="font-semibold mb-2">Q: {qa.question}</h4>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      A: {qa.answer}
                    </p>
                  </div>))}
              </div>
            </div>)}

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {product.warranty && (<div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className="text-lg font-semibold mb-2">Warranty</h3>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  {product.warranty}
                </p>
              </div>)}
            {product.shipping && (<div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className="text-lg font-semibold mb-2">Shipping</h3>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  {product.shipping}
                </p>
              </div>)}
          </div>

          
          <div className="flex gap-4 pt-6 border-t">
            <button onClick={onEdit} className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold">
              Edit Product Details
            </button>
            <button onClick={onClose} className={`flex-1 px-6 py-3 rounded-lg transition font-semibold ${darkMode
            ? 'bg-gray-700 hover:bg-gray-600'
            : 'bg-gray-200 hover:bg-gray-300'}`}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>);
};
export default ProductDetailModal;
