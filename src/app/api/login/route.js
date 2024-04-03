import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import clientPromise from '@/utils/mongodb';
import { signJwtAccessToken } from "@/lib/jwt";

export async function POST(req) {
    try {
        const body = await req.json();
        const { email, password } = body;

        // Find user in database
        const client = await clientPromise;
        const db = client.db('contrattiswi');
        const usersCollection = db.collection('users');

        const user = await usersCollection.findOne({ email: email });

        if (!user) {
            return new Response(JSON.stringify({ message: "Invalid email" }), { status: 401 });
        }

        if (await bcrypt.compare(password, user.hashedPassword)) {
            const { hashedPassword, created_at, updated_at, ...userWithoutPass } = user;

            // Ensure options is a valid JSON string
            if (typeof userWithoutPass.options === 'string') {
                try {
                    userWithoutPass.options = JSON.parse(userWithoutPass.options);
                } catch (e) {
                    console.error('Error parsing options:', e);
                }
            }

            const accessToken = signJwtAccessToken(userWithoutPass);
            const result = {
                ...userWithoutPass,
                accessToken,
            };

            return new Response(JSON.stringify(result));
        } else {
            return new Response(JSON.stringify({ message: "Invalid password" }), { status: 401 });
        }
    } catch (error) {
        console.log(error.message);
        return new Response(JSON.stringify({ message: "An error occurred while logging in" }), { status: 500 });
    }
}
