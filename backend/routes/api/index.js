// backend/routes/api/index.js
const router = require('express').Router();
const { restoreUser } = require('../../utils/auth.js');
router.use(restoreUser);

const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');
const reviewsRouter = require('./reviews.js');
const bookingsRouter = require('./bookings.js')
const spotImageRouter = require('./spot-images.js')
const reviewImageRouter = require('./review-images.js')




router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/spots',spotsRouter)
router.use('/reviews', reviewsRouter);
router.use('/bookings', bookingsRouter);
router.use('/spot-images', spotImageRouter);
router.use('/review-images',reviewImageRouter);

router.post('/test', (req,res)=>{
  res.json({requestBody:req.body});
})






// router.post('/test', function(req, res) {
//     res.json({ requestBody: req.body });
// });



//!TEST ROUTE: PASSED FOR TOKEN COOKIE

// const { setTokenCookie } = require('../../utils/auth.js');
// const { User } = require('../../db/models');
// router.get('/set-token-cookie', async (_req, res) => {
//   const user = await User.findOne({
//     where: {
//       username: 'Demo-lition'
//     }
//   });
//   setTokenCookie(res, user);
//   return res.json({ user: user });
// });

//!TEST ROUTE: PASSED --shows null
// const { restoreUser } = require('../../utils/auth.js');


// router.use(restoreUser);

// router.get(
//   '/restore-user',
//   (req, res) => {
//     return res.json(req.user);
//   }
// );

// !on page:
// !{"id":1,"username":"Demo-lition","email":"demo@user.io","createdAt":"2024-02-10T18:04:50.590Z","updatedAt":"2024-02-10T18:04:50.590Z"}
// !Removed token cookie
// !Refreshed
// !then it is 'null' on the page

//!TESTING REQUIREAUTH:



// const { requireAuth } = require('../../utils/auth.js');
// // router.use(requireAuth)
//   router.get(
//   '/require-auth',
//   requireAuth,
//   (req,res) => {
//   return res.json(req.user);
//   }
// );
//!After reseting cookie:
// !{"id":1,"username":"Demo-lition","email":"demo@user.io","createdAt":"2024-02-10T18:04:50.590Z","updatedAt":"2024-02-10T18:04:50.590Z"}
/*

!Deleted token cookie and this error message shows up:
*/
//!"title":"Authentication required","message":"Authentication required","errors":{"message":"Authentication required"},"stack":
//!"Error: Authentication required\n    at requireAuth (/Users/andrewfout/project-one/backend/utils/auth.js:68:17)\n
//! at newFn (/Users/andrewfout/project-one/backend/node_modules/express-async-errors/index.js:16:20)\n    at Layer.handle [as handle_request] (/Users/andrewfout/project-one/backend/node_modules/express/lib/router/layer.js:95:5)\n    at next (/Users/andrewfout/project-one/backend/node_modules/express/lib/router/route.js:144:13)\n    at Route.dispatch (/Users/andrewfout/project-one/backend/node_modules/express/lib/router/route.js:114:3)\n    at newFn (/Users/andrewfout/project-one/backend/node_modules/express-async-errors/index.js:16:20)\n    at Layer.handle [as handle_request] (/Users/andrewfout/project-one/backend/node_modules/express/lib/router/layer.js:95:5)\n    at /Users/andrewfout/project-one/backend/node_modules/express/lib/router/index.js:284:15\n    at Function.process_params (/Users/andrewfout/project-one/backend/node_modules/express/lib/router/index.js:346:12)\n    at next (/Users/andrewfout/project-one/backend/node_modules/express/lib/router/index.js:280:10)"}


module.exports = router;
