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

export default function ScholarshipFaq() {
  const { t } = useTranslation("common");
  const [active, setActive] = useState<number | null>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState<string | null>(null);

  const faqsRaw = t("scholarshipDetails.faq", { returnObjects: true });
  const faqs: FaqItem[] = Array.isArray(faqsRaw) ? (faqsRaw as FaqItem[]) : [];
  const applyNowText = t("scholarshipDetails.applyNow");

  const toggleAccordion = (id: number) => setActive(active === id ? null : id);
const openModal = (scholarshipKey: string) => {
  setSelectedScholarship(scholarshipKey);
  setIsModalOpen(true);
};
  const closeModal = () => setIsModalOpen(false);

const scholarshipShortMap = t("scholarshipShortMap", { returnObjects: true }) as Record<string, string>;



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.currentTarget;
    const shortScholarship = scholarshipShortMap[selectedScholarship || ""] || selectedScholarship;

    const formData = {
      name: (form["name"] as HTMLInputElement).value,
      phone: (form["phone"] as HTMLInputElement).value,
      email: (form["email"] as HTMLInputElement).value,
      course: (form["course"] as HTMLInputElement).value,
      message: (form["message"] as HTMLTextAreaElement).value,
      scholarship: shortScholarship,
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
    <div className="max-w-7xl mx-auto px-4 md:px-0">
      {/* FAQ Accordion */}
      {faqs.map((faq) => (
        <div key={faq.id} className="mb-3 bg-[#f0f4f8] rounded-lg shadow-sm">
          <button
            onClick={() => toggleAccordion(faq.id)}
            className="w-full flex justify-between items-center text-left px-5 py-3 font-semibold text-gray-900 hover:bg-gray-100 rounded-t-lg"
          >
            {faq.title}
            {active === faq.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </button>

          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              active === faq.id ? "max-h-screen" : "max-h-0"
            }`}
          >
            {active === faq.id && (
              <div className="px-5 pb-4 text-gray-700">
                <p>{faq.content[0]}</p>
                {faq.content.length > 1 && (
                  <ul className="list-disc pl-6 mt-2">
                    {faq.content.slice(1).map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                )}
              <button
                onClick={() => openModal(faq.key)}   // use key, not title
                className="mt-4 bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
              >
                {applyNowText}
              </button>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full relative animate-fadeIn overflow-hidden">
            <div className="bg-red-600 text-white p-6 relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white text-red-600 hover:bg-gray-200 hover:text-red-700 shadow transition"
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold mb-1">{applyNowText}</h2>
              <p className="text-white text-opacity-90">Fill in the details below to apply for the scholarship.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-6">
            <div className="inline-block rounded-md px-3 py-1 bg-red-100 text-red-600 font-medium text-sm border border-red-600 shadow-sm">
  {scholarshipShortMap[selectedScholarship || ""]}
</div>
<input
  type="hidden"
  name="scholarship"
  value={scholarshipShortMap[selectedScholarship || ""]}
/>
              <input
                name="name"
                type="text"
                placeholder="Full Name"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:outline-none focus:ring-1 focus:ring-red-600"
              />
              <input
                name="phone"
                type="tel"
                placeholder="Phone Number"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:outline-none focus:ring-1 focus:ring-red-600"
              />
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:outline-none focus:ring-1 focus:ring-red-600"
              />
              <input
                name="course"
                type="text"
                placeholder="Course"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:outline-none focus:ring-1 focus:ring-red-600"
              />
              <textarea
                name="message"
                placeholder="Message"
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:outline-none focus:ring-1 focus:ring-red-600"
              />

              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2 rounded bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-5 py-2 rounded text-white font-semibold transition-shadow shadow-md ${
                    isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
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
