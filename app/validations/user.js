const { body, query, param } = require("express-validator");

const FindAllUser = () => {
  return [
    query('username')
      .optional()
      .notEmpty()
      .isString()
      .unescape(),
    query('email')
      .optional()
      .notEmpty()
      .isString()
      .unescape(),
    query('name')
      .optional()
      .notEmpty()
      .isString()
      .unescape(),
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

const Ban = () => {
  return [
    param('id')
      .exists()
      .notEmpty()
      .withMessage("user ID is required")
      .isUUID()
      .withMessage("user ID must be an UUID"),
  ];
};

module.exports = {
  FindAllUser,
  Ban
};
