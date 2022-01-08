"use strict";
require("dotenv").config();
const Response = require(`../../../utils/response`);

const signUp = async (ctx) => {
  const { username, email, password, gender, phoneNumber } = ctx.request.body;

  if (!username || !email || !password || !gender || !phoneNumber)
    return Response.notFound(ctx, {
      message: "Missing parameter input!",
      statusCode: 400,
    });

  let user = null;
  try {
    user = await strapi.services.customer.findOneEmail(email);
  } catch (error) {
    console.log(error);
    return Response.internalServerError(ctx, {
      data: null,
      message: `Server Error`,
      statusCode: 500,
    });
  }

  if (user)
    return Response.notAcceptable(ctx, {
      message: `${email} already exists. Please try a different email`,
      statusCode: 406,
    });

  try {
    user = await strapi
      .query(`customer`)
      .create({ username, email, password, gender, phoneNumber });
  } catch (error) {
    console.log(error);
    return Response.internalServerError(ctx, {
      data: null,
      message: `Server Error`,
      statusCode: 0,
    });
  }
  if (user) {
    try {
      await strapi.services.notification.createReportSignUp(user.id);
    } catch (error) {
      console.log(error);
      return Response.internalServerError(ctx, {
        data: null,
        message: `Server Error`,
        statusCode: 0,
      });
    }

    let data = {
      id: user.id,
      username: user.username,
      email: user.email,
      gender: user.gender,
      phoneNumber: user.phoneNumber,
    };
    return Response.created(ctx, {
      data: data,
      message: `Signed up successfully`,
      statusCode: 201,
    });
  }
  return Response.internalServerError(ctx, {
    data: null,
    message: `Server Error`,
    statusCode: 500,
  });
};

const logIn = async (ctx) => {
  const { email, password } = ctx.request.body;
  if (!email || !password)
    return Response.notFound(ctx, {
      message: "Missing parameter input!",
      statusCode: 400,
    });

  let user = null;
  try {
    user = await strapi.query(`customer`).findOne({ email, password });
  } catch (error) {
    console.log(error);
    return Response.internalServerError(ctx, {
      data: null,
      message: `Server Error`,
      statusCode: 0,
    });
  }
  if (user) {
    // create a response
    let data = {
      id: user.id,
      username: user.username,
      email: user.email,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth,
      phoneNumber: user.phoneNumber,
    };
    return Response.ok(ctx, {
      data: data,
      message: `Signed in successfully`,
      statusCode: 1,
    });
  }
  return Response.ok(ctx, {
    data: null,
    message: `User account or password incorrect!`,
    statusCode: 0,
  });
};

const forgotPassword = async (ctx) => {
  const { email } = ctx.request.body;
  if (!email)
    return Response.notFound(ctx, {
      message: "Missing parameter input!",
      statusCode: 400,
    });
  let user = null;
  try {
    user = await strapi.services.customer.findOneEmail(email);
  } catch (error) {
    console.log(error);
    return Response.internalServerError(ctx, {
      statusCode: 500,
      message: "Error Server",
    });
  }

  if (!user) {
    return Response.badRequest(ctx, {
      statusCode: 400,
      message: "Not Found",
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
      statusCode: 200,
      message: `OK`,
      data: email,
    });
  } catch (error) {
    console.log(error);
    return Response.internalServerError(ctx, {
      statusCode: 500,
      message: "Error Server",
    });
  }
};

const verifyOTP = async (ctx) => {
  const { email, OTP } = ctx.request.body;
  if (!OTP)
    return Response.notFound(ctx, {
      message: "Missing parameter input!",
      statusCode: 400,
    });

  let user = null;
  try {
    user = await strapi.services.customer.findOneEmail(email);
  } catch (error) {
    console.log(error);
    return Response.internalServerError(ctx, {
      statusCode: 500,
      message: "Server Error",
    });
  }
  if (user.OTP === OTP)
    return Response.ok(ctx, {
      message: "OK",
      statusCode: 200,
      data: { email, OTP },
    });
  return Response.conflict(ctx, {
    message: `You've entered incorrect OTP code`,
    statusCode: 409,
  });
};

const resetPassword = async (ctx) => {
  const { password } = ctx.request.body;
  const url = ctx.request.url.split("/");
  const id = url[url.length - 1];
  if (!password)
    return Response.notFound(ctx, {
      message: "Missing parameter input!",
      statusCode: 400,
    });

  let user = null;
  try {
    user = await strapi.services.customer.resetPassword(id, password);
  } catch (error) {
    console.log(error);
    return Response.internalServerError(ctx, {
      statusCode: 500,
      message: "Server Error",
    });
  }
  if (!user) {
    return Response.notFound(ctx, {
      message: `${id} doesn't exist`,
      statusCode: 400,
    });
  }

  // create notification
  try {
    await strapi.services.notification.createReportChangePassword(id);
  } catch (error) {
    console.log(error);
    return Response.internalServerError(ctx, {
      statusCode: 500,
      message: "Server Error",
    });
  }
  // successful
  return Response.ok(ctx, {
    message: "OK",
    statusCode: 200,
    data: { email: user.email, username: user.username },
  });
};

const changePassword = async (ctx) => {
  const { email, password, newPassword } = ctx.request.body;
  if (!email || !password || !newPassword)
    return Response.notFound(ctx, {
      message: "Missing parameter input!",
      statusCode: 400,
    });
  let user = null;
  try {
    user = await strapi.services.customer.checkLogin(email, password);
  } catch (error) {
    return Response.internalServerError(ctx, {
      message: "Server Error",
      statusCode: 500,
    });
  }
  if (!user) {
    return Response.notFound(ctx, {
      message: "User account or password incorrect",
      statusCode: 404,
    });
  }
  try {
    await strapi.services.customer.updatePassword(email, newPassword);
  } catch (error) {
    return Response.internalServerError(ctx, {
      message: "Server Error",
      statusCode: 500,
    });
  }
  try {
    await strapi.services.notification.createReportChangePassword(user.id);
  } catch (error) {
    console.log(error);
    return Response.internalServerError(ctx, {
      data: null,
      message: `Server Error`,
      statusCode: 0,
    });
  }
  return Response.ok(ctx, {
    message: "Updated password successfully!",
    data: { email },
    statusCode: 200,
  });
};

module.exports = {
  changePassword: changePassword,
  forgotPassword: forgotPassword,
  signup: signUp,
  login: logIn,
  verifyOTP: verifyOTP,
  resetPassword: resetPassword,
};
