export interface SaunaBenefit {
    id: string;
    title: string;
    icon: string;
    color: string;
    hoverColor: string;
    description: string;
}
export const saunaBenefits: SaunaBenefit[] = [
    {
        id: 'cardiovascular',
        title: 'Improved Cardiovascular Health',
        icon: 'FaHeart',
        color: 'text-yellow-400',
        hoverColor: 'hover:text-yellow-500',
        description: 'During a sauna session, the body responds to heat stress by expanding blood vessels and increasing circulation. This rise in heart rate and blood flow mirrors the effects of moderate aerobic activity, supporting cardiovascular conditioning and active recovery.',
    },
    {
        id: 'stress',
        title: 'Stress Reduction',
        icon: 'FaLeaf',
        color: 'text-green-400',
        hoverColor: 'hover:text-green-500',
        description: 'Regular sauna sessions activate the body’s natural stress-relief mechanisms—releasing endorphins while helping lower cortisol levels. The result is a calming physiological shift that supports mood regulation, mental clarity, and long-term resilience. Whether taken solo or shared, the ritual offers a moment of stillness that quiets the nervous system and restores balance.',
    },
    {
        id: 'sore-muscles',
        title: 'Pain Relief for Sore Muscles',
        icon: 'FaDumbbell',
        color: 'text-blue-400',
        hoverColor: 'hover:text-blue-500',
        description: 'The deep, enveloping heat of a sauna helps ease muscle tension and joint discomfort by increasing circulation and supporting the body’s natural inflammatory response. Elevated blood flow delivers oxygen and nutrients to sore areas, accelerating recovery, reducing stiffness, and enhancing mobility—making it a powerful ritual for both athletic recovery and everyday relief.',
    },
    {
        id: 'chronic-conditions',
        title: 'Pain Relief for Chronic Conditions',
        icon: 'FaStethoscope',
        color: 'text-red-400',
        hoverColor: 'hover:text-red-500',
        description: 'Regular sauna sessions may offer meaningful relief for those managing chronic conditions such as rheumatoid arthritis, fibromyalgia, or ankylosing spondylitis. By promoting circulation and gently soothing inflammation, the heat can ease persistent discomfort and enhance mobility. While not a standalone treatment, sauna therapy serves as a restorative complement—helping to reduce pain, relax the body, and support overall well-being.',
    },
    {
        id: 'skin-health',
        title: 'Improved Skin Health',
        icon: 'FaHotTub',
        color: 'text-purple-400',
        hoverColor: 'hover:text-purple-500',
        description: 'Sauna heat gently stimulates perspiration, helping to detoxify the skin by flushing out impurities and unclogging pores. At the same time, the increase in circulation nourishes your complexion from within, promoting a healthy, radiant glow. The result is skin that looks refreshed, revitalized, and effortlessly luminous.',
    },
    {
        id: 'detoxification',
        title: 'Detoxification Through Sweat',
        icon: 'FaTint',
        color: 'text-blue-300',
        hoverColor: 'hover:text-blue-400',
        description: 'Deep, sustained heat from the sauna activates one of the body’s most natural cleansing mechanisms: sweat. This process supports thermal detoxification, helping to flush out heavy metals, environmental toxins, and impurities through the skin. It’s an elegant, time-honored way to reset the system and restore balance from the inside out.',
    },
    {
        id: 'sleep',
        title: 'Improved Sleep',
        icon: 'FaBed',
        color: 'text-indigo-400',
        hoverColor: 'hover:text-indigo-500',
        description: 'Regular sauna sessions promote relaxation, reduce stress hormones, and help regulate your body’s natural rhythms, all contributing to deeper, more restorative sleep and improved overall restfulness.',
    },
    {
        id: 'metabolism',
        title: 'Enhanced Metabolism',
        icon: 'FaFire',
        color: 'text-orange-400',
        hoverColor: 'hover:text-orange-500',
        description: 'The elevated heat of a sauna session stimulates circulation and raises your heart rate, creating a gentle cardiovascular effect that can temporarily boost metabolic activity. Over time, this increase in energy expenditure may support weight management and promote a more efficient metabolism.',
    },
];
