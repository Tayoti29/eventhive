import { useState, useEffect } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SubscribeSection from '../components/SubscribeSection'
import SaveButton from '../components/SaveButton'
import advertImg from '../assets/subscribe-card1.png'
// TODO: add a second creative to /src/assets and import it here.
import advertImg2 from '../assets/subscribe-card1.png'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabaseClient'

function isValidUUID(id) {
  return id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id))
}

// ── AD CONFIG — edit these to change what ads show ──
const sidebarAds = [
  { id: 'meme-sidebar-ad-1', src: advertImg, type: 'image', link: '' },
  { id: 'meme-sidebar-ad-2', src: advertImg2, type: 'image', link: '' },
]

const relatedGridAds = [
  { id: 'meme-grid-ad-1', src: advertImg, type: 'image', link: '' },
]

function isVideoFile(src) {
  return /\.(mp4|webm|mov)$/i.test(src || '')
}

function AdMedia({ src, type, style, alt }) {
  const isVideo = type === 'video' || isVideoFile(src)
  if (isVideo) {
    return <video src={src} style={style} autoPlay loop muted playsInline />
  }
  return <img src={src} alt={alt || 'Advertisement'} style={style} />
}

function SidebarAdCard({ ad, height }) {
  const [hovered, setHovered] = useState(false)
  const content = (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ width: '292px', height: (height || 292) + 'px', borderRadius: '12px', overflow: 'hidden', position: 'relative', boxShadow: hovered ? '0 8px 32px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', transform: hovered ? 'scale(1.02)' : 'scale(1)', cursor: ad.link ? 'pointer' : 'default' }}>
      <AdMedia src={ad.src} type={ad.type} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      <span style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '10px', fontWeight: '600', color: '#FFFFFF', backgroundColor: 'rgba(0,0,0,0.55)', padding: '3px 10px', borderRadius: '9999px', letterSpacing: '0.3px' }}>
        Ad
      </span>
    </div>
  )
  if (ad.link) return <a href={ad.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>{content}</a>
  return content
}

// Ad card that fills a related-meme grid slot — same footprint as RelatedMemeCard, no caption/uploader details
function RelatedMemeAdCard({ ad }) {
  const [hovered, setHovered] = useState(false)
  const content = (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ borderRadius: '12px', overflow: 'hidden', cursor: ad.link ? 'pointer' : 'default', boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', transform: hovered ? 'translateY(-4px)' : 'translateY(0)', backgroundColor: '#F3F3F4', position: 'relative', height: '270px' }}>
      <AdMedia src={ad.src} type={ad.type} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      <span style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '10px', fontWeight: '600', color: '#FFFFFF', backgroundColor: 'rgba(0,0,0,0.55)', padding: '3px 10px', borderRadius: '9999px', letterSpacing: '0.3px' }}>
        Ad
      </span>
    </div>
  )
  if (ad.link) return <a href={ad.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>{content}</a>
  return content
}

// Interleaves an ad after every `interval` items
function buildItemsWithAds(items, ads, interval) {
  if (!ads || ads.length === 0) return items.map((it) => ({ kind: 'item', data: it }))
  const out = []
  let adIndex = 0
  items.forEach((it, i) => {
    out.push({ kind: 'item', data: it })
    if ((i + 1) % interval === 0) {
      out.push({ kind: 'ad', data: ads[adIndex % ads.length] })
      adIndex += 1
    }
  })
  return out
}

