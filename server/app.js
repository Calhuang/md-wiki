const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')

const indexRouter = require('./routes/index')
const entryRouter = require('./routes/entry')
const imagesRouter = require('./routes/images')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

/**
 * CORS policy
 */
const allowedOrigins = [
  'http://localhost:8081',
]

app.use(cors({
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true)
    }
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not '
                + 'allow access from the specified Origin:'
                + ` ${origin}`
      return callback(new Error(msg), false)
    }
    return callback(null, true)
  },
}))

app.use('/', indexRouter)
app.use('/entry', entryRouter)
app.use('/images', imagesRouter)

module.exports = app
