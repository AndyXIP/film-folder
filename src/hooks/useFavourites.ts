import { useState, useEffect } from 'react'
import type { Movie } from '../types'

const STORAGE_KEY = 'film-folder-favourites-v2'
const SLOTS = 4

export interface FavouriteList {
  id: string
  name: string
  slots: (Movie | null)[]
}

function makeList(name: string): FavouriteList {
  return { id: crypto.randomUUID(), name, slots: Array(SLOTS).fill(null) }
}

export function useFavourites() {
  const [lists, setLists] = useState<FavouriteList[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) return JSON.parse(stored) as FavouriteList[]
    } catch { /* ignore */ }
    return [makeList('My List')]
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists))
  }, [lists])

  function addList() {
    setLists(prev => [...prev, makeList(`List ${prev.length + 1}`)])
  }

  function renameList(id: string, name: string) {
    setLists(prev => prev.map(l => l.id === id ? { ...l, name } : l))
  }

  function addMovie(listId: string, movie: Movie) {
    setLists(prev => prev.map(l => {
      if (l.id !== listId) return l
      const idx = l.slots.findIndex(m => m === null)
      if (idx === -1) return l
      const slots = [...l.slots]
      slots[idx] = movie
      return { ...l, slots }
    }))
  }

  function removeMovie(listId: string, movieId: number) {
    setLists(prev => prev.map(l =>
      l.id !== listId ? l : { ...l, slots: l.slots.map(m => m?.id === movieId ? null : m) }
    ))
  }

  return { lists, addList, renameList, addMovie, removeMovie }
}
