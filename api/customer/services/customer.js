"use strict";

const findOneEmail = async function (email) {
  return await strapi.query(`customer`).findOne({ email });
};

const findOne = async (id) => {
  return await strapi.query(`customer`).findOne({ id });
};

const updateOTP = async function (email, OTP) {
  return await strapi.query(`customer`).update({ email }, { OTP });
};

const generateOTP = () => {
  // Declare a digits variable
  // which stores all digits
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

const updatePassword = async function (email, newPassword) {
  return await strapi
    .query(`customer`)
    .update({ email }, { password: newPassword });
};

const resetPassword = async function (id, password) {
  return await strapi.query("customer").update({ id }, { password });
};

const checkLogin = async function (email, password) {
  return await strapi.query("customer").findOne({ email, password });
};

module.exports = {
  findOneEmail,
  generateOTP,
  updateOTP,
  updatePassword,
  checkLogin,
  resetPassword,
  findOne,
};
