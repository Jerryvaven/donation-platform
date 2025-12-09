// Included Accessories for Sauna Products
export const saunaIncludedAccessories = [
  {
    title: 'HUUM Heater',
    image: '/assets/saunas/huum-heater.png', // Update with actual image path
    description: 'Steam-friendly HUUM heater holds 132 pounds of sauna stones.',
  },
  {
    title: 'Wifi Controller',
    image: '/assets/saunas/wifi-controller.png', // Update with actual image path
    description: 'Manage your sauna from anywhere with the Plunge mobile app.',
  },
  {
    title: 'Waterproof Roof',
    image: '/assets/saunas/waterproof-roof.png', // Update with actual image path
    description: 'Durable, all-weather roof built to handle any environment.',
  },
  {
    title: 'Phone Holder',
    image: '/assets/saunas/phone-holder.png', // Update with actual image path
    description: 'Keeps your phone cool, visible, and within reach while you sauna.',
  },
];
import { FaShieldAlt, FaFire, FaLightbulb, FaTools, FaMobileAlt, FaGem } from 'react-icons/fa';

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
  questionsAndAnswers?: Array<{ question: string; answer: string }>;
  testImage?: string;
  featureSlides?: FeatureSlide[];
}

export interface SaunaFeature {
  title: string;
  iconName: string;
  detail: string;
}

// Feature slides for the Smart Pod Sauna
export const smartPodFeatureSlides: FeatureSlide[] = [
  {
    title: "Designed for Indoor and Outdoor Use",
    description: "Built for both indoor and outdoor use, The Mini features premium construction built to withstand any climate. Its lower footprint and reduced depth make it ideal for fitting into smaller spaces and tight corners.",
    image: "/assets/saunas/smartpod-slide1.jpg"
  },
  {
    title: "Hand-crafted in the USA",
    description: "Precision-engineered and manufactured in California, each sauna is made to order, representing the pinnacle of hand-crafted innovation.",
    image: "/assets/saunas/smartpod-slide2.jpg"
  },
  {
    title: "Smart Connectivity",
    description: "Manage your sauna sessions effortlessly with complete control over temperature, lighting, and time from your smartphone.",
    image: "/assets/saunas/smartpod-slide3.jpg"
  },
  {
    title: "Premium Materials",
    description: "Constructed from premium oil-treated spruce hardwood, ensuring durability and a luxurious feel for years to come.",
    image: "/assets/saunas/smartpod-slide4.jpg"
  },
  {
    title: "Full-Spectrum Infrared Technology",
    description: "Advanced carbon fiber heating panels provide deep-penetrating infrared warmth for optimal detoxification and relaxation.",
    image: "/assets/saunas/smartpod-slide5.jpg"
  }
];

// Feature slides for the Barrel Sauna
export const barrelSaunaFeatureSlides: FeatureSlide[] = [
  {
    title: "Traditional Nordic Design",
    description: "The iconic barrel shape is not just aesthetically pleasing—it's engineered for optimal heat circulation and efficiency, inspired by centuries of Scandinavian tradition.",
    image: "/assetstest.webp"
  },
  {
    title: "Hand-crafted in the USA",
    description: "Precision-engineered and manufactured in California, each sauna is made to order, representing the pinnacle of hand-crafted innovation.",
    image: "/assets/test.webp"
  },
  {
    title: "All-Weather Construction",
    description: "Weather-resistant exterior with durable shingle roof ensures year-round performance in any climate, from scorching summers to freezing winters.",
    image: "/assets/test.webp"
  },
  {
    title: "Spacious Interior",
    description: "Accommodates up to 8 people comfortably, making it perfect for family wellness sessions or social gatherings with friends.",
    image: "/assets/test.webp"
  },
  {
    title: "Professional-Grade Heater",
    description: "Equipped with a powerful 8kW Harvia heater, delivering fast, even warmth throughout the entire barrel for the perfect traditional sauna experience.",
    image: "/assets/test.webp"
  }
];

