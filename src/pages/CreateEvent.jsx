import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import SuccessBanner from '../components/SuccessBanner'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabaseClient'
import { useIsMobile } from '../hooks/useIsMobile'

const eventTypes = [
  { label: 'Concert', icon: '🎵' }, { label: 'Religion', icon: '⛪' },
  { label: 'Education', icon: '📚' }, { label: 'Politics', icon: '🏛️' },
  { label: 'Science', icon: '🔬' }, { label: 'Tech', icon: '💻' },
  { label: 'Sports', icon: '⚽' }, { label: 'Food', icon: '🍔' },
  { label: 'Fashion', icon: '👗' }, { label: 'Business', icon: '💼' },
  { label: 'Arts', icon: '🎨' }, { label: 'Health', icon: '❤️' },
  { label: 'Music', icon: '🎶' }, { label: 'Comedy', icon: '😂' },
  { label: 'Party', icon: '🎉' },
]

const suggestedTagsByType = {
  Concert: ['Music', 'Live', 'Tickets', 'Performance', 'Band', 'Festival'],
  Religion: ['Church', 'Mosque', 'Prayer', 'Crusade', 'Revival', 'Worship'],
  Education: ['Workshop', 'Seminar', 'Training', 'Learning', 'Bootcamp', 'Conference'],
  Tech: ['AI', 'Web3', 'Startup', 'Coding', 'Hackathon', 'Innovation'],
  Sports: ['Football', 'Basketball', 'Tournament', 'League', 'Athletics', 'Games'],
  Business: ['Networking', 'Investment', 'Marketing', 'Pitch', 'Summit', 'Finance'],
  Party: ['Fun', 'Celebration', 'Dance', 'Drinks', 'Nightlife', 'Social'],
  Health: ['Fitness', 'Wellness', 'Medical', 'Nutrition', 'Mental Health', 'Yoga'],
  Arts: ['Exhibition', 'Gallery', 'Creative', 'Design', 'Culture', 'Performance'],
  Music: ['Concert', 'Festival', 'Live', 'Band', 'DJ', 'Gospel'],
  Food: ['Tasting', 'Restaurant', 'Chef', 'Cuisine', 'Festival', 'Market'],
  Fashion: ['Style', 'Design', 'Runway', 'Brand', 'Trends', 'Shopping'],
}

const allTags = ['Music', 'Live', 'Sports', 'Tech', 'Fun', 'Free', 'Networking', 'Food',
  'Art', 'Dance', 'Business', 'Fashion', 'Health', 'Comedy', 'Festival', 'Workshop',
  'Training', 'Seminar', 'Conference', 'Party', 'Concert', 'Gospel', 'Church']

function isValidUUID(id) {
  return id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
}

