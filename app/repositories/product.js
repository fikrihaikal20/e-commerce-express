const flaverr = require("flaverr");
const qs = require('querystring');
const { Product, Sequelize } = require("../models");

const CreateOne = async (data, transaction) => {
  try {

    const product = await Product.findOne({
      where: {
        name: data.name,
      },
      transaction,
    });

    if (product) {
      throw flaverr(`E_DUPLICATED`, Error(`Product with name ${data.name} already exist`));
    }

    let createdata = {
      name: data.name,
      price: data.price,
      description: data.description,
    };

    const create = await Product.create(createdata, {
      transaction,
    });

    return {
      status: true,
      data: create,
    };
  } catch (err) {
    return {
      status: false,
      err,
    };
  }
};

const FindMany = async (
  params =  { name, price },
  pagination = { page: 1, per_page: 20 },
) => {
  try {
    const page = pagination.page ? Number.parseInt(pagination.page) : 1;
    const per_page = pagination.per_page ? Number.parseInt(pagination.per_page) : 20;

    const where = {};

    if (params.name) where.name = { [Sequelize.Op.like]: `%${qs.unescape(params.name)}%`};
    if (params.price) where.price = { [Sequelize.Op.eq]: params.price };

    let result;
    if (!pagination.page && !pagination.per_page) {
      const rows = await Product.findAll({
        where,
        order: [['created_at', 'DESC']],
      });

      if (!rows.length) throw flaverr('E_NOT_FOUND', Error('Product not found'));

      result = { data: rows };

    } else {
      const { count, rows } = await Product.findAndCountAll({
        offset: (page - 1) * per_page,
        limit: per_page,
        where,
        order: [['created_at', 'DESC']],
      });

      if (!count) throw flaverr('E_NOT_FOUND', Error('Product not found'));

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

const FindOne = async (id) => {
  try {
    const product = await Product.findOne({
      where: {
        id,
      },
    });

    if (!product) {
      throw flaverr('E_NOT_FOUND', Error(`Product with id ${id} is not found`));
    }

    return {
      status: true,
      data: product,
    };
  } catch (err) {
    return {
      status: false,
      err,
    };
  }
};

const FindByName = async (name) => {
  try {
    const product = await Product.findOne({
      where: {
        name: {
          [Sequelize.Op.like]: `%${qs.unescape(name)}%`
        }
      },
    });

    if (!product) {
      throw flaverr('E_NOT_FOUND', Error(`product ${name} is not found`));
    }

    return {
      status: true,
      data: product,
    };
  } catch (err) {
    return {
      status: false,
      err,
    };
  }
};

const Update = async ({id, name, price, description}, transaction) => {
  try {
    const product = await Product.findByPk(id);

    if (!product) throw flaverr('E_NOT_FOUND', Error(`product with id ${id} not found`));

    if (product.name !== name) {
      const exist = await Product.findOne({
        where: {
          name: name,
        },

      });

      if (exist) throw flaverr('E_DUPLICATED', Error(`product ${name} already exist`));
    }

    if (name) product.name = name;
    if (price) product.price = price;
    if (description) product.description = description;

    await product.save({ transaction });

    return {
      status: true,
      data: product,
    };
  } catch (err) {
    return {
      status: false,
      err,
    };
  }
};

const Destroy = async (id) => {
  try {
    const product = await Product.findByPk(id);

    if (!product) throw flaverr('E_NOT_FOUND', Error(`product with id ${id} not found`));

    await product.destroy();

    return {
      status: true,
      data: product,
    };
  } catch (err) {
    return {
      status: false,
      err,
    };
  }
};

module.exports = {
  CreateOne,
  FindMany,
  FindOne,
  FindByName,
  Destroy,
  Update
};