// Feature slides for the King Sauna
export const kingSaunaFeatureSlides: FeatureSlide[] = [
  {
    title: "Dual Chamber Luxury",
    description: "Two separate rooms provide ultimate flexibility for mixed-gender use, private sessions, or simultaneous wellness experiences at different temperatures.",
    image: "/assets/saunas/king-slide1.jpg"
  },
  {
    title: "Hand-crafted in the USA",
    description: "Precision-engineered and manufactured in California, each sauna is made to order, representing the pinnacle of hand-crafted innovation.",
    image: "/assets/saunas/king-slide2.jpg"
  },
  {
    title: "Executive Capacity",
    description: "Accommodates up to 8 people across two chambers, ideal for corporate wellness programs, retreat centers, or large family estates.",
    image: "/assets/saunas/king-slide3.jpg"
  },
  {
    title: "Smart Climate Control",
    description: "WiFi-enabled control system allows independent temperature management for each chamber via the SmartLife App from anywhere.",
    image: "/assets/saunas/king-slide4.jpg"
  },
  {
    title: "Premium Construction",
    description: "Built with the finest oil-treated spruce and weather-resistant finishes, combining timeless aesthetics with modern durability.",
    image: "/assets/saunas/king-slide5.jpg"
  }
];

// Feature slides for the Queen Sauna
export const queenSaunaFeatureSlides: FeatureSlide[] = [
  {
    title: "Space-Efficient Design",
    description: "Compact footprint perfect for urban settings, small yards, or apartments while maintaining comfortable seating for 4 people.",
    image: "/assets/saunas/queen-slide1.jpg"
  },
  {
    title: "Hand-crafted in the USA",
    description: "Precision-engineered and manufactured in California, each sauna is made to order, representing the pinnacle of hand-crafted innovation.",
    image: "/assets/saunas/queen-slide2.jpg"
  },
  {
    title: "Budget-Conscious Premium",
    description: "Affordable luxury that doesn't compromise on quality materials or performance, making wellness accessible to more households.",
    image: "/assets/saunas/queen-slide3.jpg"
  },
  {
    title: "Quick Assembly",
    description: "Pre-cut interlocking panels make installation straightforward, getting you to your first wellness session faster.",
    image: "/assets/saunas/queen-slide4.jpg"
  },
  {
    title: "Smart Controls",
    description: "Full SmartLife App integration for effortless temperature management and session customization from your smartphone.",
    image: "/assets/saunas/queen-slide5.jpg"
  }
];

// Card benefits (short, punchy keypoints for product cards)
export const smartPodCardBenefits = [
  "AI-powered wellness sessions",
  "Chromotherapy light therapy",
  "Solo meditation sanctuary",
  "Wireless sound system",
  "Carbon infrared panels"
];

export const barrelSaunaCardBenefits = [
  "Group wellness gatherings",
  "Nordic tradition design",
  "Weather-resistant exterior",
  "Community bonding experience",
  "All-season outdoor therapy"
];

export const kingSaunaCardBenefits = [
  "Executive wellness retreats",
  "Dual chamber flexibility",
  "Premium material luxury",
  "Corporate wellness programs",
  "High-end customization"
];

export const queenSaunaCardBenefits = [
  "Urban apartment living",
  "Budget-conscious premium",
  "Quick setup installation",
  "Couple's wellness routine",
  "Space-efficient design"
];

