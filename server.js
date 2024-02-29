const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/chatty-friends', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use user routes
app.use('/api', require('./routes/userRoutes'));

// Use thought routes
app.use('/api', require('./routes/thoughtRoutes'));

// Use reaction routes
app.use('/api', require('./routes/reactionRoutes'));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});