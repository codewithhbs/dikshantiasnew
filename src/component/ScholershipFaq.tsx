"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

interface FaqItem {
  id: number;
  title: string;
  content: string[];
}

export default function ScholershipFaq() {
  const { t } = useTranslation("common");
  const [active, setActive] = useState<number | null>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // ✅ loading state

  const faqs: FaqItem[] =
    (t("scholarshipDetails.faq", { returnObjects: true }) as FaqItem[]) || [];

  const applyNowText = t("scholarshipDetails.applyNow");

  const toggleAccordion = (id: number) => {
    setActive(active === id ? null : id);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // ✅ Form Submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.currentTarget;
    const formData = {
      name: (form[0] as HTMLInputElement).value,
      phone: (form[1] as HTMLInputElement).value,
      email: (form[2] as HTMLInputElement).value,
      course: (form[3] as HTMLInputElement).value,
      message: (form[4] as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/admin/scholarship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message || "Application submitted successfully!");
        form.reset();
        closeModal();
      } else {
        toast.error(data.message || "Failed to submit");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-2 md:p-0">
      {Array.isArray(faqs) &&
        faqs.map((faq) => (
          <div key={faq.id} className="mb-2 bg-[#ecf4fc] rounded-lg">
            <button
              onClick={() => toggleAccordion(faq.id)}
              className="w-full text-md flex justify-between items-center text-left px-4 py-3 font-semibold text-slate-900"
            >
              {faq.title}
              {active === faq.id ? (
                <ChevronUp size={30} />
              ) : (
                <ChevronDown size={30} />
              )}
            </button>

            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                active === faq.id ? "max-h-screen" : "max-h-0"
              }`}
            >
              {active === faq.id && (
                <div className="text-md text-[#040c33] px-4 pb-4 text-left">
                  <p className="text-blue-950">{faq.content[0]}</p>

                  {faq.content.length > 1 && (
                    <ul className="list-disc pl-6 mt-2 text-blue-950">
                      {faq.content.slice(1).map((item, idx) => (
                        <li key={idx}>
                          <em>{item}</em>
                        </li>
                      ))}
                    </ul>
                  )}

                  <button
                    onClick={openModal}
                    className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    {applyNowText}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

      {/* ✅ Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center border-2">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full relative animate-fadeIn overflow-hidden">
            <div className="bg-[#E7000B] text-white p-6 relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white text-red-600 hover:bg-gray-200 hover:text-red-700 shadow-md transition"
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold mb-1">{applyNowText}</h2>
              <p className="text-white text-opacity-90">
                Fill in the details below to apply for the scholarship.
              </p>
            </div>

            {/* ✅ Use handleSubmit here */}
            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <input
                type="text"
                placeholder="Full Name"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#E7000B] focus:border-transparent shadow-sm"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#E7000B] focus:border-transparent shadow-sm"
              />
              <input
                type="email"
                placeholder="Email Address"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#E7000B] focus:border-transparent shadow-sm"
              />
              <input
                type="text"
                placeholder="Course"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#E7000B] focus:border-transparent shadow-sm"
              />
              <textarea
                placeholder="Message"
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#E7000B] focus:border-transparent shadow-sm"
              />

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2 rounded bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-all shadow-sm"
                  disabled={isLoading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-5 py-2 rounded text-white font-semibold transition-all shadow-md ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#E7000B] hover:bg-[#c6000a]"
                  }`}
                >
                  {isLoading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
