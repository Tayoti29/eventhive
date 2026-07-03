import { createContext, useContext, useState } from 'react'

const SaveContext = createContext({})

export function SaveProvider({ children }) {
  const [savedBoxes, setSavedBoxes] = useState(() => {
    try { return JSON.parse(localStorage.getItem('savedBoxes') || '[]') } catch { return [] }
  })

  const createBox = (type, name, description, item) => {
    const existingBoxes = savedBoxes.filter((b) => b.type === type)
    if (existingBoxes.length >= 3) return null
    const boxName = name.trim() || `My ${type.charAt(0).toUpperCase() + type.slice(1)} Box`
    const boxDesc = description.trim() || `My box of sweet memories`
    const newBox = {
      id: Date.now(),
      type,
      name: boxName,
      description: boxDesc,
      items: [{ ...item, savedAt: new Date().toLocaleDateString() }],
      createdAt: new Date().toLocaleDateString(),
    }
    const updated = [...savedBoxes, newBox]
    setSavedBoxes(updated)
    localStorage.setItem('savedBoxes', JSON.stringify(updated))
    return newBox.id
  }

  const addToBox = (boxId, item) => {
    const updated = savedBoxes.map((box) => {
      if (box.id === boxId) {
        const exists = box.items.find((i) => i.id === item.id)
        if (exists) return box
        return { ...box, items: [...box.items, { ...item, savedAt: new Date().toLocaleDateString() }] }
      }
      return box
    })
    setSavedBoxes(updated)
    localStorage.setItem('savedBoxes', JSON.stringify(updated))
  }

  const removeFromBox = (boxId, itemId) => {
    const updated = savedBoxes.map((box) =>
      box.id === boxId ? { ...box, items: box.items.filter((i) => i.id !== itemId) } : box
    )
    setSavedBoxes(updated)
    localStorage.setItem('savedBoxes', JSON.stringify(updated))
  }

  const deleteBox = (boxId) => {
    const updated = savedBoxes.filter((b) => b.id !== boxId)
    setSavedBoxes(updated)
    localStorage.setItem('savedBoxes', JSON.stringify(updated))
  }

  const isSaved = (itemId, type) =>
    savedBoxes.some((box) => box.type === type && box.items.some((i) => i.id === itemId))

  const getBoxesByType = (type) => savedBoxes.filter((b) => b.type === type)

  return (
    <SaveContext.Provider value={{ savedBoxes, createBox, addToBox, removeFromBox, deleteBox, isSaved, getBoxesByType }}>
      {children}
    </SaveContext.Provider>
  )
}

export const useSave = () => useContext(SaveContext)