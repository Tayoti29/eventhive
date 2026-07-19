import { useState } from 'react'
import card1 from '../assets/subscribe-card1.png'
import card2 from '../assets/subscribe-card2.png'
import { useIsMobile } from '../hooks/useIsMobile'

function SubscribeSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const isMobile = useIsMobile()

  const handleSubscribe = () => {
    if (email.trim() !== '') {
      setSubmitted(true)
      setEmail('')
    }
  }

  return (
    <section
      style={{
        backgroundColor: '#000C14', maxWidth: '1440px', margin: '0 auto',
        padding: isMobile ? '40px 20px' : '80px 100px',
        display: 'flex', flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'center', justifyContent: 'space-between',
        gap: isMobile ? '28px' : '40px',
      }}
    >
      <div style={{ flex: 1, maxWidth: isMobile ? 'none' : '680px', width: '100%' }}>
        <h2 style={{ fontSize: isMobile ? '24px' : '40px', lineHeight: isMobile ? '30px' : '48px', fontWeight: '700', color: '#F9F9F9', marginBottom: isMobile ? '8px' : '12px' }}>
          Stay Updated
        </h2>
        <p style={{ fontSize: isMobile ? '14px' : '20px', lineHeight: isMobile ? '20px' : '28px', fontWeight: '400', color: '#F9F9F9', marginBottom: isMobile ? '20px' : '32px' }}>
          Sign up for our newsletter and never miss an event.
        </p>

        {submitted ? (
          <p style={{ color: '#4CAF50', fontSize: '16px', fontWeight: '500' }}>
            ✅ You're subscribed! We'll keep you updated.
          </p>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '10px' : 0,
            width: isMobile ? '100%' : '548px',
            maxWidth: '100%',
            boxSizing: 'border-box',
          }}>
            <input
              type="email"
              placeholder="sample@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
              style={{
                width: isMobile ? '100%' : 'auto',
                flex: isMobile ? undefined : 1,
                height: isMobile ? '52px' : '48px',
                padding: '0 16px',
                fontSize: isMobile ? '15px' : '14px',
                color: '#414143',
                backgroundColor: '#FFFFFF',
                border: 'none',
                borderRadius: isMobile ? '8px' : '6px 0 0 6px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <button
              onClick={handleSubscribe}
              style={{
                width: isMobile ? '100%' : 'auto',
                height: isMobile ? '52px' : '48px',
                padding: '0 24px',
                backgroundColor: '#0097FF',
                color: '#F9F9F9',
                fontSize: isMobile ? '15px' : '14px',
                fontWeight: '600',
                border: 'none',
                borderRadius: isMobile ? '8px' : '0 6px 6px 0',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxSizing: 'border-box',
              }}
            >
              Subscribe
            </button>
          </div>
        )}
      </div>

      <div style={{ position: 'relative', width: isMobile ? '100%' : '340px', height: isMobile ? '180px' : '300px', flexShrink: 0 }}>
        <div style={{ position: 'absolute', top: 0, right: isMobile ? '20px' : 0, width: isMobile ? '150px' : '240px', height: isMobile ? '150px' : '240px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          <img src={card1} alt="Event 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: isMobile ? '20px' : 0, width: isMobile ? '150px' : '240px', height: isMobile ? '150px' : '240px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          <img src={card2} alt="Event 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>
    </section>
  )
}

export default SubscribeSection