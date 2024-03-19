const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'), // Look for JWT in Authorization header with 'jwt' scheme
  secretOrKey: process.env.JWT_SECRET, // Use the JWT secret from environment variable
};

const strategy = new JwtStrategy(options, async (payload, done) => {
  try {
    console.log(payload)
    const user = await User.findByEmail(payload.email);
    if (!user) {
      return done(null, false); // User not found
    }
    return done(null, user); // User object passed to request object
  } catch (err) {
    return done(err); // Handle errors
  }
});

passport.use(strategy);

module.exports = passport;