export const indoorProducts: Product[] = [
  {
    id: "smartpod",
    name: "Dialed Smart Pod Sauna",
    price: "$8,500",
    features: [
      "Full spectrum infrared heating",
      "Integrated RGB light therapy",
      "Control with the SmartLife App",
      "Interior speakers with Bluetooth connectivity",
      "Made of premium oil-treated spruce hardwood"
    ],
    image: "/assets/test.webp",
    button: "Shop Dialed Smart Pod Sauna",
    images: ["/assets/test.webp", "/assets/test.webp", "/assets/test.webp", "/assets/test.webp", "/assets/test.webp", "/assets/test.webp"],
    benefits: smartPodCardBenefits,
    featureSlides: smartPodFeatureSlides,
    specifications: [
      "Dimensions: 48\" x 48\" x 78\"",
      "Weight: 300 lbs",
      "Power: 120V, 15A",
      "Heating elements: Carbon fiber",
      "Capacity: 1-2 persons"
    ],
    warranty: "10-year warranty",
    shipping: "Free shipping within continental US",
    shortDescription: "Timeless tradition, reimagined",
    productDescription: "The Dialed Smart Pod Sauna redefines personal wellness with advanced infrared technology and sleek design. This compact sauna delivers full-spectrum infrared heating that penetrates deep into tissues for efficient detoxification and relaxation. Integrated RGB chromotherapy lights enhance the experience with therapeutic color therapy, while Bluetooth speakers allow you to customize your sound environment.\n\nControlled via the SmartLife App, you can adjust temperature, lighting, and session duration from your smartphone. The premium oil-treated spruce hardwood construction ensures durability and a luxurious feel. Perfect for apartments, homes, or wellness centers, the Smart Pod offers a private sanctuary for solo meditation and recovery.",
    healthBenefitsDescription: "Infrared saunas like the Smart Pod use invisible light waves to gently heat your body from within, promoting deep detoxification and cellular repair. Unlike traditional saunas that primarily heat the air, infrared technology penetrates tissues directly, raising core body temperature more efficiently and comfortably.\n\nThis targeted heating enhances circulation, supports muscle recovery, reduces inflammation, and aids in the elimination of toxins through sweat. The chromotherapy lights add therapeutic benefits, with different colors promoting relaxation, energy, or focus.\n\nSessions are typically shorter (20-30 minutes) and more tolerable than traditional saunas, making it easier to incorporate into a busy lifestyle. The result is improved sleep quality, reduced stress, enhanced immune function, and overall vitality—backed by modern science and ancient wisdom.",
    specificationsImage: "/assets/test.webp",
    questionsAndAnswers: [
      {
        question: "What's included in my purchase?",
        answer: "This sauna purchase includes:\n\nFull-spectrum infrared heaters\nRGB chromotherapy lighting system\nBluetooth speakers\nSmartLife App control\nPremium oil-treated spruce construction"
      },
      {
        question: "How do I assemble my sauna?",
        answer: "The Smart Pod arrives mostly assembled. Simply connect the electrical components and set up the control system. Professional installation is recommended for electrical connections."
      },
      {
        question: "How quickly will I get my sauna?",
        answer: "In stock items will ship to the lower 48 states within 3-5 business days from our warehouse in California and arrive within 4-5 days via freight shipping."
      },
      {
        question: "Are financing plans available?",
        answer: "We offer 6, 12, and 24 month financing options through Affirm."
      },
      {
        question: "What's the difference between infrared and traditional saunas?",
        answer: "Infrared saunas heat your body directly with light waves, allowing for lower ambient temperatures and deeper tissue penetration. Traditional saunas heat the air around you. Learn more about the key distinctions and different health benefits between infrared and traditional saunas here."
      }
    ]
  }
];

