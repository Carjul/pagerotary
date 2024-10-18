import { defineEventHandler, readBody } from "h3";
import { Evento } from "../../models/Evento";
import { connect, getDatabase, getCollection } from '../../utils/mongodb';

export default defineEventHandler(async (event) => {
    try {
        if (event.method === 'POST') {
            const evento: Evento = await readBody(event);

            const client = await connect();
            const db = await getDatabase(client);
            const collection = await getCollection<Evento>(db, 'eventos');

            const result = await collection.insertOne(evento);

            if (result.insertedId) {
                return {
                    statusCode: 201,
                    Message: 'Evento creado'
                };
            } else {
                throw createError({
                    statusCode: 500,
                    statusMessage: 'Error al crear el evento'
                });
            }
        } else {
            throw createError({
                statusCode: 405,
                statusMessage: 'Method Not Allowed',
            });
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: { Message: 'Error interno del servidor', Error: error },
        };
    }
});