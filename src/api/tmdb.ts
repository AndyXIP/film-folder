import type { Movie } from '../types'

const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL
const TOKEN = import.meta.env.VITE_TMDB_API_READ_TOKEN

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  accept: 'application/json',
}

export async function searchMovies(query: string): Promise<Movie[]> {
  const res = await fetch(
    `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=1`,
    { headers },
  )
  if (!res.ok) throw new Error('Search failed')
  const data = await res.json()
  return data.results as Movie[]
}

export async function getMovieDetails(id: string): Promise<MovieDetail> {
  const res = await fetch(`${BASE_URL}/movie/${id}?language=en-US`, { headers })
  if (!res.ok) throw new Error('Failed to fetch movie details')
  return res.json() as Promise<MovieDetail>
}

export interface MovieDetail {
  id: number
  title: string
  tagline: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  runtime: number
  vote_average: number
  vote_count: number
  genres: { id: number; name: string }[]
  status: string
}
