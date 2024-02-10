const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs')
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models')

const router = express.Router();


router.delete('/', async(req,res)=>{
    res.clearCookie('token');
    return res.json({message:'success'});
})

//!TEST:
// fetch('/api/session', {
//     method: 'DELETE',
//     headers: {
//       "Content-Type": "application/json",
//       "XSRF-TOKEN": "5dd1lyT1-KksmLu6idBRb7sFthw_TSYdDZO8"
//     }
//   }).then(res => res.json()).then(data => console.log(data));


router.post('/', async(req,res, next)=>{
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
