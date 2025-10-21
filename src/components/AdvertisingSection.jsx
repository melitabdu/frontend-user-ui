import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdvertisingSection.css';

const AdvertisingSection = () => {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // ✅ Create an axios instance that uses the backend base URL
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
  });

  const fetchVideos = async (pageNum = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/advideos?page=${pageNum}`);
      if (pageNum === 1) {
        setVideos(res.data.videos);
      } else {
        setVideos((prev) => [...prev, ...res.data.videos]);
      }
      setTotalPages(res.data.totalPages);
      setPage(res.data.page);
    } catch (err) {
      console.error('Failed to load videos:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const renderEmbed = (video) => {
    if (video.platform === 'youtube') {
      let videoId = '';

      if (video.videoUrl.includes('v=')) {
        videoId = video.videoUrl.split('v=')[1]?.split('&')[0];
      } else if (video.videoUrl.includes('shorts/')) {
        videoId = video.videoUrl.split('shorts/')[1]?.split('?')[0];
      } else if (video.videoUrl.includes('youtu.be/')) {
        videoId = video.videoUrl.split('youtu.be/')[1]?.split('?')[0];
      }

      return (
        <iframe
          width="100%"
          height="200"
          loading="lazy"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    } else if (video.platform === 'tiktok') {
      return (
        <blockquote
          className="tiktok-embed"
          cite={video.videoUrl}
          data-video-id=""
          style={{ width: '100%', height: 'auto' }}
        >
          <section>
            <a target="_blank" rel="noopener noreferrer" href={video.videoUrl}>
              በTikTok ይመልከቱ
            </a>
          </section>
        </blockquote>
      );
    }
    return null;
  };

  return (
    <section className="advertising-section">
      <h2 className="section-title">የማስታወቂያ ቪዲዮዎች</h2>
      <div className="video-grid">
        {videos.map((video) => (
          <div key={video._id} className="video-card">
            <h4>{video.title}</h4>
            {renderEmbed(video)}
          </div>
        ))}
      </div>
      {page < totalPages && (
        <button
          onClick={() => fetchVideos(page + 1)}
          disabled={loading}
          className="load-more-btn"
        >
          {loading ? 'በማስገባት...' : 'ተጨማሪ ቪዲዮዎች አስገባ'}
        </button>
      )}
    </section>
  );
};

export default AdvertisingSection;
