import express from 'express'
import PostRoute from './routes/post.api.route.js'
import UserRoute from './routes/user.api.route.js'
import CategoriaRoute from './routes/categoria.api.route.js'
import ChatRoute from './routes/chat.api.route.js'
import AdminRoute from './routes/admin.api.route.js'
import cors from 'cors'
import {createServer} from 'http'
import * as socketIo from 'socket.io'
import bodyParser from 'body-parser'


const app = express()
app.use(cors())
app.use(express.json())
app.set('port', process.env.PORT || 8080)

app.use(bodyParser.urlencoded({extended: true, limit: '500mb', parameterLimit: 1000000}))

app.use('/', PostRoute)
app.use('/api/', UserRoute)
app.use('/', CategoriaRoute)
app.use('/', ChatRoute)
app.use('/', AdminRoute)

const server = createServer(app)
const serverSocket = new socketIo.Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: 'GET,POST',
  },
  transports: ['websocket'],
})



serverSocket.on('connection', (socket) => {
  // console.log('a user connected')

  socket.on('message', (message, userFrom, userTo) => {
    serverSocket.emit('messages', {message, userFrom, userTo})

  })

 
  // socket.on('disconnect', () => {
  //   console.log('user disconnected')
  // })
})


server.listen(app.get('port') , function () {
  console.log('Servidor corriendo')
})
