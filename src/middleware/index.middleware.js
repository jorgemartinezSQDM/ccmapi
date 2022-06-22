const jwt = require("jsonwebtoken");
const extension = require("./extensions/middleware.extension");


const userVerification = (req, res, next) => {
  const authorizationMethod = req.headers.authorization.split(" ")[0];

  if (authorizationMethod !== "Basic") {
    return res.status(401).json({message:"Authentication Error"});
  }

  const authorization = req.headers.authorization.split(" ")[1];
  extension.credentialVerification(authorization, next, res, req);
};

const tokenVerification = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({message:"Authentication Error"});
    }
    const authorization = req.headers.authorization.split(" ")[1];
    const authorizationMethod = req.headers.authorization.split(" ")[0];
    const decoded = jwt.verify(authorization, process.env.SECRET_SESSION);

    //console.log('decoded => ', decoded)

    if (authorizationMethod !== "Bearer") {
      return res.status(401).json({message:"Authentication Error"});
    }
    if (decoded) {
      extension.credentialVerification(decoded.authorization, next, res, req);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

module.exports = {
  userVerification,
  tokenVerification,
};