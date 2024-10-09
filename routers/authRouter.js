const express=require("express")
const { signUp, Signin ,googleSignIn,signOut} = require('../controller/auth');
const {verifyToken}=require('../utills/verifyUser')
const router=express.Router();

router.post('/signup', signUp);
router.post('/signin',Signin)
router.post('/google', googleSignIn)
router.post('/signout',verifyToken, signOut)
module.exports = router;