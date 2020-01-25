/**
 * Script that will serve our file on heroku
 */
import express from 'express'
import path from 'path'

const port = process.env.PORT || 8080
const app = express()
app.use(express.static(path.join(__dirname, 'dist')))

app.get('/ping', (_, res) => {
  return res.send('pong')
})

app.get('/*', (_, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.listen(port)
