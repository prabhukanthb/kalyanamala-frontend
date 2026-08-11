import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const API_BASE = 'https://kalyanamala-backend-production.up.railway.app';

const emptyForm = {
  gender: '',
  dateOfBirth: '',
  height: '',
  bodyType: 'average',
  complexion: '',
  religion: '',
  caste: '',
  subCaste: '',
  sect: '',
  gothram: '',
  occupation: '',
  employmentType: '',
  companyName: '',
  jobTitle: '',
  industry: '',
  education: '',
  fieldOfStudy: '',
  college: '',
  income: '',
  incomeCurrency: 'INR',
  incomeFrequency: 'annual',
  country: 'India',
  state: '',
  city: '',
  postalCode: '',
  willingToRelocate: true,
  diet: '',
  smoking: '',
  drinking: '',
  exercise: '',
  about: '',
  maritalStatus: 'never_married',
  haveChildren: false,
  numberOfChildren: 0,
  childrenAges: '',
  familyStatus: '',
  familyValues: '',
  fatherOccupation: '',
  motherOccupation: '',
  numberOfBrothers: '',
  numberOfSisters: '',
  preferredMatches: 'any_religion'
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginTop: '5px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  boxSizing: 'border-box'
};

const sectionStyle = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '18px',
  marginBottom: '18px',
  backgroundColor: '#fafafa'
};

const buttonStyle = {
  padding: '12px 18px',
  backgroundColor: '#2196F3',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px'
};

