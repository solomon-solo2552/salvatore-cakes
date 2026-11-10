import FlavorFinderQuiz from "@/components/FlavorFinderQuiz";

export const metadata = {
  title: "Flavor Finder Quiz | Salvatore Cakes",
  description:
    "Take our 3-question interactive bakery quiz to find your signature celebration cake match.",
};

export default function FlavorFinderPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 space-y-12">
      {/* HEADER BANNER */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs font-black uppercase tracking-[0.25em] text-amber-800">
          Personalized Confectionery
        </span>
        <h1 className="font-display text-4xl sm:text-5xl text-espresso font-black leading-tight">
          Find Your Signature Slice
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
          Answer 3 brief questions and let our ancestral baking recommendations guide you to the perfect cake.
        </p>
      </div>

      {/* QUIZ CONTAINER */}
      <FlavorFinderQuiz />
    </div>
  );
}