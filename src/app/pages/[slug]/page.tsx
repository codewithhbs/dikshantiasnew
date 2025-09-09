'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import parse from 'html-react-parser';
import Head from 'next/head';

// Skeleton component
const Skeleton = () => (
  <div className="max-w-5xl mx-auto p-6 animate-pulse">
    <div className="h-8 w-1/3 bg-gray-300 rounded mb-6"></div>
    <div className="space-y-4">
      <div className="h-4 w-full bg-gray-200 rounded"></div>
      <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
      <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
      <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
    </div>
  </div>
);

interface Page {
  _id: string;
  title: string;
  slug: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
}

const PageDetail = () => {
  const params = useParams();
  const { slug } = params;

  const [pages, setPages] = useState<Page[]>([]);
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await fetch('/api/admin/pages');
        const data: Page[] = await res.json();
        setPages(data);

        const pageData = data.find((p) => p.slug === slug);
        setCurrentPage(pageData || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, [slug]);

  if (loading) return <Skeleton />;
  if (!currentPage)
    return (
      <div className="max-w-5xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-700">Page not found</h2>
        <p className="text-gray-500 mt-2">
          The page you’re looking for doesn’t exist or has been removed.
        </p>
      </div>
    );

  return (
    <>
      <Head>
        <title>{currentPage.metaTitle}</title>
        <meta name="description" content={currentPage.metaDescription} />
      </Head>

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">
          {currentPage.title}
        </h1>
        <div className="prose prose-lg max-w-none text-gray-800">
          {parse(currentPage.content)}
        </div>
      </div>
    </>
  );
};

export default PageDetail;
