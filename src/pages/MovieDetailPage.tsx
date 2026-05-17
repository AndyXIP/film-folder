import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { getMovieDetails } from '../api/tmdb'
import type { MovieDetail } from '../api/tmdb'
import './MovieDetailPage.css'

export function MovieDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [movie, setMovie] = useState<MovieDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    ;(async () => {
      setLoading(true)
      try {
        setMovie(await getMovieDetails(id))
      } catch {
        setError('Failed to load movie details.')
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  if (loading) return <div className="detail-state">Loading…</div>
  if (error) return <div className="detail-state error">{error}</div>
  if (!movie) return null

  const year = movie.release_date?.slice(0, 4)
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null

  return (
    <div className="detail-page">
      {movie.backdrop_path && (
        <div
          className="backdrop"
          style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})` }}
        />
      )}
      <div className="detail-content">
        <button onClick={() => navigate(-1)} className="back-link">← Back</button>
        <div className="detail-body">
          {movie.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="detail-poster"
            />
          )}
          <div className="detail-info">
            <h1>{movie.title}</h1>
            {movie.tagline && <p className="tagline">{movie.tagline}</p>}
            <div className="detail-meta">
              {year && <span>{year}</span>}
              {runtime && <span>{runtime}</span>}
              <span>★ {movie.vote_average.toFixed(1)} ({movie.vote_count.toLocaleString()})</span>
              <span>{movie.status}</span>
            </div>
            {movie.genres.length > 0 && (
              <div className="genres">
                {movie.genres.map(g => (
                  <span key={g.id} className="genre-tag">{g.name}</span>
                ))}
              </div>
            )}
            {movie.overview && (
              <>
                <h2>Overview</h2>
                <p className="detail-overview">{movie.overview}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
