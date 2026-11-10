"use client";

import { useEffect, useState, useMemo } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import EmptyState from "@/components/EmptyState";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔍 Feature 6: Search & Filtering States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("orders"); // "orders" | "calendar" | "inventory"

  // 🖨️ Feature 3: Active Print Slip
  const [activePrintOrder, setActivePrintOrder] = useState(null);

  // Status management states
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [stockUpdatingId, setStockUpdatingId] = useState(null);

  const UPDATE_STATUSES = [
    "pending",
    "confirmed",
    "baking",
    "finished",
    "packed",
    "out_for_delivery",
    "delivered",
    "received",
  ];

  const FILTER_STATUSES = [...UPDATE_STATUSES, "cancelled"];

  // Fetch orders and catalog products
  const fetchDashboardData = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.allSettled([
        api.get("/orders/"),
        api.get("/products/"),
      ]);

      if (ordersRes.status === "fulfilled") {
        setOrders(ordersRes.value.data.results || ordersRes.value.data || []);
      }
      if (productsRes.status === "fulfilled") {
        setProducts(productsRes.value.data.results || productsRes.value.data || []);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Update Order Status
  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await api.patch(`/orders/${orderId}/`, { status: newStatus });
      const updatedStatus = res.data?.status || newStatus;

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: updatedStatus } : o))
      );
      toast.success(`Order #${orderId} → ${updatedStatus.replace(/_/g, " ")}`);
    } catch (err) {
      console.error("Status update error:", err);
      toast.error("Failed to update status", {
        description: JSON.stringify(err.response?.data) || err.message,
      });
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete Cancelled Order
  const handleDeleteOrder = async (order) => {
    if (order.status !== "cancelled") {
      toast.error("Only cancelled orders can be permanently deleted.");
      return;
    }

    if (!window.confirm(`Permanently remove Cancelled Order #${order.id}?`)) return;

    setDeletingId(order.id);
    try {
      await api.delete(`/orders/${order.id}/`);
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
    } catch (err) {
      console.error("Delete order error:", err);
      toast.error(err.response?.data?.detail || "Failed to delete order.");
    } finally {
      setDeletingId(null);
    }
  };

  // 🖨️ Feature 3: Kitchen Print Slip Trigger
  const handlePrintSlip = (order) => {
    setActivePrintOrder(order);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  // 📦 Feature 4: Toggle Product Stock Quantity & Active Status
  const handleToggleProductStock = async (product, newQuantity) => {
    setStockUpdatingId(product.id);
    try {
      const qty = Math.max(0, newQuantity);
      await api.patch(`/products/${product.slug || product.id}/`, {
        stock: qty,  // ← FIXED: matches backend field name
      });

      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, stock: qty } : p))
      );
    } catch (err) {
      console.error("Stock update error:", err);
      toast.error("Failed to update inventory stock.");
    } finally {
      setStockUpdatingId(null);
    }
  };

  // 🔍 Feature 6: Filter and Search Computation
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Status Filter
      if (statusFilter !== "all" && order.status !== statusFilter) return false;

      // 2. Payment Method Filter
      if (paymentFilter !== "all" && order.payment_method !== paymentFilter) return false;

      // 3. Search Query matching (ID, Customer Name, Phone, City)
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesId = String(order.id).includes(query);
        const matchesName = order.full_name?.toLowerCase().includes(query);
        const matchesPhone = order.phone?.toLowerCase().includes(query);
        const matchesCity = order.city?.toLowerCase().includes(query);

        if (!matchesId && !matchesName && !matchesPhone && !matchesCity) {
          return false;
        }
      }

      return true;
    });
  }, [orders, statusFilter, paymentFilter, searchQuery]);

  // 📅 Feature 5: Group Deliveries by Date for Calendar Pipeline
  const calendarGroupedOrders = useMemo(() => {
    const groups = {};
    orders.forEach((order) => {
      if (order.status === "cancelled" || order.status === "delivered") return;
      const dateKey = order.delivery_date || "Standard / Unscheduled";
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(order);
    });
    return Object.entries(groups).sort(([a], [b]) => (a > b ? 1 : -1));
  }, [orders]);

  const getBadgeStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-900 border-amber-300";
      case "confirmed":
        return "bg-blue-100 text-blue-900 border-blue-300 font-bold";
      case "baking":
        return "bg-orange-100 text-orange-900 border-orange-300 font-black";
      case "finished":
        return "bg-purple-100 text-purple-900 border-purple-300";
      case "packed":
        return "bg-indigo-100 text-indigo-900 border-indigo-300";
      case "out_for_delivery":
        return "bg-teal-100 text-teal-900 border-teal-300";
      case "delivered":
      case "received":
        return "bg-emerald-100 text-emerald-900 border-emerald-300";
      case "cancelled":
        return "bg-rose-100 text-rose-900 border-rose-300 font-bold";
      default:
        return "bg-stone-200 text-stone-800 border-stone-300";
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-3xl border-2 border-stone-200 shadow-sm space-y-3">
          <div className="h-8 w-72 bg-stone-100 rounded animate-pulse" />
          <div className="h-4 w-96 bg-stone-100 rounded animate-pulse" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border-2 border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-6 w-32 bg-stone-100 rounded animate-pulse" />
                <div className="h-8 w-24 bg-stone-100 rounded-full animate-pulse" />
              </div>
              <div className="h-4 w-2/3 bg-stone-100 rounded animate-pulse" />
              <div className="h-16 w-full bg-stone-100 rounded-2xl animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* ========================================================================= */}
      {/* 🧭 NAVIGATION TABS & SEARCH BAR (Hidden during printing) */}
      {/* ========================================================================= */}
      <div className="print:hidden space-y-4">
        {/* Top Control Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-6 rounded-3xl border-2 border-stone-200 shadow-sm gap-4">
          <div>
            <h1 className="text-3xl font-black text-stone-900 tracking-tight">Kitchen & Dispatch Admin</h1>
            <p className="text-xs font-semibold text-stone-500 mt-1">
              Live order pipeline, dispatch printing & inventory controller
            </p>
          </div>

          {/* TAB BUTTONS */}
          <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${activeTab === "orders"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-500 hover:text-stone-900"
                }`}
            >
              📋 Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab("calendar")}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${activeTab === "calendar"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-500 hover:text-stone-900"
                }`}
            >
              📅 Schedule View
            </button>
            <button
              onClick={() => setActiveTab("inventory")}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${activeTab === "inventory"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-500 hover:text-stone-900"
                }`}
            >
              📦 Stock Manager
            </button>
          </div>
        </div>

        {/* 🔍 FEATURE 6: SEARCH & FILTER CONTROLS */}
        {activeTab === "orders" && (
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-6 relative">
              <input
                type="text"
                placeholder="Search by Order #, Customer Name, Phone, or City..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <span className="absolute left-3.5 top-3 text-sm">🔍</span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-2.5 text-xs text-stone-400 font-bold hover:text-stone-700"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="sm:col-span-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl border border-stone-300 bg-stone-50 text-xs font-bold text-stone-900 focus:outline-none"
              >
                <option value="all">ALL STATUSES</option>
                {FILTER_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st.replace(/_/g, " ").toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method Filter */}
            <div className="sm:col-span-3">
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl border border-stone-300 bg-stone-50 text-xs font-bold text-stone-900 focus:outline-none uppercase"
              >
                <option value="all">ALL PAYMENTS</option>
                <option value="upi">📱 UPI</option>
                <option value="card">💳 Card</option>
                <option value="cod">💵 Cash on Delivery</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 📋 TAB 1: ORDER PIPELINE LIST */}
      {/* ========================================================================= */}
      {activeTab === "orders" && (
        <div className="print:hidden space-y-4">
          {filteredOrders.length === 0 ? (
            <EmptyState
              icon="📋"
              title="No orders found"
              description={
                searchQuery || statusFilter !== "all" || paymentFilter !== "all"
                  ? "Try clearing your filters or searching for something else."
                  : "New orders will appear here as they come in."
              }
              actionLabel={
                searchQuery || statusFilter !== "all" || paymentFilter !== "all"
                  ? "Clear filters"
                  : null
              }
              onAction={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setPaymentFilter("all");
              }}
            />
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-6 rounded-3xl border-2 border-stone-200 shadow-sm hover:shadow-md transition space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-stone-100 pb-4 gap-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-black text-stone-900">Order #{order.id}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide ${getBadgeStyle(order.status)}`}>
                        {order.status?.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-stone-600 mt-1">
                      Customer: <strong className="text-stone-900">{order.full_name}</strong> | Phone: <strong className="text-stone-900">{order.phone}</strong>
                    </p>
                  </div>

                  {/* Actions: Print Slip & Status Selector */}
                  <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
                    {/* 🖨️ Feature 3: Print Slip */}
                    <button
                      onClick={() => handlePrintSlip(order)}
                      className="bg-stone-800 hover:bg-black text-white text-xs font-bold uppercase px-3.5 py-2 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
                      title="Print Bake Slip & Thermal Invoice"
                    >
                      <span>🖨️</span>
                      <span>Print Slip</span>
                    </button>

                    {order.status === "cancelled" ? (
                      <div className="flex items-center gap-2">
                        <div className="px-3 py-2 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl">
                          🚫 Cancelled
                        </div>
                        <button
                          onClick={() => handleDeleteOrder(order)}
                          disabled={deletingId === order.id}
                          className="bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-black uppercase px-3.5 py-2 rounded-xl transition shadow cursor-pointer"
                        >
                          {deletingId === order.id ? "Deleting..." : "Delete 🗑️"}
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-xl border border-stone-300">
                        <span className="text-[10px] font-black uppercase text-stone-500 pl-1">Stage:</span>
                        <select
                          disabled={updatingId === order.id}
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          className="text-xs font-bold px-2.5 py-1.5 rounded-lg border border-stone-400 bg-white text-stone-900 focus:outline-none cursor-pointer uppercase disabled:opacity-50"
                        >
                          {UPDATE_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {st.replace(/_/g, " ").toUpperCase()}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* Details Meta Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                  <div>
                    <span className="block font-bold text-[10px] uppercase text-stone-400">Target Arrival</span>
                    <strong className="text-stone-900 text-sm">
                      {order.delivery_date ? new Date(order.delivery_date).toLocaleDateString() : "Standard Delivery"}
                    </strong>
                  </div>
                  <div>
                    <span className="block font-bold text-[10px] uppercase text-stone-400">Payment</span>
                    <strong className="text-stone-900 uppercase text-sm">{order.payment_method || "COD"}</strong>
                  </div>
                  <div>
                    <span className="block font-bold text-[10px] uppercase text-stone-400">Destination</span>
                    <span className="text-stone-900 font-semibold truncate block">
                      {order.address_line}, {order.city}
                    </span>
                  </div>
                  <div>
                    <span className="block font-bold text-[10px] uppercase text-stone-400">Total Price</span>
                    <strong className="text-emerald-700 text-base font-black">${Number(order.total_amount || 0).toFixed(2)}</strong>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-stone-400">Baking Queue Items:</span>
                  <ul className="text-xs font-semibold text-stone-800 space-y-1 bg-amber-50/50 p-3 rounded-2xl border border-amber-200/60">
                    {order.items?.map((item) => (
                      <li key={item.id} className="flex justify-between border-b border-dashed border-amber-200/80 pb-1 last:border-none">
                        <span>🍰 <strong>{item.product_name || item.product?.name}</strong> × {item.quantity}</span>
                        <span className="font-bold text-stone-900">${Number(item.subtotal || 0).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Custom Instruction Alert */}
                {order.notes && (
                  <div className="bg-amber-100/70 text-amber-950 border border-amber-300 p-3 rounded-2xl text-xs font-semibold flex items-center gap-2">
                    <span className="text-base">⚠️</span>
                    <div><strong>Kitchen Note:</strong> "{order.notes}"</div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 📅 TAB 2: SCHEDULE & DELIVERY CAPACITY VIEW (Feature 5) */}
      {/* ========================================================================= */}
      {activeTab === "calendar" && (
        <div className="print:hidden space-y-6 animate-fadeIn">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-1">
            <h2 className="text-xl font-black text-stone-900">Upcoming Delivery Schedule & Capacity</h2>
            <p className="text-xs text-stone-500 font-medium">
              Orders grouped by target delivery date to manage oven and decorator workload.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {calendarGroupedOrders.map(([dateKey, dateOrders]) => (
              <div key={dateKey} className="bg-white border-2 border-stone-200 rounded-3xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider block">Bake Date</span>
                    <h3 className="font-display text-lg font-black text-stone-900">
                      {dateKey === "Standard / Unscheduled" ? dateKey : new Date(dateKey).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                    </h3>
                  </div>
                  <span className={`px-3 py-1 text-xs font-black rounded-full border ${dateOrders.length > 5 ? "bg-rose-100 text-rose-900 border-rose-300" : "bg-emerald-100 text-emerald-900 border-emerald-300"
                    }`}>
                    {dateOrders.length} Order{dateOrders.length > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="space-y-2">
                  {dateOrders.map((ord) => (
                    <div key={ord.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-stone-900">Order #{ord.id} — {ord.full_name}</span>
                        <span className="block text-[11px] text-stone-500">{ord.items?.map(i => i.product_name).join(", ")}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getBadgeStyle(ord.status)}`}>
                        {ord.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 📦 TAB 3: INVENTORY STOCK MANAGER (Feature 4) */}
      {/* ========================================================================= */}
      {activeTab === "inventory" && (
        <div className="print:hidden space-y-4 animate-fadeIn">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-1">
            <h2 className="text-xl font-black text-stone-900">Bakery Inventory & Sold-Out Controller</h2>
            <p className="text-xs text-stone-500 font-medium">
              Quickly adjust available stock quantity or mark freshly baked goods as Out of Stock.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((product) => {
              const currentStock = Number(product.stock ?? 0);
              const isLowStock = currentStock <= 3 && currentStock > 0;
              const isOutOfStock = currentStock === 0;

              return (
                <div key={product.id} className="bg-white border-2 border-stone-200 rounded-2xl p-4 shadow-sm space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-display font-bold text-sm text-stone-900 truncate">{product.name}</h4>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${isOutOfStock
                        ? "bg-rose-100 text-rose-800 border-rose-300"
                        : isLowStock
                          ? "bg-amber-100 text-amber-900 border-amber-300"
                          : "bg-emerald-100 text-emerald-800 border-emerald-300"
                        }`}>
                        {isOutOfStock ? "Sold Out" : isLowStock ? "Low Stock" : "In Stock"}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">${Number(product.discounted_price || product.price || 0).toFixed(2)}</p>
                  </div>

                  {/* Stock Adjuster */}
                  <div className="flex items-center justify-between bg-stone-50 p-2 rounded-xl border border-stone-200">
                    <span className="text-xs font-bold text-stone-600">Units in Kitchen:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleToggleProductStock(product, currentStock - 1)}
                        disabled={stockUpdatingId === product.id || currentStock <= 0}
                        className="w-7 h-7 rounded-lg bg-stone-200 hover:bg-stone-300 font-black text-stone-700 flex items-center justify-center disabled:opacity-40"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-black text-sm text-stone-900">{currentStock}</span>
                      <button
                        onClick={() => handleToggleProductStock(product, currentStock + 1)}
                        disabled={stockUpdatingId === product.id}
                        className="w-7 h-7 rounded-lg bg-stone-200 hover:bg-stone-300 font-black text-stone-700 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🖨️ PRINTABLE KITCHEN SLIP (Only visible in Print Mode - Feature 3) */}
      {/* ========================================================================= */}
      {activePrintOrder && (
        <div className="hidden print:block p-8 bg-white text-black font-mono text-sm max-w-xl mx-auto border-4 border-black">
          <div className="text-center border-b-2 border-black pb-4 mb-4">
            <h2 className="text-2xl font-black uppercase tracking-widest">SALVATORE CAKES</h2>
            <p className="text-xs font-bold uppercase">Kitchen Bake Slip & Dispatch Invoice</p>
            <p className="text-[10px] mt-1 font-semibold">Est. 1864 • Tuscan Artisan Confectionery</p>
          </div>

          <div className="grid grid-cols-2 gap-2 border-b border-dashed border-black pb-3 mb-3 text-xs">
            <div><span className="font-bold">ORDER ID:</span> #{activePrintOrder.id}</div>
            <div className="text-right"><span className="font-bold">DATE:</span> {new Date(activePrintOrder.created_at).toLocaleDateString()}</div>
            <div>
              <span className="font-bold">DELIVERY:</span>{" "}
              {activePrintOrder.delivery_date ? new Date(activePrintOrder.delivery_date).toLocaleDateString() : "ASAP"}
            </div>
            <div className="text-right">
              <span className="font-bold">PAYMENT:</span> {activePrintOrder.payment_method?.toUpperCase() || "COD"}
            </div>
          </div>

          <div className="border-b border-dashed border-black pb-3 mb-4 text-xs">
            <p><span className="font-bold">CUSTOMER:</span> {activePrintOrder.full_name}</p>
            <p><span className="font-bold">PHONE:</span> {activePrintOrder.phone}</p>
            <p><span className="font-bold">ADDRESS:</span> {activePrintOrder.address_line}, {activePrintOrder.city} - {activePrintOrder.postal_code}</p>
          </div>

          <div className="border-b-2 border-black pb-4 mb-4">
            <h3 className="font-black text-sm uppercase mb-2">Bake Items:</h3>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-black">
                  <th className="py-1">QTY</th>
                  <th className="py-1">ITEM & DETAILS</th>
                  <th className="py-1 text-right">PRICE</th>
                </tr>
              </thead>
              <tbody>
                {activePrintOrder.items?.map((item) => (
                  <tr key={item.id} className="border-b border-stone-200">
                    <td className="py-2 font-black align-top">{item.quantity}x</td>
                    <td className="py-2 pr-2 font-bold">{item.product_name || item.product?.name}</td>
                    <td className="py-2 text-right align-top">${Number(item.subtotal || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {activePrintOrder.notes ? (
            <div className="bg-stone-100 border-2 border-black p-3 mb-4 text-xs font-black">
              <span className="block underline uppercase mb-1">⚠️ SPECIAL PIPING / ALLERGY INSTRUCTIONS:</span>
              <p className="text-sm italic font-sans font-bold">"{activePrintOrder.notes}"</p>
            </div>
          ) : (
            <div className="p-2 border border-stone-300 text-[11px] text-center text-stone-500 mb-4">
              No special piping or allergy notes provided.
            </div>
          )}

          <div className="text-right text-base font-black border-b-2 border-black pb-2 mb-4">
            TOTAL AMOUNT: ${Number(activePrintOrder.total_amount || 0).toFixed(2)}
          </div>

          <div className="text-center text-[10px] text-stone-600 font-bold uppercase tracking-wider space-y-1">
            <p>Handcrafted with Fine Stone-Ground Tuscan Ingredients</p>
            <p>House of Salvatore Bakery</p>
          </div>
        </div>
      )}
    </div>
  );
}