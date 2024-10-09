// const bcryptjs = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/user.models'); // Ensure you import the User model

// const updateUser = async (req, res) => {
//     if (req.user.id !== req.params.id) {
//         return res.status(401).json({
//             message: "You can only update your own account",
//         });
//     }

//     try {
//         if (req.body.password) {
//             req.body.password = bcryptjs.hashSync(req.body.password, 10);
//         }
//         const updatedUser = await User.findByIdAndUpdate(
//             req.params.id,
//             {
//                 $set: {
//                     username: req.body.username,
//                     email: req.body.email,
//                     password: req.body.password,
//                     avatar: req.body.avatar,
//                 },
//             },
//             { new: true } 
//         );

//         if (!updatedUser) {
//             return res.status(404).json({ message: "User not found" });
//         }
//         const token = jwt.sign({ id: updatedUser._id }, process.env.JWT_SECRET, {
//             expiresIn: '1h', // Set an expiration time for the token
//         });

//         res.status(200).json({
//             success: true,
//             username: updatedUser.username,
//             email: updatedUser.email,
//             avatar: updatedUser.avatar,
//             token, // Include the new token
//             message: "User updated successfully",
//         });
//     } catch (error) {
//         // Catch any errors and send a response with an error message
//         res.status(500).json({
//             message: "Something went wrong while updating the user",
//             error: error.message,
//         });
//     }
// };

// module.exports = { updateUser };

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {errorHandler}=require('../utills/error')
const User = require('../models/user.models');
const Listing=require('../models/listing.module')



 const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only update your own account!'));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only delete your own account!'));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie('access_token');
    res.status(200).json('User has been deleted!');
  } catch (error) {
    next(error);
  }
};

const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, 'You can only view your own listings!'));
  }
};

const getUser = async (req, res, next) => {
  try {
    
    const user = await User.findById(req.params.id);
  
    if (!user) return next(errorHandler(404, 'User not found!'));
  
    const { password: pass, ...rest } = user._doc;
  
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

module.exports = { updateUser,deleteUser,getUserListings,getUser };