import { database, ObjectId } from "./database.js";
import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import fs from 'fs'


const COLLECTION_NAME = 'users'

async function create(user) {
    return database(async db => {
        const userOld = await db.collection(COLLECTION_NAME).findOne({email: user.email})

        if(!userOld) {
            const salt = await bcrypt.genSalt(10)
            const passwordHash = await bcrypt.hash(user.password, salt)
            const userToCreate = {
            ...user,
            password: passwordHash
            }
            await db.collection(COLLECTION_NAME).insertOne(userToCreate)
            return userToCreate
        } else {
            throw new Error('Usuario ya existe')
        }

        
    })
}

async function login(user) {
    return database(async db => {
        const userLogin = await db.collection(COLLECTION_NAME).findOne({email: user.email})
        const userReturn = {
            _id: userLogin._id,
            name: userLogin.name,
            email: userLogin.email,
            type: userLogin.type,
            
        }
        if(userLogin) {
            const isPasswordValid = await bcrypt.compare(user.password, userLogin.password)
            if(isPasswordValid) {
                return {
                    ...userReturn, password: undefined
                }
            }
         
        }
    })
}

async function findUserById(id) {
    return database(async db => {
        const user = await db.collection(COLLECTION_NAME).findOne({_id: new ObjectId(id)})
        return user
    })
}

async function findUserByEmail(email) {
    return database(async db => {
        const user = await db.collection(COLLECTION_NAME).findOne({email: email})
        return user
    })
}

async function updateUser(user) {
    return database(async db => {
        const userOld = await db.collection(COLLECTION_NAME).findOne({_id: new ObjectId(user._id)})
        const userReturn = {
            _id: userOld._id,
            name: userOld.name,
            email: userOld.email,
            type: userOld.type,
        }
        if(userOld) {
            const userToUpdate = await db.collection(COLLECTION_NAME).updateOne({_id: new ObjectId(user._id)} ,{$set: {
                email: user.email, 
                name: user.name,
                direccion: user.direccion,
                localidad: user.localidad,
                telefono: user.telefono,
            }})
            return userReturn
        } else {
            throw new Error('Usuario no existe')
        }
    })
} 

async function forgotPassword(request) {
    return database(async db => {
        const user = await db.collection(COLLECTION_NAME).findOne({email: request.email})   
        if(user) {
            const token = jwt.sign({id: user._id}, 'RESET_PASSWORD', {expiresIn:"1h"})
            user.tokenResetPassword = token
            
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
                to: `${user.email}`,
                subject: 'Recuperar cuenta de Siayudo',
                html:
                ` 
                <div style="text-align: center; color: #5e0059"> 
                    <h3>Recuperación de cuenta <span style="color:#00a6a6">Siayudo</span> </h3> 
                    <p>A continuación verás un enlace para recuperar tu cuenta de Siayudo. Cuando hagas click en dicho enlace podrás restablecer tu contraseña. </p> 
                    <a href="${emailPort}/reset/${user._id}/${token}"> Recuperar contraseña </a> 
                    <p> Si no has solicitado un cambio de contraseña, puedes ignorar este correo.</p>
                </div> 
                `,
            };
    
            transporter.sendMail(mailOptions, (err, response) => {
                if(err) {
                    console.error('Ha ocurrido un error', err)
                } else {
                    return response
                }
            })

            return user
           
        } else {
            throw new Error('El email no existe en nuestros registros')
        }
    })
}

async function resetPassword(request) {
    return database(async db => {
        const user = await db.collection(COLLECTION_NAME).findOne({_id: new ObjectId(request.id)})
        if(user) {
            const isTokenValid = jwt.verify(request.token, 'RESET_PASSWORD')
            if(isTokenValid) {
                const salt = await bcrypt.genSalt(10)
                const passwordHash = await bcrypt.hash(request.password, salt)
                await db.collection(COLLECTION_NAME).updateOne({_id: new ObjectId(request.id)} ,{$set: {password: passwordHash}})
                return user
            } else {
                throw new Error('El token no es válido')
            }
        } else {
            throw new Error('El usuario no existe')
        }
    })
}

async function updateImage(id, file) {
    return database(async db => {
        const contents = fs.readFileSync(file.path, {encoding: 'base64'});
        const user = await db.collection(COLLECTION_NAME).updateOne({_id: new ObjectId(id)} ,{$set: {image: contents}})
        return user
    })
}

async function updateFile(id, file) {
    return database(async db => {
        const contents = fs.readFileSync(file.path, {encoding: 'base64'});
        const user = await db.collection(COLLECTION_NAME).updateOne({_id: new ObjectId(id)} ,{$set: {archivo: contents}})
        return user
    })
}





export {
    create,
    login,
    findUserById,
    findUserByEmail,
    updateUser,
    forgotPassword,
    resetPassword,
    updateImage,
    updateFile,
}