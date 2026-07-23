import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { toPng } from 'html-to-image'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SubscribeSection from '../components/SubscribeSection'
import SaveButton from '../components/SaveButton'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabaseClient'
import { useIsMobile } from '../hooks/useIsMobile'
import { useAds } from '../hooks/useAds'

function isValidUUID(id) {
  return id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id))
}

function AdMedia({ src, type, style, alt }) {
  if (type === 'video') {
    return <video src={src} style={style} autoPlay loop muted playsInline />
  }
  return <img src={src} alt={alt || 'Advertisement'} style={style} />
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

function BackButton({ isMobile }) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  return (
    <button onClick={() => navigate(-1)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ width: isMobile ? '76px' : '92px', height: isMobile ? '34px' : '40px', borderRadius: '8px', border: '1px solid ' + (hovered ? '#F3F3F4' : '#E8E8EA'), backgroundColor: hovered ? '#F9F9F9' : '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', boxShadow: hovered ? '0 2px 8px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.2s ease' }}>
      <svg width={isMobile ? '18' : '24'} height={isMobile ? '18' : '24'} viewBox="0 0 24 24" fill="none" stroke="#141415" strokeWidth="2" strokeLinecap="round">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
      <span style={{ fontSize: isMobile ? '13px' : '16px', color: '#141415', fontWeight: '400' }}>Back</span>
    </button>
  )
}

