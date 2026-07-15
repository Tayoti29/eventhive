import { useRef, useEffect } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'

const testimonials = [
  { id: 1, text: "EventHive helped me discover the most amazing tech events in Lagos. I never miss out on networking opportunities anymore!", name: "Olawale Adeyemi", role: "Co-Founder, Maxim", avatar: "https://i.pravatar.cc/40?img=1", bg: "#F0FDF4", border: "#BBF7D0" },
  { id: 2, text: "EventHive is exactly the kind of platform I needed. Found my first business conference here and it changed everything.", name: "Stefan Ginev", role: "Developer, Toptal", avatar: "https://i.pravatar.cc/40?img=2", bg: "#FFFFFF", border: "#DEDEE0" },
  { id: 3, text: "Looks great! I registered for 3 events in one sitting. The experience is smooth and very easy to use.", name: "Igor aka Momentum", role: "CMO, Paralect", avatar: "https://i.pravatar.cc/40?img=3", bg: "#F5F5EF", border: "#D4D4C8" },
  { id: 4, text: "I uploaded my first event and got over 200 registrations in 48 hours. EventHive is a game changer!", name: "Amaka Obi", role: "Event Organizer, Lagos", avatar: "https://i.pravatar.cc/40?img=4", bg: "#FFFBEB", border: "#FDE68A" },
  { id: 5, text: "The memes section is so funny and relatable. I spend time there every day. Best platform for event lovers.", name: "Tunde Fashola", role: "Content Creator", avatar: "https://i.pravatar.cc/40?img=5", bg: "#EFF9FF", border: "#CBEAFF" },
  { id: 6, text: "Found my church event listed here and invited 50 friends through the platform. Absolutely love it!", name: "Blessing Nwosu", role: "Pastor, Grace Chapel", avatar: "https://i.pravatar.cc/40?img=6", bg: "#FFFFFF", border: "#DEDEE0" },
  { id: 7, text: "EventHive blogs are so insightful. I read one every morning. Great content from real people.", name: "Chidinma Eze", role: "Blogger, ThinkSpace", avatar: "https://i.pravatar.cc/40?img=7", bg: "#F0FDF4", border: "#BBF7D0" },
]

const allTestimonials = [...testimonials, ...testimonials]

function TestimonialSection() {
  const scrollRef = useRef(null)
  const isPaused = useRef(false)
  const animationId = useRef(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const step = () => {
      if (!isPaused.current) {
        el.scrollLeft += 0.8
        if (el.scrollLeft >= el.scrollWidth / 2) el.scrollLeft = 0
      }
      animationId.current = requestAnimationFrame(step)
    }
    animationId.current = requestAnimationFrame(step)
    const pause = () => { isPaused.current = true }
    const resume = () => { isPaused.current = false }
    el.addEventListener('mouseenter', pause)
    el.addEventListener('mouseleave', resume)
    el.addEventListener('touchstart', pause)
    el.addEventListener('touchend', resume)
    return () => {
      cancelAnimationFrame(animationId.current)
      el.removeEventListener('mouseenter', pause)
      el.removeEventListener('mouseleave', resume)
      el.removeEventListener('touchstart', pause)
      el.removeEventListener('touchend', resume)
    }
  }, [])

  return (
    <section style={{ maxWidth: '1440px', margin: '0 auto', padding: isMobile ? '48px 0' : '80px 0', overflow: 'hidden' }}>
      <div className="text-center mb-10" style={{ paddingLeft: isMobile ? '20px' : '100px', paddingRight: isMobile ? '20px' : '100px' }}>
        <h2 className="font-bold text-grey-800" style={{ fontSize: isMobile ? '26px' : '60px', lineHeight: isMobile ? '32px' : '72px' }}>
          What our clients say
        </h2>
        <p className="text-grey-500 mt-2" style={{ fontSize: isMobile ? '13px' : undefined }}>
          See what our users are saying about their experiences.
        </p>
      </div>

      <div
        ref={scrollRef}
        style={{
          display: 'flex', gap: isMobile ? '14px' : '24px', overflowX: 'scroll',
          paddingLeft: isMobile ? '20px' : '100px', paddingRight: isMobile ? '20px' : 0,
          paddingBottom: '16px', scrollbarWidth: 'none', msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {allTestimonials.map((t, i) => (
          <div
            key={`${t.id}-${i}`}
            style={{
              width: isMobile ? '260px' : '426px', minHeight: isMobile ? '180px' : '214px',
              flexShrink: 0, borderRadius: isMobile ? '12px' : '16px', padding: isMobile ? '14px' : '16px',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              backgroundColor: t.bg, border: `1px solid ${t.border}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: isMobile ? '10px' : '12px' }}>
              <img src={t.avatar} alt={t.name} style={{ width: isMobile ? '32px' : '40px', height: isMobile ? '32px' : '40px', borderRadius: '9999px', objectFit: 'cover', flexShrink: 0 }} />
              <p style={{ fontSize: isMobile ? '13px' : '16px', lineHeight: isMobile ? '19px' : '24px', color: '#141415' }}>{t.text}</p>
            </div>
            <div style={{ paddingLeft: isMobile ? '42px' : '52px' }}>
              <p style={{ fontSize: isMobile ? '13px' : '16px', lineHeight: isMobile ? '18px' : '22px', fontWeight: '500', color: '#141415' }}>{t.name}</p>
              <p style={{ fontSize: isMobile ? '12px' : '14px', lineHeight: isMobile ? '16px' : '20px', color: '#59595C' }}>{t.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TestimonialSection