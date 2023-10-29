const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('./user')

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    try {
      const user = await User.findOne({ email: email }).exec();

      if (!user) {
        return done(null, false, { message: 'No user with that email' });
      }

      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Password incorrect' });
      }
    } catch (e) {
      return done(e);
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).exec();
      return done(null, user);
    } catch (e) {
      return done(e);
    }
  });
}

/*
function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    const user = getUserByEmail(email)
    if (user == null) {
      return done(null, false, { message: 'No user with that email' })
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      return done(e)
    }
  }
  */
/*

  //passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  //passport.serializeUser((user, done) => done(null, user.id))
  //passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  })
  
}
*/


module.exports = initialize