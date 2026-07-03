import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import DeleteModal from '../components/DeleteModal'
import SuccessBanner from '../components/SuccessBanner'
import { useSave } from '../context/SaveContext'
import { useAuth } from '../context/AuthContext'

const tabConfig = [
  { key: 'all', label: 'All', color: '#0097FF', bg: '#EFF9FF' },
  { key: 'event', label: 'Events', color: '#007ACC', bg: '#E3F4FF' },
  { key: 'meme', label: 'Memes', color: '#D90870', bg: '#FFF0F3' },
  { key: 'blog', label: 'Blogs', color: '#B88700', bg: '#FFFCF4' },
]

function Saved() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const { savedBoxes, removeFromBox, deleteBox } = useSave()
  const [activeTab, setActiveTab] = useState('all')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')

  const filteredBoxes = activeTab === 'all'
    ? savedBoxes
    : savedBoxes.filter((b) => b.type === activeTab)

  const handleDeleteItem = (boxId, item) => {
    setDeleteTarget({ boxId, item, isBox: false })
  }

  const handleDeleteBox = (box) => {
    setDeleteTarget({ box, isBox: true })
  }

  const confirmDelete = () => {
    if (deleteTarget.isBox) {
      deleteBox(deleteTarget.box.id)
      setSuccessMsg(`You have successfully deleted "${deleteTarget.box.name}"`)
    } else {
      removeFromBox(deleteTarget.boxId, deleteTarget.item.id)
      setSuccessMsg(`You have successfully deleted "${deleteTarget.item.title}"`)
    }
    setDeleteTarget(null)
  }

  if (!user) {
    return (
      <div style={{ backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}><Navbar /></div>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '80px 100px', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>🔖</div>
          <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#141415', marginBottom: '12px' }}>Sign in to view your saved items</h2>
          <p style={{ fontSize: '16px', color: '#7E7E82', marginBottom: '32px' }}>Save events, memes and blogs to view them anytime.</p>
          <button onClick={() => navigate('/login', { state: { backgroundLocation: location } })}
            style={{ height: '48px', padding: '0 32px', borderRadius: '8px', backgroundColor: '#0097FF', color: '#FFFFFF', fontSize: '16px', fontWeight: '600', border: 'none', cursor: 'pointer' }}>
            Sign In
          </button>
        </div>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}><Footer /></div>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#FFFFFF' }}>
      {successMsg && <SuccessBanner message={successMsg} onDone={() => setSuccessMsg('')} />}

      <div style={{ maxWidth: '1440px', margin: '0 auto' }}><Navbar /></div>

      {/* Banner */}
      <section style={{ backgroundColor: '#EFF9FF', width: '100%' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '48px 100px' }}>
          <h1 style={{ fontSize: '40px', fontWeight: '700', color: '#141415', marginBottom: '8px' }}>My Saved Items</h1>
          <p style={{ fontSize: '24px', color: '#7E7E82' }}>All your saved events, memes and blogs in one place.</p>
        </div>
      </section>

      {/* Tabs */}
      <section style={{ width: '100%', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E8E8EA' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 100px', display: 'flex', gap: '32px' }}>
          {tabConfig.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{ padding: '16px 0', border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '500', color: activeTab === tab.key ? '#141415' : '#59595C', borderBottom: activeTab === tab.key ? '2px solid #141415' : '2px solid transparent', marginBottom: '-1px', transition: 'all 0.2s ease' }}>
              {tab.label}
              <span style={{ marginLeft: '6px', fontSize: '12px', color: '#A5A5AA' }}>
                ({tab.key === 'all' ? savedBoxes.reduce((acc, b) => acc + b.items.length, 0) : savedBoxes.filter((b) => b.type === tab.key).reduce((acc, b) => acc + b.items.length, 0)})
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Content */}
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '48px 100px' }}>
        {filteredBoxes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔖</div>
            <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#141415', marginBottom: '8px' }}>No saved items yet</h3>
            <p style={{ fontSize: '16px', color: '#7E7E82' }}>Browse and save events, memes or blogs to see them here.</p>
          </div>
        ) : (
          filteredBoxes.map((box) => (
            <div key={box.id} style={{ marginBottom: '64px' }}>
              {/* Box Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div>
                  <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#141415', margin: 0 }}>{box.name}</h2>
                  <p style={{ fontSize: '16px', color: '#7E7E82', margin: '4px 0 0 0' }}>{box.description}</p>
                </div>
                <button onClick={() => handleDeleteBox(box)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', border: '1px solid #E8E8EA', backgroundColor: '#FFFFFF', cursor: 'pointer', fontSize: '13px', color: '#AE2012' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#AE2012" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
                  </svg>
                  Delete Box
                </button>
              </div>

              <p style={{ fontSize: '13px', color: '#A5A5AA', marginBottom: '24px' }}>{box.items.length} item{box.items.length !== 1 ? 's' : ''} • Created {box.createdAt}</p>

              {/* Items Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                {box.items.map((item) => (
                  <SavedItemCard
                    key={item.id}
                    item={item}
                    boxType={box.type}
                    onDelete={() => handleDeleteItem(box.id, item)}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ maxWidth: '1440px', margin: '0 auto' }}><Footer /></div>

      {deleteTarget && (
        <DeleteModal
          title={`Delete ${deleteTarget.isBox ? 'Box' : deleteTarget.item?.type === 'event' ? 'Event' : deleteTarget.item?.type === 'meme' ? 'Meme' : 'Blog'}`}
          itemName={deleteTarget.isBox ? deleteTarget.box.name : deleteTarget.item?.title}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  )
}

function SavedItemCard({ item, boxType, onDelete }) {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()

  const handleView = () => {
    if (boxType === 'event') navigate(`/events/${item.id}`, { state: { from: '/saved' } })
    if (boxType === 'meme') navigate(`/memes/${item.id}`, { state: { from: '/saved' } })
    if (boxType === 'blog') navigate(`/blog/${item.id}`, { state: { from: '/saved' } })
  }

  const typeColors = {
    event: { color: '#007ACC', bg: '#EFF9FF' },
    meme: { color: '#D90870', bg: '#FFF0F3' },
    blog: { color: '#B88700', bg: '#FFFCF4' },
  }
  const colors = typeColors[boxType] || typeColors.event

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.06)', transition: 'all 0.3s ease', transform: hovered ? 'translateY(-4px)' : 'translateY(0)', backgroundColor: '#FFFFFF', position: 'relative' }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: '200px', cursor: 'pointer' }} onClick={handleView}>
        <img
          src={item.image || `https://picsum.photos/seed/${item.id}/400/200`}
          alt={item.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />

        {/* Hover overlay */}
        {hovered && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <button onClick={(e) => { e.stopPropagation(); handleView() }}
              style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: '#FFFFFF', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#141415' }}>
              View {boxType === 'event' ? 'Event' : boxType === 'meme' ? 'Meme' : 'Blog'}
            </button>
            <button onClick={(e) => { e.stopPropagation(); onDelete() }}
              style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#AE2012" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              </svg>
            </button>
          </div>
        )}

        {/* Type badge */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', padding: '3px 10px', borderRadius: '9999px', backgroundColor: colors.bg, border: `1px solid ${colors.color}` }}>
          <span style={{ fontSize: '11px', fontWeight: '600', color: colors.color, textTransform: 'capitalize' }}>{boxType}</span>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '12px 14px' }}>
        <p style={{ fontSize: '14px', fontWeight: '600', color: '#141415', margin: '0 0 4px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.title}
        </p>
        <p style={{ fontSize: '12px', color: '#A5A5AA', margin: 0 }}>Saved {item.savedAt}</p>
      </div>
    </div>
  )
}

export default Saved