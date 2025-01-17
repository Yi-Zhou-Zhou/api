const z = require('zod')

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Title must be a string',
    required_error: 'Title is required'
  }),
  year: z.number().int().positive().min(1900).max(2025),
  duration: z.number().int().positive(),
  director: z.string(),
  rate: z.number().min(0).max(5).default(5),
  poster: z.string().url({
    message: 'Poster must be a valid URL'
  }),
  genre: z.array(z.enum(['Drama', 'Action', 'Comedy', 'Thriller', 'Horror', 'Crime', 'Adventure', 'Fantasy', 'Animation', 'Sci-Fi', 'Romance', 'Mystery', 'Family', 'Biography', 'History', 'War', 'Music', 'Sport', 'Western', 'Documentary', 'Musical', 'Short', 'Adult', 'News', 'Talk-Show', 'Reality-TV', 'Game-Show', 'Film-Noir', 'Lifestyle', 'Experimental'],
    { required_error: 'Genre is required' }
  ))
})

function validateMovie (object) {
  return movieSchema.safeParse(object)
}

function validatePatch (object) {
  return movieSchema.partial().safeParse(object)
}

module.exports = {
  validateMovie,
  validatePatch
}
