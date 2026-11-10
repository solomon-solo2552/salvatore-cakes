"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import api from "@/lib/api";

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const searchParams = useSearchParams();
  const placedId = searchParams.get("placed");
  const [orders, setOrders] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) return;
    api
      .get("/orders/")
      .then((res) => setOrders(res.data.results || res.data))
      .finally(() => setFetching(false));
  }, [user]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "baking":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "finished":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "packed":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "out_for_delivery":
        return "bg-teal-100 text-teal-800 border-teal-200";
      case "delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "received":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-espresso/10 text-espresso border-espresso/20";
    }
  };

  const renderPaymentInstructions = (order) => {
    const method = order.payment_method?.toLowerCase();

    if (method === "upi") {
      return (
        <div className="bg-amber-50/80 border border-amber-300/80 rounded-2xl p-4 space-y-2 text-xs text-amber-950">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <span>📱</span>
            <span>UPI Payment Details</span>
          </div>
          <p className="font-medium text-amber-900/80">
            Please transfer <strong>${Number(order.total_amount).toFixed(2)}</strong> to our official VPA address:
          </p>
          <div className="bg-white px-3 py-1.5 rounded-lg border border-amber-200 inline-block font-mono font-black text-espresso">
            salvatorecakes@upi
          </div>
          <p className="text-[10px] text-amber-800/70 font-semibold">
            Include Order #{order.id} in your payment remark for auto-verification.
          </p>
        </div>
      );
    }

    if (method === "card") {
      return (
        <div className="bg-emerald-50/80 border border-emerald-300/80 rounded-2xl p-4 space-y-1 text-xs text-emerald-950">
          <div className="flex items-center gap-2 font-bold text-emerald-900">
            <span>💳</span>
            <span>Card Payment Authorized</span>
          </div>
          <p className="font-medium text-emerald-900/80">
            Your credit/debit card authorization was confirmed for Order #{order.id}.
          </p>
        </div>
      );
    }

    return (
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-1 text-xs text-espresso">
        <div className="flex items-center gap-2 font-bold text-espresso">
          <span>💵</span>
          <span>Cash on Delivery</span>
        </div>
        <p className="font-medium text-espresso/70">
          Please keep exact cash of <strong>${Number(order.total_amount).toFixed(2)}</strong> ready at the time of delivery.
        </p>
      </div>
    );
  };

  if (loading) return null;

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-espresso mb-4">Log in to view your orders</h1>
        <a href="/login" className="btn-primary">Log in</a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl text-espresso mb-8">Your Orders</h1>

      {placedId && (
        <div className="card p-4 mb-8 border-gold/50 bg-gold/10 font-medium text-espresso text-sm">
          ✨ Order #{placedId} placed successfully — we'll start baking soon!
        </div>
      )}

      {fetching ? (
        <p className="text-cocoa/60">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-cocoa/60">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="card p-5 space-y-4 border border-espresso/15 rounded-2xl bg-white shadow-sm">
              {/* Header & Status Badge */}
              <div className="flex items-center justify-between border-b border-espresso/10 pb-3">
                <span className="font-display text-lg text-espresso font-bold">Order #{order.id}</span>
                <span
                  className={`text-xs uppercase font-bold tracking-wide px-3 py-1 rounded-full border ${getStatusBadgeClass(
                    order.status
                  )}`}
                >
                  {order.status?.replace(/_/g, " ")}
                </span>
              </div>

              {/* Arrival & Payment Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-espresso/5 p-3 rounded-xl">
                <div>
                  <span className="text-cocoa/50 block font-bold uppercase text-[9px]">Arrival Date</span>
                  <span className="font-semibold text-espresso">
                    {order.delivery_date
                      ? new Date(order.delivery_date).toLocaleDateString()
                      : "Standard Delivery"}
                  </span>
                </div>
                <div>
                  <span className="text-cocoa/50 block font-bold uppercase text-[9px]">Payment Method</span>
                  <span className="font-bold text-espresso uppercase">
                    {order.payment_method ? order.payment_method.toUpperCase() : "COD"}
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-cocoa/50 block font-bold uppercase text-[9px]">Placed On</span>
                  <span className="font-semibold text-espresso">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* DEDICATED PAYMENT METHOD INSTRUCTIONS */}
              {renderPaymentInstructions(order)}

              {/* Ordered Items List */}
              <ul className="text-sm text-cocoa/70 space-y-3">
                {order.items?.map((item) => (
                  <li key={item.id} className="border-b border-dashed border-espresso/10 pb-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-espresso">
                        {item.product_name || item.product?.name} × {item.quantity}
                      </span>
                      <span className="font-bold text-espresso">
                        ${Number(item.subtotal || item.unit_price * item.quantity || 0).toFixed(2)}
                      </span>
                    </div>

                    {/* Show Review button only if order status is delivered */}
                    {order.status === "delivered" && (
                      <div className="flex justify-end">
                        <a
                          href={`/reviews/new?product_id=${item.product || item.product_id}&order_id=${order.id}`}
                          className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded-lg transition shadow-sm"
                        >
                          ★ Rate This Cake
                        </a>
                      </div>
                    )}
                  </li>
                ))}
              </ul>

              {/* Order Total */}
              <div className="flex items-center justify-end text-sm text-cocoa/60 pt-2 border-t border-espresso/10">
                <span className="font-display text-xl text-espresso font-bold">
                  Total: ${Number(order.total_amount || order.total || 0).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}