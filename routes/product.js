const express = require("express");
const router = express.Router();
const validate = require("../app/middlewares/validation");
const validationRules = require("../app/validations/product");
const controller = require("../app/controllers/product");

router.get("/", validationRules.FindAllProduct(), validate, controller.FindAllProduct);
router.get("/:id", validationRules.FindOneProduct(), validate, controller.FindOneproduct);
router.get("/:name/nama", validationRules.FindProductByName(), validate, controller.FindproductByName);

// fitur admin
router.post("/", validationRules.Create(), validate, controller.CreateOne);
router.put("/:id", validationRules.Update(), validate, controller.Update);
router.delete("/:id", validationRules.Destroy(), validate, controller.Destroy);

const routeProps = {
  route: router,
  needAuth: true,
};

module.exports = routeProps;
