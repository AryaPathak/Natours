const {promisify} = require('util');
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');

const User = require("../models/userModel");


// eslint-disable-next-line arrow-body-style
const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}


exports.signup = async(req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    const token = signToken(newUser._id);
    
    try{
        res.status(201).json({
            status: 'success',
            token,
            data:{
                user: newUser
            }
        })

    }catch(err){
        res.status(404).json({
        status: 'fail',
        message: err
        })
    
    }
}

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    //check if email and password exists
    if (!email || !password) {
        const error = new Error('Please provide email and password');
        error.status = 400;
        return next(error);
    }


    //Check if user exists and password is correct
    const user = await User.findOne({ email}).select('+password');
    

    if(!user || !(await user.correctPassword(password, user.password))){
        const error = new Error('Incorrect email or password');
        error.status = 401;
        return next(error);
    }
    
    //If everything ok, send token to client

    const token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token
    })
    console.log("the token is   ", token)
    
}


exports.protect = (async (req, res, next) => {

    //Get token and check if its there
    let token;
    if(
        req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
    ){
        token = req.headers.authorization.split(' ')[1];
    }
    
    if(!token){
        const error = new Error('You are not logged in! please log in to acess...');
        error.status = 401;
        return next(error);
    }


    //Validate token
    let decoded;
    try{
        decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
        console.log(decoded)
    }catch(err){
        res.status(404).json({
            status: 'fail',
            message: "Invalid token/Password"
        })
    }
    
    //check if user exist
    const freshUser = await User.findById(decoded.id);
    if(!freshUser){
        const error = new Error('User not exist');
        error.status = 401;
        return next(error);
    }
    //check if user changed passsword after token issueed

    if(freshUser.changedPasswordAfter(decoded.iat)){
        const error = new Error('password changed recently');
        error.status = 401;
        return next(error);
    }

    req.user = freshUser;
    next();
})



// eslint-disable-next-line arrow-body-style
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            const error = new Error('You do not have permission for this action');
            error.status = 403; // 403 Forbidden
            return next(error);
        }
        next(); 
    };
}