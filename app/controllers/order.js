const flaverr = require("flaverr");
const { success } = require("../services/httpRes");
const transactionRepo = require("../repositories/transaction");
const order = require("../repositories/order");

const library = {};
library.Create = async (req, res, next) => {
  try {
    const dataBody = req.body;
    const user_id = req.user.sub;
    // start transaction
    transaction = await transactionRepo.Create();
    if (!transaction.status) throw transaction.err;

    const process = { ...dataBody, user_id };

    const createOrder = await order.Create(
      process,
      transaction.data
    );

    if (!createOrder.status) {
      await transactionRepo.Rollback(transaction.data);
      throw createOrder.err;
    }

    //end transaction
    await transactionRepo.Commit(transaction.data);

    return success(res, 201, createOrder.data);
  } catch (err) {
    return next(err);
  }
};

library.GetOrder = async (req, res, next) => {
  try {
    const user_id = req.user.sub;

    const getOrder = await order.GetOrder(user_id);

    if (!getOrder.status) {
      throw getOrder.err;
    }

    return success(res, 200, getOrder.data);
  } catch (err) {
    return next(err);
  }
};

library.GetOrderByName = async (req, res, next) => {
  try {
    const user_id = req.user.sub;
    const { name } = req.params;

    const getOrder = await order.GetOrderByName({id: user_id, name});

    if (!getOrder.status) {
      throw getOrder.err;
    }

    return success(res, 200, getOrder.data);
  } catch (err) {
    return next(err);
  }
};

library.FindAllOrder = async (req, res, next) => {
  try {
    const {
      user_id, product_id, page, per_page,
    } = req.query;
    const params = { user_id, product_id };
    const pagination = { page, per_page };
    const isAdmin = req.user.is_admin;

    if (!isAdmin) {
      throw flaverr('E_UNAUTHORIZED', Error(`Unauthorized access. This action requires administrator privileges`));
    }

    const order_data = await order.FindMany(params, pagination);

    if (!order_data.status) {
      throw order_data.err;
    }

    return success(res, 200, order_data.data);
  } catch (err) {
    return next(err);
  }
};

module.exports = library;
