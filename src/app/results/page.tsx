"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface Topper {
  _id: string
  name: string
  service: string
  year: string
  rank: string
  image: { url: string }
}

export default function ResultsPage() {
  const [toppers, setToppers] = useState<Topper[]>([])
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(6)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch("/api/admin/results")
        const data = await res.json()
        const activeResults = data.filter((item: Topper & { active: boolean }) => item.active)
        setToppers(activeResults)
      } catch (err) {
        console.error("Error fetching results:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [])

  const showMore = () => {
    setVisibleCount((prev) => prev + 6)
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">All Results</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {toppers.slice(0, visibleCount).map((topper) => (
              <div key={topper._id} className="text-center bg-[#040c33] border border-[#000622] py-8 rounded-2xl">
                <div className="relative inline-block mb-4">
                  <div className="w-28 h-28 rounded-full overflow-hidden border-2 md:border-3 border-orange-400 mx-auto">
                    <Image
                      src={topper.image?.url || "/placeholder.svg"}
                      alt={topper.name}
                      width={112}
                      height={112}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {topper.rank}
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-1">{topper.name}</h3>
                <p className="text-white/80 font-medium mb-1">{topper.service}</p>
                <p className="text-orange-300 text-sm">{topper.year}</p>
              </div>
            ))}
          </div>

          {visibleCount < toppers.length && (
            <div className="flex justify-center mt-6">
              <button
                onClick={showMore}
                className="px-6 py-2 bg-[#a50309] text-white rounded-md hover:bg-[#c70b1b] transition-colors"
              >
                Show More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
