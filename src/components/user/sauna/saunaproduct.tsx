import React from "react";
import Footer from "../../Footer";
import { FaArrowLeft } from "react-icons/fa";
import { FeatureSlide, saunaFeatures } from "../../../constants/saunaProducts";
import { productFeatureIcons } from "../../../constants/saunaProducts";
import SaunaBenefitsSection from "./SaunaBenefits";
import Image from "next/image";
import { saunaDimensionsImage } from "../../../constants/saunaProducts";
import Commonsection from "../commomproductsections";
import { FaShieldAlt, FaFire, FaLightbulb, FaTools, FaMobileAlt, FaGem, FaAppStore, } from "react-icons/fa";
import { SiGoogleplay } from "react-icons/si";
interface SaunaProductProps {
    name: string;
    price: string;
    images: string[];
    features: string[];
    specifications: string[];
    warranty: string;
    shipping: string;
    onAddToCart: () => void;
    darkMode: boolean;
    description: string;
    productDescription?: string;
    healthBenefitsDescription?: string;
    specificationsImage?: string;
    dimensionsImage?: string;
    questionsAndAnswers?: Array<{
        question: string;
        answer: string;
    }>;
    testImage?: string;
    featureSlides?: FeatureSlide[];
    onBack?: () => void;
    includedAccessories?: Array<{
        title: string;
        image: string;
        description: string;
    }>;
}
const SaunaProduct: React.FC<SaunaProductProps> = ({ name, price, images, features, specifications, warranty, shipping, onAddToCart, darkMode, description, productDescription, healthBenefitsDescription, specificationsImage, dimensionsImage, questionsAndAnswers, testImage, featureSlides, onBack, includedAccessories, }) => {
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
    const [openSection, setOpenSection] = React.useState<string | null>(null);
    const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);
    const [touchStart, setTouchStart] = React.useState(0);
    const [touchEnd, setTouchEnd] = React.useState(0);
    const [isPaused, setIsPaused] = React.useState(false);
    const [isDragging, setIsDragging] = React.useState(false);
    const [dragStart, setDragStart] = React.useState(0);
    const [dragOffset, setDragOffset] = React.useState(0);
    const [isTransitioning, setIsTransitioning] = React.useState(false);
    const [openFeature, setOpenFeature] = React.useState<string | null>(null);
    const accessoriesRef = React.useRef<HTMLDivElement>(null);
    const scrollLeft = () => {
        accessoriesRef.current?.scrollBy({ left: -320, behavior: "smooth" });
    };
    const scrollRight = () => {
        accessoriesRef.current?.scrollBy({ left: 320, behavior: "smooth" });
    };
    const getIcon = (iconName: string) => {
        switch (iconName) {
            case "FaShieldAlt":
                return <FaShieldAlt size={64} color="#D4AF37"/>;
            case "FaFire":
                return <FaFire size={64} color="#D4AF37"/>;
            case "FaLightbulb":
                return <FaLightbulb size={64} color="#D4AF37"/>;
            case "FaTools":
                return <FaTools size={64} color="#D4AF37"/>;
            case "FaMobileAlt":
                return <FaMobileAlt size={64} color="#D4AF37"/>;
            case "FaGem":
                return <FaGem size={64} color="#D4AF37"/>;
            default:
                return null;
        }
    };
    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
        setTouchEnd(e.targetTouches[0].clientX);
    };
    const handleTouchMove = (e: React.TouchEvent) => {
        const currentTouch = e.targetTouches[0].clientX;
        setTouchEnd(currentTouch);
        if (!isTransitioning && featureSlides) {
            const offset = currentTouch - touchStart;
            setDragOffset(offset);
        }
    };
    const handleTouchEnd = () => {
        if (!featureSlides || touchStart === 0)
            return;
        const swipeDistance = touchStart - touchEnd;
        const minSwipeDistance = 50;
        if (Math.abs(swipeDistance) > minSwipeDistance) {
            setIsTransitioning(true);
            if (swipeDistance > 0) {
                setCurrentSlideIndex((prev) => prev < featureSlides.length - 1 ? prev + 1 : prev);
            }
            else {
                setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : prev));
            }
            setTimeout(() => {
                setIsTransitioning(false);
            }, 600);
        }
        setTouchStart(0);
        setTouchEnd(0);
        setDragOffset(0);
    };
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart(e.clientX);
        setDragOffset(0);
        e.preventDefault();
    };
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || isTransitioning)
            return;
        const offset = e.clientX - dragStart;
        setDragOffset(offset);
        e.preventDefault();
    };
    const handleMouseUp = () => {
        if (!isDragging || !featureSlides)
            return;
        const minDragDistance = 50;
        if (Math.abs(dragOffset) > minDragDistance) {
            setIsTransitioning(true);
            if (dragOffset < 0) {
                setCurrentSlideIndex((prev) => prev < featureSlides.length - 1 ? prev + 1 : prev);
            }
            else {
                setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : prev));
            }
            setTimeout(() => {
                setIsTransitioning(false);
            }, 600);
        }
        setIsDragging(false);
        setDragStart(0);
        setDragOffset(0);
    };
    const handleMouseLeave = () => {
        if (isDragging) {
            setIsDragging(false);
            setDragStart(0);
            setDragOffset(0);
        }
    };
    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images.length]);
    const goToPrevious = () => {
        setCurrentImageIndex((prevIndex) => prevIndex === 0 ? images.length - 1 : prevIndex - 1);
    };
    const goToNext = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };
    const goToImage = (index: number) => {
        setCurrentImageIndex(index);
    };
    return (<>
      <div className={`max-w-7xl mx-auto p-6 ${darkMode ? "text-white" : "text-gray-900"}`}>
        {onBack && (<button onClick={onBack} className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 mb-6 ${darkMode
                ? "bg-[#1E1E1E] text-white hover:bg-[#333333] hover:scale-105"
                : "bg-gray-200 text-gray-900 hover:bg-gray-300 hover:scale-105"} shadow-lg`} aria-label="Back to Products">
            <FaArrowLeft className="text-lg"/>
            <span className="font-medium">Back</span>
          </button>)}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12 items-start">
          
          <div className="relative">
            <div className="relative overflow-hidden">
              <img key={currentImageIndex} src={images[currentImageIndex]} alt={name} className="w-full h-96 object-contain rounded-lg shadow-lg bg-white animate-fade-in"/>

              
              <button onClick={goToPrevious} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                </svg>
              </button>

              <button onClick={goToNext} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>

            
            <div className="flex justify-center gap-2 mt-4">
              {images.slice(0, 6).map((_, idx) => (<button key={idx} onClick={() => goToImage(idx)} className={`w-3 h-3 rounded-full transition ${idx === currentImageIndex
                ? "bg-cyan-500"
                : darkMode
                    ? "bg-gray-600"
                    : "bg-gray-300"}`}/>))}
            </div>

            
            <div className="flex gap-2 overflow-x-auto pb-2 mt-4">
              {images.slice(0, 6).map((img, idx) => (<img key={idx} src={img} alt={`${name} thumbnail ${idx + 1}`} className={`w-20 h-20 object-cover rounded cursor-pointer border-2 flex-shrink-0 ${idx === currentImageIndex
                ? "border-blue-500"
                : darkMode
                    ? "border-gray-600"
                    : "border-gray-300"}`} onClick={() => goToImage(idx)}/>))}
            </div>
          </div>

          
          <div className="space-y-6">
            <h1 className="text-4xl font-bold mb-2">{name}</h1>
            <p className="text-3xl font-semibold text-green-600 mb-2">
              {price}
            </p>
            <p className="mb-2 text-lg">{description}</p>
            {features && features.length > 0 && (<div className={`border rounded-lg p-4 mb-4 ${darkMode ? "bg-[#1E1E1E]" : "bg-gray-50"}`}>
                <ul className="space-y-2">
                  {features.map((feature, idx) => (<li key={idx} className="flex items-start gap-3">
                      <span className={`flex-shrink-0 ${darkMode ? "text-[#808080]" : "text-gray-900"}`}>•</span>
                      <span className={`${darkMode ? "text-[#B3B3B3]" : "text-gray-700"}`}>
                        {feature}
                      </span>
                    </li>))}
                </ul>
              </div>)}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-green-500 font-semibold">In stock</span>
            </div>
            <button onClick={onAddToCart} className="w-full bg-[#D4AF37] text-black px-8 py-4 rounded-lg hover:bg-[#E5C158] transition text-lg font-semibold mb-2">
              ADD TO CART
            </button>
            <p className={`text-sm mb-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Starting at $438/mo or 0% APR with{" "}
              <span className="font-bold">Affirm</span>.{" "}
              <a href="#" className="underline">
                Learn more
              </a>
            </p>

            
            <div className={`space-y-2 mb-4 p-4 rounded-lg ${darkMode ? "bg-[#1E1E1E]" : "bg-gray-200"}`}>
              {productFeatureIcons.map((feature) => {
            return (<div key={feature.type} className="flex items-center">
                    <span className="inline-block w-8 h-6 flex items-center justify-center mr-3 rounded">
                      <div dangerouslySetInnerHTML={{ __html: feature.iconSvg }}/>
                    </span>
                    <span className={`${darkMode ? "text-[#B3B3B3]" : "text-gray-700"}`}>
                      {feature.title}
                    </span>
                  </div>);
        })}
            </div>
          </div>
        </div>

        
        <div className={`border-t ${darkMode ? "border-gray-600" : "border-gray-300"}`}>
          
          <div className={`border-b ${darkMode ? "border-gray-600" : "border-gray-300"}`}>
            <button onClick={() => toggleSection("description")} className={`w-full flex justify-between items-center p-4 text-left transition ${darkMode ? "hover:bg-[#242424]" : "hover:bg-gray-50"}`}>
              <h2 className="text-xl font-semibold">Product Description</h2>
              <svg width="24" height="24" fill="none" stroke="currentColor" className={`transform transition-transform ${openSection === "description" ? "rotate-180" : ""}`}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            {openSection === "description" && (<div className={`p-4 ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
                <ul className="space-y-2">
                  {(productDescription || description)
                .split('\n')
                .filter((line: string) => line.trim())
                .map((line: string, idx: number) => (<li key={idx} className="flex items-start gap-3">
                        <span className={`flex-shrink-0 ${darkMode ? "text-gray-400" : "text-gray-900"}`}>•</span>
                        <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
                          {line.trim()}
                        </span>
                      </li>))}
                </ul>
              </div>)}
          </div>

          
          <div className={`border-b ${darkMode ? "border-gray-600" : "border-gray-300"}`}>
            <button onClick={() => toggleSection("benefits")} className={`w-full flex justify-between items-center p-4 text-left transition ${darkMode ? "hover:bg-[#242424]" : "hover:bg-gray-50"}`}>
              <h2 className="text-xl font-semibold">Health Benefits</h2>
              <svg width="24" height="24" fill="none" stroke="currentColor" className={`transform transition-transform ${openSection === "benefits" ? "rotate-180" : ""}`}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            {openSection === "benefits" && (<div className={`p-4 ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
                {healthBenefitsDescription ? (<ul className="space-y-2">
                    {healthBenefitsDescription
                    .split('\n')
                    .filter((line: string) => line.trim())
                    .map((line: string, idx: number) => (<li key={idx} className="flex items-start gap-3">
                          <span className={`flex-shrink-0 ${darkMode ? "text-[#808080]" : "text-gray-900"}`}>•</span>
                          <span className={darkMode ? "text-[#B3B3B3]" : "text-gray-700"}>
                            {line.trim()}
                          </span>
                        </li>))}
                  </ul>) : (<ul className={`space-y-3 ${darkMode ? "text-[#B3B3B3]" : "text-gray-700"}`}>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>
                        <strong>Detoxification:</strong> Promotes sweating to
                        help remove toxins from the body
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>
                        <strong>Improved Circulation:</strong> Heat exposure
                        increases blood flow and cardiovascular health
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>
                        <strong>Muscle Recovery:</strong> Helps reduce muscle
                        soreness and aids in post-workout recovery
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>
                        <strong>Stress Relief:</strong> Provides a relaxing
                        environment to reduce stress and anxiety
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>
                        <strong>Skin Health:</strong> Opens pores and improves
                        skin tone and clarity
                      </span>
                    </li>
                  </ul>)}
              </div>)}
          </div>

          
          <div className={`border-b ${darkMode ? "border-gray-600" : "border-gray-300"}`}>
            <button onClick={() => toggleSection("specifications")} className={`w-full flex justify-between items-center p-4 text-left transition ${darkMode ? "hover:bg-[#242424]" : "hover:bg-gray-50"}`}>
              <h2 className="text-xl font-semibold">Specifications</h2>
              <svg width="24" height="24" fill="none" stroke="currentColor" className={`transform transition-transform ${openSection === "specifications" ? "rotate-180" : ""}`}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            {openSection === "specifications" && (<div className={`p-4 ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
                <ul className={`space-y-2 mb-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  {specifications.map((spec, idx) => (<li key={idx} className="flex items-start gap-2">
                      <span className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        •
                      </span>
                      <span>{spec}</span>
                    </li>))}
                </ul>
                {specificationsImage && (<div className="mt-4">
                    <img src={specificationsImage} alt={`${name} specifications`} className="w-full max-w-2xl mx-auto rounded-2xl shadow-md border-2 border-black"/>
                  </div>)}
              </div>)}
          </div>

          
          <div className={`border-b ${darkMode ? "border-gray-600" : "border-gray-300"}`}>
            <button onClick={() => toggleSection("qa")} className={`w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 transition ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"}`}>
              <h2 className="text-xl font-semibold">Questions & Answers</h2>
              <svg width="24" height="24" fill="none" stroke="currentColor" className={`transform transition-transform ${openSection === "qa" ? "rotate-180" : ""}`}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            {openSection === "qa" && (<div className={`p-4 ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
                <div className={`space-y-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  {questionsAndAnswers && questionsAndAnswers.length > 0 ? (questionsAndAnswers.map((qa, idx) => (<div key={idx} className="mb-4">
                        <div className="flex items-start gap-3 mb-2">
                          <span className={`flex-shrink-0 font-bold ${darkMode ? "text-gray-400" : "text-gray-900"}`}>Q:</span>
                          <p className="font-semibold">{qa.question}</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className={`flex-shrink-0 font-bold ${darkMode ? "text-gray-400" : "text-gray-900"}`}>A:</span>
                          <p className={`whitespace-pre-line ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                            {qa.answer}
                          </p>
                        </div>
                      </div>))) : (<>
                      <div>
                        <p className="font-semibold mb-2">
                          Q: How long does assembly take?
                        </p>
                        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          A: Most customers can assemble their sauna in 30-60
                          minutes with the included instructions and tools.
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold mb-2">
                          Q: What is the power requirement?
                        </p>
                        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          A: Standard 110V outlet is sufficient for most models.
                          Check specifications for your specific model.
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold mb-2">
                          Q: Is professional installation required?
                        </p>
                        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          A: No, our saunas are designed for easy
                          self-installation. However, professional installation
                          is available upon request.
                        </p>
                      </div>
                    </>)}
                </div>
              </div>)}
          </div>
        </div>
      </div>

      
      {featureSlides && featureSlides.length > 0 && (<div className={`mt-16 mb-12 w-full ${darkMode ? "text-white" : "text-gray-900"}`}>
          <h2 className="text-3xl font-bold text-center mb-8">
            Sauna Features
          </h2>

          
          <div className="relative w-full select-none" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave} style={{ cursor: isDragging ? "grabbing" : "grab" }}>
            
            <div className="relative overflow-x-hidden">
              
              <div className="flex transition-transform duration-700 ease-out touch-pan-y" style={{
                transform: `translateX(calc(-${currentSlideIndex * 40}% + ${!isTransitioning ? dragOffset : 0}px))`,
                willChange: "transform",
            }}>
                {featureSlides.map((slide, idx) => (<div key={idx} className="flex-shrink-0 px-2 md:px-4" style={{ width: "60%" }}>
                    <div className="w-full">
                      
                      <img src={slide.image} alt={slide.title} className={`w-full h-[400px] md:h-[500px] object-contain rounded-lg select-none shadow-lg transition-all duration-500 bg-white`} draggable={false}/>
                      
                      <div className={`mt-6 flex flex-row items-start justify-between gap-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        <div className="flex-1">
                          <h3 className={`text-sm md:text-base font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                            {slide.title}
                          </h3>
                        </div>
                        <div className="flex-1 text-right">
                          <p className={`text-xs md:text-sm leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            {slide.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8 px-4">
            
            <button onClick={() => setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : prev))} disabled={currentSlideIndex === 0} className={`p-2 rounded-full transition ${currentSlideIndex === 0
                ? "opacity-30 cursor-not-allowed"
                : `hover:bg-gray-200 cursor-pointer ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}`} aria-label="Previous slide">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
              </svg>
            </button>

            
            <div className={`w-full max-w-md h-1 rounded-full overflow-hidden ${darkMode ? "bg-gray-600" : "bg-gray-300"}`}>
              <div className="h-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 transition-all duration-500 ease-in-out" style={{
                width: `${((currentSlideIndex + 1) / featureSlides.length) * 100}%`,
            }}/>
            </div>

            
            <button onClick={() => setCurrentSlideIndex((prev) => prev < featureSlides.length - 1 ? prev + 1 : prev)} disabled={currentSlideIndex === featureSlides.length - 1} className={`p-2 rounded-full transition ${currentSlideIndex === featureSlides.length - 1
                ? "opacity-30 cursor-not-allowed"
                : `hover:bg-gray-200 cursor-pointer ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}`} aria-label="Next slide">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>)}

      
      <section className="w-full py-12 bg-black text-white flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">
          Dial into Your Sauna Experience
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-5xl mb-8">
          {saunaFeatures.slice(0, 3).map((feature, idx) => (<div key={idx} className="flex flex-col items-center">
              <span className="mb-4">{getIcon(feature.iconName)}</span>
              <span className="font-bold text-lg mb-2">{feature.title}</span>
              <button onClick={() => setOpenFeature(openFeature === feature.title ? null : feature.title)} className="text-2xl font-bold text-[#D4AF37] hover:text-[#b8941f] transition">
                +
              </button>
              {openFeature === feature.title && (<p className="mt-4 text-sm text-center text-gray-300 max-w-xs">
                  {feature.detail}
                </p>)}
            </div>))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-5xl">
          {saunaFeatures.slice(3, 6).map((feature, idx) => (<div key={idx} className="flex flex-col items-center">
              <span className="mb-4">{getIcon(feature.iconName)}</span>
              <span className="font-bold text-lg mb-2">{feature.title}</span>
              <button onClick={() => setOpenFeature(openFeature === feature.title ? null : feature.title)} className="text-2xl font-bold text-[#D4AF37] hover:text-[#b8941f] transition">
                +
              </button>
              {openFeature === feature.title && (<p className="mt-4 text-sm text-center text-gray-300 max-w-xs">
                  {feature.detail}
                </p>)}
            </div>))}
        </div>
      </section>

      
      {includedAccessories && includedAccessories.length > 0 && (<section className={`py-12 ${darkMode ? "text-white" : "text-gray-900"}`}>
          <div className="w-full">
            <h2 className="text-4xl font-bold text-center mb-10">
              Included Accessories
            </h2>
          <div className="relative">
            
            <button onClick={scrollLeft} className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition" aria-label="Scroll left">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
              </svg>
            </button>

            
            <div ref={accessoriesRef} className="flex gap-8 overflow-x-hidden scroll-smooth px-12" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              {includedAccessories && includedAccessories.length > 0
                ? includedAccessories.map((accessory: any, index: number) => (<div key={`custom-${index}`} className={`flex flex-col rounded-xl w-full max-w-xs shadow flex-shrink-0 overflow-hidden ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
                      <div className="w-full h-48 flex items-center justify-center">
                        {accessory.image ? (<img src={accessory.image} alt={accessory.title} className="w-full h-full object-contain" onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                        }}/>) : (<div className="flex items-center justify-center w-full h-full bg-cyan-100">
                            <FaTools className="text-4xl text-cyan-600"/>
                          </div>)}
                      </div>
                      <div className="flex flex-col items-center text-center flex-1 p-6">
                        <h3 className="text-xl font-semibold mb-3 leading-tight">
                          {accessory.title}
                        </h3>
                        <p className={`text-sm leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                          {accessory.description}
                        </p>
                      </div>
                    </div>))
                : null}
            </div>

            
            <button onClick={scrollRight} className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition" aria-label="Scroll right">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </section>)}

      
      <section className={`w-full py-16 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 px-4 md:px-0">
          
          <div className="flex flex-col items-start md:items-center text-left md:text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Flexible Financing
            </h3>
            <p className="mb-4 text-base md:text-md">
              Explore financing options to suit your budget through Affirm.
            </p>
            
          </div>
          
          <div className="flex flex-col items-start md:items-center text-left md:text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Effortless Assembly
            </h3>
            <p className="mb-4 text-base md:text-md">
              Setting up your personal wellness lab is as easy and
              straightforward. With clear instructions and minimal effort, your
              cold plunge or sauna can be assembled within two hours or less,
              depending on the model.
            </p>
          </div>
          
          <div className="flex flex-col items-start md:items-center text-left md:text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Warranty Included
            </h3>
            <p className="mb-4 text-base md:text-md">
              All cold plunges include a 180 day warranty, saunas come with a
              180 day warranty, with extended warranty options available for
              both.
            </p>
          </div>
        </div>
      </section>
      
      <SaunaBenefitsSection darkMode={darkMode}/>

      
      {dimensionsImage && (<section className="w-full flex flex-col items-center py-12">
          <h2 className={`text-4xl font-bold mb-8 text-center ${darkMode ? "text-white" : "text-gray-900"}`}>
            Dimensions
          </h2>
          <div className={`rounded-3xl mt-4 flex justify-center items-center ${darkMode ? "bg-gray-900" : "bg-white"}`}>
            <img src={dimensionsImage} alt="Sauna Dimensions" className="max-w-full h-auto rounded-2xl" style={{ maxWidth: '800px' }}/>
          </div>
        </section>)}

      <Commonsection />

      <Footer />
    </>);
};
export default SaunaProduct;
