import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const API_BASE = 'https://kalyanamala-backend-production.up.railway.app';

const initialForm = {
  fullName: '',
  gender: '',
  dateOfBirth: '',
  heightCm: '',
  heightFeet: '',
  caste: 'Mala',
  subCaste: '',
  religion: '',
  maritalStatus: '',
  education: '',
  fieldOfStudy: '',
  employedIn: '',
  occupation: '',
  jobTitle: '',
  workLocation: '',
  annualIncome: '',
  fatherName: '',
  fatherOccupation: '',
  motherName: '',
  motherOccupation: '',
  siblingsCount: '',
  currentAddressLocation: '',
  currentAddressCity: '',
  currentAddressState: '',
  currentAddressCountry: 'India',
  aboutMe: ''
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginTop: '5px',
  marginBottom: '14px',
  boxSizing: 'border-box'
};

const sectionStyle = {
  border: '1px solid #ddd',
  padding: '18px',
  marginBottom: '20px',
  borderRadius: '8px',
  background: '#fafafa'
};

const buttonStyle = {
  padding: '12px 20px',
  backgroundColor: '#2196F3',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};

const Profile = () => {
  const { token, user } = useContext(AuthContext);
  const [loading,setLoading] = useState(true);
  const [saving,setSaving] = useState(false);
  const [error,setError] = useState('');
  const [profile,setProfile] = useState(null);
  const [form,setForm] = useState(initialForm);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/profiles/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const p = res.data.profile;
        setProfile(p);

        setForm({
          fullName: p.fullName || '',
          gender: p.gender || '',
          dateOfBirth: p.dateOfBirth ? new Date(p.dateOfBirth).toISOString().split('T')[0] : '',
          heightCm: p.heightCm?.toString() || '',
          heightFeet: p.heightFeet || '',
          caste: p.caste || 'Mala',
          subCaste: p.subCaste || '',
          religion: p.religion || '',
          maritalStatus: p.maritalStatus || '',
          education: p.education || '',
          fieldOfStudy: p.fieldOfStudy || '',
          employedIn: p.employedIn || '',
          occupation: p.occupation || '',
          jobTitle: p.jobTitle || '',
          workLocation: p.workLocation || '',
          annualIncome: p.annualIncome?.toString() || '',
          fatherName: p.fatherName || '',
          fatherOccupation: p.fatherOccupation || '',
          motherName: p.motherName || '',
          motherOccupation: p.motherOccupation || '',
          siblingsCount: p.siblingsCount?.toString() || '',
          currentAddressLocation: p.currentAddress?.location || '',
          currentAddressCity: p.currentAddress?.city || '',
          currentAddressState: p.currentAddress?.state || '',
          currentAddressCountry: p.currentAddress?.country || 'India',
          aboutMe: p.aboutMe || ''
        });
      } catch (err) {
        if (err.response?.status === 404) {
          setProfile(null);
        } else {
          setError(
            err.response?.data?.message ||
            err.response?.data?.error ||
            'Failed to load profile'
          );
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadProfile();
    } else {
      setLoading(false);
      setError('Please login again.');
    }
  }, [token]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      fullName: form.fullName,
      gender: form.gender,
      dateOfBirth: form.dateOfBirth,
      heightCm: Number(form.heightCm),
      heightFeet: form.heightFeet || null,
      caste: form.caste,
      subCaste: form.subCaste,
      religion: form.religion,
      maritalStatus: form.maritalStatus,
      education: form.education,
      fieldOfStudy: form.fieldOfStudy,
      employedIn: form.employedIn,
      occupation: form.occupation,
      jobTitle: form.jobTitle,
      workLocation: form.workLocation,
      annualIncome: Number(form.annualIncome),
      fatherName: form.fatherName,
      fatherOccupation: form.fatherOccupation,
      motherName: form.motherName,
      motherOccupation: form.motherOccupation,
      siblingsCount: Number(form.siblingsCount || 0),
      currentAddress: {
        location: form.currentAddressLocation,
        city: form.currentAddressCity,
        state: form.currentAddressState,
        country: form.currentAddressCountry
      },
      aboutMe: form.aboutMe
    };

    try {
      let res;

      if (profile) {
        res = await axios.put(`${API_BASE}/api/profiles/me`, payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        res = await axios.post(`${API_BASE}/api/profiles`, payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }

      setProfile(res.data.profile);
      alert(profile ? 'Profile updated successfully' : 'Profile created successfully');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to save profile'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px' }}>Loading profile...</div>;
  }

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px' }}>
      <h2>My Profile</h2>

      {error && (
        <div style={{ color: 'red', marginBottom: '15px' }}>
          {error}
        </div>
      )}

      <div style={sectionStyle}>
        <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Phone:</strong> {user?.phone}</p>
        <p><strong>Profile Status:</strong> {profile ? 'Profile exists' : 'Create profile first'}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={sectionStyle}>
          <h3>Basic Details</h3>

          <label>Full Name</label>
          <input name="fullName" value={form.fullName} onChange={handleChange} style={inputStyle} required />

          <label>Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange} style={inputStyle} required>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <label>Date of Birth</label>
          <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} style={inputStyle} required />

          <label>Height (cm)</label>
          <input name="heightCm" value={form.heightCm} onChange={handleChange} style={inputStyle} required />

          <label>Height (feet)</label>
          <input name="heightFeet" value={form.heightFeet} onChange={handleChange} style={inputStyle} />

          <label>Caste</label>
          <input name="caste" value={form.caste} onChange={handleChange} style={inputStyle} required />

          <label>Sub Caste</label>
          <select name="subCaste" value={form.subCaste} onChange={handleChange} style={inputStyle} required>
            <option value="">Select</option>
            <option value="SC">SC</option>
            <option value="BC">BC</option>
            <option value="OC">OC</option>
            <option value="Other">Other</option>
          </select>

          <label>Religion</label>
          <select name="religion" value={form.religion} onChange={handleChange} style={inputStyle} required>
            <option value="">Select</option>
            <option value="Hindu">Hindu</option>
            <option value="Christian">Christian</option>
            <option value="Ambedkar">Ambedkar</option>
            <option value="Buddhist">Buddhist</option>
            <option value="Not Applicable">Not Applicable</option>
          </select>

          <label>Marital Status</label>
          <select name="maritalStatus" value={form.maritalStatus} onChange={handleChange} style={inputStyle} required>
            <option value="">Select</option>
            <option value="Never married">Never married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
            <option value="Awaiting Divorce">Awaiting Divorce</option>
          </select>
        </div>

        <div style={sectionStyle}>
          <h3>Professional & Education</h3>

          <label>Education</label>
          <input name="education" value={form.education} onChange={handleChange} style={inputStyle} required />

          <label>Field of Study</label>
          <input name="fieldOfStudy" value={form.fieldOfStudy} onChange={handleChange} style={inputStyle} required />

          <label>Employed In</label>
          <select name="employedIn" value={form.employedIn} onChange={handleChange} style={inputStyle} required>
            <option value="">Select</option>
            <option value="private">Private</option>
            <option value="public">Public</option>
            <option value="govt">Govt</option>
            <option value="business">Business</option>
            <option value="self-employed">Self Employed</option>
            <option value="other">Other</option>
          </select>

          <label>Occupation</label>
          <input name="occupation" value={form.occupation} onChange={handleChange} style={inputStyle} required />

          <label>Job Title</label>
          <input name="jobTitle" value={form.jobTitle} onChange={handleChange} style={inputStyle} required />

          <label>Work Location</label>
          <input name="workLocation" value={form.workLocation} onChange={handleChange} style={inputStyle} required />

          <label>Annual Income</label>
          <input name="annualIncome" value={form.annualIncome} onChange={handleChange} style={inputStyle} required />
        </div>

        <div style={sectionStyle}>
          <h3>Family Details</h3>

          <label>Father Name</label>
          <input name="fatherName" value={form.fatherName} onChange={handleChange} style={inputStyle} required />

          <label>Father Occupation</label>
          <input name="fatherOccupation" value={form.fatherOccupation} onChange={handleChange} style={inputStyle} required />

          <label>Mother Name</label>
          <input name="motherName" value={form.motherName} onChange={handleChange} style={inputStyle} required />

          <label>Mother Occupation</label>
          <input name="motherOccupation" value={form.motherOccupation} onChange={handleChange} style={inputStyle} required />

          <label>No. of Siblings</label>
          <input name="siblingsCount" value={form.siblingsCount} onChange={handleChange} style={inputStyle} required />
        </div>

        <div style={sectionStyle}>
          <h3>Current Address</h3>

          <label>Address / Location</label>
          <input name="currentAddressLocation" value={form.currentAddressLocation} onChange={handleChange} style={inputStyle} required />

          <label>City</label>
          <input name="currentAddressCity" value={form.currentAddressCity} onChange={handleChange} style={inputStyle} required />

          <label>State</label>
          <input name="currentAddressState" value={form.currentAddressState} onChange={handleChange} style={inputStyle} required />

          <label>Country</label>
          <input name="currentAddressCountry" value={form.currentAddressCountry} onChange={handleChange} style={inputStyle} required />
        </div>

        <div style={sectionStyle}>
          <h3>Bio / About Me</h3>

          <label>About Me</label>
          <textarea
            name="aboutMe"
            value={form.aboutMe}
            onChange={handleChange}
            rows="5"
            style={inputStyle}
            required
          />
        </div>

        <button type="submit" disabled={saving} style={buttonStyle}>
          {saving ? 'Saving...' : profile ? 'Update Profile' : 'Create Profile'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
