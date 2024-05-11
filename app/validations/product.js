const { body, query, param } = require('express-validator');

const Create = () => [
  body('name').notEmpty().withMessage('Name is required').isString().withMessage('Name must be a string'),
  body('price').notEmpty().withMessage('Price is required').isNumeric().withMessage('Price must be a number'),
  body('description').optional().isString().withMessage('Description must be a string'),
];

const FindAllProduct = () => {
  return [
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

const FindOneProduct = () => {
  return [
    param('id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid product_id'),
  ];
};

const FindProductByName = () => {
  return [
    param('name')
      .exists()
      .notEmpty()
      .isString()
      .unescape()
      .withMessage('please input a valid product name'),
  ];
};

const Destroy = () => {
  return [
    param('id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid product_id'),
  ];
};

const Update = () => {
  return [
    param('id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid satuan_id'),
    body('name')
      .optional()
      .notEmpty()
      .isString(),
    body('price')
      .optional()
      .notEmpty()
      .withMessage('Price is required')
      .isNumeric()
      .withMessage('Price must be a number'),
    body('description')
      .optional()
      .isString()
      .withMessage('Description must be a string'),
  ];
};

module.exports = {
  Create,
  FindAllProduct,
  FindOneProduct,
  FindProductByName,
  Destroy,
  Update
};
