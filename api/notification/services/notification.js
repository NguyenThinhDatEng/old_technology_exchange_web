"use strict";

const createReportSignUp = async (customer) => {
  const content =
    "Congratulations, you have successfully registered, your information is secure, wish you have the products you want.";
  const action = "Sign up";
  return await strapi
    .query("notification")
    .create({ action, content, customer, link: "#" });
};

const createReportChangePassword = async (customer) => {
  const content = "Your password has been changed";
  const action = "Change password";
  return await strapi
    .query("notification")
    .create({ action, content, customer, link: "#" });
};

const createReportComment = async (
  customer,
  product,
  username,
  product_name
) => {
  const action = "Comment";
  const content = `${username} commented on your "${product_name}"`;
  const link = `localhost:3000/products/${product}`;
  return await strapi.query("notification").create({
    action,
    content,
    customer,
    link,
  });
};

const createReportCreateProduct = async (customer, product, product_name) => {
  return await strapi.query("notification").create({
    action: "Create product",
    content: `Product "${product_name}" has been posted successfully`,
    customer,
    link: `localhost:3000/products/${product}`,
  });
};

const createReportUpdateProduct = async (customer, product, product_name) => {
  return await strapi.query("notification").create({
    action: "Update product",
    content: `Product "${product_name}" has been updated successfully`,
    customer,
    link: `localhost:3000/products/${product}`,
  });
};

const createReportLogIn = async (customer, numberOfProduct) => {
  return await strapi.query("notification").create({
    action: "Log in",
    content: `There are ${numberOfProduct} of your products being displayed on the website. If you have exchanged any product, please delete it`,
    customer,
    link: `localhost:3000/profile/products`,
  });
};

module.exports = {
  createReportSignUp,
  createReportChangePassword,
  createReportComment,
  createReportCreateProduct,
  createReportUpdateProduct,
  createReportLogIn,
};
