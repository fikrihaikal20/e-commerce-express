const { body } = require("express-validator");

const Login = () => [
  body("email").exists().notEmpty().withMessage("Username is required").isString().withMessage("Username must be a string"),
  body("password").exists().notEmpty().withMessage("Password is required").isString().withMessage("Password must be a string"),
]

const Register = () => [
  body("username").exists().notEmpty().withMessage("Username is required").isString().withMessage("Username must be a string"),
  body("password").exists().notEmpty().withMessage("Password is required").isString().withMessage("Password must be a string"),
  body("name").exists().notEmpty().withMessage("Name is required").isString().withMessage("Name must be a string"),
  body("contact").optional().isString().withMessage("Contact must be a string"),
  body("birthDate").optional().isDate().withMessage("Invalid birth date format"),
  body("gender").optional().isIn(['male', 'female', 'else']).withMessage("Invalid gender"),
  body("address").optional().isString().withMessage("Address must be a string"),
  body("email").exists().notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email format"),
]

module.exports = {
  Login,
  Register,
};
