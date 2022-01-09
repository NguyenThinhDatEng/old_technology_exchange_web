"use strict";
const Response = require(`../../../utils/response`);

const createOne = async (ctx) => {
  const { content, customer, product } = ctx.request.body;
  console.log(ctx.request.body);
  if (!content || !customer || !product)
    return Response.notFound(ctx, {
      message: "Missing parameter input!",
      statusCode: 404,
    });

  // get product
  let Product = null;
  try {
    Product = await strapi.services.product.findOne(product);
  } catch (error) {
    console.log("get product\n", error);
    return Response.internalServerError(ctx, {
      data: null,
      message: `Server Error`,
      statusCode: 500,
    });
  }
  if (!Product) {
    return Response.notFound(ctx, {
      message: "product not found!",
      statusCode: 404,
    });
  }

  // get user
  let User = null;
  try {
    User = await strapi.services.customer.findOne(customer);
  } catch (error) {
    console.log("get user\n", error);
    return Response.internalServerError(ctx, {
      data: null,
      message: `Server Error`,
      statusCode: 500,
    });
  }
  if (!User) {
    return Response.notFound(ctx, {
      message: "User not found!",
      statusCode: 404,
    });
  }

  // create notification
  try {
    await strapi.services.notification.createReportComment(
      Product.customer.id,
      product,
      User.username,
      Product.name
    );
  } catch (error) {
    console.log("\ncreate notification\n", error);
    return Response.internalServerError(ctx, {
      data: null,
      message: `Server Error`,
      statusCode: 500,
    });
  }

  // successful
  try {
    await strapi.services.comment.create(content, customer, product);
    return Response.ok(ctx, {
      message: "OK",
      statusCode: 200,
      data: { product: Product.name, user: User.username, content },
    });
  } catch (error) {
    console.log("comment.js", error);
    return Response.internalServerError(ctx, {
      data: null,
      message: `Server Error`,
      statusCode: 500,
    });
  }
};

module.exports = { createOne };
