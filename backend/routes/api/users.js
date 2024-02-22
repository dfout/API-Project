// backend/routes/api/users.js
const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

// Middleware for validating sign up.

const validateSignup = [
    check('email')
        .exists({checkFalsy:true})
        .isEmail()
        .withMessage('Invalid email'),
    check('username')
        .exists({checkFalsy:true})
        .isLength({min:4, max:1}).withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .exists({values: 'undefined'}).withMessage('Username is required'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email'),
    check('firstName')
        .notEmpty()
        .withMessage('First Name is required'),
    check('lastName')
        .notEmpty()
        .withMessage('Last Name is required'),
    check('password')
        .exists({checkFalsy:true})
        .isLength({min:6})
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];


router.post('/', validateSignup, async (req,res)=>{
    const { firstName, lastName, email, password, username } = req.body;
    console.log(username)
    const hashedPassword = bcrypt.hashSync(password);


    const usernameExists = await User.findOne({
        where: {
            username: username
        }
    });

    // let errors = {};

    const emailExists = await User.findOne({
        where:{
            email:email
        }
    })

    const emailBool = emailExists !==null;
    const usernameBool = usernameExists !== null;
    if (emailBool || usernameBool){
        let err = new Error();
        let errors = {};
        err.message = 'User already Exists'
        if (emailBool){
            errors.email = 'User with that email already exists';
            console.log(errors)
        }
       if (usernameBool){
            console.log(errors)
            errors.username = 'User with that username already exists'
       }
        err.errors = errors;
        console.log(err)
        res.status(500);
        return res.json(err)
    }


    const user = await User.create ({ firstName, lastName, email, username, hashedPassword });

    const safeUser = {
        id:user.id,
        firstName:user.firstName,
        lastName: user.lastName,
        email:user.email,
        username:user.username
    };

    await setTokenCookie(res, safeUser);

    return res.json({
        user:safeUser
    });

})

module.exports = router;
