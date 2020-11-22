'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid');

/**
 * =======================================================================
 * Función para crear nuevo usuario
 */
module.exports = (event, context, callback) => {
    const requestBody = JSON.parse(event.body);
    const nombre = requestBody.nombre;
    const email = requestBody.email;
    const apellido_paterno = requestBody.apellido_paterno;
    const apellido_materno = requestBody.apellido_materno;

    // Validación
    if (typeof nombre == 'string' || typeof apellido_paterno == 'string' || typeof apellido_materno == 'string') {
        console.error('Error de validación');
        callback(new Error('Ha ocurrido un error en la validación del nuevo usuario.'));
        return;
    }

    // Registrar nuevo usuario
    crearNuevoUsuario(datosUsuario(nombre, email, apellido_paterno, apellido_materno))
        .then(res => {
            callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    message: `Se ha creado el usuario: ${email}`,
                    candidateId: res.id
                })
            });
        })
        .catch(err => {
            console.log(err);
            callback(null, {
                statusCode: 500,
                body: JSON.stringify({
                    message: `No se ha podido crear el usuario: ${email}`
                })
            })
        });

};

/**
 * =======================================================================
 * Contiene la información del usuario
 */
const crearNuevoUsuario = usuario => {
    console.log('Crear nuevo usuario');
    const usuarioInfo = {
        TableName: process.env.USUARIO,
        Item: usuario,
    };
    return dynamoDb.put(usuarioInfo).promise()
        .then(res => usuario);
};

/**
 * =======================================================================
 * Contiene la información del usuario
 */
const datosUsuario = (nombre, email, apellido_paterno, apellido_materno) => {
    const timestamp = new Date().getTime();
    return {
        id: uuid.v1(),
        nombre: nombre,
        email: email,
        apellido_paterno: apellido_paterno,
        apellido_materno: apellido_materno,
        fecha_creacion: timestamp,
    };
};