'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

/**
 * =======================================================================
 * Consultar todos los usuarios
 */
module.exports = (event, context, callback) => {
    const params = {
        TableName: process.env.USUARIO,
        ProjectionExpression: "nombre, email, apellido_paterno, apellido_materno"
    };

    console.log("Buscando en la tabla.");
    const onScan = (err, data) => {

        if (err) {
            console.log('Error al buscar información. Error JSON:', JSON.stringify(err, null, 2));
            callback(err);
        } else {
            console.log("Scan succeeded.");
            return callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    candidates: data.Items
                })
            });
        }

    };

    dynamoDb.scan(params, onScan);
};