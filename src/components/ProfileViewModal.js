import React from 'react';

const photoSrc = (p) => (!p ? '' : typeof p === 'string' ? p : p.url || p.imageUrl || '');

const calcAge = (dob) => {
  if (!dob) return '';
  const b = new Date(dob), t = new Date();
  let a = t.getFullYear() - b.getFullYear();
  const m = t.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < b.getDate())) a--;
  return a;
};

const row = { display: 'flex', padding: '6px 0', fontSize: 14, borderBottom: '1px solid #f2f2f2' };
const lbl = { flex: '0 0 150px', color: '#666' };
const val = { flex: 1, fontWeight: 500, color: '#222' };

const R = ({ label, value }) => (
  <div style={row}><div style={lbl}>{label}</div><div style={val}>{value || '-'}</div></div>
);

const H = ({ children }) => (
  <h4 style={{
    margin: '18px 0 8px', fontSize: 14, textTransform: 'uppercase', letterSpacing: 0.5,
    color: '#2196F3', borderBottom: '1px solid #eee', paddingBottom: 6
  }}>{children}</h4>
);

const ProfileViewModal = ({ profile, isAdmin, onClose }) => {
  const [active,setActive] = React.useState(0);
  const photos = profile.photos || [];
  const name = `${profile.firstName || profile.userId?.firstName || ''} ${profile.lastName || profile.userId?.lastName || ''}`.trim();
  const age = calcAge(profile.dateOfBirth);

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 900, overflow: 'auto', padding: 20 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 900, margin: '0 auto', background: '#fff', borderRadius: 12, overflow: 'hidden' }}
      >
        <div style={{
          background: 'linear-gradient(90deg,#2196F3,#21CBF3)', color: '#fff', padding: '16px 22px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 22 }}>{name || 'Member'}</h2>
            <div style={{ fontSize: 13, opacity: 0.95 }}>
              {age ? `${age} yrs` : ''}
              {profile.heightFeet ? ` · ${profile.heightFeet}'${profile.heightInches || 0}"` : ''}
              {profile.currentAddress?.city ? ` · ${profile.currentAddress.city}` : ''}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.25)', border: 'none', color: '#fff',
            width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: 18
          }}>×</button>
        </div>

        <div style={{ display: 'flex', gap: 24, padding: 22, flexWrap: 'wrap' }}>
          <div style={{ flex: '0 0 260px' }}>
            {photos.length ? (
              <>
                <img src={photoSrc(photos[active])} alt={name}
                  style={{ width: '100%', height: 300, objectFit: 'cover', borderRadius: 10, border: '1px solid #ddd' }} />
                {photos.length > 1 && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    {photos.map((p, i) => (
                      <img key={i} src={photoSrc(p)} alt={`t${i}`} onClick={() => setActive(i)}
                        style={{
                          width: 60, height: 60, objectFit: 'cover', borderRadius: 6, cursor: 'pointer',
                          border: i === active ? '3px solid #2196F3' : '1px solid #ddd'
                        }} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div style={{
                height: 300, border: '2px dashed #ccc', borderRadius: 10, display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: '#999'
              }}>No photo</div>
            )}
          </div>

          <div style={{ flex: '1 1 380px', minWidth: 280 }}>
            {isAdmin && (
              <>
                <H>Account (admin only)</H>
                <R label="Profile ID" value={profile.profileId} />
                <R label="Email" value={profile.userId?.email} />
                <R label="Phone" value={profile.userId?.phone} />
                <R label="Status" value={profile.approvalStatus} />
              </>
            )}

            <H>Basic Details</H>
            <R label="Gender" value={profile.gender} />
            <R label="Date of Birth" value={profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString('en-GB') : ''} />
            <R label="Age" value={age ? `${age} years` : ''} />
            <R label="Height" value={`${profile.heightFeet || '-'} ft ${profile.heightInches || 0} in`} />
            <R label="Marital Status" value={profile.maritalStatus} />

            <H>Religion &amp; Family</H>
            <R label="Religion" value={profile.religion} />
            <R label="Caste" value={profile.caste} />
            <R label="Sub Caste" value={profile.subCaste} />
            <R label="Siblings" value={profile.siblingsCount} />
            <R label="Father's Name" value={profile.fatherName} />
            <R label="Father Occupation" value={profile.fatherOccupation} />
            <R label="Mother's Name" value={profile.motherName} />
            <R label="Mother Occupation" value={profile.motherOccupation} />

            <H>Education &amp; Career</H>
            <R label="Education" value={profile.highestEducation} />
            <R label="Field of Study" value={profile.fieldOfStudy} />
            <R label="College" value={profile.college} />
            <R label="Occupation" value={profile.occupation} />
            <R label="Company" value={profile.companyName} />
            <R label="Job Location" value={profile.jobLocation} />
            <R label="Income" value={profile.income ? `${profile.incomeCurrency || 'INR'} ${profile.income}` : ''} />

            <H>Address</H>
            <R label="City" value={profile.currentAddress?.city} />
            <R label="State" value={profile.currentAddress?.state} />
            <R label="Country" value={profile.currentAddress?.country} />

            <H>About &amp; Preference</H>
            <p style={{ fontSize: 14, lineHeight: 1.6 }}>{profile.aboutMe || '-'}</p>
            <R label="Preferred Match" value={profile.preferredMatch} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileViewModal;
