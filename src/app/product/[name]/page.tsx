'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import SaunaProduct from '@/components/user/sauna/saunaproduct'
import Navbar from '@/components/user/Navbar'
import { indoorProducts, outdoorProducts } from '@/constants/saunaProducts'

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : true;
    }
    return true;
  })
  const [mounted, setMounted] = useState(false)

  // Save dark mode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Apply dark mode to the entire page
  useEffect(() => {
    if (mounted) {
      if (darkMode) {
        document.body.style.backgroundColor = "#121212";
        document.documentElement.style.backgroundColor = "#121212";
      } else {
        document.body.style.backgroundColor = "";
        document.documentElement.style.backgroundColor = "";
      }
    }
  }, [darkMode, mounted]);

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null // or a loading spinner
  }

  const productName = decodeURIComponent(params.name as string)
  const allProducts = [...indoorProducts, ...outdoorProducts]
  const product = allProducts.find(p => p.name === productName)

  if (!product) {
    return <div>Product not found</div>
  }

  const handleBack = () => {
    router.push('/sauna')
  }

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? "bg-[#121212]" : "bg-gray-50"}`}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <SaunaProduct
        name={product.name}
        price={product.price}
        images={product.images}
        features={product.features}
        specifications={product.specifications}
        warranty={product.warranty}
        shipping={product.shipping}
        onAddToCart={() => alert('Added to cart!')}
        darkMode={darkMode}
        shortDescription={product.shortDescription}
        productDescription={product.productDescription}
        healthBenefitsDescription={product.healthBenefitsDescription}
        specificationsImage={product.specificationsImage}
        questionsAndAnswers={product.questionsAndAnswers}
        featureSlides={product.featureSlides}
        onBack={handleBack}
      />
    </div>
  )
}