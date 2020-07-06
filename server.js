const express = require('express')
const app = express()
const port = 3030
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const defaultData = require('./defaultData')
const shortid = require('shortid')
const cors = require('cors')

const adapter = new FileSync('db.json')
const db = low(adapter)

app.use(cors())

db.defaults(defaultData).write()

const error = (res, status, text) => res.status(status).json(text).end()

app.use(express.json()) 

app.get('/list', (req, res) => {
  const list = db.get('list')
  res.send(list)
})

app.get('/statistics', (req, res) => {
  const list = db.get('list')
  res.send({
    total: list.size(),
    done: list.filter({ done: true }).size(),
    undone: list.filter({ done: false }).size(),
  })
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
  console.log(req.method)
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