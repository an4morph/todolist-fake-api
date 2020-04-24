const express = require('express')
const app = express()
const port = 3000
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const defaultData = require('./defaultData')

const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({ list: defaultData }).write()

const colors = [null, '#efa8e4', '#97e5ef', '#f6d198', '#77d8d8', '#f2ed6f']

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

app.post

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))