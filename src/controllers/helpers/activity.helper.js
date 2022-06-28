const JWT = (body, secret, cb) => {
  if (!body) {
    return cb(new Error("invalid jwtdata"));
  }
  require("jsonwebtoken").verify(
    body.toString("utf8"),
    secret,
    {
      algorithm: "HS256",
    },
    cb
  );
};


module.exports = {
  JWT
}