const { success } = require("../services/httpRes");
const transactionRepo = require("../repositories/transaction");
const auth = require("../repositories/auth");

const library = {};
library.Register = async (req, res, next) => {
  try {
    const dataBody = req.body;
    // start transaction
    transaction = await transactionRepo.Create();
    if (!transaction.status) throw transaction.err;

    const createUser = await auth.Register(
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

library.RegisterAdmin = async (req, res, next) => {
  try {
    const dataBody = req.body;
    // start transaction
    transaction = await transactionRepo.Create();
    if (!transaction.status) throw transaction.err;

    const createUser = await auth.RegisterAdmin(
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

library.Login = async (req, res, next) => {
  try {
    const dataBody = req.body;
    // start transaction
    transaction = await transactionRepo.Create();
    if (!transaction.status) throw transaction.err;

    const createUser = await auth.Login(
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


module.exports = library;
