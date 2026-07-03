import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { toPng } from 'html-to-image'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SubscribeSection from '../components/SubscribeSection'
import SaveButton from '../components/SaveButton'
import advertImg from '../assets/subscribe-card1.png'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabaseClient'

function isValidUUID(id) {
  return id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id))
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

function RelatedBlogCard({ blog }) {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onClick={() => { if (isValidUUID(blog.id)) navigate('/blog/' + blog.id) }}
      style={{ borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', transform: hovered ? 'translateY(-4px)' : 'translateY(0)', backgroundColor: '#FFFFFF' }}>
      <div style={{ position: 'relative', height: '180px' }}>
        <img src={blog.cover_image_url || 'https://picsum.photos/seed/rb' + blog.id + '/405/180'} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        {hovered && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: '600', backgroundColor: 'rgba(0,0,0,0.5)', padding: '6px 14px', borderRadius: '8px' }}>Read Blog</span>
          </div>
        )}
      </div>
      <div style={{ padding: '14px' }}>
        <h4 style={{ fontSize: '16px', lineHeight: '24px', fontWeight: '700', color: '#141415', margin: '0 0 6px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{blog.title}</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserAvatar avatarUrl={blog.author_avatar} name={blog.author_name} size={22} />
          <span style={{ fontSize: '12px', color: '#7E7E82' }}>{blog.author_name}</span>
          <span style={{ fontSize: '11px', color: '#C7C7CA', marginLeft: 'auto' }}>
            {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>
    </div>
  )
}

const blogCategories = ['All Blogs','Events','Music','Tech','Lifestyle','Business','Health','Travel','Food','Entertainment','Sports','Fashion','Education']

const navCards = [
  { title: 'Discover Memes, Enjoy the fun', subtitle: 'Explore exciting memes from our community.', bg: '#FFF0F3', icon: '😂', to: '/memes' },
  { title: 'Discover Events Near You', subtitle: 'Find exciting events happening around you.', bg: '#F6FBFF', icon: '📅', to: '/category?type=All Events' },
  { title: 'Create Birthday and other Flyers', subtitle: 'Design beautiful flyers for any occasion.', bg: '#FFFCF4', icon: '🖼️', to: '/flyers' },
]

function NavCard({ card }) {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()
  return (
    <div onClick={() => navigate(card.to)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ width: '405px', height: '335px', borderRadius: '12px', backgroundColor: card.bg, cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '32px', transition: 'transform 0.2s ease, box-shadow 0.2s ease', transform: hovered ? 'translateY(-6px)' : 'translateY(0)', boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.10)' : 'none' }}>
      <div style={{ fontSize: '64px', lineHeight: 1 }}>{card.icon}</div>
      <div>
        <h4 style={{ fontSize: '24px', lineHeight: '32px', fontWeight: '700', color: '#141415', margin: '0 0 12px' }}>{card.title}</h4>
        <p style={{ fontSize: '16px', lineHeight: '24px', color: '#59595C', margin: 0 }}>{card.subtitle}</p>
      </div>
    </div>
  )
}

// ── PNG Download Preview component (hidden, used for capture) ──
function BlogPageForDownload({ blog, contentSections, pageNum }) {
  const page1Sections = contentSections.slice(0, 2)
  const page2Sections = contentSections.slice(2, 5)
  const sections = pageNum === 1 ? page1Sections : page2Sections

  return (
    <div style={{
      width: '900px',
      backgroundColor: '#FFFFFF',
      padding: '32px 24px 24px 24px',
      fontFamily: 'sans-serif',
      position: 'relative',
    }}>
      {/* Page 1 only: Title, Published by, Date */}
      {pageNum === 1 && (
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0097FF', lineHeight: '36px', marginBottom: '10px' }}>
            {blog.title}
          </h1>
          <p style={{ fontSize: '16px', fontWeight: '700', color: '#0097FF', margin: '0 0 6px' }}>
            Published by {blog.author_name || 'Author'}
          </p>
          <p style={{ fontSize: '15px', color: '#141415', fontWeight: '700', margin: 0 }}>
            {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      )}

      {/* Page 2 only: continuation label */}
      {pageNum === 2 && (
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0097FF', margin: 0 }}>
            {blog.title} — continued
          </h2>
        </div>
      )}

      {/* Content Sections */}
      {sections.map((section, i) => (
        <div key={i} style={{ marginBottom: '24px' }}>
          {section.subtitle && section.subtitle.trim() && (
            <p style={{ fontSize: '17px', fontWeight: '700', color: '#414143', margin: '0 0 8px', lineHeight: '24px' }}>
              {section.subtitle}
            </p>
          )}
          <p style={{ fontSize: '14px', color: '#59595C', lineHeight: '24px', margin: 0, whiteSpace: 'pre-line' }}>
            {section.content}
          </p>
        </div>
      ))}

      {/* Footer watermark */}
      <div style={{ marginTop: '40px', textAlign: 'right' }}>
        <span style={{ fontSize: '13px', color: '#A5A5AA' }}>Downloaded from www.eventhive.com</span>
      </div>
    </div>
  )
}

// ── Download Confirmation Modal ──
function DownloadModal({ blog, contentSections, onClose }) {
  const page1Ref = useRef(null)
  const page2Ref = useRef(null)
  const [downloading, setDownloading] = useState(false)
  const [done, setDone] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)
    try {
      if (page1Ref.current) {
        const png1 = await toPng(page1Ref.current, { quality: 1, pixelRatio: 2 })
        const a1 = document.createElement('a')
        a1.href = png1
        a1.download = blog.title.slice(0, 30).replace(/\s/g, '_') + '_page1.png'
        a1.click()
      }
      await new Promise((res) => setTimeout(res, 400))
      if (page2Ref.current && contentSections.length > 2) {
        const png2 = await toPng(page2Ref.current, { quality: 1, pixelRatio: 2 })
        const a2 = document.createElement('a')
        a2.href = png2
        a2.download = blog.title.slice(0, 30).replace(/\s/g, '_') + '_page2.png'
        a2.click()
      }
      setDone(true)
      setTimeout(() => { setDone(false); onClose() }, 1500)
    } catch (err) {
      console.error('Download error:', err)
    }
    setDownloading(false)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,12,20,0.75)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ width: '880px', maxHeight: '88vh', backgroundColor: '#FFFFFF', borderRadius: '24px', overflow: 'hidden', display: 'grid', gridTemplateColumns: '420px 1fr', boxShadow: '0 24px 64px rgba(0,0,0,0.25)' }}>

        {/* Left — Preview */}
        <div style={{ backgroundColor: '#F3F3F4', padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: '12px', fontWeight: '600', color: '#7E7E82', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 8px' }}>Preview</p>

          {/* Page 1 preview */}
          <div>
            <p style={{ fontSize: '11px', color: '#A5A5AA', margin: '0 0 6px' }}>Page 1</p>
            <div style={{ transform: 'scale(0.42)', transformOrigin: 'top left', width: '900px', pointerEvents: 'none' }}>
              <div ref={page1Ref}>
                <BlogPageForDownload blog={blog} contentSections={contentSections} pageNum={1} />
              </div>
            </div>
            <div style={{ height: Math.max(120, contentSections.slice(0,2).reduce((a,s) => a + (s.content || '').length * 0.18, 220)) + 'px' }} />
          </div>

          {/* Page 2 preview only if there are sections 3+ */}
          {contentSections.length > 2 && (
            <div>
              <p style={{ fontSize: '11px', color: '#A5A5AA', margin: '0 0 6px' }}>Page 2</p>
              <div style={{ transform: 'scale(0.42)', transformOrigin: 'top left', width: '900px', pointerEvents: 'none' }}>
                <div ref={page2Ref}>
                  <BlogPageForDownload blog={blog} contentSections={contentSections} pageNum={2} />
                </div>
              </div>
              <div style={{ height: Math.max(100, contentSections.slice(2,5).reduce((a,s) => a + (s.content || '').length * 0.18, 140)) + 'px' }} />
            </div>
          )}
        </div>

        {/* Right — Info + Buttons */}
        <div style={{ padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <button onClick={onClose} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#7E7E82' }}>✕</button>
            <div style={{ clear: 'both' }} />

            <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: '9999px', backgroundColor: '#EFF9FF', marginBottom: '20px' }}>
              <span style={{ fontSize: '12px', color: '#0097FF', fontWeight: '600' }}>PNG Download</span>
            </div>

            <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#141415', marginBottom: '10px', lineHeight: '30px' }}>
              You are downloading<br />
              <span style={{ color: '#0097FF' }}>"{blog.title.slice(0, 50)}{blog.title.length > 50 ? '...' : ''}"</span>
            </h3>

            <p style={{ fontSize: '14px', color: '#7E7E82', marginBottom: '24px', lineHeight: '22px' }}>
              This blog will be downloaded as PNG images. Each page contains the formatted content as uploaded.
            </p>

            <div style={{ backgroundColor: '#F9F9F9', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#0097FF' }}>1</div>
                  <div style={{ fontSize: '12px', color: '#7E7E82' }}>Page 1</div>
                  <div style={{ fontSize: '11px', color: '#A5A5AA' }}>Title + first 2 sections</div>
                </div>
                {contentSections.length > 2 && (
                  <>
                    <div style={{ width: '1px', backgroundColor: '#E8E8EA' }} />
                    <div style={{ textAlign: 'center', flex: 1 }}>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#0097FF' }}>2</div>
                      <div style={{ fontSize: '12px', color: '#7E7E82' }}>Page 2</div>
                      <div style={{ fontSize: '11px', color: '#A5A5AA' }}>Remaining sections</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <p style={{ fontSize: '12px', color: '#A5A5AA' }}>
              Downloaded from <strong style={{ color: '#0097FF' }}>www.eventhive.com</strong>
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {done && (
              <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #4CAF50', borderRadius: '8px', padding: '10px 16px', textAlign: 'center', fontSize: '14px', color: '#2E7D32', fontWeight: '500' }}>
                ✅ Downloaded successfully!
              </div>
            )}
            <button onClick={handleDownload} disabled={downloading}
              style={{ width: '100%', height: '52px', borderRadius: '12px', border: 'none', backgroundColor: downloading ? '#C7C7CA' : '#0097FF', color: '#FFFFFF', fontSize: '16px', fontWeight: '600', cursor: downloading ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s ease' }}>
              {downloading ? 'Downloading...' : 'Download Blog as PNG'}
            </button>
            <button onClick={onClose}
              style={{ width: '100%', height: '48px', borderRadius: '12px', border: '1px solid #E8E8EA', backgroundColor: '#FFFFFF', color: '#414143', fontSize: '15px', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function BlogDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [relatedBlogs, setRelatedBlogs] = useState([])
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(0)
  const [advertHovered, setAdvertHovered] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)

  useEffect(() => { fetchBlog() }, [id])

  const fetchBlog = async () => {
    setLoading(true)
    setNotFound(false)
    if (!isValidUUID(id)) { setNotFound(true); setLoading(false); return }
    try {
      const { data, error } = await supabase.from('blogs').select('*').eq('id', id).single()
      if (error || !data) { setNotFound(true); setLoading(false); return }
      setBlog(data)
      setLikes(data.likes || 0)
      const { data: related } = await supabase.from('blogs').select('*').eq('category', data.category).eq('is_published', true).neq('id', id).limit(4)
      setRelatedBlogs(related || [])
    } catch (err) {
      setNotFound(true)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}><Navbar /></div>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '120px 0' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[0,1,2].map((i) => <div key={i} style={{ width: '12px', height: '12px', borderRadius: '9999px', backgroundColor: '#FFB900', animation: 'bounce 0.6s ease ' + (i * 0.1) + 's infinite alternate' }} />)}
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
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#141415', marginBottom: '12px' }}>Blog not found</h2>
          <p style={{ fontSize: '16px', color: '#7E7E82', marginBottom: '24px' }}>This blog may have been removed or does not exist.</p>
          <button onClick={() => navigate('/blog')} style={{ height: '44px', padding: '0 24px', borderRadius: '8px', backgroundColor: '#FFB900', color: '#141415', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
            Browse Blogs
          </button>
        </div>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}><Footer /></div>
      </div>
    )
  }

  const b = blog

  // Parse content sections safely
  let contentSections = []
  try {
    if (Array.isArray(b.content)) {
      contentSections = b.content
    } else if (typeof b.content === 'string') {
      const parsed = JSON.parse(b.content)
      contentSections = Array.isArray(parsed) ? parsed : [{ subtitle: '', content: b.content }]
    } else if (b.content && typeof b.content === 'object') {
      contentSections = [b.content]
    }
  } catch {
    contentSections = b.description ? [{ subtitle: '', content: b.description }] : []
  }
  if (contentSections.length === 0) {
    contentSections = [{ subtitle: '', content: b.description || '' }]
  }

  const relatedColumns = [[], []]
  relatedBlogs.forEach((rb, i) => relatedColumns[i % 2].push(rb))

  return (
    <div style={{ backgroundColor: '#FFFFFF' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}><Navbar /></div>

      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '32px 80px 80px' }}>
        <BackButton />

        {/* Blog Header */}
        <div style={{ marginTop: '24px', marginBottom: '24px', maxWidth: '860px' }}>
          {b.category && (
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#0097FF', backgroundColor: '#EFF9FF', padding: '4px 14px', borderRadius: '9999px', display: 'inline-block', marginBottom: '16px' }}>
              {b.category}
            </span>
          )}
          <h1 style={{ fontSize: '40px', lineHeight: '50px', fontWeight: '700', color: '#141415', marginBottom: '12px' }}>{b.title}</h1>
          {b.description && (
            <p style={{ fontSize: '20px', lineHeight: '30px', color: '#7E7E82', marginBottom: '16px' }}>{b.description}</p>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserAvatar avatarUrl={b.author_avatar} name={b.author_name} size={32} />
              <div>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#141415', margin: 0 }}>{b.author_name || 'Author'}</p>
                <p style={{ fontSize: '12px', color: '#A5A5AA', margin: 0 }}>Author</p>
              </div>
            </div>
            <div style={{ width: '1px', height: '32px', backgroundColor: '#E8E8EA' }} />
            <p style={{ fontSize: '13px', color: '#7E7E82', margin: 0 }}>
              {new Date(b.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            {b.read_time && (
              <>
                <div style={{ width: '1px', height: '32px', backgroundColor: '#E8E8EA' }} />
                <p style={{ fontSize: '13px', color: '#7E7E82', margin: 0 }}>⏱ {b.read_time} min read</p>
              </>
            )}
          </div>
        </div>

        {/* Cover Image + Advert side by side */}
        <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <button onClick={() => { if (!liked) { setLiked(true); setLikes(likes + 1) } }}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: liked ? 'default' : 'pointer', padding: 0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill={liked ? '#D90870' : 'none'} stroke="#D90870" strokeWidth="2">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <span style={{ fontSize: '14px', color: liked ? '#D90870' : '#7E7E82' }}>{likes.toLocaleString()}</span>
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <IconButton hoverText="Download Blog as PNG"
                  onClick={() => setShowDownloadModal(true)}
                  icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#59595C" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>}
                />
                <IconButton hoverText="Share Blog"
                  onClick={() => setShowShareModal(true)}
                  icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#59595C" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>}
                />
                <SaveButton item={{ id: b.id, type: 'blog', title: b.title, image: b.cover_image_url }} />
              </div>
            </div>

            {/* Cover image — object-cover to fill like memes */}
            <div style={{ width: '100%', borderRadius: '16px', overflow: 'hidden', marginBottom: '16px', backgroundColor: '#141415' }}>
              <img
                src={b.cover_image_url || 'https://picsum.photos/seed/' + b.id + '/842/540'}
                alt={b.title}
                style={{ width: '100%', maxHeight: '540px', objectFit: 'cover', display: 'block' }}
              />
            </div>

            {/* Meta stats */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', padding: '16px 0', borderBottom: '1px solid #E8E8EA', marginBottom: '40px' }}>
              {[
                { icon: '👁️', label: (b.reads || 0).toLocaleString() + ' reads' },
                { icon: '❤️', label: likes.toLocaleString() + ' likes' },
                { icon: '🏷️', label: b.category || 'Blog' },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '16px' }}>{item.icon}</span>
                  <span style={{ fontSize: '13px', color: '#59595C' }}>{item.label}</span>
                </div>
              ))}
            </div>

            {/* Blog Content — fully visible, no collapse needed */}
            <div style={{ maxWidth: '720px' }}>
              {contentSections.map((section, i) => (
                <div key={i} style={{ marginBottom: '32px' }}>
                  {section.subtitle && section.subtitle.trim() && (
                    <h2 style={{ fontSize: '24px', lineHeight: '32px', fontWeight: '700', color: '#141415', margin: '0 0 12px' }}>
                      {section.subtitle}
                    </h2>
                  )}
                  <p style={{ fontSize: '17px', lineHeight: '30px', color: '#414143', margin: 0, whiteSpace: 'pre-line' }}>
                    {section.content}
                  </p>
                </div>
              ))}

              {/* Tags */}
              {b.tags && b.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #E8E8EA' }}>
                  {b.tags.map((tag) => (
                    <span key={tag} style={{ padding: '4px 14px', borderRadius: '9999px', backgroundColor: '#F3F3F4', border: '1px solid #E8E8EA', fontSize: '13px', color: '#59595C' }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Bottom actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 0', borderTop: '1px solid #E8E8EA', marginTop: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <button onClick={() => { if (!liked) { setLiked(true); setLikes(likes + 1) } }}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: liked ? 'default' : 'pointer', padding: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={liked ? '#D90870' : 'none'} stroke="#D90870" strokeWidth="2">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    <span style={{ fontSize: '14px', color: liked ? '#D90870' : '#7E7E82' }}>{likes.toLocaleString()} likes</span>
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7E7E82" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                    <span style={{ fontSize: '14px', color: '#7E7E82' }}>{(b.reads || 0).toLocaleString()} reads</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <IconButton hoverText="Download Blog as PNG"
                    onClick={() => setShowDownloadModal(true)}
                    icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#59595C" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>}
                  />
                  <IconButton hoverText="Share Blog"
                    onClick={() => setShowShareModal(true)}
                    icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#59595C" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>}
                  />
                  <SaveButton item={{ id: b.id, type: 'blog', title: b.title, image: b.cover_image_url }} />
                </div>
              </div>
            </div>
          </div>

          {/* Advert */}
          <div onMouseEnter={() => setAdvertHovered(true)} onMouseLeave={() => setAdvertHovered(false)}
            style={{ width: '292px', minHeight: '600px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, boxShadow: advertHovered ? '0 8px 32px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', transform: advertHovered ? 'scale(1.02)' : 'scale(1)', cursor: 'pointer' }}>
            <img src={advertImg} alt="Advertisement" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        </div>

        {/* Related + Category Sidebar */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 292px', gap: '48px', marginTop: '64px' }}>
          <div>
            {relatedBlogs.length > 0 && (
              <>
                <h3 style={{ fontSize: '32px', lineHeight: '39px', fontWeight: '700', color: '#141415', marginBottom: '24px' }}>Related Blogs</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  {relatedColumns.map((col, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      {col.map((rb) => <RelatedBlogCard key={rb.id} blog={rb} />)}
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate('/blog', { state: { category: b.category } })}
                  style={{ marginTop: '24px', padding: '10px 24px', borderRadius: '8px', border: '1px solid #E8E8EA', backgroundColor: '#FFFFFF', fontSize: '14px', color: '#59595C', cursor: 'pointer' }}>
                  Read all {b.category} blogs →
                </button>
              </>
            )}
          </div>

          {/* Category list */}
          <div>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#59595C', marginBottom: '12px' }}>
              Category: <span style={{ color: '#0097FF' }}>{b.category}</span>
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {blogCategories.map((cat) => {
                const isActive = cat === b.category
                return (
                  <button key={cat} onClick={() => navigate('/blog', { state: { category: cat } })}
                    style={{ padding: '8px 16px', borderRadius: '9999px', border: '1px solid ' + (isActive ? '#FFB900' : '#E8E8EA'), backgroundColor: isActive ? '#FFFCF4' : '#FFFFFF', color: isActive ? '#B88700' : '#59595C', fontSize: '14px', fontWeight: isActive ? '600' : '400', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease' }}>
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Nav Cards */}
        <div style={{ width: '100%', marginTop: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px', padding: '40px 0' }}>
          {navCards.map((card) => <NavCard key={card.title} card={card} />)}
        </div>
      </div>

      <SubscribeSection />
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}><Footer /></div>

      {/* Share Modal */}
      {showShareModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowShareModal(false) }}>
          <div style={{ width: '420px', backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '32px', position: 'relative', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
            <button onClick={() => setShowShareModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#7E7E82' }}>✕</button>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#141415', marginBottom: '8px' }}>Share this Blog</h3>
            <p style={{ fontSize: '14px', color: '#7E7E82', marginBottom: '20px' }}>Copy the link below to share</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input readOnly value={window.location.href}
                style={{ flex: 1, height: '44px', borderRadius: '8px', border: '1px solid #E8E8EA', padding: '0 12px', fontSize: '13px', color: '#414143', outline: 'none', backgroundColor: '#F9F9F9' }} />
              <button onClick={() => { navigator.clipboard.writeText(window.location.href); setShareCopied(true); setTimeout(() => setShareCopied(false), 2000) }}
                style={{ height: '44px', padding: '0 18px', borderRadius: '8px', border: 'none', backgroundColor: '#0097FF', color: '#FFFFFF', fontSize: '14px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {shareCopied ? '✅ Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Download Modal */}
      {showDownloadModal && (
        <DownloadModal
          blog={b}
          contentSections={contentSections}
          onClose={() => setShowDownloadModal(false)}
        />
      )}

      <style>{`@keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-12px); } }`}</style>
    </div>
  )
}

export default BlogDetail