// frontend/components/EmptyState.js
// Reusable empty state - icon + message + optional action.

import Link from "next/link";

export default function EmptyState({
    icon = "🍰",
    title = "Nothing here yet",
    description = "",
    actionLabel = null,
    onAction = null,
    compact = false,
}) {
    return (
        <div
            className={`bg-white/40 border border-dashed border-espresso/20 rounded-2xl text-center flex flex-col items-center justify-center ${
                compact ? "p-6 space-y-2" : "p-12 space-y-3"
            }`}
        >
            <span className={compact ? "text-3xl" : "text-4xl"}>{icon}</span>
            <h3 className="font-display text-espresso font-medium text-base">
                {title}
            </h3>
            {description && (
                <p className="text-cocoa/60 text-xs max-w-xs mx-auto">{description}</p>
            )}
            {actionLabel && (actionHref || onAction) && (
                <div className="pt-2">
                    {actionHref ? (
                        <Link href={actionHref} className="btn-primary text-xs px-4 py-2">
                            {actionLabel}
                        </Link>
                    ) : (
                        <button
                            onClick={onAction}
                            className="btn-primary text-xs px-4 py-2"
                        >
                            {actionLabel}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}