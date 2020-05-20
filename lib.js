"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queryOnce = exports.printGraphQLError = undefined;

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _prettyjson = require("prettyjson");

var _prettyjson2 = _interopRequireDefault(_prettyjson);

var _limiter = require("./limiter");

var _limiter2 = _interopRequireDefault(_limiter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Print an error from a GraphQL client
 * @author Angelo Ashmore
 */

var printGraphQLError = exports.printGraphQLError = function printGraphQLError(e) {
  var prettyjsonOptions = { keysColor: "red", dashColor: "red" };

  if (e.response && e.response.errors) console.error(_prettyjson2.default.render(e.response.errors, prettyjsonOptions));

  if (e.request) console.error(_prettyjson2.default.render(e.request, prettyjsonOptions));
};

var limiter = (0, _limiter2.default)();

var queryOnce = exports.queryOnce = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(allArgs) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", new _promise2.default(function (resolve, reject) {
              return limiter(allArgs, { resolve: resolve, reject: reject });
            }));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function queryOnce(_x) {
    return _ref.apply(this, arguments);
  };
}();