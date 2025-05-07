const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { User, Role } = require('../models');

module.exports = (passport) => {
  passport.use(new LocalStrategy({
      usernameField: 'email', // Use email instead of username
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        // Find the user by email
        const user = await User.findOne({
          where: { email }, // Look up by email
          include: { model: Role, as: 'role' }
        });

        if (!user) {
          return done(null, false, { message: 'Incorrect email' }); // Update error message
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password' });
        }

        // If everything is correct, return the user
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));

  // Serialize user (store user ID in the session)
  passport.serializeUser((user, done) => {
    done(null, user.user_id);
  });

  // Deserialize user (retrieve user from the session)
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findByPk(id, {
        include: { model: Role, as: 'role' }
      });
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};