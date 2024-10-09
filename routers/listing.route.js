const express=require('express')
const {createListing,deleteListing,updateListing}=require('../controller/createListing.controll')

const {verifyToken}=require('../utills/verifyUser')
const router=express.Router();

router.post('/create',verifyToken,createListing)
router.post('/delete',verifyToken,deleteListing)
router.post('/update/:id', verifyToken, updateListing);
module.exports = router;