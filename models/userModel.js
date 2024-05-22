const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'username is required'],
        unique: true,
        minLength: 2,
        validate: {
            validator: function (value) {
                return /^[a-zA-Z0-9]{3,30}$/.test(value);
            },
            message: props => `${props.value} is not a valid username!`
        }
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        validate: {
            validator: function (value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: props => `${props.value} is not a valid email addres!`
        }
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isVisited: {
        type: Boolean,
        default: false
    },
}, {
    strict: 'throw'
});

exports.User = model('User', userSchema);