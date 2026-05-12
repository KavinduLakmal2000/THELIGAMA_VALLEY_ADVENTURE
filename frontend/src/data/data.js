// ─── NAVIGATION ───────────────────────────────────────────────────────────────
export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Activities", href: "#activities" },
  { label: "Schedule", href: "#schedule" },
  { label: "Reviews", href: "#reviews" },
  { label: "Guidelines", href: "#guidelines" },
  { label: "Contact", href: "#contact" },
];

// ─── HERO ──────────────────────────────────────────────────────────────────────
export const hero = {
  video: "hero_vid.mp4",
  tagline: "Experience the Thrill",
  title: "Theligama Valley Adventure Lodge",
  subtitle:
    "Discover Sri Lanka's most exciting river adventures surrounded by lush rainforest, guided by certified professionals and built for unforgettable memories.",
  cta: { label: "Explore Adventures", href: "#activities" },
  hours: "Opening: 7:30 AM — Closing: 10:00 PM",
};

// ─── ABOUT ─────────────────────────────────────────────────────────────────────
export const about = {
  badge: "Adventure Awaits",
  title: "Theligama Valley Adventure Lodge",
  description:
    "Experience thrilling outdoor adventures in the heart of Sri Lanka. From white water rafting on the Kelani River to jungle canyoning and waterfall abseiling, Theligama Valley offers unforgettable moments surrounded by lush rainforests and flowing rivers.",
  features: [
    {
      icon: "🌊",
      title: "White Water Rafting",
      text: "Paddle through exciting rapids on the Kelani River with professional guides and full safety equipment. Perfect for beginners and adventure lovers.",
    },
    {
      icon: "🏔️",
      title: "Canyoning",
      text: "Explore natural rock formations, jungle streams, and hidden pools while climbing, sliding, and jumping through scenic canyons.",
    },
    {
      icon: "🪂",
      title: "Zip Lining",
      text: "Fly above the river and rainforest on an adrenaline-filled zip line experience with breathtaking aerial views of Kithulgala.",
    },
    {
      icon: "💧",
      title: "Waterfall Abseiling",
      text: "Descend stunning waterfalls using professional climbing equipment under expert supervision for a thrilling vertical adventure.",
    },
    {
      icon: "🏄‍♂️",
      title: "Stand Up Paddle Boarding",
      text: "Glide across calm waters and take in the breathtaking natural scenery while enjoying a relaxing stand up paddle boarding experience in Kithulgala.",
    },
    {
      icon: "🏕️",
      title: "Camping & Day Out",
      text: "Relax under the stars with riverside camping and day-out packages that combine adventure, nature, and local cuisine.",
    },
  ],
};

// ─── ACTIVITIES ────────────────────────────────────────────────────────────────
export const activities = [
  {
    id: 1,
    title: "White Water Rafting",
    location: "Kelani River",
    duration: "1 – 2 Hours",
    image: "https://deepcreekinns.com/wp-content/uploads/2025/06/shutterstock_114911380.jpg",
    tag: "Most Popular",
    price: "LKR 3,500",
  },
  {
    id: 2,
    title: "Canyoning Adventure",
    location: "Rainforest Streams",
    duration: "2 – 3 Hours",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80",
    tag: "Thrilling",
    price: "LKR 4,000",
  },
  {
    id: 3,
    title: "Zip Lining",
    location: "Forest Canopy",
    duration: "30 Minutes",
    image: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=600&q=80",
    tag: "Family Friendly",
    price: "LKR 2,500",
  },
  {
    id: 4,
    title: "Kayaking",
    location: "Calm River Waters",
    duration: "1 – 2 Hours",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=80",
    tag: "Beginner Friendly",
    price: "LKR 2,800",
  },
  {
    id: 5,
    title: "Riverside Camping",
    location: "Kelani River Bank",
    duration: "Overnight",
    image: "https://images.unsplash.com/photo-1478827387698-1527781a4887?w=600&q=80",
    tag: "Relaxing",
    price: "LKR 6,500",
  },
  {
    id: 6,
    title: "Waterfall Abseiling",
    location: "Natural Waterfalls",
    duration: "1 – 2 Hours",
    image: "https://images.unsplash.com/photo-1544551763-92ab472cad5d?w=600&q=80",
    tag: "Extreme",
    price: "LKR 4,500",
  },
  {
    id: 7,
    title: "Confidence Jump",
    location: "Natural Rock Pools",
    duration: "30 Minutes",
    image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80",
    tag: "Brave",
    price: "LKR 1,800",
  },
  {
    id: 8,
    title: "Jungle Trekking",
    location: "Rainforest Trails",
    duration: "2 – 4 Hours",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80",
    tag: "Nature",
    price: "LKR 2,200",
  },
  {
    id: 9,
    title: "Adventure Day Out",
    location: "Multiple Activities",
    duration: "Full Day",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    tag: "Best Value",
    price: "LKR 8,000",
  },
  {
    id: 10,
    title: "Family Adventure Packages",
    location: "All Locations",
    duration: "Flexible Duration",
    image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=600&q=80",
    tag: "Family",
    price: "LKR 12,000",
  },
];

