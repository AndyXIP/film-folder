import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router'
import { FavouritesCard } from '../components/FavouritesCard'
import { useFavourites } from '../hooks/useFavourites'
import { searchMovies } from '../api/tmdb'
import type { Movie } from '../types'
import './FavouritesPage.css'

export function FavouritesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''

  const [input, setInput] = useState(query)
  const [results, setResults] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { lists, addList, renameList, addMovie, removeMovie } = useFavourites()
  const [selectedId, setSelectedId] = useState<string>(() => lists[0]?.id ?? '')

  const selectedList = lists.find(l => l.id === selectedId) ?? lists[0]
  const isFull = selectedList?.slots.every(m => m !== null) ?? false
  const selectedIds = new Set(selectedList?.slots.filter(Boolean).map(m => m!.id))

  useEffect(() => {
    ;(async () => {
      if (!query) { setResults([]); return }
      setLoading(true)
      setError(null)
      try {
        setResults(await searchMovies(query))
      } catch {
        setError('Failed to fetch movies. Please try again.')
      } finally {
        setLoading(false)
      }
    })()
  }, [query])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!input.trim()) return
    setSearchParams({ q: input.trim() })
  }

  return (
    <div id="fav-page">
      <div className="cards-row">
        {lists.map(list => (
          <FavouritesCard
            key={list.id}
            list={list}
            isSelected={list.id === selectedList?.id}
            onSelect={() => setSelectedId(list.id)}
            onRename={name => renameList(list.id, name)}
            onRemove={movieId => removeMovie(list.id, movieId)}
          />
        ))}
        <button className="add-list-btn" onClick={addList}>
          <span>+</span>
          New list
        </button>
      </div>

      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={`Search to add to "${selectedList?.name}"…`}
          className="search-input"
        />
        <button type="submit" className="search-btn" disabled={loading}>
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {error && <p className="fav-message error">{error}</p>}
      {isFull && results.length > 0 && (
        <p className="fav-message">"{selectedList?.name}" is full — remove a movie or select another list.</p>
      )}

      {results.length > 0 && (
        <div className="fav-results">
          {results.map(movie => {
            const added = selectedIds.has(movie.id)
            const disabled = isFull || added
            return (
              <button
                key={movie.id}
                className={`fav-result-card ${added ? 'added' : ''}`}
                onClick={() => addMovie(selectedList!.id, movie)}
                disabled={disabled}
                aria-label={`Add ${movie.title} to ${selectedList?.name}`}
              >
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                    alt={movie.title}
                    className="fav-result-poster"
                  />
                ) : (
                  <div className="fav-result-poster fav-result-no-poster" />
                )}
                <div className="fav-result-info">
                  <span className="fav-result-title">{movie.title}</span>
                  <span className="fav-result-year">{movie.release_date?.slice(0, 4) ?? '—'}</span>
                </div>
                {added && <span className="fav-result-check">✓</span>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
