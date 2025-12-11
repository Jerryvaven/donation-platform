import React, { useState } from "react";
import { motion } from "framer-motion";
import { coldPlungeBenefits } from "../../../constants/coldPlungeBenefits";
interface ColdPlungeBenefitsSectionProps {
    darkMode: boolean;
}
import { FaFire, FaCalendarCheck, FaRedo, FaBolt, FaShieldAlt, FaGem, FaMoon, FaSmile, } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
const iconMap: {
    [key: string]: React.ComponentType<{
        className?: string;
    }>;
} = {
    FaFire,
    FaCalendarCheck,
    FaRedo,
    FaBolt,
    FaShieldAlt,
    FaGem,
    FaMoon,
    FaSmile,
};
const ColdPlungeBenefitsSection: React.FC<ColdPlungeBenefitsSectionProps> = ({ darkMode, }) => {
    const [expanded, setExpanded] = useState<{
        [key: string]: boolean;
    }>({});
    const toggleExpanded = (key: string) => {
        setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
    };
    return (<motion.section className={`py-12 ${darkMode ? "bg-black text-white" : "bg-[#1A1A1A] text-white"}`} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
      <h2 className="text-2xl font-bold text-center py-4 mb-8 text-white">
        Cold Plunge Health Benefits
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto  mb-8">
        {coldPlungeBenefits.map((benefit, index) => {
            const IconComponent = iconMap[benefit.icon];
            return (<motion.div key={benefit.id} className="flex flex-col items-center text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: (index + 1) * 0.1 }} viewport={{ once: true }}>
              {IconComponent &&
                    React.createElement(IconComponent, {
                        className: "mb-3 text-6xl text-[#D4AF37]",
                    })}
              <div className="flex items-center justify-center gap-2 mb-3 min-h-[3rem]">
                <span className="font-bold text-sm md:text-base leading-tight">
                  {benefit.title}
                </span>
                <FaPlus className="text-lg cursor-pointer transition-colors flex-shrink-0 text-[#FFD700]" onClick={() => toggleExpanded(benefit.id)}/>
              </div>
              {expanded[benefit.id] && (<motion.p className="text-xs md:text-xs text-center mt-2 max-w-xs" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  {benefit.description}
                </motion.p>)}
            </motion.div>);
        })}
      </div>
    </motion.section>);
};
export default ColdPlungeBenefitsSection;
