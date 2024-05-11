const flaverr = require("flaverr");
const { Order, Product, User, Sequelize } = require("../models");


const Create = async (data, transaction) => {
  try {
    const product = await Product.findByPk(data.product_id);
    if (!product) {
      throw flaverr('E_NOT_FOUND', new Error(`product not found`));
    }

    const user = await User.findByPk(data.user_id);
    if (!user) {
      throw flaverr('E_NOT_FOUND', new Error(`User not found`));
    }

    const order = await Order.create({
      product_id: data.product_id,
      user_id: user.id,
      quantity: data.quantity,
      total_price: data.quantity * product.price
    },{
      transaction,
    });

    return {
      status: true,
      data: order,
    };
  } catch (err) {
    return {
      status: false,
      err,
    };
  }
};

const GetOrder = async (id) => {
  try {
    const order = await Order.findAll({
      where: {
        user_id: id,
      },
      order: [['created_at', 'DESC']],
    });

    if (!order) {
      throw flaverr('E_NOT_FOUND', Error(`order not found`));
    }

    return {
      status: true,
      data: order,
    };
  } catch (err) {
    return {
      status: false,
      err,
    };
  }
};

const GetOrderByName = async ({id, name}) => {
  try {
    const order = await Order.findOne({
      where: { user_id: id },
      include: [{
        model: Product,
        where: { name: name }
      }],
      order: [['created_at', 'DESC']],
    });
    

    if (!order) {
      throw flaverr('E_NOT_FOUND', Error(`order not found`));
    }

    return {
      status: true,
      data: order,
    };
  } catch (err) {
    return {
      status: false,
      err,
    };
  }
};

const FindMany = async (
  params =  { user_id, product_id },
  pagination = { page: 1, per_page: 20 },
) => {
  try {
    const page = pagination.page ? Number.parseInt(pagination.page) : 1;
    const per_page = pagination.per_page ? Number.parseInt(pagination.per_page) : 20;

    const where = {};

    if (params.user_id) where.user_id = { [Sequelize.Op.eq]: params.user_id };
    if (params.product_id) where.product_id = { [Sequelize.Op.eq]: params.product_id };

    let result;
    if (!pagination.page && !pagination.per_page) {
      const rows = await Order.findAll({
        where,
        order: [['created_at', 'DESC']],
      });

      if (!rows.length) throw flaverr('E_NOT_FOUND', Error('Order not found'));

      result = { data: rows };

    } else {
      const { count, rows } = await Order.findAndCountAll({
        offset: (page - 1) * per_page,
        limit: per_page,
        where,
        order: [['created_at', 'DESC']],
      });

      if (!count) throw flaverr('E_NOT_FOUND', Error('Order not found'));

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

module.exports = {
  Create,
  GetOrder,
  GetOrderByName,
  FindMany
};
