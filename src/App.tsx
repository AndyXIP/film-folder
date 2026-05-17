import { useState } from 'react'
import { SearchResults } from './components/SearchResults'
import type { Movie } from './types'
import './App.css'

const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL
const TOKEN = import.meta.env.VITE_TMDB_API_READ_TOKEN

async function searchMovies(query: string): Promise<Movie[]> {
  const res = await fetch(
    `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=1`,
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        accept: 'application/json',
      },
    },
  )
  if (!res.ok) throw new Error('Search failed')
  const data = await res.json()
  return data.results as Movie[]
}

function App() {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  async function search() {
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    setSearched(true)
    try {
      const results = await searchMovies(query)
      setMovies(results)
    } catch {
      setError('Failed to fetch movies. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div id="app">
      <h1>Film Folder</h1>
      <form
        onSubmit={e => { e.preventDefault(); void search() }}
        className="search-form"
      >
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search for a movie..."
          className="search-input"
        />
        <button type="submit" className="search-btn" disabled={loading}>
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <SearchResults movies={movies} searched={searched && !loading} />
    </div>
  )
}

export default App
