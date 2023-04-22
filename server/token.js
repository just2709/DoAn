const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  const newToken = jwt.sign({ id }, 'test', {
    expiresIn: "7d",
  });
  return newToken;
};

module.exports = generateToken;
