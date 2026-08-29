import React, { useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'https://kalyanamala-backend-production.up.railway.app';

const initialForm = {
  gender: '',
  dateOfBirth: '',
  heightFeet: '',
  heightInches: '',
  religion: '',
  subCaste: '',
  siblingsCount: '',
  maritalStatus: '',
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
  incomeCurrency: 'INR',
  streetName: '',
  city: '',
  state: '',
  country: 'India',
  pinCode: '',
  aboutMe: '',
  preferredMatch: 'any_religion'
};

const southIndianStates = [
  'Andhra Pradesh',
  'Telangana',
  'Karnataka',
  'Tamil Nadu',
  'Kerala',
  'Puducherry'
];

const educationOptions = [
  '10th Pass',
  '12th Pass',
  'Diploma',
  'ITI',
  'B.A',
  'B.Sc',
  'B.Com',
  'B.Tech',
  'M.A',
  'M.Sc',
  'M.Com',
  'M.Tech',
  'MBA',
  'MCA',
  'MBBS',
  'BDS',
  'MD',
  'MS',
  'PhD',
  'Other'
];

const maritalStatusOptions = [
  { label: 'Never married', value: 'Nevermarried' },
  { label: 'Divorced', value: 'Divorced' },
  { label: 'Widowed', value: 'Widowed' },
  { label: 'Awaiting Divorce', value: 'AwaitingDivorce' }
];

const religionOptions = [
  { label: 'Christian', value: 'Christian' },
  { label: 'Hindu', value: 'Hindu' },
  { label: 'Ambedkarist', value: 'Ambedkarist' },
  { label: 'Buddhist', value: 'Buddhist' },
  { label: 'Other', value: 'Other' }
];

const subCasteOptions = [
  { label: 'SC', value: 'SC' },
  { label: 'BC', value: 'BC' },
  { label: 'OC', value: 'OC' },
  { label: 'NA', value: 'NA' }
];

const employmentTypeOptions = [
  { label: 'Private', value: 'private' },
  { label: 'Public', value: 'public' },
  { label: 'Govt', value: 'govt' },
  { label: 'Business', value: 'business' },
  { label: 'Self Employed', value: 'self-employed' },
  { label: 'Other', value: 'other' }
];

const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' }
];

const heightFeetOptions = [4,5,6,7];
const heightInchesOptions = [0,1,2,3,4,5,6,7,8,9,10,11];
const siblingCountOptions = [0,1,2,3];

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

const secondaryButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#666',
  marginRight: '10px'
};

const errorFieldStyle = {
  ...inputStyle,
  border: '1px solid red'
};

function calculateAge(dob) {
  if (!dob) return null;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function getMaxDOBFor18Plus() {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 18);
  return d.toISOString().split('T')[0];
}

