const express = require('express');
const db = require('./config/connection')
const routes = require('./routes')

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/chatty-friends', {
//   useUnifiedTopology: true,
//   useNewUrlParser: true,
//   // useCreateIndex: true,
//   // useFindAndModify: false
// });

// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes)

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`)
  })
})

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });