const express = require('express')
const app = express()
const port = 3000
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const defaultData = require('./defaultData')
const shortid = require('shortid')
const cors = require('cors')

const adapter = new FileSync('db.json')
const db = low(adapter)

app.use(cors())

db.defaults(defaultData).write()

const colors = [null, '#efa8e4', '#97e5ef', '#f6d198', '#77d8d8', '#f2ed6f']

const error = (res, status, text) => res.status(status).json(text).end()

app.use(express.json()) 

app.get('/list', (req, res) => {
  const list = db.get('list')
  res.send(list)
})

app.get('/list/:id', (req, res) => {
  const id = req.params.id
  const item = db.get('list').find({ id })
  if (!item) res.status(400).send('Bad Request')
  res.send(item)
})

app.post('/add', (req, res) => {
  if (!req.body.text) return error(res, 400, 'text attribute is required')

  const id = shortid.generate()
  const addedItem = { id, done: false, ...req.body }

  db.get('list').push(addedItem).write()
  res.send(addedItem)
})

app.put('/edit/:id', (req, res) => {
  const { id } = req.params
  const item = db.get('list').find({ id })

  if (!item.value()) error(res, 404, `Item with id (${id}) not found`)

  item.assign(req.body).write()
  res.send(item)
})

app.delete('/delete/:id', (req, res) => {
  const { id } = req.params
  const item = db.get('list').find({ id })

  if (!item.value()) error(res, 404, `Item with id (${id}) not found`)

  db.get('list').remove({ id }).write()
  res.status(200).json('Successful DELETE').end()
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))