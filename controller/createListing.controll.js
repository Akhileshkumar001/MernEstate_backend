
const  Listing  = require('../models/listing.module.js');
const { errorHandler } = require('../utills/error');

const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body); // Save data to MongoDB
        return res.status(201).json(listing); // Corrected status code and response
    } catch (error) {
        next(error); // Handle errors
    }
};
 const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);

  
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
  
    if (req.user.id !== listing.userRef) {
      return next(errorHandler(401, 'You can only delete your own listings!'));
    }
  
    try {
      await Listing.findByIdAndDelete(req.params.id);
      res.status(200).json('Listing has been deleted!');
    } catch (error) {
      next(error);
    }
  };
 const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    if (req.user.id !== listing.userRef) {
      return next(errorHandler(401, 'You can only update your own listings!'));
    }
  
    try {
      const updatedListing = await Listing.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.status(200).json(updatedListing);
    } catch (error) {
      next(error);
    }
  };

const  getListing=async(req,res,next)=>{
    try{
        const ItemListing=await Listing.findById(req.params.id)
        console.log("item", ItemListing);
        
        if (!ItemListing) {
            return next(errorHandler(404, 'Listing not found!'));
          }
          console.log("item is rpi");
          
        res.status(200).json({
            ItemListing,
            message:"successfully get item"
        })

    }catch(error){
        res.status(500).json({
            message:"somthing is  error"
        })
    }
   
}
  

module.exports = { createListing,deleteListing, updateListing, getListing};
