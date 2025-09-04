'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface CurrentAffair {
  _id: string;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
}

export default function CurrentAffairDetails() {
  const { slug } = useParams();
  const [data, setData] = useState<CurrentAffair | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentAffair = async () => {
      try {
        const res = await fetch('/api/admin/current-affairs');
        const allData: CurrentAffair[] = await res.json();

        const matched = allData.find((item) => item.slug === slug);
        setData(matched || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchCurrentAffair();
  }, [slug]);

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (!data) return <p className="text-center py-10">No content found.</p>;

  return (
    <div className="max-w-7xl mx-auto bg-slate-100 p-6 rounded-xl mt-5">
      <h1 className="text-2xl md:text-3xl font-bold text-[#00072c] mb-6">
        {data.title}
      </h1>
      <div
        className="prose max-w-none text-blue-950 text-base md:text-lg"
        dangerouslySetInnerHTML={{ __html: data.content }}
      />
    </div>
  );
}
