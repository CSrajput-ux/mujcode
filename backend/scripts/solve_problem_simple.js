require('dotenv').config({ path: '../.env' });
const { MongoClient } = require('mongodb');

async function run() {
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('test'); // Default DB, check if different
        const usersCollection = db.collection('users'); // Actually PG, so we need mapping. Wait, StudentProgress is Mongo.
        const progressCollection = db.collection('studentprogresses'); // Mongoose pluralizes

        // We need the User ID which is a UUID from Postgres.
        // Let's assume we grabbed it from the previous script or know it.
        // For now, let's fetch it via SQL or just hardcode if we knew it.
        // Actually, let's just use the SQL part to get ID again, but keep it simple.

        // MIXED MODE: standard PG + Mongo Native
        const { Client } = require('pg');
        const pgClient = new Client({
            connectionString: process.env.DATABASE_URL
        });
        await pgClient.connect();

        const res = await pgClient.query("SELECT id, email FROM \"Users\" WHERE email = $1", ['chhotu.2427030521@muj.manipal.edu']);
        const user = res.rows[0];
        await pgClient.end();

        if (!user) {
            console.log("User not found in PG");
            return;
        }
        console.log(`User ID: ${user.id}`);

        // Update Mongo
        const update = {
            $addToSet: { solvedProblemIds: 1 }
        };

        const result = await progressCollection.updateOne(
            { userId: user.id },
            update,
            { upsert: true }
        );

        console.log(`Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}, Upserted: ${result.upsertedId}`);

    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

run();
