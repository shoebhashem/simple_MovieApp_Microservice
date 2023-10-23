const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const app = express();

// Connect to MongoDB (using the service name from docker-compose.yml)
mongoose.connect('mongodb://mongodb:27018/movieapp2', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;

// Define Movie schema
const MovieSchema = new mongoose.Schema({
  title: String,
  year: Number
});
const Movie = mongoose.model('Movie', MovieSchema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the HTML page
app.use(express.static(path.join(__dirname, '../public')));

// Configure session and authentication
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy((username, password, done) => {
  // Replace with your own user authentication logic
  if (username === 'user' && password === 'password') {
    return done(null, { username: 'user' });
  } else {
    return done(null, false, { message: 'Incorrect username or password' });
  }
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login.html');
  }
};

// Get all movies (requires authentication)
app.get('/movies', isAuthenticated, async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new movie (requires authentication)
app.post('/movies', isAuthenticated, async (req, res) => {
  // Same as before, requires authentication
  // ...
});

// Delete a movie by ID (requires authentication)
app.delete('/movies/:id', isAuthenticated, async (req, res) => {
  // Same as before, requires authentication
  // ...
});

// Login endpoint
app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/index.html',
    failureRedirect: '/login.html'
  })
);

const PORT = 4001;  // Assuming this is Service 2

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
