import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminSupabase } from '../adminSupabaseClient'

const placements = [
  { page: 'blog_detail', slot: 'sidebar', label: 'Blog Detail — Sidebar', size: '292 × 292' },
  { page: 'blog_detail', slot: 'related_grid', label: 'Blog Detail — Related Blogs Grid', size: '292 × 272' },
  { page: 'blog_detail', slot: 'inline_story', label: 'Blog Detail — Inline (mobile, after story)', size: '900 × 260' },
  { page: 'blog_list', slot: 'grid', label: 'Blog Listing — Grid', size: '800 × 600' },
  { page: 'meme_detail', slot: 'sidebar', label: 'Meme Detail — Sidebar', size: '292 × 292' },
  { page: 'meme_detail', slot: 'related_grid', label: 'Meme Detail — Related Memes Grid', size: '296 × 270' },
  { page: 'meme_detail', slot: 'inline_caption', label: 'Meme Detail — Inline (mobile, after captions)', size: '900 × 250' },
  { page: 'meme_list', slot: 'grid', label: 'Meme Listing — Grid', size: '296 × 300' },
  { page: 'saved', slot: 'sidebar', label: 'Saved — Sidebar', size: '292 × 292' },
  { page: 'saved', slot: 'grid', label: 'Saved — Grid', size: '400 × 200' },
  { page: 'my_uploads', slot: 'sidebar', label: 'My Uploads — Sidebar', size: '292 × 292' },
  { page: 'my_uploads', slot: 'grid', label: 'My Uploads — Grid', size: '296 × 200' },
]

function isVideoFile(file) {
  return file && file.type && file.type.startsWith('video/')
}

