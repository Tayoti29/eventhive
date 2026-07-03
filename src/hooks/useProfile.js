import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export function useProfile(userId) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userId) fetchProfile()
  }, [userId])

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      setProfile(data || null)
    } catch (err) {
      console.error('Profile fetch error:', err)
    }
    setLoading(false)
  }

  const updateProfile = async (updates) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert([{ user_id: userId, ...updates, updated_at: new Date().toISOString() }])
        .select()

      if (error) throw error
      setProfile(data[0])
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const updateAvatar = async (file) => {
    try {
      const fileName = `avatars/${userId}-${Date.now()}`
      const { error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(fileName, file, { upsert: true })
      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('event-images')
        .getPublicUrl(fileName)

      const avatarUrl = urlData.publicUrl
      await updateProfile({ avatar_url: avatarUrl })
      return { success: true, url: avatarUrl }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  return { profile, loading, updateProfile, updateAvatar, refetch: fetchProfile }
}