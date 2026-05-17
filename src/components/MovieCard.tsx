import type { Movie } from '../types'

interface Props {
  movie: Movie
}

export function MovieCard({ movie }: Props) {
  return (
    <div className="movie-card">
      {movie.poster_path ? (
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="movie-poster"
        />
      ) : (
        <div className="movie-poster no-poster">No image</div>
      )}
      <div className="movie-info">
        <h2>{movie.title}</h2>
        <div className="movie-meta">
          <span>{movie.release_date?.slice(0, 4) ?? '—'}</span>
          <span className="rating">★ {movie.vote_average.toFixed(1)}</span>
        </div>
        <p className="overview">{movie.overview || 'No description available.'}</p>
      </div>
    </div>
  )
}
