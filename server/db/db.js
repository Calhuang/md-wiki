/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-console */

/**
 * Initialize the db
 */

const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database(':memory:', ((err) => {
  if (err) {
    console.log(err)
    return
  }
  console.log('Connected to database.')
}))

/**
 * Init schemas and setup main page
 */


const mainPageSetup = () => {
  let query = 'INSERT INTO Entries (title, md, lastModifiedOn) '
  query += 'VALUES (?, ?, ?)'

  const md = 'This is the main page. Feel free to edit.\n\n* [[Frogs]]\n \n* [[Cats]]\n\n* [[Dogs]]\n\n'
  const title = 'Main Page'
  const date = new Date()
  const lastModifiedOn = date.toISOString()

  db.run(query, ['Main Page', md, lastModifiedOn], function (error) {
    if (error) {
      console.log(error)
    } else {
      console.log(`Post added: "${title}"`)
    }
  })
}

const entrySchema = require('./schema/entry')
const imagesSchema = require('./schema/images')

db.exec(entrySchema, (err) => {
  if (err) {
    console.log(err)
  }
  mainPageSetup()
})

db.exec(imagesSchema, (err) => {
  if (err) {
    console.log(err)
  }
})

process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.log(err.message)
      return console.error(err.message)
    }
    console.log('Close the database connection.')
    return false
  })
})

/**
 * Nodemon before restart hook
 */

process.once('SIGUSR2', () => {
  console.log('nodemon: closing db')
  db.close((err) => {
    if (err) {
      return console.error(err.message)
    }
    console.log('Close the database connection.')
    return false
  })
})

module.exports = db
