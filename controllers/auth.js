const jwt = require('jsonwebtoken');
const User = require('../models/user');
const expressJwt = require('express-jwt');
const {validationResult, cookie} = require('express-validator');

exports.signup = (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }
    const user = new User(req.body);
    user.save((err, user) => {
        if(err) {
            return res.status(400).json({
                err: 'Not able to save user in DB'
            });
        }
        return res.json({
            name: user.name,
            email: user.email,
            id: user._id
        });
    });
};

exports.signin = (req, res) => {
    //Destructuring
    const {email, password} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }
    User.findOne({email}, (err, user) => {
        if(err || !user) {
            return res.status(400).json({
                error: "User Email does not exist!"
            });
        }
        if(!user.authenticate(password)) {
            return res.status(400).json({
                error: "Email and password does not match!"
            });
        }
        //create token
        const token = jwt.sign({ _id: user._id}, process.env.SECRET);
        //put token in cookie
        res.cookie("token", token, {expire: new Date() + 9999});
        //Send response to frontend (excluding password thats why create again)
        const {_id, name, email, role} = user;
        return res.json({token, user: {_id, name, email, role}});
    });
}

exports.signout = (req, res) => {
    res.clearCookie('token');
    res.json({
        message: 'User signout successful!'
    });
};

//Protected routes
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    //What's inside userProperty ?
    userProperty: "auth"
})

//Custom middlewares
exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!checker) {
        return res.status(403).json({
            error: 'Access denied!'
        });
    }
    next();
}

exports.isAdmin = (req, res, next) => {
    if(req.profile.role === 0) {
        return res.status(403).json({
            error: 'Access denied, you are not an Admin!' 
        });
    }
    next();
}
