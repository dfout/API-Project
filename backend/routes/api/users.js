// backend/routes/api/users.js
const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

router.post('/',async (req,res)=>{
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
