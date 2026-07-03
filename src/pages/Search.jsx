import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// Sample data to search through
const allEvents = [
  { id: 1, type: 'event', title: 'Managing Gen Z In the Workplace', description: 'Instagram Live Session about managing Gen Z in corporate environments and training sessions', category: 'Education', image: 'https://picsum.photos/seed/event1/296/200', organizer: 'Ilegbejie Doris', date: 'Nov. 27' },
  { id: 2, type: 'event', title: 'Zero To Hero Training', description: 'A step by step guide to earning money using just your smartphone. Training and skill development', category: 'Business', image: 'https://picsum.photos/seed/event2/296/200', organizer: 'Jane Ololade', date: 'Mar. 21' },
  { id: 3, type: 'event', title: 'Embracing Change and Adaptability', description: 'The vital role of adaptability in navigating the evolving business landscape', category: 'Business', image: 'https://picsum.photos/seed/event3/296/200', organizer: 'Strengths Africa', date: 'Jul. 14' },
  { id: 4, type: 'event', title: 'Nurses Hangout', description: 'Beach activities, games, table tennis, beach volleyball, music and lots of fun', category: 'Health', image: 'https://picsum.photos/seed/event4/296/200', organizer: 'Unilag Lagos', date: 'Oct. 12' },
  { id: 5, type: 'event', title: 'Lagos Tech Summit', description: 'Technology summit bringing together tech leaders, startups and innovators in Lagos', category: 'Tech', image: 'https://picsum.photos/seed/event5/296/200', organizer: 'TechHub Lagos', date: 'Dec. 5' },
  { id: 6, type: 'event', title: 'Gospel Concert Night', description: 'An evening of praise, worship and gospel music with top Nigerian gospel artists', category: 'Concert', image: 'https://picsum.photos/seed/event6/296/200', organizer: 'Grace Music', date: 'Nov. 15' },
]

const allMemes = [
  { id: 101, type: 'meme', title: 'Monday Morning Vibes', description: 'When you finally understand the assignment on a Monday morning work day', category: 'Work Life', image: 'https://picsum.photos/seed/meme1/296/200', uploader: '@tunde_b' },
  { id: 102, type: 'meme', title: 'Nigerian Student Life', description: 'Me on Monday vs Friday. School stress is real for every Nigerian student', category: 'School', image: 'https://picsum.photos/seed/meme2/296/200', uploader: '@amaka_o' },
  { id: 103, type: 'meme', title: 'Business Meeting Energy', description: 'Nobody asked but here we are in another business meeting that could have been an email', category: 'Work Life', image: 'https://picsum.photos/seed/meme3/296/200', uploader: '@chidi_x' },
  { id: 104, type: 'meme', title: 'Naija Traffic Reality', description: 'Lagos traffic is giving everything. No stress allowed on this fine morning', category: 'Naija', image: 'https://picsum.photos/seed/meme4/296/200', uploader: '@blessing_n' },
]

const allBlogs = [
  { id: 201, type: 'blog', title: 'The Ultimate Guide to Virtual Events', description: 'How to Find, Attend, and Host Successful Online Events in the Modern Age of technology', category: 'Events', image: 'https://picsum.photos/seed/blog1/296/200', author: 'Adio Olataiye', date: 'Mar. 15, 2024' },
  { id: 202, type: 'blog', title: 'Top Event Trends of the Year', description: 'Stay Ahead with the Latest Event Trends and Innovations happening across Nigeria and Africa', category: 'Events', image: 'https://picsum.photos/seed/blog2/296/200', author: 'Jane Ololade', date: 'Feb. 20, 2024' },
  { id: 203, type: 'blog', title: 'Maximizing Your Networking Opportunities', description: 'Effective Strategies for Building Connections at Events, conferences and business training sessions', category: 'Business', image: 'https://picsum.photos/seed/blog3/296/200', author: 'Tunde Bashir', date: 'Jan. 10, 2024' },
  { id: 204, type: 'blog', title: 'Health and Wellness at Work', description: 'How to maintain your health and wellness during busy work schedules and office life', category: 'Health', image: 'https://picsum.photos/seed/blog4/296/200', author: 'Amaka Obi', date: 'Apr. 5, 2024' },
]

const allContent = [...allEvents, ...allMemes, ...allBlogs]

function SearchResultCard({ item }) {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()

  const handleClick = () => {
    if (item.type === 'event') navigate(`/events/${item.id}`)
    if (item.type === 'meme') navigate(`/memes/${item.id}`)
    if (item.type === 'blog') navigate(`/blog/${item.id}`)
  }

  const typeColors = {
    event: { bg: '#EFF9FF', color: '#007ACC', label: 'Event' },
    meme: { bg: '#FFF0F3', color: '#D90870', label: 'Meme' },
    blog: { bg: '#FFFCF4', color: '#B88700', label: 'Blog' },
  }
  const tc = typeColors[item.type]

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', backgroundColor: '#FFFFFF', boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.06)', transition: 'all 0.3s ease', transform: hovered ? 'translateY(-4px)' : 'translateY(0)' }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: '180px' }}>
        <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', top: '10px', left: '10px', padding: '3px 10px', borderRadius: '9999px', backgroundColor: tc.bg, border: `1px solid ${tc.color}` }}>
          <span style={{ fontSize: '11px', fontWeight: '600', color: tc.color }}>{tc.label}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '14px' }}>
        <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#141415', margin: '0 0 6px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</h4>
        <p style={{ fontSize: '13px', color: '#7E7E82', margin: '0 0 10px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '18px' }}>{item.description}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '12px', color: '#A5A5AA' }}>
            {item.organizer || item.uploader || item.author}
            {(item.date) ? ` • ${item.date}` : ''}
          </span>
          <span style={{ fontSize: '11px', color: tc.color, backgroundColor: tc.bg, padding: '2px 8px', borderRadius: '9999px' }}>{item.category}</span>
        </div>
      </div>
    </div>
  )
}

