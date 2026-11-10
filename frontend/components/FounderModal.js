"use client";

import { useEffect } from "react";

export default function FounderModal({ founder, onClose }) {
  useEffect(() => {
    if (!founder) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [founder, onClose]);

  if (!founder) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/70 backdrop-blur-md transition-opacity animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-cream border-2 border-espresso/20 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-espresso/10 hover:bg-espresso/20 text-espresso flex items-center justify-center transition text-lg font-black"
          aria-label="Close details"
        >
          ✕
        </button>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
          {/* LARGE PORTRAIT */}
          <div className="md:col-span-2 aspect-[3/4] rounded-2xl overflow-hidden bg-espresso/10 border border-espresso/20 shadow-md">
            <img
              src={founder.image}
              alt={founder.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* DETAILS CONTENT */}
          <div className="md:col-span-3 space-y-4 text-left">
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-amber-800 block mb-1">
                {founder.role}
              </span>
              <h3 className="font-display text-2xl md:text-3xl text-espresso font-black leading-tight">
                {founder.name}
              </h3>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-black tracking-wider text-espresso/70 block">
                Signature Specialty
              </span>
              <p className="text-sm font-bold text-espresso">
                {founder.specialty}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-black tracking-wider text-espresso/70 block">
                Favorite / Signature Cake
              </span>
              <p className="text-xs font-extrabold text-amber-950 bg-amber-100/80 border border-amber-300 rounded-xl px-3 py-2 inline-block">
                🍰 {founder.signatureCake}
              </p>
            </div>

            <div className="pt-3 border-t border-espresso/15">
              <span className="text-[10px] uppercase font-black tracking-wider text-espresso/70 block mb-1.5">
                The Heritage Story
              </span>
              <p className="text-xs md:text-sm text-espresso/90 leading-relaxed font-semibold">
                {founder.story}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}