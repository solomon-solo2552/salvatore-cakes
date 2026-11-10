// frontend/lib/apiUrl.js
// Central helper for building absolute URLs from backend responses.

// Why this exists:
//     - Django returns relative media paths like "/media/products/cake.jpg"
//     - Django returns relative profile pics like "/media/profiles/user.jpg"
//     - Hardcoding "http://127.0.0.1:8000" breaks in production.

// Usage:
//    import { getImageUrl, getApiOrigin } from "@/lib/apiUrl";
//    <img src={getImageUrl(product.image)} />

const RAW_API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Strip the trailing "/api" so we get the bare origin for media files.
export const API_ORIGIN = RAW_API_URL.replace(/\/api\/?$/, "");

export const API_BASE_URL = RAW_API_URL;

/**
 * Convert a backend-provided image path into a usable URL.
 * - If input is already absolute (http/https) → returned unchanged.
 * - If input is relative ("/media/...") → prefixed with API_ORIGIN.
 * - If input is null/undefined/empty → returns the provided fallback.
 */

export function getImageUrl(path, fallback = null) {
    if (!path) return fallback;
    if (typeof path !== "string") return fallback;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    if (path.startsWith("/")) return `${API_ORIGIN}${path}`;
    return `${API_ORIGIN}/${path}`;
}

/**
 * Returns the bare origin (e.g. "http://localhost:8000") for any custom use.
 */
export function getApiOrigin() {
    return API_ORIGIN;
}