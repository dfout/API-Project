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
        .withMessage('Please provide a valid email'),
    check('username')
        .exists({checkFalsy:true})
        .isLength({min:4})
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email'),
    check('password')
        .exists({checkFalsy:true})
        .isLength({min:6})
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];


router.post('/', validateSignup, async (req,res)=>{
    const { email, password, username } = req.body;
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create ({ email, username, hashedPassword });

    const safeUser = {
        id:user.id,
        email:user.email,
        username:user.username
    };

    await setTokenCookie(res, safeUser);

    return res.json({
        user:safeUser
    });

})

//*Passed
// fetch('/api/users', {
//     method: 'POST',
//     headers: {
//       "Content-Type": "application/json",
//       "XSRF-TOKEN": "VCx0cXFq-GIkR_UUo5hmcVrtTGYgJxIR2biQ"
//     },
//     body: JSON.stringify({
//       email: 'firestar@spider.man',
//       username: 'Firestar',
//       password: ''
//     })
//   }).then(res => res.json()).then(data => console.log(data));


//*Email is not an email
// fetch('/api/users', {
//     method: 'POST',
//     headers: {
//       "Content-Type": "application/json",
//       "XSRF-TOKEN": "VCx0cXFq-GIkR_UUo5hmcVrtTGYgJxIR2biQ"
//     },
//     body: JSON.stringify({
//       email: 'firestarspider.man',
//       username: 'Firestar',
//       password: 'isthisaproperpass'
//     })
//   }).then(res => res.json()).then(data => console.log(data));


//* Username is only 3 characters long
// fetch('/api/users', {
//     method: 'POST',
//     headers: {
//       "Content-Type": "application/json",
//       "XSRF-TOKEN": "VCx0cXFq-GIkR_UUo5hmcVrtTGYgJxIR2biQ"
//     },
//     body: JSON.stringify({
//       email: 'firestarspider.man',
//       username: 'Fir',
//       password: 'isthisaproperpass'
//     })
//   }).then(res => res.json()).then(data => console.log(data));

//* Username field is an email
// fetch('/api/users', {
//     method: 'POST',
//     headers: {
//       "Content-Type": "application/json",
//       "XSRF-TOKEN": "VCx0cXFq-GIkR_UUo5hmcVrtTGYgJxIR2biQ"
//     },
//     body: JSON.stringify({
//       email: 'firestar@spider.man',
//       username: 'firestar@spider.man',
//       password: 'isthisaproperpass'
//     })
//   }).then(res => res.json()).then(data => console.log(data));


//* password field is only 5 characters long
// fetch('/api/users', {
//     method: 'POST',
//     headers: {
//       "Content-Type": "application/json",
//       "XSRF-TOKEN": "VCx0cXFq-GIkR_UUo5hmcVrtTGYgJxIR2biQ"
//     },
//     body: JSON.stringify({
//       email: 'firestar@spider.man',
//       username: 'Firestar',
//       password: 'ottff'
//     })
//   }).then(res => res.json()).then(data => console.log(data));

//!TEST
// fetch('/api/users', {
//     method: 'POST',
//     headers: {
//       "Content-Type": "application/json",
//       "XSRF-TOKEN": "aWOBBFwc-Dl5ITSKCU5Tg2JXYl3h-_stxDf0"
//     },
//     body: JSON.stringify({
//       email: 'demo@user.io',
//       username: 'Spidey',
//       password: 'password'
//     })
//   }).then(res => res.json()).then(data => console.log(data));

// fetch('/api/users', {
//     method: 'POST',
//     headers: {
//       "Content-Type": "application/json",
//       "XSRF-TOKEN": "aWOBBFwc-Dl5ITSKCU5Tg2JXYl3h-_stxDf0"
//     },
//     body: JSON.stringify({
//       email: 'spidey@spider.man',
//       username: 'FakeUser1',
//       password: 'password'
//     })
//   }).then(res => res.json()).then(data => console.log(data));

// user: {id: 4, email: 'spidey@spider.man', username: 'Spidey'}

module.exports = router;
