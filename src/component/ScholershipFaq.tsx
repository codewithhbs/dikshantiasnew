'use client'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface FaqItem {
  id: number
  title: string
  content: string[]
}

export default function ScholershipFaq() {
  const { t } = useTranslation('common')
  const [active, setActive] = useState<number | null>(1)

  // ✅ Define faqs inside the component
  const faqs: FaqItem[] = (t('scholarshipDetails.faq', { returnObjects: true }) as FaqItem[]) || []

  const applyNowText = t('scholarshipDetails.applyNow')

  const toggleAccordion = (id: number) => {
    setActive(active === id ? null : id)
  }

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
              {active === faq.id ? <ChevronUp size={30} /> : <ChevronDown size={30} />}
            </button>

            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                active === faq.id ? 'max-h-screen' : 'max-h-0'
              }`}
            >
              {active === faq.id && (
                <div className="text-md text-[#040c33] px-4 pb-4 text-left">
                  {/* First item as paragraph */}
                  <p className="text-blue-950">{faq.content[0]}</p>

                  {/* Rest as list */}
                  {faq.content.length > 1 && (
                    <ul className="list-disc pl-6 mt-2 text-blue-950">
                      {faq.content.slice(1).map((item, idx) => (
                        <li key={idx}>
                          <em>{item}</em>
                        </li>
                      ))}
                    </ul>
                  )}

                  <button className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                    {applyNowText}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
  )
}
