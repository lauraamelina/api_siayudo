import MongoDB, { ObjectId } from 'mongodb'
const cliente = new MongoDB.MongoClient('mongodb://localhost:27017')

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