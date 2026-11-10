"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import api from "@/lib/api";

const QUESTIONS = [
  {
    id: 1,
    title: "What is the special occasion?",
    subtitle: "Every celebration calls for a different kind of cake structure.",
    options: [
      { label: "Grand Wedding / Engagement", icon: "💍", tag: "wedding" },
      { label: "Intimate Birthday / Milestone", icon: "🎉", tag: "birthday" },
      { label: "Anniversary / Romantic Date", icon: "🌹", tag: "romance" },
      { label: "Just Craving Artisan Sweets", icon: "☕", tag: "casual" },
    ],
  },
  {
    id: 2,
    title: "Which flavor palette excites your senses?",
    subtitle: "Tell our pastry chefs your favorite profile.",
    options: [
      { label: "Intense & Dark Cocoa / Ganache", icon: "🍫", tag: "chocolate" },
      { label: "Delicate Vanilla, Berries & Rose", icon: "🍓", tag: "floral" },
      { label: "Rich & Creamy Cheese / Praline", icon: "🧀", tag: "creamy" },
      { label: "Bright Citrus & Limoncello", icon: "🍋", tag: "citrus" },
    ],
  },
  {
    id: 3,
    title: "Any dietary preference?",
    subtitle: "All recipes use organic cream & stone-ground Tuscan flours.",
    options: [
      { label: "Standard Traditional Recipe", icon: "🌾", tag: "standard" },
      { label: "Strictly Eggless Craft", icon: "🌱", tag: "eggless" },
    ],
  },
];

// Real product slugs from your live catalog (verified from DB).
// The quiz matches the user's palette to an EXISTING product they can buy.
const FLAVOR_MATCHES = {
  chocolate: {
    name: "Ultimate Chocolate Fudge Dream Cake",
    slug: "ultimate-chocolate-fudge-dream-cake",
    tagline: "70% Single-Origin Cocoa & Espresso Ganache",
    price: 36.99,
    rating: "5.0 ★ (Bestseller)",
    image: "/salvatore-cakes-og-logo.png",
    description:
      "Triple-layer dark chocolate fudge with a molten ganache core. Handcrafted with stone-ground Tuscan flour and single-origin cocoa.",
  },
  floral: {
    name: "Classic Three-Tier Vanilla Raspberry Cake",
    slug: "classic-three-tier-vanilla-raspberry-cake",
    tagline: "Wild Berry Compote & Mascarpone Silk",
    price: 149.99,
    rating: "4.9 ★ (Wedding Favorite)",
    image: "/salvatore-cakes-og-logo.png",
    description:
      "Traditional celebration tier with organic raspberry compote and French vanilla buttercream. Ideal for romantic milestones.",
  },
  creamy: {
    name: "Lotus Biscoff Cookie Butter Cheesecake",
    slug: "lotus-biscoff-cookie-butter-cheesecake",
    tagline: "Spiced Speculoos Crunch with Creamy Cheesecake",
    price: 34.99,
    rating: "5.0 ★ (Chef's Pick)",
    image: "/salvatore-cakes-og-logo.png",
    description:
      "Creamy cheesecake swirled with caramelized Biscoff spread on a buttery shortbread base. A crowd favorite for any celebration.",
  },
  citrus: {
    name: "Classic English Lemon Drizzle Loaf",
    slug: "classic-english-lemon-drizzle-loaf",
    tagline: "Tangy Citrus Infusion with Sugar Crust",
    price: 17.99,
    rating: "4.8 ★ (Tea-Time Classic)",
    image: "/salvatore-cakes-og-logo.png",
    description:
      "Zesty lemon sponge soaked in a bright lemon syrup drizzle. Bright, refreshing, and airy — perfect for tea-time gifting.",
  },
};