const Profile = () => {
  const { token, user } = useContext(AuthContext);

  const [loading,setLoading] = useState(true);
  const [saving,setSaving] = useState(false);
  const [error,setError] = useState('');
  const [profile,setProfile] = useState(null);
  const [formData,setFormData] = useState(emptyForm);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/profiles/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const p = res.data.profile;
        setProfile(p);

        setFormData({
          gender: p.gender || '',
          dateOfBirth: p.dateOfBirth ? new Date(p.dateOfBirth).toISOString().split('T')[0] : '',
          height: p.height || '',
          bodyType: p.bodyType || 'average',
          complexion: p.complexion || '',
          religion: p.religion || '',
          caste: p.caste || '',
          subCaste: p.subCaste || '',
          sect: p.sect || '',
          gothram: p.gothram || '',
          occupation: p.occupation || '',
          employmentType: p.employmentType || '',
          companyName: p.companyName || '',
          jobTitle: p.jobTitle || '',
          industry: p.industry || '',
          education: p.education || '',
          fieldOfStudy: p.fieldOfStudy || '',
          college: p.college || '',
          income: p.income?.toString() || '',
          incomeCurrency: p.incomeCurrency || 'INR',
          incomeFrequency: p.incomeFrequency || 'annual',
          country: p.location?.country || 'India',
          state: p.location?.state || '',
          city: p.location?.city || '',
          postalCode: p.location?.postalCode || '',
          willingToRelocate: p.willingToRelocate ?? true,
          diet: p.lifestyle?.diet || '',
          smoking: p.lifestyle?.smoking || '',
          drinking: p.lifestyle?.drinking || '',
          exercise: p.lifestyle?.exercise || '',
          about: p.about || '',
          maritalStatus: p.maritalStatus || 'never_married',
          haveChildren: p.haveChildren ?? false,
          numberOfChildren: p.numberOfChildren?.toString() || '0',
          childrenAges: Array.isArray(p.childrenAges) ? p.childrenAges.join(', ') : '',
          familyStatus: p.familyStatus || '',
          familyValues: p.familyValues || '',
          fatherOccupation: p.parentOccupation?.fatherOccupation || '',
          motherOccupation: p.parentOccupation?.motherOccupation || '',
          numberOfBrothers: p.numberOfBrothers?.toString() || '',
          numberOfSisters: p.numberOfSisters?.toString() || '',
          preferredMatches: p.preferredMatches || 'any_religion'
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
      fetchProfile();
    } else {
      setLoading(false);
      setError('No token found. Please login again.');
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const payload = {
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        height: formData.height,
        bodyType: formData.bodyType || 'average',
        complexion: formData.complexion || null,
        religion: formData.religion,
        caste: formData.caste,
        subCaste: formData.subCaste || null,
        sect: formData.sect || null,
        gothram: formData.gothram || null,
        occupation: formData.occupation,
        employmentType: formData.employmentType || null,
        companyName: formData.companyName || null,
        jobTitle: formData.jobTitle || null,
        industry: formData.industry || null,
        education: formData.education,
        fieldOfStudy: formData.fieldOfStudy || null,
        college: formData.college || null,
        income: Number(formData.income),
        incomeCurrency: formData.incomeCurrency || 'INR',
        incomeFrequency: formData.incomeFrequency || 'annual',
        location: {
          country: formData.country || 'India',
          state: formData.state,
          city: formData.city,
          postalCode: formData.postalCode || null
        },
        willingToRelocate: formData.willingToRelocate,
        lifestyle: {
          diet: formData.diet || null,
          smoking: formData.smoking || null,
          drinking: formData.drinking || null,
          exercise: formData.exercise || null
        },
        about: formData.about || null,
        maritalStatus: formData.maritalStatus,
        haveChildren: formData.haveChildren,
        numberOfChildren: Number(formData.numberOfChildren || 0),
        childrenAges: formData.childrenAges
          ? formData.childrenAges.split(',').map((n) => Number(n.trim())).filter(Boolean)
          : [],
        familyStatus: formData.familyStatus || null,
        familyValues: formData.familyValues || null,
        parentOccupation: {
          fatherOccupation: formData.fatherOccupation || null,
          motherOccupation: formData.motherOccupation || null
        },
        numberOfBrothers: formData.numberOfBrothers ? Number(formData.numberOfBrothers) : null,
        numberOfSisters: formData.numberOfSisters ? Number(formData.numberOfSisters) : null,
        preferredMatches: formData.preferredMatches || 'any_religion'
      };

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

      const updatedProfile = res.data.profile;
      setProfile(updatedProfile);

      alert(profile ? 'Profile updated successfully!' : 'Profile created successfully!');
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
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>My Profile</h2>

      {error && (
        <div
          style={{
            color: 'red',
            marginBottom: '15px',
            padding: '10px',
            backgroundColor: '#ffebee',
            borderRadius: '5px'
          }}
        >
          {error}
        </div>
      )}

      {profile && (
        <div style={sectionStyle}>
          <h3>Profile Summary</h3>
          <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Phone:</strong> {user?.phone}</p>
          <p><strong>Completion:</strong> {profile.profileCompletion}%</p>
          <p><strong>Status:</strong> {profile.status}</p>
          <p><strong>Verified:</strong> {profile.isVerified ? 'Yes' : 'No'}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={sectionStyle}>
          <h3>Basic Details</h3>

          <div style={{ marginBottom: '15px' }}>
            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} required style={inputStyle}>
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Date of Birth</label>
            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required style={inputStyle} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Height (example: 170cm)</label>
            <input type="text" name="height" value={formData.height} onChange={handleChange} required style={inputStyle} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Body Type</label>
            <select name="bodyType" value={formData.bodyType} onChange={handleChange} style={inputStyle}>
              <option value="slim">Slim</option>
              <option value="average">Average</option>
              <option value="athletic">Athletic</option>
              <option value="heavy">Heavy</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Complexion</label>
            <select name="complexion" value={formData.complexion} onChange={handleChange} style={inputStyle}>
              <option value="">Select</option>
              <option value="fair">Fair</option>
              <option value="wheatish">Wheatish</option>
              <option value="dusky">Dusky</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>

        <div style={sectionStyle}>
          <h3>Religion & Family</h3>

          <div style={{ marginBottom: '15px' }}>
            <label>Religion</label>
            <input type="text" name="religion" value={formData.religion} onChange={handleChange} required style={inputStyle} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Caste</label>
            <input type="text" name="caste" value={formData.caste} onChange={handleChange} required style={inputStyle} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Sub Caste</label>
            <input type="text" name="subCaste" value={formData.subCaste} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Sect</label>
            <input type="text" name="sect" value={formData.sect} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Gothram</label>
            <input type="text" name="gothram" value={formData.gothram} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Marital Status</label>
            <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} style={inputStyle}>
              <option value="never_married">Never Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
              <option value="separated">Separated</option>
              <option value="annulled">Annulled</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>
              <input type="checkbox" name="haveChildren" checked={formData.haveChildren} onChange={handleChange} />
              {' '}Have Children
            </label>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Number of Children</label>
            <input type="number" name="numberOfChildren" value={formData.numberOfChildren} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Children Ages (comma separated)</label>
            <input type="text" name="childrenAges" value={formData.childrenAges} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Family Status</label>
            <select name="familyStatus" value={formData.familyStatus} onChange={handleChange} style={inputStyle}>
              <option value="">Select</option>
              <option value="joint_family">Joint Family</option>
              <option value="nuclear_family">Nuclear Family</option>
              <option value="single_parent">Single Parent</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Family Values</label>
            <select name="familyValues" value={formData.familyValues} onChange={handleChange} style={inputStyle}>
              <option value="">Select</option>
              <option value="orthodox">Orthodox</option>
              <option value="moderate">Moderate</option>
              <option value="liberal">Liberal</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Father Occupation</label>
            <input type="text" name="fatherOccupation" value={formData.fatherOccupation} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Mother Occupation</label>
            <input type="text" name="motherOccupation" value={formData.motherOccupation} onChange={handleChange} style={inputStyle} />
          </div>
        </div>

        <div style={sectionStyle}>
          <h3>Professional & Education</h3>

          <div style={{ marginBottom: '15px' }}>
            <label>Occupation</label>
            <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} required style={inputStyle} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Employment Type</label>
            <select name="employmentType" value={formData.employmentType} onChange={handleChange} style={inputStyle}>
              <option value="">Select</option>
              <option value="salaried">Salaried</option>
              <option value="self_employed">Self Employed</option>
              <option value="business">Business</option>
              <option value="professional">Professional</option>
              <option value="student">Student</option>
              <option value="homemaker">Homemaker</option>
              <option value="retired">Retired</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Company Name</label>
            <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Job Title</label>
            <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Industry</label>
            <input type="text" name="industry" value={formData.industry} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Education</label>
            <input type="text" name="education" value={formData.education} onChange={handleChange} required style={inputStyle} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Field of Study</label>
            <input type="text" name="fieldOfStudy" value={formData.fieldOfStudy} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>College</label>
            <input type="text" name="college" value={formData.college} onChange={handleChange} style={inputStyle} />
          </div>
        </div>

        <div style={sectionStyle}>
          <h3>Income & Location</h3>

          <div style={{ marginBottom: '15px' }}>
            <label>Income</label>
            <input type="number" name="income" value={formData.income} onChange={handleChange} required style={inputStyle} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Income Currency</label>
            <select name="incomeCurrency" value={formData.incomeCurrency} onChange={handleChange} style={inputStyle}>
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
              <option value="EUR">EUR</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Income Frequency</label>
            <select name="incomeFrequency" value={formData.incomeFrequency} onChange={handleChange} style={inputStyle}>
              <option value="annual">Annual</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Country</label>
            <input type="text" name="country" value={formData.country} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>State</label>
            <input type="text" name="state" value={formData.state} onChange={handleChange} required style={inputStyle} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>City</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} required style={inputStyle} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Postal Code</label>
            <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>
              <input type="checkbox" name="willingToRelocate" checked={formData.willingToRelocate} onChange={handleChange} />
              {' '}Willing to Relocate
            </label>
          </div>
        </div>

        <div style={sectionStyle}>
          <h3>Lifestyle</h3>

          <div style={{ marginBottom: '15px' }}>
            <label>Diet</label>
            <select name="diet" value={formData.diet} onChange={handleChange} style={inputStyle}>
              <option value="">Select</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="non-vegetarian">Non-Vegetarian</option>
              <option value="eggetarian">Eggetarian</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Smoking</label>
            <select name="smoking" value={formData.smoking} onChange={handleChange} style={inputStyle}>
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="occasionally">Occasionally</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Drinking</label>
            <select name="drinking" value={formData.drinking} onChange={handleChange} style={inputStyle}>
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="occasionally">Occasionally</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Exercise</label>
            <select name="exercise" value={formData.exercise} onChange={handleChange} style={inputStyle}>
              <option value="">Select</option>
              <option value="regularly">Regularly</option>
              <option value="sometimes">Sometimes</option>
              <option value="rarely">Rarely</option>
            </select>
          </div>
        </div>

        <div style={sectionStyle}>
          <h3>About & Preference</h3>

          <div style={{ marginBottom: '15px' }}>
            <label>About</label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              rows="5"
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Preferred Match Type</label>
            <select name="preferredMatches" value={formData.preferredMatches} onChange={handleChange} style={inputStyle}>
              <option value="same_religion">Same Religion</option>
              <option value="any_religion">Any Religion</option>
              <option value="open">Open</option>
            </select>
          </div>
        </div>

        <button type="submit" disabled={saving} style={buttonStyle}>
          {saving ? 'Saving...' : profile ? 'Update Profile' : 'Create Profile'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
