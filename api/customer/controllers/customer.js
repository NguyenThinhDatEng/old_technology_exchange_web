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
  const user = await strapi
    .query(`customer`)
    .findOne({ email, password }, ["customer.email", "customer.id"]);
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
  const { username, email, password, gender, dateOfBirth, phoneNumber } =
    ctx.request.body;
  console.log(ctx.request.body);
  const emailCheck = await strapi.query(`customer`).findOne({ email });
  if (emailCheck)
    return Response.notAcceptable(ctx, {
      msg: `${email} already exists. Please try a different email`,
      status: 0,
    });
  const user = await strapi
    .query(`customer`)
    .create({ username, email, password, gender, dateOfBirth, phoneNumber });
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
      status: 1,
    });
  }
  return Response.internalServerError(ctx, {
    data: null,
    msg: `Server Error`,
    status: 0,
  });
};

const resetPassWord = async (ctx) => {
  const { email, otp } = ctx.request.body;
  try {
    const user = await strapi.services.customer.findOneEmail(email);
    if (user) {
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
      }
    }
    return Response.badRequest(ctx, {
      status: 400,
      msg: "Not Found",
    });
  } catch (error) {
    console.log(error);
    return Response.internalServerError(ctx, {
      status: 500,
      msg: "Error Server",
    });
  }
};

const changePassword = async (ctx) => {
  const { email, password, newPassword } = ctx.request.body;
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
      msg: "Your password is wrong",
      status: 400,
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
    data: newPassword,
    status: 200,
  });
};

module.exports = {
  changePassword: changePassword,
  resetPassWord: resetPassWord,
  signup: signUp,
  login: logIn,
  findOneByEmail: findOneByEmail,
};
