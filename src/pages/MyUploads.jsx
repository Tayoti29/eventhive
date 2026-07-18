import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabaseClient'
import { useIsMobile } from '../hooks/useIsMobile'
import advertImg from '../assets/subscribe-card1.png'
import advertImg2 from '../assets/subscribe-card1.png'

const sidebarAds = [
  { id: 'uploads-sidebar-ad-1', src: advertImg, link: '' },
  { id: 'uploads-sidebar-ad-2', src: advertImg2, link: '' },
]
const gridAds = [{ id: 'uploads-grid-ad-1', src: advertImg, link: '' }]

function AdCard({ ad, isMobile }) {
  const [hovered, setHovered] = useState(false)
  const content = (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.06)', transition: 'all 0.3s ease', transform: hovered ? 'translateY(-4px)' : 'translateY(0)', backgroundColor: '#F3F3F4', position: 'relative', height: isMobile ? '180px' : '200px', cursor: ad.link ? 'pointer' : 'default' }}>
      <img src={ad.src} alt="Advertisement" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      <span style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '10px', fontWeight: '600', color: '#FFFFFF', backgroundColor: 'rgba(0,0,0,0.55)', padding: '3px 10px', borderRadius: '9999px' }}>Ad</span>
    </div>
  )
  if (ad.link) return <a href={ad.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>{content}</a>
  return content
}

function SidebarAdCard({ ad }) {
  return (
    <div style={{ width: '100%', borderRadius: '12px', overflow: 'hidden', position: 'relative', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <img src={ad.src} alt="Advertisement" style={{ width: '100%', height: '292px', objectFit: 'cover', display: 'block' }} />
      <span style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '10px', fontWeight: '600', color: '#FFFFFF', backgroundColor: 'rgba(0,0,0,0.55)', padding: '3px 10px', borderRadius: '9999px' }}>Ad</span>
    </div>
  )
}

function buildItemsWithAds(items, ads) {
  if (!ads || ads.length === 0) return items.map((it) => ({ kind: 'item', data: it }))
  const out = []
  let adIndex = 0
  items.forEach((it, i) => {
    out.push({ kind: 'item', data: it })
    if ((i + 1) % 8 === 0) { out.push({ kind: 'ad', data: ads[adIndex % ads.length] }); adIndex += 1 }
  })
  return out
}

function BackButton({ isMobile }) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  return (
    <button onClick={() => navigate(-1)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ width: isMobile ? '76px' : '92px', height: isMobile ? '34px' : '40px', borderRadius: '8px', border: '1px solid ' + (hovered ? '#F3F3F4' : '#E8E8EA'), backgroundColor: hovered ? '#F9F9F9' : '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', transition: 'all 0.2s ease', marginBottom: isMobile ? '20px' : '32px' }}>
      <svg width={isMobile ? '18' : '20'} height={isMobile ? '18' : '20'} viewBox="0 0 24 24" fill="none" stroke="#141415" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
      <span style={{ fontSize: isMobile ? '13px' : '14px', color: '#141415' }}>Back</span>
    </button>
  )
}

