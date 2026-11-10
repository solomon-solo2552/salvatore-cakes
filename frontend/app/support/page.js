"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import EmptyState from "@/components/EmptyState";

export default function SupportPage() {
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState({
    subject: "",
    category: "general",
    order_id: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchComplaints = async () => {
    try {
      const res = await api.get("/complaints/");
      setComplaints(res.data.results || res.data || []);
    } catch (err) {
      console.error("Error fetching support tickets:", err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/complaints/", form);
      setForm({ subject: "", category: "general", order_id: "", message: "" });
      fetchComplaints();
      toast.success("Message submitted - we'll review it shortly.");
    } catch (err) {
      toast.error("Failed to submit inquiry.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-stone-900">Customer Care & Feedback</h1>
        <p className="text-sm text-stone-600">Have a question, feedback, or an issue with your cake? Let us know.</p>
      </div>

      {/* SUBMISSION FORM */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-stone-800">Submit a Complaint or Inquiry</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Subject</label>
            <input
              required
              type="text"
              placeholder="e.g. Cake arrived damaged"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl text-sm bg-stone-50"
            >
              <option value="delivery">Delivery / Delay</option>
              <option value="quality">Cake Quality / Taste</option>
              <option value="damage">Damaged Packaging</option>
              <option value="billing">Payment / Refund</option>
              <option value="custom_order">Custom Cake Inquiry</option>
              <option value="general">General Feedback</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Order ID (Optional)</label>
          <input
            type="text"
            placeholder="e.g. #1042"
            value={form.order_id}
            onChange={(e) => setForm({ ...form, order_id: e.target.value })}
            className="w-full sm:w-1/2 px-3 py-2 border rounded-xl text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Detailed Message</label>
          <textarea
            required
            rows={4}
            placeholder="Please describe what happened..."
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full px-3 py-2 border rounded-xl text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition"
        >
          {submitting ? "Sending..." : "Submit Inquiry"}
        </button>
      </form>

      {/* RECENT USER TICKETS */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-stone-900">Your Past Inquiries</h2>
        {complaints.length === 0 ? (
          <EmptyState
            icon="💬"
            title="No support tickets yet"
            description="When you submit an inquiry, your tickets and our team's responses will appear here."
          />
        ) : (
          complaints.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-2xl border border-stone-200 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-stone-900">{item.subject}</span>
                <span className="text-xs uppercase px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-900">
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-stone-700">{item.message}</p>

              {/* ADMIN REPLY SECTION */}
              {item.admin_reply && (
                <div className="bg-stone-50 border-l-4 border-amber-600 p-3 rounded-r-xl text-xs space-y-1">
                  <span className="font-bold text-stone-900 block">Staff Response:</span>
                  <p className="text-stone-700 italic">{item.admin_reply}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}