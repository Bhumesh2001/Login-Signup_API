const { User } = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.verifyUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).send({
                success: false,
                message: 'Login please...',
            });
        };
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const login_user = await User.findOne({ email: decoded.email }, { __v: 0 });
        req.user = login_user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).send({
                success: false,
                message: 'Your session has expired',
            });
        };
        res.status(500).send({
            success: false,
            message: 'Internal server error',
            error,
        });
    };
};

exports.verify_isVisited = async (req, res, next) => {
    try {
        const email = decodeURI(req.query.email);
        const User_ = await User.findOne({ email });
        if(User_.isVisited){
            return res.status(200).json({
                success: false,
                message: 'This link has been expired',
            });
        };
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error,
        });
    };
};