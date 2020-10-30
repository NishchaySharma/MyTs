var express = require('express');
const { check } = require('express-validator');
const { signout, signup, signin, isSignedIn } = require('../controllers/auth');

var router = express.Router();

router.post('/signup', [
    check('name', 'Name must be atleast 3 characters or more').isLength({ min: 3 }),
    check('email', 'Email is required!').isEmail(),
    check('password', 'Password should be atleast 3 character').isLength({ min: 3 }),
], signup);

router.post('/signin', [
    check('email', 'Email is required!').isEmail(),
    check('password', 'Password field is required').isLength({ min: 1 }),
], signin);

router.get('/signout', signout);

router.get('/testRoute', isSignedIn, (req, res) => {
    //res.send('A Protected Route!');
    res.json(req.auth);
});

module.exports = router;
