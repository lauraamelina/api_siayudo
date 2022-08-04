import { database, ObjectId } from "./database.js";

const COLLECTION_NAME = 'categorias'

async function find() {
  return database(async db => {
    const categorias = await db.collection(COLLECTION_NAME).find().toArray()
    return categorias
  })
}

export {
    find,
}