import { NextResponse } from "next/server";
import clientPromise from '@/utils/mongodb';
import { ObjectId } from "mongodb";
import { verifyAccessToken } from "@/lib/apiauth";

export async function GET(req, context) {
    try {
        const { id } = context.params;
        if (!id) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        // Validate id format (it must be a 24-character hex string)
        if (!/^[0-9a-fA-F]{24}$/.test(id)) {
            return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('contrattiswi');
        const objectId = new ObjectId(id);
        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({ _id: objectId });

        if (!user) {
            return new Response(JSON.stringify({ message: "Invalid email" }), { status: 401 });
        }
        delete user.hashedPassword
        //console.log('login id', user);



        return new Response(JSON.stringify(user));
    } catch (error) {
        console.log(error.message);
        return new Response(JSON.stringify({ message: "An error occurred while logging in" }), { status: 500 });
    }
}

export async function UPDATE(req, context) {
    const unauthorizedResponse = await verifyAccessToken(req);
    if (unauthorizedResponse) {
        return unauthorizedResponse;
    }

    try {
        const { id } = context.params;
        console.log('Updating user with ID:', id);

        if (!id) {
            return new Response(JSON.stringify({ message: "Missing required ID" }), { status: 400 });
        }
        if (!/^[0-9a-fA-F]{24}$/.test(id)) {
            return new Response(JSON.stringify({ message: "Invalid ID format" }), { status: 400 });
        }
        const body = await req.json();
        //const { name, cognome, email, role, hashedPassword, options, userChatId, status } = body;
        const data = body.name ? body : body.formData
        const { name, cognome, email, role, status, telefono, codAgente, avatar, options, note } = data;

        const client = await clientPromise;
        const db = client.db('contrattiswi');
        const objectId = new ObjectId(id);
        const usersCollection = db.collection('users');

        // Update user document
        const updateResult = await usersCollection.updateOne(
            { _id: objectId },
            {
                $set: {
                    name,
                    cognome,
                    email,
                    role,
                    options,
                    status,
                    telefono,
                    codAgente,
                    avatar,
                    note
                },
            }
        );

        if (updateResult.matchedCount === 0) {
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        if (updateResult.modifiedCount === 0) {
            return new Response(JSON.stringify({ message: "No changes made to the user" }), { status: 304 });
        }

        return new Response(JSON.stringify({ message: "User updated successfully" }), { status: 200 });
    } catch (error) {
        console.log('Error updating user:', error.message);
        return new Response(JSON.stringify({ message: "An error occurred during the update operation" }), { status: 500 });
    }
}

