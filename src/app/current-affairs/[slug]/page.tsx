'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import HinduDetails from '../HinduDetails';

interface Card {
  _id: string;
  title: string;
  slug: string;
  date: string;
  month: string;
  year: string;
  bgColor?: string;
  dateColor?: string;
  content?: string;
}

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
}

interface CurrentAffairItem {
  _id: string;
  title: string;
  slug: string;
  affairDate: string;
  content?: string;
  subCategory?: string | { _id: string };
}

// Skeleton Card
const SkeletonCard = () => (
  <div className="animate-pulse bg-gray-100 rounded-lg border border-gray-200 overflow-hidden">
    <div className="p-4 md:p-6 flex gap-4">
      <div className="bg-gray-300 rounded-md px-3 py-4 flex-shrink-0 min-w-[60px]" />
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  </div>
);

const ReadInHindu: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCard, setActiveCard] = useState<Card | null>(null);

  const params = useParams();
  const subCategorySlug = params?.slug as string | undefined;

  // 🎨 Color palettes
  const bgColors = [
    'bg-[#DBEAFE]', // light blue
    'bg-[#CEFAFE]', // cyan
    'bg-[#D0FAE5]', // mint
    'bg-[#FEF9C2]', // yellow 
    'bg-[#FFEDD4]', // peach
    'bg-[#FFE2E2]', // pink
  ];

  const dateColors = [
    'bg-[#BFDBFE]',
    'bg-[#A5F3FC]',
    'bg-[#A7F3D0]',
    'bg-[#FEF08A]',
    'bg-[#FED7AA]',
    'bg-[#FCA5A5]',
  ];

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const subRes = await fetch('/api/admin/sub-categories');
        const subcategories: SubCategory[] = await subRes.json();

        const subCategory = subcategories.find(
          (sub) => sub.slug === subCategorySlug
        );
        if (!subCategory) return setLoading(false);

        const res = await fetch('/api/admin/current-affairs');
        const data = await res.json();

        const filteredData = data.filter((item: CurrentAffairItem) => {
          const subId =
            typeof item.subCategory === 'string'
              ? item.subCategory
              : item.subCategory?._id;
          return subId === subCategory._id;
        });

        const formattedCards: Card[] = filteredData.map(
          (item: CurrentAffairItem, index: number): Card => {
            const bgColor = bgColors[index % bgColors.length];
            const dateColor = dateColors[index % dateColors.length];

            return {
              _id: item._id,
              title: item.title,
              slug: item.slug,
              content: item.content || '',
              date: new Date(item.affairDate).getDate().toString(),
              month: new Date(item.affairDate).toLocaleString('default', {
                month: 'short',
              }),
              year: new Date(item.affairDate).getFullYear().toString(),
              bgColor,
              dateColor,
            };
          }
        );

        setCards(formattedCards);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (subCategorySlug) fetchCards();
  }, [subCategorySlug]);

  if (loading) {
    return (
      <div className="bg-white p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!cards.length) return <p className="text-center py-10">No data found.</p>;

  if (activeCard) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-6">
        <HinduDetails
          title={activeCard.title}
          content={activeCard.content}
          onClose={() => setActiveCard(null)}
        />
      </div>
    );
  }

  return (
    <>
      <div className="container max-w-7xl mx-auto -mt-14 md:mt-3 my-4 px-2 md:px-0">
        <Image
          src="/img/current-affairs-banner.webp"
          width={1920}
          height={500}
          alt="Current Affairs Banner"
          className="rounded-xl"
        />
      </div>

      <div className="bg-white p-4 md:p-6 lg:p-8 mb-5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {cards.map((card) => (
              <div
                key={card._id}
                className={`${card.bgColor} rounded-lg border border-gray-200 overflow-hidden`}
              >
                <div className="p-4 md:p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`${card.dateColor} rounded-md px-3 py-2 flex-shrink-0 text-center min-w-[60px]`}
                    >
                      <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                        {card.month}
                      </div>
                      <div className="text-2xl md:text-3xl font-bold text-[#00072c] leading-none">
                        {card.date}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {card.year}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm md:text-base font-semibold text-[#00072c] leading-tight mb-3 line-clamp-2">
                        {card.title}
                      </h3>
                      <button
                        onClick={() => setActiveCard(card)}
                        className="text-red-600 hover:text-red-700 text-xs md:text-sm font-medium uppercase tracking-wide transition-colors duration-200 flex items-center gap-1"
                      >
                        VIEW DETAILS
                        <svg
                          className="w-3 h-3 md:w-4 md:h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReadInHindu;
