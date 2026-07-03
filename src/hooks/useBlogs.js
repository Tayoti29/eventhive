import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export function useBlogs(category = null) {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBlogs()
  }, [category])

  const fetchBlogs = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false })

      if (category && category !== 'All Blogs') {
        query = query.eq('category', category)
      }

      const { data, error } = await query
      if (error) throw error
      setBlogs(data || [])
    } catch (err) {
      setError(err.message)
      setBlogs([])
    }
    setLoading(false)
  }

  const uploadBlog = async (blogData, coverFile) => {
    try {
      let imageUrl = ''
      if (coverFile) {
        const fileName = `blogs/${Date.now()}-${coverFile.name}`
        const { error: uploadError } = await supabase.storage
          .from('blog-covers')
          .upload(fileName, coverFile)
        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('blog-covers')
          .getPublicUrl(fileName)
        imageUrl = urlData.publicUrl
      }

      const { data, error } = await supabase
        .from('blogs')
        .insert([{ ...blogData, cover_image_url: imageUrl }])
        .select()

      if (error) throw error
      setBlogs((prev) => [data[0], ...prev])
      return { success: true, data: data[0] }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  return { blogs, loading, error, uploadBlog, refetch: fetchBlogs }
}