function IconButton({ icon, hoverText, onClick, isMobile }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div style={{ position: 'relative', cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={onClick}>
      <div style={{ width: isMobile ? '32px' : '36px', height: isMobile ? '32px' : '36px', borderRadius: '8px', border: '1px solid #E8E8EA', backgroundColor: hovered ? '#F9F9F9' : '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}>
        {icon}
      </div>
      {!isMobile && hovered && (
        <span style={{ position: 'absolute', top: '42px', left: '50%', transform: 'translateX(-50%)', fontSize: '10px', color: '#FFFFFF', backgroundColor: '#141415', padding: '3px 8px', borderRadius: '4px', whiteSpace: 'nowrap', zIndex: 10 }}>
          {hoverText}
        </span>
      )}
    </div>
  )
}

function RelatedBlogCard({ blog, isMobile }) {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onClick={() => { if (isValidUUID(blog.id)) navigate('/blog/' + blog.id) }}
      style={{ borderRadius: isMobile ? '10px' : '12px', overflow: 'hidden', cursor: 'pointer', boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', transform: hovered ? 'translateY(-4px)' : 'translateY(0)', backgroundColor: '#FFFFFF' }}>
      <div style={{ position: 'relative', height: isMobile ? '110px' : '180px' }}>
        <img src={blog.cover_image_url || 'https://picsum.photos/seed/rb' + blog.id + '/405/180'} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        {!isMobile && hovered && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: '600', backgroundColor: 'rgba(0,0,0,0.5)', padding: '6px 14px', borderRadius: '8px' }}>Read Blog</span>
          </div>
        )}
      </div>
      <div style={{ padding: isMobile ? '10px' : '14px' }}>
        <h4 style={{ fontSize: isMobile ? '13px' : '16px', lineHeight: isMobile ? '17px' : '24px', fontWeight: '700', color: '#141415', margin: isMobile ? '0 0 6px' : '0 0 6px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{blog.title}</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserAvatar avatarUrl={blog.author_avatar} name={blog.author_name} size={isMobile ? 18 : 22} />
          <span style={{ fontSize: isMobile ? '10px' : '12px', color: '#7E7E82', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{blog.author_name}</span>
          {!isMobile && (
            <span style={{ fontSize: '11px', color: '#C7C7CA', marginLeft: 'auto' }}>
              {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function RelatedAdCard({ ad, isMobile }) {
  const [hovered, setHovered] = useState(false)
  const content = (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ borderRadius: isMobile ? '10px' : '12px', overflow: 'hidden', cursor: ad.link ? 'pointer' : 'default', boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', transform: hovered ? 'translateY(-4px)' : 'translateY(0)', backgroundColor: '#F3F3F4', position: 'relative', height: isMobile ? '166px' : '272px' }}>
      <AdMedia src={ad.src} type={ad.type} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      <span style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '10px', fontWeight: '600', color: '#FFFFFF', backgroundColor: 'rgba(0,0,0,0.55)', padding: '3px 10px', borderRadius: '9999px', letterSpacing: '0.3px' }}>
        Ad
      </span>
    </div>
  )
  if (ad.link) {
    return <a href={ad.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>{content}</a>
  }
  return content
}

function buildRelatedItemsWithAds(blogs, ads) {
  if (!ads || ads.length === 0) return blogs.map((b) => ({ kind: 'blog', data: b }))
  const items = []
  let adIndex = 0
  blogs.forEach((rb, i) => {
    items.push({ kind: 'blog', data: rb })
    if ((i + 1) % 8 === 0) {
      items.push({ kind: 'ad', data: ads[adIndex % ads.length] })
      adIndex += 1
    }
  })
  return items
}

function InlineStoryAd({ ad }) {
  return (
    <a href={ad.link || undefined} target={ad.link ? '_blank' : undefined} rel={ad.link ? 'noopener noreferrer' : undefined}
      style={{ display: 'block', textDecoration: 'none', position: 'relative', width: '100%', height: '140px', borderRadius: '12px', overflow: 'hidden', margin: '24px 0' }}>
      <AdMedia src={ad.src} type={ad.type} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      <span style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '10px', fontWeight: '600', color: '#FFFFFF', backgroundColor: 'rgba(0,0,0,0.55)', padding: '3px 10px', borderRadius: '9999px', letterSpacing: '0.3px' }}>
        Ad
      </span>
    </a>
  )
}

const blogCategories = ['All Blogs','Events','Music','Tech','Lifestyle','Business','Health','Travel','Food','Entertainment','Sports','Fashion','Education']

const navCards = [
  { title: 'Discover Memes, Enjoy the fun', subtitle: 'Explore exciting memes from our community.', bg: '#FFF0F3', icon: '😂', to: '/memes' },
  { title: 'Discover Events Near You', subtitle: 'Find exciting events happening around you.', bg: '#F6FBFF', icon: '📅', to: '/category?type=All Events' },
  { title: 'Create Birthday and other Flyers', subtitle: 'Design beautiful flyers for any occasion.', bg: '#FFFCF4', icon: '🖼️', to: '/flyers' },
]

function NavCard({ card, isMobile }) {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()
  return (
    <div onClick={() => navigate(card.to)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ width: isMobile ? '100%' : '405px', height: isMobile ? 'auto' : '335px', borderRadius: '12px', backgroundColor: card.bg, cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: isMobile ? '24px' : '32px', boxSizing: 'border-box', transition: 'transform 0.2s ease, box-shadow 0.2s ease', transform: hovered ? 'translateY(-6px)' : 'translateY(0)', boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.10)' : 'none' }}>
      <div style={{ fontSize: isMobile ? '40px' : '64px', lineHeight: 1, marginBottom: isMobile ? '12px' : 0 }}>{card.icon}</div>
      <div>
        <h4 style={{ fontSize: isMobile ? '18px' : '24px', lineHeight: isMobile ? '24px' : '32px', fontWeight: '700', color: '#141415', margin: '0 0 8px' }}>{card.title}</h4>
        <p style={{ fontSize: isMobile ? '13px' : '16px', lineHeight: isMobile ? '19px' : '24px', color: '#59595C', margin: 0 }}>{card.subtitle}</p>
      </div>
    </div>
  )
}

const PAGE_WIDTH = 480
const PAGE_HEIGHT = 680

function BlogPageForDownload({ blog, contentSections, pageNum }) {
  const page1Sections = contentSections.slice(0, 2)
  const page2Sections = contentSections.slice(2, 5)
  const sections = pageNum === 1 ? page1Sections : page2Sections

  return (
    <div style={{ width: PAGE_WIDTH + 'px', minHeight: PAGE_HEIGHT + 'px', backgroundColor: '#FFFFFF', padding: '30px', fontFamily: 'sans-serif', position: 'relative', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1 }}>
        {pageNum === 1 && (
          <div style={{ width: '420px', height: '163px', margin: '0 auto 20px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#F0F0F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={blog.cover_image_url || 'https://picsum.photos/seed/' + blog.id + '/420/163'} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        )}
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#123C64', lineHeight: '39px', margin: '0 0 14px' }}>{blog.title}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <UserAvatar avatarUrl={blog.author_avatar} name={blog.author_name} size={30} />
          <div>
            <p style={{ fontSize: '13px', fontWeight: '700', color: '#141415', margin: '0 0 2px' }}>{blog.author_name || 'Author'}</p>
            <p style={{ fontSize: '11px', color: '#7E7E82', margin: 0 }}>
              Published on {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} &nbsp;•&nbsp; Page {pageNum}
            </p>
          </div>
        </div>
        {sections.map((section, i) => (
          <div key={i} style={{ marginBottom: '18px' }}>
            {section.subtitle && section.subtitle.trim() && (
              <p style={{ fontSize: '16px', fontWeight: '700', color: '#141415', margin: '0 0 6px', lineHeight: '22px' }}>{section.subtitle}</p>
            )}
            <p style={{ fontSize: '12px', color: '#414143', lineHeight: '16px', margin: 0, whiteSpace: 'pre-line' }}>{section.content}</p>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '20px', textAlign: 'right', borderTop: '1px solid #F0F0F1', paddingTop: '10px' }}>
        <span style={{ fontSize: '10px', color: '#A5A5AA' }}>Downloaded from www.eventhive.com</span>
      </div>
    </div>
  )
}

function PageCheckbox({ checked, onChange, disabled, label }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: disabled ? 'not-allowed' : 'pointer', userSelect: 'none' }}>
      <div onClick={() => { if (!disabled) onChange(!checked) }}
        style={{ width: '18px', height: '18px', borderRadius: '5px', border: '2px solid ' + (checked ? '#0097FF' : '#C7C7CA'), backgroundColor: checked ? '#0097FF' : '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s ease', opacity: disabled ? 0.5 : 1, flexShrink: 0 }}>
        {checked && (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        )}
      </div>
      <span style={{ fontSize: '13px', fontWeight: '600', color: '#141415' }}>{label}</span>
    </label>
  )
}

function DownloadModal({ blog, contentSections, onClose }) {
  const page1Ref = useRef(null)
  const page2Ref = useRef(null)
  const [downloading, setDownloading] = useState(false)
  const [done, setDone] = useState(false)

  const hasPage2 = contentSections.length > 2
  const [includePage1, setIncludePage1] = useState(true)
  const [includePage2, setIncludePage2] = useState(hasPage2)

  const canDownload = includePage1 || (hasPage2 && includePage2)

  const previewScale = 0.42
  const previewWidth = PAGE_WIDTH * previewScale
  const previewHeight = PAGE_HEIGHT * previewScale

  const handleDownload = async () => {
    if (!canDownload || downloading) return
    setDownloading(true)
    try {
      if (includePage1 && page1Ref.current) {
        const png1 = await toPng(page1Ref.current, { quality: 1, pixelRatio: 2 })
        const a1 = document.createElement('a')
        a1.href = png1
        a1.download = blog.title.slice(0, 30).replace(/\s/g, '_') + '_page1.png'
        a1.click()
      }
      if (includePage1 && includePage2 && hasPage2) await new Promise((res) => setTimeout(res, 400))
      if (includePage2 && hasPage2 && page2Ref.current) {
        const png2 = await toPng(page2Ref.current, { quality: 1, pixelRatio: 2 })
        const a2 = document.createElement('a')
        a2.href = png2
        a2.download = blog.title.slice(0, 30).replace(/\s/g, '_') + '_page2.png'
        a2.click()
      }
      setDone(true)
      setTimeout(() => { setDone(false); onClose() }, 1500)
    } catch (err) { console.error('Download error:', err) }
    setDownloading(false)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,12,20,0.75)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ width: '660px', maxWidth: '100%', maxHeight: '95vh', backgroundColor: '#FFFFFF', borderRadius: '20px', boxShadow: '0 24px 64px rgba(0,0,0,0.25)', padding: '24px 28px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '6px' }}>
          <div style={{ display: 'inline-block', padding: '3px 12px', borderRadius: '9999px', backgroundColor: '#EFF9FF' }}>
            <span style={{ fontSize: '11px', color: '#0097FF', fontWeight: '600' }}>PNG Download · A5 Portrait</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#7E7E82' }}>✕</button>
        </div>
        <h3 style={{ fontSize: '19px', fontWeight: '700', color: '#141415', margin: '8px 0 4px', lineHeight: '26px' }}>
          You are downloading <span style={{ color: '#0097FF' }}>"{blog.title.slice(0, 40)}{blog.title.length > 40 ? '...' : ''}"</span>
        </h3>
        <p style={{ fontSize: '13px', color: '#7E7E82', marginBottom: '16px', lineHeight: '19px' }}>Select which page(s) you'd like to download.</p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '16px' }}>
          <div style={{ border: '1px solid #E8E8EA', borderRadius: '10px', padding: '10px', backgroundColor: '#F9F9F9', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <p style={{ fontSize: '9px', color: '#A5A5AA', margin: 0, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Page 1</p>
            <div style={{ width: previewWidth + 'px', height: previewHeight + 'px', overflow: 'hidden', borderRadius: '5px', border: '1px solid #E8E8EA', backgroundColor: '#FFFFFF', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
              <div style={{ transform: `scale(${previewScale})`, transformOrigin: 'top left', width: PAGE_WIDTH + 'px', pointerEvents: 'none' }}>
                <div ref={page1Ref}><BlogPageForDownload blog={blog} contentSections={contentSections} pageNum={1} /></div>
              </div>
            </div>
            <PageCheckbox checked={includePage1} onChange={setIncludePage1} label="Include Page 1" />
          </div>
          {hasPage2 && (
            <div style={{ border: '1px solid #E8E8EA', borderRadius: '10px', padding: '10px', backgroundColor: '#F9F9F9', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <p style={{ fontSize: '9px', color: '#A5A5AA', margin: 0, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Page 2</p>
              <div style={{ width: previewWidth + 'px', height: previewHeight + 'px', overflow: 'hidden', borderRadius: '5px', border: '1px solid #E8E8EA', backgroundColor: '#FFFFFF', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
                <div style={{ transform: `scale(${previewScale})`, transformOrigin: 'top left', width: PAGE_WIDTH + 'px', pointerEvents: 'none' }}>
                  <div ref={page2Ref}><BlogPageForDownload blog={blog} contentSections={contentSections} pageNum={2} /></div>
                </div>
              </div>
              <PageCheckbox checked={includePage2} onChange={setIncludePage2} label="Include Page 2" />
            </div>
          )}
        </div>
        {!canDownload && <p style={{ fontSize: '12px', color: '#D90870', textAlign: 'center', marginBottom: '10px' }}>Select at least one page to download.</p>}
        {done && (
          <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #4CAF50', borderRadius: '8px', padding: '8px 14px', textAlign: 'center', fontSize: '13px', color: '#2E7D32', fontWeight: '500', marginBottom: '10px' }}>
            ✅ Downloaded successfully!
          </div>
        )}
        <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
          <button onClick={onClose} style={{ flex: 1, height: '46px', borderRadius: '10px', border: '1px solid #E8E8EA', backgroundColor: '#FFFFFF', color: '#414143', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleDownload} disabled={downloading || !canDownload}
            style={{ flex: 2, height: '46px', borderRadius: '10px', border: 'none', backgroundColor: (downloading || !canDownload) ? '#C7C7CA' : '#0097FF', color: '#FFFFFF', fontSize: '15px', fontWeight: '600', cursor: (downloading || !canDownload) ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s ease' }}>
            {downloading ? 'Downloading...' : 'Download Blog as PNG'}
          </button>
        </div>
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

function SidebarAdCard({ ad }) {
  const [hovered, setHovered] = useState(false)
  const content = (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ width: '292px', height: '292px', borderRadius: '12px', overflow: 'hidden', position: 'relative', boxShadow: hovered ? '0 8px 32px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', transform: hovered ? 'scale(1.02)' : 'scale(1)', cursor: ad.link ? 'pointer' : 'default' }}>
      <AdMedia src={ad.src} type={ad.type} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      <span style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '10px', fontWeight: '600', color: '#FFFFFF', backgroundColor: 'rgba(0,0,0,0.55)', padding: '3px 10px', borderRadius: '9999px', letterSpacing: '0.3px' }}>
        Ad
      </span>
    </div>
  )
  if (ad.link) return <a href={ad.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>{content}</a>
  return content
}

function BlogDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const isMobile = useIsMobile()

  const { ads: sidebarAds } = useAds('blog_detail', 'sidebar')
  const { ads: inlineStoryAds } = useAds('blog_detail', 'inline_story')
  const { ads: relatedGridAds } = useAds('blog_detail', 'related_grid')

  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [relatedBlogs, setRelatedBlogs] = useState([])
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(0)
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
      const { data: related } = await supabase.from('blogs').select('*').eq('category', data.category).eq('is_published', true).neq('id', id).limit(8)
      setRelatedBlogs(related || [])
    } catch (err) { setNotFound(true) }
    setLoading(false)
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareTitle = blog ? blog.title : ''

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
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 2500)
      return
    }
    window.open(links[platform], '_blank', 'noopener,noreferrer')
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
        <div style={{ textAlign: 'center', padding: isMobile ? '80px 20px' : '120px 100px' }}>
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

  let contentSections = []
  try {
    if (Array.isArray(b.content)) contentSections = b.content
    else if (typeof b.content === 'string') {
      const parsed = JSON.parse(b.content)
      contentSections = Array.isArray(parsed) ? parsed : [{ subtitle: '', content: b.content }]
    } else if (b.content && typeof b.content === 'object') {
      contentSections = [b.content]
    }
  } catch {
    contentSections = b.description ? [{ subtitle: '', content: b.description }] : []
  }
  if (contentSections.length === 0) contentSections = [{ subtitle: '', content: b.description || '' }]

  const relatedItems = buildRelatedItemsWithAds(relatedBlogs, relatedGridAds)
  const relatedColumns = [[], []]
  relatedItems.forEach((item, i) => relatedColumns[i % 2].push(item))

  return (
    <div style={{ backgroundColor: '#FFFFFF' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}><Navbar /></div>

      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: isMobile ? '16px 16px 40px' : '32px 80px 80px' }}>
        <BackButton isMobile={isMobile} />

        {isMobile ? (
          <>
            <div style={{ marginTop: '18px', marginBottom: '16px' }}>
              <h1 style={{ fontSize: '24px', lineHeight: '30px', fontWeight: '700', color: '#141415', marginBottom: '10px' }}>{b.title}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <UserAvatar avatarUrl={b.author_avatar} name={b.author_name} size={26} />
                  <p style={{ fontSize: '12px', fontWeight: '600', color: '#141415', margin: 0 }}>{b.author_name || 'Author'}</p>
                </div>
                <span style={{ fontSize: '11px', color: '#A5A5AA' }}>
                  Published on {new Date(b.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  {b.read_time ? ' • ' + b.read_time + ' Minutes read' : ''}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '4px 0 16px' }}>
              <button onClick={() => { if (!liked) { setLiked(true); setLikes(likes + 1) } }}
                style={{ background: 'none', border: 'none', cursor: liked ? 'default' : 'pointer', padding: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill={liked ? '#D90870' : 'none'} stroke="#D90870" strokeWidth="2">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </button>
              <div style={{ flex: 1 }} />
              <button onClick={() => setShowDownloadModal(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#414143" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </button>
              <button onClick={() => setShowShareModal(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#414143" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              </button>
              <SaveButton item={{ id: b.id, type: 'blog', title: b.title, image: b.cover_image_url }} />
            </div>

            <div style={{ width: '100%', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px', backgroundColor: '#141415' }}>
              <img src={b.cover_image_url || 'https://picsum.photos/seed/' + b.id + '/842/540'} alt={b.title} style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', display: 'block' }} />
            </div>

            <div>
              {contentSections.map((section, i) => (
                <div key={i} style={{ marginBottom: '22px' }}>
                  {section.subtitle && section.subtitle.trim() && (
                    <h2 style={{ fontSize: '17px', lineHeight: '23px', fontWeight: '700', color: '#141415', margin: '0 0 8px' }}>{section.subtitle}</h2>
                  )}
                  <p style={{ fontSize: '14px', lineHeight: '22px', color: '#414143', margin: 0, whiteSpace: 'pre-line' }}>{section.content}</p>
                </div>
              ))}

              {b.tags && b.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '20px' }}>
                  {b.tags.map((tag) => (
                    <span key={tag} style={{ padding: '3px 10px', borderRadius: '9999px', backgroundColor: '#F3F3F4', border: '1px solid #E8E8EA', fontSize: '11px', color: '#59595C' }}>#{tag}</span>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 0 4px' }}>
                <button onClick={() => { if (!liked) { setLiked(true); setLikes(likes + 1) } }}
                  style={{ background: 'none', border: 'none', cursor: liked ? 'default' : 'pointer', padding: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={liked ? '#D90870' : 'none'} stroke="#D90870" strokeWidth="2">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </button>
                <button onClick={() => setShowDownloadModal(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#414143" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                </button>
                <button onClick={() => setShowShareModal(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#414143" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                </button>
                <SaveButton item={{ id: b.id, type: 'blog', title: b.title, image: b.cover_image_url }} />
              </div>

              {inlineStoryAds.length > 0 && <InlineStoryAd ad={inlineStoryAds[0]} />}

              <div style={{ marginTop: '4px', marginBottom: '28px' }}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#59595C', marginBottom: '10px' }}>
                  Category: <span style={{ color: '#0097FF' }}>{b.category}</span>
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {blogCategories.map((cat) => {
                    const isActive = cat === b.category
                    return (
                      <button key={cat} onClick={() => navigate('/blog', { state: { category: cat } })}
                        style={{ padding: '6px 14px', borderRadius: '9999px', border: '1px solid ' + (isActive ? '#FFB900' : '#E8E8EA'), backgroundColor: isActive ? '#FFFCF4' : '#FFFFFF', color: isActive ? '#B88700' : '#59595C', fontSize: '12px', fontWeight: isActive ? '600' : '400', cursor: 'pointer' }}>
                        {cat}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {relatedBlogs.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '22px', lineHeight: '28px', fontWeight: '700', color: '#141415', marginBottom: '16px' }}>Related Blogs</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {relatedItems.map((item, idx) =>
                    item.kind === 'ad'
                      ? <RelatedAdCard key={'ad-' + idx} ad={item.data} isMobile />
                      : <RelatedBlogCard key={item.data.id} blog={item.data} isMobile />
                  )}
                </div>
                <button onClick={() => navigate('/blog', { state: { category: b.category } })}
                  style={{ marginTop: '16px', width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E8E8EA', backgroundColor: '#FFFFFF', fontSize: '13px', color: '#59595C', cursor: 'pointer' }}>
                  Read all from Related Events
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <div style={{ marginTop: '24px', marginBottom: '24px', maxWidth: '860px' }}>
              {b.category && (
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#0097FF', backgroundColor: '#EFF9FF', padding: '4px 14px', borderRadius: '9999px', display: 'inline-block', marginBottom: '16px' }}>{b.category}</span>
              )}
              <h1 style={{ fontSize: '40px', lineHeight: '50px', fontWeight: '700', color: '#141415', marginBottom: '12px' }}>{b.title}</h1>
              {b.description && <p style={{ fontSize: '20px', lineHeight: '30px', color: '#7E7E82', marginBottom: '16px' }}>{b.description}</p>}
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

            <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-start' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <button onClick={() => { if (!liked) { setLiked(true); setLikes(likes + 1) } }}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: liked ? 'default' : 'pointer', padding: 0 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill={liked ? '#D90870' : 'none'} stroke="#D90870" strokeWidth="2">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    <span style={{ fontSize: '14px', color: liked ? '#D90870' : '#7E7E82' }}>{likes.toLocaleString()}</span>
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <IconButton hoverText="Download Blog as PNG" onClick={() => setShowDownloadModal(true)}
                      icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#59595C" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>} />
                    <IconButton hoverText="Share Blog" onClick={() => setShowShareModal(true)}
                      icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#59595C" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>} />
                    <SaveButton item={{ id: b.id, type: 'blog', title: b.title, image: b.cover_image_url }} />
                  </div>
                </div>

                <div style={{ width: '100%', borderRadius: '16px', overflow: 'hidden', marginBottom: '16px', backgroundColor: '#141415' }}>
                  <img src={b.cover_image_url || 'https://picsum.photos/seed/' + b.id + '/842/540'} alt={b.title} style={{ width: '100%', maxHeight: '540px', objectFit: 'cover', display: 'block' }} />
                </div>

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

                <div style={{ maxWidth: '720px' }}>
                  {contentSections.map((section, i) => (
                    <div key={i} style={{ marginBottom: '32px' }}>
                      {section.subtitle && section.subtitle.trim() && (
                        <h2 style={{ fontSize: '24px', lineHeight: '32px', fontWeight: '700', color: '#141415', margin: '0 0 12px' }}>{section.subtitle}</h2>
                      )}
                      <p style={{ fontSize: '17px', lineHeight: '30px', color: '#414143', margin: 0, whiteSpace: 'pre-line' }}>{section.content}</p>
                    </div>
                  ))}

                  {b.tags && b.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #E8E8EA' }}>
                      {b.tags.map((tag) => (
                        <span key={tag} style={{ padding: '4px 14px', borderRadius: '9999px', backgroundColor: '#F3F3F4', border: '1px solid #E8E8EA', fontSize: '13px', color: '#59595C' }}>#{tag}</span>
                      ))}
                    </div>
                  )}

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
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7E7E82" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        <span style={{ fontSize: '14px', color: '#7E7E82' }}>{(b.reads || 0).toLocaleString()} reads</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <IconButton hoverText="Download Blog as PNG" onClick={() => setShowDownloadModal(true)}
                        icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#59595C" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>} />
                      <IconButton hoverText="Share Blog" onClick={() => setShowShareModal(true)}
                        icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#59595C" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>} />
                      <SaveButton item={{ id: b.id, type: 'blog', title: b.title, image: b.cover_image_url }} />
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ width: '292px', flexShrink: 0, position: 'sticky', top: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {sidebarAds.map((ad) => <SidebarAdCard key={ad.id} ad={ad} />)}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 292px', gap: '48px', marginTop: '64px' }}>
              <div>
                {relatedBlogs.length > 0 && (
                  <>
                    <h3 style={{ fontSize: '32px', lineHeight: '39px', fontWeight: '700', color: '#141415', marginBottom: '24px' }}>Related Blogs</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                      {relatedColumns.map((col, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                          {col.map((item, idx) =>
                            item.kind === 'ad'
                              ? <RelatedAdCard key={'ad-' + i + '-' + idx} ad={item.data} />
                              : <RelatedBlogCard key={item.data.id} blog={item.data} />
                          )}
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
          </>
        )}

        <div style={{ width: '100%', marginTop: isMobile ? '40px' : '80px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', gap: isMobile ? '16px' : '40px', padding: isMobile ? 0 : '40px 0' }}>
          {navCards.map((card) => <NavCard key={card.title} card={card} isMobile={isMobile} />)}
        </div>
      </div>

      <SubscribeSection />
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}><Footer /></div>

      {showShareModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '0 24px' : 0 }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowShareModal(false) }}>
          <div style={{ width: isMobile ? '100%' : '440px', backgroundColor: '#FFFFFF', borderRadius: '16px', padding: isMobile ? '24px' : '32px', position: 'relative', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
            <button onClick={() => setShowShareModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#7E7E82' }}>✕</button>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#141415', marginBottom: '8px' }}>Share this Blog</h3>
            <p style={{ fontSize: '14px', color: '#7E7E82', marginBottom: '20px' }}>Copy the link below or share directly</p>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
              <input readOnly value={shareUrl} style={{ flex: 1, height: '44px', borderRadius: '8px', border: '1px solid #E8E8EA', padding: '0 12px', fontSize: '13px', color: '#414143', outline: 'none', backgroundColor: '#F9F9F9' }} />
              <button onClick={() => { navigator.clipboard.writeText(shareUrl); setShareCopied(true); setTimeout(() => setShareCopied(false), 2000) }}
                style={{ height: '44px', padding: '0 18px', borderRadius: '8px', border: 'none', backgroundColor: '#0097FF', color: '#FFFFFF', fontSize: '14px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {shareCopied ? '✅ Copied!' : 'Copy Link'}
              </button>
            </div>
            <p style={{ fontSize: '12px', fontWeight: '600', color: '#A5A5AA', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '14px' }}>Or share via</p>
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
              <SocialShareButton label="More" bg="#7E7E82" onClick={() => { if (navigator.share) { navigator.share({ title: shareTitle, url: shareUrl }) } else { navigator.clipboard.writeText(shareUrl); setShareCopied(true); setTimeout(() => setShareCopied(false), 2000) } }}
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>}
              />
            </div>
            {shareCopied && (
              <p style={{ fontSize: '12px', color: '#2E7D32', textAlign: 'center', marginTop: '14px' }}>Link copied — paste it into your Instagram/TikTok post or story.</p>
            )}
          </div>
        </div>
      )}

      {showDownloadModal && (
        <DownloadModal blog={b} contentSections={contentSections} onClose={() => setShowDownloadModal(false)} />
      )}

      <style>{`@keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-12px); } }`}</style>
    </div>
  )
}

export default BlogDetail