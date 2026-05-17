import type { Movie } from '../types'
import { MovieCard } from './MovieCard'

interface Props {
  movies: Movie[]
  searched: boolean
}

export function SearchResults({ movies, searched }: Props) {
  if (!searched) return null
  if (movies.length === 0) return <p className="empty">No results found.</p>

  return (
    <div className="movie-grid">
      {movies.map(movie => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  )
}
