import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const API_BASE = 'https://kalyanamala-backend-production.up.railway.app';

const EditProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [loading,setLoading] = useState(true);
  const [saving,setSaving] = useState(false);
  const [error,setError] = useState('');
  const [form,setForm] = useState({
    gender: '',
    dateOfBirth: '',
    heightFeet: '',
    heightInches: '',
    religion: '',
    subCaste: '',
    siblingsCount: '',
    maritalStatus: '',
    haveChildren: 'No',
    fatherName: '',
    fatherOccupation: '',
    motherName: '',
    motherOccupation: '',
    highestEducation: '',
    fieldOfStudy: '',
    college: '',
    occupation: '',
    employmentType: '',
    companyName: '',
    jobTitle: '',
    jobLocation: '',
    industry: '',
    income: '',
    streetName: '',
    city: '',
    state: '',
    country: '',
    pinCode: '',
    aboutMe: '',
    preferredMatch: '',
    showInSearch: false,
    approvalStatus: ''
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/profiles/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const p = res.data.profile;
        setForm({
          gender: p.gender || '',
          dateOfBirth: p.dateOfBirth ? new Date(p.dateOfBirth).toISOString().split('T')[0] : '',
          heightFeet: p.heightFeet?.toString() || '',
          heightInches: p.heightInches?.toString() || '',
          religion: p.religion || '',
          subCaste: p.subCaste || '',
          siblingsCount: p.siblingsCount?.toString() || '',
          maritalStatus: p.maritalStatus || '',
          haveChildren: p.haveChildren ? 'Yes' : 'No',
          fatherName: p.fatherName || '',
          fatherOccupation: p.fatherOccupation || '',
          motherName: p.motherName || '',
          motherOccupation: p.motherOccupation || '',
          highestEducation: p.highestEducation || '',
          fieldOfStudy: p.fieldOfStudy || '',
          college: p.college || '',
          occupation: p.occupation || '',
          employmentType: p.employmentType || '',
          companyName: p.companyName || '',
          jobTitle: p.jobTitle || '',
          jobLocation: p.jobLocation || '',
          industry: p.industry || '',
          income: p.income?.toString() || '',
          streetName: p.currentAddress?.streetName || '',
          city: p.currentAddress?.city || '',
          state: p.currentAddress?.state || '',
          country: p.currentAddress?.country || '',
          pinCode: p.currentAddress?.pinCode || '',
          aboutMe: p.aboutMe || '',
          preferredMatch: p.preferredMatch || '',
          showInSearch: p.showInSearch || false,
          approvalStatus: p.approvalStatus || ''
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id,token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      gender: form.gender,
      dateOfBirth: form.dateOfBirth,
      heightFeet: Number(form.heightFeet),
      heightInches: Number(form.heightInches),
      religion: form.religion,
      subCaste: form.subCaste,
      siblingsCount: Number(form.siblingsCount || 0),
      maritalStatus: form.maritalStatus,
      haveChildren: form.haveChildren === 'Yes',
      fatherName: form.fatherName,
      fatherOccupation: form.fatherOccupation,
      motherName: form.motherName,
      motherOccupation: form.motherOccupation,
      highestEducation: form.highestEducation,
      fieldOfStudy: form.fieldOfStudy,
      college: form.college,
      occupation: form.occupation,
      employmentType: form.employmentType,
      companyName: form.companyName,
      jobTitle: form.jobTitle,
      jobLocation: form.jobLocation,
      industry: form.industry,
      income: Number(form.income),
      currentAddress: {
        streetName: form.streetName,
        city: form.city,
        state: form.state,
        country: form.country,
        pinCode: form.pinCode
      },
      aboutMe: form.aboutMe,
      preferredMatch: form.preferredMatch,
      showInSearch: form.showInSearch,
      approvalStatus: form.approvalStatus
    };

    try {
      await axios.put(`${API_BASE}/api/profiles/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '30px' }}>Loading profile...</div>;
  }

  return (
    <div style={{ maxWidth: '900px', margin: '30px auto', padding: '20px' }}>
      <h2>Edit Profile</h2>

      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

      <form onSubmit={handleSave}>
        <input name="gender" value={form.gender} onChange={handleChange} placeholder="Gender" style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        <input name="heightFeet" value={form.heightFeet} onChange={handleChange} placeholder="Height Feet" style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        <input name="heightInches" value={form.heightInches} onChange={handleChange} placeholder="Height Inches" style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        <input name="religion" value={form.religion} onChange={handleChange} placeholder="Religion" style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        <input name="subCaste" value={form.subCaste} onChange={handleChange} placeholder="Sub Caste" style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        <input name="siblingsCount" value={form.siblingsCount} onChange={handleChange} placeholder="Siblings Count" style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        <input name="maritalStatus" value={form.maritalStatus} onChange={handleChange} placeholder="Marital Status" style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        <input name="haveChildren" value={form.haveChildren} onChange={handleChange} placeholder="Have Children" style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        <input name="fatherName" value={form.fatherName} onChange={handleChange} placeholder="Father Name" style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        <input name="fatherOccupation" value={form.fatherOccupation} onChange={handleChange} placeholder="Father Occupation" style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        <input name="motherName" value={form.motherName} onChange={handleChange} placeholder="Mother Name" style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        <input name="motherOccupation" value={form.motherOccupation} onChange={handleChange} placeholder="Mother Occupation" style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        <input name="highestEducation" value={form.highestEducation} onChange={handleChange} placeholder="Highest Education" style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        <input name="fieldOfStudy" value={form.fieldOfStudy} onChange={handleChange} placeholder="Field Of Study" style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        <input name="college" value={form.college} onChange={handleChange} placeholder="College" style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        <input name="occupation" value={form.occupation} onChange={handleChange} placeholder="Occupation" style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        <input name="employmentType" value={form.employmentType} onChange={handleChange} placeholder="Employment Type" style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        <input name="companyName" value={form.companyName} onChange={handleChange} placeholder="Company Name" style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        <input name="jobTitle" value={form.jobTitle} onChange={handleChange} placeholder="Job Title" style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        <input name="jobLocation" value={form.jobLocation} onChange={handleChange} placeholder="Job Location" style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        <input name="industry" value={form.industry} onChange={handleChange} placeholder="Industry" style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        <input name="income" value={form.income} onChange={handleChange} placeholder="Income" style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        <input name="streetName" value={form.streetName} onChange={handleChange} placeholder="Street Name" style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        <input name="city" value={form.city} onChange={handleChange} placeholder="City" style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        <input name="state" value={form.state} onChange={handleChange} placeholder="State" style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        <input name="country" value={form.country} onChange={handleChange} placeholder="Country" style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        <input name="pinCode" value={form.pinCode} onChange={handleChange} placeholder="Pin Code" style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        <textarea name="aboutMe" value={form.aboutMe} onChange={handleChange} placeholder="About Me" style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        <input name="preferredMatch" value={form.preferredMatch} onChange={handleChange} placeholder="Preferred Match" style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />

        <label>
          <input
            type="checkbox"
            name="showInSearch"
            checked={form.showInSearch}
            onChange={handleChange}
          />
          Show in Search
        </label>

        <br /><br />

        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
