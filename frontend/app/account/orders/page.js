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
        <div className="card p-4 mb-8 border-gold/50 bg-gold/10">
          Order #{placedId} placed successfully — we'll start baking soon!
        </div>
      )}

      {fetching ? (
        <p className="text-cocoa/60">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-cocoa/60">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-display text-lg text-espresso">Order #{order.id}</span>
                <span className="text-xs uppercase tracking-wide px-3 py-1 rounded-full bg-espresso/10 text-espresso">
                  {order.status.replace(/_/g, " ")}
                </span>
              </div>
              <ul className="text-sm text-cocoa/70 mb-3">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.product_name} × {item.quantity} — ${Number(item.subtotal).toFixed(2)}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between text-sm text-cocoa/60">
                <span>{new Date(order.created_at).toLocaleDateString()}</span>
                <span className="font-semibold text-espresso">
                  Total: ${Number(order.total_amount).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
