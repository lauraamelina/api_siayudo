import * as ChatService from '../services/chat.api.service.js'

function addMessage(req, res) {
    const message = req.body.message
    const userFrom = req.body.userFrom
    const userTo = req.body.userTo
    ChatService.addMessage(message, userFrom, userTo)
        .then(function (chat) {
            res.status(200).json(chat)
        }).catch(function (err) {
            res.status(500).json({ err: 'Error de conexión de base de datos' })
        })
}

function getMessages(req, res) {
    const userFrom = req.body.userFrom
    const userTo = req.body.userTo
    ChatService.getMessages(userFrom, userTo)
        .then(function (chats) {
            res.status(200).json(chats)
        }).catch(function (err) {
            res.status(500).json({ err: 'Error de conexión de base de datos' })
        })
}

function sendEmail(req, res) {
    const userFrom = req.body.userFrom
    const userTo = req.body.userTo
    ChatService.sendEmail(userFrom, userTo)
        .then(function (chat) {
            res.status(200).json(chat)
        }).catch(function (err) {
            res.status(500).json({ err: 'Error de conexión de base de datos' })
        })
}

function getInbox(req, res) {
    ChatService.getInbox(req.body.id)
        .then(function (chats) {
            res.status(200).json(chats)
        }).catch(function (err) {
            res.status(500).json({ err: 'Error de conexión de base de datos' })
        })
}

export { 
    addMessage,
    getMessages,
    sendEmail,
    getInbox

}