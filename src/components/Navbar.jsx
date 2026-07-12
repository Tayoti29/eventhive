import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import logo from '../assets/logo.png'
import { useAuth } from '../context/AuthContext'
import { useIsMobile } from '../hooks/useIsMobile'

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
  const isMobile = useIsMobile()

  const [showCreateDropdown, setShowCreateDropdown] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
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

  // Close the mobile flyover automatically if the screen grows past mobile size
  useEffect(() => { if (!isMobile) setShowMobileMenu(false) }, [isMobile])

  // Lock body scroll while the flyover is open
  useEffect(() => {
    document.body.style.overflow = showMobileMenu ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [showMobileMenu])

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
    setShowMobileMenu(false)
    navigate('/')
  }

  const navLinks = [
    { label: 'Events', to: '/category?type=All Events', match: '/category' },
    { label: 'Blog', to: '/blog', match: '/blog' },
    { label: 'Memes', to: '/memes', match: '/memes' },
    { label: 'Contact Us', to: '/contact', match: '/contact' },
  ]

  const createLinks = [
    { label: '📅 Create Event', to: '/events/create' },
    { label: '😂 Upload Meme', to: '/memes/create' },
    { label: '✍️ Write a Blog', to: '/blog/create' },
  ]

  const profileLinks = [
    { label: '👤 My Profile', to: '/profile' },
    { label: '📤 My Uploads', to: '/my-uploads' },
    { label: '🔖 My Save Box', to: '/saved' },
  ]

  const go = (to) => { navigate(to); setShowMobileMenu(false) }

  return (
    <>
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: isMobile ? '16px 20px' : '20px 100px', backgroundColor: '#FFFFFF',
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="EventHive" style={{ height: isMobile ? '30px' : '36px' }} />
        </Link>

        {!isMobile && (
          <>
            {/* Center Links — desktop only */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to}
                  style={{ fontSize: '15px', fontWeight: '500', color: location.pathname === link.match ? '#0097FF' : '#414143', textDecoration: 'none' }}>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Side — desktop only */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
                    {createLinks.map((item) => (
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
                      {profileLinks.map((item) => (
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
          </>
        )}

        {/* Hamburger — mobile only */}
        {isMobile && (
          <button onClick={() => setShowMobileMenu(true)}
            style={{ width: '40px', height: '40px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#141415" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        )}
      </nav>

      {/* Mobile flyover menu */}
      {isMobile && showMobileMenu && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 2000, backgroundColor: '#FFFFFF',
          display: 'flex', flexDirection: 'column', animation: 'slideIn 0.25s ease',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #E8E8EA' }}>
            <img src={logo} alt="EventHive" style={{ height: '30px' }} />
            <button onClick={() => setShowMobileMenu(false)}
              style={{ width: '36px', height: '36px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#141415" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Scrollable content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px' }}>

            {/* User row — if logged in */}
            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 4px 20px', borderBottom: '1px solid #E8E8EA', marginBottom: '20px' }}>
                <UserAvatar avatarUrl={avatarUrl} name={displayName} size={44} />
                <div style={{ overflow: 'hidden' }}>
                  <p style={{ fontSize: '15px', fontWeight: '600', color: '#141415', margin: 0 }}>{displayName}</p>
                  <p style={{ fontSize: '12px', color: '#7E7E82', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
                </div>
              </div>
            )}

            {/* Main nav links */}
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '24px' }}>
              {navLinks.map((link) => (
                <div key={link.to} onClick={() => go(link.to)}
                  style={{ padding: '16px 4px', fontSize: '18px', fontWeight: '600', color: location.pathname === link.match ? '#0097FF' : '#141415', borderBottom: '1px solid #F3F3F4', cursor: 'pointer' }}>
                  {link.label}
                </div>
              ))}
            </div>

            {/* Create actions */}
            <p style={{ fontSize: '12px', fontWeight: '600', color: '#A5A5AA', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>Create</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {createLinks.map((item) => (
                <div key={item.to} onClick={() => go(item.to)}
                  style={{ padding: '14px 16px', fontSize: '15px', fontWeight: '500', color: '#414143', backgroundColor: '#F9F9F9', borderRadius: '10px', cursor: 'pointer' }}>
                  {item.label}
                </div>
              ))}
            </div>

            {/* Profile links — if logged in */}
            {user && (
              <>
                <p style={{ fontSize: '12px', fontWeight: '600', color: '#A5A5AA', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>Account</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                  {profileLinks.map((item) => (
                    <div key={item.to} onClick={() => go(item.to)}
                      style={{ padding: '14px 16px', fontSize: '15px', fontWeight: '500', color: '#414143', backgroundColor: '#F9F9F9', borderRadius: '10px', cursor: 'pointer' }}>
                      {item.label}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Footer — pinned auth button */}
          <div style={{ padding: '16px 20px 28px', borderTop: '1px solid #E8E8EA' }}>
            {!user ? (
              <button onClick={() => { setShowMobileMenu(false); navigate('/login', { state: { backgroundLocation: location } }) }}
                style={{ width: '100%', height: '50px', borderRadius: '10px', border: 'none', backgroundColor: '#0097FF', color: '#FFFFFF', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
                Sign In
              </button>
            ) : (
              <button onClick={handleLogout}
                style={{ width: '100%', height: '50px', borderRadius: '10px', border: '1px solid #E8E8EA', backgroundColor: '#FFFFFF', color: '#AE2012', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
                🚪 Log Out
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0.5; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  )
}

export default Navbar