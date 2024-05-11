const flaverr = require("flaverr");
const { success } = require("../services/httpRes");
const transactionRepo = require("../repositories/transaction");
const product = require("../repositories/product");

const library = {};
library.CreateOne = async (req, res, next) => {
  try {
    const dataBody = req.body;
    const isAdmin = req.user.is_admin;

    if (!isAdmin) {
      throw flaverr('E_UNAUTHORIZED', Error(`Unauthorized access. This action requires administrator privileges`));
    }
    // start transaction
    transaction = await transactionRepo.Create();
    if (!transaction.status) throw transaction.err;

    const createUser = await product.CreateOne(
      dataBody,
      transaction.data
    );

    if (!createUser.status) {
      await transactionRepo.Rollback(transaction.data);
      throw createUser.err;
    }
    
    //end transaction
    await transactionRepo.Commit(transaction.data);
    
    return success(res, 201, createUser.data);
  } catch (err) {
    return next(err);
  }
};

library.FindAllProduct = async (req, res, next) => {
  try {
    const {
      name, price, page, per_page,
    } = req.query;
    const params = { name, price };
    const pagination = { page, per_page };

    const product_data = await product.FindMany(params, pagination);

    if (!product_data.status) {
      throw product_data.err;
    }

    return success(res, 200, product_data.data);
  } catch (err) {
    return next(err);
  }
};

library.FindOneproduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product_data = await product.FindOne(id);

    if (!product_data.status) {
      throw product_data.err;
    }

    return success(res, 200, product_data.data);
  } catch (err) {
    return next(err);
  }
};

library.FindproductByName = async (req, res, next) => {
  try {
    const { name } = req.params;

    const product_data = await product.FindByName(name);

    if (!product_data.status) {
      throw product_data.err;
    }

    return success(res, 200, product_data.data);
  } catch (err) {
    return next(err);
  }
};

library.Update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price, description } = req.body;
    const isAdmin = req.user.is_admin;

    if (!isAdmin) {
      throw flaverr('E_UNAUTHORIZED', Error(`Unauthorized access. This action requires administrator privileges`));
    }
    
    const transaction = await transactionRepo.Create();
    const updateProduct = await product.Update({id, name, price, description }, transaction.data);

    if (!updateProduct.status) {
      await transactionRepo.Rollback(transaction.data);
      throw updateProduct.err;
    }

    // end transaction
    await transactionRepo.Commit(transaction.data);

    return success(res, 200, updateProduct.data);
  } catch (err) {
    return next(err);
  }
};

library.Destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isAdmin = req.user.is_admin;

    if (!isAdmin) {
      throw flaverr('E_UNAUTHORIZED', Error(`Unauthorized access. This action requires administrator privileges`));
    }

    const product_data = await product.Destroy(id);

    if (!product_data.status) throw product_data.err;

    return success(res, 200, product_data.data);
  } catch (err) {
    return next(err);
  }
};


module.exports = library;
