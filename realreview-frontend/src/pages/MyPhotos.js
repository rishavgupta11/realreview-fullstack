import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { photosAPI } from '../api';
import './MyPhotos.css';

const MyPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyPhotos();
  }, []);

  const fetchMyPhotos = async () => {
    try {
      const response = await photosAPI.getMyPhotos();
      setPhotos(response.data);
    } catch (err) {
      setError('Failed to load your photos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (photoId) => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      try {
        await photosAPI.deletePhoto(photoId);
        setPhotos(photos.filter((p) => p.id !== photoId));
      } catch (err) {
        alert('Failed to delete photo');
      }
    }
  };

  const getStatusBadge = (photo) => {
    if (photo.archived) {
      return <span className="status-badge archived">Archived</span>;
    }
    if (photo.approved) {
      return <span className="status-badge approved">Approved</span>;
    }
    return <span className="status-badge pending">Pending</span>;
  };

  if (loading) return <div className="loading">Loading your photos...</div>;

  return (
    <div className="my-photos-page">
      <div className="page-header">
        <h1>My Photos</h1>
        <Link to="/upload" className="button">Upload New Photo</Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      {photos.length === 0 ? (
        <div className="no-photos">
          <p>You haven't uploaded any photos yet.</p>
          <Link to="/upload" className="button">Upload Your First Photo</Link>
        </div>
      ) : (
        <div className="photos-grid">
          {photos.map((photo) => (
            <div key={photo.id} className="photo-card">
              <Link to={`/photo/${photo.id}`} className="photo-image">
                <img
                  src={photosAPI.getPhotoImage(photo.filename || photo.id)}
                  alt={photo.description}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                  }}
                />
              </Link>

              <div className="photo-info">
                <h3>{photo.location}</h3>
                {getStatusBadge(photo)}

                <div className="photo-meta">
                  <span> {photo.averageRating?.toFixed(1) || '0.0'} ({photo.totalRatings || 0})</span>
                  <span> {new Date(photo.uploadTime).toLocaleDateString()}</span>
                </div>

                {photo.description && (
                  <p className="photo-description">{photo.description}</p>
                )}

                <div className="photo-actions">
                  <Link to={`/photo/${photo.id}`} className="view-button">
                    View Details
                  </Link>
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPhotos;