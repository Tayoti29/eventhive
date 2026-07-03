import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext({})

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for mock user in sessionStorage
    const mockUserStr = sessionStorage.getItem('mockUser')
    if (mockUserStr) {
      try {
        const mockUser = JSON.parse(mockUserStr)
        // Fix broken UUID from old sessions
        if (!mockUser.id || mockUser.id.startsWith('mock-')) {
          mockUser.id = generateUUID()
          sessionStorage.setItem('mockUser', JSON.stringify(mockUser))
        }
        setUser(mockUser)
      } catch (e) {
        sessionStorage.removeItem('mockUser')
      }
    }

    // Try real Supabase auth
    const initSupabase = async () => {
      try {
        const { supabase } = await import('../supabaseClient')
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
          setUser(session.user)
          sessionStorage.removeItem('mockUser')
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
            setUser(session.user)
            sessionStorage.removeItem('mockUser')
          } else {
            const mock = sessionStorage.getItem('mockUser')
            if (!mock) setUser(null)
          }
        })

        setLoading(false)
        return () => subscription.unsubscribe()
      } catch (err) {
        console.log('Supabase auth unavailable, mock mode active')
        setLoading(false)
      }
    }

    initSupabase()
  }, [])

  // Call this after login — creates a valid UUID mock user
  const setMockUser = (email) => {
    // Check if registration data exists to use real name
    const regDataStr = sessionStorage.getItem('registrationData')
    const regData = regDataStr ? JSON.parse(regDataStr) : null

    const fullName = regData
      ? regData.firstName + ' ' + regData.lastName
      : email.split('@')[0]

    const mockUser = {
      id: generateUUID(),
      email,
      user_metadata: {
        full_name: fullName,
        first_name: regData?.firstName || email.split('@')[0],
        last_name: regData?.lastName || '',
        username: regData?.username || '',
        country: regData?.country || '',
        state: regData?.state || '',
        city: regData?.city || '',
        avatar_url: null,
      },
    }
    sessionStorage.setItem('mockUser', JSON.stringify(mockUser))
    setUser(mockUser)
    return mockUser
  }

  // Call this after profile edit to update avatar in navbar immediately
  const updateUserAvatar = (avatarUrl) => {
    if (!user) return
    const updated = {
      ...user,
      user_metadata: {
        ...user.user_metadata,
        avatar_url: avatarUrl,
      },
    }
    // Update sessionStorage if mock user
    const mockUserStr = sessionStorage.getItem('mockUser')
    if (mockUserStr) {
      sessionStorage.setItem('mockUser', JSON.stringify(updated))
    }
    // Also save to dbProfile sessionStorage for navbar to read
    const dbProfileStr = sessionStorage.getItem('dbProfile')
    const dbProfile = dbProfileStr ? JSON.parse(dbProfileStr) : {}
    sessionStorage.setItem('dbProfile', JSON.stringify({ ...dbProfile, avatar_url: avatarUrl }))
    setUser(updated)
  }

  return (
    <AuthContext.Provider value={{ user, loading, setUser, setMockUser, updateUserAvatar }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)