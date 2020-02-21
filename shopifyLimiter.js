"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var queue = [];
var available = 1000;
var queueTimer = null;

var processQueue = function processQueue() {
  if (queue.length === 0) {
    queueTimer = null;
    return null;
  }

  var current = queue[0];

  var _current$args = current.args,
      client = _current$args.client,
      query = _current$args.query,
      _current$args$args = _current$args.args,
      args = _current$args$args === undefined ? { first: 250 } : _current$args$args,
      _current$args$attempt = _current$args.attempts,
      attempts = _current$args$attempt === undefined ? 2 : _current$args$attempt;


  return client.rawRequest(query, args).then(function (response) {
    console.log("successful response in shopifyLimiter", response);
    queueTimer = null;
    queue.shift();
    processQueue();
    // resolve(response);
  }).catch(function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(error) {
      var _error$response, errors, extensions;

      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _error$response = error.response, errors = _error$response.errors, extensions = _error$response.extensions;

              console.log("catch response in shopifyLimiter", errors);

              if (errors && extensions && errors[0].message === "Throttled") {
                queueTimer = null;
                calculateQueueDelay(extensions.cost);
              } else {
                // reject(error);
              }

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
};

var calculateQueueDelay = function calculateQueueDelay(cost) {
  available = cost.throttleStatus.currentlyAvailable;

  if (!queueTimer) {
    var delay = Math.max((cost.requestedQueryCost - available) / cost.throttleStatus.restoreRate) * 1000;

    queueTimer = setTimeout(function () {
      processQueue();
    }, delay);
  }
};

var shopifyLimiter = function shopifyLimiter(args, cost) {
  queue.push({
    args: args,
    cost: cost.requestedQueryCost
  });
  calculateQueueDelay(cost);
};

exports.default = shopifyLimiter;