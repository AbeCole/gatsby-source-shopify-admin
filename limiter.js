'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Author: Abe Cole (me@abecole.com)
//
// Improvements:
//  - We currently implement a 'queue' mechanism, so the next request is not made until
//    the current request finishes. This may not be optimal as it unneccesarily blocks
//    lower cost requests that could be processed in parellel. For example if we have 3
//    queued requests costing 800, 200 & 50, with a bucket limit of 1000 currently at 700
//    (refresh of 50/sec), after 2 seconds the 800 request can start processing, if that
//    request takes 4 seconds to process there is actually another 200 units available,
//    however the 200 cost request in the queue is not sent until the 800 cost request
//    finishes.
//
//    To improve this we could look at calculating and estimating when a request might be
//    successful and send it for processing regardless of whether the current request has
//    finished. This is likely to get more 'wasted' requests but would be overall quicker.
//
//  - The cost calculations are currently using attributes specific to our test environment
//    (currently Shopify), it should be made more ambigious for public use. I.e. cost.expense,
//    cost.refreshRate, cost.available

var queue = [];
var available = 1000;
var queueTimer = null;

var request = function request(allArgs, promise) {
  var calledByTimeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var client = allArgs.client,
      query = allArgs.query,
      _allArgs$args = allArgs.args,
      args = _allArgs$args === undefined ? { first: 250 } : _allArgs$args;
  var resolve = promise.resolve,
      reject = promise.reject;

  return client.rawRequest(query, args).then(function (response) {
    resolve(response);

    if (response.extensions) available = response.extensions.cost.throttleStatus.currentlyAvailable;

    if (calledByTimeout) queueTimer = null;

    processQueue();
  }).catch(function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(error) {
      var _error$response, errors, extensions;

      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (error.response) {
                _context.next = 4;
                break;
              }

              console.error('This is a big issue as we currently always expect a "response" attribute on the error');
              console.log('The error:', error);
              return _context.abrupt('return', reject('This is a big issue as we currently always expect a "response" attribute on the error'));

            case 4:
              _error$response = error.response, errors = _error$response.errors, extensions = _error$response.extensions;


              if (calledByTimeout) queueTimer = null;

              if (errors && extensions && errors[0].message === "Throttled") {
                queue.push({
                  args: allArgs,
                  promise: promise
                });
                createQueueTimeout(extensions.cost);
              } else {
                reject(error);
              }

            case 7:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x2) {
      return _ref.apply(this, arguments);
    };
  }());
};

var processQueue = function processQueue() {
  var calledByTimeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  if (queue.length === 0) return null;

  var current = queue.shift();
  request(current.args, current.promise, calledByTimeout);
};

var createQueueTimeout = function createQueueTimeout(cost) {
  available = cost.throttleStatus.currentlyAvailable;

  if (queueTimer) return "Waiting to process next item in queue";

  if (queue.length === 0) return "No items in queue";

  queueTimer = setTimeout(function () {
    processQueue(true);
  }, Math.max((cost.requestedQueryCost - available) / cost.throttleStatus.restoreRate) * 1000);

  return "Item queued";
};

var limiter = function limiter() {

  return function (args, promise) {
    if (queue.length === 0) return request(args, promise);

    queue.push({
      args: args,
      promise: promise
    });
    // return createQueueTimeout();
  };
};

exports.default = limiter;