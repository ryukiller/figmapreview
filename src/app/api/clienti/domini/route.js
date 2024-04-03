import { NextResponse } from 'next/server';
import clientPromise from '@/utils/mongodb';

export async function GET() {

    const client = await clientPromise;
    const db = client.db('contrattiswi');

    try {
        const collection = db.collection('clienti');

        const aggregation = await collection.aggregate([
            { $unwind: "$domini" },
            { $group: { _id: "$domini" } },
            { $sort: { _id: 1 } },
        ]).toArray();

        const uniqueDomini = aggregation.map(item => item._id);

        return NextResponse.json({
            message: "Ecco l'elenco dei clienti e domini unici",
            status: 200,
            data: uniqueDomini, // Return the unique domains
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            message: "Fallita la richiesta dell'elenco dei clienti",
            status: 500,
            error: error.message
        }, { status: 500 });
    }
}