export const outdoorProducts: Product[] = [
  {
    id: "barrel",
    name: "Dialed Barrel Sauna",
    price: "$10,499",
    features: [
      "Heats up to 195°F",
      "Seats up to Eight",
      "Interior LED accent lighting",
      "Control with the SmartLife App",
      "Made of premium oil-treated spruce hardwood"
    ],
    image: "/assets/test.webp",
    button: "Shop Dialed Barrel Sauna",
    images: ["/assets/test.webp", "/assets/test.webp", "/assets/test.webp", "/assets/test.webp", "/assets/test.webp", "/assets/test.webp"],
    benefits: barrelSaunaCardBenefits,
    featureSlides: barrelSaunaFeatureSlides,
    specifications: [
      "Features: Heats up to 90°C (194°F); soft LED accent lighting inside; exterior porch bench seating",
      "Seating Capacity: 6 persons",
      "Control: Wifi controlled heater for remote management",
      "Dimensions: 2100 x 2400mm",
      "Wood Type: Oil Treated Spruce",
      "Heater: 8kw Harvia Heater",
      "Door Material: 8mm tempered glass",
      "Electrical Requirements: 230V"
    ],
    specificationsImage: "/assets/test.webp",
    warranty: "10-year warranty",
    shipping: "Free shipping within continental US",
    shortDescription: "Timeless tradition, reimagined",
    productDescription: "The Dialed Barrel Sauna is a timeless fusion of craftsmanship and performance. Handcrafted from oil-treated spruce and finished with a durable weatherproof shingle roof, it's built to bring year-round wellness to your outdoor space.\n\nDesigned to comfortably seat up to seven people, it offers generous room for shared restoration or solo serenity. Inside, a powerful 8kW Harvia heater delivers fast, even warmth to promote muscle recovery, deep relaxation, and restorative sweat sessions.\n\nA panoramic front window frames the view while inviting in natural light, and smart WiFi connectivity offers effortless control from anywhere. Refined in form and function, the Barrel Sauna is an invitation to unwind in nature—with modern luxury at your fingertips.",
    healthBenefitsDescription: "Traditional saunas offer a deeply restorative path to holistic well-being that is rooted in centuries-old tradition, yet as relevant today as ever. Each session is an invitation to disconnect, recalibrate, and emerge renewed.\n\nBy heating the air to temperatures between 150–195°F, traditional saunas elevate your core body temperature, simulating the effects of light cardiovascular exercise. As blood vessels dilate and circulation intensifies, sweat begins to flow – flushing out impurities and leaving skin visibly revitalized, with a healthy, radiant glow.\n\nThe enveloping heat also works deep into muscle tissue, easing soreness, reducing inflammation, enhancing flexibility, and accelerating recovery—ideal for those who train hard and recover with intention. When water is poured over the hot stones, the resulting steam further opens airways and supports respiratory health.\n\nBeyond the physical, this is a sanctuary for the mind. The heat quiets the nervous system, reduces cortisol levels, and promotes the release of endorphins, which enhance mood, reduce stress, and improve sleep quality over time.\n\nThe traditional sauna experience is more than a wellness practice—it's a ritual of renewal to elevate body, mind, and daily living.",
    questionsAndAnswers: [
      {
        question: "What's included in my purchase?",
        answer: "This sauna purchase includes:\n\n8kw Harvia Heater\n120lbs Sauna Stones\nThermometer\nWooden sauna bucket and ladle\nWeatherproof shingles"
      },
      {
        question: "How do I assemble my sauna?",
        answer: "Our saunas are designed with hassle-free assembly in mind. With pre-cut, interlocking panels, you can build your Barrel Sauna in just a few hours with basic DIY skills.\n\nOur sauna stoves use 220V and come with wires that connect directly to the home electric panel, so install by electrician is needed."
      },
      {
        question: "How quickly will I get my sauna?",
        answer: "In stock items will ship to the lower 48 states within 3-5 business days from our warehouse in California and arrive within 4-5 days via freight shipping."
      },
      {
        question: "Are financing plans available?",
        answer: "We offer 6, 12, and 24 month financing options through Affirm."
      },
      {
        question: "What's the difference between infrared and traditional saunas?",
        answer: "Learn more about the key distinctions and different health benefits between infrared and traditional saunas here."
      }
    ]
  },
  {
    id: "king",
    name: "Dialed King Sauna",
    price: "$12,999",
    features: [
      "Heats up to 195°F",
      "Double room seating for up to 8 people",
      "Interior LED accent lighting",
      "Control with the SmartLife App",
      "Made of premium oil-treated spruce hardwood"
    ],
    image: "/assets/test.webp",
    button: "Shop Dialed King Sauna",
    images: ["/assets/test.webp", "/assets/test.webp", "/assets/test.webp", "/assets/test.webp", "/assets/test.webp", "/assets/test.webp"],
    benefits: kingSaunaCardBenefits,
    featureSlides: kingSaunaFeatureSlides,
    specifications: [
      "Dimensions: 120\" x 96\" x 84\"",
      "Weight: 1200 lbs",
      "Power: 240V, 40A",
      "Heating elements: Electric heaters",
      "Capacity: Up to 8 persons"
    ],
    warranty: "10-year warranty",
    shipping: "Free shipping within continental US",
    shortDescription: "Timeless tradition, reimagined",
    productDescription: "The Dialed King Sauna represents the pinnacle of outdoor wellness architecture, combining spacious dual chambers with premium craftsmanship. This executive-grade sauna accommodates up to 8 people across two separate rooms, perfect for wellness retreats, corporate events, or large family gatherings.\n\nFeaturing powerful electric heating elements that reach 195°F, interior LED accent lighting, and SmartLife App control for remote management. The double-room design offers flexibility for mixed-gender use or private sessions. Constructed from premium oil-treated spruce hardwood with weather-resistant finishes, it withstands all seasons while providing year-round therapeutic benefits.",
    healthBenefitsDescription: "Traditional saunas offer a deeply restorative path to holistic well-being that is rooted in centuries-old tradition, yet as relevant today as ever. Each session is an invitation to disconnect, recalibrate, and emerge renewed.\n\nBy heating the air to temperatures between 150–195°F, traditional saunas elevate your core body temperature, simulating the effects of light cardiovascular exercise. As blood vessels dilate and circulation intensifies, sweat begins to flow – flushing out impurities and leaving skin visibly revitalized, with a healthy, radiant glow.\n\nThe enveloping heat also works deep into muscle tissue, easing soreness, reducing inflammation, enhancing flexibility, and accelerating recovery—ideal for those who train hard and recover with intention. When water is poured over the hot stones, the resulting steam further opens airways and supports respiratory health.\n\nBeyond the physical, this is a sanctuary for the mind. The heat quiets the nervous system, reduces cortisol levels, and promotes the release of endorphins, which enhance mood, reduce stress, and improve sleep quality over time.\n\nThe traditional sauna experience is more than a wellness practice—it's a ritual of renewal to elevate body, mind, and daily living.",
    specificationsImage: "/assets/test.webp",
    questionsAndAnswers: [
      {
        question: "What's included in my purchase?",
        answer: "This sauna purchase includes:\n\nDual chamber electric heaters\nInterior LED lighting system\nSmartLife App control\nPremium oil-treated spruce construction\nWeatherproof exterior finishes"
      },
      {
        question: "How do I assemble my sauna?",
        answer: "Our saunas are designed with hassle-free assembly in mind. With pre-cut, interlocking panels, you can build your King Sauna in just a few hours with basic DIY skills.\n\nOur sauna stoves use 240V and come with wires that connect directly to the home electric panel, so installation by an electrician is needed."
      },
      {
        question: "How quickly will I get my sauna?",
        answer: "In stock items will ship to the lower 48 states within 3-5 business days from our warehouse in California and arrive within 4-5 days via freight shipping."
      },
      {
        question: "Are financing plans available?",
        answer: "We offer 6, 12, and 24 month financing options through Affirm."
      },
      {
        question: "What's the difference between infrared and traditional saunas?",
        answer: "Learn more about the key distinctions and different health benefits between infrared and traditional saunas here."
      }
    ]
  },
  {
    id: "queen",
    name: "Dialed Queen Sauna",
    price: "$6,500",
    features: [
      "Heats up to 195°F",
      "One room design",
      "Control with the SmartLife App",
      "Seats 4 people",
      "Made of premium oil-treated spruce hardwood"
    ],
    image: "/assets/test.webp",
    button: "Shop Dialed Queen Sauna",
    images: ["/assets/test.webp", "/assets/test.webp", "/assets/test.webp", "/assets/test.webp", "/assets/test.webp", "/assets/test.webp"],
    benefits: queenSaunaCardBenefits,
    featureSlides: queenSaunaFeatureSlides,
    specifications: [
      "Dimensions: 72\" x 72\" x 78\"",
      "Weight: 400 lbs",
      "Power: 120V, 20A",
      "Heating elements: Electric heaters",
      "Capacity: Up to 4 persons"
    ],
    warranty: "10-year warranty",
    shipping: "Free shipping within continental US",
    shortDescription: "Timeless tradition, reimagined",
    productDescription: "The Dialed Queen Sauna brings premium wellness to urban and budget-conscious households with its compact yet powerful design. This single-room sauna seats up to 4 people comfortably, making it ideal for couples, small families, or apartment living.\n\nFeaturing efficient electric heating that reaches 195°F, SmartLife App control for easy management, and premium oil-treated spruce construction. The space-efficient footprint fits easily in smaller yards or patios while delivering the full traditional sauna experience. Weather-resistant exterior ensures year-round use, combining affordability with luxury materials.",
    healthBenefitsDescription: "Traditional saunas offer a deeply restorative path to holistic well-being that is rooted in centuries-old tradition, yet as relevant today as ever. Each session is an invitation to disconnect, recalibrate, and emerge renewed.\n\nBy heating the air to temperatures between 150–195°F, traditional saunas elevate your core body temperature, simulating the effects of light cardiovascular exercise. As blood vessels dilate and circulation intensifies, sweat begins to flow – flushing out impurities and leaving skin visibly revitalized, with a healthy, radiant glow.\n\nThe enveloping heat also works deep into muscle tissue, easing soreness, reducing inflammation, enhancing flexibility, and accelerating recovery—ideal for those who train hard and recover with intention. When water is poured over the hot stones, the resulting steam further opens airways and supports respiratory health.\n\nBeyond the physical, this is a sanctuary for the mind. The heat quiets the nervous system, reduces cortisol levels, and promotes the release of endorphins, which enhance mood, reduce stress, and improve sleep quality over time.\n\nThe traditional sauna experience is more than a wellness practice—it's a ritual of renewal to elevate body, mind, and daily living.",
    specificationsImage: "/assets/test.webp",
    questionsAndAnswers: [
      {
        question: "What's included in my purchase?",
        answer: "This sauna purchase includes:\n\nElectric heating elements\nSmartLife App control\nPremium oil-treated spruce construction\nWeatherproof exterior finishes"
      },
      {
        question: "How do I assemble my sauna?",
        answer: "Our saunas are designed with hassle-free assembly in mind. With pre-cut, interlocking panels, you can build your Queen Sauna in just a few hours with basic DIY skills.\n\nOur sauna stoves use 120V and come with wires that connect directly to the home electric panel, so installation by an electrician is needed."
      },
      {
        question: "How quickly will I get my sauna?",
        answer: "In stock items will ship to the lower 48 states within 3-5 business days from our warehouse in California and arrive within 4-5 days via freight shipping."
      },
      {
        question: "Are financing plans available?",
        answer: "We offer 6, 12, and 24 month financing options through Affirm."
      },
      {
        question: "What's the difference between infrared and traditional saunas?",
        answer: "Learn more about the key distinctions and different health benefits between infrared and traditional saunas here."
      }
    ]
  }
];

