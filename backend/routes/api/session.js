const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs')
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateLogin = [
    check('credential')
        .exists({checkFalsy:true})
        .notEmpty()
        .withMessage('Please provide a valid email or username.'),
    check('password')
        .exists({checkFalsy:true})
        .withMessage('Please provide a password.'),
        handleValidationErrors
];


router.get('/', (req,res)=>{
    const { user } = req;
    if (user) {
        const safeUser = {
            id:user.id,
            email:user.email,
            username: user.username
        };
        return res.json({
            user:safeUser
        });
    } else return res.json({user:null});
});

//!TEST the GET:


router.delete('/', async(req,res)=>{
    res.clearCookie('token');
    return res.json({message:'success'});
})

//!TEST:
// fetch('/api/session', {
//     method: 'DELETE',
//     headers: {
//       "Content-Type": "application/json",
//       "XSRF-TOKEN": "SGoh3CJz-34by-zE6R_z6ZaNkhyqc9GTClMA"
//     }
//   }).then(res => res.json()).then(data => console.log(data));


router.post('/', validateLogin, async(req,res, next)=>{
    const { credential, password } = req.body;

    const user = await User.unscoped().findOne({
        where:{
            [Op.or]: {
                username:credential,
                email:credential
            }
        }
    });
    if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())){
        const err = new Error('Login failed');
        err.status = 401;
        err.title = 'Login failed',
        err.errors = {credential : 'The provided credentials were invalid.'};
        return next(err);
    }

    const safeUser = {
        id:user.id,
        email: user.email,
        username: user.username,
    };

    await setTokenCookie(res, safeUser);
    return res.json({
        user:safeUser
    });
});

 //! Test validateLogin

//  fetch('/api/session', {
//     method: 'POST',
//     headers: {
//       "Content-Type": "application/json",
//       "XSRF-TOKEN": "i9yzwFyU-g1tB6hil7xckrI21v9WBYA-X2QY"
//     },
//     body: JSON.stringify({ credential: 'Demo-lition', password: '' })
//   }).then(res => res.json()).then(data => console.log(data));

// user: {id: 1, email: 'demo@user.io', username: 'Demo-lition'};

//!TEST WITH FETCH:

// fetch('/api/session', {
//     method: 'POST',
//     headers: {
//       "Content-Type": "application/json",
//       "XSRF-TOKEN": "5dd1lyT1-KksmLu6idBRb7sFthw_TSYdDZO8"
//     },
//     body: JSON.stringify({ credential: 'Demo-lition', password: 'password' })
//   }).then(res => res.json()).then(data => console.log(data));
//!PASSED
// fetch('/api/session', {
//     method: 'POST',
//     headers: {
//       "Content-Type": "application/json",
//       "XSRF-TOKEN": "5dd1lyT1-KksmLu6idBRb7sFthw_TSYdDZO8"
//     },
//     body: JSON.stringify({ credential: 'demo@user.io', password: 'password' })
//   }).then(res => res.json()).then(data => console.log(data));

//!TEST WITH EMAIL FETCH:
//user: {id: 1, email: 'demo@user.io', username: 'Demo-lition'}
//!PASSED

//!TEST WITH INVALID:
// fetch('/api/session', {
//     method: 'POST',
//     headers: {
//       "Content-Type": "application/json",
//       "XSRF-TOKEN": "5dd1lyT1-KksmLu6idBRb7sFthw_TSYdDZO8"
//     },
//     body: JSON.stringify({ credential: 'Demo-lition', password: 'Hello World!' })
//   }).then(res => res.json()).then(data => console.log(data));
//!PASSED:
// {title: 'Login failed', message: 'Login failed', errors: {…}, stack: 'Error: Login failed\n    at /Users/andrewfout/project-one/backend/routes/api/session.js:21:21'}
module.exports = router;
