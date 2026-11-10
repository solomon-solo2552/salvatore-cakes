import { ProductGridSkeleton } from "@/components/Skeleton";


export default function Loading() {
    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="h-10 w-64 bg-espresso/10 rounded-lg animate-pulse mb-8" />
            <div className="h-12 w-full bg-espresso/5 rounded-full animate-pulse mb-10" />
            <ProductGridSkeleton count={8} />
        </div>
    );
}