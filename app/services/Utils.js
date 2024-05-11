const jwt = require('jsonwebtoken');

function issueUserJwt(user_uuid) {
  const expiresIn = '1d';
  const secret = process.env.JWT_SECRET;
  const payload = {
    sub: user_uuid,
    is_admin : false,
    iat: Date.now(),
  };
  const token = jwt.sign(payload, secret, {
    expiresIn: expiresIn,
  });
  return {
    token: 'Bearer ' + token,
    expiresIn: expiresIn,
  };
}

function issueAdminJwt(admin_uuid) {
  const expiresIn = '1d';
  const secret = process.env.JWT_SECRET;
  const payload = {
    sub: admin_uuid,
    is_admin : true,
    iat: Date.now(),
  };
  const token = jwt.sign(payload, secret, {
    expiresIn: expiresIn,
  });
  return {
    token: 'Bearer ' + token,
    expiresIn: expiresIn,
  };
}

module.exports = {
  issueUserJwt,
  issueAdminJwt
};