export default function FlavorFinderQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [matchResult, setMatchResult] = useState(null);
  const [matchedProduct, setMatchedProduct] = useState(null);
  const [added, setAdded] = useState(false);
  const { addItem, addToCart } = useCart();
  const addCartFn = addItem || addToCart;

  // When a match is chosen, look up the real product in the DB by slug
  useEffect(() => {
    if (!matchResult) {
      setMatchedProduct(null);
      return;
    }
    api
      .get(`/products/${matchResult.slug}/`)
      .then((res) => setMatchedProduct(res.data))
      .catch(() => setMatchedProduct(null));
  }, [matchResult]);

  const handleSelectOption = (questionId, tag) => {
    const nextAnswers = { ...answers, [questionId]: tag };
    setAnswers(nextAnswers);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const palette = nextAnswers[2] || "chocolate";
      const result = FLAVOR_MATCHES[palette] || FLAVOR_MATCHES.chocolate;
      setMatchResult(result);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentStep(0);
    setMatchResult(null);
    setMatchedProduct(null);
    setAdded(false);
  };

  const handleAddToCart = () => {
    if (!matchedProduct || !addCartFn) return;
    addCartFn(matchedProduct, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  return (
    <div className="bg-white border-2 border-espresso/15 rounded-3xl p-6 sm:p-10 shadow-xl max-w-2xl mx-auto">
      {!matchResult ? (
        <div className="space-y-6">
          {/* PROGRESS STEPPER */}
          <div className="flex items-center justify-between border-b border-espresso/10 pb-4">
            <span className="text-xs font-black uppercase tracking-widest text-amber-800">
              Question {currentStep + 1} of {QUESTIONS.length}
            </span>
            <div className="flex gap-1.5">
              {QUESTIONS.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 ${idx === currentStep
                      ? "w-8 bg-amber-600"
                      : idx < currentStep
                        ? "w-4 bg-espresso/40"
                        : "w-2 bg-espresso/15"
                    }`}
                />
              ))}
            </div>
          </div>

          {/* QUESTION HEADER */}
          <div className="space-y-1">
            <h3 className="font-display text-2xl sm:text-3xl font-black text-espresso">
              {QUESTIONS[currentStep].title}
            </h3>
            <p className="text-xs sm:text-sm text-espresso/70 font-medium">
              {QUESTIONS[currentStep].subtitle}
            </p>
          </div>

          {/* OPTIONS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            {QUESTIONS[currentStep].options.map((option) => (
              <button
                key={option.tag}
                type="button"
                onClick={() => handleSelectOption(QUESTIONS[currentStep].id, option.tag)}
                className="flex items-center gap-3 p-4 rounded-2xl border-2 border-espresso/15 bg-stone-50/60 hover:bg-amber-50 hover:border-amber-600 text-left transition-all group cursor-pointer shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              >
                <span className="text-2xl group-hover:scale-125 transition-transform">
                  {option.icon}
                </span>
                <span className="font-bold text-sm text-espresso group-hover:text-amber-900">
                  {option.label}
                </span>
              </button>
            ))}
          </div>

          {/* BACK BUTTON */}
          {currentStep > 0 && (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="text-xs font-bold text-espresso/60 hover:text-espresso underline pt-2"
            >
              ← Back to previous question
            </button>
          )}
        </div>
      ) : (
        /* ================= MATCH RESULTS CARD ================= */
        <div className="space-y-6 animate-fadeIn text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-between border-b border-espresso/10 pb-4 gap-2">
            <div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-800 block">
                Your Salvatore Match
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-black text-espresso">
                {matchResult.name}
              </h3>
            </div>
            <span className="text-xs font-extrabold text-amber-900 bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-full whitespace-nowrap">
              {matchResult.rating}
            </span>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 items-center">
            <div className="aspect-square rounded-2xl overflow-hidden bg-espresso/5 border border-espresso/15 shadow-inner">
              <img
                src={matchResult.image}
                alt={matchResult.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="sm:col-span-2 space-y-3">
              <span className="text-xs font-extrabold text-amber-700 uppercase tracking-wider block">
                {matchResult.tagline}
              </span>
              <p className="text-xs text-espresso/80 font-medium leading-relaxed">
                {matchResult.description}
              </p>
              <div className="font-display text-2xl font-black text-espresso pt-1">
                ${matchResult.price.toFixed(2)}
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-espresso/10">
            <button
              onClick={handleAddToCart}
              disabled={!matchedProduct}
              className="w-full sm:flex-1 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-xs uppercase tracking-wider py-4 rounded-full shadow-lg hover:shadow-xl transition transform active:scale-95 cursor-pointer"
            >
              {added
                ? "Added to Cart! 🍰"
                : !matchedProduct
                  ? "Loading product..."
                  : `Add Match to Cart ($${Number(matchedProduct.current_price).toFixed(2)})`}
            </button>
            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-6 py-4 rounded-full border-2 border-espresso/20 text-xs font-bold text-espresso hover:bg-espresso/5 transition cursor-pointer"
            >
              Retake Quiz ↺
            </button>
          </div>
        </div>
      )}
    </div>
  );
}