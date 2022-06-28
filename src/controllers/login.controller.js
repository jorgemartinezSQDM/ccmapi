const jwt = require('jsonwebtoken')

/**
 * Login Controller
 * @param {*} req 
 * @param {*} res 
 */
 
const login = (req, res) => {
  const authorization = req.headers.authorization.split(" ")[1];

  const access_token = jwt.sign({ authorization }, process.env.SECRET_SESSION, {
    expiresIn: process.env.TOKEN_EXPIRE_IN,
  });
  
  res
    .json({ access_token, type: "Bearer", expires_in: process.env.TOKEN_EXPIRE_IN })
    .status(200);
};

module.exports = {
    login
};