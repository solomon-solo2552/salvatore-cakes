"use client";

import { useState } from "react";
import Link from "next/link";
import FounderModal from "./FounderModal";

const FOUNDERS = [
  {
    id: "damon",
    name: "Damon Salvatore",
    role: "Founder & Creative Director",
    specialty: "High-Fashion Tier Architecture & Dark Chocolate Ganache",
    signatureCake: "Nocturne Dark Truffle Tier",
    shortDesc:
      "Infuses dramatic artistic vision and bold cocoa profiles into every grand celebration design.",
    story:
      "Damon started Salvatore Cakes with a singular focus: transforming traditional confectionery into wearable-art-level grand centerpieces. His dark chocolate ganache recipes remain a tightly guarded family secret.",
    image:
      "/Founders/Damon.png",
  },
  {
    id: "stefan",
    name: "Stefan Salvatore",
    role: "Co-Founder & Head Pastry Chef",
    specialty: "Artisan Sponge Fermentation & Delicate Botanical Extracts",
    signatureCake: "Tuscan Vanilla Bean & Wild Lavender Sponge",
    shortDesc:
      "Master of subtle flavor harmonies and silky, light-as-air crumb structures.",
    story:
      "Stefan spent years training in Florence and Paris, perfecting natural fermentation and moisture preservation techniques that give Salvatore cakes their signature velvet mouthfeel.",
    image:
      "/Founders/Stefan.png",
  },
  {
    id: "selene",
    name: "Selene Salvatore",
    role: "Co-Founder & Brand Director",
    specialty: "Visual Aesthetics, Packaging Elegance & Custom Styling",
    signatureCake: "Rose Champagne & Velvet Raspberry Tier",
    shortDesc:
      "Curates the luxurious customer experience and timeless visual identity of the House.",
    story:
      "With a background in luxury brand direction, Selene ensures every box, ribbon, and unboxing moment carries the warmth and prestige expected of the Salvatore name.",
    image:
      "/Founders/Selene.png",
  },
  {
    id: "raven",
    name: "Raven Salvatore",
    role: "Co-Founder & Operations Director",
    specialty: "Temperature-Controlled Logistics & Cold-Chain Dispatch",
    signatureCake: "Pistachio Praline & Espresso Crunch Loaf",
    shortDesc:
      "Guarantees every multi-tiered creation arrives in pristine condition.",
    story:
      "Raven oversees kitchen operations and white-glove transport logistics, engineering specialized packaging that keeps delicate buttercreams perfect in transit.",
    image:
      "/Founders/Raven.png",
  },
];

export default function HouseOfSalvatore() {
  const [selectedFounder, setSelectedFounder] = useState(null);

  return (
    <section className="py-20 bg-cream/20 border-y border-espresso/10 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 space-y-12 text-center">
        {/* SECTION HEADER */}
        <div className="space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-700">
            Crafted By Family
          </span>
          <h2 className="font-display text-4xl sm:text-5xl text-espresso tracking-tight">
            The House of Salvatore
          </h2>
          <svg
            className="swirl-divider mx-auto w-28 h-4"
            viewBox="0 0 120 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 9C10 2 18 2 26 9C34 16 42 16 50 9C58 2 66 2 74 9C82 16 90 16 98 9C104 4 110 4 116 9"
              stroke="#C9A15A"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <p className="text-cocoa/70 text-sm md:text-base font-medium pt-2">
            Meet the four founders who blend culinary art, operational rigor, and timeless elegance into every celebration creation.
          </p>
        </div>

        {/* 4 FOUNDER CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {FOUNDERS.map((founder) => (
            <div
              key={founder.id}
              onClick={() => setSelectedFounder(founder)}
              className="group relative bg-white/70 backdrop-blur-sm border border-espresso/10 rounded-2xl p-4 shadow-sm hover:shadow-xl hover:border-espresso/20 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
            >
              <div className="space-y-4">
                {/* PORTRAIT IMAGE WITH HOVER ZOOM & OVERLAY */}
                <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-espresso/5 border border-espresso/10">
                  <img
                    src={founder.image}
                    alt={founder.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-xs font-bold text-cream underline underline-offset-4">
                      Read Founder Story →
                    </span>
                  </div>
                </div>

                {/* CARD DETAILS */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-amber-700 block">
                    {founder.role}
                  </span>
                  <h3 className="font-display text-xl text-espresso group-hover:text-amber-800 transition">
                    {founder.name}
                  </h3>
                  <p className="text-xs text-cocoa/70 leading-relaxed font-medium line-clamp-2">
                    {founder.shortDesc}
                  </p>
                </div>
              </div>

              {/* SPECIALTY TAG */}
              <div className="pt-4 mt-4 border-t border-espresso/5">
                <span className="text-[9px] uppercase font-bold text-cocoa/40 block">
                  Specialty Focus
                </span>
                <span className="text-xs font-semibold text-espresso truncate block">
                  {founder.specialty}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* SECTION FOOTER TAGLINES & ACTION BUTTON */}
        <div className="pt-8 space-y-4 border-t border-espresso/10 max-w-2xl mx-auto">
          <p className="font-display text-2xl md:text-3xl text-espresso tracking-tight italic">
            “Four people. Four strengths. One Salvatore.”
          </p>
          <p className="text-xs md:text-sm text-cocoa/70 font-medium leading-relaxed">
            From the first recipe to the final delivery, every Salvatore cake carries a little piece of the people who created it.
          </p>

          <div className="pt-2">
            <Link
              href="/about"
              className="inline-block btn-primary text-xs uppercase tracking-wider px-6 py-3 font-bold rounded-full shadow-md hover:shadow-lg transition"
            >
              Discover Our Story
            </Link>
          </div>
        </div>
      </div>

      {/* POPUP DETAIL MODAL */}
      {selectedFounder && (
      <FounderModal
        founder={selectedFounder}
        onClose={() => setSelectedFounder(null)}
      />
        )}
    </section>
  );
}