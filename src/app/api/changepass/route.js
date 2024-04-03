import bcrypt from "bcryptjs";
import { verifyRole, getUserInfo } from '@/lib/VerifyRole';
import { ObjectId } from 'mongodb'; // Ensure you have imported ObjectId
import { NextResponse } from 'next/server';
import clientPromise from '@/utils/mongodb'; // Adjusted import to use MongoDB client
import { verifyAccessToken } from '@/lib/apiauth';

export async function POST(req) {
    const unauthorizedResponse = await verifyAccessToken(req);
    const userInfo = await getUserInfo(req)
    if (unauthorizedResponse) {
        return unauthorizedResponse;
    }

    if (!verifyRole(req, ['superuser'])) {
        return NextResponse.json({ message: 'Non sei autorizzato ad effettuare questa operazione.' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { id, password } = body;

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Use MongoDB client to connect to the database
        const client = await clientPromise;
        const db = client.db('contrattiswi'); // Ensure you specify your database name if it's not defined in clientPromise
        const usersCollection = db.collection('users'); // Adjust 'users' to your collection name

        // Update the user's password
        const result = await usersCollection.updateOne(
            { _id: new ObjectId(id) }, // Use ObjectId for MongoDB's _id field
            { $set: { hashedPassword: hashedPassword } }
        );

        // Check if the document was successfully updated
        if (result.modifiedCount === 0) {
            throw new Error('No user found with the provided id or no update made.');
        }


        const action = {
            userID: userInfo._id,
            userName: userInfo.name + ' ' + userInfo.cognome,
            action: "Cambiata password dell'utente: " + id,
            date: Date.now()
        }

        const actionsCollection = db.collection('user_actions')
        const addAction = await actionsCollection.insertOne(action)

        if (addAction.insertedCount === 0) {
            console.log('action not saved');
        }

        return NextResponse.json({ message: "Password changed" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Error changing password', error: error.message }, { status: 500 });
    }
}
