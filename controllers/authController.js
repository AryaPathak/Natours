const {promisify} = require('util');
// eslint-disable-next-line import/no-extraneous-dependencies
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const User = require("../models/userModel");
const sendEmail = require('../utils/email');



// eslint-disable-next-line arrow-body-style
const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}



const createSendToken = (user, statusCode, req, res) => {
    const token = signToken(user._id);
  
    res.cookie('jwt', token, {
      
      httpOnly: true,
      //secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
      secure: true
    });
    console.log("the token is   ", token)
    // Remove password from output
    user.password = undefined;
  
    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  };


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
    createSendToken(newUser, 201, req, res);
}

exports.login = async (req, res, next) => {
    console.log("this is login fun")
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
    // const token = signToken(user._id);

    // res.status(200).json({
    //     status: 'success',
    //     token
    // })
    // console.log("the token is   ", token)
    createSendToken(user, 200, req, res);
    
}

exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedOut', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ status: 'success' });
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
    else if (req.cookies.jwt) {
        token = req.cookies.jwt;
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
    const currentUser = await User.findById(decoded.id);
    if(!currentUser){
        const error = new Error('User not exist');
        error.status = 401;
        return next(error);
    }
    //check if user changed passsword after token issueed

    if(currentUser.changedPasswordAfter(decoded.iat)){
        const error = new Error('password changed recently');
        error.status = 401;
        return next(error);
    }
    
    req.user = currentUser;
    res.locals.user = currentUser;
    console.log("Protecttttt")
    next();
})


exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) {

        try{
            // 1) verify token
        const decoded = await promisify(jwt.verify)(
            req.cookies.jwt,
            process.env.JWT_SECRET
          );
    
          // 2) Check if user still exists
          const currentUser = await User.findById(decoded.id);
          if (!currentUser) {
            return next();
          }
    
          // 3) Check if user changed password after the token was issued
          // if (currentUser.changedPasswordAfter(decoded.iat)) {
          //   return next();
          // }
    
          // THERE IS A LOGGED IN USER
          res.locals.user = currentUser;
          return next(); 
        }catch (err){
            return next();
        }
    }
    next();
  };

// eslint-disable-next-line arrow-body-style
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            const error = new Error('You do not have permission for this action');
            error.status = 403; 
            return next(error);
        }
        next(); 
    };
}

exports.forgotPassword = async (req, res, next) => {
    //get user based on posted email
    const user = await User.findOne({email: req.body.email});
    if(!user){
        const error = new Error('No user with this email');
        error.status = 404;    
        console.log("No user with this email")
        return next(error); 
    }

    //generate random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({validaBeforeSave: false});


    //Send that to user email
    const resetURL = `${req.protocol}://:${req.get(
        'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot password? subit patch with new password and confirmPassword to: ${resetURL}`;
    

    try{
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message
        })
        
        res.status(200).json({
            status: 'success',
            message: 'token sent to email!'
        })
    }catch(err){
        user.PasswordResetToken = undefined;
        user.passwordExpires = undefined;
        await user.save({validaBeforeSave: false});

        const error = new Error('Thwew was an error, try again');
        error.status = 500;    
        return next(error); 
    }
    

}

exports.resetPassword = async (req, res, next) => {

    //get user based on token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex')

    const user = await User.findOne({
        PasswordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    //if token not expired ans there is user, set new password
    if(!user){
        const error = new Error('Token invalid/expired');
        error.status = 400;
        return next(error); 
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.PasswordResetToken = undefined;
    user.passwordExpires = undefined;
    await user.save();


    //update changedpassword at 


    //log in with jwt
    const token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token
    })

}


exports.updatePassword = async (req, res, next) => {
    //Get user
    const user = await User.findById(req.user.id).select('+password');

    //Check posted password
    if(!(await user.correctPassword(req.body.passwordCurrent, user.password))){
        const error = new Error('current password wrong');
        error.status = 401;
        return next(error); 
    }

    //If so update
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    //log user in, send jwt
    createSendToken(user, 200, res);

}