"use strict";
const Response = require(`../../../utils/response`);

const findOne = async (id) => {
  return await strapi.query("product").findOne({ id });
};

const Error500 = (error, title) => {
  console.log(`\n${title}\n`, error);
  return Response.internalServerError(ctx, {
    data: null,
    message: `Server Error`,
    statusCode: 500,
  });
};

module.exports = { findOne, Error500 };
