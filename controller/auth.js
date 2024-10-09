// const User = require("../models/user.models");
// const JWT = require('jsonwebtoken');
// const bcryptjs = require('bcryptjs');

// const signUp = async (req, res) => {
//     const { username, email, password } = req.body;

//     try {

//         const hashPassword = await bcryptjs.hash(password, 10);

//         const newUser = new User({
//             username,
//             email,
//             password: hashPassword,
//         });

//         await newUser.save();
//         res.status(201).json({ message: 'User created successfully!' });
//     } catch (error) {
//         res.status(500).json({ message: 'Error creating user', error });
//     }
// };
// const Signin = async (req, res) => {
//     const { email, password } = req.body;

//     try {

//         const validUser = await User.findOne({ email });
//         if (!validUser) {
//             return res.status(400).json({
//                 error: "User not found"
//             });
//         }

//         const isPasswordValid =bcryptjs.compare(password, validUser.password);
//         if (!isPasswordValid) {
//             return res.status(400).json({
//                 error: "Invalid password"
//             });
//         }
//         const token = JWT.sign({ id: validUser._id }, process.env.JWT_SECRET);

//         res.cookie('access_token', token, { httpOnly: true });

//         return res.status(200).json({
//             message: "Signin successful",
//             user: {
//                 id: validUser._id,
//                 email: validUser.email,
//                 username:validUser.username,
//                 token
//             }
//         });
//     } catch (error) {
//         return res.status(500).json({ error: 'Internal server error. Please try again.' });
//     }
// };

// const googleSignIn=async(req,res)=>{
//     try{
//         const user=await User.findOne({email:req.body.email})
//         if(user){
//             const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET);

//         res.cookie('access_token', token, { httpOnly: true });

//         return res.status(200).json({
//             message: "Signin successful",
//             user: {
//                 id: user._id,
//                 email: user.email,
//                 token
//             }
//         });

//         }else{
//             const generatedPassword=Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8);
//             const hashPassword=await bcryptjs.hash(generatedPassword,10);
//             const newUser=new User({
//                 username:req.body.name.split(" ").join("").toLowerCase()+Math.random().toString(36).slice(-4),
//                 email:req.body.email,
//                 password:hashPassword,
//                 avatar:req.body.photo
//             })
//             const res=await newUser.save()
//             const token=JWT.sign({id:newUser._id},process.env.JWT_SECRET)
//             res.cookies('access_token', token, { httpOnly: true })
//             return res.status(200).json({
//                 message: "Signin successful",
//                 user: {
//                     id: newUser._id,
//                     email: newUser.email,
//                     token
//                 }
//             });

//         }
//     }catch(error){
//         return res.status(500).json({ error: 'Internal server error. Please try again.' });
//     }
// }

// module.exports = {
//     signUp,
//     Signin,
//     googleSignIn
// };


const User = require("../models/user.models");
const { errorHandler } = require('../utills/error')
const JWT = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');


const signUp = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json('User created successfully!');
  } catch (error) {
    next(error);
  }
};

const Signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, 'User not found!'));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));
    const token = JWT.sign({ id: validUser._id }, process.env.JWT_SECRET);
    // req.session.token = token;
    const { password: pass, ...rest } = validUser._doc;
    // res
    //   .cookie('access_token', token, { httpOnly: true,secure: true, secure: process.env.NODE_ENV === 'production',sameSite: 'None',})

    res.status(200).json({ user: rest, token });

  } catch (error) {
    next(error);
  }
};

const googleSignIn = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(' ').join('').toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = JWT.sign({ id: validUser._id }, process.env.JWT_SECRET);
      // req.session.token = token;
      const { password: pass, ...rest } = validUser._doc;
      // res
      //   .cookie('access_token', token, { httpOnly: true,secure: true, secure: process.env.NODE_ENV === 'production',sameSite: 'None',})

      res.status(200).json({ user: rest, token });
    }

  } catch (error) {
    next(error);
  };

}

const signOut = async (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return next(errorHandler(401, 'No token provided, Unauthorized!'));
    }

    const token = authHeader.split(' ')[1];  // Extract Bearer token

    if (!token) {
      return next(errorHandler(401, 'Unauthorized, Token missing!'));
    }

    // Verify the token (this step is usually just to check if the token is valid)
    JWT.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return next(errorHandler(403, 'Token is invalid, Forbidden!'));
      }

      // Optionally, you can handle session invalidation or blacklisting the token here.
      // Since you're using localStorage, you can simply respond with a success message.

      res.status(200).json({ message: 'User has been logged out!', success: true });
    });
    
  } catch (error) {
    next(error);
  }
};

module.exports = { signOut };

module.exports = {
  signUp,
  Signin,
  googleSignIn,
  signOut
};
