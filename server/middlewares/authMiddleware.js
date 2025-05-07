const { StatusCodes } = require('http-status-codes');

exports.ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: req.t('error.Unauthorized') });
  };
  
exports.ensureRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: req.t('error.Unauthorized') });
    }
    if (!roles.includes(req.user.role.role_name)) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: req.t('error.ForbiddenAccessDenied') });
    }
    next();
  };
};
  