function AdminAds() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [checkingAuth, setCheckingAuth] = useState(true)
  const [adminUser, setAdminUser] = useState(null)

  const [selectedPlacement, setSelectedPlacement] = useState(placements[0])
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [linkUrl, setLinkUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [ads, setAds] = useState([])
  const [loadingAds, setLoadingAds] = useState(true)
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await adminSupabase.auth.getSession()
      if (!data?.session) {
        navigate('/admin/login')
        return
      }
      setAdminUser(data.session.user)
      setCheckingAuth(false)
    }
    checkSession()
  }, [navigate])

  useEffect(() => { if (adminUser) fetchAllAds() }, [adminUser])

  const fetchAllAds = async () => {
    setLoadingAds(true)
    const { data, error } = await adminSupabase.from('ads').select('*').order('created_at', { ascending: false })
    setAds(error ? [] : (data || []))
    setLoadingAds(false)
  }

  const handleFile = (f) => {
    if (!f) return
    if (f.size > 15 * 1024 * 1024) { alert('File must be under 15MB'); return }
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleUpload = async () => {
    if (!file) { alert('Please select an image, GIF, or video'); return }
    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${selectedPlacement.page}/${selectedPlacement.slot}/${Date.now()}.${fileExt}`
      const { error: uploadError } = await adminSupabase.storage.from('ad-media').upload(fileName, file, { contentType: file.type })
      if (uploadError) { alert('Upload failed: ' + uploadError.message); setUploading(false); return }

      const { data: urlData } = adminSupabase.storage.from('ad-media').getPublicUrl(fileName)
      const [w, h] = selectedPlacement.size.split('×').map((n) => parseInt(n.trim(), 10))

      const { error: insertError } = await adminSupabase.from('ads').insert([{
        page: selectedPlacement.page,
        slot: selectedPlacement.slot,
        media_url: urlData.publicUrl,
        media_type: isVideoFile(file) ? 'video' : 'image',
        link_url: linkUrl.trim() || null,
        width: w, height: h,
        is_active: true,
      }])
      if (insertError) { alert('Save failed: ' + insertError.message); setUploading(false); return }

      setFile(null); setPreview(null); setLinkUrl('')
      setSuccessMsg('Ad uploaded successfully!')
      setTimeout(() => setSuccessMsg(''), 3000)
      fetchAllAds()
    } catch (err) { alert('Unexpected error: ' + err.message) }
    setUploading(false)
  }

  const toggleActive = async (ad) => {
    await adminSupabase.from('ads').update({ is_active: !ad.is_active }).eq('id', ad.id)
    fetchAllAds()
  }

  const deleteAd = async (ad) => {
    if (!confirm('Delete this ad permanently?')) return
    await adminSupabase.from('ads').delete().eq('id', ad.id)
    fetchAllAds()
  }

  const handleLogout = async () => {
    await adminSupabase.auth.signOut()
    navigate('/admin/login')
  }

  const labelStyle = { fontSize: '14px', fontWeight: '600', color: '#141415', display: 'block', marginBottom: '6px' }
  const inputStyle = { width: '100%', height: '44px', borderRadius: '8px', border: '1px solid #E8E8EA', padding: '0 14px', fontSize: '14px', color: '#414143', outline: 'none', boxSizing: 'border-box', backgroundColor: '#FFFFFF' }

  if (checkingAuth) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7E7E82', fontSize: '14px' }}>Loading...</div>
  }

  return (
    <div style={{ backgroundColor: '#F5F4F0', minHeight: '100vh' }}>
      <div style={{ backgroundColor: '#141415', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: '#FFFFFF', fontSize: '15px', fontWeight: '700' }}>EventHive Admin</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#A5A5AA', fontSize: '13px' }}>{adminUser?.email}</span>
          <button onClick={handleLogout} style={{ height: '32px', padding: '0 14px', borderRadius: '6px', border: '1px solid #333', backgroundColor: 'transparent', color: '#FFFFFF', fontSize: '12px', cursor: 'pointer' }}>Log Out</button>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 20px 80px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#141415', marginBottom: '8px' }}>Manage Adverts</h1>
        <p style={{ fontSize: '14px', color: '#7E7E82', marginBottom: '32px' }}>Upload and manage ads shown across the site, by page and placement.</p>

        {successMsg && (
          <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #4CAF50', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#2E7D32', fontWeight: '500' }}>
            ✅ {successMsg}
          </div>
        )}

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', marginBottom: '32px', border: '1px solid #E8E8EA' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#141415', marginBottom: '20px' }}>Upload New Ad</h3>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Page &amp; Placement</label>
            <select
              value={selectedPlacement.page + '|' + selectedPlacement.slot}
              onChange={(e) => {
                const [page, slot] = e.target.value.split('|')
                setSelectedPlacement(placements.find((p) => p.page === page && p.slot === slot))
              }}
              style={{ ...inputStyle, cursor: 'pointer' }}>
              {placements.map((p) => (
                <option key={p.page + p.slot} value={p.page + '|' + p.slot}>{p.label}</option>
              ))}
            </select>
            <p style={{ fontSize: '12px', color: '#A5A5AA', marginTop: '6px' }}>Recommended size: {selectedPlacement.size}px — images, GIFs, and silent videos are supported (max 15MB)</p>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Media File</label>
            {!preview ? (
              <div onClick={() => fileInputRef.current?.click()}
                style={{ width: '100%', height: '160px', borderRadius: '12px', border: '2px dashed #C7C7CA', backgroundColor: '#F9F9F9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '8px' }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#A5A5AA" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <p style={{ fontSize: '13px', color: '#59595C', margin: 0 }}>Click to upload image, GIF, or video</p>
              </div>
            ) : (
              <div style={{ position: 'relative' }}>
                {isVideoFile(file) ? (
                  <video src={preview} style={{ width: '100%', maxHeight: '220px', borderRadius: '12px', objectFit: 'contain', backgroundColor: '#000' }} controls />
                ) : (
                  <img src={preview} alt="Preview" style={{ width: '100%', maxHeight: '220px', borderRadius: '12px', objectFit: 'contain', backgroundColor: '#F3F3F4' }} />
                )}
                <button onClick={() => { setFile(null); setPreview(null) }}
                  style={{ position: 'absolute', top: '10px', right: '10px', width: '28px', height: '28px', borderRadius: '9999px', backgroundColor: 'rgba(0,0,0,0.6)', color: '#FFFFFF', border: 'none', cursor: 'pointer', fontSize: '14px' }}>✕</button>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*,video/*" style={{ display: 'none' }} onChange={(e) => handleFile(e.target.files[0])} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Link URL (optional)</label>
            <input type="text" placeholder="https://example.com" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} style={inputStyle} />
          </div>

          <button onClick={handleUpload} disabled={uploading || !file}
            style={{ height: '46px', padding: '0 32px', borderRadius: '8px', border: 'none', backgroundColor: (uploading || !file) ? '#C7C7CA' : '#0097FF', color: '#FFFFFF', fontSize: '14px', fontWeight: '600', cursor: (uploading || !file) ? 'not-allowed' : 'pointer' }}>
            {uploading ? 'Uploading...' : 'Upload Ad'}
          </button>
        </div>

        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#141415', marginBottom: '16px' }}>All Ads</h3>
        {loadingAds ? (
          <p style={{ fontSize: '14px', color: '#7E7E82' }}>Loading...</p>
        ) : ads.length === 0 ? (
          <p style={{ fontSize: '14px', color: '#7E7E82' }}>No ads uploaded yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {ads.map((ad) => {
              const placementInfo = placements.find((p) => p.page === ad.page && p.slot === ad.slot)
              return (
                <div key={ad.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', backgroundColor: '#FFFFFF', border: '1px solid #E8E8EA', borderRadius: '12px', padding: '14px', flexWrap: 'wrap' }}>
                  <div style={{ width: '90px', height: '70px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#F3F3F4', flexShrink: 0 }}>
                    {ad.media_type === 'video' ? (
                      <video src={ad.media_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                    ) : (
                      <img src={ad.media_url} alt="Ad" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: '140px' }}>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#141415', margin: '0 0 4px' }}>{placementInfo?.label || ad.page + ' / ' + ad.slot}</p>
                    <p style={{ fontSize: '12px', color: '#A5A5AA', margin: 0 }}>{ad.width}×{ad.height}px · {ad.media_type} · {new Date(ad.created_at).toLocaleDateString()}</p>
                    {ad.link_url && <p style={{ fontSize: '12px', color: '#0097FF', margin: '4px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ad.link_url}</p>}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <button onClick={() => toggleActive(ad)}
                      style={{ height: '36px', padding: '0 14px', borderRadius: '8px', border: '1px solid ' + (ad.is_active ? '#4CAF50' : '#E8E8EA'), backgroundColor: ad.is_active ? '#F0FDF4' : '#F9F9F9', color: ad.is_active ? '#2E7D32' : '#7E7E82', fontSize: '12px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      {ad.is_active ? '● Active' : '○ Paused'}
                    </button>
                    <button onClick={() => deleteAd(ad)}
                      style={{ height: '36px', width: '36px', borderRadius: '8px', border: '1px solid #E8E8EA', backgroundColor: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#AE2012" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminAds