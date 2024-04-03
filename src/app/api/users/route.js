import { NextResponse } from 'next/server';
import clientPromise from '@/utils/mongodb';
import { verifyAccessToken } from '@/lib/apiauth';

export async function GET(request) {
    const unauthorizedResponse = await verifyAccessToken(request);
    if (unauthorizedResponse) {
        return unauthorizedResponse;
    }
    // Get query params for pagination
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 30;
    const skip = (page - 1) * limit;

    const client = await clientPromise;
    const db = client.db('contrattiswi');

    try {
        const collection = db.collection('users');

        // Get total count of documents in the collection
        const totalDocuments = await collection.countDocuments();

        // Adjust the query to include pagination
        const users = await collection.find({})
            .skip(skip) // Skip the documents for previous pages
            .limit(limit) // Limit the number of documents returned
            .toArray();

        // Return paginated list of servizi with pagination info
        return NextResponse.json({
            message: "Ecco l'elenco dei servizi",
            status: 200,
            data: users,
            pagination: {
                total: totalDocuments,
                limit: limit,
                page: page,
                pages: Math.ceil(totalDocuments / limit)
            }
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            message: "Fallita la richiesta dell'elenco dei contratti",
            status: 500,
            error: error.message
        }, { status: 500 });
    }
}