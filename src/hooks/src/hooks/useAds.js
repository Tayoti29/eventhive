import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export function useAds(page, slot) {
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const fetchAds = async () => {
      setLoading(true)
      try {
        let query = supabase.from('ads').select('*').eq('page', page).eq('is_active', true)
        if (slot) query = query.eq('slot', slot)
        const { data, error } = await query.order('created_at', { ascending: false })
        if (active) {
          setAds(error || !data ? [] : data.map((a) => ({
            id: a.id, src: a.media_url, type: a.media_type, link: a.link_url || '',
            width: a.width, height: a.height,
          })))
        }
      } catch { if (active) setAds([]) }
      if (active) setLoading(false)
    }
    fetchAds()
    return () => { active = false }
  }, [page, slot])

  return { ads, loading }
}