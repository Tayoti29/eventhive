import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { supabase } from '../supabaseClient'
import { useIsMobile } from '../hooks/useIsMobile'
import { useAds } from '../hooks/useAds'

const eventCategories = [
  { label: 'All Events', icon: '🎪' }, { label: 'Concert', icon: '🎵' },
  { label: 'Religion', icon: '⛪' }, { label: 'Education', icon: '📚' },
  { label: 'Politics', icon: '🏛️' }, { label: 'Science', icon: '🔬' },
  { label: 'Tech', icon: '💻' }, { label: 'Sports', icon: '⚽' },
  { label: 'Food', icon: '🍔' }, { label: 'Fashion', icon: '👗' },
  { label: 'Business', icon: '💼' }, { label: 'Arts', icon: '🎨' },
  { label: 'Health', icon: '❤️' }, { label: 'Music', icon: '🎶' },
  { label: 'Comedy', icon: '😂' }, { label: 'Party', icon: '🎉' },
]

const bannerImages = [
  'https://picsum.photos/seed/eventbanner1/155/182',
  'https://picsum.photos/seed/eventbanner2/155/182',
  'https://picsum.photos/seed/eventbanner3/155/182',
]

const sampleEvents = Array.from({ length: 12 }, (_, i) => ({
  id: 'sample-' + i,
  title: ['Zero To Hero', 'Managing Gen Z', 'Embracing Change', 'Nurses Hangout'][i % 4],
  description: 'Sample event description for demonstration',
  category: ['Business', 'Education', 'Business', 'Health'][i % 4],
  image_url: 'https://picsum.photos/seed/ev' + i + '/296/280',
  organizer_name: ['Jane Ololade', 'Ilegbejie Doris', 'Strengths Africa', 'Unilag'][i % 4],
  organizer_avatar: 'https://i.pravatar.cc/32?img=' + (i + 10),
  event_date: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toISOString(),
  is_free: i % 2 === 0,
  ticket_price: i % 2 !== 0 ? '₦2,000' : null,
  location: ['Lagos', 'Abuja', 'Online', 'Ibadan'][i % 4],
  event_days: 'one',
}))

function AnimatedBannerCards({ isMobile }) {
  const [hovered, setHovered] = useState(false)
  const size = isMobile ? 100 : 228
  const cardW = isMobile ? 68 : 155
  const cardH = isMobile ? 80 : 182
  const radius = isMobile ? '16px' : '32px'
  return (
    <div style={{ position: 'relative', width: size + 'px', height: size + 'px', flexShrink: 0 }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={{ position: 'absolute', top: 0, right: 0, width: cardW + 'px', height: cardH + 'px', borderRadius: radius, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', transition: 'transform 0.4s ease', zIndex: 1, transform: hovered ? 'rotate(-12deg) translateX(-8px)' : 'rotate(-8deg)' }}>
        <img src={bannerImages[2]} alt="Event" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ position: 'absolute', top: (isMobile ? '10px' : '20px'), left: (isMobile ? '10px' : '20px'), width: cardW + 'px', height: cardH + 'px', borderRadius: radius, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', transition: 'transform 0.4s ease', zIndex: 2, transform: hovered ? 'rotate(6deg) translateY(-8px)' : 'rotate(4deg)' }}>
        <img src={bannerImages[1]} alt="Event" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ position: 'absolute', top: (isMobile ? '16px' : '36px'), left: 0, width: cardW + 'px', height: cardH + 'px', borderRadius: radius, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', transition: 'transform 0.4s ease', zIndex: 3, transform: hovered ? 'rotate(-3deg) translateY(-12px)' : 'rotate(-2deg)' }}>
        <img src={bannerImages[0]} alt="Event" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    </div>
  )
}

function EventCard({ event, isMobile }) {
  const [hovered, setHovered] = useState(false)
  const [liked, setLiked] = useState(false)
  const navigate = useNavigate()

  const isEveryday = event.event_days === 'everyday'
  const daysLeft = event.event_date && !isEveryday
    ? Math.ceil((new Date(event.event_date) - new Date()) / (1000 * 60 * 60 * 24))
    : null

  const showBadge = isEveryday || (daysLeft !== null && daysLeft > 0)
  const badgeText = isEveryday ? '🔁 Everyday' : daysLeft === 1 ? 'Tomorrow' : daysLeft + ' days to go'
  const badgeBg = isEveryday ? '#F0FDF4' : '#FFF6DE'
  const badgeBorder = isEveryday ? '#4CAF50' : '#FED86E'
  const badgeColor = isEveryday ? '#2E7D32' : '#B88700'

  return (
    <div
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onClick={() => navigate('/events/' + event.id)}
      style={{ width: '100%', borderRadius: isMobile ? '12px' : '16px', overflow: 'hidden', cursor: 'pointer', boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', transform: hovered ? 'translateY(-4px)' : 'translateY(0)', backgroundColor: '#FFFFFF', marginBottom: isMobile ? '0' : '24px' }}
    >
      <div style={{ position: 'relative', width: '100%', height: isMobile ? '140px' : '200px' }}>
        <img
          src={event.image_url || 'https://picsum.photos/seed/' + event.id + '/296/200'}
          alt={event.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />

        <div style={{ position: 'absolute', top: isMobile ? '8px' : '12px', right: isMobile ? '8px' : '12px', padding: isMobile ? '2px 8px' : '3px 10px', borderRadius: '9999px', backgroundColor: event.is_free ? '#F0FDF4' : '#FFF6DE', border: '1px solid ' + (event.is_free ? '#4CAF50' : '#FED86E') }}>
          <span style={{ fontSize: isMobile ? '9px' : '11px', fontWeight: '600', color: event.is_free ? '#4CAF50' : '#B88700' }}>
            {event.is_free ? 'Free' : event.ticket_price || 'Paid'}
          </span>
        </div>

        {showBadge && (
          <div style={{ position: 'absolute', top: isMobile ? '8px' : '12px', left: isMobile ? '8px' : '12px', padding: isMobile ? '2px 8px' : '3px 10px', borderRadius: '9999px', backgroundColor: badgeBg, border: '1px solid ' + badgeBorder }}>
            <span style={{ fontSize: isMobile ? '9px' : '11px', fontWeight: '500', color: badgeColor }}>
              {badgeText}
            </span>
          </div>
        )}

        {!isMobile && (
          <button
            onClick={(e) => { e.stopPropagation(); setLiked(!liked) }}
            style={{ position: 'absolute', bottom: '12px', right: '12px', width: '32px', height: '32px', borderRadius: '9999px', backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: hovered ? 1 : 0, transition: 'opacity 0.3s ease' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? '#D90870' : 'none'} stroke="#D90870" strokeWidth="2">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </button>
        )}
        {isMobile && (
          <button
            onClick={(e) => { e.stopPropagation(); setLiked(!liked) }}
            style={{ position: 'absolute', bottom: '8px', right: '8px', width: '26px', height: '26px', borderRadius: '9999px', backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill={liked ? '#D90870' : 'none'} stroke="#D90870" strokeWidth="2">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </button>
        )}
      </div>

      <div style={{ padding: isMobile ? '8px' : '12px', backgroundColor: hovered ? '#F9F9F9' : '#FFFFFF', transition: 'background-color 0.3s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '8px' }}>
          {event.organizer_avatar ? (
            <img src={event.organizer_avatar} alt="organizer" style={{ width: isMobile ? '22px' : '28px', height: isMobile ? '22px' : '28px', borderRadius: '9999px', objectFit: 'cover', flexShrink: 0 }} />
          ) : (
            <div style={{ width: isMobile ? '22px' : '28px', height: isMobile ? '22px' : '28px', borderRadius: '9999px', backgroundColor: '#0097FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: '11px', fontWeight: '700', flexShrink: 0 }}>
              {(event.organizer_name || 'E').charAt(0).toUpperCase()}
            </div>
          )}
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: isMobile ? '12px' : '13px', fontWeight: '600', color: '#141415', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{event.title}</p>
            <p style={{ fontSize: isMobile ? '10px' : '11px', color: '#7E7E82', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {event.location || event.category}
              {isEveryday ? ' • Everyday' : event.event_date ? ' • ' + new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Ad card that fills an event grid slot — same footprint as EventCard, no title/organizer details
function EventAdCard({ ad, isMobile }) {
  const [hovered, setHovered] = useState(false)
  const content = (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ width: '100%', borderRadius: isMobile ? '12px' : '16px', overflow: 'hidden', boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', transform: hovered ? 'translateY(-4px)' : 'translateY(0)', backgroundColor: '#F3F3F4', position: 'relative', height: isMobile ? '140px' : '200px', cursor: ad.link ? 'pointer' : 'default', marginBottom: isMobile ? '0' : '24px' }}>
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

// Inserts an ad after every 8 events
function buildEventItemsWithAds(items, ads) {
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

function CategoryTabs({ category, onCategoryChange, isMobile }) {
  const [showFlyout, setShowFlyout] = useState(false)
  const flyoutRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (flyoutRef.current && !flyoutRef.current.contains(e.target)) setShowFlyout(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div style={{ backgroundColor: '#FFFFFF', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '20px' : '32px', position: 'relative', borderBottom: '1px solid #E8E8EA', overflowX: isMobile ? 'auto' : 'visible', WebkitOverflowScrolling: 'touch' }}>
        {['Events', 'Blog', 'Memes'].map((tab) => {
          const isActive = tab === 'Events'
          return (
            <div key={tab}
              onClick={() => {
                if (tab === 'Blog') navigate('/blog')
                else if (tab === 'Memes') navigate('/memes')
                else setShowFlyout(!showFlyout)
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: isMobile ? '14px 0' : '16px 0', cursor: 'pointer', borderBottom: isActive ? '2px solid #141415' : '2px solid transparent', marginBottom: '-1px', flexShrink: 0 }}>
              <span style={{ fontSize: isMobile ? '13px' : '14px', fontWeight: '500', color: isActive ? '#141415' : '#59595C' }}>
                {tab === 'Events' ? category : tab}
              </span>
              {isActive && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#141415" strokeWidth="2"
                  style={{ transform: showFlyout ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              )}
            </div>
          )
        })}

        {showFlyout && (
          <div ref={flyoutRef} style={{
            position: isMobile ? 'fixed' : 'absolute',
            top: isMobile ? undefined : '56px',
            bottom: isMobile ? 0 : undefined,
            left: isMobile ? 0 : 0,
            right: isMobile ? 0 : undefined,
            width: isMobile ? '100%' : '200px',
            borderRadius: isMobile ? '20px 20px 0 0' : '12px',
            backgroundColor: '#FFFFFF', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', padding: '16px 8px', zIndex: 200,
          }}>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#141415', padding: '0 8px', marginBottom: '12px' }}>Select from categories</p>
            <div style={{ maxHeight: isMobile ? '50vh' : '252px', overflowY: 'auto', scrollbarWidth: 'thin' }}>
              {eventCategories.map((cat) => {
                const isSelected = cat.label === category
                return (
                  <div key={cat.label}
                    onClick={() => { onCategoryChange(cat.label); setShowFlyout(false) }}
                    style={{ width: '100%', height: '40px', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 8px', borderRadius: '8px', cursor: 'pointer', backgroundColor: isSelected ? '#F3F3F4' : 'transparent', marginBottom: '4px' }}
                    onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = '#F9F9F9' }}
                    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent' }}>
                    <span style={{ fontSize: '16px' }}>{cat.icon}</span>
                    <span style={{ fontSize: '14px', color: isSelected ? '#141415' : '#59595C', fontWeight: isSelected ? '500' : '400' }}>{cat.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function CategoryEvents() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const initialCategory = searchParams.get('type') || 'All Events'
  const isMobile = useIsMobile()
  const { ads: eventGridAds } = useAds('event_list', 'grid')

  const [category, setCategory] = useState(initialCategory)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const loaderRef = useRef(null)
  const PAGE_SIZE = 8

  const fetchEvents = useCallback(async (cat, pageNum, append = false) => {
    if (pageNum === 0) setLoading(true)
    else setLoadingMore(true)

    try {
      let query = supabase
        .from('events').select('*')
        .order('created_at', { ascending: false })
        .range(pageNum * PAGE_SIZE, (pageNum + 1) * PAGE_SIZE - 1)

      if (cat !== 'All Events') query = query.eq('category', cat)

      const { data, error } = await query

      if (error) {
        console.error('Fetch error:', error.message)
        if (!append) setEvents(sampleEvents)
      } else {
        const results = data || []
        if (append) {
          setEvents((prev) => [...prev, ...results])
        } else {
          setEvents(results.length > 0 ? results : sampleEvents)
        }
        setHasMore(results.length === PAGE_SIZE)
      }
    } catch (err) {
      if (!append) setEvents(sampleEvents)
    }

    setLoading(false)
    setLoadingMore(false)
  }, [])

  useEffect(() => {
    setPage(0); setEvents([]); setHasMore(true)
    fetchEvents(category, 0, false)
  }, [category, fetchEvents])

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return
    const next = page + 1
    setPage(next)
    fetchEvents(category, next, true)
  }, [category, page, loadingMore, hasMore, fetchEvents])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore() }, { threshold: 0.1 }
    )
    if (loaderRef.current) observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [loadMore])

  const eventItems = buildEventItemsWithAds(events, eventGridAds)
  const columns = isMobile ? [[], []] : [[], [], [], []]
  eventItems.forEach((item, i) => columns[i % columns.length].push(item))

  return (
    <div style={{ backgroundColor: '#FFFFFF' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}><Navbar /></div>

      <section style={{ backgroundColor: '#F0F4FF', width: '100%' }}>
        <div style={{
          maxWidth: '1440px', margin: '0 auto',
          height: isMobile ? 'auto' : '328px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: isMobile ? '32px 20px' : '0 100px',
          gap: isMobile ? '16px' : 0,
        }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: isMobile ? '28px' : '40px', lineHeight: isMobile ? '34px' : '48px', fontWeight: '700', color: '#141415', marginBottom: isMobile ? '8px' : '12px' }}>{category}</h2>
            <p style={{ fontSize: isMobile ? '14px' : '24px', lineHeight: isMobile ? '20px' : '32px', fontWeight: '400', color: '#7E7E82', maxWidth: '600px' }}>
              Explore exciting events happening around you and never miss out on the fun.
            </p>
          </div>
          <AnimatedBannerCards isMobile={isMobile} />
        </div>
      </section>

      <section style={{ width: '100%', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: isMobile ? '0 20px' : '0 100px' }}>
          <CategoryTabs category={category} onCategoryChange={setCategory} isMobile={isMobile} />
        </div>
      </section>

      <section style={{ maxWidth: '1440px', margin: '0 auto', padding: isMobile ? '24px 20px' : '48px 100px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: '12px', height: '12px', borderRadius: '9999px', backgroundColor: '#0097FF', animation: 'bounce 0.6s ease ' + (i * 0.1) + 's infinite alternate' }} />
              ))}
            </div>
          </div>
        ) : events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#141415', marginBottom: '8px' }}>No events found</h3>
            <p style={{ fontSize: '16px', color: '#7E7E82' }}>Be the first to create an event in this category!</p>
          </div>
        ) : (
          <>
            <p style={{ color: '#7E7E82', fontSize: isMobile ? '13px' : '14px', marginBottom: isMobile ? '20px' : '32px' }}>
              Showing <strong style={{ color: '#141415' }}>{events.length}</strong> event{events.length !== 1 ? 's' : ''} in <strong style={{ color: '#141415' }}>{category}</strong>
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? '14px' : '24px', alignItems: 'start' }}>
              {isMobile
                ? eventItems.map((item, idx) =>
                    item.kind === 'ad'
                      ? <EventAdCard key={'ad-' + idx} ad={item.data} isMobile={isMobile} />
                      : <EventCard key={item.data.id} event={item.data} isMobile={isMobile} />
                  )
                : columns.map((col, colIndex) => (
                    <div key={colIndex}>
                      {col.map((item, idx) =>
                        item.kind === 'ad'
                          ? <EventAdCard key={'ad-' + colIndex + '-' + idx} ad={item.data} isMobile={isMobile} />
                          : <EventCard key={item.data.id} event={item.data} isMobile={isMobile} />
                      )}
                    </div>
                  ))
              }
            </div>
          </>
        )}

        <div ref={loaderRef} style={{ textAlign: 'center', padding: '40px 0' }}>
          {loadingMore && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: '10px', height: '10px', borderRadius: '9999px', backgroundColor: '#0097FF', animation: 'bounce 0.6s ease ' + (i * 0.1) + 's infinite alternate' }} />
              ))}
            </div>
          )}
          {!hasMore && events.length > 0 && (
            <p style={{ color: '#A5A5AA', fontSize: '14px' }}>You have seen all events 🎪</p>
          )}
        </div>
      </section>

      <style>{`@keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-12px); } }`}</style>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}><Footer /></div>
    </div>
  )
}

export default CategoryEvents