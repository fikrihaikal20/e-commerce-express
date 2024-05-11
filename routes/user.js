const express = require("express");
const router = express.Router();
const validate = require("../app/middlewares/validation");
const validationRules = require("../app/validations/user");
const controller = require("../app/controllers/user");

// fitur admin
router.get("/", validationRules.FindAllUser(), validate, controller.FindAllUser);
router.put("/ban/:id", validationRules.Ban(), validate, controller.Ban);
router.put("/unban/:id", validationRules.Ban(), validate, controller.UnBan);

const routeProps = {
  route: router,
  needAuth: true,
};

module.exports = routeProps;
