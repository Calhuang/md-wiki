/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-console */
const express = require('express')

const router = express.Router()
const db = require('../db/db')

/* GET a wiki page */
router.get('/:id', (req, res) => {
  const index = req.params.id

  let query = 'SELECT title, md, createdOn, lastModifiedOn '
  query += 'FROM Entries '
  query += 'WHERE title = ?'

  db.get(query, index, (error, row) => {
    if (error) {
      console.log(error)
      res.status(400).json({ sucess: false })
    } else {
      res.status(200).json({ success: true, ...row })
    }
  })
})

/* GET a wiki page and its history. */
router.get('/history/:id', (req, res) => {
  const index = req.params.id

  let query = 'SELECT title, md, createdOn, lastModifiedOn, changelog '
  query += 'FROM Entries '
  query += 'WHERE title = ? '
  query += 'UNION '
  query += 'SELECT title, md, createdOn, lastModifiedOn, changelog '
  query += 'FROM Entries_Log '
  query += 'WHERE title = ? '
  query += 'ORDER BY lastModifiedOn DESC'

  db.all(query, [index, index], (error, row) => {
    if (error) {
      console.log(error)
      res.status(400).json({ sucess: false })
    } else {
      res.status(200).json({ success: true, ...row })
    }
  })
})

/* POST a wiki page. */
router.post('/', (req, res) => {
  let query = 'INSERT INTO Entries (title, md, lastModifiedOn) '
  query += 'VALUES (?, ?, ?)'

  const date = new Date()
  const lastModifiedOn = date.toISOString()

  db.run(query, [req.body.title, req.body.md, lastModifiedOn], function (error) {
    if (error) {
      console.log(error)
      res.status(400).json({ sucess: false })
    } else {
      console.log(`Post added: "${req.body.title}"`)
      res.status(200).json({ success: true, cb: req.body.title })
    }
  })
})

/* UPDATE a wiki page. */
router.put('/:id', (req, res) => {
  const index = req.params.id

  const date = new Date()
  const lastModifiedOn = date.toISOString()

  let query = 'UPDATE Entries '
  query += 'SET title = ?, md = ?, lastModifiedOn = ?, changelog = ? '
  query += 'WHERE title = ?'

  const data = [req.body.title, req.body.md, lastModifiedOn, req.body.changelog, index]

  db.run(query, data, function (error) {
    if (error) {
      console.log(error)
      res.status(400).json({ sucess: false })
    } else {
      res.status(200).json({ success: true })
    }
  })
})

/* SEARCH for a wiki page. */
router.get('/search/:term', (req, res) => {
  const searchTerm = `%${req.params.term}%`

  let query = 'SELECT * '
  query += 'FROM Entries '
  query += 'WHERE md LIKE ? OR title LIKE ?'

  db.all(query, [searchTerm, searchTerm], function (error, rows) {
    if (error) {
      console.log(error)
      res.status(400).json({ sucess: false })
    } else {
      res.status(200).json({ success: true, cb: rows })
    }
  })
})

module.exports = router
