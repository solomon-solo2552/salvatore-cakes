import Link from "next/link";

export default function NotFound() {
    return (
        <div className="max-w-2xl mx-auto px-6 py-24 text-center space-y-6">
            <span className="text-6xl">🍰</span>
            <h1 className="font-display text-4xl text-espresso font-black">
                Cake not found
            </h1>
            <p className="text-cocoa/70 text-sm">
                This page you're looking for may have sold out permanently,
                or the link is incorrect.
            </p>
            <div className="flex gap-3 justify-center">
                <Link href="/" className="btn-primary text-sm">
                    Return to Home
                </Link>
                <Link href="/shop" className="btn-secondary text-sm">
                    Browse Cakes
                </Link>
            </div>
        </div>
    );
}