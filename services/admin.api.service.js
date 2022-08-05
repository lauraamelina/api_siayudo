import { database, ObjectId } from "./database.js";
import nodemailer from 'nodemailer';


async function getAllUsers() {
  return database(async db => {
    const users = await db.collection('users').find().toArray()
    return users
  })
}

async function verificarUser(id, status, motivo) {
  if(status === 1) {
    return database(async db => {
      const user = await db.collection('users').findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { type: 2 } })
      return user
    })
  } else if (status === 0) {
    return database(async db => {
      const user = await db.collection('users').findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { type: 4 , motivo: motivo} })
      return user
    })
  }
  
}

async function updateUser(user) {
  const userToUpdate = {
    ...user,
    _id: new ObjectId(user._id)
  }
  return database(async db => {
    const userUpdated = await db.collection('users').findOneAndUpdate({ _id: new ObjectId(user._id) }, { $set: userToUpdate })
    return userUpdated
  })
}

async function getCategoriasFromPosts() {
  return database(async db => {
    //solo trae el nombre de la categoria de los posts (no los id) categoria.nombre y los cuenta
    const categorias = await db.collection('post').aggregate([
      { $group: { _id: "$categoria.nombre", count: { $sum: 1 } } }
    ]).toArray()
    return categorias
  })
}

async function findMotivo(id) {
  return database(async db => {
    const user = await db.collection('users').findOne({ _id: new ObjectId(id) })
    const motivo = user.motivo
    return motivo
  })
}

async function getPostsByTypeUser() {
  return database(async db => {
    const posts = await db.collection('post').aggregate([
      { $group: { _id: "$creador.type", count: { $sum: 1 } } }
    ]).toArray()
    return posts
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

async function rejectUser(email) { 
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'siayudoinfo@gmail.com',
        pass: 'mojkfayyclcwcywq',
    }
  });

  const emailPort = process.env.EMAIL_PORT || 'http://localhost:3000';
    const mailOptions = {
        from: 'siayudoinfo@gmail.com',
        to: `${email}`,
        subject: `Rechazo de cuenta en Siayudo`,
        html:
        ` 
        <div style="text-align: center; color: #5e0059"> 
            <h3> Rechazo de cuenta en <span style="color:#00a6a6">Siayudo</span></h3> 
            <p>Hemos verificado tu documentación y hemos notado que no cumpes con los requisitos para tener una cuenta como fundación en SiAyudo </p> 
            
            <a href="${emailPort}" style="text-decoration: none; background-color: #00a6a6; color: white; padding: 0.375rem 0.75rem; border-radius: 0.25rem 0.25rem;">
               Revisar motivos
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


async function acceptUser(email) { 
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'siayudoinfo@gmail.com',
        pass: 'mojkfayyclcwcywq',
    }
  });

  const emailPort = process.env.EMAIL_PORT || 'http://localhost:3000';
    const mailOptions = {
        from: 'siayudoinfo@gmail.com',
        to: `${email}; siayudoinfo@gmail.com`,
        subject: `Bienvenido a Siayudo`,
        html:
        ` 
        <div style="text-align: center; color: #5e0059"> 
            <h3> Ya puedes publicar en <span style="color:#00a6a6">Siayudo</span> </h3> 
            <p>Verificamos correctamente tu cuenta.</p> 
            
            <a href="${emailPort}" style="text-decoration: none; background-color: #00a6a6; color: white; padding: 0.375rem 0.75rem; border-radius: 0.25rem 0.25rem;">
               Ingresar a Siayudo
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


export {
    getAllUsers,
    verificarUser,
    updateUser,
    getCategoriasFromPosts,
    findMotivo,
    getPostsByTypeUser,
    getInbox,
    acceptUser,
    rejectUser
}