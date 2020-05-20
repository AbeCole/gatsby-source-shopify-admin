"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var shopifyQuery = function shopifyQuery(client, query) {
  return client.rawRequest(query).catch(function (error) {
    // todo: handle error here
    console.log("shopifyQuery error: ", error);
  });
};

exports.default = shopifyQuery;