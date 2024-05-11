const flaverr = require("flaverr");
const qs = require('querystring');
const { User, Sequelize } = require("../models");

const FindMany = async (
  params =  { username, name, email },
  pagination = { page: 1, per_page: 20 },
) => {
  try {
    const page = pagination.page ? Number.parseInt(pagination.page) : 1;
    const per_page = pagination.per_page ? Number.parseInt(pagination.per_page) : 20;

    const where = {};

    if (params.username) where.username = { [Sequelize.Op.like]: `%${qs.unescape(params.username)}%`};
    if (params.name) where.name = { [Sequelize.Op.like]: `%${qs.unescape(params.name)}%`};
    if (params.email) where.email = { [Sequelize.Op.like]: `%${qs.unescape(params.email)}%`};

    let result;
    if (!pagination.page && !pagination.per_page) {
      const rows = await User.findAll({
        attributes: { exclude: ['password', 'banned', 'createdAt', 'updatedAt', 'deletedAt']},
        where,
        order: [['created_at', 'DESC']],
      });

      if (!rows.length) throw flaverr('E_NOT_FOUND', Error('User not found'));

      result = { data: rows };

    } else {
      const { count, rows } = await User.findAndCountAll({
        attributes: { exclude: ['password', 'banned', 'createdAt', 'updatedAt', 'deletedAt'] },
        offset: (page - 1) * per_page,
        limit: per_page,
        where,
        order: [['created_at', 'DESC']],
      });

      if (!count) throw flaverr('E_NOT_FOUND', Error('User not found'));

      result = paginate({
        data: rows,
        count,
        page,
        per_page,
      });
    }

    return {
      status: true,
      data: result,
    };
  } catch (err) {
    return {
      status: false,
      err,
    };
  }
};

const Ban = async ({id}, transaction) => {
  try {
    const user = await User.findOne({
      where: {
        id: id,
      },
      transaction,
    });

    if (!user) {
      throw flaverr('E_NOT_FOUND', Error(`user not found`));
    }
    if (user.is_admin){
      throw flaverr('E_UNAUTHORIZED', Error(`you can't ban admin`));
    }
    if (user.banned){
      throw flaverr('E_ERROR', Error(`The user has already been banned`));
    }

    user.banned = true;
    await user.save({ transaction });

    return {
      status: true,
      data:  'success ban user',
    };
  } catch (err) {
    return {
      status: false,
      err,
    };
  }
};

const UnBan = async ({id}, transaction) => {
  try {
    const user = await User.findOne({
      where: {
        id: id,
      },
      transaction,
    });

    if (!user) {
      throw flaverr('E_NOT_FOUND', Error(`user not found`));
    }
    if (!user.banned){
      throw flaverr('E_ERROR', Error(`The user is not banned`));
    }

    user.banned = false;
    await user.save({ transaction });

    return {
      status: true,
      data: 'success unBan user',
    };
  } catch (err) {
    return {
      status: false,
      err,
    };
  }
};


module.exports = {
  FindMany,
  Ban,
  UnBan
};
