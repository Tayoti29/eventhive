import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SubscribeSection from '../components/SubscribeSection'
import { useIsMobile } from '../hooks/useIsMobile'

function ContactUs() {
  const isMobile = useIsMobile()
  const [form, setForm] = useState({ title: '', message: '', email: '', whatsapp: '' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.message.trim()) e.message = 'Message is required'
    if (!form.email.trim() || !form.email.includes('@')) e.email = 'Valid email address is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    setSubmitting(true)
    setTimeout(() => { setSubmitted(true); setSubmitting(false) }, 1200)
  }

  const inputStyle = {
    width: '100%', height: isMobile ? '48px' : '52px', borderRadius: '12px', border: '1.5px solid #E8E8EA',
    padding: '0 16px', fontSize: isMobile ? '15px' : '16px', color: '#141415', outline: 'none',
    boxSizing: 'border-box', backgroundColor: '#FFFFFF', fontFamily: 'inherit', transition: 'border-color 0.2s ease',
  }
  const labelStyle = { fontSize: isMobile ? '14px' : '15px', fontWeight: '600', color: '#141415', display: 'block', marginBottom: '8px' }
  const errorStyle = { fontSize: '12px', color: '#AE2012', marginTop: '5px', display: 'block' }

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}><Navbar /></div>

      <section style={{ backgroundColor: '#F0F4FF', width: '100%', padding: isMobile ? '48px 0' : '80px 0' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: isMobile ? '0 20px' : '0 100px', textAlign: 'center' }}>
          <h1 style={{ fontSize: isMobile ? '28px' : '52px', lineHeight: isMobile ? '34px' : '62px', fontWeight: '700', color: '#141415', marginBottom: isMobile ? '12px' : '20px' }}>
            We're always available to{isMobile ? ' ' : <br />}answer your questions
          </h1>
          <p style={{ fontSize: isMobile ? '14px' : '20px', lineHeight: isMobile ? '20px' : '30px', color: '#7E7E82', maxWidth: '600px', margin: '0 auto' }}>
            Have a question, suggestion or just want to say hello? Fill in the form and our team will get back to you within 24 hours.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: '1440px', margin: '0 auto', padding: isMobile ? '40px 20px' : '80px 100px' }}>
        <div style={{ display: isMobile ? 'flex' : 'grid', flexDirection: isMobile ? 'column' : undefined, gridTemplateColumns: isMobile ? undefined : '1fr 440px', gap: isMobile ? '40px' : '80px', alignItems: 'start' }}>

          <div>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: isMobile ? '30px 0' : '60px 0' }}>
                <div style={{ fontSize: isMobile ? '48px' : '64px', marginBottom: '24px' }}>🎉</div>
                <h2 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: '700', color: '#141415', marginBottom: '12px' }}>Message Sent!</h2>
                <p style={{ fontSize: isMobile ? '15px' : '18px', color: '#7E7E82', marginBottom: '32px' }}>
                  Thank you for reaching out. Our team will respond to <strong style={{ color: '#141415' }}>{form.email}</strong> within 24 hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ title: '', message: '', email: '', whatsapp: '' }) }}
                  style={{ height: isMobile ? '48px' : '52px', padding: '0 32px', borderRadius: '12px', border: 'none', backgroundColor: '#0097FF', color: '#FFFFFF', fontSize: '16px', fontWeight: '600', cursor: 'pointer', width: isMobile ? '100%' : 'auto' }}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <div>
                <h2 style={{ fontSize: isMobile ? '24px' : '36px', fontWeight: '700', color: '#141415', marginBottom: '8px' }}>Send us a message</h2>
                <p style={{ fontSize: isMobile ? '14px' : '16px', color: '#7E7E82', marginBottom: isMobile ? '28px' : '40px' }}>
                  Fields marked with <span style={{ color: '#AE2012' }}>*</span> are required.
                </p>

                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>Title <span style={{ color: '#AE2012' }}>*</span></label>
                  <input type="text" placeholder="What is your message about?" value={form.title}
                    onChange={(e) => set('title', e.target.value)}
                    style={{ ...inputStyle, borderColor: errors.title ? '#AE2012' : '#E8E8EA' }}
                    onFocus={(e) => { if (!errors.title) e.target.style.borderColor = '#0097FF' }}
                    onBlur={(e) => { e.target.style.borderColor = errors.title ? '#AE2012' : '#E8E8EA' }} />
                  {errors.title && <span style={errorStyle}>{errors.title}</span>}
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>Message <span style={{ color: '#AE2012' }}>*</span></label>
                  <textarea placeholder="Write your message here..." value={form.message}
                    onChange={(e) => set('message', e.target.value)}
                    rows={isMobile ? 5 : 6}
                    style={{ width: '100%', borderRadius: '12px', border: '1.5px solid ' + (errors.message ? '#AE2012' : '#E8E8EA'), padding: '14px 16px', fontSize: isMobile ? '15px' : '16px', color: '#141415', outline: 'none', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit', lineHeight: '1.6', transition: 'border-color 0.2s ease' }}
                    onFocus={(e) => { if (!errors.message) e.target.style.borderColor = '#0097FF' }}
                    onBlur={(e) => { e.target.style.borderColor = errors.message ? '#AE2012' : '#E8E8EA' }} />
                  {errors.message && <span style={errorStyle}>{errors.message}</span>}
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>Email Address <span style={{ color: '#AE2012' }}>*</span></label>
                  <input type="email" placeholder="your@email.com" value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    style={{ ...inputStyle, borderColor: errors.email ? '#AE2012' : '#E8E8EA' }}
                    onFocus={(e) => { if (!errors.email) e.target.style.borderColor = '#0097FF' }}
                    onBlur={(e) => { e.target.style.borderColor = errors.email ? '#AE2012' : '#E8E8EA' }} />
                  {errors.email && <span style={errorStyle}>{errors.email}</span>}
                </div>

                <div style={{ marginBottom: isMobile ? '28px' : '40px' }}>
                  <label style={labelStyle}>WhatsApp Number <span style={{ fontSize: '13px', color: '#A5A5AA', fontWeight: '400' }}>(optional)</span></label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px' }}>💬</span>
                    <input type="tel" placeholder="+234 800 000 0000" value={form.whatsapp}
                      onChange={(e) => set('whatsapp', e.target.value)}
                      style={{ ...inputStyle, paddingLeft: '48px' }}
                      onFocus={(e) => { e.target.style.borderColor = '#0097FF' }}
                      onBlur={(e) => { e.target.style.borderColor = '#E8E8EA' }} />
                  </div>
                </div>

                <button onClick={handleSubmit} disabled={submitting}
                  style={{ width: '100%', height: isMobile ? '52px' : '56px', borderRadius: '12px', border: 'none', backgroundColor: submitting ? '#C7C7CA' : '#0097FF', color: '#FFFFFF', fontSize: isMobile ? '16px' : '18px', fontWeight: '600', cursor: submitting ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s ease' }}>
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            )}
          </div>

          <div>
            <div style={{ backgroundColor: '#F9F9F9', borderRadius: '24px', padding: isMobile ? '24px' : '40px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: isMobile ? '19px' : '24px', fontWeight: '700', color: '#141415', marginBottom: isMobile ? '18px' : '24px' }}>Contact Information</h3>
              {[
                { icon: '📧', title: 'Email', value: 'hello@eventhive.com', link: 'mailto:hello@eventhive.com' },
                { icon: '💬', title: 'WhatsApp', value: '+234 800 123 4567', link: 'https://wa.me/2348001234567' },
              ].map((item) => (
                <div key={item.title} style={{ display: 'flex', gap: '16px', marginBottom: '20px', alignItems: 'flex-start' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#FFFFFF', border: '1px solid #E8E8EA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', color: '#A5A5AA', margin: '0 0 2px', fontWeight: '500' }}>{item.title}</p>
                    {item.link ? (
                      <a href={item.link} style={{ fontSize: isMobile ? '15px' : '16px', color: '#141415', fontWeight: '600', textDecoration: 'none' }}
                        onMouseEnter={(e) => { e.target.style.color = '#0097FF' }}
                        onMouseLeave={(e) => { e.target.style.color = '#141415' }}>
                        {item.value}
                      </a>
                    ) : (
                      <p style={{ fontSize: isMobile ? '15px' : '16px', color: '#141415', fontWeight: '600', margin: 0 }}>{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ backgroundColor: '#EFF9FF', borderRadius: '24px', padding: isMobile ? '24px' : '32px', border: '1px solid #0097FF22' }}>
              <h4 style={{ fontSize: isMobile ? '17px' : '20px', fontWeight: '700', color: '#141415', marginBottom: '8px' }}>Response Time</h4>
              <p style={{ fontSize: isMobile ? '13px' : '15px', color: '#59595C', margin: '0 0 16px', lineHeight: isMobile ? '19px' : '22px' }}>
                We respond to all messages within 24 hours on business days. For urgent matters, please reach us via WhatsApp.
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['Mon–Fri', '9am – 6pm', 'WAT (UTC+1)'].map((tag) => (
                  <span key={tag} style={{ padding: '4px 12px', borderRadius: '9999px', backgroundColor: '#FFFFFF', border: '1px solid #0097FF', fontSize: '13px', color: '#0097FF', fontWeight: '500' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <SubscribeSection />
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}><Footer /></div>
    </div>
  )
}

export default ContactUs