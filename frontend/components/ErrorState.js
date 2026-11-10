// frontend/components/ErrorState.js
// Reusable error state - message + retry button.

"use client"

export default function ErrorState({
    title = "Something went wrong",
    description = "Please check your connection and try again.",
    onRetry = null,
    compact = false,
}) {
    return (
        <div
            className={`bg-rose-50/70 border border-rose-200 rounded-2xl text-center flex flex-col items-center justify-center ${
                compact ? "p-6 space-y-2" : "p-12 space-y-3"
            }`}
        >
            <span className={compact ? "text-3xl" : "text-4xl"}>⚠️</span>
            <h3 className="font-display text-espresso font-medium text-base">
                {title}
            </h3>
            <p className="text-rose-800/70 text-xs max-w-xs mx-auto">
                {description}
            </p>
            {onRetry && (
                <div className="pt-2">
                    <button
                        onClick={onRetry}
                        className="border border-espresso/30 text-xs font-medium px-4 py-2 rounded-full hover:bg-espresso/5 transition"
                    >
                        Try Again
                    </button>
                </div>
            )}
        </div>
    );
}