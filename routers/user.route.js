const express = require('express');
const router = express.Router();
const { updateUser,deleteUser,getUserListings,getUser } = require('../controller/user.controller'); 
const {verifyToken }=require('../utills/verifyUser')

router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/getuserlisting/:id', verifyToken, getUserListings);
router.get('getUser/:id', verifyToken, getUser);
 // Fixed the route path

module.exports = router;