"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _nodeFetch = require("node-fetch");

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _bulkCreationQuery = require("../queries/bulkCreationQuery");

var _bulkCreationQuery2 = _interopRequireDefault(_bulkCreationQuery);

var _bulkPollQuery = require("../queries/bulkPollQuery");

var _bulkPollQuery2 = _interopRequireDefault(_bulkPollQuery);

var _fetchBulkData = require("./fetchBulkData");

var _fetchBulkData2 = _interopRequireDefault(_fetchBulkData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fetchShopifyData = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(objectType, helpers, query, parseAttrs) {
    var verbose, format, client, queryStatus, bulkOperation, pollStatus, data;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            verbose = helpers.verbose, format = helpers.format, client = helpers.client;


            if (verbose) console.log(format("-- attempting to start bulk " + objectType + " query"));

            _context.next = 4;
            return (0, _bulkCreationQuery2.default)(client, query);

          case 4:
            queryStatus = _context.sent;
            bulkOperation = queryStatus.bulkOperation;

            if (!(!bulkOperation || bulkOperation.status !== "CREATED")) {
              _context.next = 11;
              break;
            }

            // todo: better error handling (needs to be based on context)
            // for example below is an error we get when trying to start the app twice at same timeout
            // (i.e. production & Preview both deploying at same time)
            // bulk collections query failed [ { field: null, message: 'A bulk operation for this app and shop is already in progress: gid://shopify/BulkOperation/25094455338.' } ]
            console.log('outputing more details of bulkOperation for debug: ', bulkOperation);
            console.log('bulkOperation.status:', bulkOperation.status);
            console.error(format("bulk " + objectType + " query failed"), queryStatus.userErrors);
            return _context.abrupt("return", null);

          case 11:

            if (verbose) console.log(format("-- bulk " + objectType + " query response status \"" + bulkOperation.status + "\""));

            if (verbose) console.log(format("-- starting " + objectType + " poll"));

            _context.next = 15;
            return (0, _bulkPollQuery2.default)(helpers);

          case 15:
            pollStatus = _context.sent;

            if (!(!pollStatus || pollStatus.status !== "COMPLETED")) {
              _context.next = 19;
              break;
            }

            // todo: better error handling (needs to be based on context)
            console.error(objectType + " poll failed", pollStatus);
            return _context.abrupt("return", null);

          case 19:

            if (verbose) console.log(format("-- " + objectType + " poll response status \"" + pollStatus.status + "\""));

            if (verbose) console.log(format("-- starting to fetch bulk file \"" + pollStatus.url + "\""));

            _context.next = 23;
            return (0, _fetchBulkData2.default)(pollStatus.url, parseAttrs);

          case 23:
            data = _context.sent;


            if (verbose) console.log(format("-- finished fetching bulk file"));

            return _context.abrupt("return", data);

          case 26:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function fetchShopifyData(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = fetchShopifyData;