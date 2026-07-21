import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { supabase } from '../supabaseClient'
import { useIsMobile } from '../hooks/useIsMobile'
import advertImg from '../assets/subscribe-card1.png'
import { useAds } from '../hooks/useAds'

const memeCategories = [
  { label: 'All Memes', icon: '😂' },
  { label: 'Funny', icon: '🤣' },
  { label: 'Relatable', icon: '😅' },
  { label: 'Motivational', icon: '💪' },
  { label: 'Naija', icon: '🇳🇬' },
  { label: 'Couple Goals', icon: '❤️' },
  { label: 'Work Life', icon: '💼' },
  { label: 'School', icon: '📚' },
  { label: 'Politics', icon: '🏛️' },
  { label: 'Sports', icon: '⚽' },
]

const cardHeights = [280, 320, 260, 340, 300, 360, 280, 310, 350, 270, 330, 290]
const mobileCardHeights = [160, 180, 150, 190, 170, 200, 160, 175, 195, 155, 185, 165]

const bannerMemes = [
  'https://picsum.photos/seed/memebanner1/155/182',
  'https://picsum.photos/seed/memebanner2/155/182',
  'https://picsum.photos/seed/memebanner3/155/182',
]


function isVideoFile(src) { return /\.(mp4|webm|mov)$/i.test(src || '') }
function AdMedia({ src, type, style, alt }) {
  const isVideo = type === 'video' || isVideoFile(src)
  if (isVideo) return <video src={src} style={style} autoPlay loop muted playsInline />
  return <img src={src} alt={alt || 'Advertisement'} style={style} />
}

function isValidUUID(id) {
  return id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id))
}

function UserAvatar({ avatarUrl, name, size }) {
  const s = size || 24
  const initial = (name || 'U').charAt(0).toUpperCase()
  if (avatarUrl) return <img src={avatarUrl} alt={name} style={{ width: s, height: s, borderRadius: '9999px', objectFit: 'cover', flexShrink: 0 }} />
  return (
    <div style={{ width: s, height: s, borderRadius: '9999px', backgroundColor: '#0097FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: s * 0.4, fontWeight: '700', flexShrink: 0 }}>
      {initial}
    </div>
  )
}

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
        <img src={bannerMemes[2]} alt="Meme" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ position: 'absolute', top: isMobile ? '10px' : '20px', left: isMobile ? '10px' : '20px', width: cardW + 'px', height: cardH + 'px', borderRadius: radius, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', transition: 'transform 0.4s ease', zIndex: 2, transform: hovered ? 'rotate(6deg) translateY(-8px)' : 'rotate(4deg)' }}>
        <img src={bannerMemes[1]} alt="Meme" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ position: 'absolute', top: isMobile ? '16px' : '36px', left: 0, width: cardW + 'px', height: cardH + 'px', borderRadius: radius, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', transition: 'transform 0.4s ease', zIndex: 3, transform: hovered ? 'rotate(-3deg) translateY(-12px)' : 'rotate(-2deg)' }}>
        <img src={bannerMemes[0]} alt="Meme" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    </div>
  )
}

