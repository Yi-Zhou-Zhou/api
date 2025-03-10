import express, { json } from 'express'
const app = express()
import movies from './data/movies.json' with {type: 'json'}
import { randomUUID } from 'node:crypto'
import cors from 'cors'
import { validateMovie, validatePatch } from './schemas/movies.js'

app.disable('x-powered-by')
app.use(json())
app.use(cors())

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' })
})

app.get('/movies', (req, res) => {
  const { genre } = req.query
  if (genre) {
    return res.json(movies.filter(mov => {
      const toLowerCaseGenres = mov.genre.map(genre => {
        return genre.toLowerCase()
      })
      return toLowerCaseGenres.includes(genre.toLowerCase())
    }))
  }
  return res.json({ message: movies })
})

app.get('/movies/:id', (req, res) => {
  const id = req.params.id

  const movie = movies.find(movie => {
    return movie.id === id
  })
  if (movie) {
    return res.json(movie)
  }
  res.status(404).json({ message: 'Movie not found' })
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)

  if (!result.success) {
    return res.status(400).json({ message: JSON.parse(result.error.message) })
  }

  const newMovie = {
    id: randomUUID(),
    ...result.data
  }

  movies.push(newMovie)
  res.status(201).json(newMovie)
})

app.patch('/movies/:id', (req, res) => {
  const { id } = req.params
  const result = validatePatch(req.body)

  const movieIndex = movies.findIndex((movie) => {
    return movie.id === id
  })

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data
  }

  movies[movieIndex] = updateMovie

  return res.json(updateMovie)
})
app.listen(8000, () => {
  console.log('Server is running on http://localhost:8000')
})
