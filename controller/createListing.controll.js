
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
const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] };
    }

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
  

module.exports = { createListing,deleteListing, updateListing, getListing,getListings};
