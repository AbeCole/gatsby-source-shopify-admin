"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _shopifyQuery = require("../helpers/shopifyQuery");

var _shopifyQuery2 = _interopRequireDefault(_shopifyQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bulkCreationQuery = function bulkCreationQuery(client, query) {
  var creationQuery = "\n    mutation {\n      bulkOperationRunQuery(\n       query: \"\"\"\n        " + query + "\n        \"\"\"\n      ) {\n        bulkOperation {\n          id\n          status\n        }\n        userErrors {\n          field\n          message\n        }\n      }\n    }\n  ";

  return (0, _shopifyQuery2.default)(client, creationQuery).then(function (resp) {
    return resp.data.bulkOperationRunQuery;
  });
};

exports.default = bulkCreationQuery;