/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');

const validator = require('validator');

const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter name']
    },
    email: {
        type: String,
        required: [true, 'Please enter email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid string']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },
    passwordConfirm:{
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function(el){
                return el === this.password;
            },
            message: "Password not same"
        }
    },
    passwordChangedAt: Date
});


userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
    next();
})

userSchema.methods.correctPassword = async function(
    candidatePassword, 
    userPassword
){
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000, 
            10
        );
        return JWTTimestamp < changedTimestamp;
    }
    return false;
}

const User = mongoose.model('User', userSchema);

module.exports = User;