// Sauna Experience Features
export const saunaFeatures: SaunaFeature[] = [
  {
    title: "All Season Durability",
    iconName: "FaShieldAlt",
    detail: "Engineered for outdoor use in any climate, providing reliable performance throughout the year."
  },
  {
    title: "Therapeutic Heat",
    iconName: "FaFire",
    detail: "Delivers consistent, therapeutic infrared heat for optimal wellness benefits."
  },
  {
    title: "Create an Ambiance",
    iconName: "FaLightbulb",
    detail: "Enhance your sauna experience with customizable lighting and sound options."
  },
  {
    title: "Seamless Setup",
    iconName: "FaTools",
    detail: "Easy-to-follow assembly process with all necessary components included."
  },
  {
    title: "Control from your Phone",
    iconName: "FaMobileAlt",
    detail: "Manage temperature, lighting, and sessions remotely via our mobile app."
  },
  {
    title: "Design-Forward Wellness",
    iconName: "FaGem",
    detail: "Modern, sleek design that complements any home decor while promoting health."
  }
];

// Product Feature Icons
export const productFeatureIcons = [
  {
    type: "assembly",
    title: "Effortless Assembly",
    iconSvg: `<svg width="20" height="20" fill="none" stroke="currentColor"><path d="M5 10l4 4 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>`,
  },
  {
    type: "warranty",
    title: "Warranty",
    iconSvg: `<svg width="20" height="20" fill="none" stroke="currentColor"><circle cx="10" cy="10" r="8" strokeWidth="2"/><path d="M10 6v4l2 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>`,
  },
  {
    type: "shipping",
    title: "Shipping",
    iconSvg: `<svg width="20" height="20" fill="none" stroke="currentColor"><path d="M3 10h14M3 10a7 7 0 0114 0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>`,
  },
];