import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
  const daysLabel = getDaysLabel(event.date)

  return (
    <div
      className="bg-white cursor-pointer flex flex-col"
      style={{ width: '296px', height: '362px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
      onClick={() => navigate(`/events/${event.id}`)}
    >
      {/* Event Image */}
      <div className="relative" style={{ width: '296px', height: '298px', flexShrink: 0 }}>
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />

        {/* Days Badge */}
        {daysLabel && (
          <div
            className="absolute top-3 right-3 flex items-center justify-center"
            style={{ height: '24px', padding: '0 10px', borderRadius: '9999px', backgroundColor: '#FFF6DE', border: '1px solid #FED86E' }}
          >
            <span style={{ color: '#B88700', fontSize: '12px', fontWeight: '500', whiteSpace: 'nowrap' }}>
              {daysLabel}
            </span>
          </div>
        )}
      </div>

      {/* Card Bottom */}
      <div className="flex items-center justify-between bg-white px-3" style={{ height: '64px', flexShrink: 0 }}>
        <div className="flex items-center gap-2 overflow-hidden">
          <img src={event.avatar} alt={event.organizer}
            className="flex-shrink-0"
            style={{ width: '32px', height: '32px', borderRadius: '9999px', objectFit: 'cover' }} />
          <div className="flex flex-col overflow-hidden">
            <span className="font-medium text-grey-900 truncate" style={{ fontSize: '13px', lineHeight: '18px' }}>
              {event.title}
            </span>
            <span className="text-grey-500 truncate" style={{ fontSize: '11px', lineHeight: '16px' }}>
              {event.location} • {event.date} • {event.days} day{event.days > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Like Button */}
        <button
          onClick={(e) => { e.stopPropagation(); setLiked(!liked) }}
          className="flex-shrink-0 ml-2"
        >
          {liked ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#D90870">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D90870" strokeWidth="2">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}

export default EventCard