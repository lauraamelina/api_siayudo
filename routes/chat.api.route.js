import express from 'express'
import * as chatController from '../controllers/chat.api.controller.js'
import { authorization } from '../middlewares/auth.middlewares.js'

const route = express.Router()

// route.all('/api/chat', authorization)
route.post('/api/chat', chatController.addMessage) 
route.post('/api/chat/all', chatController.getMessages)
route.post('/api/chat/email', chatController.sendEmail) 
route.post('/api/chat/inbox', chatController.getInbox)


export default route
