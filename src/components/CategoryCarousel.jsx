import { useRef } from 'react'

const categories = [
  { label: 'Religion',    image: 'https://picsum.photos/seed/religion/296/296' },
  { label: 'Concert',     image: 'https://picsum.photos/seed/concert/296/296' },
  { label: 'Education',   image: 'https://picsum.photos/seed/education/296/296' },
  { label: 'Politics',    image: 'https://picsum.photos/seed/politics/296/296' },
  { label: 'Science',     image: 'https://picsum.photos/seed/science/296/296' },
  { label: 'Tech',        image: 'https://picsum.photos/seed/tech/296/296' },
  { label: 'Sports',      image: 'https://picsum.photos/seed/sports/296/296' },
  { label: 'Food',        image: 'https://picsum.photos/seed/food/296/296' },
  { label: 'Fashion',     image: 'https://picsum.photos/seed/fashion/296/296' },
  { label: 'Business',    image: 'https://picsum.photos/seed/business/296/296' },
  { label: 'Arts',        image: 'https://picsum.photos/seed/arts/296/296' },
  { label: 'Health',      image: 'https://picsum.photos/seed/health/296/296' },
]

function ArrowButton({ direction, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '36px',
        height: '36px',
        borderRadius: '9999px',
        backgroundColor: '#F9F9F9',
        border: '1px solid #F3F3F4',
        padding: '5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        cursor: 'pointer',
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="#7E7E82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {direction === 'left'
          ? <polyline points="15 18 9 12 15 6"/>
          : <polyline points="9 18 15 12 9 6"/>
        }
      </svg>
    </button>
  )
}

function CategoryCarousel({ onSelect }) {
  const scrollRef = useRef(null)

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -320 : 320,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <ArrowButton direction="left" onClick={() => scroll('left')} />
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          gap: '16px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {categories.map((cat) => (
          <div
            key={cat.label}
            onClick={() => onSelect && onSelect(cat.label)}
            style={{
              position: 'relative',
              flexShrink: 0,
              width: '296px',
              height: '296px',
              borderRadius: '16px',
              overflow: 'hidden',
              cursor: 'pointer',
            }}
          >
            <img
              src={cat.image}
              alt={cat.label}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: '#000C14',
                opacity: 0.4,
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  fontSize: '32px',
                  lineHeight: '39px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  textAlign: 'center',
                }}
              >
                {cat.label}
              </span>
            </div>
          </div>
        ))}
      </div>
      <ArrowButton direction="right" onClick={() => scroll('right')} />
    </div>
  )
}

export default CategoryCarousel