// ─── SCHEDULE ──────────────────────────────────────────────────────────────────
export const schedule = {
  badge: "Plan Your Adventure",
  title: "Schedule & Operating Times",
  subtitle:
    "Our adventure activities in Kithulgala operate daily with flexible time slots to suit your travel plans. Morning sessions are recommended for the best river conditions.",
  operatingDays: "Monday – Sunday · Open All Year Round",
  slots: [
    { label: "Morning", time: "8:00 AM – 11:00 AM", icon: "🌅" },
    { label: "Midday", time: "11:30 AM – 2:30 PM", icon: "☀️" },
    { label: "Afternoon", time: "3:00 PM – 5:00 PM", icon: "🌤️" },
  ],
  bestTime: "November – April",
  bestTimeNote: "Water levels are ideal for rafting and outdoor adventures",
  warning:
    "⚠️ Activity schedules may vary depending on weather conditions and river water levels. Advance booking is recommended during weekends and peak seasons.",
};

// ─── REVIEWS ───────────────────────────────────────────────────────────────────
export const reviews = [
  {
    id: 1,
    name: "Daniel Perera",
    location: "Colombo, Sri Lanka",
    rating: 5,
    text: "Amazing white water rafting experience! The guides were very professional and safety was well maintained throughout the trip.",
    avatar: "DP",
  },
  {
    id: 2,
    name: "Sarah Thompson",
    location: "United Kingdom",
    rating: 5,
    text: "One of the best adventure experiences in Sri Lanka! The rafting was thrilling and the scenery was absolutely beautiful.",
    avatar: "ST",
  },
  {
    id: 3,
    name: "Arjun Patel",
    location: "India",
    rating: 4,
    text: "Great adventure and friendly staff. The canyoning and confidence jump were my favorite parts of the trip!",
    avatar: "AP",
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    location: "Spain",
    rating: 5,
    text: "Fantastic team and well-organized activities. Perfect for beginners and families looking for a safe adventure.",
    avatar: "ER",
  },
  {
    id: 5,
    name: "Michael Brown",
    location: "Australia",
    rating: 5,
    text: "Unforgettable experience! The guides were knowledgeable and fun. Highly recommended for anyone visiting Sri Lanka.",
    avatar: "MB",
  },
];

// ─── GUIDELINES ────────────────────────────────────────────────────────────────
export const guidelines = [
  {
    icon: "🪖",
    title: "Certified Equipment",
    text: "All helmets, life jackets, paddles, and rafts are internationally certified and inspected daily before every expedition.",
  },
  {
    icon: "🧑‍✈️",
    title: "Professional Guides",
    text: "Our rafting guides are professionally trained, river-certified, and experienced in handling all rapid levels safely.",
  },
  {
    icon: "📋",
    title: "Pre-Rafting Briefing",
    text: "A full safety briefing and paddling demonstration is provided before entering the river to ensure everyone is confident and prepared.",
  },
  {
    icon: "🏥",
    title: "Age & Health Requirements",
    text: "Participants should be in good health. Minimum age and rafting level requirements depend on river conditions and water levels.",
  },
  {
    icon: "🌧️",
    title: "Weather & River Conditions",
    text: "Rafting schedules may change depending on rainfall and river flow to ensure maximum safety at all times.",
  },
  {
    icon: "🚨",
    title: "Emergency Support",
    text: "First aid kits, rescue equipment, and emergency response procedures are always in place throughout the rafting route.",
  },
];

// ─── CONTACT ───────────────────────────────────────────────────────────────────
export const contact = {
  address: "Kitulgala, Sri Lanka",
  phone: "+94 XX XXX XXXX",
  email: "info@kithulgalaadventures.com",
  hours: "Opening: 7:30 AM — Closing: 9:00 PM",
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31690.8!2d80.4!3d6.99!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae381b8b1234567%3A0xabc123!2sKitulgala%2C+Sri+Lanka!5e0!3m2!1sen!2slk!4v1700000000000!5m2!1sen!2slk",
};

// ─── FOOTER ────────────────────────────────────────────────────────────────────
export const footer = {
  brand: "KithulGala Adventures",
  about:
    "We offer safe, guided white water rafting and outdoor adventure experiences in the heart of Kitulgala, Sri Lanka. Perfect for beginners, families, and thrill-seekers alike.",
  quickLinks: [
    { label: "Home", href: "#home" },
    { label: "Adventure Activities", href: "#activities" },
    { label: "Schedule & Times", href: "#schedule" },
    { label: "Safety & Guidelines", href: "#guidelines" },
    { label: "Reviews", href: "#reviews" },
    { label: "Contact", href: "#contact" },
  ],
  copyright: "© KithulGala River Adventures. All Rights Reserved.",
};
