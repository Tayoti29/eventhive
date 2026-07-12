import { useState, useEffect } from 'react'

// Returns true when the viewport is at or below 576px — matches your mobile breakpoint.
// Automatically updates on resize, so every screen size adjusts live.
export function useIsMobile(breakpoint = 576) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= breakpoint : false
  )

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= breakpoint)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [breakpoint])

  return isMobile
}

// For pages that need more than just mobile/desktop (e.g. a tablet layout at 1024px too)
export function useScreenSize() {
  const [size, setSize] = useState('desktop')

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth
      if (w <= 576) setSize('mobile')
      else if (w <= 1024) setSize('tablet')
      else setSize('desktop')
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return size
}