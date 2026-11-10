"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [replies, setReplies] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    try {
      const res = await api.get("/complaints/");
      setComplaints(res.data.results || res.data || []);
    } catch (err) {
      console.error("Error loading complaints:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleReplyChange = (id, text) => {
    setReplies((prev) => ({ ...prev, [id]: text }));
  };

  const handleSendReply = async (id, status = "resolved") => {
    try {
      await api.patch(`/complaints/${id}/`, {
        admin_reply: replies[id] || "",
        status: status,
      });
      toast.success("Reply recorded and ticket updated.");
      fetchComplaints();
    } catch (err) {
      toast.error("Failed to send reply.");
    }
  };

  if (loading) return <p className="p-8 text-stone-500 font-bold">Loading support requests...</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-2xl font-bold text-stone-900">Support & Feedback Management</h1>

      <div className="space-y-4">
        {complaints.length === 0 ? (
          <p className="text-sm text-stone-500">No support tickets currently open.</p>
        ) : (
          complaints.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <span className="text-xs uppercase font-bold text-amber-800">{item.category}</span>
                  <h3 className="text-base font-bold text-stone-900">{item.subject}</h3>
                  <p className="text-xs text-stone-500">From: {item.username} ({item.user_email}) {item.order_id && `• Order: #${item.order_id}`}</p>
                </div>
                <span className="text-xs uppercase font-bold px-3 py-1 bg-stone-100 rounded-full border">
                  {item.status}
                </span>
              </div>

              <p className="text-sm text-stone-800 bg-stone-50 p-3 rounded-xl">{item.message}</p>

              {/* ADMIN REPLY BOX */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-stone-600">Admin Response</label>
                <textarea
                  rows={2}
                  placeholder="Type your resolution or reply to the customer..."
                  defaultValue={item.admin_reply || ""}
                  onChange={(e) => handleReplyChange(item.id, e.target.value)}
                  className="w-full p-3 border rounded-xl text-xs bg-stone-50 focus:bg-white"
                />
                
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleSendReply(item.id, "in_progress")}
                    className="px-4 py-1.5 border border-stone-300 text-stone-700 text-xs font-bold rounded-lg hover:bg-stone-50"
                  >
                    Mark In Progress
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendReply(item.id, "resolved")}
                    className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm"
                  >
                    Send Reply & Resolve ✓
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}