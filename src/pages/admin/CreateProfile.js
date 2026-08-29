import React, { useContext, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

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

function getMaxDOBFor18Plus() {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 18);
  return d.toISOString().split('T')[0];
}

function calculateAge(dob) {
  if (!dob) return null;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

const CreateProfile = () => {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form,setForm] = useState(initialForm);
  const [saving,setSaving] = useState(false);
  const [error,setError] = useState('');
  const [fieldErrors,setFieldErrors] = useState({});

  const maxDOB = useMemo(() => getMaxDOBFor18Plus(), []);
  const age = useMemo(() => calculateAge(form.dateOfBirth), [form.dateOfBirth]);

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
        if (item?.field) {
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
      setError('User must be at least 18 years old.');
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

    try {
      setSaving(true);

  await axios.post(`${API_BASE}/api/profiles`, payload, {
  headers: { Authorization: `Bearer ${token}` }
});

navigate('/admin');
      
    } catch (err) {
      const data = err.response?.data;
      setError(data?.message || data?.error || 'Failed to create profile');
      setFieldErrors(mapServerErrors(data));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '950px', margin: '40px auto', padding: '20px' }}>
      <h2>Create New Profile</h2>

      <div style={sectionStyle}>
        <p>
          <strong>Admin:</strong> {user?.firstName || '-'} {user?.surname || ''}
        </p>
      </div>

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

      <form onSubmit={handleSave}>
        <div style={sectionStyle}>
          <h3>Basic Details</h3>

          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={form.gender}
            onChange={handleChange}
            style={inputStyle}
            required
          >
            <option value="">Select</option>
            {genderOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
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
            style={inputStyle}
            max={maxDOB}
            required
          />
          {fieldErrors.dateOfBirth && (
            <div style={{ color: 'red' }}>{fieldErrors.dateOfBirth}</div>
          )}

          <label htmlFor="heightFeet">Height Feet</label>
          <select
            id="heightFeet"
            name="heightFeet"
            value={form.heightFeet}
            onChange={handleChange}
            style={inputStyle}
            required
          >
            <option value="">Select</option>
            {heightFeetOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          {fieldErrors.heightFeet && <div style={{ color: 'red' }}>{fieldErrors.heightFeet}</div>}

          <label htmlFor="heightInches">Height Inches</label>
          <select
            id="heightInches"
            name="heightInches"
            value={form.heightInches}
            onChange={handleChange}
            style={inputStyle}
            required
          >
            <option value="">Select</option>
            {heightInchesOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          {fieldErrors.heightInches && (
            <div style={{ color: 'red' }}>{fieldErrors.heightInches}</div>
          )}
        </div>

        <div style={sectionStyle}>
          <h3>Religion & Family</h3>

          <label htmlFor="religion">Religion</label>
          <select
            id="religion"
            name="religion"
            value={form.religion}
            onChange={handleChange}
            style={inputStyle}
            required
          >
            <option value="">Select</option>
            {religionOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {fieldErrors.religion && <div style={{ color: 'red' }}>{fieldErrors.religion}</div>}

          <label htmlFor="subCaste">Sub Caste</label>
          <select
            id="subCaste"
            name="subCaste"
            value={form.subCaste}
            onChange={handleChange}
            style={inputStyle}
            required
          >
            <option value="">Select</option>
            {subCasteOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {fieldErrors.subCaste && <div style={{ color: 'red' }}>{fieldErrors.subCaste}</div>}

          <label htmlFor="siblingsCount">No. of siblings</label>
          <select
            id="siblingsCount"
            name="siblingsCount"
            value={form.siblingsCount}
            onChange={handleChange}
            style={inputStyle}
            required
          >
            <option value="">Select</option>
            {siblingCountOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          {fieldErrors.siblingsCount && (
            <div style={{ color: 'red' }}>{fieldErrors.siblingsCount}</div>
          )}

          <label htmlFor="maritalStatus">Marital status</label>
          <select
            id="maritalStatus"
            name="maritalStatus"
            value={form.maritalStatus}
            onChange={handleChange}
            style={inputStyle}
            required
          >
            <option value="">Select</option>
            {maritalStatusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {fieldErrors.maritalStatus && (
            <div style={{ color: 'red' }}>{fieldErrors.maritalStatus}</div>
          )}

          <label htmlFor="fatherName">Father’s Name</label>
          <input
            id="fatherName"
            name="fatherName"
            value={form.fatherName}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          {fieldErrors.fatherName && <div style={{ color: 'red' }}>{fieldErrors.fatherName}</div>}

          <label htmlFor="fatherOccupation">Father Occupation</label>
          <input
            id="fatherOccupation"
            name="fatherOccupation"
            value={form.fatherOccupation}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          {fieldErrors.fatherOccupation && (
            <div style={{ color: 'red' }}>{fieldErrors.fatherOccupation}</div>
          )}

          <label htmlFor="motherName">Mother’s Name</label>
          <input
            id="motherName"
            name="motherName"
            value={form.motherName}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          {fieldErrors.motherName && <div style={{ color: 'red' }}>{fieldErrors.motherName}</div>}

          <label htmlFor="motherOccupation">Mother Occupation</label>
          <input
            id="motherOccupation"
            name="motherOccupation"
            value={form.motherOccupation}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          {fieldErrors.motherOccupation && (
            <div style={{ color: 'red' }}>{fieldErrors.motherOccupation}</div>
          )}
        </div>

        <div style={sectionStyle}>
          <h3>Professional & Education</h3>

          <label htmlFor="highestEducation">Highest Education</label>
          <select
            id="highestEducation"
            name="highestEducation"
            value={form.highestEducation}
            onChange={handleChange}
            style={inputStyle}
            required
          >
            <option value="">Select</option>
            {educationOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {fieldErrors.highestEducation && (
            <div style={{ color: 'red' }}>{fieldErrors.highestEducation}</div>
          )}

          <label htmlFor="fieldOfStudy">Field of Study</label>
          <input
            id="fieldOfStudy"
            name="fieldOfStudy"
            value={form.fieldOfStudy}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          {fieldErrors.fieldOfStudy && <div style={{ color: 'red' }}>{fieldErrors.fieldOfStudy}</div>}

          <label htmlFor="college">College</label>
          <input
            id="college"
            name="college"
            value={form.college}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          {fieldErrors.college && <div style={{ color: 'red' }}>{fieldErrors.college}</div>}

          <label htmlFor="occupation">Occupation</label>
          <input
            id="occupation"
            name="occupation"
            value={form.occupation}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          {fieldErrors.occupation && <div style={{ color: 'red' }}>{fieldErrors.occupation}</div>}

          <label htmlFor="employmentType">Employment Type</label>
          <select
            id="employmentType"
            name="employmentType"
            value={form.employmentType}
            onChange={handleChange}
            style={inputStyle}
            required
          >
            <option value="">Select</option>
            {employmentTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {fieldErrors.employmentType && (
            <div style={{ color: 'red' }}>{fieldErrors.employmentType}</div>
          )}

          <label htmlFor="companyName">Company Name</label>
          <input
            id="companyName"
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          {fieldErrors.companyName && <div style={{ color: 'red' }}>{fieldErrors.companyName}</div>}

          <label htmlFor="jobTitle">Job Title</label>
          <input
            id="jobTitle"
            name="jobTitle"
            value={form.jobTitle}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          {fieldErrors.jobTitle && <div style={{ color: 'red' }}>{fieldErrors.jobTitle}</div>}

          <label htmlFor="jobLocation">Job Location</label>
          <input
            id="jobLocation"
            name="jobLocation"
            value={form.jobLocation}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          {fieldErrors.jobLocation && <div style={{ color: 'red' }}>{fieldErrors.jobLocation}</div>}

          <label htmlFor="industry">Industry</label>
          <input
            id="industry"
            name="industry"
            value={form.industry}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          {fieldErrors.industry && <div style={{ color: 'red' }}>{fieldErrors.industry}</div>}

          <label htmlFor="income">Income</label>
          <input
            id="income"
            type="number"
            name="income"
            value={form.income}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          {fieldErrors.income && <div style={{ color: 'red' }}>{fieldErrors.income}</div>}
        </div>

        <div style={sectionStyle}>
          <h3>Current Address</h3>

          <label htmlFor="streetName">Street Name</label>
          <input
            id="streetName"
            name="streetName"
            value={form.streetName}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          {fieldErrors.streetName && <div style={{ color: 'red' }}>{fieldErrors.streetName}</div>}

          <label htmlFor="city">City</label>
          <input
            id="city"
            name="city"
            value={form.city}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          {fieldErrors.city && <div style={{ color: 'red' }}>{fieldErrors.city}</div>}

          <label htmlFor="state">State</label>
          <select
            id="state"
            name="state"
            value={form.state}
            onChange={handleChange}
            style={inputStyle}
            required
          >
            <option value="">Select State</option>
            {southIndianStates.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {fieldErrors.state && <div style={{ color: 'red' }}>{fieldErrors.state}</div>}

          <label htmlFor="country">Country</label>
          <input
            id="country"
            name="country"
            value={form.country}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          {fieldErrors.country && <div style={{ color: 'red' }}>{fieldErrors.country}</div>}

          <label htmlFor="pinCode">Pin Code</label>
          <input
            id="pinCode"
            name="pinCode"
            value={form.pinCode}
            onChange={handleChange}
            style={inputStyle}
            required
          />
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
            style={inputStyle}
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
          {saving ? 'Saving...' : 'Create Profile'}
        </button>
      </form>
    </div>
  );
};

export default CreateProfile;
