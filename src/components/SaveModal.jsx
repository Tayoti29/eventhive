import { useState } from 'react'

function SaveModal({ type, item, onClose, onSave }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const typeLabels = { event: 'Event', meme: 'Meme', blog: 'Blog' }
  const label = typeLabels[type] || 'Item'

  const handleCreate = () => {
    onSave(name, description)
    onClose()
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,12,20,0.75)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ width: '540px', backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '40px', position: 'relative', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#7E7E82', fontSize: '20px' }}>✕</button>

        <h3 style={{ fontSize: '28px', fontWeight: '700', color: '#141415', marginBottom: '32px' }}>
          Create a {label} box
        </h3>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '16px', fontWeight: '600', color: '#141415', display: 'block', marginBottom: '8px' }}>Box Name</label>
          <input
            type="text"
            placeholder={`My ${label} Box`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', height: '52px', borderRadius: '12px', border: '1px solid #E8E8EA', padding: '0 16px', fontSize: '16px', color: '#414143', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '32px' }}>
          <label style={{ fontSize: '16px', fontWeight: '600', color: '#141415', display: 'block', marginBottom: '8px' }}>Box Description</label>
          <textarea
            placeholder={`My ${label.toLowerCase()} of sweet memories`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            style={{ width: '100%', borderRadius: '12px', border: '1px solid #E8E8EA', padding: '14px 16px', fontSize: '16px', color: '#414143', outline: 'none', boxSizing: 'border-box', resize: 'none', fontFamily: 'inherit' }}
          />
        </div>

        <button
          onClick={handleCreate}
          style={{ width: '100%', height: '56px', borderRadius: '12px', border: 'none', backgroundColor: '#0097FF', color: '#FFFFFF', fontSize: '18px', fontWeight: '600', cursor: 'pointer' }}
        >
          Create {label} Box
        </button>
      </div>
    </div>
  )
}

export default SaveModal