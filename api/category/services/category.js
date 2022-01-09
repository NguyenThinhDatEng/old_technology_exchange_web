"use strict";

const findOneByTitle = async (title) => {
  return strapi.query("category").findOne({ title });
};

module.exports = { findOneByTitle };
