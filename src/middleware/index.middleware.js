const jwt = require("jsonwebtoken");
const extension = require("./extensions/middleware.extension");


const userVerification = (req, res, next) => {
  const authorizationMethod = req.headers.authorization.split(" ")[0];

  if (authorizationMethod !== "Basic") {
    return res.json({message:"Authentication Error"}).status(401);
  }

  const authorization = req.headers.authorization.split(" ")[1];
  extension.credentialVerification(authorization, next, res, req);
};

const tokenVerification = (req, res, next) => {
  try {
    const authorization = req.headers.authorization.split(" ")[1];
    const authorizationMethod = req.headers.authorization.split(" ")[0];
    const decoded = jwt.verify(authorization, process.env.SECRET_SESSION);

    if (authorizationMethod !== "Bearer") {
      return res.json({message:"Authentication Error"}).status(401);
    }
    if (decoded) {
      extension.credentialVerification(decoded.authorization, next, res, req);
    }
  } catch (error) {
    console.log(error);
    return res.json(error).status(500);
  }
};

module.exports = {
  userVerification,
  tokenVerification,
};