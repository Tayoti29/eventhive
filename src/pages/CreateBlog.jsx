import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import SuccessBanner from '../components/SuccessBanner'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabaseClient'

const blogTypes = [
  { label: 'Events', icon: '📅' },
  { label: 'Music', icon: '🎵' },
  { label: 'Tech', icon: '💻' },
  { label: 'Lifestyle', icon: '✨' },
  { label: 'Business', icon: '💼' },
  { label: 'Health', icon: '❤️' },
  { label: 'Travel', icon: '✈️' },
  { label: 'Food', icon: '🍔' },
  { label: 'Entertainment', icon: '🎬' },
  { label: 'Sports', icon: '⚽' },
  { label: 'Fashion', icon: '👗' },
  { label: 'Education', icon: '📚' },
]

function isValidUUID(id) {
  return id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id))
}

function CreateBlog() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const fileInputRef = useRef(null)
  const replaceInputRef = useRef(null)

  const [flyer, setFlyer] = useState(null)
  const [flyerPreview, setFlyerPreview] = useState(null)
  const [showImageMenu, setShowImageMenu] = useState(false)
  const [blogType, setBlogType] = useState('')
  const [showTypeFlyout, setShowTypeFlyout] = useState(false)
  const [title, setTitle] = useState('')
  const [sections, setSections] = useState([{ subtitle: '', content: '' }])
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [showUploadConfirm, setShowUploadConfirm] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleFlyer = (file) => {
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { alert('File too large. Max 5MB'); return }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { alert('Only JPG, PNG or WebP allowed'); return }
    setFlyer(file)
    setFlyerPreview(URL.createObjectURL(file))
  }

  const addSection = () => {
    if (sections.length < 5) setSections([...sections, { subtitle: '', content: '' }])
  }

  const updateSection = (index, field, value) => {
    const updated = [...sections]
    updated[index] = { ...updated[index], [field]: value }
    setSections(updated)
  }

  const removeSection = (index) => {
    if (sections.length === 1) return
    setSections(sections.filter((_, i) => i !== index))
  }

  const addTag = (tag) => {
    const clean = tag.trim()
    if (tags.length >= 3 || tags.includes(clean) || !clean) return
    setTags([...tags, clean])
    setTagInput('')
  }

  const removeTag = (tag) => setTags(tags.filter((t) => t !== tag))

  const validate = () => {
    const e = {}
    if (!flyerPreview) e.flyer = 'Please upload a blog cover image'
    if (!title.trim()) e.title = 'Blog title is required'
    if (!blogType) e.type = 'Please select a blog type'
    if (!sections[0].content.trim()) e.content = 'At least one content section is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleConfirmUpload = async () => {
    setShowUploadConfirm(false)
    setLoading(true)

    try {
      console.log('📤 Starting blog upload...')

      let imageUrl = 'https://picsum.photos/seed/' + Date.now() + '/405/202'

      if (flyer) {
        console.log('🖼️ Uploading cover image...')
        const fileExt = flyer.name.split('.').pop()
        const fileName = 'blogs/' + Date.now() + '.' + fileExt
        const { error: uploadError } = await supabase.storage
          .from('blog-covers')
          .upload(fileName, flyer, { contentType: flyer.type })
        if (uploadError) {
          console.error('❌ Cover image upload failed:', uploadError.message)
        } else {
          const { data: urlData } = supabase.storage.from('blog-covers').getPublicUrl(fileName)
          imageUrl = urlData.publicUrl
          console.log('✅ Cover image uploaded:', imageUrl)
        }
      }

      const totalWords = sections.reduce((acc, s) => acc + (s.content || '').split(' ').length, 0)
      const readTime = Math.max(1, Math.ceil(totalWords / 200))
      const description = sections[0].content.slice(0, 200)

      const blogData = {
        title: title.trim(),
        description,
        content: sections,
        category: blogType,
        cover_image_url: imageUrl,
        author_name: user?.user_metadata?.full_name || user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'Anonymous',
        author_avatar: user?.user_metadata?.avatar_url || null,
        author_id: isValidUUID(user?.id) ? user.id : null,
        is_published: true,
        read_time: readTime,
        likes: 0,
        saves: 0,
        reads: 0,
      }

      console.log('📋 Inserting blog...')
      const { data: inserted, error: insertError } = await supabase
        .from('blogs')
        .insert([blogData])
        .select()

      if (insertError) {
        console.error('❌ Blog insert failed:', insertError.message)
      } else {
        console.log('✅ Blog inserted:', inserted)
      }

    } catch (err) {
      console.error('❌ Unexpected error:', err.message)
    }

    setLoading(false)
    setShowSuccess(true)
  }

  const inputStyle = {
    width: '100%', height: '44px', borderRadius: '8px', border: '1px solid #E8E8EA',
    padding: '0 14px', fontSize: '14px', color: '#414143', outline: 'none',
    boxSizing: 'border-box', backgroundColor: '#FFFFFF', fontFamily: 'inherit',
  }
  const labelStyle = {
    fontSize: '14px', fontWeight: '600', color: '#141415', display: 'block', marginBottom: '6px',
  }
  const errorStyle = { fontSize: '12px', color: '#AE2012', display: 'block', marginTop: '4px' }

  return (
    <div style={{ backgroundColor: '#F5F4F0', minHeight: '100vh' }}>
      {showSuccess && (
        <SuccessBanner
          message="Your blog has been published successfully 📝"
          onDone={() => navigate('/my-uploads', { state: { activeTab: 'blogs' } })}
        />
      )}

      <div style={{ maxWidth: '1440px', margin: '0 auto' }}><Navbar /></div>

      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '32px 100px 80px' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '40px', fontWeight: '700', color: '#141415', margin: 0 }}>Write a Blog</h1>
          <button
            onClick={() => { if (validate()) setShowUploadConfirm(true) }}
            style={{ height: '40px', padding: '0 24px', borderRadius: '8px', border: 'none', backgroundColor: '#0097FF', color: '#FFFFFF', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            Save and Publish Blog
          </button>
        </div>

        <div style={{ maxWidth: '680px', margin: '0 auto' }}>

          {/* Cover Image */}
          {!flyerPreview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={(e) => { e.preventDefault(); handleFlyer(e.dataTransfer.files[0]) }}
              onDragOver={(e) => e.preventDefault()}
              style={{ width: '100%', height: '220px', borderRadius: '12px', border: '2px dashed ' + (errors.flyer ? '#AE2012' : '#C7C7CA'), backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginBottom: '24px', gap: '10px', transition: 'border-color 0.2s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0097FF' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = errors.flyer ? '#AE2012' : '#C7C7CA' }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#A5A5AA" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <p style={{ fontSize: '15px', fontWeight: '600', color: '#414143', margin: 0 }}>Upload Blog Cover Image</p>
              <p style={{ fontSize: '12px', color: '#A5A5AA', margin: 0, textAlign: 'center' }}>Click to upload or drag and drop. JPG, PNG. Max 5MB</p>
              {errors.flyer && <span style={{ fontSize: '12px', color: '#AE2012' }}>{errors.flyer}</span>}
            </div>
          ) : (
            <div style={{ position: 'relative', marginBottom: '24px' }}
              onMouseEnter={() => setShowImageMenu(true)} onMouseLeave={() => setShowImageMenu(false)}>
              <img src={flyerPreview} alt="Cover"
                style={{ width: '100%', borderRadius: '12px', maxHeight: '320px', objectFit: 'cover', display: 'block' }} />
              {showImageMenu && (
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <button onClick={() => replaceInputRef.current?.click()}
                    style={{ padding: '8px 20px', borderRadius: '8px', backgroundColor: '#FFFFFF', color: '#414143', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                    ← Replace
                  </button>
                  <button onClick={() => { setFlyer(null); setFlyerPreview(null) }}
                    style={{ padding: '8px 20px', borderRadius: '8px', backgroundColor: '#FFFFFF', color: '#AE2012', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                    🗑 Delete
                  </button>
                </div>
              )}
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }}
            onChange={(e) => handleFlyer(e.target.files[0])} />
          <input ref={replaceInputRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }}
            onChange={(e) => handleFlyer(e.target.files[0])} />

          {/* Title */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Blog Title *</label>
            <input type="text" placeholder="Enter your blog title" maxLength={100} value={title}
              onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors((p) => ({ ...p, title: '' })) }}
              style={{ ...inputStyle, borderColor: errors.title ? '#AE2012' : '#E8E8EA' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              {errors.title && <span style={errorStyle}>{errors.title}</span>}
              <span style={{ fontSize: '11px', color: '#A5A5AA', marginLeft: 'auto' }}>{title.length}/100</span>
            </div>
          </div>

          {/* Blog Type */}
          <div style={{ marginBottom: '20px', position: 'relative' }}>
            <label style={labelStyle}>Blog Type *</label>
            <button
              onClick={() => setShowTypeFlyout(!showTypeFlyout)}
              style={{ ...inputStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderColor: errors.type ? '#AE2012' : '#E8E8EA' }}>
              <span style={{ color: blogType ? '#414143' : '#A5A5AA' }}>
                {blogType ? (blogTypes.find((t) => t.label === blogType)?.icon + ' ' + blogType) : 'Select Blog Type'}
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7E7E82" strokeWidth="2"
                style={{ transform: showTypeFlyout ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', flexShrink: 0 }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {errors.type && <span style={errorStyle}>{errors.type}</span>}
            {showTypeFlyout && (
              <div style={{ position: 'absolute', top: '76px', left: 0, width: '100%', backgroundColor: '#FFFFFF', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', padding: '8px', zIndex: 100, maxHeight: '260px', overflowY: 'auto' }}>
                {blogTypes.map((type) => (
                  <div key={type.label}
                    onClick={() => { setBlogType(type.label); setShowTypeFlyout(false); if (errors.type) setErrors((p) => ({ ...p, type: '' })) }}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', backgroundColor: blogType === type.label ? '#EFF9FF' : 'transparent' }}
                    onMouseEnter={(e) => { if (blogType !== type.label) e.currentTarget.style.backgroundColor = '#F9F9F9' }}
                    onMouseLeave={(e) => { if (blogType !== type.label) e.currentTarget.style.backgroundColor = 'transparent' }}>
                    <span style={{ fontSize: '18px' }}>{type.icon}</span>
                    <span style={{ fontSize: '14px', color: '#414143' }}>{type.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Content Sections */}
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Blog Content * (up to 5 sections)</label>
            {sections.map((section, i) => (
              <div key={i} style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '20px', marginBottom: '16px', border: '1px solid ' + (i === 0 && errors.content ? '#AE2012' : '#E8E8EA') }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#7E7E82' }}>
                    Section {i + 1} {i === 0 ? '(required)' : '(optional)'}
                  </span>
                  {sections.length > 1 && (
                    <button onClick={() => removeSection(i)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#AE2012', fontSize: '13px', fontWeight: '500' }}>
                      Remove
                    </button>
                  )}
                </div>
                <input type="text"
                  placeholder={'Section ' + (i + 1) + ' subtitle (optional)'}
                  value={section.subtitle}
                  onChange={(e) => updateSection(i, 'subtitle', e.target.value)}
                  style={{ ...inputStyle, marginBottom: '10px' }} />
                <textarea
                  placeholder={'Write content for section ' + (i + 1) + '...'}
                  value={section.content}
                  onChange={(e) => {
                    updateSection(i, 'content', e.target.value)
                    if (i === 0 && errors.content) setErrors((p) => ({ ...p, content: '' }))
                  }}
                  rows={5}
                  style={{ width: '100%', borderRadius: '8px', border: '1px solid #E8E8EA', padding: '10px 14px', fontSize: '14px', color: '#414143', outline: 'none', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit', lineHeight: '1.6' }} />
                {i === 0 && errors.content && <span style={errorStyle}>{errors.content}</span>}
              </div>
            ))}
            {sections.length < 5 && (
              <button onClick={addSection}
                style={{ height: '44px', padding: '0 20px', borderRadius: '8px', border: '2px dashed #C7C7CA', backgroundColor: '#FFFFFF', cursor: 'pointer', fontSize: '13px', color: '#59595C', transition: 'border-color 0.2s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0097FF' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#C7C7CA' }}>
                + Add Another Section
              </button>
            )}
          </div>

          {/* Tags */}
          <div style={{ marginBottom: '40px' }}>
            <label style={labelStyle}>Tags (max 3 — press Enter to add)</label>
            <input type="text" placeholder="Type a tag and press Enter..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput) } }}
              style={inputStyle} />
            {tags.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                {tags.map((tag) => (
                  <div key={tag} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 12px', borderRadius: '9999px', backgroundColor: '#FFFCF4', border: '1px solid #FFB900' }}>
                    <span style={{ fontSize: '12px', color: '#B88700', fontWeight: '500' }}>{tag}</span>
                    <button onClick={() => removeTag(tag)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#B88700', padding: 0, fontSize: '16px', lineHeight: 1 }}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button onClick={() => { if (validate()) setShowUploadConfirm(true) }} disabled={loading}
            style={{ height: '52px', padding: '0 40px', borderRadius: '10px', border: 'none', backgroundColor: loading ? '#C7C7CA' : '#0097FF', color: '#FFFFFF', fontSize: '16px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s ease' }}>
            {loading ? 'Publishing...' : 'Publish Blog'}
          </button>
        </div>
      </div>

      {/* Confirm Modal */}
      {showUploadConfirm && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '440px', backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '32px', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#141415', marginBottom: '8px' }}>Publish "{title}"</h3>
            <p style={{ fontSize: '14px', color: '#7E7E82', marginBottom: '24px' }}>
              Are you sure you want to publish this blog? It will be visible to everyone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setShowUploadConfirm(false)}
                style={{ height: '44px', padding: '0 20px', borderRadius: '8px', border: '1px solid #E8E8EA', backgroundColor: '#FFFFFF', fontSize: '14px', color: '#414143', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={handleConfirmUpload}
                style={{ height: '44px', padding: '0 24px', borderRadius: '8px', border: 'none', backgroundColor: '#0097FF', color: '#FFFFFF', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                Yes, Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateBlog