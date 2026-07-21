import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SaveButton from '../components/SaveButton'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabaseClient'
import { useIsMobile } from '../hooks/useIsMobile'
import { useAds } from '../hooks/useAds'

function isValidUUID(id) {
  return id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id))
}

function UserAvatar({ avatarUrl, name, size = 32 }) {
  const initial = (name || 'U').charAt(0).toUpperCase()
  if (avatarUrl) {
    return <img src={avatarUrl} alt={name} style={{ width: size, height: size, borderRadius: '9999px', objectFit: 'cover', flexShrink: 0 }} />
  }
  return (
    <div style={{ width: size, height: size, borderRadius: '9999px', backgroundColor: '#0097FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: size * 0.4, fontWeight: '700', flexShrink: 0 }}>
      {initial}
    </div>
  )
}

function BackButton({ isMobile }) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  return (
    <button onClick={() => navigate(-1)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ width: isMobile ? '76px' : '92px', height: isMobile ? '34px' : '40px', borderRadius: '8px', border: `1px solid ${hovered ? '#F3F3F4' : '#E8E8EA'}`, backgroundColor: hovered ? '#F9F9F9' : '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', boxShadow: hovered ? '0 2px 8px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.2s ease' }}>
      <svg width={isMobile ? '18' : '24'} height={isMobile ? '18' : '24'} viewBox="0 0 24 24" fill="none" stroke="#141415" strokeWidth="2" strokeLinecap="round">
        <polyline points="15 18 9 12 15 6" />
      </svg>
      <span style={{ fontSize: isMobile ? '13px' : '16px', color: '#141415', fontWeight: '400' }}>Back</span>
    </button>
  )
}

function StarRating({ user, location, navigate, isMobile }) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
      <span style={{ fontSize: isMobile ? '13px' : '14px', color: '#59595C', fontWeight: '500' }}>Rate this event</span>
      <div style={{ display: 'flex', gap: '4px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <svg key={star} width={isMobile ? '20' : '24'} height={isMobile ? '20' : '24'} viewBox="0 0 24 24"
            fill={(hover || rating) >= star ? '#FFB900' : 'none'} stroke="#FFB900" strokeWidth="1.5"
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)}
            onClick={() => {
              if (!user) { navigate('/login', { state: { backgroundLocation: location } }); return }
              setRating(star)
            }}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>
      {!user && <span style={{ fontSize: '12px', color: '#A5A5AA' }}>(Log in to rate)</span>}
    </div>
  )
}

function CopyButton({ text, label, isMobile }) {
  const [copied, setCopied] = useState(false)
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: isMobile ? '5px 10px' : '6px 12px', borderRadius: '8px', border: '1px solid #E8E8EA', backgroundColor: '#FFFFFF', cursor: 'pointer', fontSize: isMobile ? '12px' : '14px', color: '#59595C', whiteSpace: 'nowrap', flexShrink: 0 }}>
      <svg width={isMobile ? '14' : '16'} height={isMobile ? '14' : '16'} viewBox="0 0 24 24" fill="none" stroke="#59595C" strokeWidth="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
      {copied ? 'Copied!' : label}
    </button>
  )
}

const navCards = [
  { title: 'Discover Memes, Enjoy the fun', subtitle: 'Explore and discover exciting memes from our community.', bg: '#F6FBFF', icon: '🎭', to: '/memes' },
  { title: 'Read our Blogs on Events', subtitle: 'Reach a wider audience by listing your event on our platform.', bg: '#FFFCF4', icon: '📝', to: '/blog' },
  { title: 'Create Birthday and other Flyers', subtitle: 'Reach a wider audience by listing your event on our platform.', bg: '#FFF0F3', icon: '🖼️', to: '/flyers' },
]

const relatedEventsSample = Array.from({ length: 16 }, (_, i) => ({
  id: 'sample-rel-' + i,
  title: ['Zero To Hero', 'Managing Gen Z', 'Embracing Change', 'Nurses Hangout'][i % 4],
  location: ['Lagos', 'Abuja', 'Online', 'Ibadan'][i % 4],
  event_date: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toISOString(),
  image_url: 'https://picsum.photos/seed/related' + i + '/296/280',
  organizer_avatar: null,
  organizer_name: ['Jane Ololade', 'Ilegbejie Doris', 'Strengths Africa', 'Unilag'][i % 4],
  height: [280, 320, 260, 340, 300][i % 5],
}))

function NavCard({ card, isMobile }) {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()
  return (
    <div onClick={() => navigate(card.to)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        width: isMobile ? '100%' : '405px', height: isMobile ? 'auto' : '335px',
        borderRadius: '12px', backgroundColor: card.bg, cursor: 'pointer',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: isMobile ? '24px' : '32px', boxSizing: 'border-box',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.10)' : 'none',
      }}>
      <div style={{ fontSize: isMobile ? '40px' : '64px', lineHeight: 1, marginBottom: isMobile ? '12px' : 0 }}>{card.icon}</div>
      <div>
        <h4 style={{ fontSize: isMobile ? '18px' : '24px', lineHeight: isMobile ? '24px' : '32px', fontWeight: '700', color: '#141415', margin: '0 0 8px 0' }}>{card.title}</h4>
        <p style={{ fontSize: isMobile ? '13px' : '16px', lineHeight: isMobile ? '19px' : '24px', color: '#59595C', margin: 0 }}>{card.subtitle}</p>
      </div>
    </div>
  )
}

function RelatedEventCard({ event, isMobile }) {
  const [hovered, setHovered] = useState(false)
  const [liked, setLiked] = useState(false)
  const navigate = useNavigate()
  const daysLeft = event.event_date ? Math.ceil((new Date(event.event_date) - new Date()) / (1000 * 60 * 60 * 24)) : null

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onClick={() => navigate('/events/' + event.id)}
      style={{
        width: '100%', borderRadius: isMobile ? '12px' : '16px', overflow: 'hidden', cursor: 'pointer',
        boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease', transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        backgroundColor: '#FFFFFF', marginBottom: isMobile ? 0 : '24px',
      }}>
      <div style={{ position: 'relative', width: '100%', height: isMobile ? '150px' : (event.height || 240) + 'px' }}>
        <img src={event.image_url || 'https://picsum.photos/seed/' + event.id + '/296/240'} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        {daysLeft !== null && daysLeft > 0 && (
          <div style={{ position: 'absolute', top: isMobile ? '8px' : '12px', right: isMobile ? '8px' : '12px', height: isMobile ? '20px' : '24px', padding: isMobile ? '0 8px' : '0 10px', borderRadius: '9999px', backgroundColor: '#FFF6DE', border: '1px solid #FED86E', display: 'flex', alignItems: 'center' }}>
            <span style={{ color: '#B88700', fontSize: isMobile ? '10px' : '12px', fontWeight: '500' }}>
              {daysLeft === 1 ? 'Tomorrow' : daysLeft + ' days to go'}
            </span>
          </div>
        )}
        <button onClick={(e) => { e.stopPropagation(); setLiked(!liked) }}
          style={{ position: 'absolute', top: isMobile ? '8px' : '12px', left: isMobile ? '8px' : '12px', width: isMobile ? '26px' : '32px', height: isMobile ? '26px' : '32px', borderRadius: '9999px', backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isMobile ? 1 : (hovered ? 1 : 0), transition: 'opacity 0.3s ease' }}>
          <svg width={isMobile ? '13' : '16'} height={isMobile ? '13' : '16'} viewBox="0 0 24 24" fill={liked ? '#D90870' : 'none'} stroke="#D90870" strokeWidth="2">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
      </div>
      <div style={{ padding: isMobile ? '8px' : '10px 12px', backgroundColor: hovered ? '#F9F9F9' : '#FFFFFF', transition: 'background-color 0.3s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '8px' }}>
          <UserAvatar avatarUrl={event.organizer_avatar} name={event.organizer_name} size={isMobile ? 22 : 28} />
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: isMobile ? '12px' : '13px', fontWeight: '500', color: '#141415', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{event.title}</p>
            <p style={{ fontSize: isMobile ? '10px' : '11px', color: '#7E7E82', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {event.location} {event.event_date ? '• ' + new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Ad card that fills a related-events grid slot — same footprint as RelatedEventCard, no details
function RelatedEventAdCard({ ad, isMobile }) {
  const [hovered, setHovered] = useState(false)
  const content = (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ width: '100%', borderRadius: isMobile ? '12px' : '16px', overflow: 'hidden', cursor: ad.link ? 'pointer' : 'default', boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', transform: hovered ? 'translateY(-4px)' : 'translateY(0)', backgroundColor: '#F3F3F4', position: 'relative', height: isMobile ? '150px' : '240px', marginBottom: isMobile ? 0 : '24px' }}>
      {ad.type === 'video'
        ? <video src={ad.src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} autoPlay loop muted playsInline />
        : <img src={ad.src} alt="Advertisement" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      }
      <span style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '10px', fontWeight: '600', color: '#FFFFFF', backgroundColor: 'rgba(0,0,0,0.55)', padding: '3px 10px', borderRadius: '9999px', letterSpacing: '0.3px' }}>
        Ad
      </span>
    </div>
  )
  if (ad.link) return <a href={ad.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>{content}</a>
  return content
}

// Inserts an ad after every 8 related events
function buildRelatedEventItemsWithAds(items, ads) {
  if (!ads || ads.length === 0) return items.map((it) => ({ kind: 'event', data: it }))
  const out = []
  let adIndex = 0
  items.forEach((it, i) => {
    out.push({ kind: 'event', data: it })
    if ((i + 1) % 8 === 0) {
      out.push({ kind: 'ad', data: ads[adIndex % ads.length] })
      adIndex += 1
    }
  })
  return out
}

function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const isMobile = useIsMobile()
  const { ads: relatedGridAds } = useAds('event_detail', 'related_grid')

  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [relatedEvents, setRelatedEvents] = useState([])
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const [moreOptionsOpen, setMoreOptionsOpen] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(0)
  const [copiedToast, setCopiedToast] = useState('')

  useEffect(() => { fetchEvent() }, [id])

  const fetchEvent = async () => {
    setLoading(true)
    setNotFound(false)

    if (!isValidUUID(id)) {
      setNotFound(true)
      setLoading(false)
      setRelatedEvents(relatedEventsSample)
      return
    }

    try {
      const { data, error } = await supabase.from('events').select('*').eq('id', id).single()
      if (error || !data) {
        setNotFound(true)
        setRelatedEvents(relatedEventsSample)
      } else {
        setEvent(data)
        setLikes(data.likes || 0)
        const { data: related } = await supabase.from('events').select('*').eq('category', data.category).neq('id', id).limit(16)
        setRelatedEvents(related && related.length > 0 ? related : relatedEventsSample)
      }
    } catch (err) {
      setNotFound(true)
      setRelatedEvents(relatedEventsSample)
    }
    setLoading(false)
  }

  const getCommentAuthor = () => {
    const meta = user?.user_metadata || {}
    const name = meta.full_name || meta.username || meta.first_name || (user?.email ? user.email.split('@')[0] : 'You')
    const avatar = meta.avatar_url || null
    return { name, avatar }
  }

  const handleComment = () => {
    if (!user) { navigate('/login', { state: { backgroundLocation: location } }); return }
    if (!comment.trim()) return
    const author = getCommentAuthor()
    setComments([...comments, { id: Date.now(), name: author.name, avatar: author.avatar, text: comment, time: 'Just now' }])
    setComment('')
  }

  const handleLike = () => {
    if (liked) return
    setLiked(true)
    setLikes(likes + 1)
  }

  const handleDownloadFlyer = async () => {
    if (!event?.image_url) return
    try {
      const response = await fetch(event.image_url, { mode: 'cors' })
      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      const ext = (blob.type && blob.type.split('/')[1]) || 'jpg'
      a.download = (event.title || 'event-flyer').slice(0, 40).replace(/\s/g, '_') + '.' + ext
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(blobUrl)
    } catch (err) {
      window.open(event.image_url, '_blank')
    }
  }

  const handleShare = async () => {
    const shareUrl = window.location.href
    if (navigator.share) {
      try { await navigator.share({ title: event?.title || 'Event on EventHive', url: shareUrl }) } catch {}
    } else {
      navigator.clipboard.writeText(shareUrl)
      setCopiedToast('Link copied!')
      setTimeout(() => setCopiedToast(''), 2000)
    }
  }

  if (loading) {
    return (
      <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}><Navbar /></div>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '120px 0' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[0, 1, 2].map((i) => <div key={i} style={{ width: '12px', height: '12px', borderRadius: '9999px', backgroundColor: '#0097FF', animation: 'bounce 0.6s ease ' + (i * 0.1) + 's infinite alternate' }} />)}
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
        <div style={{ textAlign: 'center', padding: isMobile ? '80px 20px' : '120px 100px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>😕</div>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#141415', marginBottom: '12px' }}>Event not found</h2>
          <p style={{ fontSize: '16px', color: '#7E7E82', marginBottom: '24px' }}>This event may have been removed or does not exist.</p>
          <button onClick={() => navigate('/category?type=All Events')}
            style={{ height: '44px', padding: '0 24px', borderRadius: '8px', backgroundColor: '#0097FF', color: '#FFFFFF', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
            Browse Events
          </button>
        </div>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}><Footer /></div>
      </div>
    )
  }

  const ev = event
  const relatedItemsWithAds = buildRelatedEventItemsWithAds(relatedEvents, relatedGridAds)
  const columns = [[], [], [], []]
  relatedItemsWithAds.forEach((item, i) => columns[i % 4].push(item))

  return (
    <div style={{ backgroundColor: '#FFFFFF' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}><Navbar /></div>

      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: isMobile ? '16px 16px 40px' : '32px 80px 80px 80px' }}>
        {!isMobile && <BackButton isMobile={isMobile} />}

        {isMobile ? (
          <>
            {/* ── MOBILE LAYOUT ── */}

            <div style={{ width: '100%', borderRadius: '16px', overflow: 'hidden', backgroundColor: '#F3F3F4' }}>
              <img src={ev.image_url || 'https://picsum.photos/seed/' + ev.id + '/514/600'} alt={ev.title} style={{ width: '100%', display: 'block', objectFit: 'cover' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '14px 4px' }}>
              <button onClick={handleDownloadFlyer} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#414143" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
              </button>
              <button onClick={handleShare} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#414143" strokeWidth="2"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
              </button>
              <SaveButton item={{ id: ev.id, type: 'event', title: ev.title, image: ev.image_url }} />
              <div style={{ flex: 1 }} />
              <button onClick={handleLike} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: liked ? 'default' : 'pointer', padding: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill={liked ? '#D90870' : 'none'} stroke="#D90870" strokeWidth="2">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <span style={{ fontSize: '14px', color: liked ? '#D90870' : '#7E7E82' }}>{likes.toLocaleString()}</span>
              </button>
            </div>

            {copiedToast && (
              <p style={{ fontSize: '12px', color: '#2E7D32', margin: '0 0 8px' }}>{copiedToast}</p>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 4px 12px' }}>
              <UserAvatar avatarUrl={ev.organizer_avatar} name={ev.organizer_name} size={40} />
              <div>
                <p style={{ fontSize: '15px', fontWeight: '700', color: '#141415', margin: 0 }}>{ev.organizer_name || 'Organizer'}</p>
                <p style={{ fontSize: '12px', color: '#7E7E82', margin: 0 }}>Event Organizer</p>
              </div>
            </div>

            <div style={{ padding: '0 4px' }}>
              <h4 style={{ fontSize: '20px', lineHeight: '26px', fontWeight: '700', color: '#141415', marginBottom: '10px' }}>{ev.title}</h4>
              {ev.description && (
                <p style={{ fontSize: '14px', lineHeight: '21px', color: '#59595C', marginBottom: '16px', whiteSpace: 'pre-line' }}>{ev.description}</p>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 16px', marginBottom: '18px' }}>
                {[
                  { icon: '📍', label: ev.venue_type === 'online' ? 'Online Event' : ev.venue_type === 'both' ? (ev.location || 'Physical') + ' + Online' : ev.location || 'Location TBD' },
                  { icon: '📅', label: ev.event_date ? new Date(ev.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Date TBD' },
                  { icon: '🕐', label: ev.time ? (ev.time_end ? ev.time + ' – ' + ev.time_end : ev.time) : 'Time TBD' },
                  { icon: '💰', label: ev.is_free ? 'Free Entry' : ev.ticket_price || 'Paid Entry' },
                ].map((item) => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ fontSize: '13px' }}>{item.icon}</span>
                    <span style={{ fontSize: '12px', color: '#59595C' }}>{item.label}</span>
                  </div>
                ))}
              </div>

              {ev.tags && ev.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '18px' }}>
                  {ev.tags.map((tag) => (
                    <span key={tag} style={{ padding: '3px 10px', borderRadius: '9999px', backgroundColor: '#EFF9FF', border: '1px solid #0097FF', fontSize: '11px', color: '#0097FF', fontWeight: '500' }}>{tag}</span>
                  ))}
                </div>
              )}

              {ev.registration_link && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E8E8EA', backgroundColor: '#F9F9F9', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '10px', color: '#B88700', backgroundColor: '#FFF6DE', border: '1px solid #FED86E', borderRadius: '9999px', padding: '2px 8px', whiteSpace: 'nowrap', fontWeight: '500' }}>Registration Link</span>
                  <span style={{ fontSize: '12px', color: '#59595C', flex: 1, minWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.registration_link}</span>
                  <CopyButton text={ev.registration_link} label="Copy" isMobile />
                </div>
              )}

              {ev.location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E8E8EA', backgroundColor: '#F9F9F9', marginBottom: '20px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '10px', color: '#0097FF', backgroundColor: '#EFF9FF', border: '1px solid #0097FF', borderRadius: '9999px', padding: '2px 8px', whiteSpace: 'nowrap', fontWeight: '500' }}>Event Venue</span>
                  <span style={{ fontSize: '12px', color: '#59595C', flex: 1, minWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.location}</span>
                  <CopyButton text={ev.location} label="Copy" isMobile />
                </div>
              )}

              <div style={{ border: '1px solid #E8E8EA', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                <h5 style={{ fontSize: '16px', fontWeight: '700', color: '#141415', marginBottom: '2px' }}>Comment</h5>
                <p style={{ fontSize: '12px', color: '#7E7E82', marginBottom: '14px' }}>Drop a comment and tell us how you feel</p>

                {comments.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '14px' }}>
                    {comments.map((c) => (
                      <div key={c.id} style={{ display: 'flex', gap: '10px' }}>
                        <UserAvatar avatarUrl={c.avatar} name={c.name} size={28} />
                        <div style={{ flex: 1, backgroundColor: '#F9F9F9', borderRadius: '8px', padding: '8px 12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                            <span style={{ fontSize: '12px', fontWeight: '600', color: '#141415' }}>{c.name}</span>
                            <span style={{ fontSize: '10px', color: '#A5A5AA' }}>{c.time}</span>
                          </div>
                          <p style={{ fontSize: '13px', color: '#414143', margin: 0 }}>{c.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ position: 'relative' }}>
                  <input type="text" placeholder="Add a comment" value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleComment() }}
                    onClick={() => { if (!user) navigate('/login', { state: { backgroundLocation: location } }) }}
                    readOnly={!user}
                    style={{ width: '100%', height: '44px', borderRadius: '8px', border: '1px solid #E8E8EA', padding: '0 46px 0 14px', fontSize: '13px', color: '#414143', backgroundColor: user ? '#FFFFFF' : '#F9F9F9', outline: 'none', boxSizing: 'border-box', cursor: user ? 'text' : 'pointer' }} />
                  {user && (
                    <button onClick={handleComment} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0097FF" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                    </button>
                  )}
                </div>
              </div>

              <StarRating user={user} location={location} navigate={navigate} isMobile />
            </div>
          </>
        ) : (
          <>
            {/* ── DESKTOP LAYOUT (unchanged) ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '514px 1fr', gap: '48px', marginTop: '32px', alignItems: 'start' }}>

              <div style={{ width: '514px', minHeight: '400px', maxHeight: '680px', borderRadius: '16px', overflow: 'hidden', backgroundColor: '#F3F3F4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <img src={ev.image_url || 'https://picsum.photos/seed/' + ev.id + '/514/600'} alt={ev.title} style={{ width: '100%', objectFit: 'contain', maxHeight: '680px' }} />
              </div>

              <div style={{ maxHeight: '680px', overflowY: 'auto', overflowX: 'hidden', paddingRight: '8px', scrollbarWidth: 'thin', scrollbarColor: '#C7C7CA #F3F3F4' }}>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <span style={{ fontSize: '24px', lineHeight: '32px', fontWeight: '400', color: '#141415' }}>{ev.category || 'Event'}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <SaveButton item={{ id: ev.id, type: 'event', title: ev.title, image: ev.image_url }} />
                    <div style={{ position: 'relative' }}>
                      <button onClick={() => setMoreOptionsOpen(!moreOptionsOpen)}
                        style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #E8E8EA', backgroundColor: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#59595C"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>
                      </button>
                      {moreOptionsOpen && (
                        <div style={{ position: 'absolute', right: 0, top: '44px', backgroundColor: '#FFFFFF', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', padding: '8px', zIndex: 10, minWidth: '140px' }}>
                          {['Share Event', 'Report Event', 'Copy Link'].map((opt) => (
                            <div key={opt} style={{ padding: '8px 12px', fontSize: '14px', color: '#414143', cursor: 'pointer', borderRadius: '6px' }}
                              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F9F9F9' }}
                              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                              onClick={() => { if (opt === 'Copy Link') navigator.clipboard.writeText(window.location.href); setMoreOptionsOpen(false) }}>
                              {opt}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <UserAvatar avatarUrl={ev.organizer_avatar} name={ev.organizer_name} size={36} />
                  <div>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#141415' }}>{ev.organizer_name || 'Organizer'}</span>
                    <p style={{ fontSize: '12px', color: '#7E7E82', margin: 0 }}>Event Organizer</p>
                  </div>
                </div>

                <div style={{ height: '1px', backgroundColor: '#E8E8EA', marginBottom: '20px' }} />

                <h4 style={{ fontSize: '24px', lineHeight: '32px', fontWeight: '700', color: '#141415', marginBottom: '12px' }}>{ev.title}</h4>
                {ev.description && (
                  <p style={{ fontSize: '16px', lineHeight: '24px', color: '#59595C', marginBottom: '20px', whiteSpace: 'pre-line' }}>{ev.description}</p>
                )}

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                  {[
                    { icon: '📍', label: ev.venue_type === 'online' ? 'Online Event' : ev.venue_type === 'both' ? (ev.location || 'Physical') + ' + Online' : ev.location || 'Location TBD' },
                    { icon: '📅', label: ev.event_date ? new Date(ev.event_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : 'Date TBD' },
                    { icon: '🕐', label: ev.time ? (ev.time_end ? ev.time + ' – ' + ev.time_end : ev.time) : 'Time TBD' },
                    { icon: '💰', label: ev.is_free ? 'Free Entry' : ev.ticket_price || 'Paid Entry' },
                  ].map((item) => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '16px' }}>{item.icon}</span>
                      <span style={{ fontSize: '14px', color: '#59595C' }}>{item.label}</span>
                    </div>
                  ))}
                </div>

                {ev.tags && ev.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                    {ev.tags.map((tag) => (
                      <span key={tag} style={{ padding: '4px 12px', borderRadius: '9999px', backgroundColor: '#EFF9FF', border: '1px solid #0097FF', fontSize: '12px', color: '#0097FF', fontWeight: '500' }}>{tag}</span>
                    ))}
                  </div>
                )}

                <div style={{ height: '1px', backgroundColor: '#E8E8EA', marginBottom: '20px' }} />

                {ev.registration_link && (
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', border: '1px solid #E8E8EA', backgroundColor: '#F9F9F9' }}>
                      <span style={{ fontSize: '12px', color: '#B88700', backgroundColor: '#FFF6DE', border: '1px solid #FED86E', borderRadius: '9999px', padding: '2px 10px', whiteSpace: 'nowrap', fontWeight: '500' }}>Registration Link</span>
                      <span style={{ fontSize: '13px', color: '#59595C', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.registration_link}</span>
                      <CopyButton text={ev.registration_link} label="Copy" />
                    </div>
                  </div>
                )}

                <div style={{ height: '1px', backgroundColor: '#E8E8EA', marginBottom: '20px' }} />

                <div style={{ marginBottom: '24px' }}>
                  <h5 style={{ fontSize: '20px', fontWeight: '700', color: '#141415', marginBottom: '4px' }}>Comments</h5>
                  <p style={{ fontSize: '14px', color: '#7E7E82', marginBottom: '16px' }}>Drop a comment and tell us how you feel</p>

                  {comments.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
                      {comments.map((c) => (
                        <div key={c.id} style={{ display: 'flex', gap: '12px' }}>
                          <UserAvatar avatarUrl={c.avatar} name={c.name} size={32} />
                          <div style={{ flex: 1, backgroundColor: '#F9F9F9', borderRadius: '8px', padding: '10px 14px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                              <span style={{ fontSize: '13px', fontWeight: '600', color: '#141415' }}>{c.name}</span>
                              <span style={{ fontSize: '11px', color: '#A5A5AA' }}>{c.time}</span>
                            </div>
                            <p style={{ fontSize: '14px', color: '#414143', margin: 0 }}>{c.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ position: 'relative' }}>
                    <input type="text" placeholder={user ? 'Add a comment...' : 'Log in to comment'} value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleComment() }}
                      onClick={() => { if (!user) navigate('/login', { state: { backgroundLocation: location } }) }}
                      readOnly={!user}
                      style={{ width: '100%', height: '48px', borderRadius: '8px', border: '1px solid #E8E8EA', padding: '0 50px 0 16px', fontSize: '14px', color: '#414143', backgroundColor: user ? '#FFFFFF' : '#F9F9F9', outline: 'none', boxSizing: 'border-box', cursor: user ? 'text' : 'pointer' }} />
                    {user && (
                      <button onClick={handleComment} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0097FF" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                      </button>
                    )}
                  </div>
                </div>

                <div style={{ height: '1px', backgroundColor: '#E8E8EA', marginBottom: '20px' }} />

                <StarRating user={user} location={location} navigate={navigate} />
              </div>
            </div>
          </>
        )}

        {/* Nav Cards */}
        <div style={{
          width: '100%', marginTop: isMobile ? '48px' : '80px',
          display: 'flex', flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center', justifyContent: 'center',
          gap: isMobile ? '16px' : '40px', padding: isMobile ? '0' : '40px 0',
        }}>
          {navCards.map((card) => <NavCard key={card.title} card={card} isMobile={isMobile} />)}
        </div>

        {/* Related Events */}
        <div style={{ marginTop: isMobile ? '40px' : '80px' }}>
          <h2 style={{ fontSize: isMobile ? '22px' : '40px', lineHeight: isMobile ? '28px' : '48px', fontWeight: '700', color: '#141415', marginBottom: isMobile ? '18px' : '32px' }}>
            Related Events
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? '14px' : '24px', alignItems: 'start' }}>
            {isMobile
              ? relatedItemsWithAds.map((item, idx) =>
                  item.kind === 'ad'
                    ? <RelatedEventAdCard key={'ad-' + idx} ad={item.data} isMobile={isMobile} />
                    : <RelatedEventCard key={item.data.id} event={item.data} isMobile={isMobile} />
                )
              : columns.map((col, colIndex) => (
                  <div key={colIndex}>
                    {col.map((item, idx) =>
                      item.kind === 'ad'
                        ? <RelatedEventAdCard key={'ad-' + colIndex + '-' + idx} ad={item.data} isMobile={isMobile} />
                        : <RelatedEventCard key={item.data.id} event={item.data} isMobile={isMobile} />
                    )}
                  </div>
                ))
            }
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1440px', margin: '0 auto' }}><Footer /></div>
      <style>{`@keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-12px); } }`}</style>
    </div>
  )
}

export default EventDetail