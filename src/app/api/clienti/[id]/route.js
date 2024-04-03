import { NextResponse } from 'next/server';
import clientPromise from '@/utils/mongodb';
import { ObjectId } from 'mongodb';
import { verifyAccessToken } from '@/lib/apiauth';
import { getUserInfo } from '@/lib/VerifyRole';

// post to update a cliente
export async function POST(req, context) {
    const unauthorizedResponse = await verifyAccessToken(req);
    const userInfo = await getUserInfo(req)
    if (unauthorizedResponse) {
        return unauthorizedResponse;
    }

    const { id } = context.params;

    //console.log(id)

    if (!id) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const body = await req.json()
    //console.log(body)
    const clienteData = body;
    const client = await clientPromise;
    const db = client.db('contrattiswi');

    //console.log(clienteData)
    if (clienteData) {

        delete clienteData._id;
        try {
            const collection = db.collection('clienti');
            // Using updateOne to update the document with the given ID
            const result = await collection.updateOne(
                { _id: new ObjectId(id) }, // Filter to match the document by its ID
                { $set: clienteData } // Update operation
            );

            if (result.modifiedCount === 0) {
                return NextResponse.json({ message: "Nessun cliente aggiornato", status: 404 }, { status: 404 });
            }

            const action = {
                userID: userInfo._id,
                userName: userInfo.name + ' ' + userInfo.cognome,
                action: "cliente modificato: " + id,
                date: Date.now()
            }

            const actionsCollection = db.collection('user_actions')
            const addAction = await actionsCollection.insertOne(action)

            if (addAction.insertedCount === 0) {
                console.log('action not saved');
            }

            return NextResponse.json({ message: "cliente aggiornato!", status: 200, data: result }, { status: 200 });
        } catch (error) {
            return NextResponse.json({ message: "Errore nell'aggiornamento del cliente!", status: 500, error: error.message }, { status: 500 });
        }
    } else {
        return NextResponse.json({ message: "Dati incorretti", status: 400, error: "form data is incorrect" }, { status: 400 });
    }
}

// PUT to delete a cliente
export async function DELETE(req, context) {
    const unauthorizedResponse = await verifyAccessToken(req);
    const userInfo = await getUserInfo(req)
    if (unauthorizedResponse) {
        return unauthorizedResponse;
    }

    const { id } = context.params;

    //console.log(id)

    if (!id) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('contrattiswi');

    try {
        const collection = db.collection('clienti');
        // Using deleteOne to delete the document with the given ID
        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            //console.log(result)
            return NextResponse.json({ message: "Nessuna cliente trovato per l'eliminazione", status: 404 }, { status: 404 });
        }

        const action = {
            userID: userInfo._id,
            userName: userInfo.name + ' ' + userInfo.cognome,
            action: "cliente Eliminato: " + id,
            date: Date.now()
        }

        const actionsCollection = db.collection('user_actions')
        const addAction = await actionsCollection.insertOne(action)

        if (addAction.insertedCount === 0) {
            console.log('action not saved');
        }

        return NextResponse.json({ message: "cliente eliminato!", status: 200 }, { status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Errore nell'eliminazione del cliente!", status: 500, error: error.message }, { status: 500 });
    }
}


// get a single cliente
export async function GET(request, context) {
    const unauthorizedResponse = await verifyAccessToken(request);
    if (unauthorizedResponse) {
        return unauthorizedResponse;
    }
    const { id } = context.params;

    if (!id) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }


    const client = await clientPromise;
    const db = client.db('contrattiswi');

    try {
        const collection = db.collection('clienti');
        // Find a single document by its ID
        const cliente = await collection.findOne({ _id: new ObjectId(id) });

        if (!cliente) {
            return NextResponse.json({ message: "cliente non trovato", status: 404 }, { status: 404 });
        }

        // Return the found document
        return NextResponse.json({
            message: "Dettagli del cliente",
            status: 200,
            data: cliente
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            message: "Errore nella richiesta del cliente",
            status: 500,
            error: error.message
        }, { status: 500 });
    }
}
