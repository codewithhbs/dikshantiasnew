'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import parse from 'html-react-parser';

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

        const pageData = data.find(p => p.slug === slug);
        setCurrentPage(pageData || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, [slug]);

  if (loading) return <p>Loading...</p>;
  if (!currentPage) return <p>Page not found</p>;

  return (
    <>
      <head>
        <title>{currentPage.metaTitle}</title>
        <meta name="description" content={currentPage.metaDescription} />
      </head>

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">{currentPage.title}</h1>
        <div className="text-gray-800">{parse(currentPage.content)}</div>
      </div>
    </>
  );
};

export default PageDetail;
