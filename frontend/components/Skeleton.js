// frontend/components/Skeleton.js
// Base skeleton primitive - animated pulse, themed to the espresso palette.

export default function Skeleton({ className = "" }) {
    return (
        <div
            className={`animate-pulse rounded-lg bg-espresso/10 ${className}`}
            aria-hidden="true"
        />
    );
}


export function ProductCardSkeleton() {
    return (
        <div className="card flex flex-col">
            <Skeleton className="aspect-square rounded-none" />
            <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-9 w-full rounded-full" />
            </div>
        </div>
    );
}

export function ProductGridSkeleton({ count = 8 }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    );
}

export function OrderRowSkeleton() {
    return (
        <div className="bg-white/60 border border-espresso/10 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-4 w-1/3 ml-auto" />
        </div>
    );
}

export function TextSkeleton({ lines = 3 }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    className={`h-4 ${i === lines - 1 ? "w-2/3" : "w-full"}`}
                />
            ))}
        </div>
    );
}