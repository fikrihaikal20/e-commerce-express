const { body, param, query } = require("express-validator");

const Create = () => [
  body("product_id")
    .exists()
    .notEmpty()
    .withMessage("Product ID is required")
    .isUUID()
    .withMessage("Product ID must be an UUID"),
  body("quantity")
    .exists()
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),
];

const GetByProductName = () => [
  param('name')
    .exists()
    .notEmpty()
    .isString(),
];

const FindAllOrder = () => {
  return [
    query("product_id")
      .optional()
      .notEmpty()
      .withMessage("Product ID is required")
      .isUUID()
      .withMessage("Product ID must be an UUID"),
    query("user_id")
      .optional()
      .notEmpty()
      .withMessage("user ID is required")
      .isUUID()
      .withMessage("user ID must be an UUID"),
    query('page')
      .optional()
      .notEmpty()
      .isInt({ min: 1 }),
    query('per_page')
      .optional()
      .notEmpty()
      .isInt({ min: 1 }),
  ];
};

module.exports = {
  Create,
  GetByProductName,
  FindAllOrder
};
