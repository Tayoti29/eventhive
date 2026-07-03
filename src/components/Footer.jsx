import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

const productLinks = [
  { label: 'Find Event', to: '/category?type=All Events' },
  { label: 'Create Event', to: '/events/create' },
  { label: 'Memes', to: '/memes' },
  { label: 'Blog', to: '/blog' },
]

const filterLinks = [
  'Concert',
  'Location',
  'Religion',
  'Education',
  'Politics',
  'Science',
]

const legalLinks = [
  { label: 'Terms and Conditions', to: '/terms' },
  { label: 'Privacy Policy', to: '/privacy' },
]

const linkStyle = {
  fontSize: '16px',
  lineHeight: '24px',
  fontWeight: '400',
  color: '#C7C7CA',
  textDecoration: 'none',
}

const headingStyle = {
  fontSize: '14px',
  lineHeight: '20px',
  fontWeight: '700',
  color: '#F9F9F9',
  marginBottom: '24px',
  letterSpacing: '0.5px',
}

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      style={{
        backgroundColor: '#000C14',
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '80px 100px',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '200px 1fr 1fr 1fr',
          gap: '60px',
          alignItems: 'start',
        }}
      >
        {/* Logo */}
        <div>
          <img src={logo} alt="EventHive" style={{ height: '40px' }} />
        </div>

        {/* Products */}
        <div>
          <h4 style={headingStyle}>PRODUCTS</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {productLinks.map((item) => (
              <Link key={item.label} to={item.to} style={linkStyle}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div>
          <h4 style={headingStyle}>FILTERS</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filterLinks.map((item) => (
              <Link key={item} to={'/search?type=' + item.toLowerCase()} style={linkStyle}>
                {item}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact + Legal */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          <div>
            <h4 style={headingStyle}>CONTACT INFORMATION</h4>
            <a href="mailto:eventname@gmail.com" style={linkStyle}>
              eventname@gmail.com
            </a>
          </div>
          <div>
            <h4 style={headingStyle}>LEGAL</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {legalLinks.map((item) => (
                <Link key={item.label} to={item.to} style={linkStyle}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          borderTop: '1px solid #00253D',
          marginTop: '60px',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <p style={{ fontSize: '14px', color: '#7E7E82' }}>
          Copyright {year} EventHive. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer