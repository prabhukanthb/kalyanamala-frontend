import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'https://kalyanamala-backend-production.up.railway.app';

const pageStyle = {
  maxWidth: '1400px',
  margin: '30px auto',
  padding: '20px'
};

const cardStyle = {
  background: '#fff',
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '16px',
  marginBottom: '16px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
};

const buttonStyle = {
  padding: '8px 12px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  marginRight: '6px',
  marginTop: '4px'
};

const primaryBtn = { ...buttonStyle, background: '#2196F3', color: '#fff' };
const successBtn = { ...buttonStyle, background: '#2e7d32', color: '#fff' };
const dangerBtn = { ...buttonStyle, background: '#c62828', color: '#fff' };
const secondaryBtn = { ...buttonStyle, background: '#666', color: '#fff' };

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '12px',
  boxSizing: 'border-box'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  background: '#fff'
};

const thTdStyle = {
  border: '1px solid #ddd',
  padding: '10px',
  textAlign: 'left',
  verticalAlign: 'top',
  fontSize: '14px'
};

const thStyle = {
  ...thTdStyle,
  background: '#f4f4f4',
  fontWeight: 'bold'
};

const formGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '14px'
};

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column'
};

const labelStyle = {
  marginBottom: '6px',
  fontWeight: '600'
};

