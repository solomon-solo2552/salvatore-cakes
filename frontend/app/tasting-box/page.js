import TastingBoxSelector from "@/components/TastingBoxSelector";

export const metadata = {
  title: "The Salvatore Tasting Box | Salvatore Cakes",
  description:
    "Curate a 4-flavor artisan cake tasting box delivered to your door before placing your custom celebration order.",
};

export default function TastingBoxPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 space-y-12">
      {/* HEADER SECTION */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-black uppercase tracking-[0.25em] text-amber-800">
          Taste Before You Celebrate
        </span>
        <h1 className="font-display text-4xl sm:text-5xl text-espresso font-black leading-tight">
          The Salvatore Tasting Box
        </h1>
        <svg
          className="swirl-divider mx-auto w-32 h-4"
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
        <p className="text-espresso/80 text-sm md:text-base font-medium leading-relaxed pt-2">
          Select 4 of our signature flavor profiles below. We will bake, box, and deliver fresh mini slices directly to your door so you can find your perfect match.
        </p>
      </div>

      {/* HOW THE REBATE WORKS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="bg-white/80 border border-espresso/15 rounded-2xl p-6 space-y-2">
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-900 font-black flex items-center justify-center mx-auto text-sm">
            1
          </div>
          <h3 className="font-display text-base font-black text-espresso">
            Select Your 4 Flavors
          </h3>
          <p className="text-xs text-espresso/70 font-medium">
            Curate your custom combination of sponges, curds, and buttercreams.
          </p>
        </div>

        <div className="bg-white/80 border border-espresso/15 rounded-2xl p-6 space-y-2">
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-900 font-black flex items-center justify-center mx-auto text-sm">
            2
          </div>
          <h3 className="font-display text-base font-black text-espresso">
            Taste at Home
          </h3>
          <p className="text-xs text-espresso/70 font-medium">
            Freshly boxed and delivered cold-chain directly to your doorstep.
          </p>
        </div>

        <div className="bg-white/80 border border-espresso/15 rounded-2xl p-6 space-y-2">
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-900 font-black flex items-center justify-center mx-auto text-sm">
            3
          </div>
          <h3 className="font-display text-base font-black text-espresso">
            Get $35 Back
          </h3>
          <p className="text-xs text-espresso/70 font-medium">
            Receive a $35 voucher code applied automatically to your future full cake order.
          </p>
        </div>
      </div>

      {/* INTERACTIVE SELECTOR */}
      <TastingBoxSelector />
    </div>
  );
}