function UserAvatar({ avatarUrl, name, size }) {
  const s = size || 32
  const initial = (name || 'U').charAt(0).toUpperCase()
  if (avatarUrl) return <img src={avatarUrl} alt={name} style={{ width: s, height: s, borderRadius: '9999px', objectFit: 'cover', flexShrink: 0 }} />
  return (
    <div style={{ width: s, height: s, borderRadius: '9999px', backgroundColor: '#0097FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: s * 0.4, fontWeight: '700', flexShrink: 0 }}>
      {initial}
    </div>
  )
}

function BackButton() {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  return (
    <button onClick={() => navigate(-1)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ width: '92px', height: '40px', borderRadius: '8px', border: '1px solid ' + (hovered ? '#F3F3F4' : '#E8E8EA'), backgroundColor: hovered ? '#F9F9F9' : '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', boxShadow: hovered ? '0 2px 8px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.2s ease' }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#141415" strokeWidth="2" strokeLinecap="round">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
      <span style={{ fontSize: '16px', color: '#141415', fontWeight: '400' }}>Back</span>
    </button>
  )
}

function IconButton({ icon, hoverText, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div style={{ position: 'relative', cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={onClick}>
      <div style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #E8E8EA', backgroundColor: hovered ? '#F9F9F9' : '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}>
        {icon}
      </div>
      {hovered && (
        <span style={{ position: 'absolute', top: '42px', left: '50%', transform: 'translateX(-50%)', fontSize: '10px', color: '#FFFFFF', backgroundColor: '#141415', padding: '3px 8px', borderRadius: '4px', whiteSpace: 'nowrap', zIndex: 10 }}>
          {hoverText}
        </span>
      )}
    </div>
  )
}

function CaptionItem({ caption }) {
  const [hovered, setHovered] = useState(false)
  const [copied, setCopied] = useState(false)
  const text = caption.caption || caption.text || ''
  const authorName = caption.author_name || caption.author || 'User'
  const authorAvatar = caption.author_avatar || null

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ display: 'flex', gap: '10px', padding: '14px 16px', borderRadius: '8px', border: '1px solid #E8E8EA', backgroundColor: hovered ? '#F9F9F9' : '#FFFFFF', marginBottom: '12px', position: 'relative', transition: 'background-color 0.2s ease' }}>
      <UserAvatar avatarUrl={authorAvatar} name={authorName} size={28} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '12px', color: '#A5A5AA', marginBottom: '4px', fontWeight: '500' }}>{authorName}</p>
        <p style={{ fontSize: '15px', color: '#141415', lineHeight: '22px', margin: 0, paddingRight: hovered ? '80px' : '0' }}>{text}</p>
      </div>
      {hovered && (
        <button
          onClick={() => { navigator.clipboard.writeText(text + ' — ' + authorName); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
          style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', background: 'none', border: 'none', cursor: 'pointer' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0097FF" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          <span style={{ fontSize: '10px', color: '#0097FF', whiteSpace: 'nowrap' }}>{copied ? 'Copied!' : 'Copy caption'}</span>
        </button>
      )}
    </div>
  )
}

function RelatedMemeCard({ meme }) {
  const [hovered, setHovered] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(meme.likes || 0)
  const navigate = useNavigate()
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onClick={() => { if (isValidUUID(meme.id)) navigate('/memes/' + meme.id) }}
      style={{ borderRadius: '12px', overflow: 'hidden', cursor: isValidUUID(meme.id) ? 'pointer' : 'default', boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', transform: hovered ? 'translateY(-4px)' : 'translateY(0)', backgroundColor: '#FFFFFF' }}>
      <div style={{ position: 'relative', height: '220px' }}>
        <img src={meme.image_url || 'https://picsum.photos/seed/mr' + meme.id + '/296/220'} alt="meme" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', opacity: hovered ? 1 : 0, transition: 'opacity 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '600' }}>View Meme</span>
        </div>
      </div>
      <div style={{ padding: '10px 12px', backgroundColor: hovered ? '#F9F9F9' : '#FFFFFF', transition: 'background-color 0.3s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
          <UserAvatar avatarUrl={meme.uploader_avatar} name={meme.uploader_name} size={22} />
          <span style={{ fontSize: '11px', color: '#7E7E82', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{meme.uploader_name || 'User'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7E7E82" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
            <span style={{ fontSize: '11px', color: '#7E7E82' }}>{(meme.views || 0).toLocaleString()}</span>
          </div>
          <button onClick={(e) => { e.stopPropagation(); if (!liked) { setLiked(true); setLikes(likes + 1) } }}
            style={{ display: 'flex', alignItems: 'center', gap: '3px', background: 'none', border: 'none', cursor: liked ? 'default' : 'pointer', padding: 0 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill={liked ? '#D90870' : 'none'} stroke="#D90870" strokeWidth="2">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span style={{ fontSize: '11px', color: liked ? '#D90870' : '#7E7E82' }}>{likes}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

const memeCategories = ['All Memes', 'Funny', 'Relatable', 'Motivational', 'Naija', 'Couple Goals', 'Work Life', 'School', 'Politics', 'Sports']

const navCards = [
  { title: 'Find Exciting Events', subtitle: 'Explore events happening near you.', bg: '#F6FBFF', icon: '📅', to: '/category?type=All Events' },
  { title: 'Read our Blogs', subtitle: 'Discover insightful blogs from our community.', bg: '#FFFCF4', icon: '📝', to: '/blog' },
  { title: 'Create Birthday and other Flyers', subtitle: 'Design beautiful flyers for any occasion.', bg: '#FFF0F3', icon: '🖼️', to: '/flyers' },
]

function NavCard({ card }) {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()
  return (
    <div onClick={() => navigate(card.to)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ width: '405px', height: '335px', borderRadius: '12px', backgroundColor: card.bg, cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '32px', transition: 'transform 0.2s ease, box-shadow 0.2s ease', transform: hovered ? 'translateY(-6px)' : 'translateY(0)', boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.10)' : 'none' }}>
      <div style={{ fontSize: '64px', lineHeight: 1 }}>{card.icon}</div>
      <div>
        <h4 style={{ fontSize: '24px', lineHeight: '32px', fontWeight: '700', color: '#141415', margin: '0 0 12px 0' }}>{card.title}</h4>
        <p style={{ fontSize: '16px', lineHeight: '24px', color: '#59595C', margin: 0 }}>{card.subtitle}</p>
      </div>
    </div>
  )
}

function SocialShareButton({ label, bg, onClick, icon }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={onClick}>
      <div style={{ width: '44px', height: '44px', borderRadius: '9999px', backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: hovered ? 'scale(1.08)' : 'scale(1)', transition: 'transform 0.15s ease', boxShadow: hovered ? '0 4px 12px rgba(0,0,0,0.15)' : 'none' }}>
        {icon}
      </div>
      <span style={{ fontSize: '11px', color: '#59595C' }}>{label}</span>
    </div>
  )
}

// ── Share Modal — same design as the blog's share modal, linked to this meme ──
function ShareModal({ shareUrl, shareTitle, onClose }) {
  const [copied, setCopied] = useState(false)

  const handleSocialShare = (platform) => {
    const encodedUrl = encodeURIComponent(shareUrl)
    const encodedText = encodeURIComponent(shareTitle)
    const links = {
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    }
    if (platform === 'instagram' || platform === 'tiktok') {
      navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
      return
    }
    window.open(links[platform], '_blank', 'noopener,noreferrer')
  }

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ width: '440px', backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '32px', position: 'relative', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#7E7E82' }}>✕</button>
        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#141415', marginBottom: '8px' }}>Share this Meme</h3>
        <p style={{ fontSize: '14px', color: '#7E7E82', marginBottom: '20px' }}>Copy the link below or share directly</p>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          <input readOnly value={shareUrl}
            style={{ flex: 1, height: '44px', borderRadius: '8px', border: '1px solid #E8E8EA', padding: '0 12px', fontSize: '13px', color: '#414143', outline: 'none', backgroundColor: '#F9F9F9' }} />
          <button onClick={() => { navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
            style={{ height: '44px', padding: '0 18px', borderRadius: '8px', border: 'none', backgroundColor: '#0097FF', color: '#FFFFFF', fontSize: '14px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {copied ? '✅ Copied!' : 'Copy Link'}
          </button>
        </div>

        <p style={{ fontSize: '12px', fontWeight: '600', color: '#A5A5AA', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '14px' }}>
          Or share via
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px 8px' }}>
          <SocialShareButton label="WhatsApp" bg="#25D366" onClick={() => handleSocialShare('whatsapp')}
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.28-1.38a9.87 9.87 0 0 0 4.71 1.2h.01c5.46 0 9.9-4.45 9.9-9.91S17.5 2 12.04 2zm5.8 14.13c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.81-.11-.42-.13-.95-.31-1.64-.6-2.88-1.24-4.76-4.14-4.9-4.34-.14-.19-1.17-1.56-1.17-2.97 0-1.41.74-2.11 1-2.4.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.57.81 1.98.88 2.12.07.14.12.31.02.5-.1.19-.15.31-.29.48-.14.17-.3.37-.43.5-.14.14-.29.29-.13.57.17.28.75 1.24 1.61 2.01 1.11.99 2.04 1.3 2.32 1.44.28.14.44.12.6-.07.17-.19.71-.83.9-1.11.19-.28.38-.24.64-.14.26.1 1.65.78 1.94.92.28.14.47.21.54.33.07.12.07.68-.17 1.36z"/></svg>}
          />
          <SocialShareButton label="Facebook" bg="#1877F2" onClick={() => handleSocialShare('facebook')}
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="#FFFFFF"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.13 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.44 2.91h-2.34V22c4.78-.81 8.44-4.94 8.44-9.94z"/></svg>}
          />
          <SocialShareButton label="X" bg="#000000" onClick={() => handleSocialShare('twitter')}
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="#FFFFFF"><path d="M18.9 2H22l-7.6 8.68L23.3 22h-6.9l-5.4-7.07L4.8 22H1.7l8.1-9.26L1 2h7.1l4.9 6.47L18.9 2zm-1.2 18h1.9L7.4 4h-2l12.3 16z"/></svg>}
          />
          <SocialShareButton label="Telegram" bg="#229ED9" onClick={() => handleSocialShare('telegram')}
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="#FFFFFF"><path d="M21.9 3.5L2.7 11c-.9.35-.9.9-.16 1.13l4.9 1.53 1.9 5.86c.24.66.42.92.86.92.34 0 .5-.16.7-.36l1.9-1.85 4.94 3.66c.9.5 1.55.24 1.78-.84L23.9 4.94c.32-1.35-.5-1.96-1.5-1.44zM8.8 14.4l9.2-5.8c.44-.27.83-.12.5.17l-7.5 6.83-.29 3.1z"/></svg>}
          />
          <SocialShareButton label="LinkedIn" bg="#0A66C2" onClick={() => handleSocialShare('linkedin')}
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="#FFFFFF"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z"/></svg>}
          />
          <SocialShareButton label="Instagram" bg="#E1306C" onClick={() => handleSocialShare('instagram')}
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>}
          />
          <SocialShareButton label="TikTok" bg="#000000" onClick={() => handleSocialShare('tiktok')}
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="#FFFFFF"><path d="M16.6 5.82c-1.05-1.02-1.6-2.35-1.6-3.82h-3.15v13.44a2.68 2.68 0 1 1-2.68-2.68c.29 0 .57.05.83.13V9.7a5.8 5.8 0 0 0-.83-.06 5.83 5.83 0 1 0 5.83 5.83V9.06a7.1 7.1 0 0 0 4.15 1.33V7.24c-.99 0-1.9-.32-2.55-1.42z"/></svg>}
          />
          <SocialShareButton label="More" bg="#7E7E82" onClick={() => { if (navigator.share) { navigator.share({ title: shareTitle, url: shareUrl }) } else { navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 2000) } }}
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>}
          />
        </div>
        {copied && (
          <p style={{ fontSize: '12px', color: '#2E7D32', textAlign: 'center', marginTop: '14px' }}>
            Link copied — paste it into your Instagram/TikTok post or story.
          </p>
        )}
      </div>
    </div>
  )
}

function MemeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const [meme, setMeme] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [captions, setCaptions] = useState([])
  const [relatedMemes, setRelatedMemes] = useState([])
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(0)
  const [newCaption, setNewCaption] = useState('')
  const [showShareModal, setShowShareModal] = useState(false)

  useEffect(() => {
    fetchMeme()
  }, [id])

  const fetchMeme = async () => {
    setLoading(true)
    setNotFound(false)

    if (!isValidUUID(id)) {
      setNotFound(true)
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.from('memes').select('*').eq('id', id).single()
      if (error || !data) {
        setNotFound(true)
        setLoading(false)
        return
      }

      setMeme(data)
      setLikes(data.likes || 0)

      const { data: caps } = await supabase
        .from('meme_captions')
        .select('*')
        .eq('meme_id', id)
        .order('created_at', { ascending: false })
      setCaptions(caps || [])

      const { data: related } = await supabase
        .from('memes')
        .select('*')
        .eq('category', data.category)
        .neq('id', id)
        .limit(9)
      setRelatedMemes(related || [])

    } catch (err) {
      console.error('MemeDetail fetch error:', err)
      setNotFound(true)
    }

    setLoading(false)
  }

  const getCurrentUserDisplay = () => {
    const meta = user?.user_metadata || {}
    const name = meta.full_name || meta.username || meta.first_name || (user?.email ? user.email.split('@')[0] : 'User')
    const avatar = meta.avatar_url || null
    return { name, avatar }
  }

  const handleAddCaption = async () => {
    if (!user) {
      navigate('/login', { state: { backgroundLocation: location } })
      return
    }
    if (!newCaption.trim()) return

    const author = getCurrentUserDisplay()
    const tempCaption = {
      id: 'temp-' + Date.now(),
      author_name: author.name,
      author_avatar: author.avatar,
      caption: newCaption,
    }
    setCaptions([tempCaption, ...captions])
    setNewCaption('')

    try {
      await supabase.from('meme_captions').insert([{
        meme_id: id,
        caption: newCaption,
        author_name: author.name,
        author_avatar: author.avatar,
        user_id: isValidUUID(user?.id) ? user.id : null,
      }])
    } catch (err) {
      console.error('Caption save error:', err)
    }
  }

  // Fetches the image as a blob first so the download works regardless of the file's
  // origin (fixes it opening in a new tab instead of downloading directly).
  const handleDownloadMeme = async () => {
    if (!meme?.image_url) return
    try {
      const response = await fetch(meme.image_url, { mode: 'cors' })
      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      const ext = (blob.type && blob.type.split('/')[1]) || 'jpg'
      a.download = (meme.title || meme.caption || 'meme').slice(0, 40).replace(/\s/g, '_') + '.' + ext
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(blobUrl)
    } catch (err) {
      console.error('Meme download error:', err)
      // Fallback if the fetch is blocked (e.g. CORS) — at least gets the user to the image
      window.open(meme.image_url, '_blank')
    }
  }

  if (loading) {
    return (
      <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}><Navbar /></div>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '120px 0' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[0,1,2].map((i) => (
              <div key={i} style={{ width: '12px', height: '12px', borderRadius: '9999px', backgroundColor: '#D90870', animation: 'bounce 0.6s ease ' + (i * 0.1) + 's infinite alternate' }} />
            ))}
          </div>
        </div>
        <style>{`@keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-12px); } }`}</style>
      </div>
    )
  }

  if (notFound) {
    return (
      <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}><Navbar /></div>
        <div style={{ textAlign: 'center', padding: '120px 100px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>😕</div>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#141415', marginBottom: '12px' }}>Meme not found</h2>
          <p style={{ fontSize: '16px', color: '#7E7E82', marginBottom: '24px' }}>This meme may have been removed or does not exist.</p>
          <button onClick={() => navigate('/memes')}
            style={{ height: '44px', padding: '0 24px', borderRadius: '8px', backgroundColor: '#D90870', color: '#FFFFFF', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
            Browse Memes
          </button>
        </div>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}><Footer /></div>
      </div>
    )
  }

  const m = meme

  const displayCaptions = captions.length > 0
    ? captions
    : (m.caption ? [{ id: 'orig', author_name: m.uploader_name || 'Uploader', author_avatar: m.uploader_avatar, caption: m.caption }] : [])

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareTitle = m.title || (m.caption ? m.caption.slice(0, 60) : 'Check out this meme on EventHive')

  const relatedItemsWithAds = buildItemsWithAds(relatedMemes, relatedGridAds, 8)
  const relatedColumns = [[], [], []]
  relatedItemsWithAds.forEach((item, i) => relatedColumns[i % 3].push(item))

  return (
    <div style={{ backgroundColor: '#FFFFFF' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}><Navbar /></div>

      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '32px 80px 80px 80px' }}>
        <BackButton />

        {/* Meme Image + Advert */}
        <div style={{ display: 'flex', gap: '48px', marginTop: '32px', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            {/* Action row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <button onClick={() => { if (!liked) { setLiked(true); setLikes(likes + 1) } }}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: liked ? 'default' : 'pointer', padding: 0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill={liked ? '#D90870' : 'none'} stroke="#D90870" strokeWidth="2">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <span style={{ fontSize: '14px', color: liked ? '#D90870' : '#7E7E82' }}>{likes.toLocaleString()}</span>
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <IconButton hoverText="Download"
                  onClick={handleDownloadMeme}
                  icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#59595C" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>}
                />
                <IconButton hoverText="Share Meme"
                  onClick={() => setShowShareModal(true)}
                  icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#59595C" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>}
                />
                <SaveButton item={{ id: m.id, type: 'meme', title: m.title || (m.caption ? m.caption.slice(0, 40) : 'Meme'), image: m.image_url }} />
              </div>
            </div>

            {/* Meme image */}
            <div style={{ width: '100%', maxWidth: '900px', minHeight: '300px', maxHeight: '600px', borderRadius: '12px', backgroundColor: '#141415', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={m.image_url} alt={m.title} style={{ maxWidth: '100%', maxHeight: '600px', objectFit: 'contain', display: 'block' }} />
            </div>

            {/* Uploader row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px' }}>
              <UserAvatar avatarUrl={m.uploader_avatar} name={m.uploader_name} size={36} />
              <div>
                <p style={{ fontSize: '14px', fontWeight: '700', color: '#141415', margin: 0 }}>{m.uploader_name || 'User'}</p>
                <p style={{ fontSize: '12px', color: '#7E7E82', margin: 0 }}>Uploader</p>
              </div>
            </div>

            {/* Meta */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '16px', padding: '16px 0', borderBottom: '1px solid #E8E8EA' }}>
              {[
                { icon: '📅', label: new Date(m.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) },
                { icon: '👁️', label: (m.views || 0).toLocaleString() + ' Views' },
                { icon: '⬇️', label: (m.downloads || 0).toLocaleString() + ' Downloads' },
                { icon: '🏷️', label: m.category || 'Meme' },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '16px' }}>{item.icon}</span>
                  <span style={{ fontSize: '13px', color: '#59595C' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Advert — two stacked, sticky */}
          <div style={{ width: '292px', flexShrink: 0, position: 'sticky', top: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {sidebarAds.map((ad) => <SidebarAdCard key={ad.id} ad={ad} />)}
          </div>
        </div>

        {/* Captions + Categories */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 292px', gap: '48px', marginTop: '48px' }}>
          <div>
            <h3 style={{ fontSize: '32px', lineHeight: '39px', fontWeight: '700', color: '#141415', marginBottom: '24px' }}>Suggested Captions</h3>

            {displayCaptions.length === 0 && (
              <p style={{ fontSize: '14px', color: '#A5A5AA', marginBottom: '16px' }}>No captions yet. Be the first to add one!</p>
            )}
            <div style={{ marginBottom: '24px' }}>
              {displayCaptions.map((cap) => <CaptionItem key={cap.id} caption={cap} />)}
            </div>

            {/* Add caption input */}
            <div style={{ position: 'relative' }}>
              <input type="text"
                placeholder={user ? 'Add your caption...' : 'Log in to add a caption'}
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddCaption() }}
                readOnly={!user}
                onClick={() => { if (!user) navigate('/login', { state: { backgroundLocation: location } }) }}
                style={{ width: '100%', height: '52px', borderRadius: '10px', border: '1px solid #E8E8EA', padding: '0 52px 0 16px', fontSize: '14px', color: '#414143', backgroundColor: user ? '#FFFFFF' : '#F9F9F9', outline: 'none', boxSizing: 'border-box', cursor: user ? 'text' : 'pointer' }}
              />
              {user && (
                <button onClick={handleAddCaption}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0097FF" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Category sidebar */}
          <div>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#59595C', marginBottom: '12px' }}>
              Category: <span style={{ color: '#0097FF' }}>{m.category}</span>
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {memeCategories.map((cat) => {
                const isActive = cat === m.category || (cat === 'All Memes' && !m.category)
                return (
                  <button key={cat}
                    onClick={() => navigate('/memes', { state: { category: cat } })}
                    style={{ padding: '8px 16px', borderRadius: '9999px', border: '1px solid ' + (isActive ? '#0097FF' : '#E8E8EA'), backgroundColor: isActive ? '#0097FF' : '#FFFFFF', color: isActive ? '#FFFFFF' : '#59595C', fontSize: '14px', fontWeight: '500', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease' }}>
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Related Memes */}
        {relatedMemes.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 292px', gap: '48px', marginTop: '64px' }}>
            <div>
              <h3 style={{ fontSize: '32px', fontWeight: '700', color: '#141415', marginBottom: '24px' }}>Related Memes</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', alignItems: 'start' }}>
                {relatedColumns.map((col, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {col.map((item, idx) =>
                      item.kind === 'ad'
                        ? <RelatedMemeAdCard key={'ad-' + i + '-' + idx} ad={item.data} />
                        : <RelatedMemeCard key={item.data.id} meme={item.data} />
                    )}
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('/memes')}
                style={{ marginTop: '24px', padding: '10px 24px', borderRadius: '8px', border: '1px solid #E8E8EA', backgroundColor: '#FFFFFF', fontSize: '14px', color: '#59595C', cursor: 'pointer' }}>
                View All Memes
              </button>
            </div>
            <div style={{ width: '292px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {sidebarAds.map((ad) => <SidebarAdCard key={'related-' + ad.id} ad={ad} height={242} />)}
            </div>
          </div>
        )}

        {/* Nav Cards */}
        <div style={{ width: '100%', marginTop: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px', padding: '40px 0' }}>
          {navCards.map((card) => <NavCard key={card.title} card={card} />)}
        </div>
      </div>

      <SubscribeSection />
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}><Footer /></div>

      {showShareModal && (
        <ShareModal shareUrl={shareUrl} shareTitle={shareTitle} onClose={() => setShowShareModal(false)} />
      )}

      <style>{`@keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-12px); } }`}</style>
    </div>
  )
}

export default MemeDetail