function UserAvatar({ avatarUrl, name, size }) {
  const s = size || 32
  const initial = (name || 'U').charAt(0).toUpperCase()
  if (avatarUrl) return <img src={avatarUrl} alt={name} style={{ width: s, height: s, borderRadius: '9999px', objectFit: 'cover' }} />
  return (
    <div style={{ width: s, height: s, borderRadius: '9999px', backgroundColor: '#0097FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: s * 0.4, fontWeight: '700', flexShrink: 0 }}>
      {initial}
    </div>
  )
}

function MyUploads() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const isMobile = useIsMobile()

  const defaultTab = location.state?.activeTab || 'events'
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [eventFilter, setEventFilter] = useState('running')
  const [uploads, setUploads] = useState({ events: [], memes: [], blogs: [] })
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [viewItem, setViewItem] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => { fetchUploads() }, [user])

  const fetchUploads = async () => {
    setLoading(true)
    try {
      const [evRes, memRes, blogRes] = await Promise.all([
        supabase.from('events').select('*').order('created_at', { ascending: false }),
        supabase.from('memes').select('*').order('created_at', { ascending: false }),
        supabase.from('blogs').select('*').order('created_at', { ascending: false }),
      ])
      setUploads({ events: evRes.data || [], memes: memRes.data || [], blogs: blogRes.data || [] })
    } catch (err) { console.error('Fetch error:', err) }
    setLoading(false)
  }

  const now = new Date()
  const runningEvents = uploads.events.filter((e) => !e.event_date || new Date(e.event_date) >= now)
  const pastEvents = uploads.events.filter((e) => e.event_date && new Date(e.event_date) < now)

  const currentItems = activeTab === 'events' ? (eventFilter === 'running' ? runningEvents : pastEvents) : uploads[activeTab]

  const handleDelete = async (item) => {
    const table = activeTab === 'events' ? 'events' : activeTab === 'memes' ? 'memes' : 'blogs'
    try {
      await supabase.from(table).delete().eq('id', item.id)
      setUploads((prev) => ({ ...prev, [activeTab]: prev[activeTab].filter((i) => i.id !== item.id) }))
      setSuccessMsg('Deleted "' + item.title + '"')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) { console.error('Delete error:', err) }
    setDeleteTarget(null)
  }

  const tabs = [
    { key: 'events', label: 'Events', count: uploads.events.length },
    { key: 'blogs', label: 'Blog', count: uploads.blogs.length },
    { key: 'memes', label: 'Memes', count: uploads.memes.length },
  ]

  const itemsWithAds = buildItemsWithAds(currentItems, gridAds)

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      {successMsg && (
        <div style={{ position: 'fixed', top: isMobile ? '16px' : '24px', right: isMobile ? '16px' : '24px', left: isMobile ? '16px' : 'auto', zIndex: 3000, backgroundColor: '#141415', color: '#FFFFFF', borderRadius: '12px', padding: '14px 24px', fontSize: '14px', fontWeight: '500', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
          ✅ {successMsg}
        </div>
      )}

      <div style={{ maxWidth: '1440px', margin: '0 auto' }}><Navbar /></div>

      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: isMobile ? '24px 20px 60px' : '48px 100px 80px' }}>
        <BackButton isMobile={isMobile} />

        <h1 style={{ fontSize: isMobile ? '26px' : '40px', fontWeight: '700', color: '#141415', textAlign: 'center', marginBottom: '8px' }}>My Uploads</h1>
        <p style={{ fontSize: isMobile ? '13px' : '16px', color: '#7E7E82', textAlign: 'center', marginBottom: isMobile ? '28px' : '40px' }}>Manage all your uploaded events, memes and blogs.</p>

        <div style={{ display: 'flex', borderBottom: '1px solid #E8E8EA', marginBottom: isMobile ? '20px' : '32px', overflowX: isMobile ? 'auto' : 'visible', WebkitOverflowScrolling: 'touch' }}>
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{ padding: isMobile ? '12px 20px' : '12px 32px', border: 'none', background: 'none', cursor: 'pointer', fontSize: isMobile ? '13px' : '14px', fontWeight: '500', color: activeTab === tab.key ? '#141415' : '#59595C', borderBottom: activeTab === tab.key ? '2px solid #141415' : '2px solid transparent', marginBottom: '-1px', flexShrink: 0, whiteSpace: 'nowrap' }}>
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {activeTab === 'events' && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: isMobile ? '20px' : '24px', overflowX: isMobile ? 'auto' : 'visible' }}>
            {['running', 'past'].map((f) => (
              <button key={f} onClick={() => setEventFilter(f)}
                style={{ height: '36px', padding: '0 16px', borderRadius: '8px', border: '1px solid ' + (eventFilter === f ? '#0097FF' : '#E8E8EA'), backgroundColor: eventFilter === f ? '#EFF9FF' : '#FFFFFF', color: eventFilter === f ? '#0097FF' : '#59595C', fontSize: isMobile ? '12px' : '13px', fontWeight: '500', cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' }}>
                {f === 'running' ? '🟢 Running Events' : '⏰ Past Events'} ({f === 'running' ? runningEvents.length : pastEvents.length})
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: isMobile ? '60px 0' : '80px 0' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[0,1,2].map((i) => <div key={i} style={{ width: '12px', height: '12px', borderRadius: '9999px', backgroundColor: '#0097FF', animation: 'bounce 0.6s ease ' + (i * 0.1) + 's infinite alternate' }} />)}
            </div>
          </div>
        ) : currentItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: isMobile ? '60px 0' : '80px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <h3 style={{ fontSize: isMobile ? '19px' : '24px', fontWeight: '600', color: '#141415', marginBottom: '8px' }}>No uploads yet</h3>
            <p style={{ fontSize: isMobile ? '14px' : '16px', color: '#7E7E82', marginBottom: '24px' }}>Start uploading to see your content here.</p>
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => navigate('/events/create')} style={{ height: '44px', padding: '0 20px', borderRadius: '8px', backgroundColor: '#0097FF', color: '#FFFFFF', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>📅 Create Event</button>
              <button onClick={() => navigate('/memes/create')} style={{ height: '44px', padding: '0 20px', borderRadius: '8px', backgroundColor: '#FFFFFF', color: '#414143', border: '1px solid #E8E8EA', cursor: 'pointer', fontSize: '14px' }}>😂 Upload Meme</button>
              <button onClick={() => navigate('/blog/create')} style={{ height: '44px', padding: '0 20px', borderRadius: '8px', backgroundColor: '#FFFFFF', color: '#414143', border: '1px solid #E8E8EA', cursor: 'pointer', fontSize: '14px' }}>✍️ Write Blog</button>
            </div>
          </div>
        ) : (
          <div style={{ display: isMobile ? 'block' : 'grid', gridTemplateColumns: isMobile ? undefined : '1fr 292px', gap: isMobile ? 0 : '48px', alignItems: 'start' }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? '14px' : '24px' }}>
              {itemsWithAds.map((entry, idx) =>
                entry.kind === 'ad'
                  ? <AdCard key={'ad-' + idx} ad={entry.data} isMobile={isMobile} />
                  : <UploadCard key={entry.data.id} item={entry.data} type={activeTab} isMobile={isMobile} onView={() => setViewItem(entry.data)} onDelete={() => setDeleteTarget(entry.data)} />
              )}
            </div>
            {!isMobile && (
              <div style={{ position: 'sticky', top: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {sidebarAds.map((ad) => <SidebarAdCard key={ad.id} ad={ad} />)}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`@keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-12px); } }`}</style>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}><Footer /></div>

      {deleteTarget && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '0 24px' : 0 }}>
          <div style={{ width: isMobile ? '100%' : '420px', backgroundColor: '#FFFFFF', borderRadius: '16px', padding: isMobile ? '24px' : '32px', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#141415', marginBottom: '8px' }}>Delete Item</h3>
            <p style={{ fontSize: '14px', color: '#7E7E82', marginBottom: '24px' }}>Are you sure you want to delete "<strong>{deleteTarget.title}</strong>"? This cannot be undone.</p>
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column-reverse' : 'row', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setDeleteTarget(null)} style={{ height: '40px', padding: '0 20px', borderRadius: '8px', border: '1px solid #E8E8EA', backgroundColor: '#FFFFFF', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => handleDelete(deleteTarget)} style={{ height: '40px', padding: '0 20px', borderRadius: '8px', border: 'none', backgroundColor: '#AE2012', color: '#FFFFFF', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {viewItem && <ViewModal item={viewItem} type={activeTab} isMobile={isMobile} onClose={() => setViewItem(null)} navigate={navigate} />}
    </div>
  )
}

function UploadCard({ item, type, isMobile, onView, onDelete }) {
  const [hovered, setHovered] = useState(false)
  const imageUrl = item.image_url || item.cover_image_url || 'https://picsum.photos/seed/' + item.id + '/296/200'
  return (
    <div onMouseEnter={() => !isMobile && setHovered(true)} onMouseLeave={() => !isMobile && setHovered(false)}
      style={{ borderRadius: isMobile ? '12px' : '16px', overflow: 'hidden', boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.06)', transition: 'all 0.3s ease', transform: hovered ? 'translateY(-4px)' : 'translateY(0)', backgroundColor: '#FFFFFF' }}>
      <div style={{ position: 'relative', height: isMobile ? '130px' : '200px' }}>
        <img src={imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        {!isMobile && hovered && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <button onClick={onView} style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: '#0097FF', color: '#FFFFFF', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>View</button>
            <button onClick={onDelete} style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#AE2012" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
            </button>
          </div>
        )}
      </div>
      <div style={{ padding: isMobile ? '8px' : '12px 14px' }}>
        <p style={{ fontSize: isMobile ? '12px' : '13px', fontWeight: '600', color: '#141415', margin: '0 0 6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
        <div style={{ display: 'flex', gap: isMobile ? '8px' : '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: isMobile ? '10px' : '11px', color: '#7E7E82' }}>❤️ {item.likes || 0}</span>
          <span style={{ fontSize: isMobile ? '10px' : '11px', color: '#7E7E82' }}>🔖 {item.saves || 0}</span>
          {item.views !== undefined && <span style={{ fontSize: isMobile ? '10px' : '11px', color: '#7E7E82' }}>👁 {item.views || 0}</span>}
          {item.reads !== undefined && <span style={{ fontSize: isMobile ? '10px' : '11px', color: '#7E7E82' }}>📖 {item.reads || 0}</span>}
        </div>
        <p style={{ fontSize: '10px', color: '#C7C7CA', margin: '6px 0 0' }}>{new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
        {isMobile && (
          <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
            <button onClick={onView} style={{ flex: 1, height: '30px', borderRadius: '6px', border: '1px solid #E8E8EA', backgroundColor: '#0097FF', color: '#FFFFFF', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>View</button>
            <button onClick={onDelete} style={{ width: '30px', height: '30px', borderRadius: '6px', border: '1px solid #E8E8EA', backgroundColor: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#AE2012" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function ViewModal({ item, type, isMobile, onClose, navigate }) {
  const imageUrl = item.image_url || item.cover_image_url || 'https://picsum.photos/seed/' + item.id + '/380/400'

  let blogSections = []
  if (type === 'blogs' && item.content) {
    try { blogSections = Array.isArray(item.content) ? item.content : JSON.parse(item.content) }
    catch { blogSections = [{ subtitle: '', content: item.description || '' }] }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,12,20,0.75)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '0 24px' : '24px' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>

      <div style={{
        width: isMobile ? '100%' : '860px', maxHeight: isMobile ? '90vh' : '88vh', backgroundColor: '#FFFFFF', borderRadius: isMobile ? '20px' : '24px',
        overflow: 'hidden', display: isMobile ? 'flex' : 'grid', flexDirection: isMobile ? 'column' : undefined,
        gridTemplateColumns: isMobile ? undefined : '320px 1fr', boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
      }}>

        <div style={{ position: 'relative', overflow: 'hidden', height: isMobile ? '160px' : 'auto', flexShrink: 0 }}>
          <img src={imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)', padding: '24px 16px 16px' }}>
            <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)' }}>
              <span style={{ fontSize: '12px', color: '#FFFFFF', fontWeight: '600', textTransform: 'capitalize' }}>{type === 'blogs' ? 'Blog' : type === 'memes' ? 'Meme' : 'Event'}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', maxHeight: isMobile ? undefined : '88vh', overflow: 'hidden', flex: 1, minHeight: 0 }}>
          <div style={{ padding: isMobile ? '18px 20px 14px' : '24px 28px 16px', borderBottom: '1px solid #E8E8EA', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
              <h2 style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: '700', color: '#141415', margin: 0, lineHeight: isMobile ? '24px' : '28px' }}>{item.title}</h2>
              <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#7E7E82', flexShrink: 0 }}>✕</button>
            </div>
            {item.category && (
              <span style={{ display: 'inline-block', marginTop: '8px', padding: '3px 12px', borderRadius: '9999px', backgroundColor: '#EFF9FF', fontSize: '12px', color: '#0097FF', fontWeight: '600' }}>{item.category}</span>
            )}
          </div>

          <div style={{ overflowY: 'auto', padding: isMobile ? '16px 20px' : '20px 28px', flex: 1, scrollbarWidth: 'thin' }}>
            {type === 'blogs' && blogSections.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                {blogSections.map((section, i) => (
                  <div key={i} style={{ marginBottom: '20px' }}>
                    {section.subtitle && section.subtitle.trim() && <p style={{ fontSize: '15px', fontWeight: '700', color: '#141415', margin: '0 0 6px' }}>{section.subtitle}</p>}
                    <p style={{ fontSize: '14px', color: '#59595C', lineHeight: '22px', margin: 0, whiteSpace: 'pre-line' }}>{section.content}</p>
                  </div>
                ))}
              </div>
            )}

            {type === 'memes' && item.caption && (
              <div style={{ backgroundColor: '#F9F9F9', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px' }}>
                <p style={{ fontSize: '14px', color: '#414143', margin: 0, lineHeight: '22px' }}>{item.caption}</p>
              </div>
            )}

            {type !== 'blogs' && item.description && <p style={{ fontSize: '14px', color: '#59595C', marginBottom: '16px', lineHeight: '22px' }}>{item.description}</p>}

            {item.location && <p style={{ fontSize: '13px', color: '#7E7E82', marginBottom: '8px' }}>📍 <strong>{item.location}</strong></p>}
            {item.event_date && (
              <p style={{ fontSize: '13px', color: '#7E7E82', marginBottom: '8px' }}>
                📅 {new Date(item.event_date) >= new Date() ? '🟢 Running' : '⏰ Past'} — {new Date(item.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            )}

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #E8E8EA' }}>
              <span style={{ fontSize: '13px', color: '#59595C' }}>❤️ {item.likes || 0}</span>
              <span style={{ fontSize: '13px', color: '#59595C' }}>🔖 {item.saves || 0}</span>
              {item.views !== undefined && <span style={{ fontSize: '13px', color: '#59595C' }}>👁 {item.views || 0}</span>}
              {item.reads !== undefined && <span style={{ fontSize: '13px', color: '#59595C' }}>📖 {item.reads || 0}</span>}
              {item.downloads !== undefined && <span style={{ fontSize: '13px', color: '#59595C' }}>⬇️ {item.downloads || 0}</span>}
            </div>

            <p style={{ fontSize: '12px', color: '#C7C7CA', marginTop: '16px' }}>Uploaded on {new Date(item.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>

          {type === 'blogs' && (
            <div style={{ padding: isMobile ? '14px 20px' : '16px 28px', borderTop: '1px solid #E8E8EA', flexShrink: 0 }}>
              <button onClick={() => { onClose(); navigate('/blog/' + item.id) }}
                style={{ width: '100%', height: '44px', borderRadius: '8px', border: 'none', backgroundColor: '#0097FF', color: '#FFFFFF', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                Read Full Blog →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyUploads