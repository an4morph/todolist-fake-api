const express = require('express')
const app = express()
const port = 3000
const allData = require('./fakebd')

const colors = [null, '#efa8e4', '#97e5ef', '#f6d198', '#77d8d8', '#f2ed6f']

app.get('/list', (req, res) => {
  res.send(allData)
})

app.get('/list/:id', (req, res) => {
  const id = req.params.id
  const item = allData.find(i => i.id === id)
  if (!item) res.status(400).send('Bad Request')
  res.send({...item, description: `Description for task ${item.id}`, color: colors[item.id] })
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))