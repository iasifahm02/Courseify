const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = express();
require('dotenv').config();

app.use(express.json());

//Connect MongoDB
const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { dbName: 'Course-selling-website', useUnifiedTopology: true})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

//Step 1: Define mongoose schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
})

const adminSchema = new mongoose.Schema({
  username: { type: String },
  password: { type: String }
})

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean
})

//Define mongoose models
const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Course = mongoose.model('Course', courseSchema);

//Step 2: Authentication using jwt
const secretKey = process.env.JWT_SECRET;
const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, secretKey, (err, user) => {
      if (err) return res.sendStatus(403);
  
      req.user = user;
      next();
    })
  }
  else {
    res.sendStatus(401); //forbidden
  }
}
 
// Admin routes
app.post('/admin/signup', async (req, res) => {
  // logic to sign up admin 
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (admin) {
    res.status(403).json({ message: "Admin already exists!" });
  }
  else {
    const newAdmin = new Admin({ username, password });
    await newAdmin.save(); //Save changes in database
    const token = jwt.sign({ username, role: 'admin' }, secretKey, { expiresIn: '1h' });
    res.json({ message: 'Admin created successfully!', token });
  }
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  const { username, password } = req.headers;
  Admin.findOne({ username, password }).then((admin) => {
    if (admin) {
      const token = jwt.sign({ username, role: 'admin' }, secretKey, { expiresIn: '1h' });
      res.json({ message: 'Logged in successfully!', token });
    }
    else {
      res.status(403).json({ message: "Invalid username and password!" });
    }
  })
});

app.post('/admin/courses', authenticateJwt, async (req, res) => {
  // logic to create a course
  const newCourse = new Course(req.body);
  await newCourse.save();
  res.json({ message: "Course created successfully", courseId: newCourse.id });
});

app.put('/admin/courses/:courseId', authenticateJwt, async (req, res) => {
  // logic to edit a course
  const course = await Course.findByIdAndUpdate(req.params.courseId, req.body);
  if (course) {
    res.json({ message: "Course updated successfully!" });
  }
  else {
    res.status(404).json({ message: "Course not found!" });
  }
});

app.get('/admin/courses', authenticateJwt, async (req, res) => {
  // logic to get all courses
  const courses = await Course.find({}); //It will return all the courses
  res.json({ courses: courses });
});

// User routes
app.post('/users/signup', async (req, res) => {
  // logic to sign up user
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    res.status(403).json({ message: 'User already exists' });
  } else {
    const newUser = new User({ username, password });
    await newUser.save();
    const token = jwt.sign({ username, role: 'user' }, secretKey, { expiresIn: '1h' });
    res.json({ message: 'User created successfully', token });
  }
});

app.post('/users/login', async (req, res) => {
  // logic to log in user
  const { username, password } = req.headers;
  const user = await User.findOne({ username, password });
  if (user) {
    const token = jwt.sign({ username, role: 'user' }, secretKey, { expiresIn: '1h' });
    res.json({ message: 'Logged in successfully', token });
  } else {
    res.status(403).json({ message: 'Invalid username or password' });
  }
});

app.get('/users/courses', authenticateJwt, async (req, res) => {
  // logic to list all courses
  const courses = await Course.find({ published: true });
  res.json({ courses });
});

app.post('/users/courses/:courseId', authenticateJwt, async (req, res) => {
  // logic to purchase a course
  const courseId = req.params.courseId;
  const course = await Course.findById(courseId); //Find course with id

  if(course){ //Course found
    const user = await User.findOne({username: req.user.username}); //find user with username
    
    if(user){
      user.purchasedCourses.push(courseId);
      await user.save();
      res.json({message: 'Course purchased successfully'});
    }
    else{
      res.status(403).json({message: 'User not exist'});
    }

  }
  else {
    res.status(404).json({message: 'Course not found!'});
  }
});

app.get('/users/purchasedCourses', authenticateJwt, async (req, res) => {
  // logic to view purchased courses
  const user = await User.findOne({username: req.user.username}); //Find the User
  if(user){
    const purchasedCourses = await Course.find({'_id': user.purchasedCourses});
    res.json({purchasedCourses: purchasedCourses});
  }
  else{
    res.status(404).json({message: 'User not found'});
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server is listening on port 3000');
});
