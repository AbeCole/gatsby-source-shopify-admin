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

var executePublicationsQuery = function executePublicationsQuery(client) {
  var query = "\n    query {\n      publications(first: 100) {\n        edges {\n          node {\n            name\n            id\n          }\n        }\n      }\n    }\n  ";

  return (0, _shopifyQuery2.default)(client, query).then(function (resp) {
    return resp.data.publications;
  });
};

var publicationsQuery = function publicationsQuery(_ref) {
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
              return executePublicationsQuery(client);

            case 2:
              resp = _context.sent;


              if (verbose) console.log(format("--- publications query response status: \"" + resp.status + "\""));

              console.log('qweqweq', resp);
              // if (resp.status === "COMPLETED") {
              //   resolve(resp);
              //   clearInterval(interval);
              // } else if (resp.status !== "RUNNING") {
              //   // todo: we may need to handle this if there is an error and use reject()
              //   console.log("Poll inteval response: ", resp);
              //   clearInterval(interval);
              // }

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, undefined);
    })), pollInterval);
  });
};

exports.default = publicationsQuery;