const AdminDashboard = () => {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading,setLoading] = useState(true);
  const [saving,setSaving] = useState(false);
  const [error,setError] = useState('');
  const [stats,setStats] = useState(null);
  const [users,setUsers] = useState([]);
  const [profiles,setProfiles] = useState([]);
  const [activeTab,setActiveTab] = useState('dashboard');
  const [search,setSearch] = useState('');

  const [selectedUser,setSelectedUser] = useState(null);
  const [userEditForm,setUserEditForm] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    surname: '',
    role: 'user',
    status: 'active'
  });

  const [selectedProfile,setSelectedProfile] = useState(null);
  const [profileMode,setProfileMode] = useState('view'); // view | edit | create
  const [profileForm,setProfileForm] = useState({
    firstName: '',
    lastName: '',
    surname: '',
    email: '',
    phone: '',
    password: '',

    userId: '',
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
    streetName: '',
    city: '',
    state: '',
    country: 'India',
    pinCode: '',
    aboutMe: '',
    preferredMatch: 'any_religion',
    approvalStatus: 'approved',
    showInSearch: true
  });

  const loadAll = async (searchValue = '') => {
    try {
      setLoading(true);

      const searchParam = searchValue.trim()
        ? `?search=${encodeURIComponent(searchValue.trim())}`
        : '';

      const [statsRes,usersRes,profilesRes] = await Promise.all([
        axios.get(`${API_BASE}/api/admin/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_BASE}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_BASE}/api/admin/profiles${searchParam}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users || []);
      setProfiles(profilesRes.data.profiles || []);
    } catch (err) {
      if (err.response?.status === 403) {
        setError('Access denied. Admin only.');
        navigate('/');
      } else {
        setError(err.response?.data?.message || err.response?.data?.error || 'Failed to load dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError('Please login again.');
      return;
    }
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleSearch = async (e) => {
    e.preventDefault();
    await loadAll(search);
  };

  const clearSearch = async () => {
    setSearch('');
    await loadAll('');
  };

  const refresh = async () => {
    await loadAll(search);
  };

  const handleLogout = async () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };

  const handleUserEditClick = (u) => {
    setSelectedUser(u);
    setUserEditForm({
      email: u.email || '',
      phone: u.phone || '',
      firstName: u.firstName || '',
      lastName: u.lastName || '',
      surname: u.surname || '',
      role: u.role || 'user',
      status: u.status || 'active'
    });
  };

  const handleUserEditChange = (e) => {
    const { name, value } = e.target;
    setUserEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserUpdate = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    setSaving(true);
    try {
      await axios.put(
        `${API_BASE}/api/admin/users/${selectedUser.id}`,
        userEditForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedUser(null);
      await refresh();
      alert('User updated successfully');
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data?.error || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const openProfileView = (profile) => {
    setSelectedProfile(profile);
    setProfileMode('view');
    setProfileForm({
      firstName: profile.userId?.firstName || '',
      lastName: profile.userId?.lastName || '',
      surname: profile.userId?.surname || '',
      email: profile.userId?.email || '',
      phone: profile.userId?.phone || '',
      password: '',

      userId: profile.userId?._id || profile.userId || '',
      gender: profile.gender || '',
      dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
      heightFeet: profile.heightFeet || '',
      heightInches: profile.heightInches || '',
      religion: profile.religion || '',
      subCaste: profile.subCaste || '',
      siblingsCount: profile.siblingsCount || '',
      maritalStatus: profile.maritalStatus || '',
      haveChildren: profile.haveChildren ? 'Yes' : 'No',
      familyStatus: profile.familyStatus || '',
      familyValues: profile.familyValues || '',
      fatherName: profile.fatherName || '',
      fatherOccupation: profile.fatherOccupation || '',
      motherName: profile.motherName || '',
      motherOccupation: profile.motherOccupation || '',
      highestEducation: profile.highestEducation || '',
      fieldOfStudy: profile.fieldOfStudy || '',
      college: profile.college || '',
      occupation: profile.occupation || '',
      employmentType: profile.employmentType || '',
      companyName: profile.companyName || '',
      jobTitle: profile.jobTitle || '',
      jobLocation: profile.jobLocation || '',
      industry: profile.industry || '',
      income: profile.income || '',
      streetName: profile.currentAddress?.streetName || '',
      city: profile.currentAddress?.city || '',
      state: profile.currentAddress?.state || '',
      country: profile.currentAddress?.country || 'India',
      pinCode: profile.currentAddress?.pinCode || '',
      aboutMe: profile.aboutMe || '',
      preferredMatch: profile.preferredMatch || 'any_religion',
      approvalStatus: profile.approvalStatus || 'approved',
      showInSearch: profile.showInSearch !== false
    });
  };

  const openCreateProfile = () => {
    setSelectedProfile(null);
    setProfileMode('create');
    setProfileForm({
      firstName: '',
      lastName: '',
      surname: '',
      email: '',
      phone: '',
      password: '',

      userId: '',
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
      streetName: '',
      city: '',
      state: '',
      country: 'India',
      pinCode: '',
      aboutMe: '',
      preferredMatch: 'any_religion',
      approvalStatus: 'approved',
      showInSearch: true
    });
    setActiveTab('profiles');
  };

  const handleProfileFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const payload = {
        ...profileForm,
        haveChildren: profileForm.haveChildren === 'Yes',
        currentAddress: {
          streetName: profileForm.streetName,
          city: profileForm.city,
          state: profileForm.state,
          country: profileForm.country,
          pinCode: profileForm.pinCode
        }
      };

      if (profileMode === 'create') {
        await axios.post(`${API_BASE}/api/admin/profiles`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.put(`${API_BASE}/api/admin/profiles/${selectedProfile._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setSelectedProfile(null);
      setProfileMode('view');
      await refresh();
      alert('Profile saved successfully');
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data?.error || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const approveProfile = async (profileId) => {
    try {
      await axios.put(`${API_BASE}/api/admin/profiles/${profileId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await refresh();
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data?.error || 'Failed to approve profile');
    }
  };

  const rejectProfile = async (profileId) => {
    const rejectedReason = prompt('Enter rejection reason:');
    if (!rejectedReason) return;

    try {
      await axios.put(`${API_BASE}/api/admin/profiles/${profileId}/reject`, { rejectedReason }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await refresh();
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data?.error || 'Failed to reject profile');
    }
  };

  const deleteProfile = async (profileId) => {
    if (!window.confirm('Delete this profile?')) return;

    try {
      await axios.delete(`${API_BASE}/api/admin/profiles/${profileId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await refresh();
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data?.error || 'Failed to delete profile');
    }
  };

  if (loading) return <div style={pageStyle}>Loading admin dashboard...</div>;

  return (
    <div style={pageStyle}>
      <div style={{ marginBottom: '20px' }}>
        <h2>Admin Dashboard</h2>
        <p>
          Welcome, {user?.firstName || 'Admin'}
          {user?.surname ? ` ${user.surname}` : ''}!
        </p>

        <div style={{ marginBottom: '10px' }}>
          <button style={primaryBtn} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
          <button style={secondaryBtn} onClick={() => setActiveTab('users')}>Users</button>
          <button style={secondaryBtn} onClick={() => setActiveTab('profiles')}>Browse Profiles</button>
          <button style={successBtn} onClick={openCreateProfile}>Create Profile</button>
          <button style={dangerBtn} onClick={handleLogout}>Logout</button>
        </div>

        <form onSubmit={handleSearch} style={{ marginTop: '10px' }}>
          <input
            type="text"
            placeholder="Search by profile ID or name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={inputStyle}
          />
          <button type="submit" style={primaryBtn}>Search</button>
          <button type="button" style={secondaryBtn} onClick={clearSearch}>Clear</button>
        </form>
      </div>

      {error && (
        <div style={{ ...cardStyle, background: '#ffebee', color: '#b71c1c' }}>
          {error}
        </div>
      )}

      {activeTab === 'dashboard' && stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          <div style={cardStyle}><h3>{stats.totalUsers}</h3><p>Total Users</p></div>
          <div style={cardStyle}><h3>{stats.totalProfiles}</h3><p>Total Profiles</p></div>
          <div style={cardStyle}><h3>{stats.pendingProfiles}</h3><p>Pending Profiles</p></div>
          <div style={cardStyle}><h3>{stats.approvedProfiles}</h3><p>Approved Profiles</p></div>
          <div style={cardStyle}><h3>{stats.rejectedProfiles}</h3><p>Rejected Profiles</p></div>
          <div style={cardStyle}><h3>{stats.deletedProfiles}</h3><p>Deleted Profiles</p></div>
        </div>
      )}

      {activeTab === 'users' && (
        <div style={cardStyle}>
          <h3>Users</h3>
          {users.map((u) => (
            <div
              key={u.id}
              style={{ borderBottom: '1px solid #eee', paddingBottom: '12px', marginBottom: '12px' }}
            >
              <p><strong>Name:</strong> {u.firstName} {u.lastName} {u.surname ? `(${u.surname})` : ''}</p>
              <p><strong>Email:</strong> {u.email}</p>
              <p><strong>Phone:</strong> {u.phone}</p>
              <p><strong>Role:</strong> {u.role}</p>
              <p><strong>Status:</strong> {u.status}</p>
              <button style={primaryBtn} onClick={() => handleUserEditClick(u)}>Edit User</button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'profiles' && (
        <div style={cardStyle}>
          <h3>Profiles</h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Profile ID</th>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Age</th>
                  <th style={thStyle}>Gender</th>
                  <th style={thStyle}>Religion</th>
                  <th style={thStyle}>City</th>
                  <th style={thStyle}>State</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {profiles.length > 0 ? (
                  profiles.map((p) => {
                    const fullName = [
                      p.userId?.firstName || '',
                      p.userId?.lastName || '',
                      p.userId?.surname ? `(${p.userId.surname})` : ''
                    ].join(' ').trim() || '-';

                    const age = p.dateOfBirth
                      ? Math.floor((Date.now() - new Date(p.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
                      : '-';

                    return (
                      <tr key={p._id}>
                        <td style={thTdStyle}>{p.profileId || '-'}</td>
                        <td style={thTdStyle}>{fullName}</td>
                        <td style={thTdStyle}>{age}</td>
                        <td style={thTdStyle}>{p.gender || '-'}</td>
                        <td style={thTdStyle}>{p.religion || '-'}</td>
                        <td style={thTdStyle}>{p.currentAddress?.city || '-'}</td>
                        <td style={thTdStyle}>{p.currentAddress?.state || '-'}</td>
                        <td style={thTdStyle}>{p.approvalStatus || '-'}</td>
                        <td style={thTdStyle}>
                          <button type="button" style={secondaryBtn} onClick={() => openProfileView(p)}>View / Edit</button>
                          <button type="button" style={successBtn} onClick={() => approveProfile(p._id)}>Approve</button>
                          <button type="button" style={dangerBtn} onClick={() => rejectProfile(p._id)}>Reject</button>
                          <button type="button" style={secondaryBtn} onClick={() => deleteProfile(p._id)}>Delete</button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td style={thTdStyle} colSpan="9">No profiles found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(selectedUser) && (
        <div style={cardStyle}>
          <h3>Edit User</h3>
          <form onSubmit={handleUserUpdate}>
            <label>Email</label>
            <input name="email" value={userEditForm.email} onChange={handleUserEditChange} style={inputStyle} required />
            <label>Phone</label>
            <input name="phone" value={userEditForm.phone} onChange={handleUserEditChange} style={inputStyle} required />
            <label>First Name</label>
            <input name="firstName" value={userEditForm.firstName} onChange={handleUserEditChange} style={inputStyle} required />
            <label>Last Name</label>
            <input name="lastName" value={userEditForm.lastName} onChange={handleUserEditChange} style={inputStyle} required />
            <label>Surname</label>
            <input name="surname" value={userEditForm.surname} onChange={handleUserEditChange} style={inputStyle} />
            <label>Role</label>
            <select name="role" value={userEditForm.role} onChange={handleUserEditChange} style={inputStyle}>
              <option value="user">User</option>
              <option value="subadmin">Subadmin</option>
              <option value="admin">Admin</option>
            </select>
            <label>Status</label>
            <select name="status" value={userEditForm.status} onChange={handleUserEditChange} style={inputStyle}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
              <option value="deleted">Deleted</option>
            </select>

            <button type="submit" style={primaryBtn} disabled={saving}>
              {saving ? 'Saving...' : 'Save User'}
            </button>
            <button type="button" style={secondaryBtn} onClick={() => setSelectedUser(null)}>
              Cancel
            </button>
          </form>
        </div>
      )}

      {(selectedProfile || profileMode === 'create') && (
        <div style={cardStyle}>
          <h3>
            {profileMode === 'create'
              ? 'Create Profile'
              : profileMode === 'edit'
              ? 'Edit Profile'
              : 'View Profile'}
          </h3>

          {profileMode === 'view' && selectedProfile ? (
            <div>
              <p><strong>Profile ID:</strong> {selectedProfile.profileId}</p>
              <p><strong>Name:</strong> {selectedProfile.userId?.firstName} {selectedProfile.userId?.lastName}</p>
              <p><strong>Email:</strong> {selectedProfile.userId?.email}</p>
              <p><strong>Phone:</strong> {selectedProfile.userId?.phone}</p>
              <p><strong>Gender:</strong> {selectedProfile.gender}</p>
              <p><strong>Date of Birth:</strong> {selectedProfile.dateOfBirth}</p>
              <p><strong>Height:</strong> {selectedProfile.heightFeet} ft {selectedProfile.heightInches} in</p>
              <p><strong>Religion:</strong> {selectedProfile.religion}</p>
              <p><strong>Sub Caste:</strong> {selectedProfile.subCaste}</p>
              <p><strong>Marital Status:</strong> {selectedProfile.maritalStatus}</p>
              <p><strong>Education:</strong> {selectedProfile.highestEducation}</p>
              <p><strong>Occupation:</strong> {selectedProfile.occupation}</p>
              <p><strong>City:</strong> {selectedProfile.currentAddress?.city}</p>
              <p><strong>State:</strong> {selectedProfile.currentAddress?.state}</p>
              <p><strong>About:</strong> {selectedProfile.aboutMe}</p>
              <p><strong>Status:</strong> {selectedProfile.approvalStatus}</p>

              <button type="button" style={primaryBtn} onClick={() => setProfileMode('edit')}>Edit Profile</button>
              <button type="button" style={secondaryBtn} onClick={() => setSelectedProfile(null)}>Close</button>
            </div>
          ) : (
            <div>
              <div style={formGridStyle}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>First Name</label>
                  <input name="firstName" value={profileForm.firstName} onChange={handleProfileFormChange} style={inputStyle} />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Last Name</label>
                  <input name="lastName" value={profileForm.lastName} onChange={handleProfileFormChange} style={inputStyle} />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Surname</label>
                  <input name="surname" value={profileForm.surname} onChange={handleProfileFormChange} style={inputStyle} />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Email</label>
                  <input name="email" type="email" value={profileForm.email} onChange={handleProfileFormChange} style={inputStyle} />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Mobile</label>
                  <input name="phone" value={profileForm.phone} onChange={handleProfileFormChange} style={inputStyle} />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Password</label>
                  <input name="password" type="password" value={profileForm.password} onChange={handleProfileFormChange} style={inputStyle} />
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Gender</label>
                  <select name="gender" value={profileForm.gender} onChange={handleProfileFormChange} style={inputStyle}>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Date of Birth</label>
                  <input name="dateOfBirth" type="date" value={profileForm.dateOfBirth} onChange={handleProfileFormChange} style={inputStyle} />
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Height Feet</label>
                  <input name="heightFeet" value={profileForm.heightFeet} onChange={handleProfileFormChange} style={inputStyle} />
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Height Inches</label>
                  <input name="heightInches" value={profileForm.heightInches} onChange={handleProfileFormChange} style={inputStyle} />
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Religion</label>
                  <select name="religion" value={profileForm.religion} onChange={handleProfileFormChange} style={inputStyle}>
                    <option value="">Select Religion</option>
                    <option value="Christian">Christian</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Ambedkarist">Ambedkarist</option>
                    <option value="Buddhist">Buddhist</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Sub Caste</label>
                  <select name="subCaste" value={profileForm.subCaste} onChange={handleProfileFormChange} style={inputStyle}>
                    <option value="">Select Sub Caste</option>
                    <option value="SC">SC</option>
                    <option value="BC">BC</option>
                    <option value="OC">OC</option>
                    <option value="NA">NA</option>
                  </select>
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Siblings Count</label>
                  <input name="siblingsCount" value={profileForm.siblingsCount} onChange={handleProfileFormChange} style={inputStyle} />
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Marital Status</label>
                  <select name="maritalStatus" value={profileForm.maritalStatus} onChange={handleProfileFormChange} style={inputStyle}>
                    <option value="">Select Marital Status</option>
                    <option value="Never married">Never married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Awaiting Divorce">Awaiting Divorce</option>
                  </select>
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Father Name</label>
                  <input name="fatherName" value={profileForm.fatherName} onChange={handleProfileFormChange} style={inputStyle} />
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Father Occupation</label>
                  <input name="fatherOccupation" value={profileForm.fatherOccupation} onChange={handleProfileFormChange} style={inputStyle} />
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Mother Name</label>
                  <input name="motherName" value={profileForm.motherName} onChange={handleProfileFormChange} style={inputStyle} />
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Mother Occupation</label>
                  <input name="motherOccupation" value={profileForm.motherOccupation} onChange={handleProfileFormChange} style={inputStyle} />
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Highest Education</label>
                  <select name="highestEducation" value={profileForm.highestEducation} onChange={handleProfileFormChange} style={inputStyle}>
                    <option value="">Select Education</option>
                    <option value="10th Pass">10th Pass</option>
                    <option value="12th Pass">12th Pass</option>
                    <option value="Diploma">Diploma</option>
                    <option value="ITI">ITI</option>
                    <option value="B.A">B.A</option>
                    <option value="B.Sc">B.Sc</option>
                    <option value="B.Com">B.Com</option>
                    <option value="B.Tech">B.Tech</option>
                    <option value="M.A">M.A</option>
                    <option value="M.Sc">M.Sc</option>
                    <option value="M.Com">M.Com</option>
                    <option value="M.Tech">M.Tech</option>
                    <option value="MBA">MBA</option>
                    <option value="MCA">MCA</option>
                    <option value="MBBS">MBBS</option>
                    <option value="BDS">BDS</option>
                    <option value="MD">MD</option>
                    <option value="MS">MS</option>
                    <option value="PhD">PhD</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Field of Study</label>
                  <input name="fieldOfStudy" value={profileForm.fieldOfStudy} onChange={handleProfileFormChange} style={inputStyle} />
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>College</label>
                  <input name="college" value={profileForm.college} onChange={handleProfileFormChange} style={inputStyle} />
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Occupation</label>
                  <input name="occupation" value={profileForm.occupation} onChange={handleProfileFormChange} style={inputStyle} />
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Employment Type</label>
                  <select name="employmentType" value={profileForm.employmentType} onChange={handleProfileFormChange} style={inputStyle}>
                    <option value="">Select Employment Type</option>
                    <option value="private">Private</option>
                    <option value="public">Public</option>
                    <option value="govt">Govt</option>
                    <option value="business">Business</option>
                    <option value="self-employed">Self-employed</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Company Name</label>
                  <input name="companyName" value={profileForm.companyName} onChange={handleProfileFormChange} style={inputStyle} />
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Job Title</label>
                  <input name="jobTitle" value={profileForm.jobTitle} onChange={handleProfileFormChange} style={inputStyle} />
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Job Location</label>
                  <input name="jobLocation" value={profileForm.jobLocation} onChange={handleProfileFormChange} style={inputStyle} />
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Industry</label>
                  <input name="industry" value={profileForm.industry} onChange={handleProfileFormChange} style={inputStyle} />
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Income</label>
                  <input name="income" value={profileForm.income} onChange={handleProfileFormChange} style={inputStyle} />
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Street Name</label>
                  <input name="streetName" value={profileForm.streetName} onChange={handleProfileFormChange} style={inputStyle} />
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>City</label>
                  <input name="city" value={profileForm.city} onChange={handleProfileFormChange} style={inputStyle} />
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>State</label>
                  <input name="state" value={profileForm.state} onChange={handleProfileFormChange} style={inputStyle} />
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Country</label>
                  <input name="country" value={profileForm.country} onChange={handleProfileFormChange} style={inputStyle} />
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Pin Code</label>
                  <input name="pinCode" value={profileForm.pinCode} onChange={handleProfileFormChange} style={inputStyle} />
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>About Me</label>
                  <textarea name="aboutMe" value={profileForm.aboutMe} onChange={handleProfileFormChange} style={inputStyle} rows="4" />
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Show In Search</label>
                  <select
                    name="showInSearch"
                    value={profileForm.showInSearch ? 'true' : 'false'}
                    onChange={(e) =>
                      setProfileForm((prev) => ({
                        ...prev,
                        showInSearch: e.target.value === 'true'
                      }))
                    }
                    style={inputStyle}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <button type="button" style={primaryBtn} onClick={saveProfile} disabled={saving}>
                  {saving ? 'Saving...' : profileMode === 'create' ? 'Create Profile' : 'Save Profile'}
                </button>
                <button type="button" style={secondaryBtn} onClick={() => setSelectedProfile(null)}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
