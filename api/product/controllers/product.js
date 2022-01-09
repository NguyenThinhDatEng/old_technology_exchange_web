"use strict";
const Response = require(`../../../utils/response`);

const createPhone = async (ctx) => {
  const {
    name,
    price,
    describe,
    avatar,
    category,
    trademark,
    customer,
    sweep_frequency,
    ram,
    memory,
    screen_size,
  } = ctx.request.body;

  // check input
  if (
    !name ||
    !price ||
    !avatar ||
    !describe ||
    !category ||
    !trademark ||
    !customer
  )
    return Response.notFound(ctx, {
      message: "Missing parameter input!",
      statusCode: 404,
    });
  // get category
  let Category = null;
  try {
    Category = await strapi.services.category.findOneByTitle(category);
  } catch (error) {
    return strapi.services.product.Error500(error, "get category");
  }

  // get trademark
  let Trademark = null;
  try {
    Trademark = await strapi.services.trademark.findOneByTitle(trademark);
  } catch (error) {
    return strapi.services.product.Error500(error, "get trademark");
  }

  // optional
  const other_attributes = [
    {
      __component: "other-attributes.for-phone",
      sweep_frequency,
      ram,
      memory,
      screen_size,
    },
  ];

  // create product
  let product = null;
  try {
    product = await strapi.query("product").create({
      name,
      price,
      describe,
      avatar,
      category: Category.id,
      trademark: Trademark.id,
      other_attributes,
      customer,
    });
  } catch (error) {
    return strapi.services.product.Error500(error, "create product");
  }

  if (!product) {
    return Response.badRequest(ctx, {
      message: "error in product creation",
      statusCode: 400,
    });
  }

  // create information
  try {
    await strapi.services.notification.createReportCreateProduct(
      customer,
      product.id,
      name
    );
  } catch (error) {
    return strapi.services.product.Error500(error, "create information");
  }

  return Response.created(ctx, {
    message: "OK",
    statusCode: 201,
    data: ctx.request.body,
  });
};

const createLaptop = async (ctx) => {
  const {
    name,
    price,
    describe,
    avatar,
    category,
    trademark,
    customer,
    CPU,
    ram,
    memory,
    screen_size,
  } = ctx.request.body;

  // check input
  if (
    !name ||
    !price ||
    !avatar ||
    !describe ||
    !category ||
    !trademark ||
    !customer
  )
    return Response.notFound(ctx, {
      message: "Missing parameter input!",
      statusCode: 404,
    });

  // get category
  let Category = null;
  try {
    Category = await strapi.services.category.findOneByTitle(category);
  } catch (error) {
    return strapi.services.product.Error500(error, "get category");
  }

  // get trademark
  let Trademark = null;
  try {
    Trademark = await strapi.services.trademark.findOneByTitle(trademark);
  } catch (error) {
    return strapi.services.product.Error500(error, "get trademark");
  }

  // optional
  const other_attributes = [
    {
      __component: "other-attributes.for-laptop",
      CPU,
      ram,
      memory,
      screen_size,
    },
  ];

  // create product
  let product = null;
  try {
    product = await strapi.query("product").create({
      name,
      price,
      describe,
      avatar,
      category: Category.id,
      trademark: Trademark.id,
      other_attributes,
      customer,
    });
  } catch (error) {
    return strapi.services.product.Error500(error, "create product");
  }

  if (!product) {
    return Response.badRequest(ctx, {
      message: "error in product creation",
      statusCode: 400,
    });
  }

  // create information
  try {
    await strapi.services.notification.createReportCreateProduct(
      customer,
      product.id,
      name
    );
  } catch (error) {
    return strapi.services.product.Error500(error, "create information");
  }

  return Response.created(ctx, {
    message: "OK",
    statusCode: 201,
    data: ctx.request.body,
  });
};

const createTablet = async (ctx) => {
  const {
    name,
    price,
    describe,
    avatar,
    category,
    trademark,
    customer,
    use_demand,
    operating_system,
  } = ctx.request.body;

  // check input
  if (
    !name ||
    !price ||
    !avatar ||
    !describe ||
    !category ||
    !trademark ||
    !customer
  )
    return Response.notFound(ctx, {
      message: "Missing parameter input!",
      statusCode: 404,
    });

  // get category
  let Category = null;
  try {
    Category = await strapi.services.category.findOneByTitle(category);
  } catch (error) {
    return strapi.services.product.Error500(error, "get category");
  }

  // get trademark
  let Trademark = null;
  try {
    Trademark = await strapi.services.trademark.findOneByTitle(trademark);
  } catch (error) {
    return strapi.services.product.Error500(error, "get trademark");
  }

  // optional
  const other_attributes = [
    {
      __component: "other-attributes.for-tablet",
      use_demand,
      operating_system,
    },
  ];

  // create product
  let product = null;
  try {
    product = await strapi.query("product").create({
      name,
      price,
      describe,
      avatar,
      category: Category.id,
      trademark: Trademark.id,
      other_attributes,
      customer,
    });
  } catch (error) {
    return strapi.services.product.Error500(error, "create product");
  }

  if (!product) {
    return Response.badRequest(ctx, {
      message: "error in product creation",
      statusCode: 400,
    });
  }

  // create information
  try {
    await strapi.services.notification.createReportCreateProduct(
      customer,
      product.id,
      name
    );
  } catch (error) {
    return strapi.services.product.Error500(error, "create information");
  }

  return Response.created(ctx, {
    message: "OK",
    statusCode: 201,
    data: ctx.request.body,
  });
};

const createSmartWatch = async (ctx) => {
  const {
    name,
    price,
    describe,
    avatar,
    category,
    trademark,
    customer,
    watch_face_size,
    watch_case,
  } = ctx.request.body;

  // check input
  if (
    !name ||
    !price ||
    !avatar ||
    !describe ||
    !category ||
    !trademark ||
    !customer
  )
    return Response.notFound(ctx, {
      message: "Missing parameter input!",
      statusCode: 404,
    });

  // get category
  let Category = null;
  try {
    Category = await strapi.services.category.findOneByTitle(category);
  } catch (error) {
    return strapi.services.product.Error500(error, "get category");
  }

  // get trademark
  let Trademark = null;
  try {
    Trademark = await strapi.services.trademark.findOneByTitle(trademark);
  } catch (error) {
    return strapi.services.product.Error500(error, "get trademark");
  }

  // optional
  const other_attributes = [
    {
      __component: "other-attributes.for-smart-watch",
      watch_face_size,
      watch_case,
    },
  ];

  // create product
  let product = null;
  try {
    product = await strapi.query("product").create({
      name,
      price,
      describe,
      avatar,
      category: Category.id,
      trademark: Trademark.id,
      other_attributes,
      customer,
    });
  } catch (error) {
    return strapi.services.product.Error500(error, "create product");
  }

  if (!product) {
    return Response.badRequest(ctx, {
      message: "error in product creation",
      statusCode: 400,
    });
  }

  // create information
  try {
    await strapi.services.notification.createReportCreateProduct(
      customer,
      product.id,
      name
    );
  } catch (error) {
    return strapi.services.product.Error500(error, "create information");
  }

  return Response.created(ctx, {
    message: "OK",
    statusCode: 201,
    data: ctx.request.body,
  });
};

const updateOne = async (ctx) => {
  const data = ctx.request.body;
  const url = ctx.request.url.split("/");
  const id = url[url.length - 1];
  if (!data)
    return Response.notFound(ctx, {
      message: "Missing parameter input!",
      statusCode: 404,
    });

  // update information
  let product = null;
  try {
    product = await strapi.query("product").update({ id }, data);
  } catch (error) {
    return strapi.services.product.Error500(error, "update information");
  }

  if (!product) {
    return Response.badRequest(ctx, {
      message: "error in product update",
      statusCode: 400,
    });
  }

  // create notification
  try {
    await strapi.services.notification.createReportUpdateProduct(
      product.customer.id,
      product.id,
      product.name
    );
  } catch (error) {
    return strapi.services.product.Error500(error, "create notification");
  }

  return Response.ok(ctx, {
    data: data,
    message: "OK",
    statusCode: 200,
  });
};

module.exports = {
  createPhone,
  createLaptop,
  createTablet,
  createSmartWatch,
  updateOne,
};
