import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { photosAPI } from '../api';
import './Home.css';

const Home = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await photosAPI.getAllPhotos();
      console.log('Photos response:', response.data); // Debug log
      const photosData = Array.isArray(response.data) ? response.data : [];
      setPhotos(photosData);
    } catch (err) {
      console.error('Fetch photos error:', err);
      setError('Failed to load photos');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const numRating = Number(rating) || 0;
    return '⭐'.repeat(Math.round(numRating));
  };

  if (loading) {
    return <div className="loading">Loading photos...</div>;
  }

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>🏠 Welcome to RealReview</h1>
        <p>Discover real estate reviews from real people in your city</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="photos-grid">
        {photos.length === 0 ? (
          <div className="no-photos">
            <p>No photos yet. Be the first to upload!</p>
            <Link to="/upload" className="button">Upload Photo</Link>
          </div>
        ) : (
          photos.map((photo) => (
            <Link to={`/photo/${photo.id}`} key={photo.id} className="photo-card">
              <div className="photo-image">
                <img
                  src={photosAPI.getPhotoImage(photo.filename || photo.id)}
                  alt={photo.description || 'Property'}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div style="width:100%;height:200px;background:#ddd;display:flex;align-items:center;justify-content:center;color:#666;">No Image Available</div>';
                  }}
                />
              </div>
              <div className="photo-info">
                <h3>{photo.location || 'Unknown Location'}</h3>
                <p className="photo-description">
                  {photo.description || 'No description'}
                </p>
                <div className="photo-meta">
                  <span className="photo-rating">
                    {photo.averageRating > 0 ? (
                      <>
                        {renderStars(photo.averageRating)} ({photo.totalRatings || 0})
                      </>
                    ) : (
                      <span>No ratings yet</span>
                    )}
                  </span>
                  <span className="photo-user">
                    👤 {photo.uploadedBy?.username || photo.uploaderName || 'Anonymous'}
                  </span>
                </div>
                {photo.validationConfidence && photo.validationConfidence > 0 && (
                  <div className="validation-badge">
                    ✓ {Math.round(photo.validationConfidence * 100)}% verified
                  </div>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;