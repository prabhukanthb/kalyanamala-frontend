import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { token } = useContext(AuthContext);
  const [profile,setProfile] = useState(null);
  const [error,setError] = useState('');
  const [loading,setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          'https://kalyanamala-backend-production.up.railway.app/api/profiles/me',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setProfile(res.data.profile);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          err.response?.data?.error ||
          'Failed to load profile'
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
      setError('No token found. Please login again.');
    }
  }, [token]);

  if (loading) return <div style={{ padding: '40px' }}>Loading profile...</div>;

  if (error) {
    return (
      <div style={{ padding: '40px', color: 'red' }}>
        {error}
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ padding: '40px' }}>
        No profile found.
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>My Profile</h2>
      <p><strong>Name:</strong> {profile.user?.firstName} {profile.user?.lastName}</p>
      <p><strong>Email:</strong> {profile.user?.email}</p>
      <p><strong>Phone:</strong> {profile.user?.phone}</p>
      <p><strong>Gender:</strong> {profile.gender}</p>
      <p><strong>Date of Birth:</strong> {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : '-'}</p>
      <p><strong>Height:</strong> {profile.height}</p>
      <p><strong>Religion:</strong> {profile.religion}</p>
      <p><strong>Caste:</strong> {profile.caste}</p>
      <p><strong>Occupation:</strong> {profile.occupation}</p>
      <p><strong>Education:</strong> {profile.education}</p>
      <p><strong>Income:</strong> {profile.income}</p>
      <p><strong>Location:</strong> {profile.location?.city}, {profile.location?.state}, {profile.location?.country}</p>
      <p><strong>About:</strong> {profile.about || '-'}</p>
      <p><strong>Profile Completion:</strong> {profile.profileCompletion}%</p>
    </div>
  );
};

export default Profile;
