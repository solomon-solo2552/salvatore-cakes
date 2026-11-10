// frontend/lib/constants.js
// Central constants — single source of truth for the whole app.
// These slugs MUST match the categories in your production database.

// ---------------------------------------------------------------------------
// CATEGORY SLUGS — matches your real 8-category DB
// (verified from: Category.objects.all() in the Django shell)
// ---------------------------------------------------------------------------
export const CATEGORY_SLUGS = {
    CELEBRATION: "celebration-cakes",
    CUSTOM: "custom-cakes",
    CHEESECAKES: "cheesecakes",
    CUPCAKES: "gourmet-cupcakes-pastries",
    TEA_LOAF: "tea-loaf-cakes",
    EGGLESS: "eggless-vegan-bakes",
    ARTISANAL: "artisanal-eggless-creations",
    FESTIVE: "festive-seasonal-specials",
};

// Display labels for admin dropdowns / UI (order = display order)
export const CATEGORY_OPTIONS = [
    { value: CATEGORY_SLUGS.CELEBRATION, label: "Celebration Cakes" },
    { value: CATEGORY_SLUGS.CUSTOM, label: "Custom Cakes" },
    { value: CATEGORY_SLUGS.CHEESECAKES, label: "Cheesecakes" },
    { value: CATEGORY_SLUGS.CUPCAKES, label: "Gourmet Cupcakes & Pastries" },
    { value: CATEGORY_SLUGS.TEA_LOAF, label: "Tea & Loaf Cakes" },
    { value: CATEGORY_SLUGS.EGGLESS, label: "Eggless & Vegan Bakes" },
    { value: CATEGORY_SLUGS.ARTISANAL, label: "Artisanal & Eggless Creations" },
    { value: CATEGORY_SLUGS.FESTIVE, label: "Festive & Seasonal Specials" },
];

// ---------------------------------------------------------------------------
// ORDER STATUSES — must match backend orders/models.py
// ---------------------------------------------------------------------------
export const ORDER_STATUSES = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "baking", label: "Baking" },
    { value: "finished", label: "Finished" },
    { value: "packed", label: "Packed" },
    { value: "out_for_delivery", label: "Out for Delivery" },
    { value: "delivered", label: "Delivered" },
    { value: "received", label: "Received" },
    { value: "cancelled", label: "Cancelled" },
];

export const ADMIN_UPDATE_STATUSES = ORDER_STATUSES
    .filter((s) => s.value !== "cancelled")
    .map((s) => s.value);

export const PROGRESS_STAGES = [
    "pending",
    "confirmed",
    "baking",
    "finished",
    "packed",
    "out_for_delivery",
    "delivered",
    "received",
];

// ---------------------------------------------------------------------------
// PAYMENT METHODS — must match backend orders/models.py
// ---------------------------------------------------------------------------
export const PAYMENT_METHODS = [
    { value: "upi", label: "Instant UPI", icon: "📱" },
    { value: "card", label: "Debit / Credit Card", icon: "💳" },
    { value: "cod", label: "Cash on Delivery", icon: "💵" },
];

// ---------------------------------------------------------------------------
// COMPLAINT CATEGORIES — must match backend complaints/models.py
// ---------------------------------------------------------------------------
export const COMPLAINT_CATEGORIES = [
    { value: "delivery", label: "Delivery / Delay" },
    { value: "quality", label: "Cake Quality / Taste" },
    { value: "damage", label: "Damaged / Packaging Issue" },
    { value: "billing", label: "Payment / Refund" },
    { value: "custom_order", label: "Custom Cake / Piping Request" },
    { value: "general", label: "General Feedback" },
];

// ---------------------------------------------------------------------------
// CART
// ---------------------------------------------------------------------------
export const CART_STORAGE_KEY = "salvatore_cart";

export const TASTING_BOX_ID = "tasting-box-custom";
export const TASTING_BOX_PRICE = 35.0;
export const TASTING_BOX_NAME = "The Salvatore Curated Tasting Box";