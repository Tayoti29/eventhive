import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SubscribeSection from '../components/SubscribeSection'
import { supabase } from '../supabaseClient'
import { useIsMobile } from '../hooks/useIsMobile'
import advertImg from '../assets/subscribe-card1.png'
import { useAds } from '../hooks/useAds'

const blogCategories = [
  { label: 'All Blogs', icon: '📖' },
  { label: 'Events', icon: '📅' },
  { label: 'Music', icon: '🎵' },
  { label: 'Tech', icon: '💻' },
  { label: 'Lifestyle', icon: '✨' },
  { label: 'Business', icon: '💼' },
  { label: 'Health', icon: '❤️' },
  { label: 'Travel', icon: '✈️' },
  { label: 'Food', icon: '🍔' },
  { label: 'Entertainment', icon: '🎬' },
  { label: 'Sports', icon: '⚽' },
  { label: 'Fashion', icon: '👗' },
  { label: 'Education', icon: '📚' },
]

const bannerImages = [
  'https://picsum.photos/seed/blogbanner1/155/182',
  'https://picsum.photos/seed/blogbanner2/155/182',
  'https://picsum.photos/seed/blogbanner3/155/182',
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
  const s = size || 28
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
      {[
        { img: bannerImages[2], z: 1, base: 'rotate(-8deg)', hover: 'rotate(-12deg) translateX(-8px)', top: 0, right: 0, left: 'auto' },
        { img: bannerImages[1], z: 2, base: 'rotate(4deg)', hover: 'rotate(6deg) translateY(-8px)', top: isMobile ? '10px' : '20px', left: isMobile ? '10px' : '20px', right: 'auto' },
        { img: bannerImages[0], z: 3, base: 'rotate(-2deg)', hover: 'rotate(-3deg) translateY(-12px)', top: isMobile ? '16px' : '36px', left: 0, right: 'auto' },
      ].map((card, i) => (
        <div key={i} style={{ position: 'absolute', top: card.top, right: card.right, left: card.left, width: cardW + 'px', height: cardH + 'px', borderRadius: radius, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', transition: 'transform 0.4s ease', zIndex: card.z, transform: hovered ? card.hover : card.base }}>
          <img src={card.img} alt="Blog" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      ))}
    </div>
  )
}

function BlogTabs({ category, onCategoryChange, isMobile }) {
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
          const isActive = tab === 'Blog'
          return (
            <div key={tab}
              onClick={() => {
                if (tab === 'Events') navigate('/category?type=All Events')
                if (tab === 'Memes') navigate('/memes')
                if (tab === 'Blog') setShowFlyout(!showFlyout)
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: isMobile ? '14px 0' : '16px 0', cursor: 'pointer', borderBottom: isActive ? '2px solid #141415' : '2px solid transparent', marginBottom: '-1px', flexShrink: 0 }}>
              <span style={{ fontSize: isMobile ? '13px' : '14px', fontWeight: '500', color: isActive ? '#141415' : '#59595C' }}>
                {tab === 'Blog' ? category : tab}
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
            left: isMobile ? 0 : '80px',
            right: isMobile ? 0 : undefined,
            width: isMobile ? '100%' : '200px',
            borderRadius: isMobile ? '20px 20px 0 0' : '12px',
            backgroundColor: '#FFFFFF', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', padding: '16px 8px', zIndex: 200,
          }}>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#141415', padding: '0 8px', marginBottom: '12px' }}>Select from categories</p>
            <div style={{ maxHeight: isMobile ? '50vh' : '280px', overflowY: 'auto', scrollbarWidth: 'thin' }}>
              {blogCategories.map((cat) => {
                const isSelected = cat.label === category
                return (
                  <div key={cat.label}
                    onClick={() => { onCategoryChange(cat.label); setShowFlyout(false) }}
                    style={{ height: '40px', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 8px', borderRadius: '8px', cursor: 'pointer', backgroundColor: isSelected ? '#F3F3F4' : 'transparent', marginBottom: '4px' }}
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

function BlogCard({ blog, isMobile }) {
  const [hovered, setHovered] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(blog.likes || 0)
  const navigate = useNavigate()

  const handleClick = () => { if (isValidUUID(blog.id)) navigate('/blog/' + blog.id) }

  return (
    <div
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      style={{ borderRadius: isMobile ? '12px' : '16px', overflow: 'hidden', cursor: isValidUUID(blog.id) ? 'pointer' : 'default', boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', transform: hovered ? 'translateY(-4px)' : 'translateY(0)', backgroundColor: '#FFFFFF' }}>

      <div style={{ position: 'relative', height: isMobile ? '110px' : '202px' }}>
        <img
          src={blog.cover_image_url || 'https://picsum.photos/seed/blog' + blog.id + '/405/202'}
          alt={blog.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        {!isMobile && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', opacity: hovered ? 1 : 0, transition: 'opacity 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '600', backgroundColor: 'rgba(0,0,0,0.4)', padding: '8px 16px', borderRadius: '8px' }}>Read Blog</span>
          </div>
        )}
        {blog.read_time && !isMobile && (
          <div style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: '9999px', padding: '3px 10px' }}>
            <span style={{ fontSize: '11px', color: '#FFFFFF', fontWeight: '500' }}>⏱ {blog.read_time} min read</span>
          </div>
        )}
      </div>

      <div style={{ padding: isMobile ? '10px' : '16px', backgroundColor: hovered ? '#F9F9F9' : '#FFFFFF', transition: 'background-color 0.3s ease' }}>
        {blog.category && !isMobile && (
          <span style={{ fontSize: '11px', fontWeight: '600', color: '#0097FF', backgroundColor: '#EFF9FF', padding: '3px 10px', borderRadius: '9999px', marginBottom: '8px', display: 'inline-block' }}>
            {blog.category}
          </span>
        )}
        <h3 style={{ fontSize: isMobile ? '14px' : '18px', lineHeight: isMobile ? '19px' : '26px', fontWeight: '700', color: '#141415', margin: isMobile ? '0 0 4px' : '8px 0', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {blog.title}
        </h3>
        {blog.description && (
          <p style={{ fontSize: isMobile ? '11px' : '13px', color: '#59595C', margin: isMobile ? '0 0 8px' : '0 0 12px', lineHeight: isMobile ? '16px' : '20px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: isMobile ? 1 : 2, WebkitBoxOrient: 'vertical' }}>
            {blog.description}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '8px', overflow: 'hidden' }}>
            <UserAvatar avatarUrl={blog.author_avatar} name={blog.author_name} size={isMobile ? 18 : 26} />
            <span style={{ fontSize: isMobile ? '10px' : '12px', color: '#7E7E82', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: isMobile ? '70px' : '120px' }}>
              {isMobile ? new Date(blog.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : (blog.author_name || 'Author')}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '12px' }}>
            <button
              onClick={(e) => { e.stopPropagation(); if (!liked) { setLiked(true); setLikes(likes + 1) } }}
              style={{ display: 'flex', alignItems: 'center', gap: '3px', background: 'none', border: 'none', cursor: liked ? 'default' : 'pointer', padding: 0 }}>
              <svg width={isMobile ? '12' : '13'} height={isMobile ? '12' : '13'} viewBox="0 0 24 24" fill={liked ? '#D90870' : 'none'} stroke="#D90870" strokeWidth="2">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span style={{ fontSize: isMobile ? '10px' : '11px', color: liked ? '#D90870' : '#7E7E82' }}>{likes.toLocaleString()}</span>
            </button>
            <svg width={isMobile ? '12' : '13'} height={isMobile ? '12' : '13'} viewBox="0 0 24 24" fill="none" stroke="#7E7E82" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </div>
        </div>
        {!isMobile && (
          <p style={{ fontSize: '11px', color: '#C7C7CA', margin: '8px 0 0' }}>
            {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        )}
      </div>
    </div>
  )
}

// Ad card — same footprint as BlogCard, replaces a blog slot every 8 cards, no title/author
function BlogAdCard({ ad, isMobile }) {
  const [hovered, setHovered] = useState(false)
  const content = (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: isMobile ? '12px' : '16px', overflow: 'hidden', cursor: ad.link ? 'pointer' : 'default',
        boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease', transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        backgroundColor: '#F3F3F4', position: 'relative', height: isMobile ? '190px' : '340px',
      }}>
      <AdMedia src={ad.src} type={ad.type} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      <span style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '10px', fontWeight: '600', color: '#FFFFFF', backgroundColor: 'rgba(0,0,0,0.55)', padding: '3px 10px', borderRadius: '9999px', letterSpacing: '0.3px' }}>
        Ad
      </span>
    </div>
  )
  if (ad.link) return <a href={ad.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>{content}</a>
  return content
}

// Inserts an ad after every 8 blogs
function buildBlogItemsWithAds(blogs, ads) {
  if (!ads || ads.length === 0) return blogs.map((b) => ({ kind: 'blog', data: b }))
  const items = []
  let adIndex = 0
  blogs.forEach((b, i) => {
    items.push({ kind: 'blog', data: b })
    if ((i + 1) % 8 === 0) {
      items.push({ kind: 'ad', data: ads[adIndex % ads.length] })
      adIndex += 1
    }
  })
  return items
}

function Blog() {
  const location = useLocation()
  const isMobile = useIsMobile()
  const { ads: gridAds } = useAds('blog_list', 'grid')
  const [category, setCategory] = useState(location.state?.category || 'All Blogs')
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const loaderRef = useRef(null)
  const navigate = useNavigate()
  const PAGE_SIZE = 9

  const fetchBlogs = useCallback(async (cat, pageNum, append) => {
    if (pageNum === 0) setLoading(true)
    else setLoadingMore(true)

    try {
      let query = supabase
        .from('blogs')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .range(pageNum * PAGE_SIZE, (pageNum + 1) * PAGE_SIZE - 1)

      if (cat !== 'All Blogs') query = query.eq('category', cat)

      const { data, error } = await query
      if (error) throw error

      const results = data || []
      if (append) setBlogs((prev) => [...prev, ...results])
      else setBlogs(results)
      setHasMore(results.length === PAGE_SIZE)
    } catch (err) {
      console.error('Blog fetch error:', err)
      if (!append) setBlogs([])
    }
    setLoading(false)
    setLoadingMore(false)
  }, [])

  useEffect(() => {
    setPage(0)
    setBlogs([])
    setHasMore(true)
    fetchBlogs(category, 0, false)
    window.scrollTo(0, 0)
  }, [category, fetchBlogs])

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return
    const next = page + 1
    setPage(next)
    fetchBlogs(category, next, true)
  }, [category, page, loadingMore, hasMore, fetchBlogs])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore() },
      { threshold: 0.1 }
    )
    if (loaderRef.current) observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [loadMore])

  const blogItems = buildBlogItemsWithAds(blogs, gridAds)

  return (
    <div style={{ backgroundColor: '#FFFFFF' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}><Navbar /></div>

      {/* Banner */}
      <section style={{ backgroundColor: '#FFFCF4', width: '100%' }}>
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
              Discover insightful blogs, stories and articles from our community.
            </p>
          </div>
          <AnimatedBannerCards isMobile={isMobile} />
        </div>
      </section>

      {/* Tabs */}
      <section style={{ width: '100%', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: isMobile ? '0 20px' : '0 100px' }}>
          <BlogTabs category={category} onCategoryChange={setCategory} isMobile={isMobile} />
        </div>
      </section>

      {/* Grid */}
      <section style={{ maxWidth: '1440px', margin: '0 auto', padding: isMobile ? '24px 20px' : '48px 100px 80px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[0,1,2].map((i) => (
                <div key={i} style={{ width: '12px', height: '12px', borderRadius: '9999px', backgroundColor: '#FFB900', animation: 'bounce 0.6s ease ' + (i * 0.1) + 's infinite alternate' }} />
              ))}
            </div>
          </div>
        ) : blogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
            <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#141415', marginBottom: '8px' }}>No blogs yet</h3>
            <p style={{ fontSize: '16px', color: '#7E7E82', marginBottom: '24px' }}>Be the first to write a blog in this category!</p>
            <button onClick={() => navigate('/blog/create')}
              style={{ height: '44px', padding: '0 24px', borderRadius: '8px', backgroundColor: '#FFB900', color: '#141415', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
              ✍️ Write First Blog
            </button>
          </div>
        ) : (
          <>
            <p style={{ color: '#7E7E82', fontSize: isMobile ? '13px' : '14px', marginBottom: isMobile ? '20px' : '32px' }}>
              Showing <strong style={{ color: '#141415' }}>{blogs.length}</strong> blog{blogs.length !== 1 ? 's' : ''} in <strong style={{ color: '#141415' }}>{category}</strong>
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: isMobile ? '12px' : '32px' }}>
              {blogItems.map((item, idx) =>
                item.kind === 'ad'
                  ? <BlogAdCard key={'ad-' + idx} ad={item.data} isMobile={isMobile} />
                  : <BlogCard key={item.data.id} blog={item.data} isMobile={isMobile} />
              )}
            </div>
          </>
        )}

        <div ref={loaderRef} style={{ textAlign: 'center', padding: '40px 0' }}>
          {loadingMore && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
              {[0,1,2].map((i) => (
                <div key={i} style={{ width: '10px', height: '10px', borderRadius: '9999px', backgroundColor: '#FFB900', animation: 'bounce 0.6s ease ' + (i * 0.1) + 's infinite alternate' }} />
              ))}
            </div>
          )}
          {!hasMore && blogs.length > 0 && (
            <p style={{ color: '#A5A5AA', fontSize: '14px' }}>You have read all blogs 📖</p>
          )}
        </div>
      </section>

      <style>{`@keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-12px); } }`}</style>
      <SubscribeSection />
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}><Footer /></div>
    </div>
  )
}

export default Blog