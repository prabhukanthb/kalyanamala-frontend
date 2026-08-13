import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'https://kalyanamala-backend-production.up.railway.app';

const pageStyle = {
  maxWidth: '1200px',
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

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: '12px',
  marginBottom: '20px'
};

const statCardStyle = {
  ...cardStyle,
  textAlign: 'center'
};

const buttonStyle = {
  padding: '10px 14px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  marginRight: '8px'
};

const primaryBtn = {
  ...buttonStyle,
  background: '#2196F3',
  color: '#fff'
};

const successBtn = {
  ...buttonStyle,
  background: '#2e7d32',
  color: '#fff'
};

const dangerBtn = {
  ...buttonStyle,
  background: '#c62828',
  color: '#fff'
};

const secondaryBtn = {
  ...buttonStyle,
  background: '#666',
  color: '#fff'
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '12px',
  boxSizing: 'border-box'
};

const AdminDashboard = () => {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading,setLoading] = useState(true);
  const [error,setError] = useState('');
  const [stats,setStats] = useState(null);

  const [users,setUsers] = useState([]);
  const [profiles,setProfiles] = useState([]);

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
  const [profileAction,setProfileAction] = useState({
    status: 'approved',
    reason: ''
  });

  const [activeTab,setActiveTab] = useState('dashboard');
  const [saving,setSaving] = useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!token) {
        setError('Please login again.');
        setLoading(false);
        return;
      }

      try {
        const [statsRes,usersRes,profilesRes] = await Promise.all([
          axios.get(`${API_BASE}/api/admin/dashboard/stats`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_BASE}/api/admin/users`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_BASE}/api/admin/profiles`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setStats(statsRes.data.stats);
        setUsers(usersRes.data.users || []);
        setProfiles(profilesRes.data.profiles || []);
      } catch (err) {
        if (err.response?.status === 403) {
          setError('You do not have admin access.');
          navigate('/');
        } else {
          setError(err.response?.data?.message || err.response?.data?.error || 'Failed to load admin dashboard');
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [token,navigate]);

  const refreshData = async () => {
    try {
      setLoading(true);
      const [statsRes,usersRes,profilesRes] = await Promise.all([
        axios.get(`${API_BASE}/api/admin/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_BASE}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_BASE}/api/admin/profiles`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users || []);
      setProfiles(profilesRes.data.profiles || []);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to refresh data');
    } finally {
      setLoading(false);
    }
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
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert('User updated successfully');
      setSelectedUser(null);
      await refreshData();
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data?.error || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleProfileActionClick = (p, status) => {
    setSelectedProfile(p);
    setProfileAction({
      status,
      reason: ''
    });
  };

  const submitProfileStatus = async () => {
    if (!selectedProfile) return;

    setSaving(true);
    try {
      await axios.put(
        `${API_BASE}/api/admin/profiles/${selectedProfile._id}/status`,
        {
          status: profileAction.status,
          reason: profileAction.reason
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert('Profile status updated successfully');
      setSelectedProfile(null);
      await refreshData();
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };

  if (loading) {
    return <div style={pageStyle}>Loading admin dashboard...</div>;
  }

  return (
    <div style={pageStyle}>
      <div style={{ marginBottom: '20px' }}>
        <h2>Admin Dashboard</h2>
        <p>Welcome, {user?.firstName || 'Admin'}!</p>

        <div style={{ marginTop: '10px' }}>
          <button style={primaryBtn} onClick={() => setActiveTab('dashboard')}>
            Dashboard
          </button>
          <button style={secondaryBtn} onClick={() => setActiveTab('users')}>
            Users
          </button>
          <button style={secondaryBtn} onClick={() => setActiveTab('profiles')}>
            Profiles
          </button>
          <button style={dangerBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div style={{ ...cardStyle, background: '#ffebee', color: '#b71c1c' }}>
          {error}
        </div>
      )}

      {activeTab === 'dashboard' && stats && (
        <>
          <div style={gridStyle}>
            <div style={statCardStyle}>
              <h3>{stats.totalUsers}</h3>
              <p>Total Users</p>
            </div>
            <div style={statCardStyle}>
              <h3>{stats.totalProfiles}</h3>
              <p>Total Profiles</p>
            </div>
            <div style={statCardStyle}>
              <h3>{stats.approvedProfiles}</h3>
              <p>Approved Profiles</p>
            </div>
            <div style={statCardStyle}>
              <h3>{stats.pendingProfiles}</h3>
              <p>Pending Profiles</p>
            </div>
            <div style={statCardStyle}>
              <h3>{stats.rejectedProfiles}</h3>
              <p>Rejected Profiles</p>
            </div>
            <div style={statCardStyle}>
              <h3>{stats.deletedProfiles}</h3>
              <p>Deleted Profiles</p>
            </div>
            <div style={statCardStyle}>
              <h3>{stats.activeUsers}</h3>
              <p>Active Users</p>
            </div>
            <div style={statCardStyle}>
              <h3>{stats.newUsersToday}</h3>
              <p>New Users Today</p>
            </div>
          </div>

          <div style={cardStyle}>
            <button style={primaryBtn} onClick={refreshData}>
              Refresh Dashboard
            </button>
          </div>
        </>
      )}

      {activeTab === 'users' && (
        <div>
          <div style={cardStyle}>
            <h3>Users</h3>
            <button style={primaryBtn} onClick={refreshData}>
              Refresh Users
            </button>
          </div>

          {users.map((u) => (
            <div key={u.id} style={cardStyle}>
              <p><strong>Name:</strong> {u.firstName} {u.lastName} {u.surname ? `(${u.surname})` : ''}</p>
              <p><strong>Email:</strong> {u.email}</p>
              <p><strong>Phone:</strong> {u.phone}</p>
              <p><strong>Role:</strong> {u.role}</p>
              <p><strong>Status:</strong> {u.status}</p>

              <button style={primaryBtn} onClick={() => handleUserEditClick(u)}>
                Edit User
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'profiles' && (
        <div>
          <div style={cardStyle}>
            <h3>Profiles</h3>
            <button style={primaryBtn} onClick={refreshData}>
              Refresh Profiles
            </button>
          </div>

          {profiles.map((p) => (
            <div key={p._id} style={cardStyle}>
              <p><strong>Profile ID:</strong> {p.profileId || '-'}</p>
              <p><strong>Name:</strong> {p.fullName || `${p.userId?.firstName || ''} ${p.userId?.lastName || ''}`}</p>
              <p><strong>Email:</strong> {p.userId?.email || '-'}</p>
              <p><strong>Phone:</strong> {p.userId?.phone || '-'}</p>
              <p><strong>Gender:</strong> {p.gender}</p>
              <p><strong>Religion:</strong> {p.religion}</p>
              <p><strong>City:</strong> {p.currentAddress?.city || '-'}</p>
              <p><strong>State:</strong> {p.currentAddress?.state || '-'}</p>
              <p><strong>Status:</strong> {p.approvalStatus}</p>

              <button style={successBtn} onClick={() => handleProfileActionClick(p, 'approved')}>
                Approve
              </button>
              <button style={dangerBtn} onClick={() => handleProfileActionClick(p, 'rejected')}>
                Reject
              </button>
              <button style={secondaryBtn} onClick={() => handleProfileActionClick(p, 'deleted')}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedUser && (
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

      {selectedProfile && (
        <div style={cardStyle}>
          <h3>Update Profile Status</h3>
          <p><strong>Profile:</strong> {selectedProfile.fullName || selectedProfile.profileId}</p>

          <label>Status</label>
          <select
            value={profileAction.status}
            onChange={(e) => setProfileAction((prev) => ({ ...prev, status: e.target.value }))}
            style={inputStyle}
          >
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="deleted">Deleted</option>
          </select>

          <label>Reason</label>
          <textarea
            value={profileAction.reason}
            onChange={(e) => setProfileAction((prev) => ({ ...prev, reason: e.target.value }))}
            style={inputStyle}
            rows="4"
          />

          <button type="button" style={primaryBtn} onClick={submitProfileStatus} disabled={saving}>
            {saving ? 'Saving...' : 'Update Profile'}
          </button>
          <button type="button" style={secondaryBtn} onClick={() => setSelectedProfile(null)}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
