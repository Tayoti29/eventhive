import { useState, useEffect } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
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
  const [advertHovered, setAdvertHovered] = useState(false)

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

      // Fetch captions from meme_captions table
      const { data: caps } = await supabase
        .from('meme_captions')
        .select('*')
        .eq('meme_id', id)
        .order('created_at', { ascending: false })
      setCaptions(caps || [])

      // Fetch related memes same category, exclude this one
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

  // Decide what captions to show — DB captions first, then fall back to the meme's own caption field
  const displayCaptions = captions.length > 0
    ? captions
    : (m.caption ? [{ id: 'orig', author_name: m.uploader_name || 'Uploader', author_avatar: m.uploader_avatar, caption: m.caption }] : [])

  const relatedColumns = [[], [], []]
  relatedMemes.forEach((rm, i) => relatedColumns[i % 3].push(rm))

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
                  onClick={() => { const a = document.createElement('a'); a.href = m.image_url; a.download = 'meme.jpg'; a.click() }}
                  icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#59595C" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>}
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

          {/* Advert */}
          <div onMouseEnter={() => setAdvertHovered(true)} onMouseLeave={() => setAdvertHovered(false)}
            style={{ width: '292px', minHeight: '600px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, boxShadow: advertHovered ? '0 8px 32px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', transform: advertHovered ? 'scale(1.02)' : 'scale(1)', cursor: 'pointer' }}>
            <img src={advertImg} alt="Advertisement" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
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
                    {col.map((rm) => <RelatedMemeCard key={rm.id} meme={rm} />)}
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('/memes')}
                style={{ marginTop: '24px', padding: '10px 24px', borderRadius: '8px', border: '1px solid #E8E8EA', backgroundColor: '#FFFFFF', fontSize: '14px', color: '#59595C', cursor: 'pointer' }}>
                View All Memes
              </button>
            </div>
            <div style={{ width: '292px', minHeight: '500px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer' }}>
              <img src={advertImg} alt="Advertisement" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
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
      <style>{`@keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-12px); } }`}</style>
    </div>
  )
}

export default MemeDetail