function MemeTabs({ category, onCategoryChange, isMobile }) {
  const [showFlyout, setShowFlyout] = useState(false)
  const flyoutRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handler = (e) => { if (flyoutRef.current && !flyoutRef.current.contains(e.target)) setShowFlyout(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div style={{ backgroundColor: '#FFFFFF', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '20px' : '32px', position: 'relative', borderBottom: '1px solid #E8E8EA', overflowX: isMobile ? 'auto' : 'visible', WebkitOverflowScrolling: 'touch' }}>
        {['Events', 'Blog', 'Memes'].map((tab) => {
          const isActive = tab === 'Memes'
          return (
            <div key={tab}
              onClick={() => {
                if (tab === 'Events') navigate('/category?type=All Events')
                if (tab === 'Blog') navigate('/blog')
                if (tab === 'Memes') setShowFlyout(!showFlyout)
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: isMobile ? '14px 0' : '16px 0', cursor: 'pointer', borderBottom: isActive ? '2px solid #141415' : '2px solid transparent', marginBottom: '-1px', flexShrink: 0 }}>
              <span style={{ fontSize: isMobile ? '13px' : '14px', fontWeight: '500', color: isActive ? '#141415' : '#59595C' }}>
                {tab === 'Memes' ? category : tab}
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
              {memeCategories.map((cat) => {
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

function MemeCard({ meme, index, isMobile }) {
  const [hovered, setHovered] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(meme.likes || 0)
  const navigate = useNavigate()

  const heights = isMobile ? mobileCardHeights : cardHeights
  const cardH = heights[index % heights.length]

  const handleClick = () => { if (isValidUUID(meme.id)) navigate('/memes/' + meme.id) }

  return (
    <div
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      style={{ width: '100%', borderRadius: isMobile ? '12px' : '16px', overflow: 'hidden', cursor: isValidUUID(meme.id) ? 'pointer' : 'default', boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', transform: hovered ? 'translateY(-4px)' : 'translateY(0)', backgroundColor: '#FFFFFF', marginBottom: isMobile ? '0' : '24px' }}>

      <div style={{ position: 'relative', width: '100%', height: cardH + 'px' }}>
        <img
          src={meme.image_url || 'https://picsum.photos/seed/m' + index + '/296/' + cardH}
          alt={meme.title || 'Meme'}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        {isValidUUID(meme.id) && !isMobile && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', opacity: hovered ? 1 : 0, transition: 'opacity 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '600' }}>View Meme</span>
          </div>
        )}
      </div>

      <div style={{ padding: isMobile ? '8px 10px' : '10px 12px', backgroundColor: hovered ? '#F9F9F9' : '#FFFFFF', transition: 'background-color 0.3s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '5px' : '6px', marginBottom: isMobile ? '6px' : '8px' }}>
          <UserAvatar avatarUrl={meme.uploader_avatar} name={meme.uploader_name} size={isMobile ? 18 : 24} />
          <span style={{ fontSize: isMobile ? '10px' : '12px', color: '#7E7E82', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {meme.uploader_name || '@user'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg width={isMobile ? '12' : '14'} height={isMobile ? '12' : '14'} viewBox="0 0 24 24" fill="none" stroke="#7E7E82" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              <span style={{ fontSize: isMobile ? '10px' : '11px', color: '#7E7E82' }}>{(meme.views || 0).toLocaleString()}</span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); if (!liked) { setLiked(true); setLikes(likes + 1) } }}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: liked ? 'default' : 'pointer', padding: 0 }}>
              <svg width={isMobile ? '12' : '14'} height={isMobile ? '12' : '14'} viewBox="0 0 24 24" fill={liked ? '#D90870' : 'none'} stroke="#D90870" strokeWidth="2">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span style={{ fontSize: isMobile ? '10px' : '11px', color: liked ? '#D90870' : '#7E7E82' }}>{likes.toLocaleString()}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Ad card — same footprint as a meme card slot, replaces one every 8 memes
function MemeAdCard({ ad, isMobile }) {
  const [hovered, setHovered] = useState(false)
  const h = isMobile ? 175 : 300
  const content = (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ width: '100%', borderRadius: isMobile ? '12px' : '16px', overflow: 'hidden', cursor: ad.link ? 'pointer' : 'default', boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', transform: hovered ? 'translateY(-4px)' : 'translateY(0)', backgroundColor: '#F3F3F4', position: 'relative', height: h + 'px', marginBottom: isMobile ? '0' : '24px' }}>
      <AdMedia src={ad.src} type={ad.type} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      <span style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '10px', fontWeight: '600', color: '#FFFFFF', backgroundColor: 'rgba(0,0,0,0.55)', padding: '3px 10px', borderRadius: '9999px', letterSpacing: '0.3px' }}>
        Ad
      </span>
    </div>
  )
  if (ad.link) return <a href={ad.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>{content}</a>
  return content
}

// Inserts an ad after every 8 memes (flat list, used before splitting into columns)
function buildMemeItemsWithAds(memes, ads) {
  if (!ads || ads.length === 0) return memes.map((m, i) => ({ kind: 'meme', data: m, index: i }))
  const items = []
  let adIndex = 0
  memes.forEach((m, i) => {
    items.push({ kind: 'meme', data: m, index: i })
    if ((i + 1) % 8 === 0) {
      items.push({ kind: 'ad', data: ads[adIndex % ads.length] })
      adIndex += 1
    }
  })
  return items
}

function Memes() {
  const location = useLocation()
  const isMobile = useIsMobile()
  const { ads: gridAds } = useAds('meme_list', 'grid')
  const [category, setCategory] = useState(location.state?.category || 'All Memes')
  const [memes, setMemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const loaderRef = useRef(null)
  const PAGE_SIZE = 12

  const fetchMemes = useCallback(async (cat, pageNum, append) => {
    if (pageNum === 0) setLoading(true)
    else setLoadingMore(true)

    try {
      let query = supabase
        .from('memes')
        .select('*')
        .order('created_at', { ascending: false })
        .range(pageNum * PAGE_SIZE, (pageNum + 1) * PAGE_SIZE - 1)

      if (cat !== 'All Memes') query = query.eq('category', cat)

      const { data, error } = await query
      if (error) throw error

      const results = data || []
      if (append) setMemes((prev) => [...prev, ...results])
      else setMemes(results)
      setHasMore(results.length === PAGE_SIZE)
    } catch (err) {
      console.error('Memes fetch error:', err)
      if (!append) setMemes([])
    }
    setLoading(false)
    setLoadingMore(false)
  }, [])

  useEffect(() => {
    setPage(0)
    setMemes([])
    setHasMore(true)
    fetchMemes(category, 0, false)
    window.scrollTo(0, 0)
  }, [category, fetchMemes])

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return
    const next = page + 1
    setPage(next)
    fetchMemes(category, next, true)
  }, [category, page, loadingMore, hasMore, fetchMemes])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore() },
      { threshold: 0.1 }
    )
    if (loaderRef.current) observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [loadMore])

  const memeItems = buildMemeItemsWithAds(memes, gridAds)
  const numCols = isMobile ? 2 : 4
  const columns = Array.from({ length: numCols }, () => [])
  memeItems.forEach((item, i) => columns[i % numCols].push(item))

  return (
    <div style={{ backgroundColor: '#FFFFFF' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}><Navbar /></div>

      <section style={{ backgroundColor: '#FFF0F3', width: '100%' }}>
        <div style={{
          maxWidth: '1440px', margin: '0 auto',
          height: isMobile ? 'auto' : '328px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: isMobile ? '32px 20px' : '0 100px',
          gap: isMobile ? '16px' : 0,
        }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: isMobile ? '28px' : '40px', lineHeight: isMobile ? '34px' : '48px', fontWeight: '700', color: '#141415', marginBottom: isMobile ? '8px' : '12px' }}>{category}</h2>
            <p style={{ fontSize: isMobile ? '14px' : '24px', lineHeight: isMobile ? '20px' : '32px', color: '#7E7E82', maxWidth: '600px' }}>
              Explore hilarious memes, share the fun and never miss a laugh.
            </p>
          </div>
          <AnimatedBannerCards isMobile={isMobile} />
        </div>
      </section>

      <section style={{ width: '100%', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: isMobile ? '0 20px' : '0 100px' }}>
          <MemeTabs category={category} onCategoryChange={setCategory} isMobile={isMobile} />
        </div>
      </section>

      <section style={{ maxWidth: '1440px', margin: '0 auto', padding: isMobile ? '24px 20px' : '48px 100px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[0,1,2].map((i) => (
                <div key={i} style={{ width: '12px', height: '12px', borderRadius: '9999px', backgroundColor: '#D90870', animation: 'bounce 0.6s ease ' + (i * 0.1) + 's infinite alternate' }} />
              ))}
            </div>
          </div>
        ) : memes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>😂</div>
            <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#141415', marginBottom: '8px' }}>No memes yet</h3>
            <p style={{ fontSize: '16px', color: '#7E7E82', marginBottom: '24px' }}>Be the first to upload a meme in this category!</p>
            <button
              onClick={() => { window.location.href = '/memes/create' }}
              style={{ height: '44px', padding: '0 24px', borderRadius: '8px', backgroundColor: '#D90870', color: '#FFFFFF', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
              😂 Upload First Meme
            </button>
          </div>
        ) : (
          <>
            <p style={{ color: '#7E7E82', fontSize: isMobile ? '13px' : '14px', marginBottom: isMobile ? '20px' : '32px' }}>
              Showing <strong style={{ color: '#141415' }}>{memes.length}</strong> meme{memes.length !== 1 ? 's' : ''} in <strong style={{ color: '#141415' }}>{category}</strong>
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(' + numCols + ', 1fr)', gap: isMobile ? '14px' : '24px', alignItems: 'start' }}>
              {columns.map((col, colIdx) => (
                <div key={colIdx} style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '14px' : 0 }}>
                  {col.map((item, idx) =>
                    item.kind === 'ad'
                      ? <MemeAdCard key={'ad-' + colIdx + '-' + idx} ad={item.data} isMobile={isMobile} />
                      : <MemeCard key={item.data.id} meme={item.data} index={item.index} isMobile={isMobile} />
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        <div ref={loaderRef} style={{ textAlign: 'center', padding: '40px 0' }}>
          {loadingMore && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
              {[0,1,2].map((i) => (
                <div key={i} style={{ width: '10px', height: '10px', borderRadius: '9999px', backgroundColor: '#D90870', animation: 'bounce 0.6s ease ' + (i * 0.1) + 's infinite alternate' }} />
              ))}
            </div>
          )}
          {!hasMore && memes.length > 0 && (
            <p style={{ color: '#A5A5AA', fontSize: '14px' }}>You have seen all memes 😂</p>
          )}
        </div>
      </section>

      <style>{`@keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-12px); } }`}</style>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}><Footer /></div>
    </div>
  )
}

export default Memes