require('dotenv').config();
const express = require('express');
const route = express.Router();
const { body, validationResult } = require('express-validator');
const moment = require('moment');
const process = require('process');
const { User } = require('../models');
const bcrypt = require('bcrypt');
const { validateIndonesianPhoneNumber, removeDuplicatedData } = require('../helper')
const { sign } = require('jsonwebtoken');
const { Op } = require('sequelize');
const validationSchemaRegistration = [
    // body('first_name').trim().notEmpty(),
    // body('last_name').trim().notEmpty(),
    body('username').trim().notEmpty(),
    body('password').trim().notEmpty(),
    // body('address').trim().notEmpty(),
    body('email').trim().notEmpty().isEmail().custom(async value => {
        let user = await User.findAll({ where: { email: value } });
        if (user.length > 0) {
            throw new Error('already in use');
        }
    }),
    body('phoneNumber').trim().notEmpty().custom(async value => {
        if (await validateIndonesianPhoneNumber(value) === false) {
            throw new Error('is invalid');
        }
    })];
const validationSchemaLogin = [body('username').trim().notEmpty(),
body('password').trim().notEmpty()];

route.post('/login', validationSchemaLogin, async (req, res) => {
    let userRequested = await User.scope('withPassword').findOne({
        where: {
            [Op.or]: [{ email: req.body.username }, { username: req.body.username }]
        }
    });
    if (userRequested) {
        bcrypt.compare(req.body.password, userRequested.password, async (err, result) => {
            if (result) {
                const accessToken = sign({ username: userRequested.username, id: userRequested.id }, process.env.SECRET);
                return res.status(200).json({ message: 'login successfully', data: accessToken });
            } else {
                return res.status(422).json({ 'message': 'password and username mismatch' });
            }
        });
    } else {
        return res.status(404).json({ 'message': 'user not found' });
    }
});

route.post('/registration', validationSchemaRegistration, async (req, res) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        bcrypt.hash(req.body.password, 10, async (err, hash) => {
            if (err) {
                return res.status(422).json({ 'message': err });
            } else {
                let data = { ...req.body }
                data.password = hash;
                data.roleId = 2;
                const user = await User.create({ ...data });
                return res.status(200).json({ 'message': 'Your registration is successfully' });
            }
        })
    } else {
        return res.status(422).json({ 'message': 'Your registration is failed', 'error': await removeDuplicatedData(result.array(), 'path') });
    }
});

module.exports = route;