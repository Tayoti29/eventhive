import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import { useIsMobile } from '../hooks/useIsMobile'

const productLinks = [
  { label: 'Find Event', to: '/category?type=All Events' },
  { label: 'Create Event', to: '/events/create' },
  { label: 'Memes', to: '/memes' },
  { label: 'Blog', to: '/blog' },
]

const filterLinks = ['Concert', 'Location', 'Religion', 'Education', 'Politics', 'Science']

const legalLinks = [
  { label: 'Terms and Conditions', to: '/terms' },
  { label: 'Privacy Policy', to: '/privacy' },
]

function Footer() {
  const year = new Date().getFullYear()
  const isMobile = useIsMobile()

  const linkStyle = { fontSize: isMobile ? '14px' : '16px', lineHeight: isMobile ? '20px' : '24px', fontWeight: '400', color: '#C7C7CA', textDecoration: 'none' }
  const headingStyle = { fontSize: '14px', lineHeight: '20px', fontWeight: '700', color: '#F9F9F9', marginBottom: isMobile ? '16px' : '24px', letterSpacing: '0.5px' }

  return (
    <footer style={{ backgroundColor: '#000C14', maxWidth: '1440px', margin: '0 auto', padding: isMobile ? '40px 20px' : '80px 100px' }}>
      <div
        style={{
          display: isMobile ? 'flex' : 'grid',
          flexDirection: isMobile ? 'column' : undefined,
          gridTemplateColumns: isMobile ? undefined : '200px 1fr 1fr 1fr',
          gap: isMobile ? '32px' : '60px',
          alignItems: 'start',
        }}
      >
        <div>
          <img src={logo} alt="EventHive" style={{ height: isMobile ? '32px' : '40px' }} />
        </div>

        <div>
          <h4 style={headingStyle}>PRODUCTS</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '12px' : '16px' }}>
            {productLinks.map((item) => (
              <Link key={item.label} to={item.to} style={linkStyle}>{item.label}</Link>
            ))}
          </div>
        </div>

        <div>
          <h4 style={headingStyle}>FILTERS</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '12px' : '16px' }}>
            {filterLinks.map((item) => (
              <Link key={item} to={'/search?type=' + item.toLowerCase()} style={linkStyle}>{item}</Link>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '28px' : '40px' }}>
          <div>
            <h4 style={headingStyle}>CONTACT INFORMATION</h4>
            <a href="mailto:eventname@gmail.com" style={linkStyle}>eventname@gmail.com</a>
          </div>
          <div>
            <h4 style={headingStyle}>LEGAL</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '12px' : '16px' }}>
              {legalLinks.map((item) => (
                <Link key={item.label} to={item.to} style={linkStyle}>{item.label}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #00253D', marginTop: isMobile ? '32px' : '60px', paddingTop: isMobile ? '20px' : '24px', display: 'flex', justifyContent: 'center' }}>
        <p style={{ fontSize: isMobile ? '12px' : '14px', color: '#7E7E82', textAlign: 'center' }}>
          Copyright {year} EventHive. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer