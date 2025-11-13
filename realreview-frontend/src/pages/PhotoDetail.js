import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { photosAPI, ratingsAPI } from '../api';
import { useAuth } from '../AuthContext';
import './PhotoDetail.css';

const PhotoDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [photo, setPhoto] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPhoto();
    fetchRatings();
  }, [id]);

  const fetchPhoto = async () => {
    try {
      const response = await photosAPI.getPhotoById(id);
      setPhoto(response.data);
    } catch (err) {
      setError('Failed to load photo');
    } finally {
      setLoading(false);
    }
  };

  const fetchRatings = async () => {
    try {
      const response = await ratingsAPI.getPhotoRatings(id);
      setRatings(response.data);
    } catch (err) {
      console.error('Failed to load ratings');
    }
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await ratingsAPI.ratePhoto(id, rating, comment);
      setComment('');
      fetchPhoto();
      fetchRatings();
      alert('Rating submitted successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (count) => {
    return '⭐'.repeat(count);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!photo) return <div>Photo not found</div>;

  return (
    <div className="photo-detail-page">
      <div className="photo-detail-container">
        <div className="photo-main">
          <img
            src={photosAPI.getPhotoImage(photo.filename || photo.id)}
            alt={photo.description}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<div style="width:100%;height:400px;background:#ddd;display:flex;align-items:center;justify-content:center;color:#666;font-size:18px;">Image Not Available</div>';
            }}
          />
        </div>

        <div className="photo-sidebar">
          <h1>{photo.location}</h1>

          <div className="photo-stats">
            <div className="stat">
              <span className="stat-label">Average Rating</span>
              <span className="stat-value">
                {renderStars(Math.round(photo.averageRating || 0))}
                <br />
                {photo.averageRating > 0 && `${photo.averageRating.toFixed(1)} / 5`}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Total Ratings</span>
              <span className="stat-value">{photo.totalRatings || 0}</span>
            </div>
          </div>

          <div className="photo-metadata">
            <p><strong>Uploaded by:</strong> {photo.uploadedBy?.username}</p>
            <p><strong>Upload Date:</strong> {new Date(photo.uploadTime).toLocaleDateString()}</p>
            {photo.validationConfidence && (
              <p>
                <strong>Location Verified:</strong>
                <span className="verified-badge">
                  ✓ {Math.round(photo.validationConfidence * 100)}%
                </span>
              </p>
            )}
          </div>

          {photo.description && (
            <div className="photo-description">
              <h3>Description</h3>
              <p>{photo.description}</p>
            </div>
          )}

          {isAuthenticated && (
            <div className="rating-form">
              <h3>Rate this Property</h3>
              <form onSubmit={handleRatingSubmit}>
                <div className="stars-input">
                  <label>Your Rating:</label>
                  <div className="star-buttons">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`star-button ${rating >= star ? 'active' : ''}`}
                        onClick={() => setRating(star)}
                      >
                        ⭐
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Comment (optional)</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience..."
                    rows="3"
                  />
                </div>

                <button type="submit" disabled={submitting} className="submit-button">
                  {submitting ? 'Submitting...' : 'Submit Rating'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <div className="ratings-section">
        <h2>User Reviews ({ratings.length})</h2>
        {ratings.length === 0 ? (
          <p className="no-ratings">No ratings yet. Be the first to rate!</p>
        ) : (
          <div className="ratings-list">
            {ratings.map((r) => (
              <div key={r.id} className="rating-item">
                <div className="rating-header">
                  <span className="rating-user">👤 {r.user?.username}</span>
                  <span className="rating-stars">{renderStars(r.rating)}</span>
                  <span className="rating-date">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {r.comment && <p className="rating-comment">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoDetail;