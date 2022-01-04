"use strict";
require("dotenv").config();
const Response = require(`../../../utils/response`);

const findOneByEmail = async (ctx) => {
  const { email } = ctx.request.body;
  try {
    const user = await strapi.services.customer.findOneEmail(email);
    if (user) {
      return Response.ok(ctx, { data: user.id, msg: "OK", status: 200 });
    }
    return Response.badRequest(ctx, {
      status: 400,
      msg: `${email} does not exist`,
    });
  } catch (error) {
    console.log(error);
    return Response.internalServerError(ctx, {
      status: 500,
      msg: "Error in Server",
    });
  }
};

const logIn = async (ctx) => {
  const { email, password } = ctx.request.body;
  if (!email || !password)
    return Response.notFound(ctx, {
      msg: "Missing parameter input!",
      status: 400,
    });
  let user = null;
  try {
    user = await strapi.query(`customer`).findOne({ email, password });
  } catch (error) {
    console.log(error);
    return Response.internalServerError(ctx, {
      data: null,
      msg: `Server Error`,
      status: 0,
    });
  }
  if (user) {
    let data = {
      id: user.id,
      username: user.username,
      email: user.email,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth,
      phoneNumber: user.phoneNumber,
    };
    return Response.ok(ctx, { data: data, msg: `OK`, status: 1 });
  }
  return Response.ok(ctx, {
    data: null,
    msg: `User account or password incorrect`,
    status: 0,
  });
};

const signUp = async (ctx) => {
  const { username, email, password, gender, phoneNumber } = ctx.request.body;

  if (!username || !email || !password || !gender || !phoneNumber)
    return Response.notFound(ctx, {
      msg: "Missing parameter input!",
      status: 400,
    });

  let user = null;
  try {
    const user = await strapi.services.customer.findOneEmail(email);
  } catch (error) {
    console.log(error);
    return Response.internalServerError(ctx, {
      data: null,
      msg: `Server Error`,
      status: 0,
    });
  }

  if (user)
    return Response.notAcceptable(ctx, {
      msg: `${email} already exists. Please try a different email`,
      status: 0,
    });

  try {
    user = await strapi
      .query(`customer`)
      .create({ username, email, password, gender, phoneNumber });
  } catch (error) {
    console.log(error);
    return Response.internalServerError(ctx, {
      data: null,
      msg: `Server Error`,
      status: 0,
    });
  }
  if (user) {
    let data = {
      id: user.id,
      username: user.username,
      email: user.email,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth,
      phoneNumber: user.phoneNumber,
    };
    return Response.created(ctx, {
      data: data,
      msg: `OK`,
      status: 201,
    });
  }
  return Response.internalServerError(ctx, {
    data: null,
    msg: `Server Error`,
    status: 500,
  });
};

const resetPassWord = async (ctx) => {
  const { email } = ctx.request.body;
  if (!email)
    return Response.notFound(ctx, {
      msg: "Missing parameter input!",
      status: 400,
    });
  let user = null;
  try {
    user = await strapi.services.customer.findOneEmail(email);
  } catch (error) {
    console.log(error);
    return Response.internalServerError(ctx, {
      status: 500,
      msg: "Error Server",
    });
  }
  if (!user) {
    return Response.badRequest(ctx, {
      status: 400,
      msg: "Not Found",
    });
  }

  const OTP = strapi.services.customer.generateOTP();
  try {
    await strapi.services.customer.updateOTP(email, OTP);
    strapi.services.email.send(
      process.env.user,
      email,
      "Code Verification",
      `Your password reset otp is ${OTP}`
    );
    return Response.ok(ctx, {
      status: 200,
      msg: `Successfully`,
      data: email,
    });
  } catch (error) {
    console.log(error);
    return Response.internalServerError(ctx, {
      status: 500,
      msg: "Error Server",
    });
  }
};

const verifyOTP = async (ctx) => {
  const { email, OTP } = ctx.request.body;
  if (!OTP)
    return Response.notFound(ctx, {
      msg: "Missing parameter input!",
      status: 400,
    });
  let user = null;
  try {
    user = await strapi.services.customer.findOneEmail(email);
  } catch (error) {
    console.log(error);
    return Response.internalServerError(ctx, {
      status: 500,
      msg: "Error Server",
    });
  }
  if (user.OTP === OTP)
    return Response.ok(ctx, {
      msg: "OK",
      status: 200,
      data: { email, OTP },
    });
  return Response.conflict(ctx, {
    msg: `You've entered incorrect OTP code`,
    status: 409,
  });
};

const changePassword = async (ctx) => {
  const { email, password, newPassword } = ctx.request.body;
  if (!email || !password || !newPassword)
    return Response.notFound(ctx, {
      msg: "Missing parameter input!",
      status: 400,
    });
  let user = null;
  try {
    user = await strapi.services.customer.checkLogin(email, password);
  } catch (error) {
    return Response.internalServerError(ctx, {
      msg: "Server Error",
      status: 500,
    });
  }
  if (!user) {
    return Response.notFound(ctx, {
      msg: "User account or password incorrect",
      status: 404,
    });
  }
  try {
    await strapi.services.customer.updatePassword(email, newPassword);
  } catch (error) {
    return Response.internalServerError(ctx, {
      msg: "Server Error",
      status: 500,
    });
  }
  return Response.ok(ctx, {
    msg: "Updated password successfully!",
    data: { email },
    status: 200,
  });
};

module.exports = {
  changePassword: changePassword,
  resetPassWord: resetPassWord,
  signup: signUp,
  login: logIn,
  findOneByEmail: findOneByEmail,
  verifyOTP: verifyOTP,
};
