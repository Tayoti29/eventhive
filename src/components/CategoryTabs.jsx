import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const allCategories = [
  { label: 'All Events',  icon: '🌐' },
  { label: 'Concert',     icon: '🎵' },
  { label: 'Religion',    icon: '⛪' },
  { label: 'Education',   icon: '📚' },
  { label: 'Politics',    icon: '🏛️' },
  { label: 'Science',     icon: '🔬' },
  { label: 'Tech',        icon: '💻' },
  { label: 'Sports',      icon: '⚽' },
  { label: 'Food',        icon: '🍔' },
  { label: 'Fashion',     icon: '👗' },
  { label: 'Business',    icon: '💼' },
  { label: 'Arts',        icon: '🎨' },
  { label: 'Health',      icon: '❤️' },
]

const subCategories = {
  'All Events': ['All'],
  Concert:   ['All', 'December', 'Davido', 'Lagos', 'Wizkid', 'Burna Boy', 'Abuja'],
  Religion:  ['All', 'Church', 'Mosque', 'Crusade', 'Revival', 'Prayer'],
  Education: ['All', 'Workshop', 'Seminar', 'Conference', 'Training', 'Bootcamp'],
  Politics:  ['All', 'Campaign', 'Debate', 'Rally', 'Forum'],
  Science:   ['All', 'Research', 'Innovation', 'Tech Fair', 'Exhibition'],
  Tech:      ['All', 'Hackathon', 'Startup', 'AI', 'Web3', 'Design'],
  Sports:    ['All', 'Football', 'Basketball', 'Tennis', 'Athletics'],
  Food:      ['All', 'Festival', 'Tasting', 'Competition', 'Street Food'],
  Fashion:   ['All', 'Runway', 'Exhibition', 'Pop-up', 'Awards'],
  Business:  ['All', 'Networking', 'Pitch Night', 'Masterclass', 'Summit'],
  Arts:      ['All', 'Exhibition', 'Performance', 'Workshop', 'Auction'],
  Health:    ['All', 'Wellness', 'Fitness', 'Mental Health', 'Medical'],
}

const tabs = ['Events', 'Blog', 'Memes']

function CategoryTabs({ category, onSubCategorySelect, onCategoryChange }) {
  const [activeTab, setActiveTab] = useState('Events')
  const [activePill, setActivePill] = useState('All')
  const [showFlyout, setShowFlyout] = useState(false)
  const flyoutRef = useRef(null)
  const navigate = useNavigate()

  const pills = subCategories[category] || ['All']

  useEffect(() => {
    setActivePill('All')
  }, [category])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (flyoutRef.current && !flyoutRef.current.contains(e.target)) {
        setShowFlyout(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleTabClick = (tab) => {
    if (tab === activeTab) {
      setShowFlyout(!showFlyout)
    } else {
      setActiveTab(tab)
      setShowFlyout(false)
      if (tab === 'Blog') navigate('/blog')
      if (tab === 'Memes') navigate('/memes')
    }
  }

  const handleCategorySelect = (cat) => {
    setShowFlyout(false)
    setActivePill('All')
    // Stay on same page, just update category via parent
    if (onCategoryChange) onCategoryChange(cat)
  }

  const handlePillClick = (pill) => {
    setActivePill(pill)
    if (onSubCategorySelect) onSubCategorySelect(pill)
  }

  return (
    <div style={{ backgroundColor: '#FFFFFF', width: '100%' }}>

      {/* Tabs Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '32px',
          position: 'relative',
          borderBottom: '1px solid #E8E8EA',
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab
          return (
            <div
              key={tab}
              onClick={() => handleTabClick(tab)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '16px 0',
                cursor: 'pointer',
                borderBottom: isActive ? '2px solid #141415' : '2px solid transparent',
                marginBottom: '-1px',
              }}
            >
              <span
                style={{
                  fontSize: '14px',
                  lineHeight: '20px',
                  fontWeight: '500',
                  color: isActive ? '#141415' : '#59595C',
                }}
              >
                {tab === 'Events' ? category : tab}
              </span>

              {isActive && (
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="#141415" strokeWidth="2" strokeLinecap="round"
                  style={{
                    transform: showFlyout ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              )}
            </div>
          )
        })}

        {/* Flyout Dropdown */}
        {showFlyout && (
          <div
            ref={flyoutRef}
            style={{
              position: 'absolute',
              top: '56px',
              left: '0',
              width: '200px',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              padding: '16px 8px',
              zIndex: 100,
            }}
          >
            <p
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#141415',
                padding: '0 8px',
                marginBottom: '12px',
              }}
            >
              Select from categories
            </p>

            {/* Scrollable list — 6 visible then scroll */}
            <div
              style={{
                maxHeight: '252px',
                overflowY: 'scroll',
                overflowX: 'hidden',
                scrollbarWidth: 'thin',
                scrollbarColor: '#C7C7CA #F3F3F4',
              }}
            >
              {allCategories.map((cat) => {
                const isSelected = cat.label === category
                return (
                  <div
                    key={cat.label}
                    onClick={() => handleCategorySelect(cat.label)}
                    style={{
                      width: '100%',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '0 8px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? '#F3F3F4' : 'transparent',
                      marginBottom: '4px',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = '#F9F9F9'
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <span style={{ fontSize: '16px', lineHeight: 1 }}>{cat.icon}</span>
                    <span
                      style={{
                        fontSize: '14px',
                        color: isSelected ? '#141415' : '#59595C',
                        fontWeight: isSelected ? '500' : '400',
                      }}
                    >
                      {cat.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Pills Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          paddingTop: '16px',
          paddingBottom: '16px',
          flexWrap: 'wrap',
        }}
      >
        {pills.map((pill) => {
          const isActive = activePill === pill
          return (
            <button
              key={pill}
              onClick={() => handlePillClick(pill)}
              style={{
                height: '36px',
                padding: '0 16px',
                borderRadius: '9999px',
                border: '1px solid #E8E8EA',
                backgroundColor: isActive ? '#0097FF' : '#F9F9F9',
                color: isActive ? '#FFFFFF' : '#7E7E82',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
            >
              {pill}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default CategoryTabs