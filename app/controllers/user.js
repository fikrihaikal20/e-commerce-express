const flaverr = require("flaverr");
const { success } = require("../services/httpRes");
const transactionRepo = require("../repositories/transaction");
const user = require("../repositories/user");

const library = {};
library.FindAllUser = async (req, res, next) => {
  try {
    const {
      username, name, email, page, per_page
    } = req.query;
    const params = { username, name, email };
    const pagination = { page, per_page };
    const isAdmin = req.user.is_admin;

    if (!isAdmin) {
      throw flaverr('E_UNAUTHORIZED', Error(`Unauthorized access. This action requires administrator privileges`));
    }

    const user_data = await user.FindMany(params, pagination);

    if (!user_data.status) {
      throw user_data.err;
    }

    return success(res, 200, user_data.data);
  } catch (err) {
    return next(err);
  }
};

library.Ban = async (req, res, next) => {
  try {
    const {id} = req.params;
    const isAdmin = req.user.is_admin;

    if (!isAdmin) {
      throw flaverr('E_UNAUTHORIZED', Error(`Unauthorized access. This action requires administrator privileges`));
    }
    // start transaction
    transaction = await transactionRepo.Create();
    if (!transaction.status) throw transaction.err;

    const banUser = await user.Ban({id}, transaction.data);

    if (!banUser.status) {
      await transactionRepo.Rollback(transaction.data);
      throw banUser.err;
    }
    
    //end transaction
    await transactionRepo.Commit(transaction.data);
    
    return success(res, 201, banUser.data);
  } catch (err) {
    return next(err);
  }
};

library.UnBan = async (req, res, next) => {
  try {
    const {id} = req.params;
    const isAdmin = req.user.is_admin;

    if (!isAdmin) {
      throw flaverr('E_UNAUTHORIZED', Error(`Unauthorized access. This action requires administrator privileges`));
    }
    // start transaction
    transaction = await transactionRepo.Create();
    if (!transaction.status) throw transaction.err;

    const banUser = await user.UnBan({id}, transaction.data);

    if (!banUser.status) {
      await transactionRepo.Rollback(transaction.data);
      throw banUser.err;
    }
    
    //end transaction
    await transactionRepo.Commit(transaction.data);
    
    return success(res, 201, banUser.data);
  } catch (err) {
    return next(err);
  }
};

module.exports = library;
