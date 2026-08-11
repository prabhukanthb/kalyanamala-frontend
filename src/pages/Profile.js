import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const API_BASE = 'https://kalyanamala-backend-production.up.railway.app';

const Profile = () => {
  const { token, user } = useContext(AuthContext);
  const [profile,setProfile] = useState(null);
  const [error,setError] = useState('');
  const [loading,setLoading] = useState(true);
  const [form,setForm] = useState({
    gender: '',
    dateOfBirth: '',
    height: '',
    religion: '',
    caste: '',
    occupation: '',
    education: '',
    income: '',
    city: '',
    state: '',
    country: 'India',
    about: ''
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/profiles/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data.profile);
        const p = res.data.profile;
        setForm({
          gender: p.gender || '',
          dateOfBirth: p.dateOfBirth ? p.dateOfBirth.substring(0, 10) : '',
          height: p.height || '',
          religion: p.religion || '',
          caste: p.caste || '',
          occupation: p.occupation || '',
          education: p.education || '',
          income: p.income?.toString() || '',
          city: p.location?.city || '',
          state: p.location?.state || '',
          country: p.location?.country || 'India',
          about: p.about || ''
        });
      } catch (err) {
        if (err.response?.status !== 404) {
          setError(err.response?.data?.message || err.response?.data?.error || 'Failed to load profile');
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) load();
    else {
      setLoading(false);
      setError('Please login again');
    }
  }, [token]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const
