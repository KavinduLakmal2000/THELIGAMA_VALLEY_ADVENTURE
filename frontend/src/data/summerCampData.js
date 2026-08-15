// ─── SUMMER CAMP ─────────────────────────────────────────────────────────────
// Content for the Summer Camp teaser (home page) and the full Summer Camp page.
// Images reuse existing assets in /public/about_img so no new uploads are required.

const IMG = "/about_img/Marvel_Canyon_Manna_Kathi_Ella.jpg";

export const summerCamp = {
  eyebrow: "New This Season",
  title: "SUMMER CAMP",
  tagline: "Adventure, Cuisine, Craftsmanship & Nature",
  heroImage: IMG,

  intro:
    "One camp, four worlds. Theligama Summer Camp brings together white-water rafting and rainforest trekking, real Sri Lankan cooking and tea, hands-on gem and jewellery-making, and village life with the island's gentle giants — all in one guided, safety-first experience in the Kelani River valley.",

  teaserText:
    "A full week in the Kelani River valley — rapids and rainforest by day, Sri Lankan cooking and gem-craft by lamplight, elephants and village life woven through it all.",

  // ── The four pillars ──────────────────────────────────────────────────────
  pillars: [
    {
      key: "adventure",
      step: "01",
      icon: "🌊",
      title: "Adventure",
      image: IMG + "Water_Sports_Kayaking.jpg",
      blurb:
        "The valley at its wildest — rapids, canopy, and cold mountain water.",
      highlights: ["White-water rafting", "Rainforest trekking", "Waterfall hikes", "River water activities"],
    },
    {
      key: "cuisine",
      step: "02",
      icon: "🍛",
      title: "Cuisine",
      image: IMG + "Authentic_Sri_Lankan_Cuisine.jpg",
      blurb:
        "Real Sri Lankan food, cooked by hand and eaten the way it's meant to be.",
      highlights: ["Rice & curry cooking workshop", "Spice education", "Tea plantation visit & tasting", "Village dining"],
    },
    {
      key: "craft",
      step: "03",
      icon: "💎",
      title: "Craftsmanship",
      image: IMG + "Gem_Cultural_Experiences.jpg",
      blurb:
        "Sri Lanka's gem-island heritage, made with your own hands.",
      highlights: ["Gemstone education", "Silver jewellery-making workshop", "Optional gold/gem upgrade", "A handmade souvenir to keep"],
    },
    {
      key: "culture",
      step: "04",
      icon: "🐘",
      title: "Culture & Nature",
      image: IMG + "Nearby_Attractions.jpg",
      blurb:
        "Elephants, village life, and campfire nights under the stars.",
      highlights: ["Elephant experience", "Village & community visits", "Campfire storytelling", "Tree planting & conservation"],
    },
  ],

  // ── Who it's for ──────────────────────────────────────────────────────────
  audiences: [
    {
      icon: "🎒",
      title: "International Travellers",
      text: "Teens and young adults from around the world, here for adventure, culture, and a safe way to experience the real Sri Lanka.",
    },
    {
      icon: "🏫",
      title: "Schools & Universities",
      text: "Structured educational trips built around leadership, teamwork, and genuine cultural exchange — not just sightseeing.",
    },
    {
      icon: "👨‍👩‍👧‍👦",
      title: "Sri Lankan Families",
      text: "Safe, well-supervised holidays and weekend experiences that give kids something to talk about long after camp ends.",
    },
    {
      icon: "💼",
      title: "Corporate Teams",
      text: "Retreats and team-building days that trade the conference room for a river, a rainforest, and a shared meal.",
    },
  ],

  // ── What makes it different ───────────────────────────────────────────────
  differenceIntro:
    "\u201cMore than an adventure trip.\u201d Most Kitulgala operators stop at rafting and a bed for the night. Base camp goes further.",
  difference: [
    { label: "White-water rafting", typical: true,  camp: true },
    { label: "Premium hospitality", typical: false, camp: true },
    { label: "Cooking experience",  typical: false, camp: true },
    { label: "Jewellery-making",    typical: false, camp: true },
    { label: "European-style organisation", typical: false, camp: true },
    { label: "Cultural immersion", typical: false, camp: true },
    { label: "Conservation activities", typical: false, camp: true },
  ],

  // ── Customer journey ──────────────────────────────────────────────────────
  journey: [
    {
      stage: "Before Camp",
      icon: "📩",
      items: ["Welcome email & packing list", "Safety information", "Travel guide to the valley"],
    },
    {
      stage: "During Camp",
      icon: "🏕️",
      items: ["Adventure by day", "Food & cooking by hand", "Craft, culture & campfire by night"],
    },
    {
      stage: "After Camp",
      icon: "📸",
      items: ["Your photos, delivered", "A loyalty discount", "Refer a friend"],
    },
  ],

  sustainability: {
    icon: "🌱",
    title: "Built to give back",
    text: "Every camp includes tree planting and conservation activities, and works with local guides, cooks, and village hosts throughout the valley — so your week here supports the community and rainforest it runs through.",
  },

  cta: {
    title: "Ready for base camp?",
    text: "Tell us a little about your group and we'll help you find the right dates.",
    primary: { label: "Book This Experience", scrollTo: "booking" },
    secondary: { label: "Ask a Question", scrollTo: "contact" },
  },
};
