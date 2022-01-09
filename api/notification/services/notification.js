"use strict";

const createReportSignUp = async (customer) => {
  const content =
    "Congratulations, you have successfully registered, your information is secure, wish you have the products you want.";
  const action = "Sign up";
  return await strapi
    .query("notification")
    .create({ action, content, customer, link: "#" });
};

const createReportChangePassword = async (id) => {
  const content = "Your password has been changed";
  const action = "Change password";
  return await strapi
    .query("notification")
    .create({ action, content, customer: id, link: "#" });
};

const createReportComment = async (customer, product, username, product_name) => {
  const action = "New comment";
  const content = `${username} commented on your ${product_name}`;
  const link = `localhost:3000/products/${product}`;
  return await strapi.query("notification").create({
    action,
    content,
    customer,
    link,
  });
};

module.exports = {
  createReportSignUp,
  createReportChangePassword,
  createReportComment,
};
