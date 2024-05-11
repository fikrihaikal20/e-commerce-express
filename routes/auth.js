const express = require("express");
const router = express.Router();
const validate = require("../app/middlewares/validation");
const validationRules = require("../app/validations/auth");
const controller = require("../app/controllers/auth");

router.post("/register", validationRules.Register(), validate, controller.Register);
router.post("/register/admin", validationRules.Register(), validate, controller.RegisterAdmin);
router.post("/login", validationRules.Login(), validate, controller.Login);

const routeProps = {
  route: router,
  needAuth: false,
};

module.exports = routeProps;
