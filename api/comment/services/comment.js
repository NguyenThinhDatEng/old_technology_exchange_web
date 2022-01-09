"use strict";

const create = async (content, customer, product) => {
  return strapi.query("comment").create({ content, customer, product });
};

module.exports = { create };
