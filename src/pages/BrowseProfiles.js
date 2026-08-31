import React, { useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import ProfileDownloadCard from '../components/ProfileDownloadCard';

const API_BASE = 'https://kalyanamala-backend-production.up.railway.app';

const calcAge = (dob) => {
  if (!dob) return null;
  const b = new Date(dob), t = new Date();
  let a = t.getFullYear() - b.getFullYear();
  const m = t.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < b.getDate())) a--;
  return a;
};

const photoSrc = (p) => (!p ? '' : typeof p === 'string' ? p : p.url || p.imageUrl || '');

const primaryPhoto = (list) => {
  const arr = list || [];
  const primary = arr.find((p) => typeof p === 'object' && p.isPrimary);
  return photoSrc(primary || arr[0]);
};

const box = { border: '1px solid #e0e0e0', borderRadius: 10, background: '#fff', padding: 16, marginBottom: 16 };
const input = { padding: '9px 12px', border: '1px solid #ccc', borderRadius: 6, boxSizing: 'border-box' };
const btn = { padding: '9px 18px', background: '#2196F3', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' };
const ghostBtn = { ...btn, background: '#fff', color: '#2196F3', border: '1px solid #2196F3' };

const BrowseProfiles = () => {
  const { token, user } = useContext(AuthContext);

  const [me,setMe] = useState(null);
  const [results,setResults] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState('');
  const [query,setQuery] = useState('');
  const [searchBy,setSearchBy] = useState('name');
  const [selected,setSelected] = useState(null);

  const role = user?.role || (user?.isAdmin ? 'admin' : 'member');
  const isAdmin = role === 'admin' || role === 'subadmin';
  const canDownload = isAdmin || role === 'premium' || user?.isPremium === true;

  const myAge = useMemo(() => calcAge(me?.dateOfBirth), [me]);

  useEffect(() => {
    const load = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        if (!isAdmin) {
          const mine = await axios.get(`${API_BASE}/api/profiles/me`, { headers });
          setMe(mine.data.profile);
        }

        const res = await axios.get(`${API_BASE}/api/profiles/browse`, { headers });
        setResults(res.data.profiles || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profiles');
      } finally {
        setLoading(false);
      }
    };
    if (token) load();
  }, [token,isAdmin]);

  // client-side guard mirroring the server rules
  const visible = useMemo(() => {
    if (isAdmin) return results;
    if (!me || !myAge) return [];

    return results.filter((p) => {
      const a = calcAge(p.dateOfBirth);
      if (!a) return false;

      if (me.gender === 'female') {
        return p.gender === 'male' && a > myAge;
      }
      if (me.gender === 'male') {
        return p.gender === 'female' && a <= myAge;
      }
      return false;
    });
  }, [results,me,myAge,isAdmin]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return visible;

    return visible.filter((p) => {
      if (searchBy === 'id') {
        const id = String(p.profileId || '');
        return id.slice(-6).toLowerCase().includes(q) || id.toLowerCase().includes(q);
      }
      const name = `${p.firstName || p.user?.firstName || ''} ${p.lastName || p.user?.lastName || ''}`.toLowerCase();
      return name.includes(q);
    });
  }, [visible,query,searchBy]);

  if (loading) return <div style={{ padding: 40 }}>Loading profiles…</div>;

  return (
    <div style={{ maxWidth: 1100, margin: '30px auto', padding: 20 }}>
      <h2>Browse Profiles</h2>

      {error && (
        <div style={{ color: 'red', padding: 10, background: '#ffebee', borderRadius: 6, marginBottom: 15 }}>
          {error}
        </div>
      )}

      {!isAdmin && me && (
        <p style={{ color: '#666', fontSize: 14 }}>
          {me.gender === 'female'
            ? `Showing male profiles above your age (${myAge}).`
            : `Showing female profiles aged ${myAge} or below.`}
        </p>
      )}

      <div style={{ ...box, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        {isAdmin && (
          <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)} style={input}>
            <option value="name">Search by Name</option>
            <option value="id">Search by Profile ID (last 6)</option>
          </select>
        )}
        <input
          style={{ ...input, flex: 1, minWidth: 220 }}
          placeholder={searchBy === 'id' ? 'Last 6 digits of profile ID' : 'Name'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && <button style={ghostBtn} onClick={() => setQuery('')}>Clear</button>}
      </div>

      <p style={{ color: '#777', fontSize: 13 }}>{filtered.length} profile(s) found</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
        {filtered.map((p) => {
          const img = primaryPhoto(p.photos);
          const name = `${p.firstName || p.user?.firstName || ''} ${p.lastName || p.user?.lastName || ''}`.trim();
          return (
            <div key={p._id || p.profileId} style={{ ...box, padding: 0, overflow: 'hidden' }}>
              {img ? (
                <img src={img} alt={name} style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }} />
              ) : (
                <div style={{ height: 220, background: '#f2f2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>
                  No photo
                </div>
              )}
              <div style={{ padding: 14 }}>
                <div style={{ fontWeight: 600, fontSize: 16 }}>{name || 'Member'}</div>
                <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>
                  {calcAge(p.dateOfBirth)} yrs · {p.heightFeet}′{p.heightInches || 0}″
                </div>
                <div style={{ fontSize: 13, color: '#666' }}>
                  {p.occupation} · {p.currentAddress?.city}
                </div>
                <div style={{ fontSize: 12, color: '#999', marginTop: 6 }}>
                  ID: {String(p.profileId || '').slice(-6)}
                </div>

                {canDownload && (
                  <button style={{ ...ghostBtn, marginTop: 12, width: '100%' }} onClick={() => setSelected(p)}>
                    Download card
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selected && (
        <ProfileDownloadCard profile={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};

export default BrowseProfiles;
