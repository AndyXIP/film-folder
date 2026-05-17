import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router'
import { SearchResults } from './components/SearchResults'
import { searchMovies } from './api/tmdb'
import type { Movie } from './types'
import './App.css'

function App() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''

  const [input, setInput] = useState(query)
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!query) return
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        setMovies(await searchMovies(query))
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
    <div id="app">
      <h1>Film Folder</h1>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Search for a movie..."
          className="search-input"
        />
        <button type="submit" className="search-btn" disabled={loading}>
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <SearchResults movies={movies} searched={!!query && !loading} />
    </div>
  )
}

export default App
