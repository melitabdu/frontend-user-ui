import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdvertisingSection.css';

const AdvertisingSection = () => {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // ✅ Fetch videos safely
  const fetchVideos = async (pageNum = 1) => {
    setLoading(true);
    setMessage('');
    try {
      const res = await axios.get(`${API_BASE_URL}/api/advideos?page=${pageNum}`);

      // ✅ Flexible response parsing
      const result = res.data;
      const videoList =
        result?.videos || result?.data?.videos || result?.data || [];

      if (!Array.isArray(videoList)) {
        throw new Error('Unexpected API response format');
      }

      if (pageNum === 1) {
        setVideos(videoList);
      } else {
        setVideos((prev) => [...prev, ...videoList]);
      }

      setTotalPages(result.totalPages || result.data?.totalPages || 1);
      setPage(result.page || result.data?.page || pageNum);
    } catch (err) {
      console.error('❌ Failed to load videos:', err);
      setMessage('❌ Failed to load videos. Please try again.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // ✅ Embed video logic
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

      {message && <p className="form-message">{message}</p>}

      <div className="video-grid">
        {videos.length > 0 ? (
          videos.map((video) => (
            <div key={video._id || video.id} className="video-card">
              <h4>{video.title}</h4>
              {renderEmbed(video)}
            </div>
          ))
        ) : (
          <p className="no-videos">🚫 ምንም ቪዲዮ አልተገኘም</p>
        )}
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
