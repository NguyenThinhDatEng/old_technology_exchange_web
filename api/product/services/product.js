"use strict";

const findOne = async (id) => {
  return await strapi.query("product").findOne({ id });
};

module.exports = { findOne };
