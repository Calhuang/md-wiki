/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-console */
const express = require('express')
const multer = require('multer')

const storage = multer.memoryStorage()
// -- 5mb image size limit
// -- would use disk storage for less memory consumption
const upload = multer({ storage, limits: { fileSize: 6000000 } })
const router = express.Router()
const db = require('../db/db')

/* GET an object with image */
router.get('/:id', (req, res) => {
  const { id } = req.params

  let query = 'SELECT * '
  query += 'FROM Images '
  query += 'WHERE id = ?'

  db.get(query, id, (error, row) => {
    if (error) {
      console.log(error)
      res.status(400).json({ sucess: false })
    } else {
      res.status(200).json({ success: true, ...row })
    }
  })
})

/* GET an image asset */
router.get('/i/:id', (req, res) => {
  const { id } = req.params

  let query = 'SELECT * '
  query += 'FROM Images '
  query += 'WHERE id = ?'

  db.get(query, id, (error, row) => {
    if (error) {
      console.log(error)
      res.status(400).json({ sucess: false })
    } else {
      const img = Buffer.from(row.data, 'base64')
      res.set({
        'Content-Type': 'image/*',
      }).end(img)
    }
  })
})

/* POST an image. */
router.post('/', upload.single('image'), (req, res) => {
  let query = 'INSERT INTO Images (name, data) '
  query += 'VALUES (?, ?)'

  const image = req.file

  db.run(query, [image.originalname, image.buffer], function (error) {
    if (error) {
      console.log(error)
      res.status(400).json({ sucess: false })
    } else {
      console.log(`Image added: "${image.originalname}"`)
      res.status(200).json({ success: true, cb: this.lastID })
    }
  })
})

module.exports = router
