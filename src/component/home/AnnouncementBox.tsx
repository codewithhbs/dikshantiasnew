'use client'

import React, { useState, useEffect } from 'react';

interface Announcement {
  _id: string;
  title: string;
  bgcolor: string;
  active: boolean;
}

const AnnouncementBox: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch announcements from API
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/admin/announcements');
        const data = await res.json();
        if (data.success) {
          setAnnouncements(data.data.filter((item: Announcement) => item.active));
        }
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  // Skeleton loader
  const renderSkeleton = () => (
    <div className="absolute w-full">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className="flex items-center px-4 py-3 rounded-xl my-2 bg-gray-300 animate-pulse"
        >
          <div className="w-5 h-5 bg-gray-400 rounded-full mr-2"></div>
          <div className="h-6 bg-gray-400 rounded w-3/4"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full mx-auto rounded-xl overflow-hidden">
      <h3 className="text-xl md:text-3xl font-bold mb-4 text-[#040c33] md:hidden lg:hidden xl:hidden pl-2 md:pl-0">
        New <span className="text-[#f43144]">Announcement</span>
      </h3>

      {/* Important Banner */}
      <div className="bg-blue-900 text-white text-center py-3 md:px-30 hidden md:block lg:block xl:block">
        <span className="text-sm font-bold bg-white text-red-600 px-3 py-1 rounded-sm ">
          IMPORTANT ANNOUNCEMENT
        </span>
      </div>

      {/* Scrolling Content Container */}
      <div
        className="h-35 md:h-81 overflow-hidden relative cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {loading ? (
          renderSkeleton()
        ) : (
          <div className={`absolute w-full transition-all duration-300 ${isHovered ? '' : 'animate-scroll'}`}>
            {[...announcements, ...announcements].map((announcement: Announcement, index: number) => (
              <div
                key={announcement._id + '-' + index}
                className={`px-4 py-3 border-slate-50 rounded-xl my-2 ${announcement.bgcolor}`}
              >
                <div className="flex items-center">
                  <span className="text-red-600 mr-2 mt-1 flex-shrink-0">📢</span>
                  <div className="text-sm font-bold text-white leading-tight">{announcement.title}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom CSS for animation */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AnnouncementBox;
