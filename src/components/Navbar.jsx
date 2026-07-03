import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import logo from '../assets/logo.png'
import { useAuth } from '../context/AuthContext'

function UserAvatar({ avatarUrl, name, size }) {
  const s = size || 36
  const initial = (name || 'U').charAt(0).toUpperCase()
  if (avatarUrl) {
    return (
      <img src={avatarUrl} alt={name}
        style={{ width: s, height: s, borderRadius: '9999px', objectFit: 'cover', flexShrink: 0 }} />
    )
  }
  return (
    <div style={{
      width: s, height: s, borderRadius: '9999px', backgroundColor: '#0097FF',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#FFFFFF', fontSize: s * 0.42, fontWeight: '700', flexShrink: 0,
    }}>
      {initial}
    </div>
  )
}

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, setUser } = useAuth()
  const [showCreateDropdown, setShowCreateDropdown] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const createRef = useRef(null)
  const profileRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (createRef.current && !createRef.current.contains(e.target)) setShowCreateDropdown(false)
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfileDropdown(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const meta = user?.user_metadata || {}
  const displayName = meta.full_name || meta.first_name || user?.email?.split('@')[0] || 'User'
  const avatarUrl = meta.avatar_url || null

  const handleLogout = async () => {
    try {
      const { supabase } = await import('../supabaseClient')
      await supabase.auth.signOut()
    } catch {}
    sessionStorage.removeItem('mockUser')
    sessionStorage.removeItem('registrationData')
    setUser(null)
    setShowProfileDropdown(false)
    navigate('/')
  }

  return (
    <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 100px', backgroundColor: '#FFFFFF' }}>

      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
        <img src={logo} alt="EventHive" style={{ height: '36px' }} />
      </Link>

      {/* Center Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
        <Link to="/category?type=All Events"
          style={{ fontSize: '15px', fontWeight: '500', color: location.pathname === '/category' ? '#0097FF' : '#414143', textDecoration: 'none' }}>
          Events
        </Link>
        <Link to="/blog"
          style={{ fontSize: '15px', fontWeight: '500', color: location.pathname === '/blog' ? '#0097FF' : '#414143', textDecoration: 'none' }}>
          Blog
        </Link>
        <Link to="/memes"
          style={{ fontSize: '15px', fontWeight: '500', color: location.pathname === '/memes' ? '#0097FF' : '#414143', textDecoration: 'none' }}>
          Memes
        </Link>
        <Link to="/contact"
  style={{ fontSize: '15px', fontWeight: '500', color: location.pathname === '/contact' ? '#0097FF' : '#414143', textDecoration: 'none' }}>
  Contact Us
</Link>
      </div>

      {/* Right Side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

        {/* Create Event Split Button */}
        <div ref={createRef} style={{ position: 'relative', display: 'flex' }}>
          <button onClick={() => navigate('/events/create')}
            style={{ height: '40px', padding: '0 20px', borderRadius: '8px 0 0 8px', border: 'none', backgroundColor: '#0097FF', color: '#FFFFFF', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            Create Event
          </button>
          <button onClick={() => setShowCreateDropdown(!showCreateDropdown)}
            style={{ height: '40px', width: '36px', borderRadius: '0 8px 8px 0', border: 'none', borderLeft: '1px solid rgba(255,255,255,0.3)', backgroundColor: '#0097FF', color: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5"
              style={{ transform: showCreateDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          {showCreateDropdown && (
            <div style={{ position: 'absolute', top: '48px', right: 0, width: '200px', backgroundColor: '#FFFFFF', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', padding: '8px', zIndex: 100 }}>
              {[
                { label: '📅 Create Event', to: '/events/create' },
                { label: '😂 Upload Meme', to: '/memes/create' },
                { label: '✍️ Write a Blog', to: '/blog/create' },
              ].map((item) => (
                <div key={item.to} onClick={() => { navigate(item.to); setShowCreateDropdown(false) }}
                  style={{ padding: '10px 12px', fontSize: '14px', color: '#414143', cursor: 'pointer', borderRadius: '8px' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F9F9F9' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}>
                  {item.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Auth */}
        {!user ? (
          <button onClick={() => navigate('/login', { state: { backgroundLocation: location } })}
            style={{ height: '40px', padding: '0 20px', borderRadius: '8px', border: '1px solid #E8E8EA', backgroundColor: '#FFFFFF', fontSize: '14px', fontWeight: '500', color: '#141415', cursor: 'pointer' }}>
            Sign In
          </button>
        ) : (
          <div ref={profileRef} style={{ position: 'relative' }}>
            <button onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
              <UserAvatar avatarUrl={avatarUrl} name={displayName} size={36} />
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7E7E82" strokeWidth="2"
                style={{ transform: showProfileDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {showProfileDropdown && (
              <div style={{ position: 'absolute', top: '48px', right: 0, width: '220px', backgroundColor: '#FFFFFF', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', padding: '8px', zIndex: 100 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderBottom: '1px solid #E8E8EA', marginBottom: '6px' }}>
                  <UserAvatar avatarUrl={avatarUrl} name={displayName} size={32} />
                  <div style={{ overflow: 'hidden' }}>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: '#141415', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayName}</p>
                    <p style={{ fontSize: '11px', color: '#7E7E82', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
                  </div>
                </div>
                {[
                  { label: '👤 My Profile', to: '/profile' },
                  { label: '📤 My Uploads', to: '/my-uploads' },
                  { label: '🔖 My Save Box', to: '/saved' },
                ].map((item) => (
                  <div key={item.to} onClick={() => { navigate(item.to); setShowProfileDropdown(false) }}
                    style={{ padding: '10px 12px', fontSize: '14px', color: '#414143', cursor: 'pointer', borderRadius: '8px' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F9F9F9' }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}>
                    {item.label}
                  </div>
                ))}
                <div style={{ height: '1px', backgroundColor: '#E8E8EA', margin: '6px 0' }} />
                <div onClick={handleLogout}
                  style={{ padding: '10px 12px', fontSize: '14px', color: '#AE2012', cursor: 'pointer', borderRadius: '8px', fontWeight: '500' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FFF5F5' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}>
                  🚪 Log Out
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar