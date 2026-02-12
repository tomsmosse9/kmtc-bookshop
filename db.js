const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error('CRITICAL: MONGODB_URI is not defined in environment variables');
    process.exit(1);
}

const client = new MongoClient(uri);

let db = null;

async function connectDB() {
    if (db) return db;
    try {
        await client.connect();
        console.log('Successfully connected to MongoDB Atlas');
        db = client.db('kmtc-bookshop');
        return db;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

function getCollection(name) {
    if (!db) {
        throw new Error('Database not initialized. Call connectDB first.');
    }
    return db.collection(name);
}

module.exports = { connectDB, getCollection, client };
