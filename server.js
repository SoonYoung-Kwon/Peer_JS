const express = require('express')
const app = express()
//const server = require('http').Server(app)
const https = require('httpolyglot')
const fs = require('fs')
const path = require('path')
const options = {
    cert: fs.readFileSync(path.join(__dirname,'./ssl/cert.pem'), 'utf-8'),
    key: fs.readFileSync(path.join(__dirname,'./ssl/key.pem'), 'utf-8')
}
const httpsServer = https.createServer(options, app)
const io = require('socket.io')(httpsServer)
//const io = require('socket.io')(server)
const { v4 : uuidV4} = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) =>{
    res.render('room', { roomID : req.params.room })
})

io.on('connection', socket =>{
    socket.on('join-room', (roomID, userID) => {
        socket.join(roomID)
        socket.to(roomID).emit('user-connected', userID)
    })
})

httpsServer.listen(43044)