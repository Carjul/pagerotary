import { defineEventHandler, readBody, createError } from "h3";
import { Usuario } from "../../models/Usuario";
import { connect, getDatabase, getCollection } from '../../utils/mongodb';
import { ObjectId } from "mongodb";

export default defineEventHandler(async (event) => {
    try {
        if (event.method === 'PUT') {
            const usuario: Usuario = await readBody(event);
            const { _id, contraseña, correo, estado, fechaCreacion, nombre, rol, telefono } = usuario;

            if (!_id) {
                throw createError({
                    statusCode: 400,
                    statusMessage: 'ID del usuario es requerido',
                });
            }

            const client = await connect();
            const db = await getDatabase(client);
            const collection = await getCollection<Usuario>(db, 'usuarios');

            const result = await collection.updateOne( { _id: new ObjectId(usuario._id) }, { $set:{correo, estado, fechaCreacion, nombre, rol, telefono } });

            if (result.modifiedCount > 0) {
                return {
                    statusCode: 200,
                    Message: 'Usuario actualizado'
                };
            } else {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Usuario no encontrado'
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