"use client";

export default function Error({ error, reset }) {
    return (
        <div className="max-w-2xl mx-auto px-6 py-24 text-center space-y-6">
            <span className="text-6xl">⚠️</span>
            <h1 className="font-display text-3xl text-espresso font-black">
                Something went wrong
            </h1>
            <p className="text-cocoa/70 text-sm">
                We hit an unexpected error. Try again, or head back home.
            </p>
            <div className="flex gap-3 justify-center">
                <button onClick={reset} className="btn-primary text-sm">
                    Try Again
                </button>
                <a href="/" className="btn-secondary text-sm">
                    Go Home
                </a>
            </div>
        </div>
    );
}