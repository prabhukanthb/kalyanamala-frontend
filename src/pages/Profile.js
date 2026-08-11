import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const API_BASE = 'https://kalyanamala-backend-production.up.railway.app';

const Profile = () => {
  const { token, user } = useContext(AuthContext);
  const [profile,setProfile] = useState(null);
  const [error,setError] = useState('');
  const [loading,setLoading] = useState(true);
  const [form,setForm] = useState({
    gender: '',
    dateOfBirth: '',
    height: '',
    religion: '',
    caste: '',
    occupation: '',
    education: '',
    income: '',
    city: '',
    state: '',
    country: 'India',
    about: ''
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/profiles/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data.profile);
        const p = res.data.profile;
        setForm({
          gender: p.gender || '',
          dateOfBirth: p.dateOfBirth ? p.dateOfBirth.substring(0, 10) : '',
          height: p.height || '',
          religion: p.religion || '',
          caste: p.caste || '',
          occupation: p.occupation || '',
          education: p.education || '',
          income: p.income?.toString() || '',
          city: p.location?.city || '',
          state: p.location?.state || '',
          country: p.location?.country || 'India',
          about: p.about || ''
        });
      } catch (err) {
        if (err.response?.status !== 404) {
          setError(err.response?.data?.message || err.response?.data?.error || 'Failed to load profile');
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) load();
    else {
      setLoading(false);
      setError('Please login again');
    }
  }, [token]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        gender: form.gender,
        dateOfBirth: form.dateOfBirth,
        height: form.height,
        religion: form.religion,
        caste: form.caste,
        occupation: form.occupation,
        education: form.education,
        income: Number(form.income),
        city: form.city,
        state: form.state,
        country: form.country,
        about: form.about
      };

      if (profile) {
        const res = await axios.put(`${API_BASE}/api/profiles/me`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data.profile);
      } else {
        const res = await axios.post(`${API_BASE}/api/profiles`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data.profile);
      }

      alert(profile ? 'Profile updated successfully' : 'Profile created successfully');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to save profile');
    }
  };

  if (loading) return <div style={{ padding: '40px' }}>Loading profile...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <h2>My Profile</h2>

      {error && (
        <div style={{ color: 'red', marginBottom: '15px' }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Phone:</strong> {user?.phone}</p>
        <p><strong>Status:</strong> {profile ? 'Profile Exists' : 'No Profile Yet'}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={fieldStyle}>
          <label>Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange} style={inputStyle}>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div style={fieldStyle}>
          <label>Date of Birth</label>
          <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} style={inputStyle} />
        </div>

        <div style={fieldStyle}>
          <label>Height</label>
          <input type="text" name="height" value={form.height} onChange={handleChange} style={inputStyle} placeholder="170cm" />
        </div>

        <div style={fieldStyle}>
          <label>Religion</label>
          <input type="text" name="religion" value={form.religion} onChange={handleChange} style={inputStyle} />
        </div>

        <div style={fieldStyle}>
          <label>Caste</label>
          <input type="text" name="caste" value={form.caste} onChange={handleChange} style={inputStyle} />
        </div>

        <div style={fieldStyle}>
          <label>Occupation</label>
          <input type="text" name="occupation" value={form.occupation} onChange={handleChange} style={inputStyle} />
        </div>

        <div style={fieldStyle}>
          <label>Education</label>
          <input type="text" name="education" value={form.education} onChange={handleChange} style={inputStyle} />
        </div>

        <div style={fieldStyle}>
          <label>Income</label>
          <input type="number" name="income" value={form.income} onChange={handleChange} style={inputStyle} />
        </div>

        <div style={fieldStyle}>
          <label>City</label>
          <input type="text" name="city" value={form.city} onChange={handleChange} style={inputStyle} />
        </div>

        <div style={fieldStyle}>
          <label>State</label>
          <input type="text" name="state" value={form.state} onChange={handleChange} style={inputStyle} />
        </div>

        <div style={fieldStyle}>
          <label>Country</label>
          <input type="text" name="country" value={form.country} onChange={handleChange} style={inputStyle} />
        </div>

        <div style={fieldStyle}>
          <label>About</label>
          <textarea name="about" value={form.about} onChange={handleChange} style={inputStyle} rows="4" />
        </div>

        <button type="submit" style={buttonStyle}>
          {profile ? 'Update Profile' : 'Create Profile'}
        </button>
      </form>
    </div>
  );
};

const fieldStyle = { marginBottom: '15px' };
const inputStyle = {
  width: '100%',
  padding: '10px',
  marginTop: '5px',
  boxSizing: 'border-box'
};
const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#2196F3',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};

export default Profile;

