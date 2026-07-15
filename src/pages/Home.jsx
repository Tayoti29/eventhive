import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import heroImg from '../assets/hero.png'
import EventCard from '../components/EventCard'
import CategoryCarousel from '../components/CategoryCarousel'
import TestimonialSection from '../components/TestimonialSection'
import SubscribeSection from '../components/SubscribeSection'
import FAQSection from '../components/FAQSection'
import Footer from '../components/Footer'
import { useIsMobile } from '../hooks/useIsMobile'

const words = [
  { text: 'Find',   color: '#FFB5DA' },
  { text: 'Attend', color: '#FFB900' },
  { text: 'Create', color: '#0097FF' },
]

const sampleEvents = [
  { id: 1,  title: 'Managing Gen Z In...', location: 'Unilag, Lagos',       date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), days: 1, image: 'https://picsum.photos/seed/event1/296/298',  avatar: 'https://i.pravatar.cc/32?img=1',  organizer: 'Ilegbejie Doris' },
  { id: 2,  title: 'Zero To Hero',         location: 'Online',              date: new Date(Date.now() + 0 * 24 * 60 * 60 * 1000).toISOString(), days: 2, image: 'https://picsum.photos/seed/event2/296/298',  avatar: 'https://i.pravatar.cc/32?img=2',  organizer: 'Jane Ololade' },
  { id: 3,  title: 'Embracing Change',     location: 'Abuja',               date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), days: 1, image: 'https://picsum.photos/seed/event3/296/298',  avatar: 'https://i.pravatar.cc/32?img=3',  organizer: 'Strengths Africa' },
  { id: 4,  title: 'Nurses Hangout',       location: 'Beach, Lagos',        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), days: 1, image: 'https://picsum.photos/seed/event4/296/298',  avatar: 'https://i.pravatar.cc/32?img=4',  organizer: 'Unilag, Lagos' },
]

const trendingEvents = [
  { id: 5,  title: 'Lagos Tech Summit',      location: 'Victoria Island, Lagos', date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), days: 2, image: 'https://picsum.photos/seed/trend1/296/298',  avatar: 'https://i.pravatar.cc/32?img=5',  organizer: 'TechHub Lagos' },
  { id: 6,  title: 'Afrobeats Festival',     location: 'Eko Hotel, Lagos',       date: new Date(Date.now() + 0 * 24 * 60 * 60 * 1000).toISOString(), days: 1, image: 'https://picsum.photos/seed/trend2/296/298',  avatar: 'https://i.pravatar.cc/32?img=6',  organizer: 'Sound City' },
  { id: 7,  title: 'Business Masterclass',   location: 'Abuja',                  date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), days: 1, image: 'https://picsum.photos/seed/trend3/296/298',  avatar: 'https://i.pravatar.cc/32?img=7',  organizer: 'Growth Academy' },
  { id: 8,  title: 'Fashion Week 2026',      location: 'Ikeja, Lagos',           date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), days: 3, image: 'https://picsum.photos/seed/trend4/296/298',  avatar: 'https://i.pravatar.cc/32?img=8',  organizer: 'Style House' },
  { id: 9,  title: 'Health & Wellness Expo', location: 'Port Harcourt',          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), days: 1, image: 'https://picsum.photos/seed/trend5/296/298',  avatar: 'https://i.pravatar.cc/32?img=9',  organizer: 'WellnessNG' },
  { id: 10, title: 'Startup Pitch Night',    location: 'Yaba, Lagos',            date: new Date(Date.now() + 0 * 24 * 60 * 60 * 1000).toISOString(), days: 1, image: 'https://picsum.photos/seed/trend6/296/298',  avatar: 'https://i.pravatar.cc/32?img=10', organizer: 'StartupNG' },
  { id: 11, title: 'Gospel Concert',         location: 'National Stadium',       date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), days: 1, image: 'https://picsum.photos/seed/trend7/296/298',  avatar: 'https://i.pravatar.cc/32?img=11', organizer: 'Grace Music' },
  { id: 12, title: 'Art Exhibition 2026',    location: 'Ikoyi, Lagos',           date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), days: 2, image: 'https://picsum.photos/seed/trend8/296/298',  avatar: 'https://i.pravatar.cc/32?img=12', organizer: 'Art House NG' },
  { id: 13, title: 'Comedy Night Out',       location: 'Lekki, Lagos',           date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), days: 1, image: 'https://picsum.photos/seed/trend9/296/298',  avatar: 'https://i.pravatar.cc/32?img=13', organizer: 'Laugh Factory' },
  { id: 14, title: 'Food & Drink Festival',  location: 'Abuja',                  date: new Date(Date.now() + 0 * 24 * 60 * 60 * 1000).toISOString(), days: 2, image: 'https://picsum.photos/seed/trend10/296/298', avatar: 'https://i.pravatar.cc/32?img=14', organizer: 'FoodieNG' },
  { id: 15, title: 'Youth Leadership Forum', location: 'Ibadan',                 date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), days: 1, image: 'https://picsum.photos/seed/trend11/296/298', avatar: 'https://i.pravatar.cc/32?img=15', organizer: 'YouthRise' },
  { id: 16, title: 'Photography Workshop',   location: 'VI, Lagos',              date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), days: 1, image: 'https://picsum.photos/seed/trend12/296/298', avatar: 'https://i.pravatar.cc/32?img=16', organizer: 'LensNG' },
  { id: 17, title: 'Marathon Lagos 2026',    location: 'Lagos Island',           date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), days: 1, image: 'https://picsum.photos/seed/trend13/296/298', avatar: 'https://i.pravatar.cc/32?img=17', organizer: 'RunNG' },
  { id: 18, title: 'Women in Tech Summit',   location: 'Abuja',                  date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), days: 2, image: 'https://picsum.photos/seed/trend14/296/298', avatar: 'https://i.pravatar.cc/32?img=18', organizer: 'WomenTechNG' },
  { id: 19, title: 'Dance Championship',     location: 'Surulere, Lagos',        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), days: 1, image: 'https://picsum.photos/seed/trend15/296/298', avatar: 'https://i.pravatar.cc/32?img=19', organizer: 'DanceNG' },
  { id: 20, title: 'Science Fair 2026',      location: 'Enugu',                  date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), days: 2, image: 'https://picsum.photos/seed/trend16/296/298', avatar: 'https://i.pravatar.cc/32?img=20', organizer: 'ScienceNG' },
]

