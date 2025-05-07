const passport = require('passport');
const { StatusCodes } = require('http-status-codes');

exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: info.message });
    }
    req.logIn(user, (err) => {
      if (err) return next(err);

      // You can return user info (except password) if needed
      return res.status(StatusCodes.OK).json({
        message: req.t('success.LoginSuccess'),
        user: {
          user_id: user.user_id,
          username: user.username,
          full_name: user.full_name,
          email: user.email,
          role: user.role.role_name,
        },
      });
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: req.t('error.LogoutFailed') });
    res.status(StatusCodes.OK).json({ message: req.t('success.LogoutSuccess') });
  });
};
