import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import clientPromise from '@/utils/mongodb';
import { verifyRole } from '@/lib/VerifyRole';
import { verifyAccessToken } from "@/lib/apiauth";



export async function POST(req) {
    const unauthorizedResponse = await verifyAccessToken(req);
    if (unauthorizedResponse) {
        return unauthorizedResponse;
    }

    if (!verifyRole(req, ['superuser'])) {
        return NextResponse.json({ message: 'Non sei autorizzato ad effettuare questa operazione.' }, { status: 401 });
    }
    let connection;
    try {

        const body = await req.json();
        //const data = body.name ? body : body.formData
        console.log(body)
        const { name, cognome, email, password, role, status, telefono, codAgente, avatar, options, note } = body;


        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = {
            name,
            cognome,
            email,
            role,
            hashedPassword,
            options,
            status,
            telefono,
            codAgente,
            avatar,
            note
        }

        const client = await clientPromise;
        const db = client.db('contrattiswi');

        const usersCollection = db.collection('users');

        const result = await usersCollection.insertOne(user);

        return NextResponse.json({ message: "Utente creato!", status: 200, data: result });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            console.error('Registration failed: Email already exists');
            return NextResponse.json({ message: 'Registration failed: Email already exists' }, { status: 409 });
        } else {
            console.error('Registration failed:', error);
            return NextResponse.json({ message: 'Registration failed' }, { status: 500 });
        }
    } finally {
        if (connection) connection.release();
    }

}