const Profile = () => {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading,setLoading] = useState(true);
  const [saving,setSaving] = useState(false);
  const [error,setError] = useState('');
  const [fieldErrors,setFieldErrors] = useState({});
  const [profile,setProfile] = useState(null);
  const [mode,setMode] = useState('view');
  const [form,setForm] = useState(initialForm);

  const age = useMemo(() => calculateAge(form.dateOfBirth), [form.dateOfBirth]);
  const maxDOB = useMemo(() => getMaxDOBFor18Plus(), []);

  useEffect(() => {
    const loadProfile = async () => {
      if (!token) {
        setLoading(false);
        setError('Please login again.');
        return;
      }

      try {
        const res = await axios.get(`${API_BASE}/api/profiles/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const p = res.data.profile;
        setProfile(p);

        setForm({
          gender: p.gender || '',
          dateOfBirth: p.dateOfBirth ? new Date(p.dateOfBirth).toISOString().split('T')[0] : '',
          heightFeet: p.heightFeet?.toString() || '',
          heightInches: p.heightInches?.toString() || '',
          religion: p.religion || '',
          subCaste: p.subCaste || '',
          siblingsCount: p.siblingsCount?.toString() || '',
          maritalStatus: p.maritalStatus || '',
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
          incomeCurrency: p.incomeCurrency || 'INR',
          streetName: p.currentAddress?.streetName || '',
          city: p.currentAddress?.city || '',
          state: p.currentAddress?.state || '',
          country: p.currentAddress?.country || 'India',
          pinCode: p.currentAddress?.pinCode || '',
          aboutMe: p.aboutMe || '',
          preferredMatch: p.preferredMatch || 'any_religion'
        });

        setMode('view');
      } catch (err) {
        if (err.response?.status === 404) {
          setProfile(null);
          setMode('edit');
        } else if (err.response?.status === 401) {
          navigate('/');
        } else {
          setError(err.response?.data?.message || err.response?.data?.error || 'Failed to load profile');
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [token,navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
    setFieldErrors((prev) => ({
      ...prev,
      [name]: ''
    }));
  };

  const mapServerErrors = (data) => {
    const mapped = {};
    if (Array.isArray(data?.details)) {
      data.details.forEach((item) => {
        if (typeof item === 'string') {
          const msg = item.toLowerCase();
          if (msg.includes('marital')) mapped.maritalStatus = item;
          else if (msg.includes('gender')) mapped.gender = item;
          else if (msg.includes('date of birth')) mapped.dateOfBirth = item;
          else if (msg.includes('height feet')) mapped.heightFeet = item;
          else if (msg.includes('height inches')) mapped.heightInches = item;
          else if (msg.includes('religion')) mapped.religion = item;
          else if (msg.includes('sub caste') || msg.includes('subcaste')) mapped.subCaste = item;
          else if (msg.includes('siblings')) mapped.siblingsCount = item;
          else if (msg.includes('father name')) mapped.fatherName = item;
          else if (msg.includes('father occupation')) mapped.fatherOccupation = item;
          else if (msg.includes('mother name')) mapped.motherName = item;
          else if (msg.includes('mother occupation')) mapped.motherOccupation = item;
          else if (msg.includes('highest education')) mapped.highestEducation = item;
          else if (msg.includes('field of study')) mapped.fieldOfStudy = item;
          else if (msg.includes('college')) mapped.college = item;
          else if (msg.includes('occupation')) mapped.occupation = item;
          else if (msg.includes('employment type')) mapped.employmentType = item;
          else if (msg.includes('company name')) mapped.companyName = item;
          else if (msg.includes('job title')) mapped.jobTitle = item;
          else if (msg.includes('job location')) mapped.jobLocation = item;
          else if (msg.includes('industry')) mapped.industry = item;
          else if (msg.includes('income')) mapped.income = item;
          else if (msg.includes('street name')) mapped.streetName = item;
          else if (msg.includes('city')) mapped.city = item;
          else if (msg.includes('state')) mapped.state = item;
          else if (msg.includes('country')) mapped.country = item;
          else if (msg.includes('pin code')) mapped.pinCode = item;
          else if (msg.includes('about me')) mapped.aboutMe = item;
        } else if (item?.field) {
          mapped[item.field] = item.message;
        }
      });
    }
    return mapped;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (!age || age < 18) {
      setError('You must be at least 18 years old.');
      return;
    }

    const payload = {
      gender: form.gender,
      dateOfBirth: form.dateOfBirth,
      heightFeet: Number(form.heightFeet),
      heightInches: Number(form.heightInches),
      religion: form.religion,
      subCaste: form.subCaste,
      siblingsCount: Number(form.siblingsCount || 0),
      maritalStatus: form.maritalStatus,
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
      incomeCurrency: 'INR',
      currentAddress: {
        streetName: form.streetName,
        city: form.city,
        state: form.state,
        country: form.country,
        pinCode: form.pinCode
      },
      aboutMe: form.aboutMe,
      preferredMatch: form.preferredMatch,
      caste: 'Mala'
    };

    setSaving(true);

    try {
      let res;
      if (profile) {
        res = await axios.put(`${API_BASE}/api/profiles/me`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        res = await axios.post(`${API_BASE}/api/profiles`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setProfile(res.data.profile);
      setMode('view');
      setError('');
      setFieldErrors({});
    } catch (err) {
      const data = err.response?.data;
      setError(data?.message || data?.error || 'Failed to save profile');
      setFieldErrors(mapServerErrors(data));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px' }}>Loading profile...</div>;
  }

  const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim();

  const getStyle = (fieldName) => (
    fieldErrors[fieldName] ? errorFieldStyle : inputStyle
  );

  return (
    <div style={{ maxWidth: '950px', margin: '40px auto', padding: '20px' }}>
      <h2>My Profile</h2>

      {error && (
        <div
          style={{
            color: 'red',
            marginBottom: '15px',
            padding: '10px',
            background: '#ffebee',
            borderRadius: '6px'
          }}
        >
          {error}
        </div>
      )}

      <p><strong>Profile ID:</strong> {profile?.profileId || '-'}</p>

      <div style={sectionStyle}>
        <p><strong>Full Name:</strong> {fullName || '-'}</p>
        <p><strong>Surname:</strong> {user?.surname || '-'}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Phone:</strong> {user?.phone}</p>
        <p><strong>Status:</strong> {profile ? profile.approvalStatus || 'Pending' : 'No profile yet'}</p>
        <p><strong>Age:</strong> {age || '-'}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button type="button" onClick={() => setMode('view')} style={secondaryButtonStyle}>
          View Profile
        </button>
        <button type="button" onClick={() => setMode('edit')} style={buttonStyle}>
          Edit Profile
        </button>
      </div>

      {mode === 'view' && profile ? (
        <div>
          <div style={sectionStyle}>
            <h3>Basic Details</h3>
            <p><strong>Gender:</strong> {profile.gender}</p>
            <p><strong>DOB:</strong> {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : '-'}</p>
            <p><strong>Height:</strong> {profile.heightFeet} ft {profile.heightInches} in</p>
          </div>

          <div style={sectionStyle}>
            <h3>Religion & Family</h3>
            <p><strong>Religion:</strong> {profile.religion}</p>
            <p><strong>Caste:</strong> {profile.caste}</p>
            <p><strong>Sub Caste:</strong> {profile.subCaste}</p>
            <p><strong>No. of siblings:</strong> {profile.siblingsCount}</p>
            <p><strong>Marital status:</strong> {profile.maritalStatus}</p>
            <p><strong>Father’s Name:</strong> {profile.fatherName}</p>
            <p><strong>Father Occupation:</strong> {profile.fatherOccupation}</p>
            <p><strong>Mother’s Name:</strong> {profile.motherName}</p>
            <p><strong>Mother Occupation:</strong> {profile.motherOccupation}</p>
          </div>

          <div style={sectionStyle}>
            <h3>Professional & Education</h3>
            <p><strong>Highest Education:</strong> {profile.highestEducation}</p>
            <p><strong>Field of Study:</strong> {profile.fieldOfStudy}</p>
            <p><strong>College:</strong> {profile.college}</p>
            <p><strong>Occupation:</strong> {profile.occupation}</p>
            <p><strong>Employment Type:</strong> {profile.employmentType}</p>
            <p><strong>Company Name:</strong> {profile.companyName}</p>
            <p><strong>Job Title:</strong> {profile.jobTitle}</p>
            <p><strong>Job Location:</strong> {profile.jobLocation}</p>
            <p><strong>Industry:</strong> {profile.industry}</p>
            <p><strong>Income:</strong> {profile.income}</p>
            <p><strong>Income Currency:</strong> {profile.incomeCurrency}</p>
          </div>

          <div style={sectionStyle}>
            <h3>Current Address</h3>
            <p><strong>Street Name:</strong> {profile.currentAddress?.streetName || '-'}</p>
            <p><strong>City:</strong> {profile.currentAddress?.city || '-'}</p>
            <p><strong>State:</strong> {profile.currentAddress?.state || '-'}</p>
            <p><strong>Country:</strong> {profile.currentAddress?.country || '-'}</p>
            <p><strong>Pin Code:</strong> {profile.currentAddress?.pinCode || '-'}</p>
          </div>

          <div style={sectionStyle}>
            <h3>About & Preference</h3>
            <p><strong>About Me:</strong> {profile.aboutMe}</p>
            <p><strong>Preferred Match:</strong> {profile.preferredMatch}</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave}>
          <div style={sectionStyle}>
            <h3>Basic Details</h3>

            <label htmlFor="gender">Gender</label>
            <select id="gender" name="gender" value={form.gender} onChange={handleChange} style={getStyle('gender')} required>
              <option value="">Select</option>
              {genderOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {fieldErrors.gender && <div style={{ color: 'red' }}>{fieldErrors.gender}</div>}

            <label htmlFor="dateOfBirth">DOB</label>
            <input
              id="dateOfBirth"
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
              style={getStyle('dateOfBirth')}
              max={maxDOB}
              required
            />
            {fieldErrors.dateOfBirth && <div style={{ color: 'red' }}>{fieldErrors.dateOfBirth}</div>}

            <label htmlFor="heightFeet">Height Feet</label>
            <select id="heightFeet" name="heightFeet" value={form.heightFeet} onChange={handleChange} style={getStyle('heightFeet')} required>
              <option value="">Select</option>
              {heightFeetOptions.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            {fieldErrors.heightFeet && <div style={{ color: 'red' }}>{fieldErrors.heightFeet}</div>}

            <label htmlFor="heightInches">Height Inches</label>
            <select id="heightInches" name="heightInches" value={form.heightInches} onChange={handleChange} style={getStyle('heightInches')} required>
              <option value="">Select</option>
              {heightInchesOptions.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            {fieldErrors.heightInches && <div style={{ color: 'red' }}>{fieldErrors.heightInches}</div>}
          </div>

          <div style={sectionStyle}>
            <h3>Religion & Family</h3>

            <label htmlFor="religion">Religion</label>
            <select id="religion" name="religion" value={form.religion} onChange={handleChange} style={getStyle('religion')} required>
              <option value="">Select</option>
              {religionOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {fieldErrors.religion && <div style={{ color: 'red' }}>{fieldErrors.religion}</div>}

            <label htmlFor="subCaste">Sub Caste</label>
            <select id="subCaste" name="subCaste" value={form.subCaste} onChange={handleChange} style={getStyle('subCaste')} required>
              <option value="">Select</option>
              {subCasteOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {fieldErrors.subCaste && <div style={{ color: 'red' }}>{fieldErrors.subCaste}</div>}

            <label htmlFor="siblingsCount">No. of siblings</label>
            <select id="siblingsCount" name="siblingsCount" value={form.siblingsCount} onChange={handleChange} style={getStyle('siblingsCount')} required>
              <option value="">Select</option>
              {siblingCountOptions.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            {fieldErrors.siblingsCount && <div style={{ color: 'red' }}>{fieldErrors.siblingsCount}</div>}

            <label htmlFor="maritalStatus">Marital status</label>
            <select id="maritalStatus" name="maritalStatus" value={form.maritalStatus} onChange={handleChange} style={getStyle('maritalStatus')} required>
              <option value="">Select</option>
              {maritalStatusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {fieldErrors.maritalStatus && <div style={{ color: 'red' }}>{fieldErrors.maritalStatus}</div>}

            <label htmlFor="fatherName">Father’s Name</label>
            <input id="fatherName" name="fatherName" value={form.fatherName} onChange={handleChange} style={getStyle('fatherName')} required />
            {fieldErrors.fatherName && <div style={{ color: 'red' }}>{fieldErrors.fatherName}</div>}

            <label htmlFor="fatherOccupation">Father Occupation</label>
            <input id="fatherOccupation" name="fatherOccupation" value={form.fatherOccupation} onChange={handleChange} style={getStyle('fatherOccupation')} required />
            {fieldErrors.fatherOccupation && <div style={{ color: 'red' }}>{fieldErrors.fatherOccupation}</div>}

            <label htmlFor="motherName">Mother’s Name</label>
            <input id="motherName" name="motherName" value={form.motherName} onChange={handleChange} style={getStyle('motherName')} required />
            {fieldErrors.motherName && <div style={{ color: 'red' }}>{fieldErrors.motherName}</div>}

            <label htmlFor="motherOccupation">Mother Occupation</label>
            <input id="motherOccupation" name="motherOccupation" value={form.motherOccupation} onChange={handleChange} style={getStyle('motherOccupation')} required />
            {fieldErrors.motherOccupation && <div style={{ color: 'red' }}>{fieldErrors.motherOccupation}</div>}
          </div>

          <div style={sectionStyle}>
            <h3>Professional & Education</h3>

            <label htmlFor="highestEducation">Highest Education</label>
            <select id="highestEducation" name="highestEducation" value={form.highestEducation} onChange={handleChange} style={getStyle('highestEducation')} required>
              <option value="">Select</option>
              {educationOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {fieldErrors.highestEducation && <div style={{ color: 'red' }}>{fieldErrors.highestEducation}</div>}

            <label htmlFor="fieldOfStudy">Field of Study</label>
            <input id="fieldOfStudy" name="fieldOfStudy" value={form.fieldOfStudy} onChange={handleChange} style={getStyle('fieldOfStudy')} required />
            {fieldErrors.fieldOfStudy && <div style={{ color: 'red' }}>{fieldErrors.fieldOfStudy}</div>}

            <label htmlFor="college">College</label>
            <input id="college" name="college" value={form.college} onChange={handleChange} style={getStyle('college')} required />
            {fieldErrors.college && <div style={{ color: 'red' }}>{fieldErrors.college}</div>}

            <label htmlFor="occupation">Occupation</label>
            <input id="occupation" name="occupation" value={form.occupation} onChange={handleChange} style={getStyle('occupation')} required />
            {fieldErrors.occupation && <div style={{ color: 'red' }}>{fieldErrors.occupation}</div>}

            <label htmlFor="employmentType">Employment Type</label>
            <select id="employmentType" name="employmentType" value={form.employmentType} onChange={handleChange} style={getStyle('employmentType')} required>
              <option value="">Select</option>
              {employmentTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {fieldErrors.employmentType && <div style={{ color: 'red' }}>{fieldErrors.employmentType}</div>}

            <label htmlFor="companyName">Company Name</label>
            <input id="companyName" name="companyName" value={form.companyName} onChange={handleChange} style={getStyle('companyName')} required />
            {fieldErrors.companyName && <div style={{ color: 'red' }}>{fieldErrors.companyName}</div>}

            <label htmlFor="jobTitle">Job Title</label>
            <input id="jobTitle" name="jobTitle" value={form.jobTitle} onChange={handleChange} style={getStyle('jobTitle')} required />
            {fieldErrors.jobTitle && <div style={{ color: 'red' }}>{fieldErrors.jobTitle}</div>}

            <label htmlFor="jobLocation">Job Location</label>
            <input id="jobLocation" name="jobLocation" value={form.jobLocation} onChange={handleChange} style={getStyle('jobLocation')} required />
            {fieldErrors.jobLocation && <div style={{ color: 'red' }}>{fieldErrors.jobLocation}</div>}

            <label htmlFor="industry">Industry</label>
            <input id="industry" name="industry" value={form.industry} onChange={handleChange} style={getStyle('industry')} required />
            {fieldErrors.industry && <div style={{ color: 'red' }}>{fieldErrors.industry}</div>}

            <label htmlFor="income">Income</label>
            <input
              id="income"
              type="number"
              name="income"
              value={form.income}
              onChange={handleChange}
              style={getStyle('income')}
              required
            />
            {fieldErrors.income && <div style={{ color: 'red' }}>{fieldErrors.income}</div>}
          </div>

          <div style={sectionStyle}>
            <h3>Current Address</h3>

            <label htmlFor="streetName">Street Name</label>
            <input id="streetName" name="streetName" value={form.streetName} onChange={handleChange} style={getStyle('streetName')} required />
            {fieldErrors.streetName && <div style={{ color: 'red' }}>{fieldErrors.streetName}</div>}

            <label htmlFor="city">City</label>
            <input id="city" name="city" value={form.city} onChange={handleChange} style={getStyle('city')} required />
            {fieldErrors.city && <div style={{ color: 'red' }}>{fieldErrors.city}</div>}

            <label htmlFor="state">State</label>
            <select id="state" name="state" value={form.state} onChange={handleChange} style={getStyle('state')} required>
              <option value="">Select State</option>
              {southIndianStates.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {fieldErrors.state && <div style={{ color: 'red' }}>{fieldErrors.state}</div>}

            <label htmlFor="country">Country</label>
            <input id="country" name="country" value={form.country} onChange={handleChange} style={getStyle('country')} required />
            {fieldErrors.country && <div style={{ color: 'red' }}>{fieldErrors.country}</div>}

            <label htmlFor="pinCode">Pin Code</label>
            <input id="pinCode" name="pinCode" value={form.pinCode} onChange={handleChange} style={getStyle('pinCode')} required />
            {fieldErrors.pinCode && <div style={{ color: 'red' }}>{fieldErrors.pinCode}</div>}
          </div>

          <div style={sectionStyle}>
            <h3>About & Preference</h3>

            <label htmlFor="aboutMe">About Me</label>
            <textarea
              id="aboutMe"
              name="aboutMe"
              value={form.aboutMe}
              onChange={handleChange}
              rows="5"
              style={getStyle('aboutMe')}
              required
            />
            {fieldErrors.aboutMe && <div style={{ color: 'red' }}>{fieldErrors.aboutMe}</div>}

            <label htmlFor="preferredMatch">Preferred Match</label>
            <select
              id="preferredMatch"
              name="preferredMatch"
              value={form.preferredMatch}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="same_religion">Same Religion</option>
              <option value="any_religion">Any Religion</option>
              <option value="open">Open</option>
            </select>
          </div>

          <button type="submit" disabled={saving} style={buttonStyle}>
            {saving ? 'Saving...' : profile ? 'Update Profile' : 'Create Profile'}
          </button>
        </form>
      )}
    </div>
  );
};

export default Profile;
