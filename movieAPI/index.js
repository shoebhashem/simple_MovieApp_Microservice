const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
//const passport = require('passport');
//const LocalStrategy = require('passport-local').Strategy;
const cors = require( 'cors' )
const db = require( './config/db' )
const dotenv = require( "dotenv" )
const axios = require( 'axios' )
const router = express.Router()

const app = express();
//app.use(bodyParser.json());
app.use(express.json())
app.use ( cors() )
dotenv.config()
const Movie = require('./movie')

const Port = process.env.PORT || 5004

db()

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define the route to add a movie
app.post('/movies', (req, res) => {
  const { title, year } = req.body;
  // Create a new Movie document and save it to the database
  const newMovie = new Movie({ title, year });
  newMovie.save()
    .then(() => {
      console.log('Movie has been successfully added to database');
    })
    .catch((err) => {
      console.error('Error saving movie:', err);
    });
});

  app.get('/movies', async (req, res) => {
    try {
      const movies = await Movie.find({});
      res.json(movies);

    } catch (err) {
      console.error('Error:', err);
      res.status(500).send('Error: ' + err.message);
    }
  });

 
app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});
