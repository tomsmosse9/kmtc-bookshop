require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { connectDB, client } = require('./db');

async function migrate() {
    const db = await connectDB();
    const dataDir = path.join(__dirname, 'data');

    const collections = {
        'users.json': 'users',
        'files.json': 'files',
        'chat.json': 'messages',
        'groups.json': 'groups'
    };

    for (const [file, collectionName] of Object.entries(collections)) {
        const filePath = path.join(dataDir, file);
        if (fs.existsSync(filePath)) {
            console.log(`Migrating ${file}...`);
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

            if (Array.isArray(data) && data.length > 0) {
                const collection = db.collection(collectionName);
                // Clear existing data in collection (optional, but good for fresh migration)
                await collection.deleteMany({});
                await collection.insertMany(data);
                console.log(`Successfully migrated ${data.length} records to ${collectionName}`);
            } else {
                console.log(`Skipping ${file}: No records found.`);
            }
        }
    }

    console.log('Migration completed successfully.');
    await client.close();
}

migrate().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
