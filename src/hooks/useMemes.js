import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export function useMemes(category = null) {
  const [memes, setMemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchMemes()
  }, [category])

  const fetchMemes = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('memes')
        .select('*')
        .order('created_at', { ascending: false })

      if (category && category !== 'All Memes') {
        query = query.eq('category', category)
      }

      const { data, error } = await query
      if (error) throw error
      setMemes(data || [])
    } catch (err) {
      setError(err.message)
      setMemes([])
    }
    setLoading(false)
  }

  const uploadMeme = async (memeData, imageFile) => {
    try {
      let imageUrl = ''
      if (imageFile) {
        const fileName = `memes/${Date.now()}-${imageFile.name}`
        const { error: uploadError } = await supabase.storage
          .from('meme-images')
          .upload(fileName, imageFile)
        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('meme-images')
          .getPublicUrl(fileName)
        imageUrl = urlData.publicUrl
      }

      const { data, error } = await supabase
        .from('memes')
        .insert([{ ...memeData, image_url: imageUrl }])
        .select()

      if (error) throw error
      setMemes((prev) => [data[0], ...prev])
      return { success: true, data: data[0] }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  return { memes, loading, error, uploadMeme, refetch: fetchMemes }
}