function AnimatedWord() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % words.length)
        setVisible(true)
      }, 300)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <span style={{ color: words[index].color, transition: 'opacity 300ms ease-out', opacity: visible ? 1 : 0, display: 'inline-block' }}>
      {words[index].text}
    </span>
  )
}

function Home() {
  const [searchText, setSearchText] = useState('')
  const [eventType, setEventType] = useState('')
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  const handleSearch = () => {
    navigate(`/search?q=${searchText}&type=${eventType}`)
  }

  return (
    <div className="bg-white">
      <Navbar />

      {/* ── HERO SECTION ── */}
      <section
        className="relative w-full flex items-center justify-center bg-blue-900"
        style={{ height: isMobile ? 'auto' : '604px', minHeight: isMobile ? '480px' : undefined, maxWidth: '1440px', margin: '0 auto', padding: isMobile ? '48px 0' : 0 }}
      >
        <img src={heroImg} alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-blue-900" style={{ opacity: 0.6 }} />
        <div
          className="relative z-10 flex flex-col items-center text-center"
          style={{ paddingLeft: isMobile ? '20px' : '100px', paddingRight: isMobile ? '20px' : '100px', width: '100%', boxSizing: 'border-box' }}
        >
          <h1 className="text-white font-bold" style={{ fontSize: isMobile ? '30px' : '60px', lineHeight: isMobile ? '38px' : '72px' }}>
            <AnimatedWord /> {isMobile ? 'unforgettable experiences near you.' : 'Unforgettable Experiences Near You'}
          </h1>
          <p style={{ color: '#FFFFFF', fontSize: isMobile ? '14px' : '20px', lineHeight: isMobile ? '20px' : '30px', marginTop: isMobile ? '12px' : '36px', opacity: isMobile ? 0.9 : 1 }}>
            Explore exciting events happening around you and never miss out on the fun.
          </p>

          {/* Search bar — compact single row on mobile, matches the mockup */}
          <div
            className="flex items-center bg-white rounded-lg overflow-hidden shadow-card"
            style={
              isMobile
                ? { width: '100%', maxWidth: '400px', height: '46px', marginTop: '24px' }
                : { width: '706px', height: '72px', marginTop: '40px' }
            }
          >
            <div
              className="flex items-center border-grey-200"
              style={
                isMobile
                  ? { gap: '4px', padding: '0 10px', minWidth: '100px', height: '100%', borderRight: '1px solid #E8E8EA', flexShrink: 0 }
                  : { gap: '8px', padding: '0 20px', minWidth: '200px', height: '100%', borderRight: '1px solid #E8E8EA' }
              }
            >
              <svg width={isMobile ? '14' : '18'} height={isMobile ? '14' : '18'} viewBox="0 0 24 24" fill="none" stroke="#414143" strokeWidth="2" style={{ flexShrink: 0 }}>
                <line x1="4" y1="6" x2="20" y2="6"/>
                <line x1="8" y1="12" x2="20" y2="12"/>
                <line x1="12" y1="18" x2="20" y2="18"/>
              </svg>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="text-grey-700 bg-transparent outline-none cursor-pointer"
                style={{ fontSize: isMobile ? '11px' : '15px', width: '100%' }}
              >
                <option value="">{isMobile ? 'Type' : 'Event Type'}</option>
                <option value="music">Music</option>
                <option value="tech">Tech</option>
                <option value="sports">Sports</option>
                <option value="food">Food</option>
                <option value="arts">Arts</option>
                <option value="business">Business</option>
                <option value="fashion">Fashion</option>
              </select>
            </div>
            <input
              type="text"
              placeholder={isMobile ? 'Search events' : 'Search for events'}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 text-grey-700 placeholder-grey-400 outline-none"
              style={{ height: '100%', padding: isMobile ? '0 10px' : '0 20px', fontSize: isMobile ? '12px' : '16px', minWidth: 0 }}
            />
            <button
              onClick={handleSearch}
              className="btn-primary flex items-center justify-center gap-2 flex-shrink-0"
              style={
                isMobile
                  ? { height: '100%', padding: '0 14px', borderRadius: 0 }
                  : { height: '100%', padding: '0 32px', borderRadius: '0 8px 8px 0' }
              }
            >
              <svg width={isMobile ? '14' : '18'} height={isMobile ? '14' : '18'} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <span style={{ fontSize: isMobile ? '11px' : undefined }}>Search</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── CATEGORY SECTION ── */}
      <section className="bg-white" style={{ maxWidth: '1440px', margin: '0 auto', padding: isMobile ? '48px 20px' : '80px 100px' }}>
        <div className="text-center mb-10">
          <h2 className="font-bold text-grey-800" style={{ fontSize: isMobile ? '28px' : '60px', lineHeight: isMobile ? '36px' : '72px' }}>Browse by Category</h2>
          <p className="text-grey-800 mt-2" style={{ fontSize: isMobile ? '14px' : undefined }}>Find events that match your interests</p>
        </div>
        <div style={isMobile ? { overflowX: 'auto', WebkitOverflowScrolling: 'touch' } : undefined}>
          <CategoryCarousel onSelect={(cat) => navigate(`/category?type=${cat}`)} />
        </div>
      </section>

      {/* ── RECENT UPLOADS SECTION ── */}
      <section className="bg-white" style={{ maxWidth: '1440px', margin: '0 auto', padding: isMobile ? '32px 20px' : '80px 100px' }}>
        <div className="text-center mb-10">
          <h2 className="font-bold text-grey-800" style={{ fontSize: isMobile ? '24px' : '60px', lineHeight: isMobile ? '32px' : '72px' }}>Recent Uploads</h2>
          <p className="text-grey-800 mt-2" style={{ fontSize: isMobile ? '13px' : undefined }}>Don't miss out on these must-attend events happening soon</p>
        </div>
        <div
          className="grid"
          style={isMobile
            ? { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }
            : { gridTemplateColumns: 'repeat(4, 296px)', gap: '24px', justifyContent: 'center' }
          }
        >
          {sampleEvents.map((event) => (<EventCard key={event.id} event={event} />))}
        </div>
      </section>

      {/* ── TRENDING EVENTS SECTION ── */}
      <section className="bg-white" style={{ maxWidth: '1440px', margin: '0 auto', padding: isMobile ? '32px 20px' : '80px 100px' }}>
        <div className="text-center mb-10">
          <h2 className="font-bold text-grey-800" style={{ fontSize: isMobile ? '24px' : '60px', lineHeight: isMobile ? '32px' : '72px' }}>Trending Events</h2>
          <p className="text-grey-800 mt-2" style={{ fontSize: isMobile ? '13px' : undefined }}>Check out the hottest upcoming events curated just for you.</p>
        </div>
        <div
          className="grid"
          style={isMobile
            ? { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }
            : { gridTemplateColumns: 'repeat(4, 296px)', gap: '24px', justifyContent: 'center' }
          }
        >
          {trendingEvents.map((event) => (<EventCard key={event.id} event={event} />))}
        </div>
      </section>

      <TestimonialSection />
      <SubscribeSection />
      <FAQSection />
      <Footer />
    </div>
  )
}

export default Home