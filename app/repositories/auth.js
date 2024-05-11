const flaverr = require("flaverr");

const bcrypt = require('bcrypt');
const { User } = require("../models");
const  {issueUserJwt, issueAdminJwt} = require('../services/Utils');
// const _ = require("lodash");

const Register = async (data, transaction) => {
  try {

    const existingUser = await User.findOne({
      where: {
        email: data.email,
      },
      transaction,
    });

    if (existingUser) {
      throw flaverr(`E_DUPLICATED`, Error(`User with email ${data.email} already exist`));
    };

    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;

    const user = await User.create(data, transaction);

    if (!user) throw flaver("E_ERROR", Error(`failed to create user`));

    return {
      status: true,
      data: null,
    };
  } catch (err) {
    return {
      status: false,
      err,
    };
  }
};

const RegisterAdmin = async (data, transaction) => {
  try {

    const existingUser = await User.findOne({
      where: {
        email: data.email,
      },
      transaction,
    });

    if (existingUser) {
      throw flaverr(`E_DUPLICATED`, Error(`User with email ${data.email} already exist`));
    };

    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;

    let createdata = {
      ...data,
      is_admin: true
    };
    const user = await User.create(createdata, transaction);

    if (!user) throw flaver("E_ERROR", Error(`failed to create admin`));

    return {
      status: true,
      data: null,
    };
  } catch (err) {
    return {
      status: false,
      err,
    };
  }
};

const Login = async (data, transaction) => {
  try {
    const user = await User.findOne({
      where: {
        email: data.email,
      },
      transaction,
    });

    if (!user) {
      throw flaverr(`E_NOT_FOUND`, Error(`User with email ${data.email} not found`));
    }

    if (user.banned) {
      throw flaverr(`E_UNAUTHORIZED`, Error(`User got banned`));
    }

    const passwordMatch = bcrypt.compareSync(
      data.password,
      user.password
    );

    if (!passwordMatch) {
      throw flaverr(`E_ERROR`, Error(`Password incorrect`));
    }

    let token;

    if (user.is_admin){
      token = issueAdminJwt(user.id);
    }else {
      token = issueUserJwt(user.id);
    }

    return {
      status: true,
      data: token,
    };
  } catch (err) {
    return {
      status: false,
      err,
    };
  }
};
module.exports = {
  Register,
  RegisterAdmin,
  Login
};
