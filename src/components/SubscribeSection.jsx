import { useState } from 'react'
import card1 from '../assets/subscribe-card1.png'
import card2 from '../assets/subscribe-card2.png'

function SubscribeSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubscribe = () => {
    if (email.trim() !== '') {
      setSubmitted(true)
      setEmail('')
    }
  }

  return (
    <section
      style={{
        backgroundColor: '#000C14',
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '80px 100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '40px',
      }}
    >
      {/* Left Side — Text + Input */}
      <div style={{ flex: 1, maxWidth: '680px' }}>

        {/* Title */}
        <h2
          style={{
            fontSize: '40px',
            lineHeight: '48px',
            fontWeight: '700',
            color: '#F9F9F9',
            marginBottom: '12px',
          }}
        >
          Stay Updated
        </h2>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '20px',
            lineHeight: '28px',
            fontWeight: '400',
            color: '#F9F9F9',
            marginBottom: '32px',
          }}
        >
          Sign up for our newsletter and never miss an event.
        </p>

        {/* Input + Button */}
        {submitted ? (
          <p style={{ color: '#4CAF50', fontSize: '16px', fontWeight: '500' }}>
            ✅ You're subscribed! We'll keep you updated.
          </p>
        ) : (
          <div style={{ display: 'flex', gap: '0', width: '548px', height: '48px' }}>
            <input
              type="email"
              placeholder="sample@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
              style={{
                flex: 1,
                height: '48px',
                padding: '0 16px',
                fontSize: '14px',
                color: '#414143',
                backgroundColor: '#FFFFFF',
                border: 'none',
                borderRadius: '6px 0 0 6px',
                outline: 'none',
              }}
            />
            <button
              onClick={handleSubscribe}
              style={{
                height: '48px',
                padding: '0 24px',
                backgroundColor: '#0097FF',
                color: '#F9F9F9',
                fontSize: '14px',
                fontWeight: '500',
                border: 'none',
                borderRadius: '0 6px 6px 0',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Subscribe
            </button>
          </div>
        )}
      </div>

      {/* Right Side — Two Overlapping Cards */}
      <div
        style={{
          position: 'relative',
          width: '340px',
          height: '300px',
          flexShrink: 0,
        }}
      >
        {/* Back Card — Zero to Hero */}
        <div
          style={{
            position: 'absolute',
            top: '0',
            right: '0',
            width: '240px',
            height: '240px',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}
        >
          <img
            src={card1}
            alt="Event 1"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Front Card — Managing Gen Z */}
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            width: '240px',
            height: '240px',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}
        >
          <img
            src={card2}
            alt="Event 2"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>

    </section>
  )
}

export default SubscribeSection