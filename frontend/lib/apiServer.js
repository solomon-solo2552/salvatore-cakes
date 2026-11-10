// frontend/lib/apiServer.js
// Server-side axios instance for use in Server Components ONLY.

// ❌ Do NOT import this in any file that has "use client" at the top.
// ✅ Safe to import in: app/shop/page.js, app/product/[slug]/page.js,
//    and any other Server Component that only fetches PUBLIC data.

// Why a separate file:
//   The existing lib/api.js reads `sessionStorage` for the JWT token.
//   sessionStorage does not exist on the server → importing it in a
//   Server Component throws, or silently sends unauthenticated requests
//   to localhost (which breaks on Vercel / any non-localhost deploy).

import axios from "axios";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Public data client - no auth header, no interceptors.
// Use this for: product listing, product detail, categories.
const apiServer = axios.create({
    baseURL: API_URL,
    timeout: 10000, // 10s - don't hang the SSR render forever
});

export default apiServer;