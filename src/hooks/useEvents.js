import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export function useEvents(category = null) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchEvents()
  }, [category])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })

      if (category && category !== 'All Events') {
        query = query.eq('category', category)
      }

      const { data, error } = await query
      if (error) throw error
      setEvents(data || [])
    } catch (err) {
      setError(err.message)
      setEvents([])
    }
    setLoading(false)
  }

  const uploadEvent = async (eventData, flyerFile) => {
    try {
      // Upload image to Supabase Storage
      let imageUrl = ''
      if (flyerFile) {
        const fileName = `events/${Date.now()}-${flyerFile.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('event-images')
          .upload(fileName, flyerFile)
        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('event-images')
          .getPublicUrl(fileName)
        imageUrl = urlData.publicUrl
      }

      // Save event to database
      const { data, error } = await supabase
        .from('events')
        .insert([{ ...eventData, image_url: imageUrl }])
        .select()

      if (error) throw error
      setEvents((prev) => [data[0], ...prev])
      return { success: true, data: data[0] }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  return { events, loading, error, uploadEvent, refetch: fetchEvents }
}