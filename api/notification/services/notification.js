"use strict";

const createReportSignUp = async (customer) => {
  const content =
    "Congratulations, you have successfully registered, your information is secure, wish you have the products you want.";
  const action = "Sign up";
  return await strapi
    .query("notification")
    .create({ action, content, customer });
};

const createReportChangePassword = async (id) => {
  const content = "Your password has been changed";
  const action = "Change password";
  return await strapi
    .query("notification")
    .create({ action, content, customer: id });
};

module.exports = { createReportSignUp, createReportChangePassword };
