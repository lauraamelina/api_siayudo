import { database, ObjectId } from "./database.js";
import nodemailer from "nodemailer";
import * as UserService from "./user.api.service.js";

const COLLECTION_NAME = 'chat'

async function addMessage({message, userFrom, userTo}) {
  const chat = {
    message,
    userFrom,
    userTo,
    date: new Date().toISOString(),
  }
  return database(async db => {
    const newChat = await db.collection(COLLECTION_NAME).insertOne(chat)
    return chat
  })
}

async function getMessages(userFrom, userTo) {
  return database(async db => {
    const chats = await db.collection(COLLECTION_NAME).find({
      'userFrom._id': { $in: [userFrom, userTo] },
      'userTo._id': { $in: [userFrom, userTo] }
    }).toArray()
    return chats
    })
}

async function sendEmail(from, to) {

  const userTo = await UserService.findUserById(to) 
  const userFrom = await UserService.findUserById(from)

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'siayudoinfo@gmail.com',
        pass: 'bfersgfwhqhbqyqw',
    }
  });

  const emailPort = process.env.EMAIL_PORT || 'http://localhost:3000';
    const mailOptions = {
        from: 'siayudoinfo@gmail.com',
        to: `${userFrom.email}`,
        subject: `${userFrom.name} tienes un nuevo mensaje en SiAyudo`,
        html:
        ` 
        <div style="text-align: center; color: #5e0059"> 
            <h3>Nuevo mensaje  <span style="color:#00a6a6">Siayudo</span> </h3> 
            <p>Responde al mensaje de ${userTo.name} </p> 
            
            <a href="${emailPort}" style="text-decoration: none; background-color: #00a6a6; color: white; padding: 0.375rem 0.75rem; border-radius: 0.25rem 0.25rem;">
               Responder mensaje 
            </a> 
        </div> 
        `,
  };

  transporter.sendMail(mailOptions, (err, response) => {
    if(err) {
        console.error('Ha ocurrido un error', err)
    } else {
        return "Correo enviado"
    }
  })
}

async function getInbox(userId) {
  return database(async db => {
    const usersId = await db.collection('chat').aggregate([
      { $match: { $or: [{ 'userFrom._id': { $in: [userId] } }, { 'userTo._id': { $in: [userId] } }] } },
      { $sort: { date: -1 } },
      { $group: { _id: { $cond: [{ $eq: ["$userFrom._id", userId] }, "$userTo._id", "$userFrom._id"] }, } },
    ]).toArray()

    const users = await Promise.all(usersId.map(async user => {
      const userFound = await UserService.findUserById(user._id)
      return userFound
    }))

    return users

})
}



export { 
  addMessage,
  getMessages, 
  sendEmail,
  getInbox
}