function Search() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [activeFilter, setActiveFilter] = useState('All')
  const [results, setResults] = useState([])

  const filters = ['All', 'Events', 'Memes', 'Blogs']

  useEffect(() => {
    if (initialQuery) performSearch(initialQuery)
  }, [initialQuery])

  const performSearch = (q) => {
    if (!q.trim()) { setResults([]); return }
    const lower = q.toLowerCase()
    const found = allContent.filter((item) =>
      item.title.toLowerCase().includes(lower) ||
      item.description.toLowerCase().includes(lower) ||
      item.category.toLowerCase().includes(lower)
    )
    setResults(found)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    performSearch(query)
    navigate(`/search?q=${encodeURIComponent(query)}`, { replace: true })
  }

  const filteredResults = activeFilter === 'All'
    ? results
    : results.filter((r) => r.type === activeFilter.toLowerCase().slice(0, -1))

  const getCategoryForQuery = () => {
    if (!query) return 'All Events'
    const eventMatch = allEvents.find((e) => e.category.toLowerCase().includes(query.toLowerCase()))
    return eventMatch?.category || 'All Events'
  }

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}><Navbar /></div>

      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '48px 100px 80px 100px' }}>

        {/* Search Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#141415', marginBottom: '20px' }}>
            {query ? `Search results for "${query}"` : 'Search EventHive'}
          </h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch}>
            <div style={{ display: 'flex', gap: '12px', maxWidth: '600px' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', padding: '0 16px', borderRadius: '10px', border: '1px solid #E8E8EA', backgroundColor: '#F9F9F9', height: '48px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A5A5AA" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input type="text" placeholder="Search events, memes, blogs..." value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  style={{ flex: 1, border: 'none', outline: 'none', fontSize: '15px', color: '#414143', backgroundColor: 'transparent' }} />
              </div>
              <button type="submit"
                style={{ height: '48px', padding: '0 24px', borderRadius: '10px', border: 'none', backgroundColor: '#0097FF', color: '#FFFFFF', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Filter Tabs */}
        {results.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', borderBottom: '1px solid #E8E8EA', paddingBottom: '0' }}>
            {filters.map((f) => {
              const count = f === 'All' ? results.length : results.filter((r) => r.type === f.toLowerCase().slice(0, -1)).length
              return (
                <button key={f} onClick={() => setActiveFilter(f)}
                  style={{ padding: '10px 20px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '500', color: activeFilter === f ? '#141415' : '#59595C', borderBottom: activeFilter === f ? '2px solid #141415' : '2px solid transparent', marginBottom: '-1px', transition: 'all 0.2s ease' }}>
                  {f} ({count})
                </button>
              )
            })}
          </div>
        )}

        {/* Results */}
        {query && results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#141415', marginBottom: '8px' }}>No results found</h3>
            <p style={{ fontSize: '16px', color: '#7E7E82' }}>Try searching with different keywords</p>
          </div>
        ) : !query ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#141415', marginBottom: '8px' }}>What are you looking for?</h3>
            <p style={{ fontSize: '16px', color: '#7E7E82' }}>Search for events, memes or blogs above</p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: '14px', color: '#7E7E82', marginBottom: '24px' }}>
              Found <strong style={{ color: '#141415' }}>{filteredResults.length}</strong> result{filteredResults.length !== 1 ? 's' : ''} {activeFilter !== 'All' ? `in ${activeFilter}` : ''}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
              {filteredResults.map((item) => (
                <SearchResultCard key={`${item.type}-${item.id}`} item={item} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Floating Button */}
      {results.length > 0 && (
        <div style={{ position: 'fixed', right: '32px', top: '50%', transform: 'translateY(-50%)', zIndex: 100 }}>
          <button
            onClick={() => navigate(`/category?type=${getCategoryForQuery()}`)}
            style={{ writing: 'vertical-rl', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '16px 12px', backgroundColor: '#0097FF', color: '#FFFFFF', border: 'none', borderRadius: '12px', cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,151,255,0.3)', fontSize: '12px', fontWeight: '600', lineHeight: '1.4', textAlign: 'center', maxWidth: '56px' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <span style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)', fontSize: '11px' }}>
              View All Related
            </span>
          </button>
        </div>
      )}

      <div style={{ maxWidth: '1440px', margin: '0 auto' }}><Footer /></div>
    </div>
  )
}

export default Search