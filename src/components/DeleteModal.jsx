function DeleteModal({ title, itemName, onCancel, onConfirm }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,12,20,0.75)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div style={{ width: '540px', backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '40px', position: 'relative', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
        <button onClick={onCancel} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#7E7E82', fontSize: '20px' }}>✕</button>

        <h3 style={{ fontSize: '28px', fontWeight: '700', color: '#141415', marginBottom: '12px' }}>
          {title}
        </h3>
        <p style={{ fontSize: '18px', color: '#7E7E82', marginBottom: '32px', lineHeight: '28px' }}>
          Are you sure you want to delete <strong style={{ color: '#141415' }}>{itemName}</strong>?
        </p>

        <div style={{ height: '1px', backgroundColor: '#E8E8EA', marginBottom: '32px' }} />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
          <button
            onClick={onCancel}
            style={{ height: '52px', padding: '0 32px', borderRadius: '12px', border: '1px solid #E8E8EA', backgroundColor: '#FFFFFF', fontSize: '16px', fontWeight: '600', color: '#141415', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{ height: '52px', padding: '0 32px', borderRadius: '12px', border: '2px solid #7B0D2C', backgroundColor: '#FFFFFF', fontSize: '16px', fontWeight: '600', color: '#7B0D2C', cursor: 'pointer' }}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal