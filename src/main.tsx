import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import { Nav } from './components/Nav.tsx'
import App from './App.tsx'
import { MovieDetailPage } from './pages/MovieDetailPage.tsx'
import { FavouritesPage } from './pages/FavouritesPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/movie/:id" element={<MovieDetailPage />} />
        <Route path="/favourites" element={<FavouritesPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
