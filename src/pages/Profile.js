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
  haveChildren: 'No',
  familyStatus: '',
  familyValues: '',
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

const familyStatusOptions = [
  { label: 'Nuclear family', value: 'nuclear_family' },
  { label: 'Joint family', value: 'joint_family' },
  { label: 'Single parent', value: 'single_parent' },
  { label: 'Extended family', value: 'extended_family' }
];

const familyValuesOptions = [
  { label: 'Rich', value: 'rich' },
  { label: 'Middle', value: 'middle' },
  { label: 'Lower', value: 'lower' },
  { label: 'Other', value: 'other' },
  { label: 'Orthodox', value: 'orthodox' }
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

const readOnlyStyle = {
  ...inputStyle,
  backgroundColor: '#f1f1f1',
  cursor: 'not-allowed'
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
          haveChildren: p.haveChildren ? 'Yes' : 'No',
          familyStatus: p.familyStatus || '',
          familyValues: p.familyValues || '',
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
          else if (msg.includes('family status')) mapped.familyStatus = item;
          else if (msg.includes('family values')) mapped.familyValues = item;
          else if (msg.includes('religion')) mapped.religion = item;
          else if (msg.includes('sub caste') || msg.includes('subcaste')) mapped.subCaste = item;
          else if (msg.includes('gender')) mapped.gender = item;
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
      haveChildren: form.haveChildren === 'Yes',
      familyStatus: form.familyStatus || '',
      familyValues: form.familyValues || '',
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

  const handleLogoutRedirectHome = () => {
    navigate('/');
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
        <button
          type="button"
          onClick={() => setMode('view')}
          style={secondaryButtonStyle}
        >
          View Profile
        </button>

        <button
          type="button"
          onClick={() => setMode('edit')}
          style={buttonStyle}
        >
          Edit Profile
        </button>

        <button
          type="button"
          onClick={handleLogoutRedirectHome}
          style={{ ...buttonStyle, backgroundColor: '#444', marginLeft: '10px' }}
        >
          Home
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
            <p><strong>Have Children:</strong> {profile.haveChildren ? 'Yes' : 'No'}</p>
            <p><strong>Family Status:</strong> {profile.familyStatus || '-'}</p>
            <p><strong>Family Values:</strong> {profile.familyValues || '-'}</p>
            <p><strong>Father’s Name:</strong> {profile.fatherName}</p>
            <p><strong>Father Occupation:</strong> {profile.fatherOccupation}</p>
            <p><strong>Mother’s Name:</strong> {profile.motherName}</p>
            <p><strong>Mother Occupation:</strong> {profile.motherOccupation}</p>
          </div>

          <div style={sectionStyle}>
            <h3>Professional & Education</h3>
            <p><strong>Highest Education:</strong> {profile.highestEducation}</p>
            <p><strong>Field of Study / Specialization:</strong> {profile.fieldOfStudy}</p>
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

          <div style={sectionStyle}>
            <h3>Photos</h3>
            {profile.photos?.length > 0 ? (
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {profile.photos.map((photo, idx) => (
                  <img
                    key={idx}
                    src={photo.url}
                    alt={`profile-${idx}`}
                    style={{
                      width: '150px',
                      height: '150px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid #ccc'
                    }}
                  />
                ))}
              </div>
            ) : (
              <p>No photos uploaded.</p>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave}>
          <div style={sectionStyle}>
            <h3>Basic Details</h3>

            <label>Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              style={getStyle('gender')}
              required
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {fieldErrors.gender && <div style={{ color: 'red', marginTop: '-10px', marginBottom: '10px' }}>{fieldErrors.gender}</div>}

            <label>DOB</label>
            <input
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
              style={getStyle('dateOfBirth')}
              required
            />
            {fieldErrors.dateOfBirth && <div style={{ color: 'red', marginTop: '-10px', marginBottom: '10px' }}>{fieldErrors.dateOfBirth}</div>}

            <label>Height</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <select
                name="heightFeet"
                value={form.heightFeet}
                onChange={handleChange}
                style={getStyle('heightFeet')}
                required
              >
                <option value="">Feet</option>
                {[4,5,6,7].map((n) => (
                  <option key={n} value={n}>{n} ft</option>
                ))}
              </select>

              <select
                name="heightInches"
                value={form.heightInches}
                onChange={handleChange}
                style={getStyle('heightInches')}
                required
              >
                <option value="">Inches</option>
                {[0,1,2,3,4,5,6,7,8,9,10,11].map((n) => (
                  <option key={n} value={n}>{n} in</option>
                ))}
              </select>
            </div>
            {fieldErrors.heightFeet && <div style={{ color: 'red', marginTop: '-10px', marginBottom: '10px' }}>{fieldErrors.heightFeet}</div>}
            {fieldErrors.heightInches && <div style={{ color: 'red', marginTop: '-10px', marginBottom: '10px' }}>{fieldErrors.heightInches}</div>}
          </div>

          <div style={sectionStyle}>
            <h3>Religion & Family</h3>

            <label>Religion</label>
            <select
              name="religion"
              value={form.religion}
              onChange={handleChange}
              style={getStyle('religion')}
              required
            >
              <option value="">Select</option>
              {religionOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {fieldErrors.religion && <div style={{ color: 'red', marginTop: '-10px', marginBottom: '10px' }}>{fieldErrors.religion}</div>}

            <label>Caste</label>
            <input value="Mala" readOnly style={readOnlyStyle} />

            <label>Sub Caste</label>
            <select
              name="subCaste"
              value={form.subCaste}
              onChange={handleChange}
              style={getStyle('subCaste')}
              required
            >
              <option value="">Select</option>
              {subCasteOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {fieldErrors.subCaste && <div style={{ color: 'red', marginTop: '-10px', marginBottom: '10px' }}>{fieldErrors.subCaste}</div>}

            <label>No. of siblings</label>
            <input
              type="number"
              name="siblingsCount"
              value={form.siblingsCount}
              onChange={handleChange}
              style={getStyle('siblingsCount')}
              required
            />
            {fieldErrors.siblingsCount && <div style={{ color: 'red', marginTop: '-10px', marginBottom: '10px' }}>{fieldErrors.siblingsCount}</div>}

            <label>Marital status</label>
            <select
              name="maritalStatus"
              value={form.maritalStatus}
              onChange={handleChange}
              style={getStyle('maritalStatus')}
              required
            >
              <option value="">Select</option>
              {maritalStatusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {fieldErrors.maritalStatus && <div style={{ color: 'red', marginTop: '-10px', marginBottom: '10px' }}>{fieldErrors.maritalStatus}</div>}

            <label>Have Children</label>
            <select
              name="haveChildren"
              value={form.haveChildren}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>

            <label>Family Status</label>
            <select
              name="familyStatus"
              value={form.familyStatus}
              onChange={handleChange}
              style={getStyle('familyStatus')}
            >
              <option value="">Select</option>
              {familyStatusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {fieldErrors.familyStatus && <div style={{ color: 'red', marginTop: '-10px', marginBottom: '10px' }}>{fieldErrors.familyStatus}</div>}

            <label>Family Values</label>
            <select
              name="familyValues"
              value={form.familyValues}
              onChange={handleChange}
              style={getStyle('familyValues')}
            >
              <option value="">Select</option>
              {familyValuesOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {fieldErrors.familyValues && <div style={{ color: 'red', marginTop: '-10px', marginBottom: '10px' }}>{fieldErrors.familyValues}</div>}

            <label>Father’s Name</label>
            <input
              name="fatherName"
              value={form.fatherName}
              onChange={handleChange}
              style={getStyle('fatherName')}
              required
            />
            {fieldErrors.fatherName && <div style={{ color: 'red', marginTop: '-10px', marginBottom: '10px' }}>{fieldErrors.fatherName}</div>}

            <label>Father Occupation</label>
            <input
              name="fatherOccupation"
              value={form.fatherOccupation}
              onChange={handleChange}
              style={getStyle('fatherOccupation')}
              required
            />
            {fieldErrors.fatherOccupation && <div style={{ color: 'red', marginTop: '-10px', marginBottom: '10px' }}>{fieldErrors.fatherOccupation}</div>}

            <label>Mother’s Name</label>
            <input
              name="motherName"
              value={form.motherName}
              onChange={handleChange}
              style={getStyle('motherName')}
              required
            />
            {fieldErrors.motherName && <div style={{ color: 'red', marginTop: '-10px', marginBottom: '10px' }}>{fieldErrors.motherName}</div>}

            <label>Mother Occupation</label>
            <input
              name="motherOccupation"
              value={form.motherOccupation}
              onChange={handleChange}
              style={getStyle('motherOccupation')}
              required
            />
            {fieldErrors.motherOccupation && <div style={{ color: 'red', marginTop: '-10px', marginBottom: '10px' }}>{fieldErrors.motherOccupation}</div>}
          </div>

          <div style={sectionStyle}>
            <h3>Professional & Education</h3>

            <label>Highest Education</label>
            <select
              name="highestEducation"
              value={form.highestEducation}
              onChange={handleChange}
              style={getStyle('highestEducation')}
              required
            >
              <option value="">Select</option>
              {educationOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {fieldErrors.highestEducation && <div style={{ color: 'red', marginTop: '-10px', marginBottom: '10px' }}>{fieldErrors.highestEducation}</div>}

            <label>Field of Study / Specialization</label>
            <input
              name="fieldOfStudy"
              value={form.fieldOfStudy}
              onChange={handleChange}
              style={getStyle('fieldOfStudy')}
              required
            />
            {fieldErrors.fieldOfStudy && <div style={{ color: 'red', marginTop: '-10px', marginBottom: '10px' }}>{fieldErrors.fieldOfStudy}</div>}

            <label>College</label>
            <input
              name="college"
              value={form.college}
              onChange={handleChange}
              style={getStyle('college')}
              required
            />
            {fieldErrors.college && <div style={{ color: 'red', marginTop: '-10px', marginBottom: '10px' }}>{fieldErrors.college}</div>}

            <label>Occupation</label>
            <input
              name="occupation"
              value={form.occupation}
              onChange={handleChange}
              style={getStyle('occupation')}
              required
            />
            {fieldErrors.occupation && <div style={{ color: 'red', marginTop: '-10px', marginBottom: '10px' }}>{fieldErrors.occupation}</div>}

            <label>Employment Type</label>
            <select
              name="employmentType"
              value={form.employmentType}
              onChange={handleChange}
              style={getStyle('employmentType')}
              required
            >
              <option value="">Select</option>
              {employmentTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {fieldErrors.employmentType && <div style={{ color: 'red', marginTop: '-10px', marginBottom: '10px' }}>{fieldErrors.employmentType}</div>}

            <label>Company Name</label>
            <input
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              style={getStyle('companyName')}
              required
            />
            {fieldErrors.companyName && <div style={{ color: 'red', marginTop: '-10px', marginBottom: '10px' }}>{fieldErrors.companyName}</div>}

            <label>Job Title</label>
            <input
              name="jobTitle"
              value={form.jobTitle}
              onChange={handleChange}
              style={getStyle('jobTitle')}
              required
            />
            {fieldErrors.jobTitle && <div style={{ color: 'red', marginTop: '-10px', marginBottom: '10px' }}>{fieldErrors.jobTitle}</div>}

            <label>Job Location</label>
            <input
              name="jobLocation"
              value={form.jobLocation}
              onChange={handleChange}
              style={getStyle('jobLocation')}
              required
            />
            {fieldErrors.jobLocation && <div style={{ color: 'red', marginTop: '-10px', marginBottom: '10px' }}>{fieldErrors.jobLocation}</div>}

            <label>Industry</label>
            <input
              name="industry"
              value={form.industry}
              onChange={handleChange}
              style={getStyle('industry')}
              required
            />
            {fieldErrors.industry && <div style={{ color: 'red', marginTop: '-10px', marginBottom: '10px' }}>{fieldErrors.industry}</div>}

            <label>Income</label>
            <input
              type="number"
              name="income"
              value={form.income}
              onChange={handleChange}
              style={getStyle('income')}
              required
            />
            {fieldErrors.income && <div style={{ color: 'red', marginTop: '-10px', marginBottom: '10px' }}>{fieldErrors.income}</div>}

            <label>Income Currency</label>
            <input value="INR" readOnly style={readOnlyStyle} />
          </div>

          <div style={sectionStyle}>
            <h3>Current Address</h3>

            <label>Street Name</label>
            <input
              name="streetName"
              value={form.streetName}
              onChange={handleChange}
              style={getStyle('streetName')}
              required
            />
            {fieldErrors.streetName && <div style={{ color: 'red', marginTop: '-10px', marginBottom: '10px' }}>{fieldErrors.streetName}</div>}

            <label>City</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              style={getStyle('city')}
              required
            />
            {fieldErrors.city && <div style={{ color: 'red', marginTop: '-10px', marginBottom: '10px' }}>{fieldErrors.city}</div>}

            <label>State</label>
            <select
              name="state"
              value={form.state}
              onChange={handleChange}
              style={getStyle('state')}
              required
            >
              <option value="">Select State</option>
              {southIndianStates.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {fieldErrors.state && <div style={{ color: 'red', marginTop: '-10px', marginBottom: '10px' }}>{fieldErrors.state}</div>}

            <label>Country</label>
            <input
              name="country"
              value={form.country}
              onChange={handleChange}
              style={getStyle('country')}
              required
            />
            {fieldErrors.country && <div style={{ color: 'red', marginTop: '-10px', marginBottom: '10px' }}>{fieldErrors.country}</div>}

            <label>Pin Code</label>
            <input
              name="pinCode"
              value={form.pinCode}
              onChange={handleChange}
              style={getStyle('pinCode')}
              required
            />
            {fieldErrors.pinCode && <div style={{ color: 'red', marginTop: '-10px', marginBottom: '10px' }}>{fieldErrors.pinCode}</div>}
          </div>

          <div style={sectionStyle}>
            <h3>About & Preference</h3>

            <label>Photos</label>
            <p>Photo upload will be added later.</p>

            <label>About Me</label>
            <textarea
              name="aboutMe"
              value={form.aboutMe}
              onChange={handleChange}
              rows="5"
              style={getStyle('aboutMe')}
              required
            />
            {fieldErrors.aboutMe && <div style={{ color: 'red', marginTop: '-10px', marginBottom: '10px' }}>{fieldErrors.aboutMe}</div>}

            <label>Preferred Match</label>
            <select
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
