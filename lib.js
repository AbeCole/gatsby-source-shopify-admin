"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queryAll = exports.queryOnce = exports.printGraphQLError = undefined;

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

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

var _fp = require("lodash/fp");

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

// /**
//  * Request a query from a client.
//  * @author Angelo Ashmore
//  */
//
// function sleep (time) {
//     return new Promise((resolve) => setTimeout(resolve, time));
// }

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

// export const queryOnce = async ({ client, query, args = {first: 250}, attempts = 2 }) => {
//     requestCount += 1;
//     console.log("Query Once, attempts " + attempts, requestCount, resolveCount);
//     return new Promise((resolve, reject) => {
//         client.rawRequest(query, args)
//             .then(response => {
//                 resolveCount += 1;
//                 console.log("resolved", requestCount, resolveCount);
//                 resolve(response)
//             })
//             .catch( async (error) => {
//                 let { errors, extensions } = error.response
//
//                 if (errors && extensions) {
//
//                     // The mechanism below is a very basic attempt to avoid the Shopify rate limits
//                     // it doesn't work probably because if you have a large number of requests they
//                     // all get hit and slept at the same time. Meaning the next time they are tried
//                     // one or two will be successful but the rest will still fail.
//                     //
//                     // An improvement would be to use a 'queuing' mechanism, where when one requested
//                     // has been 'throttled' it is then added to a queue, and further requests are also
//                     // added into that queue and only process after the relevant amount of time has been
//                     // waited so the 'rate limit bucket' can refill
//
//                     let queryCost = extensions.cost.requestedQueryCost
//                     let { currentlyAvailable: available, restoreRate } = extensions.cost.throttleStatus
//
//                     // second argument of '5' seems obsolete, possibly a left over from a copy&paste
//                     await sleep(Math.max((queryCost - available)/restoreRate) * 1000, 5)
//
//                     if (attempts === 1) return reject(error) // base case
//                     queryOnce({ client, query, args, attempts: attempts - 1 })
//                         .then(response => {
//                           resolve(response)
//                           console.log("resolved inside", requestCount, resolveCount);
//                         })
//                         .catch(reject)
//
//                 } else {
//                     reject(error)
//                 }
//             })
//     })
// }

/**
 * Get all paginated data from a query. Will execute multiple requests as
 * needed.
 * @author Angelo Ashmore
 */

var queryAll = exports.queryAll = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(client, path, query) {
    var args = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { first: 250 };
    var aggregatedResponse = arguments[4];

    var _ref3, data, errors, extensions, headers, status, edges, nodes;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return queryOnce({
              client: client,
              query: query,
              args: args
            });

          case 2:
            _ref3 = _context2.sent;
            data = _ref3.data;
            errors = _ref3.errors;
            extensions = _ref3.extensions;
            headers = _ref3.headers;
            status = _ref3.status;
            edges = (0, _fp.get)([].concat((0, _toConsumableArray3.default)(path), ["edges"]), data);
            nodes = edges.map(function (edge) {
              return edge.node;
            });


            aggregatedResponse ? aggregatedResponse = aggregatedResponse.concat(nodes) : aggregatedResponse = nodes;

            if (!(0, _fp.get)([].concat((0, _toConsumableArray3.default)(path), ["pageInfo", "hasNextPage"]), false, data)) {
              _context2.next = 14;
              break;
            }

            args.after = (0, _fp.last)(edges).cursor;
            return _context2.abrupt("return", queryAll(client, path, query, args, aggregatedResponse));

          case 14:
            return _context2.abrupt("return", aggregatedResponse);

          case 15:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function queryAll(_x2, _x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();