import React from "react";
import { FaInstagram, FaTiktok } from "react-icons/fa";
const Footer: React.FC = () => {
    return (<footer className="w-full bg-black text-white py-12 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-center items-center gap-12">
        
        <div className="flex flex-col md:flex-row gap-12 w-full md:w-auto">
          
          <div>
            <div className="mb-2">
              <span className="bg-[#444] text-xs font-bold px-3 py-1 rounded">
                EXPLORE
              </span>
            </div>
            <ul className="mt-2 space-y-1">
              <li>
                <a href="/sauna" className="font-bold text-base md:text-md text-[#fffbe6] hover:underline">
                  SAUNAS
                </a>
              </li>
              <li>
                <a href="/cold-plunges" className="font-bold text-base md:text-md text-[#fffbe6] hover:underline">
                  COLD PLUNGES
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <div className="mb-2">
              <span className="bg-[#444] text-xs font-bold px-3 py-1 rounded">
                LEARN MORE
              </span>
            </div>
            <ul className="mt-2 space-y-1">
              <li>
                <a href="/about" className="text-sm  hover:underline">
                  ABOUT US
                </a>
              </li>
              <li>
                <a href="/blog" className="text-sm  hover:underline">
                  BLOG
                </a>
              </li>
              <li>
                <a href="/reviews" className="text-sm md:text-hover:underline">
                  REVIEWS
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <div className="mb-2">
              <span className="bg-[#444] text-sm font-bold px-3 py-1 rounded">
                HELP
              </span>
            </div>
            <ul className="mt-2 space-y-1">
              <li>
                <a href="/contact" className="text-sm  hover:underline">
                  CONTACT US
                </a>
              </li>
              <li>
                <a href="/shipping-policy" className="text-sm  hover:underline">
                  SHIPPING POLICY
                </a>
              </li>
              <li>
                <a href="/returns" className="text-sm  hover:underline">
                  RETURNS & REFUNDS
                </a>
              </li>
              <li>
                <a href="/terms" className="text-sm  hover:underline">
                  TERMS & CONDITIONS
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-sm  hover:underline">
                  PRIVACY POLICY
                </a>
              </li>
              <li>
                <a href="/disclaimer" className="text-sm  hover:underline">
                  DISCLAIMER
                </a>
              </li>
              <li>
                <a href="/accessibility" className="text-sm  hover:underline">
                  ACCESSIBILITY
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <div className="mb-2">
              <span className="bg-[#444] text-xs font-bold px-3 py-1 rounded">
                MY ACCOUNT
              </span>
            </div>
            <ul className="mt-2 space-y-1">
              <li>
                <a href="/login" className="text-sm  hover:underline">
                  LOGIN
                </a>
              </li>
              <li>
                <a href="/account" className="text-sm  hover:underline">
                  MY ACCOUNT
                </a>
              </li>
              <li>
                <a href="/reset-password" className="text-sm  hover:underline">
                  RESET PASSWORD
                </a>
              </li>
            </ul>
            <div className="mt-4">
              <span className="bg-[#444] text-xs font-bold px-3 py-1 rounded">
                GET IN TOUCH
              </span>
            </div>
            <div className="mt-2 text-xs md:text-sm">
              <a href="mailto:support@dialed-labs.com" className="hover:underline">
                support@dialed-labs.com
              </a>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center w-full md:w-auto mt-8 md:mt-0">
          <img src="/assets/logo.png" alt="Dialed Labs Logo" className="w-40 mb-4" style={{ filter: "drop-shadow(0 2px 8px #000)" }}/>
          <div className="flex gap-6 mt-2">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram size={32} color="#d4c37a"/>
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
              <FaTiktok size={32} color="#d4c37a"/>
            </a>
          </div>
        </div>
      </div>
    </footer>);
};
export default Footer;
