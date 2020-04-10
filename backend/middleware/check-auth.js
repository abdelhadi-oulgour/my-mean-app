const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; //we split and get the second element because the token will be like 'Bearer ff5rewf7wef4e7wfwe7...' as usually used (Bearer word is optional)
    const decodedToken = jwt.verify(token, process.env.JWT_KEY) // process.env.JWT_KEY is in nodemon.json
    // enrich token adding userData field
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };

    console.log(decodedToken);
    next();
  } catch (error) {
    res.status(401).json({ message: 'You are not authenticated!' });
  }
}
