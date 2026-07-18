import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import SuccessBanner from '../components/SuccessBanner'
import { useIsMobile } from '../hooks/useIsMobile'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setUser, setMockUser } = useAuth()
  const isMobile = useIsMobile()
  const [phase, setPhase] = useState('choose')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [googleHovered, setGoogleHovered] = useState(false)
  const [emailHovered, setEmailHovered] = useState(false)

  const backgroundLocation = location.state?.backgroundLocation

  const handleClose = () => {
    if (backgroundLocation) navigate(backgroundLocation.pathname + (backgroundLocation.search || ''))
    else navigate('/')
  }

  const handleGoogleLogin = async () => {
    try {
      const { supabase } = await import('../supabaseClient')
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })
      if (error) throw error
    } catch (err) { setError('Google login failed. Please try again.') }
  }

  const handleEmailLogin = async () => {
    if (!email || !password) return
    setLoading(true)
    setError('')
    try {
      const { supabase } = await import('../supabaseClient')
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setMockUser(email)
        setShowSuccess(true)
      } else {
        setUser(data.user)
        setShowSuccess(true)
      }
    } catch (err) {
      setMockUser(email)
      setShowSuccess(true)
    }
    setLoading(false)
  }

  const isLoginActive = email.length > 0 && password.length > 0
  const modalW = isMobile ? '100%' : '449px'
  const modalPad = isMobile ? '28px 24px' : '40px'

  return (
    <>
      {showSuccess && <SuccessBanner message="You have logged in successfully" onDone={handleClose} />}

      <div style={{ position: 'fixed', inset: 0, zIndex: 1000, backgroundColor: 'rgba(0,12,20,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '0 24px' : 0 }}
        onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}>

        {phase === 'choose' && (
          <div style={{ width: modalW, backgroundColor: '#FFFFFF', borderRadius: '24px', padding: modalPad, position: 'relative', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
            <button onClick={handleClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#7E7E82', fontSize: '20px' }}>✕</button>

            <h2 style={{ fontSize: isMobile ? '24px' : '32px', lineHeight: isMobile ? '30px' : '39px', fontWeight: '700', color: '#141415', textAlign: 'center', marginBottom: isMobile ? '28px' : '40px', marginTop: '16px' }}>
              Login to Find and List Events around the World
            </h2>

            <button onClick={handleGoogleLogin}
              onMouseEnter={() => setGoogleHovered(true)} onMouseLeave={() => setGoogleHovered(false)}
              style={{ width: '100%', height: isMobile ? '48px' : '52px', borderRadius: '12px', border: '1px solid #E8E8EA', backgroundColor: googleHovered ? '#EFF9FF' : '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', marginBottom: '16px', transition: 'all 0.2s ease' }}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span style={{ fontSize: '16px', fontWeight: '500', color: '#141415' }}>Continue with Google</span>
            </button>

            <button onClick={() => setPhase('email')}
              onMouseEnter={() => setEmailHovered(true)} onMouseLeave={() => setEmailHovered(false)}
              style={{ width: '100%', height: isMobile ? '48px' : '52px', borderRadius: '12px', border: '1px solid #E8E8EA', backgroundColor: emailHovered ? '#EFF9FF' : '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', marginBottom: isMobile ? '24px' : '32px', transition: 'all 0.2s ease' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#414143" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <span style={{ fontSize: '16px', fontWeight: '500', color: '#141415' }}>Continue with Email</span>
            </button>

            <p style={{ textAlign: 'center', fontSize: '12px', color: '#7E7E82', margin: 0 }}>
              Do not have an account?{' '}
              <span onClick={() => navigate('/register', { state: { backgroundLocation: backgroundLocation || location } })}
                style={{ color: '#007ACC', cursor: 'pointer', fontWeight: '500' }}>Sign Up</span>
            </p>
          </div>
        )}

        {phase === 'email' && (
          <div style={{ width: modalW, backgroundColor: '#FFFFFF', borderRadius: '24px', padding: modalPad, position: 'relative', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isMobile ? '24px' : '32px' }}>
              <button onClick={() => { setPhase('choose'); setError(''); setEmail(''); setPassword('') }}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#59595C" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                <span style={{ fontSize: '14px', color: '#59595C' }}>Back</span>
              </button>
              <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7E7E82', fontSize: '20px' }}>✕</button>
            </div>

            <h3 style={{ fontSize: isMobile ? '24px' : '32px', lineHeight: isMobile ? '30px' : '39px', fontWeight: '700', color: '#141415', textAlign: 'center', marginBottom: isMobile ? '24px' : '32px' }}>
              Login to your account
            </h3>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '16px', fontWeight: '600', color: '#141415', display: 'block', marginBottom: '8px' }}>Email Address</label>
              <input type="email" placeholder="sample@gmail.com" value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
                style={{ width: '100%', height: isMobile ? '48px' : '52px', borderRadius: '12px', border: `1px solid ${error ? '#AE2012' : '#E8E8EA'}`, padding: '0 16px', fontSize: '16px', color: '#414143', outline: 'none', boxSizing: 'border-box' }} />
              {error && <p style={{ fontSize: '12px', color: '#AE2012', margin: '6px 0 0 0' }}>{error}</p>}
            </div>

            <div style={{ marginBottom: '8px' }}>
              <label style={{ fontSize: '16px', fontWeight: '600', color: '#141415', display: 'block', marginBottom: '8px' }}>Password</label>
              <input type="password" placeholder="••••••••" value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', height: isMobile ? '48px' : '52px', borderRadius: '12px', border: '1px solid #E8E8EA', padding: '0 16px', fontSize: '16px', color: '#414143', outline: 'none', boxSizing: 'border-box' }} />
            </div>

            <div style={{ textAlign: 'right', marginBottom: isMobile ? '24px' : '32px' }}>
              <span style={{ fontSize: '14px', color: '#7E7E82', cursor: 'pointer' }}>Forgot Password</span>
            </div>

            <button onClick={handleEmailLogin} disabled={!isLoginActive || loading}
              style={{ width: '100%', height: isMobile ? '52px' : '56px', borderRadius: '12px', border: 'none', backgroundColor: isLoginActive ? '#0097FF' : '#C7C7CA', color: '#FFFFFF', fontSize: isMobile ? '16px' : '18px', fontWeight: '600', cursor: isLoginActive ? 'pointer' : 'not-allowed', marginBottom: '24px', transition: 'background-color 0.2s ease' }}>
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <p style={{ textAlign: 'center', fontSize: '12px', color: '#7E7E82', margin: 0 }}>
              Do not have an account?{' '}
              <span onClick={() => navigate('/register', { state: { backgroundLocation: backgroundLocation || location } })}
                style={{ color: '#007ACC', cursor: 'pointer', fontWeight: '500' }}>Sign Up</span>
            </p>
          </div>
        )}
      </div>
    </>
  )
}

export default Login