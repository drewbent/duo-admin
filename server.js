/**
 * Script that will serve our file on heroku
 */
const express = require('express')
const path = require('path')

const port = process.env.PORT || 8080
const app = express()
app.use(express.static(path.join(__dirname, 'dist')))

app.get('/ping', (_, res) => {
  return res.send('pong')
})

app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(port)
