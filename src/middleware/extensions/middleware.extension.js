const base64 = require("base-64");
const userSchema = require("../../models/usuario.model")
const userHelper = require("../../controllers/helpers/general.helper")

const credentialVerification = (authorization, next, res, req) => {
  const userName = base64.decode(authorization).split(":")[0];
  const password = base64.decode(authorization).split(":")[1];
  req.headers.userName = userName
  req.headers.password = password
  if (
    process.env.SUPERUSER_USERNAME === userName &&
    process.env.SUPERUSER_PASSWORD === password
  ) {
    return next();
  } else {
    userVerification(userName, password, res, next)
  }
};

const userVerification = async (username, password, res, next) => {
    //console.log(username, password)
    const user = await userSchema.findOne({ where: {NombreUsuario: username}})
    if (!user) {
        
        return res.status(401).json({message:"username or password incorrect"})
    }

    if (!userHelper.comparePassword(password, user.Contrasena)) {
        return res.status(401).json({message:"username or password incorrect"})
    }

    next()
}

module.exports = {
  credentialVerification,
};