function CreateEvent() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const isMobile = useIsMobile()
  const fileInputRef = useRef(null)
  const replaceInputRef = useRef(null)

  const [flyer, setFlyer] = useState(null)
  const [flyerPreview, setFlyerPreview] = useState(null)
  const [showImageMenu, setShowImageMenu] = useState(false)
  const [showFullImage, setShowFullImage] = useState(false)
  const [showTypeFlyout, setShowTypeFlyout] = useState(false)
  const [showUploadConfirm, setShowUploadConfirm] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [tagInput, setTagInput] = useState('')
  const [tagSuggestions, setTagSuggestions] = useState([])
  const [showTagSuggestions, setShowTagSuggestions] = useState(false)

  const [form, setForm] = useState({
    title: '', description: '', eventType: '', venueType: 'physical', address: '', onlineLink: '',
    eventDays: 'one', date: '', dateRange: '', time: '', timeEnd: '', fee: 'free', feeAmount: '', tags: [],
  })

  const handleFlyer = (file) => {
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { alert('File must be less than 5MB'); return }
    if (!['image/jpeg', 'image/png'].includes(file.type)) { alert('Only JPG and PNG files allowed'); return }
    setFlyer(file)
    setFlyerPreview(URL.createObjectURL(file))
  }

  const handleDrop = (e) => { e.preventDefault(); handleFlyer(e.dataTransfer.files[0]) }

  const handleTagInput = (val) => {
    setTagInput(val)
    const base = form.eventType ? (suggestedTagsByType[form.eventType] || allTags) : allTags
    if (val.length > 0) {
      const filtered = base.filter((t) => t.toLowerCase().includes(val.toLowerCase()) && !form.tags.includes(t))
      setTagSuggestions(filtered.slice(0, 6))
    } else {
      setTagSuggestions(base.filter((t) => !form.tags.includes(t)).slice(0, 6))
    }
    setShowTagSuggestions(true)
  }

  const addTag = (tag) => {
    if (form.tags.length >= 3 || form.tags.includes(tag)) return
    setForm((prev) => ({ ...prev, tags: [...prev.tags, tag] }))
    setTagInput('')
    setTagSuggestions([])
    setShowTagSuggestions(false)
  }

  const removeTag = (tag) => setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }))

  const validate = () => {
    const newErrors = {}
    if (!flyerPreview) newErrors.flyer = 'Please upload an event flyer'
    if (!form.title.trim()) newErrors.title = 'Event title is required'
    if (!form.eventType) newErrors.eventType = 'Please select an event type'
    if (!form.address && form.venueType !== 'online') newErrors.address = 'Event address is required'
    if (!form.onlineLink && (form.venueType === 'online' || form.venueType === 'both')) newErrors.onlineLink = 'Online link is required'
    if (form.tags.length < 1) newErrors.tags = 'At least 1 tag is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleUploadClick = () => { if (validate()) setShowUploadConfirm(true) }

  const handleConfirmUpload = async () => {
    setShowUploadConfirm(false)
    setLoading(true)
    try {
      let imageUrl = `https://picsum.photos/seed/${Date.now()}/296/280`
      if (flyer) {
        const fileExt = flyer.name.split('.').pop()
        const fileName = `events/${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage.from('event-images').upload(fileName, flyer, { contentType: flyer.type })
        if (!uploadError) {
          const { data: urlData } = supabase.storage.from('event-images').getPublicUrl(fileName)
          imageUrl = urlData.publicUrl
        }
      }
      const eventData = {
        title: form.title, description: form.description || null, category: form.eventType,
        location: (form.venueType === 'physical' || form.venueType === 'both') ? form.address : null,
        registration_link: (form.venueType === 'online' || form.venueType === 'both') ? form.onlineLink : null,
        event_date: form.date ? new Date(form.date).toISOString() : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        date_range_end: form.dateRange ? new Date(form.dateRange).toISOString() : null,
        time: form.time || null, time_end: form.timeEnd || null,
        is_free: form.fee === 'free', ticket_price: form.fee === 'paid' ? form.feeAmount : null,
        image_url: imageUrl,
        organizer_name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Anonymous',
        organizer_avatar: user?.user_metadata?.avatar_url || 'https://i.pravatar.cc/32?img=1',
        organizer_id: isValidUUID(user?.id) ? user.id : null,
        venue_type: form.venueType, event_days: form.eventDays, tags: form.tags,
        likes: 0, saves: 0, views: 0,
      }
      await supabase.from('events').insert([eventData]).select()
    } catch (err) { console.error('❌ Unexpected error:', err.message) }
    setLoading(false)
    setShowSuccess(true)
  }

  const inputStyle = {
    width: '100%', height: isMobile ? '46px' : '44px', borderRadius: '8px',
    border: '1px solid #E8E8EA', padding: '0 14px', fontSize: isMobile ? '15px' : '14px', color: '#414143',
    outline: 'none', boxSizing: 'border-box', backgroundColor: '#FFFFFF',
  }
  const labelStyle = { fontSize: '14px', fontWeight: '600', color: '#141415', display: 'block', marginBottom: '6px' }

  return (
    <div style={{ backgroundColor: '#F5F4F0', minHeight: '100vh' }}>
      {showSuccess && <SuccessBanner message="Your event has been created successfully 🎉" onDone={() => navigate('/my-uploads')} />}

      <div style={{ maxWidth: '1440px', margin: '0 auto' }}><Navbar /></div>

      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: isMobile ? '20px 20px 60px' : '32px 100px 80px 100px' }}>

        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center', justifyContent: 'space-between', gap: isMobile ? '14px' : 0, marginBottom: isMobile ? '24px' : '40px' }}>
          <h1 style={{ fontSize: isMobile ? '26px' : '40px', fontWeight: '700', color: '#141415', margin: 0 }}>Create Event</h1>
          <button onClick={handleUploadClick}
            style={{ height: isMobile ? '46px' : '40px', padding: '0 24px', borderRadius: '8px', border: 'none', backgroundColor: '#0097FF', color: '#FFFFFF', fontSize: '14px', fontWeight: '600', cursor: 'pointer', width: isMobile ? '100%' : 'auto' }}>
            Save and Upload Event
          </button>
        </div>

        <div style={{ maxWidth: '540px', margin: '0 auto' }}>

          {!flyerPreview ? (
            <div onClick={() => fileInputRef.current?.click()} onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}
              style={{ width: '100%', height: isMobile ? '170px' : '200px', borderRadius: '12px', border: `2px dashed ${errors.flyer ? '#AE2012' : '#C7C7CA'}`, backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginBottom: '24px', gap: '8px' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#A5A5AA" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#414143', margin: 0 }}>Upload Event design</p>
              <p style={{ fontSize: '12px', color: '#A5A5AA', margin: 0, textAlign: 'center', padding: '0 20px' }}>Click to choose file or drag and drop the file here.<br />File can be jpg, png. File not more than 5MB</p>
              {errors.flyer && <p style={{ fontSize: '12px', color: '#AE2012', margin: 0 }}>{errors.flyer}</p>}
            </div>
          ) : (
            <div style={{ position: 'relative', marginBottom: '24px' }}
              onMouseEnter={() => !isMobile && setShowImageMenu(true)} onMouseLeave={() => !isMobile && setShowImageMenu(false)}
              onClick={() => isMobile && setShowImageMenu(!showImageMenu)}>
              <img src={flyerPreview} alt="Flyer" style={{ width: '100%', borderRadius: '12px', display: 'block', maxHeight: isMobile ? '260px' : '300px', objectFit: 'contain', backgroundColor: '#F3F3F4' }} />
              {showImageMenu && (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 10 }}>
                  <button onClick={(e) => { e.stopPropagation(); setShowFullImage(true) }}
                    style={{ padding: '8px 20px', borderRadius: '8px', backgroundColor: '#0097FF', color: '#FFFFFF', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap' }}>+ View Image</button>
                  <button onClick={(e) => { e.stopPropagation(); replaceInputRef.current?.click() }}
                    style={{ padding: '8px 20px', borderRadius: '8px', backgroundColor: '#FFFFFF', color: '#414143', border: '1px solid #E8E8EA', cursor: 'pointer', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap' }}>← Replace Image</button>
                  <button onClick={(e) => { e.stopPropagation(); setFlyer(null); setFlyerPreview(null) }}
                    style={{ padding: '8px 20px', borderRadius: '8px', backgroundColor: '#FFFFFF', color: '#AE2012', border: '1px solid #AE2012', cursor: 'pointer', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap' }}>🗑 Delete Image</button>
                </div>
              )}
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" style={{ display: 'none' }} onChange={(e) => handleFlyer(e.target.files[0])} />
          <input ref={replaceInputRef} type="file" accept="image/jpeg,image/png" style={{ display: 'none' }} onChange={(e) => handleFlyer(e.target.files[0])} />

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Event Title *</label>
            <input type="text" placeholder="Enter event title" maxLength={50} value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              style={{ ...inputStyle, borderColor: errors.title ? '#AE2012' : '#E8E8EA' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              {errors.title && <span style={{ fontSize: '12px', color: '#AE2012' }}>{errors.title}</span>}
              <span style={{ fontSize: '11px', color: '#A5A5AA', marginLeft: 'auto' }}>{form.title.length}/50</span>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Event Description</label>
            <textarea placeholder="Write event description..." maxLength={200} value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} rows={4}
              style={{ width: '100%', borderRadius: '8px', border: '1px solid #E8E8EA', padding: '10px 14px', fontSize: isMobile ? '15px' : '14px', color: '#414143', outline: 'none', boxSizing: 'border-box', resize: 'none', fontFamily: 'inherit' }} />
            <div style={{ textAlign: 'right' }}><span style={{ fontSize: '11px', color: '#A5A5AA' }}>{form.description.length}/200</span></div>
          </div>

          <div style={{ marginBottom: '16px', position: 'relative' }}>
            <label style={labelStyle}>Event Type *</label>
            <button onClick={() => setShowTypeFlyout(!showTypeFlyout)}
              style={{ ...inputStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderColor: errors.eventType ? '#AE2012' : '#E8E8EA' }}>
              <span style={{ color: form.eventType ? '#414143' : '#A5A5AA' }}>
                {form.eventType ? (eventTypes.find((t) => t.label === form.eventType)?.icon + ' ' + form.eventType) : 'Select Event Type'}
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7E7E82" strokeWidth="2" style={{ transform: showTypeFlyout ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {errors.eventType && <span style={{ fontSize: '12px', color: '#AE2012', display: 'block', marginTop: '4px' }}>{errors.eventType}</span>}
            {showTypeFlyout && (
              <div style={{ position: isMobile ? 'fixed' : 'absolute', top: isMobile ? undefined : '76px', bottom: isMobile ? 0 : undefined, left: 0, right: isMobile ? 0 : undefined, width: '100%', borderRadius: isMobile ? '20px 20px 0 0' : '12px', backgroundColor: '#FFFFFF', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', padding: '8px', zIndex: 200, maxHeight: isMobile ? '55vh' : '240px', overflowY: 'auto' }}>
                <p style={{ fontSize: '12px', fontWeight: '600', color: '#7E7E82', padding: '4px 8px', margin: '0 0 4px 0' }}>Select Event Type</p>
                {eventTypes.map((type) => (
                  <div key={type.label} onClick={() => { setForm((prev) => ({ ...prev, eventType: type.label })); setShowTypeFlyout(false) }}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 10px', borderRadius: '8px', cursor: 'pointer' }}>
                    <span style={{ fontSize: '14px', color: '#414143' }}>{type.icon} {type.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Event Venue Type *</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '12px' }}>
              {['physical', 'online', 'both'].map((v) => (
                <button key={v} onClick={() => setForm((prev) => ({ ...prev, venueType: v }))}
                  style={{ height: isMobile ? '42px' : '40px', borderRadius: '8px', border: `1px solid ${form.venueType === v ? '#0097FF' : '#E8E8EA'}`, backgroundColor: form.venueType === v ? '#EFF9FF' : '#FFFFFF', color: form.venueType === v ? '#0097FF' : '#59595C', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
                  {v === 'physical' ? 'Physical' : v === 'online' ? 'Online' : 'Both'}
                </button>
              ))}
            </div>
            {(form.venueType === 'physical' || form.venueType === 'both') && (
              <div style={{ marginBottom: '8px' }}>
                <input type="text" placeholder="E.g Ikoyi Beach, Lagos" value={form.address}
                  onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                  style={{ ...inputStyle, borderColor: errors.address ? '#AE2012' : '#E8E8EA' }} />
                {errors.address && <span style={{ fontSize: '12px', color: '#AE2012', display: 'block', marginTop: '4px' }}>{errors.address}</span>}
              </div>
            )}
            {(form.venueType === 'online' || form.venueType === 'both') && (
              <div>
                <input type="text" placeholder="Enter registration or online link" value={form.onlineLink}
                  onChange={(e) => setForm((prev) => ({ ...prev, onlineLink: e.target.value }))}
                  style={{ ...inputStyle, borderColor: errors.onlineLink ? '#AE2012' : '#E8E8EA' }} />
                {errors.onlineLink && <span style={{ fontSize: '12px', color: '#AE2012', display: 'block', marginTop: '4px' }}>{errors.onlineLink}</span>}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>No of Event Days *</label>
            <select value={form.eventDays} onChange={(e) => setForm((prev) => ({ ...prev, eventDays: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="one">A day Event</option>
              <option value="multiple">More than one day</option>
              <option value="everyday">Everyday</option>
            </select>
          </div>

          {form.eventDays !== 'everyday' && (
            <div style={{ marginBottom: '16px' }}>
              {form.eventDays === 'one' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={labelStyle}>Date *</label>
                    <input type="date" value={form.date} onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Time *</label>
                    <input type="time" value={form.time} onChange={(e) => setForm((prev) => ({ ...prev, time: e.target.value }))} style={inputStyle} />
                  </div>
                </div>
              ) : (
                <div>
                  <label style={labelStyle}>Date Range *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
                    <input type="date" value={form.date} onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))} style={inputStyle} />
                    <span style={{ color: '#7E7E82', fontSize: '14px', textAlign: 'center' }}>→</span>
                    <input type="date" value={form.dateRange} onChange={(e) => setForm((prev) => ({ ...prev, dateRange: e.target.value }))} style={inputStyle} />
                  </div>
                  <label style={labelStyle}>Time Range *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '8px', alignItems: 'center' }}>
                    <input type="time" value={form.time} onChange={(e) => setForm((prev) => ({ ...prev, time: e.target.value }))} style={inputStyle} />
                    <span style={{ color: '#7E7E82', fontSize: '14px', textAlign: 'center' }}>→</span>
                    <input type="time" value={form.timeEnd} onChange={(e) => setForm((prev) => ({ ...prev, timeEnd: e.target.value }))} style={inputStyle} />
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Event Fee</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              {['free', 'paid'].map((f) => (
                <button key={f} onClick={() => setForm((prev) => ({ ...prev, fee: f }))}
                  style={{ height: isMobile ? '38px' : '36px', padding: '0 20px', borderRadius: '8px', border: `1px solid ${form.fee === f ? '#0097FF' : '#E8E8EA'}`, backgroundColor: form.fee === f ? '#EFF9FF' : '#FFFFFF', color: form.fee === f ? '#0097FF' : '#59595C', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
                  {f === 'free' ? '🆓 Free' : '💰 Paid'}
                </button>
              ))}
            </div>
            {form.fee === 'paid' && (
              <input type="text" placeholder="Enter ticket price e.g ₦2,000" value={form.feeAmount}
                onChange={(e) => setForm((prev) => ({ ...prev, feeAmount: e.target.value }))} style={inputStyle} />
            )}
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={labelStyle}>Tags * (1–3 tags)</label>
            <div style={{ position: 'relative' }}>
              <input type="text" placeholder="Type a tag and press Enter, or pick from suggestions" value={tagInput}
                onChange={(e) => handleTagInput(e.target.value)}
                onFocus={() => { handleTagInput(tagInput); setShowTagSuggestions(true) }}
                onBlur={() => setTimeout(() => setShowTagSuggestions(false), 200)}
                onKeyDown={(e) => { if (e.key === 'Enter' && tagInput.trim() && form.tags.length < 3) { e.preventDefault(); addTag(tagInput.trim()) } }}
                style={{ ...inputStyle, borderColor: errors.tags ? '#AE2012' : '#E8E8EA' }} />
              {showTagSuggestions && tagSuggestions.length > 0 && (
                <div style={{ position: 'absolute', top: '48px', left: 0, width: '100%', backgroundColor: '#FFFFFF', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', padding: '8px', zIndex: 100 }}>
                  <p style={{ fontSize: '11px', color: '#A5A5AA', margin: '0 0 6px 4px' }}>Suggestions — {form.tags.length} of 3 selected</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {tagSuggestions.map((tag) => (
                      <button key={tag} onClick={() => addTag(tag)} disabled={form.tags.length >= 3}
                        style={{ padding: '4px 12px', borderRadius: '9999px', border: '1px solid #E8E8EA', backgroundColor: '#F9F9F9', fontSize: '12px', color: '#414143', cursor: form.tags.length >= 3 ? 'not-allowed' : 'pointer', opacity: form.tags.length >= 3 ? 0.5 : 1 }}>
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {form.tags.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                {form.tags.map((tag) => (
                  <div key={tag} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 12px', borderRadius: '9999px', backgroundColor: '#EFF9FF', border: '1px solid #0097FF' }}>
                    <span style={{ fontSize: '12px', color: '#0097FF', fontWeight: '500' }}>{tag}</span>
                    <button onClick={() => removeTag(tag)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0097FF', padding: 0, lineHeight: 1, fontSize: '16px' }}>×</button>
                  </div>
                ))}
              </div>
            )}
            {errors.tags && <span style={{ fontSize: '12px', color: '#AE2012', display: 'block', marginTop: '6px' }}>{errors.tags}</span>}
          </div>

          <button onClick={handleUploadClick} disabled={loading}
            style={{ width: isMobile ? '100%' : 'auto', height: '52px', padding: '0 40px', borderRadius: '10px', border: 'none', backgroundColor: loading ? '#C7C7CA' : '#0097FF', color: '#FFFFFF', fontSize: '16px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Uploading...' : 'Upload Event'}
          </button>
        </div>
      </div>

      {showFullImage && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '24px' : 0 }} onClick={() => setShowFullImage(false)}>
          <img src={flyerPreview} alt="Flyer" style={{ maxWidth: isMobile ? '100%' : '80vw', maxHeight: '80vh', borderRadius: '12px', objectFit: 'contain' }} />
        </div>
      )}

      {showUploadConfirm && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '0 24px' : 0 }}>
          <div style={{ width: isMobile ? '100%' : '420px', backgroundColor: '#FFFFFF', borderRadius: '16px', padding: isMobile ? '24px' : '32px', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#141415', marginBottom: '8px' }}>You are uploading {form.title}</h3>
            <p style={{ fontSize: '14px', color: '#7E7E82', marginBottom: '24px' }}>Are you sure you want to upload this event?</p>
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column-reverse' : 'row', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setShowUploadConfirm(false)} style={{ height: '40px', padding: '0 20px', borderRadius: '8px', border: '1px solid #E8E8EA', backgroundColor: '#FFFFFF', fontSize: '14px', color: '#414143', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleConfirmUpload} style={{ height: '40px', padding: '0 20px', borderRadius: '8px', border: 'none', backgroundColor: '#0097FF', color: '#FFFFFF', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Upload</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateEvent