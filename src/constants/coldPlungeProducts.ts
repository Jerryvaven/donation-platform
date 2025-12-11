export const coldPlungeDimensionsImage = '/assets/test.webp';
export const coldPlungeIncludedAccessories = [
    {
        title: 'Chiller Unit',
        image: '/assets/test.webp',
        description: 'Powerful chiller maintains water temperature between 35-60°F.',
    },
    {
        title: 'Wifi Controller',
        image: '/assets/test.webp',
        description: 'Control your cold plunge from anywhere with the Plunge mobile app.',
    },
    {
        title: 'Insulated Cover',
        image: '/assets/test.webp',
        description: 'Keeps water cold and prevents evaporation.',
    },
    {
        title: 'LED Lighting',
        image: '/assets/test.webp',
        description: 'Ambient lighting for a serene experience.',
    },
];
import { FaShieldAlt, FaSnowflake, FaLightbulb, FaTools, FaMobileAlt, FaGem } from 'react-icons/fa';
export interface FeatureSlide {
    title: string;
    description: string;
    image: string;
    icon?: string;
}
export interface Product {
    id: string;
    name: string;
    price: string;
    features: string[];
    image: string;
    button: string;
    images: string[];
    benefits: string[];
    specifications: string[];
    warranty: string;
    shipping: string;
    shortDescription: string;
    productDescription?: string;
    healthBenefitsDescription?: string;
    specificationsImage?: string;
    questionsAndAnswers?: Array<{
        question: string;
        answer: string;
    }>;
    testImage?: string;
    featureSlides?: FeatureSlide[];
}
export interface ColdPlungeFeature {
    title: string;
    iconName: string;
    detail: string;
}
export const coldPodFeatureSlides: FeatureSlide[] = [
    {
        title: "Designed for Indoor Use",
        description: "Compact design perfect for home gyms, bathrooms, or wellness spaces.",
        image: "/assets/coldplunges/pod-slide1.png"
    },
    {
        title: "Hand-crafted in the USA",
        description: "Precision-engineered and manufactured in California, each cold plunge is made to order.",
        image: "/assets/coldplunges/pod-slide2.png"
    },
    {
        title: "Smart Connectivity",
        description: "Manage your cold plunge sessions effortlessly with complete control over temperature and time from your smartphone.",
        image: "/assets/coldplunges/pod-slide3.png"
    },
    {
        title: "Premium Materials",
        description: "Constructed from durable, insulated materials ensuring optimal cold retention.",
        image: "/assets/coldplunges/pod-slide4.png"
    },
    {
        title: "Advanced Chilling Technology",
        description: "Powerful chiller maintains consistent cold temperatures for optimal recovery benefits.",
        image: "/assets/coldplunges/pod-slide5.png"
    }
];
export const proPodFeatureSlides: FeatureSlide[] = [
    {
        title: "Patented Ice-Making Technology",
        description: "Revolutionary technology creates ice directly from water for sub-zero cooling temperatures.",
        image: "/assets/coldplunges/pro-pod-slide1.png"
    },
    {
        title: "Integrated Purification Systems",
        description: "Ozone, UV, and dual filtration systems maintain pristine water quality for week-long sessions.",
        image: "/assets/coldplunges/pro-pod-slide2.png"
    },
    {
        title: "Commercial-Grade Performance",
        description: "Built for intensive use with 2HP compressor and premium insulated composite construction.",
        image: "/assets/coldplunges/pro-pod-slide3.png"
    },
    {
        title: "Smart App Control",
        description: "Complete remote management of temperature, filtration, and session timing from your mobile device.",
        image: "/assets/coldplunges/pro-pod-slide4.png"
    },
    {
        title: "Self-Contained Design",
        description: "No plumbing required - everything you need for professional cold therapy in one elegant package.",
        image: "/assets/coldplunges/pro-pod-slide5.png"
    }
];
export const verticalPlungeFeatureSlides: FeatureSlide[] = [
    {
        title: "Vertical Submersion Design",
        description: "Unique vertical orientation provides complete body immersion in a compact footprint.",
        image: "/assets/coldplunges/vertical-slide1.png"
    },
    {
        title: "Space-Efficient Solution",
        description: "Perfect for smaller wellness spaces, home gyms, or apartments with limited floor space.",
        image: "/assets/coldplunges/vertical-slide2.png"
    },
    {
        title: "Rapid Recovery Technology",
        description: "Advanced chilling system delivers consistent cold temperatures for accelerated muscle recovery.",
        image: "/assets/coldplunges/vertical-slide3.png"
    },
    {
        title: "Premium Material Options",
        description: "Choose from sleek black fiberglass or natural wood finishes to match your aesthetic.",
        image: "/assets/coldplunges/vertical-slide4.png"
    },
    {
        title: "Mobile App Integration",
        description: "Control your sessions remotely with customizable temperature and timing settings.",
        image: "/assets/coldplunges/vertical-slide5.png"
    }
];
export const airPlungeFeatureSlides: FeatureSlide[] = [
    {
        title: "Portable Cold Therapy",
        description: "Lightweight and portable design allows you to take cold therapy anywhere you need it.",
        image: "/assets/coldplunges/air-plunge-slide1.png"
    },
    {
        title: "Powerful Cooling Performance",
        description: "Reaches temperatures as low as 37°F for effective cold water immersion therapy.",
        image: "/assets/coldplunges/air-plunge-slide2.png"
    },
    {
        title: "Insulated Efficiency",
        description: "Advanced insulation maintains cold temperatures while minimizing energy consumption.",
        image: "/assets/coldplunges/air-plunge-slide3.png"
    },
    {
        title: "Self-Contained Operation",
        description: "No plumbing or installation required - simply fill, chill, and begin your recovery sessions.",
        image: "/assets/coldplunges/air-plunge-slide4.png"
    },
    {
        title: "Travel-Ready Design",
        description: "Compact dimensions and durable construction make it perfect for athletes on the go.",
        image: "/assets/coldplunges/air-plunge-slide5.png"
    }
];
export const generalColdPlungeFeatureSlides: FeatureSlide[] = [
    {
        title: "Accelerated Recovery",
        description: "Cold water immersion reduces inflammation, speeds up muscle recovery, and helps athletes bounce back faster from intense training sessions.",
        image: "/assets/coldplunges/recovery.png"
    },
    {
        title: "Mental Clarity & Focus",
        description: "Regular cold plunging stimulates the vagus nerve, reduces stress hormones, and enhances mental clarity and cognitive function.",
        image: "/assets/coldplunges/mental.png"
    },
    {
        title: "Immune System Boost",
        description: "Cold exposure activates brown fat and strengthens your immune response, helping you stay healthier year-round.",
        image: "/assets/coldplunges/immune.png"
    },
    {
        title: "Improved Circulation",
        description: "The cold causes blood vessels to constrict and dilate, creating a pumping effect that enhances circulation and cardiovascular health.",
        image: "/assets/coldplunges/circulation.png"
    },
    {
        title: "Better Sleep Quality",
        description: "Cold plunging before bed can improve sleep quality by lowering core body temperature and promoting deeper, more restorative sleep.",
        image: "/assets/coldplunges/sleep.png"
    }
];
export const coldPodCardBenefits = [
    "Rapid muscle recovery",
    "Reduced inflammation",
    "Improved circulation",
    "Mental clarity boost",
    "Immune system support"
];
export const coldTubCardBenefits = [
    "Group recovery sessions",
    "Commercial-grade chilling",
    "Weather-resistant design",
    "Community wellness",
    "All-season outdoor use"
];
export const coldBarrelCardBenefits = [
    "Executive recovery",
    "Large capacity",
    "Premium insulation",
    "Corporate wellness",
    "High-end customization"
];
export const allColdPlungeProducts: Product[] = [
    {
        id: "dialed-vertical-plunge-black",
        name: "Dialed Vertical Plunge Black",
        price: "$6,499",
        features: [
            "Vertical submersion",
            "Compact yet spacious",
            "Black or wood option",
            "Self-contained design, no plumbing needed",
            "Advanced filtration for week-long purity"
        ],
        image: "/assets/coldplunges/vertical-black.png",
        button: "Shop Dialed Vertical Plunge",
        images: ["/assets/coldplunges/vertical-black.png", "/assets/test.webp", "/assets/test.webp", "/assets/test.webp", "/assets/test.webp", "/assets/test.webp"],
        benefits: [
            "Vertical submersion",
            "Compact yet spacious",
            "Black or wood option",
            "Self-contained design, no plumbing needed"
        ],
        featureSlides: verticalPlungeFeatureSlides,
        specifications: [
            "Capacity: 1-2 persons",
            "Dimensions: 48\" x 48\" x 60\"",
            "Water Capacity: 150 gallons",
            "Temperature Range: 35-60°F",
            "Chiller: 1HP compressor",
            "Power: 120V, 15A",
            "Material: Insulated fiberglass"
        ],
        specificationsImage: "/assets/test.webp",
        warranty: "5-year warranty",
        shipping: "Free shipping within continental US",
        shortDescription: "Vertical cold therapy, elevated design",
        productDescription: "The Dialed Vertical Plunge Black brings the power of cold water immersion with a vertical design. This compact cold plunge is designed for solo use, delivering rapid recovery and rejuvenation.\n\nWith advanced chilling technology that maintains water temperatures between 35-60°F, the Vertical Plunge helps reduce inflammation, improve circulation, and accelerate muscle recovery. Smart app control allows you to customize your sessions from anywhere.\n\nBuilt with premium insulated fiberglass and featuring ambient LED lighting, the Vertical Plunge combines cutting-edge technology with elegant design for a transformative cold therapy experience.",
        healthBenefitsDescription: "Cold water immersion has been used for centuries as a powerful recovery tool. By exposing your body to cold temperatures, you activate several physiological responses that promote healing and wellness.\n\nThe cold water causes blood vessels to constrict, reducing inflammation and swelling in muscles and joints. When you exit the cold plunge, the subsequent vasodilation creates a pumping effect that enhances circulation and delivers oxygen-rich blood throughout the body.\n\nCold exposure also stimulates the vagus nerve, promoting relaxation and stress reduction. Regular cold plunging can strengthen your immune system, improve sleep quality, and boost mental clarity.\n\nWhether you're an athlete looking to accelerate recovery or someone seeking natural wellness therapies, cold plunging offers scientifically-backed benefits for body and mind.",
        questionsAndAnswers: [
            {
                question: "How cold should the water be?",
                answer: "We recommend starting at 50-55°F and gradually decreasing to 35-40°F as you build tolerance. The optimal temperature depends on your goals and experience level."
            },
            {
                question: "How long should sessions be?",
                answer: "Begin with 2-3 minute sessions and gradually increase to 3-5 minutes. Listen to your body and never exceed your comfort level."
            },
            {
                question: "What's included in my purchase?",
                answer: "Your cold plunge includes the tub, chiller unit, insulated cover, LED lighting system, and mobile app control."
            },
            {
                question: "How quickly will I get my cold plunge?",
                answer: "In stock items ship within 3-5 business days and arrive within 4-5 days via freight shipping."
            }
        ]
    },
    {
        id: "dialed-pro-pod",
        name: "Dialed Pro Pod",
        price: "$11,499",
        features: [
            "Patented technology to create ice directly from water",
            "Sub-zero cooling",
            "Integrated ozone, UV, and dual filtration systems",
            "Self-contained design, no plumbing needed",
            "Advanced filtration for week-long purity"
        ],
        image: "/assets/coldplunges/pro-pod.png",
        button: "Shop Dialed Pro Pod",
        images: ["/assets/coldplunges/pro-pod.png", "/assets/test.webp", "/assets/test.webp", "/assets/test.webp", "/assets/test.webp", "/assets/test.webp"],
        benefits: [
            "Patented technology to create ice directly from water",
            "Sub-zero cooling",
            "Integrated ozone, UV, and dual filtration systems",
            "Self-contained design, no plumbing needed"
        ],
        featureSlides: proPodFeatureSlides,
        specifications: [
            "Capacity: 1-2 persons",
            "Dimensions: 60\" x 48\" x 36\"",
            "Water Capacity: 200 gallons",
            "Temperature Range: Sub-zero cooling",
            "Chiller: 2HP compressor with ice-making technology",
            "Power: 240V, 20A",
            "Material: Premium insulated composite"
        ],
        specificationsImage: "/assets/test.webp",
        warranty: "5-year warranty",
        shipping: "Free shipping within continental US",
        shortDescription: "Premium cold therapy with patented ice technology",
        productDescription: "The Dialed Pro Pod represents the pinnacle of cold plunge technology with patented ice-making capability. Create ice directly from water for the ultimate cold therapy experience.\n\nWith sub-zero cooling technology and integrated ozone, UV, and dual filtration systems, the Pro Pod delivers unparalleled cold therapy. The self-contained design requires no plumbing and maintains water purity for week-long sessions.\n\nPerfect for athletes and wellness enthusiasts who demand the best in recovery technology.",
        healthBenefitsDescription: "Cold water immersion provides numerous health benefits supported by scientific research. The cold exposure triggers vasoconstriction, which helps reduce inflammation and swelling throughout the body.\n\nThis therapy is particularly effective for athletes, as it helps flush metabolic waste from muscles, reduces delayed onset muscle soreness (DOMS), and accelerates recovery between training sessions.\n\nBeyond physical recovery, cold plunging stimulates the autonomic nervous system, promoting stress reduction and improved mental resilience. Regular sessions may also boost immune function and improve sleep quality.\n\nWhether used individually or in groups, cold water immersion is a powerful tool for enhancing overall wellness and performance.",
        questionsAndAnswers: [
            {
                question: "What makes the Pro Pod different?",
                answer: "The Pro Pod features patented technology that creates ice directly from water, providing sub-zero cooling for the ultimate cold therapy experience."
            },
            {
                question: "What's included in my purchase?",
                answer: "Includes the pod, commercial chiller unit, integrated filtration systems, LED lighting, mobile app control, and insulated cover."
            },
            {
                question: "How do I maintain the water quality?",
                answer: "The integrated ozone, UV, and dual filtration systems maintain water purity for week-long sessions with minimal maintenance."
            },
            {
                question: "Are financing plans available?",
                answer: "We offer 6, 12, and 24 month financing options through Affirm."
            }
        ]
    },
    {
        id: "dialed-pod",
        name: "Dialed Pod",
        price: "$5,999",
        features: [
            "Seated recline submersion",
            "Sleek stainless steel design",
            "UV purification system",
            "Self-contained design, no plumbing needed",
            "Advanced filtration for week-long purity"
        ],
        image: "/assets/coldplunges/pod.png",
        button: "Shop Dialed Pod",
        images: ["/assets/coldplunges/pod.png", "/assets/test.webp", "/assets/test.webp", "/assets/test.webp", "/assets/test.webp", "/assets/test.webp"],
        benefits: [
            "Seated recline submersion",
            "Sleek stainless steel design",
            "UV purification system",
            "Self-contained design, no plumbing needed"
        ],
        featureSlides: coldPodFeatureSlides,
        specifications: [
            "Capacity: 1-2 persons",
            "Dimensions: 54\" x 42\" x 36\"",
            "Water Capacity: 175 gallons",
            "Temperature Range: 35-60°F",
            "Chiller: 1.5HP compressor",
            "Power: 120V, 15A",
            "Material: Stainless steel with insulation"
        ],
        specificationsImage: "/assets/test.webp",
        warranty: "5-year warranty",
        shipping: "Free shipping within continental US",
        shortDescription: "Sleek cold therapy with seated comfort",
        productDescription: "The Dialed Pod features a seated recline design with sleek stainless steel construction. This cold plunge combines comfort with cutting-edge technology for optimal recovery.\n\nWith UV purification system and self-contained design, the Pod delivers clean, cold therapy without the need for plumbing. Advanced filtration maintains water purity for extended use.\n\nPerfect for home wellness spaces and recovery centers.",
        healthBenefitsDescription: "Cold water immersion has been used for centuries as a powerful recovery tool. By exposing your body to cold temperatures, you activate several physiological responses that promote healing and wellness.\n\nThe cold water causes blood vessels to constrict, reducing inflammation and swelling in muscles and joints. When you exit the cold plunge, the subsequent vasodilation creates a pumping effect that enhances circulation and delivers oxygen-rich blood throughout the body.\n\nCold exposure also stimulates the vagus nerve, promoting relaxation and stress reduction. Regular cold plunging can strengthen your immune system, improve sleep quality, and boost mental clarity.\n\nWhether you're an athlete looking to accelerate recovery or someone seeking natural wellness therapies, cold plunging offers scientifically-backed benefits for body and mind.",
        questionsAndAnswers: [
            {
                question: "Can it be used outdoors?",
                answer: "Yes, the Pod can be used outdoors with proper weather protection and maintenance."
            },
            {
                question: "What's included in my purchase?",
                answer: "Includes the pod, chiller unit, insulated cover, UV purification system, and mobile app control."
            },
            {
                question: "How quickly will I get my cold plunge?",
                answer: "In stock items ship within 3-5 business days and arrive within 4-5 days via freight shipping."
            },
            {
                question: "Are financing plans available?",
                answer: "We offer 6, 12, and 24 month financing options through Affirm."
            }
        ]
    },
    {
        id: "dialed-vertical-plunge-wood",
        name: "Dialed Vertical Plunge Wood",
        price: "$6,499",
        features: [
            "Vertical submersion",
            "Compact yet spacious",
            "Black or wood option",
            "Self-contained design, no plumbing needed",
            "Advanced filtration for week-long purity"
        ],
        image: "/assets/coldplunges/vertical-wood.png",
        button: "Shop Dialed Vertical Plunge",
        images: ["/assets/coldplunges/vertical-wood.png", "/assets/test.webp", "/assets/test.webp", "/assets/test.webp", "/assets/test.webp", "/assets/test.webp"],
        benefits: [
            "Vertical submersion",
            "Compact yet spacious",
            "Black or wood option",
            "Self-contained design, no plumbing needed"
        ],
        featureSlides: verticalPlungeFeatureSlides,
        specifications: [
            "Capacity: 1-2 persons",
            "Dimensions: 48\" x 48\" x 60\"",
            "Water Capacity: 150 gallons",
            "Temperature Range: 35-60°F",
            "Chiller: 1HP compressor",
            "Power: 120V, 15A",
            "Material: Premium wood with insulation"
        ],
        specificationsImage: "/assets/test.webp",
        warranty: "5-year warranty",
        shipping: "Free shipping within continental US",
        shortDescription: "Natural wood design, vertical therapy",
        productDescription: "The Dialed Vertical Plunge Wood combines natural aesthetics with modern cold therapy technology. The premium wood finish adds warmth to any wellness space.\n\nWith advanced chilling technology and self-contained design, this vertical plunge delivers effective cold therapy without plumbing requirements. Advanced filtration maintains water purity for week-long sessions.\n\nPerfect for those who appreciate natural materials and cutting-edge wellness technology.",
        healthBenefitsDescription: "Cold water immersion has been used for centuries as a powerful recovery tool. By exposing your body to cold temperatures, you activate several physiological responses that promote healing and wellness.\n\nThe cold water causes blood vessels to constrict, reducing inflammation and swelling in muscles and joints. When you exit the cold plunge, the subsequent vasodilation creates a pumping effect that enhances circulation and delivers oxygen-rich blood throughout the body.\n\nCold exposure also stimulates the vagus nerve, promoting relaxation and stress reduction. Regular cold plunging can strengthen your immune system, improve sleep quality, and boost mental clarity.\n\nWhether you're an athlete looking to accelerate recovery or someone seeking natural wellness therapies, cold plunging offers scientifically-backed benefits for body and mind.",
        questionsAndAnswers: [
            {
                question: "How cold should the water be?",
                answer: "We recommend starting at 50-55°F and gradually decreasing to 35-40°F as you build tolerance. The optimal temperature depends on your goals and experience level."
            },
            {
                question: "How long should sessions be?",
                answer: "Begin with 2-3 minute sessions and gradually increase to 3-5 minutes. Listen to your body and never exceed your comfort level."
            },
            {
                question: "What's included in my purchase?",
                answer: "Your cold plunge includes the tub, chiller unit, insulated cover, LED lighting system, and mobile app control."
            },
            {
                question: "How quickly will I get my cold plunge?",
                answer: "In stock items ship within 3-5 business days and arrive within 4-5 days via freight shipping."
            }
        ]
    },
    {
        id: "dialed-air-plunge",
        name: "Dialed Air Plunge",
        price: "$3,499",
        features: [
            "Powerful cooling to 37°F",
            "Lightweight & portable",
            "Insulated for efficiency",
            "Self-contained design, no plumbing needed",
            "Advanced filtration for week-long purity"
        ],
        image: "/assets/coldplunges/air-plunge.png",
        button: "Shop Dialed Air Plunge",
        images: ["/assets/coldplunges/air-plunge.png", "/assets/test.webp", "/assets/test.webp", "/assets/test.webp", "/assets/test.webp", "/assets/test.webp"],
        benefits: [
            "Powerful cooling to 37°F",
            "Lightweight & portable",
            "Insulated for efficiency",
            "Self-contained design, no plumbing needed"
        ],
        featureSlides: airPlungeFeatureSlides,
        specifications: [
            "Capacity: 1 person",
            "Dimensions: 48\" x 36\" x 30\"",
            "Water Capacity: 100 gallons",
            "Temperature Range: 37-60°F",
            "Chiller: 0.75HP compressor",
            "Power: 120V, 10A",
            "Material: Insulated portable design"
        ],
        specificationsImage: "/assets/test.webp",
        warranty: "3-year warranty",
        shipping: "Free shipping within continental US",
        shortDescription: "Portable cold therapy solution",
        productDescription: "The Dialed Air Plunge offers powerful cooling in a lightweight, portable design. Perfect for those who need flexibility in their cold therapy routine.\n\nWith powerful cooling to 37°F and insulated construction, the Air Plunge delivers effective cold therapy anywhere you need it. The self-contained design requires no plumbing.\n\nIdeal for athletes on the go, home use, or traveling wellness professionals.",
        healthBenefitsDescription: "Cold water immersion has been used for centuries as a powerful recovery tool. By exposing your body to cold temperatures, you activate several physiological responses that promote healing and wellness.\n\nThe cold water causes blood vessels to constrict, reducing inflammation and swelling in muscles and joints. When you exit the cold plunge, the subsequent vasodilation creates a pumping effect that enhances circulation and delivers oxygen-rich blood throughout the body.\n\nCold exposure also stimulates the vagus nerve, promoting relaxation and stress reduction. Regular cold plunging can strengthen your immune system, improve sleep quality, and boost mental clarity.\n\nWhether you're an athlete looking to accelerate recovery or someone seeking natural wellness therapies, cold plunging offers scientifically-backed benefits for body and mind.",
        questionsAndAnswers: [
            {
                question: "Is it really portable?",
                answer: "Yes, the Air Plunge is lightweight and can be moved easily, making it perfect for different locations."
            },
            {
                question: "What's included in my purchase?",
                answer: "Includes the plunge unit, chiller, insulated cover, and power cord."
            },
            {
                question: "How quickly will I get my cold plunge?",
                answer: "In stock items ship within 3-5 business days and arrive within 4-5 days via freight shipping."
            },
            {
                question: "Are financing plans available?",
                answer: "We offer 6, 12, and 24 month financing options through Affirm."
            }
        ]
    }
];
export const coldPlungeFeatures: ColdPlungeFeature[] = [
    {
        title: "Advanced Chilling",
        iconName: "FaSnowflake",
        detail: "Powerful chilling technology maintains consistent cold temperatures for optimal recovery."
    },
    {
        title: "Therapeutic Cold",
        iconName: "FaSnowflake",
        detail: "Delivers consistent, therapeutic cold immersion for enhanced wellness benefits."
    },
    {
        title: "Create an Ambiance",
        iconName: "FaLightbulb",
        detail: "Enhance your cold plunge experience with customizable lighting options."
    },
    {
        title: "Seamless Setup",
        iconName: "FaTools",
        detail: "Easy-to-follow setup process with all necessary components included."
    },
    {
        title: "Control from your Phone",
        iconName: "FaMobileAlt",
        detail: "Manage temperature and sessions remotely via our mobile app."
    },
    {
        title: "Design-Forward Wellness",
        iconName: "FaGem",
        detail: "Modern, sleek design that complements any space while promoting health."
    }
];
export const coldPlungeProductFeatureIcons = [
    {
        type: "assembly",
        title: "Effortless Assembly",
        iconSvg: `<svg width="20" height="20" fill="none" stroke="currentColor"><path d="M5 10l4 4 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>`,
    },
    {
        type: "warranty",
        title: "180 Day Warranty",
        iconSvg: `<svg width="20" height="20" fill="none" stroke="currentColor"><circle cx="10" cy="10" r="8" strokeWidth="2"/><path d="M10 6v4l2 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>`,
    },
    {
        type: "shipping",
        title: "Ships from the US in 3-5 Business Days",
        iconSvg: `<svg width="20" height="20" fill="none" stroke="currentColor"><path d="M3 10h14M3 10a7 7 0 0114 0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>`,
    },
];
