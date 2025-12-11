import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import SaunaBenefitsSection from "./SaunaBenefits";
import Products from "./saunaProductcards";
import { Product } from "../../../constants/saunaProducts";
import Footer from "../../Footer";
const Sauna: React.FC<{
    darkMode: boolean;
}> = ({ darkMode }) => {
    const router = useRouter();
    const handleProductClick = (product: Product) => {
        router.push(`/sauna/product/${encodeURIComponent(product.name)}`);
    };
    return (<>
    <div>
      
      <motion.section className="relative h-[550px] w-full" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <Image src="/assets/saunas/1.png" alt="Sauna Hero" fill className="object-cover object-center" unoptimized/>
        <div className="absolute inset-0 flex items-center justify-start md:justify-start">
          <motion.div className="text-white text-left max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl p-4 sm:p-6 md:p-8 ml-4 sm:ml-6 md:ml-8 lg:ml-12" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-2 whitespace-nowrap">
              Full Spectrum Infrared Saunas
            </h1>
            <p className="text-sm sm:text-base md:text-lg">
              Dialed Labs full-spectrum infrared system delivers all three
              therapeutic wavelengths for clinically backed benefits – from
              anti-aging and detoxification to stress relief and accelerated
              recovery.
            </p>
          </motion.div>
        </div>
      </motion.section>

      
      <motion.section className={`py-12 ${darkMode ? "bg-[#1E1E1E]" : "bg-gray-50"}`} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className={`text-2xl font-bold text-center mb-8 ${darkMode ? "text-white" : "text-gray-900"}`}>
            Full Spectrum Infrared Saunas
          </h2>
          <Products type="indoor" onProductClick={handleProductClick} darkMode={darkMode}/>
        </div>
      </motion.section>

      
      <motion.section className="relative h-[550px] w-full" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
        <Image src="/assets/saunas/2.png" alt="Sweat Smarter" fill className="object-cover object-center md:object-right" unoptimized/>
        <div className="absolute inset-0 flex items-center justify-end">
          <motion.div className="text-white text-right max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl p-4 sm:p-6 md:p-8 mr-4 sm:mr-6 md:mr-8 lg:mr-12" initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }} viewport={{ once: true }}>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold mb-2">
              Sweat Smarter
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl">
              Unwind in deep, radiant heat that supports rejuvenation and total
              body wellness. Detox, restore, and feel your best with Dialed Labs
              saunas.
            </p>
          </motion.div>
        </div>
      </motion.section>

      <SaunaBenefitsSection darkMode={darkMode}/>

      
      <section className={`py-12 ${darkMode ? "bg-[#121212]" : "bg-white"}`}>
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{
            hidden: {},
            visible: {
                transition: {
                    staggerChildren: 0.2,
                },
            },
        }}>
          <motion.div variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
        }} transition={{ duration: 0.6 }}>
            <h3 className={`font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Flexible Financing
            </h3>
            <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
              Explore financing options to suit your budget through Affirm.
            </p>
          </motion.div>
          <motion.div variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
        }} transition={{ duration: 0.6 }}>
            <h3 className={`font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Effortless Assembly
            </h3>
            <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
              Setting up your personal wellness is easy and straightforward.
              With clear instructions and minimal effort, your sauna or spa can
              be assembled within two hours or less, depending on the model.
            </p>
          </motion.div>
          <motion.div variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
        }} transition={{ duration: 0.6 }}>
            <h3 className={`font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Warranty Included
            </h3>
            <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
              All products include a 30-day warranty. Saunas come with a 10-year
              warranty, with extended warranty options available for both.
            </p>
          </motion.div>
        </motion.div>
      </section>

      
      <motion.section className={`py-12 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 ${darkMode ? "bg-[#1E1E1E] text-white" : "bg-gray-100 text-gray-900"}`} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
        <Image src="/assets/saunas/3.png" alt="Sauna Wellness" width={400} height={300} className="rounded-lg w-full md:w-1/3 object-cover" unoptimized/>
        <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">
            Saunas Optimized for Wellness
          </h2>
          <p className="text-sm sm:text-base">
            Dialed Labs saunas are a daily ritual in strength, recovery, and
            renewal. Crafted with premium materials built to withstand the
            elements, our saunas blend powerful heat therapy with whole,
            enduring design.
          </p>
          <p className="mt-2 text-sm sm:text-base">
            Each session is an invitation for restoration: effortless stress
            relief, enhancing circulation, rejuvenating skin, and accelerating
            healing. The increased radiant heat opens your airways, revives your
            mind, and helps you sleep deeper.
          </p>
          <p className="mt-2 text-sm sm:text-base">
            Invest in lasting strength, effortless recovery, and elevated
            living. Explore our lineup to find the perfect sauna for your needs.
          </p>
        </div>
      </motion.section>
    </div>
      <Footer />
      </>);
};
export default Sauna;
