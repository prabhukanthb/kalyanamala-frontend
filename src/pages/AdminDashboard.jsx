import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const API_BASE = 'https://kalyanamala-backend-production.up.railway.app';

const AdminDashboard = () => {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [users,setUsers] = useState([]);
  const [profiles,setProfiles] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState('');

  const headers = {
    Authorization: `Bearer ${token}`
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersRes,profilesRes] = await Promise.all([
        axios.get(`${API_BASE}/api/users`, { headers }),
        axios.get(`${API_BASE}/api/profiles`, { headers })
      ]);

      setUsers(usersRes.data.users || []);
      setProfiles(profilesRes.data.profiles || []);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    loadData();
  }, [token,navigate]);

  const handleApprove = async (profileId) => {
    try {
      await axios.put(`${API_BASE}/api/profiles/${profileId}/approve`, {}, { headers });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve profile');
    }
  };

  const handleReject = async (profileId) => {
    const rejectedReason = prompt('Enter rejection reason:');
    if (!rejectedReason) return;

    try {
      await axios.put(`${API_BASE}/api/profiles/${profileId}/reject`, { rejectedReason }, { headers });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject profile');
    }
  };

  const handleDelete = async (profileId) => {
    if (!window.confirm('Delete this profile?')) return;

    try {
      await axios.delete(`${API_BASE}/api/profiles/${profileId}`, { headers });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete profile');
    }
  };

  if (loading) {
    return <div style={{ padding: '30px' }}>Loading admin dashboard...</div>;
  }

  return (
    <div style={{ maxWidth: '1300px', margin: '30px auto', padding: '20px' }}>
      <h2>Admin Dashboard</h2>

      {error && (
        <div style={{ background: '#ffebee', color: 'red', padding: '10px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => navigate('/profile')} style={{ padding: '10px 16px', marginRight: '10px' }}>
          Open Profile Page
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
        <section style={{ border: '1px solid #ddd', padding: '16px', borderRadius: '8px' }}>
          <h3>Users ({users.length})</h3>
          <table width="100%" border="1" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Surname</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.firstName || '-'}</td>
                  <td>{u.surname || '-'}</td>
                  <td>{u.email || '-'}</td>
                  <td>{u.phone || '-'}</td>
                  <td>{u.role || '-'}</td>
                  <td>{u.status || '-'}</td>
                  <td>
                    <button onClick={() => navigate(`/admin/users/${u._id}/edit`)}>
                      Edit User
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section style={{ border: '1px solid #ddd', padding: '16px', borderRadius: '8px' }}>
          <h3>Profiles ({profiles.length})</h3>
          <table width="100%" border="1" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Profile ID</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Religion</th>
                <th>Marital Status</th>
                <th>Status</th>
                <th>Show in Search</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((p) => (
                <tr key={p._id}>
                  <td>{p.profileId || '-'}</td>
                  <td>
                    {p.userId?.firstName || ''} {p.userId?.lastName || ''}
                  </td>
                  <td>{p.gender || '-'}</td>
                  <td>{p.religion || '-'}</td>
                  <td>{p.maritalStatus || '-'}</td>
                  <td>{p.approvalStatus || '-'}</td>
                  <td>{p.showInSearch ? 'Yes' : 'No'}</td>
                  <td>
                    <button onClick={() => navigate(`/admin/profiles/${p._id}/edit`)}>
                      Edit
                    </button>
                    <button onClick={() => handleApprove(p._id)} style={{ marginLeft: '8px' }}>
                      Approve
                    </button>
                    <button onClick={() => handleReject(p._id)} style={{ marginLeft: '8px' }}>
                      Reject
                    </button>
                    <button onClick={() => handleDelete(p._id)} style={{ marginLeft: '8px' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
