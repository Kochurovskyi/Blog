const HttpError = require("../model/http-error");

const ser = {
  em: process.env.SER_E,
  pw: process.env.SER_P,
};

async function login(req, res, next) {
  const { email, password } = req.body;

  if (email !== ser.em || password !== ser.pw) {
    const error = new HttpError("Invalid Login/Password, could not login", 401);
    return next(error);
  }

  res.json({ message: "Logged in!" });
}

exports.login = login;
