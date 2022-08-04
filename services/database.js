import MongoDB, { ObjectId } from 'mongodb'
const cliente = new MongoDB.MongoClient('mongodb+srv://siayudoinfo:Siayudo123-!@cluster0.ikpthku.mongodb.net/tesis')

async function database(callback) {
    await cliente.connect()
    const db = cliente.db('tesis')
    const result = await callback(db)
    return result
}

export {
    database,
    ObjectId
}