const bcrypt = require('bcrypt');
const { User } = require('../models/userModel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

/**
 * @swagger
 * tags:
 *   name: API
 *   description: Operations about Login/Signup API
 */

/** 
 * @swagger
 * /api/signup  :
 *  post:
 *      tags:
 *          - API
 *      summary: create a new user
 *      requestBody:
 *          description: create a new record of user
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                          email:
 *                              type: string
 *                          password:
 *                              type: string
 *      responses:
 *          401:
 *              description: Password must be strong
 *          201:
 *              description: Account created successfully...
 *          400:
 *              description: Validation error
 *          409:
 *              description: User already exists.
 *          500:
 *              description: Internal server error
 *          499:
 *              description: This fields are required
 */

exports.signup = async (req, res) => {
    try {
        const saltRound = 10;
        const { password, ...data } = req.body;
        if (!req.body.password) {
            return res.status(499).send({
                success: false,
                message: 'This fields are required'
            });
        };
        const isStrongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            .test(password);
        if (!isStrongPassword) {
            return res.status(401).send({
                success: false,
                message: 'Password must be strong'
            });
        };
        const User_data = new User({ ...data, password: await bcrypt.hash(password, saltRound) });
        await User_data.save();
        sendEmail(req.body, process.env.PORT);
        res.status(201).send({
            success: true,
            message: 'Account created successfully...'
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map((err) => err.message);
            res.status(400).json({
                success: false,
                error: 'Validation Error',
                details: validationErrors
            });
        } else if (error.code === 11000) {
            res.status(409).json({
                success: false,
                error: 'Duplicate key violation',
                message: `User already exists.`
            });
        } else {
            console.log(error);
            res.status(500).json({
                success: false,
                error: 'Internal Server Error',
                err: error,
            });
        };
    };
};

/**
 * @swagger
 * /api/login:
 *  post:
 *      tags:
 *          - API
 *      summary: login to your account
 *      requestBody:
 *          description: please login to your account or app
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string 
 *                          password:
 *                              type: string
 *      responses:
 *          401:
 *              description: email or password is wrong
 *          200:
 *              description: User logged in successful...
 *          500:
 *              description: Internal server error
 *          499:
 *              description: This fields are required
 */

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(499).send({
                success: false,
                message: 'This fields are required'
            });
        };
        const user = await User.findOne({ email });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).send({
                success: false,
                message: 'email or password is wrong'
            });
        };
        const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '6h' });
        res.cookie('token', token, {
            httpOnly: true,
            scure: true,
            maxAge: 21600000,
            sameSite: 'Lax',
        })
        res.status(200).send({
            success: true,
            message: 'User logged in successful...'
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            error
        });
    };
};

/**
 * @swagger
 * /api/profile:
 *  get:
 *      tags:
 *          - API
 *      summary: fetch the user profile
 *      description: Get the user whose logged in.
 *      responses:
 *          200:
 *              description: User profile fetched successfully...
 *          500:
 *              description: Internal server error
 */

exports.userProfile = async (req, res) => {
    try {
        const profile = await User.findOne(
            { email: req.user.email },
            { __v: 0, isVerified: 0, isVisited: 0 },
        );
        res.status(200).send({
            success: true,
            message: 'User profile fetched successfully...',
            profile,
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            error,
        });
    };
};

exports.emailConfirmation = async (req, res) => {
    try {
        const email = decodeURI(req.query.email);
        await User.findOneAndUpdate({ email }, { $set: { isVerified: true, isVisited: true } });
        res.status(200).json({
            success: true,
            message: 'Thanks! your email address has been confirmed',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error,
        });
    };
};

async function sendEmail(info, PORT) {
    try {
        const body = `
        <strong>Hello ${info.username}</strong>,

        <p>Thanks for joining Innobyte services! We're super excited to welcome you aboard. 
        Here are the details of your new account:</p>

        <strong>Account Detailes:</strong><br><br>

        <b>Username:</b> ${info.username}<br>
        <b>Email:</b> ${info.email} 

        <p>Just click the link below to confirm your email address and get started.</p>
        <a href="http://localhost:${PORT}/api/confirm?email=${encodeURI(info.email)}">Click Here</a>

        <p>If you've got any questions or need more help, just drop a line to our support team 
        at hr.innobyteservices@gmail.com or simply hit reply to this email.</p>

        <p>Thanks for coming onboard with InnoByte Services. 
        We're really excited about helping you reach your goals!</p>

        <strong>Take care</strong>,

        <p>Talent Acquisition Team</p>
        <b>InnoByte Services</b>
        `;
        const transPorter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            pool: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS,
            },
        });
        const data = await transPorter.sendMail({
            from: `<hr.innobyteservices@gmail.com>`,
            to: `${info.email}`,
            subject: 'Welcome to InnoByte Services - Please Confirm Your Email Address',
            text: 'mail by Innobyte services',
            html: body,
        });
        console.log(`${data.messageId} \nEmail sent successfully...`);
    } catch (error) {
        console.log(error);
    };
};