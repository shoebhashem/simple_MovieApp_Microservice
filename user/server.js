if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const mongoose = require('mongoose')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const db = require( './config/db' )
const User = require('./user')
const dotenv = require( "dotenv" )
const cors = require( 'cors' )
const axios = require( 'axios' )
const apiUrl = `${process.env.MOVIE_API_URL}:${process.env.MOVIE_APP_PORT}/movies`;




app.use(express.json());

app.use(cors());

db()

const initializePassport = require('./passport-config')
initializePassport(
  passport,
  async (email) => {
    return await User.findOne({ email: email }).exec();
  },
  async (id) => {
    return await User.findById(id).exec();
  }
);


app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/', checkAuthenticated, (req, res) => {
  res.render('index.ejs', { name: req.user.name, apiUrl: apiUrl })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    });
    await user.save();
    res.redirect('/login');
  } catch {
    res.redirect('/register');
  }
});

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
})


app.delete('/logout', (req, res) => {
  req.logOut((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed'});
    }
  })
  res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

app.get('/listMovies', async (req, res) => {
  try {
    //const apiUrl = process.env.MOVIE_API_URL || 'http://movieapi:5004';
    const response = await axios.get(apiUrl);
    const movies = response.data;

    res.render('allMovies.ejs', { movies });
  } catch (error) {
    console.error( 'Error fetching movies:', error);
    res.status(500).send('Error fetching movies.');
  }
});

app.listen(5005)