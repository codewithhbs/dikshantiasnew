'use client';

import React from 'react';
import { X } from 'lucide-react';

function decodeHtml(html?: string): string {
  if (!html) return '';
  return html
    .replace(/\\u003C/g, '<')
    .replace(/\\u003E/g, '>')
    .replace(/\\u0026/g, '&')
    .replace(/&ndash;/g, '–')
    .replace(/&lsquo;/g, '‘')
    .replace(/&rsquo;/g, '’')
    .replace(/&nbsp;/g, ' ');
}

interface HinduDetailsProps {
  title: string;
  content?: string;
  onClose?: () => void;
}

const HinduDetails: React.FC<HinduDetailsProps> = ({ title, content, onClose }) => {
  const decodedContent = decodeHtml(content);

  return (
    <div className="bg-[#F1F5F9] shadow-lg rounded-2xl p-6 md:p-10 max-w-6xl mx-auto relative">
      {/* Header with title + close */}
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-[#00072c]">
          {title}
        </h1>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-red-100 transition duration-200"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-red-500" />
          </button>
        )}
      </div>

      {/* Body */}
      {decodedContent ? (
        <div
          className="prose max-w-none text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: decodedContent }}
        />
      ) : (
        <p className="text-gray-500 italic">No content available.</p>
      )}
    </div>
  );
};

export default HinduDetails;
