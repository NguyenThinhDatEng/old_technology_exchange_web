"use strict";

const findOneByTitle = async (title) => {
  return strapi.query("trademark").findOne({ title });
};

module.exports = { findOneByTitle };
