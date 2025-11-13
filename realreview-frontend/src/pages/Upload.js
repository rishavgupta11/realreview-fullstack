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
      const response = await photosAPI.getAllPhotos(0, 20);
      setPhotos(response.data.content || response.data);
    } catch (err) {
      setError('Failed to load photos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(Math.round(rating || 0));
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
                  src={`http://localhost:8085/api/photos/${photo.id}/image`}
                  alt={photo.description || 'Property'}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
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
                    {renderStars(photo.averageRating)}
                    {photo.averageRating > 0 && ` (${photo.totalRatings})`}
                  </span>
                  <span className="photo-user">
                    👤 {photo.uploadedBy?.username}
                  </span>
                </div>
                {photo.validationConfidence && (
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