// get all servizi and create a servizi

import { NextResponse } from 'next/server';
import clientPromise from '@/utils/mongodb';
import { verifyAccessToken } from '@/lib/apiauth';
import { getUserInfo } from '@/lib/VerifyRole';

// create cliente
export async function POST(req) {
    const unauthorizedResponse = await verifyAccessToken(req);
    if (unauthorizedResponse) {
        return unauthorizedResponse;
    }

    const body = await req.json()
    console.log(body)
    const clientiData = body;
    const client = await clientPromise;
    const db = client.db('contrattiswi');

    console.log(clientiData)
    if (clientiData) {

        try {
            const collection = db.collection('clienti');
            const result = await collection.insertOne(clientiData);

            const userInfo = getUserInfo(req)
            const action = {
                userID: userInfo._id,
                userName: userInfo.name + ' ' + userInfo.cognome,
                action: "cliente creato: " + result.insertedId.toString(),
                date: Date.now()
            }

            const actionsCollection = db.collection('user_actions')
            const addAction = await actionsCollection.insertOne(action)

            if (addAction.insertedCount === 0) {
                console.log('action not saved');
            }

            return NextResponse.json({ message: "cliente creato!", status: 200, data: result }, { status: 200 });
        } catch (error) {
            return NextResponse.json({ message: "Errore nel creare il cliente!", status: 500, error: error.message }, { status: 500 });
        }
    } else {
        return NextResponse.json({ message: "Dati incorretti", status: 400, error: "form data is incorrect" }, { status: 400 });
    }
}

export async function GET(request) {
    const unauthorizedResponse = await verifyAccessToken(request);
    if (unauthorizedResponse) {
        return unauthorizedResponse;
    }
    // Get query params for pagination
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 10000;
    const skip = (page - 1) * limit;

    const client = await clientPromise;
    const db = client.db('contrattiswi');

    try {
        const collection = db.collection('clienti');

        // Get total count of documents in the collection
        const totalDocuments = await collection.countDocuments();

        // Adjust the query to include pagination
        const clienti = await collection.find({})
            .skip(skip) // Skip the documents for previous pages
            .limit(limit) // Limit the number of documents returned
            .toArray();

        // Return paginated list of servizi with pagination info
        return NextResponse.json({
            message: "Ecco l'elenco dei clienti",
            status: 200,
            data: clienti,
            pagination: {
                total: totalDocuments,
                limit: limit,
                page: page,
                pages: Math.ceil(totalDocuments / limit)
            }
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            message: "Fallita la richiesta dell'elenco dei clienti",
            status: 500,
            error: error.message
        }, { status: 500 });
    }
}