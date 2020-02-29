const jwt = require('jsonwebtoken');

const secret = 'secret';
const verifyMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const { userId } = jwt.verify(token, secret);
    if (userId !== req.params.id) throw new Error();
    next();
  } catch (error) {
    res.status(401).json('Invalid token');
  }
};

const verifyToken = (req) => {
  const userToken = req.headers.authorization.spli(' ')[1];
  return jwt.verify(userToken, secret);
};

const generateToken = (user) => jwt.sign({ userId: user._id }, secret, { expiresIn: '1h' });

module.exports = {
  verifyMiddleware,
  verifyToken,
  generateToken,
};
