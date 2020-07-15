"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _shopifyQuery = require("../helpers/shopifyQuery");

var _shopifyQuery2 = _interopRequireDefault(_shopifyQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pollQuery = function pollQuery(client) {
  var query = "\n    query {\n      currentBulkOperation {\n        id\n        status\n        errorCode\n        createdAt\n        completedAt\n        objectCount\n        fileSize\n        url\n        partialDataUrl\n      }\n    }\n  ";

  return (0, _shopifyQuery2.default)(client, query).then(function (resp) {
    return resp.data.currentBulkOperation;
  });
};

var bulkPollQuery = function bulkPollQuery(_ref) {
  var client = _ref.client,
      pollInterval = _ref.pollInterval,
      format = _ref.format,
      verbose = _ref.verbose;
  return new _promise2.default(function (resolve, reject) {
    var interval = setInterval((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
      var resp;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return pollQuery(client);

            case 2:
              resp = _context.sent;


              if (verbose) console.log(format("--- poll query response status: \"" + resp.status + "\""));

              if (resp.status === "COMPLETED") {
                resolve(resp);
                clearInterval(interval);
              } else if (resp.status === "CREATED") {
                // this should be fine, it means the bulk query was probbly created by another source
                // i.e. another build started at similar time
                // only issue would be is if the query running is not the same query we want,
                // but not sure if shopify API allows us to check that
              } else if (resp.status !== "RUNNING") {
                // todo: we may need to handle this if there is an error and use reject()
                console.log("Poll inteval response: ", resp);
                clearInterval(interval);
                reject("Error with poll query");
              }

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, undefined);
    })), pollInterval);
  });
};

exports.default = bulkPollQuery;