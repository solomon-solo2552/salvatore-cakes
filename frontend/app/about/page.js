import Link from "next/link";

export const metadata = {
  title: "Our Story | Salvatore Cakes",
  description:
    "Discover the heritage of Salvatore Cakes — from our great-great-ancestors in 1864 to our global cake franchise today.",
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 space-y-20">
      {/* 1. HERO HEADER */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-black uppercase tracking-[0.25em] text-amber-800">
          Est. 1864 • A Legacy of Taste
        </span>
        <h1 className="font-display text-4xl sm:text-6xl text-espresso font-black leading-tight">
          Over a century of family baking.
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
        <p className="text-espresso/80 text-base md:text-lg font-medium leading-relaxed pt-2">
          What began in 1864 with our great-great-ancestors in a small family kitchen has grown across generations into a world-renowned house of luxury artisan cakes.
        </p>
      </section>

      {/* 2. THE BRAND STORY NARRATIVE */}
      <section className="grid md:grid-cols-2 gap-12 items-center bg-white/70 border border-espresso/15 rounded-3xl p-8 md:p-12 shadow-sm">
        <div className="space-y-4">
          <span className="text-[11px] font-black uppercase tracking-widest text-amber-800 block">
            The Philosophy
          </span>
          <h2 className="font-display text-2xl md:text-3xl text-espresso font-bold">
            Guarding century-old secrets.
          </h2>
          <p className="text-xs md:text-sm text-espresso/80 font-medium leading-relaxed">
            For generations, the Salvatore family guarded handwritten recipe books containing precise measurements for rich sponges, dark cocoa ganaches, and delicate fruit preserves.
          </p>
          <p className="text-xs md:text-sm text-espresso/80 font-medium leading-relaxed">
            Today, Damon, Stefan, Selene, and Raven Salvatore continue that traditional craft on a global scale—combining ancestral baking heritage with modern luxury pastry architecture.
          </p>
        </div>

        <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-espresso/5 border border-espresso/10 shadow-inner">
          <img
            src="/salvatore-cakes-og-logo.png"
            alt="Salvatore Family Bakery Heritage"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* 3. TIMELINE OF THE HOUSE */}
      <section className="space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-amber-800">
            Our Journey
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-espresso font-black">
            Milestones of The House
          </h2>
        </div>

        <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 md:before:left-1/2 before:-ml-px before:w-0.5 before:bg-espresso/15">
          {/* 1864 */}
          <div className="relative flex items-center md:justify-between group">
            <div className="flex items-center w-full md:w-1/2 md:pr-8 pl-10 md:pl-0">
              <div className="bg-white border-2 border-espresso/20 p-6 rounded-2xl shadow-sm space-y-1 w-full text-left">
                <span className="text-xs font-black text-amber-800 block">1864</span>
                <h3 className="font-display text-lg text-espresso font-bold">The Ancestral Beginnings</h3>
                <p className="text-xs text-espresso/80 font-medium">
                  Our great-great-ancestors began baking traditional celebratory cakes using stone-ground flours and hearth ovens, laying the foundation of the Salvatore recipe archive.
                </p>
              </div>
            </div>
            <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-amber-700 border-4 border-cream z-10" />
          </div>

          {/* 1947 */}
          <div className="relative flex items-center md:justify-end group">
            <div className="flex items-center w-full md:w-1/2 md:pl-8 pl-10">
              <div className="bg-white border-2 border-espresso/20 p-6 rounded-2xl shadow-sm space-y-1 w-full text-left">
                <span className="text-xs font-black text-amber-800 block">1947</span>
                <h3 className="font-display text-lg text-espresso font-bold">The First Storefront</h3>
                <p className="text-xs text-espresso/80 font-medium">
                  Following post-war revitalization, our ancestors opened the very first modest storefront shop, serving artisan sweet breads and fresh layered cakes to local neighborhood families.
                </p>
              </div>
            </div>
            <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-amber-700 border-4 border-cream z-10" />
          </div>

          {/* 1988 */}
          <div className="relative flex items-center md:justify-between group">
            <div className="flex items-center w-full md:w-1/2 md:pr-8 pl-10 md:pl-0">
              <div className="bg-white border-2 border-espresso/20 p-6 rounded-2xl shadow-sm space-y-1 w-full text-left">
                <span className="text-xs font-black text-amber-800 block">1988</span>
                <h3 className="font-display text-lg text-espresso font-bold">Mastering Tier Architecture</h3>
                <p className="text-xs text-espresso/80 font-medium">
                  The second-generation masters expanded the kitchen into custom wedding tiers and specialized dark chocolate tempering techniques.
                </p>
              </div>
            </div>
            <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-amber-700 border-4 border-cream z-10" />
          </div>

          {/* 2014 */}
          <div className="relative flex items-center md:justify-end group">
            <div className="flex items-center w-full md:w-1/2 md:pl-8 pl-10">
              <div className="bg-white border-2 border-espresso/20 p-6 rounded-2xl shadow-sm space-y-1 w-full text-left">
                <span className="text-xs font-black text-amber-800 block">2014</span>
                <h3 className="font-display text-lg text-espresso font-bold">The Four Siblings Unite</h3>
                <p className="text-xs text-espresso/80 font-medium">
                  Inspired by our deep family roots, the four Salvatore siblings—Damon, Stefan, Selene, and Raven—reimagined the business into a flagship boutique cake store.
                </p>
              </div>
            </div>
            <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-amber-700 border-4 border-cream z-10" />
          </div>

          {/* 2020 */}
          <div className="relative flex items-center md:justify-between group">
            <div className="flex items-center w-full md:w-1/2 md:pr-8 pl-10 md:pl-0">
              <div className="bg-white border-2 border-espresso/20 p-6 rounded-2xl shadow-sm space-y-1 w-full text-left">
                <span className="text-xs font-black text-amber-800 block">2020</span>
                <h3 className="font-display text-lg text-espresso font-bold">International Expansion</h3>
                <p className="text-xs text-espresso/80 font-medium">
                  The House of Salvatore expanded beyond national borders, establishing franchise boutiques and cold-chain distribution centers across major global cities.
                </p>
              </div>
            </div>
            <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-amber-700 border-4 border-cream z-10" />
          </div>

          {/* Present Day */}
          <div className="relative flex items-center md:justify-end group">
            <div className="flex items-center w-full md:w-1/2 md:pl-8 pl-10">
              <div className="bg-white border-2 border-espresso/20 p-6 rounded-2xl shadow-sm space-y-1 w-full text-left">
                <span className="text-xs font-black text-amber-800 block">Present Day</span>
                <h3 className="font-display text-lg text-espresso font-bold">Global Cake Franchise</h3>
                <p className="text-xs text-espresso/80 font-medium">
                  Now operating a premier international cake franchise, bringing fresh-baked signature cakes, wedding tiers, and luxury dessert boxes to celebrations worldwide.
                </p>
              </div>
            </div>
            <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-amber-700 border-4 border-cream z-10" />
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION FOOTER BANNER */}
      <section className="bg-[#2B1B17] rounded-3xl p-10 md:p-14 text-center space-y-6 shadow-xl border border-amber-900/40 my-12">
        <span className="text-xs font-black uppercase tracking-[0.2em] text-amber-400 block">
          Taste The Heritage
        </span>
        
        <h2 
          className="text-3xl md:text-4xl font-black leading-tight text-white" 
          style={{ color: "#FFFFFF" }}
        >
          Taste the Salvatore tradition today.
        </h2>

        <p className="text-sm md:text-base text-amber-100/90 max-w-xl mx-auto font-medium leading-relaxed">
          Explore our seasonal bakery case and order fresh-baked cakes delivered right to your doorstep for your next celebration.
        </p>

        <div className="pt-2">
          <Link
            href="/shop"
            className="inline-block bg-amber-500 hover:bg-amber-600 text-[#2B1B17] text-xs uppercase tracking-wider font-black px-8 py-3.5 rounded-full transition shadow-lg hover:shadow-xl hover:scale-105 transform"
          >
            Explore Bakery Case →
          </Link>
        </div>
      </section>
    </div>
  );
}