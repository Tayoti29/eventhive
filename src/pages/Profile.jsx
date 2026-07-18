import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabaseClient'
import { useIsMobile } from '../hooks/useIsMobile'

function isValidUUID(id) {
  return id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id))
}

function UserAvatar({ avatarUrl, name, size }) {
  const s = size || 96
  const initial = (name || 'U').charAt(0).toUpperCase()
  if (avatarUrl) {
    return <img src={avatarUrl} alt={name} style={{ width: s, height: s, borderRadius: '9999px', objectFit: 'cover', border: '4px solid #FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
  }
  return (
    <div style={{ width: s, height: s, borderRadius: '9999px', backgroundColor: '#0097FF', border: '4px solid #FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: s * 0.4, fontWeight: '700', flexShrink: 0 }}>
      {initial}
    </div>
  )
}

const allCountries = [
  'Afghanistan','Albania','Algeria','Andorra','Angola','Argentina','Armenia','Australia','Austria',
  'Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium','Belize','Benin',
  'Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei','Bulgaria','Burkina Faso',
  'Cambodia','Cameroon','Canada','Chad','Chile','China','Colombia','Congo','Costa Rica',
  'Croatia','Cuba','Cyprus','Czech Republic','Denmark','Dominican Republic','Ecuador','Egypt',
  'El Salvador','Estonia','Ethiopia','Fiji','Finland','France','Gabon','Gambia','Georgia',
  'Germany','Ghana','Greece','Guatemala','Guinea','Haiti','Honduras','Hungary','Iceland',
  'India','Indonesia','Iran','Iraq','Ireland','Israel','Italy','Jamaica','Japan','Jordan',
  'Kazakhstan','Kenya','Kuwait','Laos','Latvia','Lebanon','Libya','Lithuania','Luxembourg',
  'Madagascar','Malawi','Malaysia','Mali','Malta','Mauritania','Mauritius','Mexico','Moldova',
  'Mongolia','Morocco','Mozambique','Myanmar','Namibia','Nepal','Netherlands','New Zealand',
  'Nicaragua','Niger','Nigeria','North Korea','Norway','Oman','Pakistan','Panama','Paraguay',
  'Peru','Philippines','Poland','Portugal','Qatar','Romania','Russia','Rwanda','Saudi Arabia',
  'Senegal','Serbia','Sierra Leone','Singapore','Slovakia','Slovenia','Somalia','South Africa',
  'South Korea','South Sudan','Spain','Sri Lanka','Sudan','Sweden','Switzerland','Syria',
  'Taiwan','Tajikistan','Tanzania','Thailand','Togo','Tunisia','Turkey','Turkmenistan',
  'Uganda','Ukraine','United Arab Emirates','United Kingdom','United States','Uruguay',
  'Uzbekistan','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe',
]

const statesByCountry = {
  Nigeria: ['Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT Abuja','Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara'],
  Ghana: ['Ahafo','Ashanti','Bono','Central','Eastern','Greater Accra','Northern','Upper East','Upper West','Volta','Western'],
  Kenya: ['Nairobi','Mombasa','Kisumu','Nakuru','Eldoret','Thika','Garissa','Kakamega'],
  'South Africa': ['Eastern Cape','Free State','Gauteng','KwaZulu-Natal','Limpopo','Mpumalanga','Northern Cape','North West','Western Cape'],
  'United States': ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'],
  'United Kingdom': ['England','Northern Ireland','Scotland','Wales'],
  Canada: ['Alberta','British Columbia','Manitoba','New Brunswick','Newfoundland and Labrador','Nova Scotia','Ontario','Prince Edward Island','Quebec','Saskatchewan'],
  Australia: ['Australian Capital Territory','New South Wales','Northern Territory','Queensland','South Australia','Tasmania','Victoria','Western Australia'],
  India: ['Andhra Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'],
  Germany: ['Baden-Württemberg','Bavaria','Berlin','Brandenburg','Bremen','Hamburg','Hesse','Lower Saxony','North Rhine-Westphalia','Rhineland-Palatinate','Saarland','Saxony','Saxony-Anhalt','Schleswig-Holstein','Thuringia'],
}

function BackButton({ isMobile }) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  return (
    <button onClick={() => navigate(-1)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ width: isMobile ? '76px' : '92px', height: isMobile ? '34px' : '40px', borderRadius: '8px', border: '1px solid ' + (hovered ? '#F3F3F4' : '#E8E8EA'), backgroundColor: hovered ? '#F9F9F9' : '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', transition: 'all 0.2s ease', marginBottom: isMobile ? '20px' : '32px' }}>
      <svg width={isMobile ? '18' : '20'} height={isMobile ? '18' : '20'} viewBox="0 0 24 24" fill="none" stroke="#141415" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
      <span style={{ fontSize: isMobile ? '13px' : '14px', color: '#141415' }}>Back</span>
    </button>
  )
}

function Profile() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const isMobile = useIsMobile()
  const avatarInputRef = useRef(null)

  const [avatarPreview, setAvatarPreview] = useState(null)
  const [avatarFile, setAvatarFile] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [dbProfile, setDbProfile] = useState(null)
  const [profile, setProfile] = useState({
    firstName: '', lastName: '', username: '', email: '', bio: '', country: '', state: '', city: '', company: '',
    avatarUrl: null, lastEdited: null,
  })
  const [editForm, setEditForm] = useState({})

  useEffect(() => {
    if (!user) return
    const regStr = sessionStorage.getItem('registrationData')
    const reg = regStr ? JSON.parse(regStr) : {}
    const meta = user.user_metadata || {}
    const fullName = meta.full_name || ''
    const parts = fullName.trim().split(' ')

    const initial = {
      firstName: meta.first_name || reg.firstName || parts[0] || '',
      lastName: meta.last_name || reg.lastName || parts.slice(1).join(' ') || '',
      username: meta.username || reg.username || '',
      email: user.email || reg.email || '',
      bio: meta.bio || '',
      country: meta.country || reg.country || '',
      state: meta.state || reg.state || '',
      city: meta.city || reg.city || '',
      company: meta.company || '',
      avatarUrl: meta.avatar_url || null,
      lastEdited: null,
    }
    setProfile(initial)
    setAvatarPreview(initial.avatarUrl)
    loadProfileFromDB()
  }, [user])

  const loadProfileFromDB = async () => {
    if (!isValidUUID(user?.id)) return
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('user_id', user.id).single()
      if (!error && data) {
        setDbProfile(data)
        setProfile((prev) => ({
          ...prev,
          username: data.username || prev.username,
          bio: data.bio || prev.bio,
          country: data.country || prev.country,
          state: data.state || prev.state,
          city: data.city || prev.city,
          company: data.company || prev.company,
          lastEdited: data.last_edited || null,
        }))
        if (data.avatar_url) setAvatarPreview(data.avatar_url)
      }
    } catch {}
  }

  const canEdit = () => {
    if (!profile.lastEdited) return true
    return (Date.now() - new Date(profile.lastEdited).getTime()) / (1000 * 60 * 60 * 24) >= 21
  }
  const daysUntilEdit = () => {
    if (!profile.lastEdited) return 0
    return Math.ceil(21 - (Date.now() - new Date(profile.lastEdited).getTime()) / (1000 * 60 * 60 * 24))
  }

  const openEditModal = () => { setEditForm({ ...profile }); setShowEditModal(true) }

  const handleAvatarChange = (file) => {
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { alert('Max 5MB'); return }
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      let avatarUrl = avatarPreview
      if (avatarFile && isValidUUID(user?.id)) {
        const fileExt = avatarFile.name.split('.').pop()
        const fileName = 'avatars/' + user.id + '.' + fileExt
        const { error } = await supabase.storage.from('event-images').upload(fileName, avatarFile, { upsert: true, contentType: avatarFile.type })
        if (!error) {
          const { data: urlData } = supabase.storage.from('event-images').getPublicUrl(fileName)
          avatarUrl = urlData.publicUrl
        }
      }
      const profileData = {
        user_id: isValidUUID(user?.id) ? user.id : null,
        first_name: editForm.firstName, last_name: editForm.lastName,
        username: editForm.username, email: editForm.email,
        bio: editForm.bio, country: editForm.country, state: editForm.state, city: editForm.city,
        company: editForm.company, avatar_url: avatarUrl || null, last_edited: new Date().toISOString(),
      }
      if (isValidUUID(user?.id)) {
        if (dbProfile) await supabase.from('profiles').update(profileData).eq('user_id', user.id)
        else await supabase.from('profiles').insert([profileData])
        setDbProfile(profileData)
      }
      setProfile({ ...editForm, lastEdited: new Date().toISOString() })
      setAvatarPreview(avatarUrl)
      setShowEditModal(false)
      setSuccessMsg('Profile updated successfully!')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) { console.error(err) }
    setSaving(false)
  }

  const displayName = [profile.firstName, profile.lastName].filter(Boolean).join(' ') || user?.email?.split('@')[0] || 'User'
  const availableStates = statesByCountry[editForm.country] || []

  // New-user prompt: show when bio hasn't been filled in yet
  const needsProfileCompletion = !profile.bio || !profile.bio.trim()

  const inputStyle = { width: '100%', height: isMobile ? '46px' : '44px', borderRadius: '8px', border: '1px solid #E8E8EA', padding: '0 14px', fontSize: isMobile ? '15px' : '14px', color: '#414143', outline: 'none', boxSizing: 'border-box', backgroundColor: '#FFFFFF' }
  const readOnlyStyle = { ...inputStyle, backgroundColor: '#F9F9F9', color: '#A5A5AA', cursor: 'not-allowed' }
  const labelStyle = { fontSize: '14px', fontWeight: '600', color: '#141415', display: 'block', marginBottom: '6px' }

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      {successMsg && (
        <div style={{ position: 'fixed', top: isMobile ? '16px' : '24px', right: isMobile ? '16px' : '24px', left: isMobile ? '16px' : 'auto', zIndex: 3000, backgroundColor: '#141415', color: '#FFFFFF', borderRadius: '12px', padding: '14px 24px', fontSize: '14px', fontWeight: '500', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>✅</span> {successMsg}
        </div>
      )}

      <div style={{ maxWidth: '1440px', margin: '0 auto' }}><Navbar /></div>

      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: isMobile ? '20px 20px 60px' : '32px 100px 80px' }}>
        <BackButton isMobile={isMobile} />

        {/* Header Card */}
        <div style={{ borderRadius: isMobile ? '18px' : '24px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: isMobile ? '24px' : '32px' }}>
          <div style={{ height: isMobile ? '110px' : '180px', background: 'linear-gradient(135deg, #0097FF 0%, #00C6FF 50%, #FED86E 100%)' }} />
          <div style={{ backgroundColor: '#FFFFFF', padding: isMobile ? '0 20px 24px' : '0 40px 32px' }}>
            <div style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'flex-end', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', marginTop: isMobile ? '-40px' : '-48px', marginBottom: '20px', gap: isMobile ? '14px' : 0 }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <UserAvatar avatarUrl={avatarPreview} name={displayName} size={isMobile ? 80 : 96} />
                <button onClick={() => avatarInputRef.current?.click()}
                  style={{ position: 'absolute', bottom: '2px', right: '2px', width: '28px', height: '28px', borderRadius: '9999px', backgroundColor: '#0097FF', border: '2px solid #FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <input ref={avatarInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleAvatarChange(e.target.files[0])} />
              </div>
            </div>

            <h2 style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: '700', color: '#141415', margin: '0 0 4px' }}>{displayName}</h2>
            {profile.username && <p style={{ fontSize: isMobile ? '13px' : '14px', color: '#7E7E82', margin: '0 0 4px' }}>@{profile.username.replace('@', '')}</p>}
            <p style={{ fontSize: isMobile ? '13px' : '14px', color: '#7E7E82', margin: '0 0 12px' }}>{profile.email}</p>
            {profile.bio && <p style={{ fontSize: isMobile ? '14px' : '15px', color: '#414143', margin: '0 0 12px', maxWidth: '600px' }}>{profile.bio}</p>}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {(profile.city || profile.state || profile.country) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>📍</span>
                  <span style={{ fontSize: '13px', color: '#59595C' }}>{[profile.city, profile.state, profile.country].filter(Boolean).join(', ')}</span>
                </div>
              )}
              {profile.company && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>🏢</span>
                  <span style={{ fontSize: '13px', color: '#59595C' }}>{profile.company}</span>
                </div>
              )}
            </div>

            {/* Complete your Profile Information notice — shown above the Edit Profile button */}
            {needsProfileCompletion && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: isMobile ? '14px' : '16px 20px',
                borderRadius: '12px', backgroundColor: '#FFFCF4', border: '1px solid #FED86E', marginBottom: '16px',
              }}>
                <span style={{ fontSize: '20px', flexShrink: 0 }}>✨</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: isMobile ? '13px' : '14px', fontWeight: '600', color: '#141415', margin: '0 0 2px' }}>Complete your Profile Information</p>
                  <p style={{ fontSize: isMobile ? '12px' : '13px', color: '#7E7E82', margin: 0 }}>Add a bio to help others get to know you better.</p>
                </div>
              </div>
            )}

            <button onClick={openEditModal}
              style={{ width: isMobile ? '100%' : 'auto', height: isMobile ? '44px' : '40px', padding: '0 20px', borderRadius: '8px', border: '1px solid #E8E8EA', backgroundColor: '#FFFFFF', fontSize: '14px', color: '#141415', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#141415" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Edit Profile
            </button>

            {!canEdit() && <p style={{ fontSize: '12px', color: '#A5A5AA', marginTop: '12px' }}>⏳ You can edit your profile again in {daysUntilEdit()} days</p>}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '14px' : '20px', marginBottom: isMobile ? '24px' : '32px' }}>
          {[
            { title: 'My Saved Box', desc: 'View and manage your saved events, memes and blogs', icon: '🔖', color: '#EFF9FF', border: '#0097FF', to: '/saved' },
            { title: 'My Uploads', desc: 'Manage your created events, memes and blogs', icon: '📤', color: '#FFFCF4', border: '#FFB900', to: '/my-uploads' },
          ].map((card) => (
            <div key={card.title} onClick={() => navigate(card.to)}
              style={{ borderRadius: '16px', padding: isMobile ? '20px' : '24px', cursor: 'pointer', backgroundColor: card.color, border: '1px solid ' + card.border + '33' }}>
              <div style={{ fontSize: isMobile ? '28px' : '32px', marginBottom: '12px' }}>{card.icon}</div>
              <h3 style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '700', color: '#141415', margin: '0 0 6px' }}>{card.title}</h3>
              <p style={{ fontSize: isMobile ? '13px' : '14px', color: '#59595C', margin: 0 }}>{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Create Content */}
        <div style={{ borderRadius: '16px', padding: isMobile ? '24px 20px' : '32px', backgroundColor: '#F9F9F9', border: '1px solid #E8E8EA', textAlign: 'center' }}>
          <h3 style={{ fontSize: isMobile ? '17px' : '20px', fontWeight: '700', color: '#141415', marginBottom: '8px' }}>Create Something</h3>
          <p style={{ fontSize: isMobile ? '13px' : '14px', color: '#7E7E82', marginBottom: '24px' }}>Share events, memes or blogs with the community</p>
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '12px', justifyContent: 'center' }}>
            {[
              { label: '📅 Create Event', to: '/events/create', bg: '#0097FF', color: '#FFFFFF', border: 'none' },
              { label: '😂 Upload Meme', to: '/memes/create', bg: '#FFFFFF', color: '#414143', border: '1px solid #E8E8EA' },
              { label: '✍️ Write Blog', to: '/blog/create', bg: '#FFFFFF', color: '#414143', border: '1px solid #E8E8EA' },
            ].map((btn) => (
              <button key={btn.to} onClick={() => navigate(btn.to)}
                style={{ height: isMobile ? '46px' : '44px', padding: '0 20px', borderRadius: '8px', backgroundColor: btn.bg, color: btn.color, border: btn.border, cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1440px', margin: '0 auto' }}><Footer /></div>

      {/* Edit Modal */}
      {showEditModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,12,20,0.75)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '0 24px' : 0 }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowEditModal(false) }}>
          <div style={{ width: isMobile ? '100%' : '560px', maxHeight: '85vh', backgroundColor: '#FFFFFF', borderRadius: isMobile ? '18px' : '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? '20px 24px' : '24px 32px', borderBottom: '1px solid #E8E8EA' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#141415', margin: 0 }}>Edit Profile</h3>
              <button onClick={() => setShowEditModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#7E7E82' }}>✕</button>
            </div>
            <div style={{ overflowY: 'auto', padding: isMobile ? '24px' : '32px', flex: 1 }}>
              {!canEdit() && (
                <div style={{ backgroundColor: '#FFF6DE', border: '1px solid #FED86E', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#B88700' }}>
                  ⚠️ You can edit again in {daysUntilEdit()} days.
                </div>
              )}
              <p style={{ fontSize: '12px', fontWeight: '600', color: '#A5A5AA', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Account Info (cannot be changed)</p>
              <div style={{ display: isMobile ? 'flex' : 'grid', flexDirection: isMobile ? 'column' : undefined, gridTemplateColumns: isMobile ? undefined : '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div><label style={labelStyle}>First Name</label><input value={editForm.firstName || ''} readOnly style={readOnlyStyle} /></div>
                <div><label style={labelStyle}>Last Name</label><input value={editForm.lastName || ''} readOnly style={readOnlyStyle} /></div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Email Address</label>
                <input value={editForm.email || ''} readOnly style={readOnlyStyle} />
              </div>
              <div style={{ height: '1px', backgroundColor: '#E8E8EA', marginBottom: '20px' }} />
              <p style={{ fontSize: '12px', fontWeight: '600', color: '#A5A5AA', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Profile Details (editable)</p>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Username</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#A5A5AA', fontSize: '14px' }}>@</span>
                  <input type="text" placeholder="yourusername" value={(editForm.username || '').replace('@', '')}
                    onChange={(e) => setEditForm((p) => ({ ...p, username: e.target.value }))}
                    disabled={!canEdit()} style={{ ...(!canEdit() ? readOnlyStyle : inputStyle), paddingLeft: '28px' }} />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Bio</label>
                <textarea placeholder="Tell us about yourself..." maxLength={100} value={editForm.bio || ''}
                  onChange={(e) => setEditForm((p) => ({ ...p, bio: e.target.value }))}
                  disabled={!canEdit()} rows={3}
                  style={{ width: '100%', borderRadius: '8px', border: '1px solid #E8E8EA', padding: '10px 14px', fontSize: isMobile ? '15px' : '14px', color: '#414143', outline: 'none', boxSizing: 'border-box', resize: 'none', fontFamily: 'inherit', backgroundColor: canEdit() ? '#FFFFFF' : '#F9F9F9' }} />
                <span style={{ fontSize: '11px', color: '#A5A5AA' }}>{(editForm.bio || '').length}/100</span>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Country</label>
                <select value={editForm.country || ''}
                  onChange={(e) => setEditForm((p) => ({ ...p, country: e.target.value, state: '', city: '' }))}
                  disabled={!canEdit()} style={{ ...(!canEdit() ? readOnlyStyle : inputStyle), cursor: 'pointer' }}>
                  <option value="">Select country</option>
                  {allCountries.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>State / Province</label>
                {availableStates.length > 0 ? (
                  <select value={editForm.state || ''} onChange={(e) => setEditForm((p) => ({ ...p, state: e.target.value }))}
                    disabled={!canEdit()} style={{ ...(!canEdit() ? readOnlyStyle : inputStyle), cursor: 'pointer' }}>
                    <option value="">Select state</option>
                    {availableStates.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                ) : (
                  <input type="text" placeholder="Enter state / province" value={editForm.state || ''}
                    onChange={(e) => setEditForm((p) => ({ ...p, state: e.target.value }))}
                    disabled={!canEdit()} style={!canEdit() ? readOnlyStyle : inputStyle} />
                )}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>City</label>
                <input type="text" placeholder="Enter your city" value={editForm.city || ''}
                  onChange={(e) => setEditForm((p) => ({ ...p, city: e.target.value }))}
                  disabled={!canEdit()} style={!canEdit() ? readOnlyStyle : inputStyle} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Company / Organisation (optional)</label>
                <input type="text" placeholder="Where do you work?" value={editForm.company || ''}
                  onChange={(e) => setEditForm((p) => ({ ...p, company: e.target.value }))}
                  disabled={!canEdit()} style={!canEdit() ? readOnlyStyle : inputStyle} />
              </div>
            </div>
            <div style={{ padding: isMobile ? '16px 24px' : '20px 32px', borderTop: '1px solid #E8E8EA', display: 'flex', flexDirection: isMobile ? 'column-reverse' : 'row', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setShowEditModal(false)}
                style={{ height: '44px', padding: '0 24px', borderRadius: '8px', border: '1px solid #E8E8EA', backgroundColor: '#FFFFFF', fontSize: '14px', color: '#414143', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={handleSaveProfile} disabled={saving || !canEdit()}
                style={{ height: '44px', padding: '0 24px', borderRadius: '8px', border: 'none', backgroundColor: canEdit() ? '#0097FF' : '#C7C7CA', color: '#FFFFFF', fontSize: '14px', fontWeight: '600', cursor: canEdit() ? 'pointer' : 'not-allowed' }}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile