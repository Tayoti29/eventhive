import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSave } from '../context/SaveContext'
import SaveModal from './SaveModal'

function SaveButton({ item, style = {} }) {
  const { user } = useAuth()
  const { isSaved, createBox, addToBox, getBoxesByType } = useSave()
  const navigate = useNavigate()
  const location = useLocation()
  const [showModal, setShowModal] = useState(false)
  const [showBoxPicker, setShowBoxPicker] = useState(false)
  const saved = isSaved(item.id, item.type)
  const existingBoxes = getBoxesByType(item.type)

  const handleClick = () => {
    if (!user) {
      navigate('/login', { state: { backgroundLocation: location } })
      return
    }
    if (saved) return
    if (existingBoxes.length > 0) {
      setShowBoxPicker(true)
    } else {
      setShowModal(true)
    }
  }

  const handleSaveToBox = (boxId) => {
    addToBox(boxId, item)
    setShowBoxPicker(false)
  }

  const handleCreateNewBox = () => {
    setShowBoxPicker(false)
    setShowModal(true)
  }

  const handleSave = (name, description) => {
    createBox(item.type, name, description, item)
  }

  return (
    <>
      <button
        onClick={handleClick}
        style={{
          height: '36px', padding: '0 20px', borderRadius: '8px',
          border: saved ? '1px solid #0097FF' : 'none',
          cursor: saved ? 'default' : 'pointer',
          fontSize: '14px', fontWeight: '500',
          backgroundColor: saved ? '#EFF9FF' : '#0097FF',
          color: saved ? '#0097FF' : '#F9F9F9',
          transition: 'all 0.2s ease',
          position: 'relative',
          ...style,
        }}
      >
        {saved ? '🔖 Saved' : 'Save'}
      </button>

      {/* Box Picker — save to existing or new box */}
      {showBoxPicker && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,12,20,0.75)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowBoxPicker(false) }}>
          <div style={{ width: '420px', backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '32px', position: 'relative', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
            <button onClick={() => setShowBoxPicker(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#7E7E82' }}>✕</button>
            <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#141415', marginBottom: '8px' }}>
              Save to a Box
            </h3>
            <p style={{ fontSize: '14px', color: '#7E7E82', marginBottom: '24px' }}>
              Choose an existing box or create a new one.
            </p>

            {/* Existing boxes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              {existingBoxes.map((box) => (
                <button key={box.id} onClick={() => handleSaveToBox(box.id)}
                  style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid #E8E8EA', backgroundColor: '#F9F9F9', cursor: 'pointer', textAlign: 'left', fontSize: '14px', fontWeight: '500', color: '#141415', transition: 'all 0.2s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EFF9FF'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F9F9F9'}
                >
                  🔖 {box.name} <span style={{ color: '#A5A5AA', fontWeight: '400' }}>({box.items.length} items)</span>
                </button>
              ))}
            </div>

            {/* Create new box (max 3) */}
            {existingBoxes.length < 3 && (
              <button onClick={handleCreateNewBox}
                style={{ width: '100%', height: '48px', borderRadius: '10px', border: '2px dashed #C7C7CA', backgroundColor: '#FFFFFF', cursor: 'pointer', fontSize: '14px', fontWeight: '500', color: '#59595C' }}>
                + Create New Box
              </button>
            )}
            {existingBoxes.length >= 3 && (
              <p style={{ fontSize: '12px', color: '#A5A5AA', textAlign: 'center' }}>Maximum 3 boxes reached for {item.type}s.</p>
            )}
          </div>
        </div>
      )}

      {showModal && (
        <SaveModal type={item.type} item={item} onClose={() => setShowModal(false)} onSave={handleSave} />
      )}
    </>
  )
}

export default SaveButton