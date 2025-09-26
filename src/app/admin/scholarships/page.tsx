"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/component/admin/AdminLayout";
import { Trash2, Eye } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmDialog from "@/component/admin/ConfirmDialog";

interface Scholarship {
  _id: string;
  name: string;
  phone: string;
  email: string;
  course: string;
  message: string;
  createdAt: string;
}

export default function ScholarshipPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Confirm dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmBtnText, setConfirmBtnText] = useState("Confirm");
  const [confirmAction, setConfirmAction] = useState<() => void>(() => { });

  // View message modal state
  const [viewMessageOpen, setViewMessageOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");

  // Fetch scholarships from API
  const fetchScholarships = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/scholarship");
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to fetch scholarships");
        return;
      }

      setScholarships(data.data || data);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to fetch scholarships");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, []);

  // Confirm dialog delete
  const handleDeleteScholarship = (id: string) => {
    setConfirmTitle("Delete this scholarship?");
    setConfirmMessage("This action cannot be undone.");
    setConfirmBtnText("Delete");
    setConfirmAction(() => async () => {
      try {
        const res = await fetch(`/api/admin/scholarship/${id}`, { method: "DELETE" });
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message || "Failed to delete scholarship");
          return;
        }

        fetchScholarships(); // Refresh list
        toast.success("Scholarship deleted successfully!");
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete scholarship");
      } finally {
        setConfirmOpen(false);
      }
    });
    setConfirmOpen(true);
  };

  // View message modal
  const handleViewMessage = (message: string) => {
    setCurrentMessage(message);
    setViewMessageOpen(true);
  };

  // Pagination helpers
  const totalPages = Math.ceil(scholarships.length / itemsPerPage);
  const paginatedData = scholarships.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Scholarships Enquiry</h1>

      <div className="bg-white p-6 rounded-2xl shadow-lg">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : scholarships.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <svg
              className="w-16 h-16 text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-4h6v4M12 3v4m-6 4h12" />
            </svg>
            <p className="text-gray-500 text-lg font-medium">No scholarship entries found.</p>
            <p className="text-gray-400 text-sm mt-1">Once users submit applications, they will appear here.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-2xl shadow-lg overflow-hidden">
                <thead className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wide font-semibold">
                  <tr>
                    <th className="py-4 px-5 text-left border-b border-gray-200">Scholarship </th>
                    <th className="py-4 px-5 text-left border-b border-gray-200">Name</th>
                    <th className="py-4 px-5 text-left border-b border-gray-200">Phone</th>
                    <th className="py-4 px-5 text-left border-b border-gray-200">Email</th>
                    <th className="py-4 px-5 text-left border-b border-gray-200">Course</th>
                    <th className="py-4 px-5 text-center border-b border-gray-200">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800 text-sm">
                  {paginatedData.map((s) => (
                    <tr key={s._id} className="hover:bg-gray-50 border-b border-gray-200">
                      <td className="py-3 px-5">{s.scholarship}</td>
                      <td className="py-3 px-5">{s.name}</td>
                      <td className="py-3 px-5">{s.phone}</td>
                      <td className="py-3 px-5">{s.email}</td>
                      <td className="py-3 px-5">{s.course}</td>
                      <td className="py-3 px-5 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleViewMessage(s.message)}
                            className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
                            title="View Message"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteScholarship(s._id)}
                            className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-end items-center mt-4 space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md font-medium ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-md font-medium ${
                    currentPage === i + 1
                      ? "bg-[#e94e4e] text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md font-medium ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        title={confirmTitle}
        message={confirmMessage}
        confirmText={confirmBtnText}
        cancelText="Cancel"
        onConfirm={confirmAction}
        onCancel={() => setConfirmOpen(false)}
      />

      {/* View Message Modal */}
      {viewMessageOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn bg-black/40">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 relative transform transition-transform scale-95 animate-scaleIn">
            <button
              onClick={() => setViewMessageOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold text-2xl transition"
              aria-label="Close modal"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Message</h2>

            <div className="max-h-96 overflow-y-auto">
              <p className="text-gray-700 whitespace-pre-wrap text-base">{currentMessage}</p>
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={() => setViewMessageOpen(false)}
                className="px-6 py-2 bg-[#FF0000] text-white rounded shadow-md transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
