require('dotenv').config();
const express = require('express');
const route = express.Router();
const { header, body, validationResult } = require('express-validator');
const { removeDuplicatedData } = require('../helper')
const process = require('process');
const { verify } = require('jsonwebtoken');
const { User } = require('../models');
const validationSchemaRole = [
    header('X-JWT-TOKEN').trim().notEmpty().custom(async value => {
        verify(value, process.env.SECRET, (err, decode) => {
            if (err) {
                throw Error(err.message)
            }
        });
    }),
    body('role').trim().notEmpty(),
    body('description').trim().notEmpty(),
];
route.post('/store', validationSchemaRole, async (req, res) => {
    console.log(req.headers)
    const result = validationResult(req);
    if (result.isEmpty()) {
        console.log(req, res)
    } else {
        return res.status(422).json({ 'message': 'failed, creating new role', 'error': await removeDuplicatedData(result.array(), 'path') });
    }
});
route.put('/:id/update', validationSchemaRole, async (req, res) => {
    console.log(req, res)
});
route.get('/:id', validationSchemaRole, async (req, res) => {
    console.log(req, res)
});
route.delete('/:id', validationSchemaRole, async (req, res) => {
    console.log(req, res)
});

module.exports = route;