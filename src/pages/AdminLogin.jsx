import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminSupabase } from '../adminSupabaseClient'

function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) return
    setLoading(true)
    setError('')
    try {
      const { data, error } = await adminSupabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError('Invalid admin credentials.')
        setLoading(false)
        return
      }
      navigate('/admin/ads')
    } catch (err) {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#141415', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '380px', backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '32px', boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#141415', marginBottom: '4px', textAlign: 'center' }}>Admin Access</h1>
        <p style={{ fontSize: '13px', color: '#7E7E82', marginBottom: '28px', textAlign: 'center' }}>Sign in to manage site advertisements</p>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#141415', display: 'block', marginBottom: '6px' }}>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleLogin() }}
            style={{ width: '100%', height: '46px', borderRadius: '8px', border: '1px solid #E8E8EA', padding: '0 14px', fontSize: '14px', color: '#414143', outline: 'none', boxSizing: 'border-box' }} />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#141415', display: 'block', marginBottom: '6px' }}>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleLogin() }}
            style={{ width: '100%', height: '46px', borderRadius: '8px', border: '1px solid #E8E8EA', padding: '0 14px', fontSize: '14px', color: '#414143', outline: 'none', boxSizing: 'border-box' }} />
        </div>

        {error && <p style={{ fontSize: '12px', color: '#AE2012', marginBottom: '16px' }}>{error}</p>}

        <button onClick={handleLogin} disabled={loading}
          style={{ width: '100%', height: '46px', borderRadius: '8px', border: 'none', backgroundColor: loading ? '#C7C7CA' : '#0097FF', color: '#FFFFFF', fontSize: '14px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </div>
    </div>
  )
}

export default AdminLogin