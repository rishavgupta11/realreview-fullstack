import React, { useState, useEffect } from 'react';
import { adminAPI, photosAPI } from '../api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [pendingPhotos, setPendingPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPendingPhotos();
  }, []);

  const fetchPendingPhotos = async () => {
    try {
      const response = await adminAPI.getPendingPhotos();
      setPendingPhotos(response.data);
    } catch (err) {
      setError('Failed to load pending photos');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (photoId) => {
    try {
      await adminAPI.approvePhoto(photoId);
      setPendingPhotos(pendingPhotos.filter((p) => p.id !== photoId));
      alert('Photo approved successfully!');
    } catch (err) {
      alert('Failed to approve photo');
    }
  };

  const handleReject = async (photoId) => {
    if (window.confirm('Are you sure you want to reject this photo?')) {
      try {
        await adminAPI.rejectPhoto(photoId);
        setPendingPhotos(pendingPhotos.filter((p) => p.id !== photoId));
        alert('Photo rejected successfully!');
      } catch (err) {
        alert('Failed to reject photo');
      }
    }
  };

  if (loading) return <div className="loading">Loading pending photos...</div>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <h2>Pending Photo Approvals ({pendingPhotos.length})</h2>

      {error && <div className="error-message">{error}</div>}

      {pendingPhotos.length === 0 ? (
        <div className="no-pending">
          <p>No pending photos to review</p>
        </div>
      ) : (
        <div className="pending-photos-grid">
          {pendingPhotos.map((photo) => (
            <div key={photo.id} className="pending-photo-card">
              <div className="photo-image">
                <img
                  src={photosAPI.getPhotoImage(photo.filename || photo.id)}
                  alt={photo.description}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                  }}
                />
              </div>

              <div className="photo-details">
                <h3>{photo.location}</h3>

                <div className="photo-metadata">
                  <p><strong>Uploaded by:</strong> {photo.uploadedBy?.username}</p>
                  <p><strong>Upload Date:</strong> {new Date(photo.uploadTime).toLocaleDateString()}</p>

                  {photo.description && (
                    <p><strong>Description:</strong> {photo.description}</p>
                  )}

                  {photo.claimedLatitude && photo.claimedLongitude && (
                    <p>
                      <strong>Claimed Location:</strong>
                      {photo.claimedLatitude.toFixed(6)}, {photo.claimedLongitude.toFixed(6)}
                    </p>
                  )}

                  {photo.exifLatitude && photo.exifLongitude && (
                    <p>
                      <strong>EXIF Location:</strong>
                      {photo.exifLatitude.toFixed(6)}, {photo.exifLongitude.toFixed(6)}
                    </p>
                  )}

                  {photo.validationConfidence !== null && (
                    <p>
                      <strong>Validation Confidence:</strong>
                      <span className={`confidence ${photo.validationConfidence > 0.7 ? 'high' : 'low'}`}>
                        {Math.round(photo.validationConfidence * 100)}%
                      </span>
                    </p>
                  )}

                  {photo.validationDistanceM !== null && (
                    <p>
                      <strong>Distance Variance:</strong>
                      {photo.validationDistanceM.toFixed(0)} meters
                    </p>
                  )}
                </div>

                <div className="admin-actions">
                  <button
                    onClick={() => handleApprove(photo.id)}
                    className="approve-button"
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => handleReject(photo.id)}
                    className="reject-button"
                  >
                    ✗ Reject
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

export default AdminDashboard;