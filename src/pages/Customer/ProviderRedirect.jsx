import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProviderRedirect = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // ✅ Axios instance for your backend
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
  });

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        // 🔹 Fetch provider by slug
        const res = await api.get(`/api/providers/slug/${slug}`);
        const provider = res.data;

        if (!provider || !provider.serviceCategory) {
          // ❌ Invalid slug → go home
          navigate('/');
          return;
        }

        // 🔁 Redirect to category page, passing providerId
        navigate(
          `/services/${provider.serviceCategory}?providerId=${provider._id}`,
          { replace: true }
        );
      } catch (error) {
        console.error('Provider link invalid or server error:', error);
        navigate('/'); // fallback home
      }
    };

    fetchProvider();
  }, [slug, navigate]);

  return null; // 🔹 No UI needed
};

export default ProviderRedirect;
