import { useState, useRef } from 'react'
import type { FavouriteList } from '../hooks/useFavourites'
import './FavouritesCard.css'

interface Props {
  list: FavouriteList
  isSelected: boolean
  onSelect: () => void
  onRename: (name: string) => void
  onRemove: (movieId: number) => void
  onDelete: () => void
}

export function FavouritesCard({ list, isSelected, onSelect, onRename, onRemove, onDelete }: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(list.name)
  const inputRef = useRef<HTMLInputElement>(null)

  function startEditing(e: React.MouseEvent) {
    e.stopPropagation()
    setDraft(list.name)
    setEditing(true)
    setTimeout(() => inputRef.current?.select(), 0)
  }

  function commitEdit() {
    const name = draft.trim() || list.name
    onRename(name)
    setDraft(name)
    setEditing(false)
  }

  return (
    <div className={`favourites-card ${isSelected ? 'selected' : ''}`} onClick={onSelect}>
      <div className="favourites-header">
        {editing ? (
          <input
            ref={inputRef}
            className="favourites-name-input"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={e => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditing(false) }}
            onClick={e => e.stopPropagation()}
            autoFocus
          />
        ) : (
          <h2 className="favourites-name" onClick={startEditing} title="Click to rename">
            {list.name}
          </h2>
        )}
        <button
          className="list-delete-btn"
          onClick={e => { e.stopPropagation(); onDelete() }}
          aria-label={`Delete ${list.name}`}
          title="Delete list"
        >
          ×
        </button>
      </div>
      <div className="favourites-grid">
        {list.slots.map((movie, i) => (
          <div key={i} className={`fav-slot ${movie ? 'filled' : 'empty'}`}>
            {movie ? (
              <>
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="fav-poster"
                  />
                ) : (
                  <div className="fav-poster fav-no-poster">{movie.title}</div>
                )}
                <div className="fav-overlay">
                  <span className="fav-movie-title">{movie.title}</span>
                </div>
                <button
                  className="fav-remove"
                  onClick={e => { e.stopPropagation(); onRemove(movie.id) }}
                  aria-label={`Remove ${movie.title}`}
                >
                  ×
                </button>
              </>
            ) : (
              <span className="fav-empty-icon">+</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
