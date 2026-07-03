import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import SuccessBanner from '../components/SuccessBanner'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabaseClient'

const memeCategories = [
  { label: 'Funny', icon: '🤣' },
  { label: 'Relatable', icon: '😅' },
  { label: 'Motivational', icon: '💪' },
  { label: 'Naija', icon: '🇳🇬' },
  { label: 'Couple Goals', icon: '❤️' },
  { label: 'Work Life', icon: '💼' },
  { label: 'School', icon: '📚' },
  { label: 'Politics', icon: '🏛️' },
  { label: 'Sports', icon: '⚽' },
]

function isValidUUID(id) {
  return id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
}

function CreateMeme() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const fileInputRef = useRef(null)
  const replaceInputRef = useRef(null)

  const [flyer, setFlyer] = useState(null)
  const [flyerPreview, setFlyerPreview] = useState(null)
  const [showImageMenu, setShowImageMenu] = useState(false)
  const [category, setCategory] = useState('')
  const [showCategoryFlyout, setShowCategoryFlyout] = useState(false)
  const [captions, setCaptions] = useState([''])
  const [showUploadConfirm, setShowUploadConfirm] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleFlyer = (file) => {
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { alert('File must be less than 5MB'); return }
    setFlyer(file)
    setFlyerPreview(URL.createObjectURL(file))
  }

  const addCaption = () => {
    if (captions.length < 5) setCaptions([...captions, ''])
  }

  const updateCaption = (index, value) => {
    const updated = [...captions]
    updated[index] = value
    setCaptions(updated)
  }

  const removeCaption = (index) => {
    if (captions.length === 1) return
    setCaptions(captions.filter((_, i) => i !== index))
  }

  const validate = () => {
    const newErrors = {}
    if (!flyerPreview) newErrors.flyer = 'Please upload a meme image'
    if (!captions[0].trim()) newErrors.caption = 'At least 1 caption is required'
    if (!category) newErrors.category = 'Please select a category'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleUpload = () => {
    if (validate()) setShowUploadConfirm(true)
  }

  const handleConfirmUpload = async () => {
    setShowUploadConfirm(false)
    setLoading(true)

    try {
      console.log('📤 Starting meme upload...')

      // Upload image
      let imageUrl = `https://picsum.photos/seed/${Date.now()}/296/320`

      if (flyer) {
        console.log('🖼️ Uploading meme image...')
        const fileExt = flyer.name.split('.').pop()
        const fileName = `memes/${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('meme-images')
          .upload(fileName, flyer, { contentType: flyer.type })

        if (uploadError) {
          console.error('❌ Image upload failed:', uploadError.message)
        } else {
          const { data: urlData } = supabase.storage
            .from('meme-images')
            .getPublicUrl(fileName)
          imageUrl = urlData.publicUrl
          console.log('✅ Meme image uploaded:', imageUrl)
        }
      }

      const memeData = {
        title: captions[0].slice(0, 80),
        caption: captions[0],
        category,
        image_url: imageUrl,
        uploader_name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Anonymous',
        uploader_avatar: user?.user_metadata?.avatar_url || 'https://i.pravatar.cc/28?img=1',
        uploader_id: isValidUUID(user?.id) ? user.id : null,
        likes: 0,
        saves: 0,
        views: 0,
        downloads: 0,
      }

      console.log('📋 Inserting meme into database...')

      const { data: insertedMeme, error: insertError } = await supabase
        .from('memes')
        .insert([memeData])
        .select()

      if (insertError) {
        console.error('❌ Meme insert failed:', insertError.message)
      } else {
        console.log('✅ Meme inserted!', insertedMeme)

        // Insert all captions into meme_captions table
        const memeId = insertedMeme[0]?.id
        if (memeId) {
          const captionInserts = captions
            .filter((c) => c.trim())
            .map((cap) => ({
              meme_id: memeId,
              caption: cap,
              author_name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Anonymous',
              user_id: isValidUUID(user?.id) ? user.id : null,
            }))

          const { error: captionError } = await supabase
            .from('meme_captions')
            .insert(captionInserts)

          if (captionError) {
            console.error('❌ Caption insert failed:', captionError.message)
          } else {
            console.log('✅ Captions inserted!')
          }
        }
      }

    } catch (err) {
      console.error('❌ Unexpected error:', err.message)
    }

    setLoading(false)
    setShowSuccess(true)
  }

  const inputStyle = {
    width: '100%', height: '44px', borderRadius: '8px',
    border: '1px solid #E8E8EA', padding: '0 14px',
    fontSize: '14px', color: '#414143', outline: 'none',
    boxSizing: 'border-box', backgroundColor: '#FFFFFF',
  }
  const labelStyle = {
    fontSize: '14px', fontWeight: '600', color: '#141415',
    display: 'block', marginBottom: '6px',
  }

  return (
    <div style={{ backgroundColor: '#F5F4F0', minHeight: '100vh' }}>
      {showSuccess && (
        <SuccessBanner
          message="Your meme has been uploaded successfully 😂"
          onDone={() => navigate('/my-uploads')}
        />
      )}

      <div style={{ maxWidth: '1440px', margin: '0 auto' }}><Navbar /></div>

      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '32px 100px 80px 100px' }}>

        {/* Page Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '40px', fontWeight: '700', color: '#141415', margin: 0 }}>Upload Meme</h1>
          <button onClick={handleUpload}
            style={{ height: '40px', padding: '0 24px', borderRadius: '8px', border: 'none', backgroundColor: '#0097FF', color: '#FFFFFF', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            Save and Upload Meme
          </button>
        </div>

        <div style={{ maxWidth: '540px', margin: '0 auto' }}>

          {/* Meme Image Upload */}
          {!flyerPreview ? (
            <div onClick={() => fileInputRef.current?.click()}
              style={{ width: '100%', height: '200px', borderRadius: '12px', border: `2px dashed ${errors.flyer ? '#AE2012' : '#C7C7CA'}`, backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginBottom: '24px', gap: '8px' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#0097FF'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = errors.flyer ? '#AE2012' : '#C7C7CA'}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#A5A5AA" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#414143', margin: 0 }}>Upload Meme Image</p>
              <p style={{ fontSize: '12px', color: '#A5A5AA', margin: 0, textAlign: 'center' }}>
                Click to upload. JPG, PNG, GIF. Max 5MB
              </p>
              {errors.flyer && <p style={{ fontSize: '12px', color: '#AE2012', margin: 0 }}>{errors.flyer}</p>}
            </div>
          ) : (
            <div style={{ position: 'relative', marginBottom: '24px' }}
              onMouseEnter={() => setShowImageMenu(true)} onMouseLeave={() => setShowImageMenu(false)}>
              <img src={flyerPreview} alt="Meme"
                style={{ width: '100%', borderRadius: '12px', display: 'block', maxHeight: '300px', objectFit: 'contain', backgroundColor: '#F3F3F4' }} />
              {showImageMenu && (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 10 }}>
                  <button onClick={() => replaceInputRef.current?.click()}
                    style={{ padding: '8px 20px', borderRadius: '8px', backgroundColor: '#FFFFFF', color: '#414143', border: '1px solid #E8E8EA', cursor: 'pointer', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap' }}>
                    ← Replace Image
                  </button>
                  <button onClick={() => { setFlyer(null); setFlyerPreview(null) }}
                    style={{ padding: '8px 20px', borderRadius: '8px', backgroundColor: '#FFFFFF', color: '#AE2012', border: '1px solid #AE2012', cursor: 'pointer', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap' }}>
                    🗑 Delete Image
                  </button>
                </div>
              )}
            </div>
          )}

          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }}
            onChange={(e) => handleFlyer(e.target.files[0])} />
          <input ref={replaceInputRef} type="file" accept="image/*" style={{ display: 'none' }}
            onChange={(e) => handleFlyer(e.target.files[0])} />

          {/* Category */}
          <div style={{ marginBottom: '16px', position: 'relative' }}>
            <label style={labelStyle}>Meme Category *</label>
            <button onClick={() => setShowCategoryFlyout(!showCategoryFlyout)}
              style={{ ...inputStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderColor: errors.category ? '#AE2012' : '#E8E8EA' }}>
              <span style={{ color: category ? '#414143' : '#A5A5AA' }}>
                {category ? (memeCategories.find((c) => c.label === category)?.icon + ' ' + category) : 'Select Category'}
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7E7E82" strokeWidth="2"
                style={{ transform: showCategoryFlyout ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {errors.category && <span style={{ fontSize: '12px', color: '#AE2012', display: 'block', marginTop: '4px' }}>{errors.category}</span>}

            {showCategoryFlyout && (
              <div style={{ position: 'absolute', top: '76px', left: 0, width: '100%', backgroundColor: '#FFFFFF', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', padding: '8px', zIndex: 100 }}>
                {memeCategories.map((cat) => (
                  <div key={cat.label}
                    onClick={() => { setCategory(cat.label); setShowCategoryFlyout(false) }}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '8px', cursor: 'pointer' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9F9F9'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <span style={{ fontSize: '14px', color: '#414143' }}>{cat.icon} {cat.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Captions */}
          <div style={{ marginBottom: '32px' }}>
            <label style={labelStyle}>Meme Captions * (at least 1, max 5)</label>
            {captions.map((caption, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'center' }}>
                <input type="text"
                  placeholder={`Caption ${i + 1}${i === 0 ? ' (required)' : ' (optional)'}`}
                  value={caption}
                  onChange={(e) => updateCaption(i, e.target.value)}
                  style={{ ...inputStyle, flex: 1, borderColor: i === 0 && errors.caption ? '#AE2012' : '#E8E8EA' }} />
                {captions.length > 1 && (
                  <button onClick={() => removeCaption(i)}
                    style={{ width: '40px', height: '44px', borderRadius: '8px', border: '1px solid #E8E8EA', backgroundColor: '#FFFFFF', cursor: 'pointer', color: '#AE2012', fontSize: '18px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    ×
                  </button>
                )}
              </div>
            ))}
            {errors.caption && (
              <span style={{ fontSize: '12px', color: '#AE2012', display: 'block', marginBottom: '8px' }}>{errors.caption}</span>
            )}
            {captions.length < 5 && (
              <button onClick={addCaption}
                style={{ height: '42px', padding: '0 20px', borderRadius: '8px', border: '2px dashed #C7C7CA', backgroundColor: '#FFFFFF', cursor: 'pointer', fontSize: '13px', color: '#59595C', marginTop: '4px', transition: 'border-color 0.2s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#0097FF'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#C7C7CA'}>
                + Add Another Caption
              </button>
            )}
          </div>

          {/* Upload Button */}
          <button onClick={handleUpload} disabled={loading}
            style={{ height: '52px', padding: '0 40px', borderRadius: '10px', border: 'none', backgroundColor: loading ? '#C7C7CA' : '#0097FF', color: '#FFFFFF', fontSize: '16px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s ease' }}>
            {loading ? 'Uploading...' : 'Upload Meme'}
          </button>
        </div>
      </div>

      {/* Upload Confirmation Modal */}
      {showUploadConfirm && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '420px', backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '32px', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#141415', marginBottom: '8px' }}>Upload Meme</h3>
            <p style={{ fontSize: '14px', color: '#7E7E82', marginBottom: '24px' }}>
              Are you sure you want to upload this meme?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setShowUploadConfirm(false)}
                style={{ height: '40px', padding: '0 20px', borderRadius: '8px', border: '1px solid #E8E8EA', backgroundColor: '#FFFFFF', fontSize: '14px', color: '#414143', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={handleConfirmUpload}
                style={{ height: '40px', padding: '0 20px', borderRadius: '8px', border: 'none', backgroundColor: '#0097FF', color: '#FFFFFF', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateMeme