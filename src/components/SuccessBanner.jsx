import { useEffect, useState } from 'react'

function SuccessBanner({ message, onDone }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onDone, 400)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 9999,
        backgroundColor: '#4CAF50',
        borderRadius: '12px',
        padding: '20px 24px',
        minWidth: '340px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-20px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF' }}>Success</span>
      </div>
      <p style={{ fontSize: '16px', color: '#FFFFFF', margin: 0, paddingLeft: '36px' }}>{message}</p>
    </div>
  )
}

export default SuccessBanner