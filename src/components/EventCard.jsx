import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useIsMobile } from '../hooks/useIsMobile'

function getDaysLabel(eventDate) {
  const today = new Date()
  const date = new Date(eventDate)
  const diffDays = Math.ceil((date - today) / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays > 1) return `${diffDays} days to go`
  return null
}

function EventCard({ event }) {
  const [liked, setLiked] = useState(false)
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const daysLabel = getDaysLabel(event.date)

  return (
    <div
      className="bg-white cursor-pointer flex flex-col"
      style={{
        width: '100%',
        maxWidth: isMobile ? 'none' : '296px',
        borderRadius: isMobile ? '12px' : '16px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}
      onClick={() => navigate(`/events/${event.id}`)}
    >
      {/* Event Image */}
      <div className="relative" style={{ width: '100%', aspectRatio: '1 / 1' }}>
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" style={{ display: 'block' }} />

        {daysLabel && (
          <div
            className="absolute flex items-center justify-center"
            style={{
              top: isMobile ? '8px' : '12px', right: isMobile ? '8px' : '12px',
              height: isMobile ? '20px' : '24px', padding: isMobile ? '0 8px' : '0 10px',
              borderRadius: '9999px', backgroundColor: '#FFF6DE', border: '1px solid #FED86E',
            }}
          >
            <span style={{ color: '#B88700', fontSize: isMobile ? '10px' : '12px', fontWeight: '500', whiteSpace: 'nowrap' }}>
              {daysLabel}
            </span>
          </div>
        )}
      </div>

      {/* Card Bottom */}
      <div className="flex items-center justify-between bg-white" style={{ height: isMobile ? '52px' : '64px', padding: isMobile ? '0 8px' : '0 12px', flexShrink: 0 }}>
        <div className="flex items-center overflow-hidden" style={{ gap: isMobile ? '6px' : '8px' }}>
          <img src={event.avatar} alt={event.organizer}
            className="flex-shrink-0"
            style={{ width: isMobile ? '24px' : '32px', height: isMobile ? '24px' : '32px', borderRadius: '9999px', objectFit: 'cover' }} />
          <div className="flex flex-col overflow-hidden">
            <span className="font-medium text-grey-900 truncate" style={{ fontSize: isMobile ? '11px' : '13px', lineHeight: isMobile ? '15px' : '18px' }}>
              {event.title}
            </span>
            <span className="text-grey-500 truncate" style={{ fontSize: isMobile ? '9px' : '11px', lineHeight: isMobile ? '13px' : '16px' }}>
              {event.location} • {event.date}
            </span>
          </div>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); setLiked(!liked) }}
          className="flex-shrink-0 ml-2"
        >
          {liked ? (
            <svg width={isMobile ? '17' : '22'} height={isMobile ? '17' : '22'} viewBox="0 0 24 24" fill="#D90870">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          ) : (
            <svg width={isMobile ? '17' : '22'} height={isMobile ? '17' : '22'} viewBox="0 0 24 24" fill="none" stroke="#D90870" strokeWidth="2">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}

export default EventCard