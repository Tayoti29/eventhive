import { useState } from 'react'

const faqs = [
  {
    id: '01',
    question: 'Who is EventHive for?',
    answer: 'EventHive is for everyone — event organizers who want to reach a wider audience, and event lovers who want to discover exciting events happening around them. Whether you attend concerts, tech summits, religious gatherings or sports events, EventHive has something for you.',
  },
  {
    id: '02',
    question: 'How do I create and upload an event?',
    answer: 'Simply click the "Create Event" button on the navbar, fill in your event details including title, description, date, location, category and upload your event flyer. Your event will be live and visible to thousands of users immediately.',
  },
  {
    id: '03',
    question: 'Is EventHive free to use?',
    answer: 'Yes! Creating an account, uploading events, browsing events and registering for free events is completely free. Premium features for organizers may be introduced in the future.',
  },
  {
    id: '04',
    question: 'How do I register for an event?',
    answer: 'Click on any event card to view its full details. If the organizer has provided a registration link, you will find a "Register Now" button that takes you directly to their registration page.',
  },
  {
    id: '05',
    question: 'Can I save events to view later?',
    answer: 'Absolutely! Click the heart icon on any event card to save it. All your saved events will be available in your Saved section so you never miss out.',
  },
  {
    id: '06',
    question: 'What is the Memes section?',
    answer: 'The Memes section is a fun space where users can upload, view, download and suggest captions for memes. It keeps the EventHive community engaged and entertained between events.',
  },
  {
    id: '07',
    question: 'Can I write and publish blogs on EventHive?',
    answer: 'Yes! Any registered user can write and publish blog posts on EventHive. Share your event experiences, tips, stories and insights with the entire community.',
  },
]

function FAQSection() {
  const [openId, setOpenId] = useState(null)

  const toggle = (id) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <section
      style={{
        backgroundColor: '#FFFFFF',
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '80px 100px',
        minHeight: '1185px',
      }}
    >
      {/* Header */}
      <div className="text-center" style={{ marginBottom: '48px' }}>
        <h2
          style={{
            fontSize: '60px',
            lineHeight: '72px',
            fontWeight: '700',
            color: '#141415',
          }}
        >
          Frequently Asked Questions
        </h2>
      </div>

      {/* FAQ Items */}
      <div>
        {faqs.map((faq) => {
          const isOpen = openId === faq.id
          return (
            <div
              key={faq.id}
              style={{
                borderTop: '1px solid #DEDEE0',
                backgroundColor: isOpen ? '#F6FBFF' : '#FFFFFF',
                transition: 'background-color 0.2s ease',
              }}
            >
              {/* Question Row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '24px 0',
                  gap: '40px',
                  cursor: 'pointer',
                }}
                onClick={() => toggle(faq.id)}
              >
                {/* Number */}
                <span
                  style={{
                    fontSize: '24px',
                    lineHeight: '32px',
                    fontWeight: '400',
                    color: '#59595C',
                    minWidth: '48px',
                  }}
                >
                  {faq.id}
                </span>

                {/* Question Text */}
                <span
                  style={{
                    flex: 1,
                    fontSize: '32px',
                    lineHeight: '39px',
                    fontWeight: '700',
                    color: '#141415',
                  }}
                >
                  {faq.question}
                </span>

                {/* Toggle Button */}
                <button
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '9999px',
                    backgroundColor: isOpen ? '#00253D' : '#0097FF',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  {isOpen ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                      stroke="white" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                      stroke="white" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="12" y1="5" x2="12" y2="19"/>
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  )}
                </button>
              </div>

              {/* Answer Dropdown */}
              {isOpen && (
                <div style={{ paddingLeft: '88px', paddingBottom: '24px', paddingRight: '88px' }}>
                  <p
                    style={{
                      fontSize: '24px',
                      lineHeight: '32px',
                      fontWeight: '400',
                      color: '#7E7E82',
                    }}
                  >
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          )
        })}

        {/* Last border */}
        <div style={{ borderTop: '1px solid #DEDEE0' }} />
      </div>
    </section>
  )
}

export default FAQSection