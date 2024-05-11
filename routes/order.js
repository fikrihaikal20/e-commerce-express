const express = require("express");
const router = express.Router();
const validate = require("../app/middlewares/validation");
const validationRules = require("../app/validations/order");
const controller = require("../app/controllers/order");

router.post("/", validationRules.Create(), validate, controller.Create);
router.get("/", controller.GetOrder);
router.get("/:name/product", validationRules.GetByProductName(), validate, controller.GetOrderByName);

// fitur admin
router.get("/findAll", validationRules.FindAllOrder(), validate, controller.FindAllOrder);


const routeProps = {
  route: router,
  needAuth: true,
};

module.exports = routeProps;
