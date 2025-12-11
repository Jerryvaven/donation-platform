import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import ColdPlungeBenefitsSection from "./ColdPlungeBenefits";
import Products from "./coldPlungeProductcards";
import { Product } from "../../../constants/coldPlungeProducts";
import Footer from "../../Footer";
const ColdPlunge: React.FC<{
    darkMode: boolean;
}> = ({ darkMode }) => {
    const router = useRouter();
    const handleProductClick = (product: Product) => {
        router.push(`/cold-plunge/product/${encodeURIComponent(product.name)}`);
    };
    return (<>
    <div>
      
      <section className="w-full flex flex-col items-center justify-center bg-black text-white  px-4">
        <motion.h1 className="text-4xl md:text-5xl font-extrabold mb-4 mt-24 text-center" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
          Introducing Precision Cold
        </motion.h1>
        <motion.p className="text-lg md:text-xl mb-6 text-center max-w-2xl" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}>
          Experience the future of cold therapy with the Dialed Pro Pod. Its patented, direct ice-making technology and elevated design refine your wellness ritual.
        </motion.p>
        <motion.button className="bg-white text-black font-semibold px-6 py-3 rounded-full shadow hover:bg-gray-200 transition" onClick={() => window.location.href = '/cold-plunge/product/Dialed%20Pro%20Pod'} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          Shop Dialed Pro Pod
        </motion.button>
        <motion.div className="w-full flex justify-center -mt-60" initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}>
          <Image src="/assets/coldplunges/bg-1.png" alt="Dialed Pro Pod" width={1100} height={300} className="rounded-xl object-contain" unoptimized/>
        </motion.div>
      </section>

      
      <motion.section className={`py-12 ${darkMode ? "bg-[#1E1E1E]" : "bg-gray-50"}`} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className={`text-3xl font-bold text-center mb-8 ${darkMode ? "text-white" : "text-gray-900"}`}>
            Shop All Cold Plunges
          </h2>
          <Products onProductClick={handleProductClick} darkMode={darkMode}/>
        </div>
      </motion.section>

      
      <ColdPlungeBenefitsSection darkMode={darkMode}/>

      
      <motion.section className={`py-16 ${darkMode ? "bg-[#121212]" : "bg-white"}`} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="text-center md:text-left">
              <h3 className={`text-xl font-bold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}>
                Flexible Financing
              </h3>
              <p className={`text-sm mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Explore financing options to suit your budget through Affirm.{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Learn More
                </a>
              </p>
            </div>

            
            <div className="text-center md:text-left">
              <h3 className={`text-xl font-bold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}>
                Effortless Assembly
              </h3>
              <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Setting up your personal wellness lab is easy and straightforward. With clear instructions and minimal effort, your cold plunge or sauna can be assembled within two hours or less, depending on the model.
              </p>
            </div>

            
            <div className="text-center md:text-left">
              <h3 className={`text-xl font-bold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}>
                Warranty Included
              </h3>
              <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                All cold plunges include a 180 day warranty, saunas come with a 180 day warranty, with extended warranty options available for both.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      
      <motion.section className={`py-16 ${darkMode ? "bg-[#1E1E1E]" : "bg-gray-100"}`} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            <div className="flex justify-center">
              <Image src="/assets/coldplunges/bg-2.png" alt="Contrast Therapy Sauna" width={500} height={500} className="rounded-xl object-contain" unoptimized/>
            </div>

            
            <div>
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                Contrast Therapy
              </h2>
              <p className={`text-base md:text-lg mb-6 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Accompany your cold plunge with a sauna to enhance your experience with the benefits of contrast therapy.
              </p>
              <button className="bg-black text-white font-semibold px-6 py-3 rounded-full shadow hover:bg-gray-800 transition" onClick={() => router.push('/sauna')}>
                Shop Saunas
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      
      <Footer />
    </div>
    </>);
};
export default ColdPlunge;
