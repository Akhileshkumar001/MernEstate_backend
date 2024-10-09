const express = require('express');
const mongoose = require('mongoose');
const authRouter=require('./routers/authRouter')
const userRouter=require('./routers/user.route')
const listingRouter=require('./routers/listing.route')
// const cookieParser = require('cookie-parser');
// const session = require('express-session');
const cors = require('cors');

require('dotenv').config();

const app = express();


// dotenv.config()
app.use(express.json());
app.use(cors()); 

// app.use(cors({
//   origin: 'http://localhost:5173/',  // Replace with your frontend URL
//   credentials: true,                  // This is crucial to allow credentials (cookies)
// }));

app.get('/', (req, res) => {
  res.send('Hello World');
});
app.use('/auth/v1',authRouter);
app.use('/user/v2',userRouter);
app.use('/listing/v3',listingRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));