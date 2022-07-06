'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var shippingRates = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(data, helpers) {
    var ShippingRateNode, transformData;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            ShippingRateNode = helpers.createNodeFactory('SHIPPINGRATE');

            transformData = function () {
              var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(node) {
                return _regenerator2.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        return _context.abrupt('return', node);

                      case 1:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, undefined);
              }));

              return function transformData(_x3) {
                return _ref2.apply(this, arguments);
              };
            }();

            if (data.length && Array.isArray(data)) {
              data.forEach(function () {
                var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(d) {
                  var transformedData, node;
                  return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          d.id = d.handle;
                          transformedData = transformData(d);
                          _context2.next = 4;
                          return ShippingRateNode(transformedData);

                        case 4:
                          node = _context2.sent;

                          helpers.createNode(node);

                        case 6:
                        case 'end':
                          return _context2.stop();
                      }
                    }
                  }, _callee2, undefined);
                }));

                return function (_x4) {
                  return _ref3.apply(this, arguments);
                };
              }());
            }

            return _context3.abrupt('return', true);

          case 4:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function shippingRates(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = shippingRates;