"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _downloadImageNode = require("../helpers/downloadImageNode");

var _downloadImageNode2 = _interopRequireDefault(_downloadImageNode);

var _parseImageMetafields = require("../helpers/parseImageMetafields");

var _parseImageMetafields2 = _interopRequireDefault(_parseImageMetafields);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var products = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(data, helpers) {
    var ProductNode;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            ProductNode = helpers.createNodeFactory("PRODUCT", function () {
              var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(node) {
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        if (!node.images) {
                          _context2.next = 3;
                          break;
                        }

                        _context2.next = 3;
                        return _promise2.default.all(node.images.map(function () {
                          var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(i) {
                            var file;
                            return _regenerator2.default.wrap(function _callee$(_context) {
                              while (1) {
                                switch (_context.prev = _context.next) {
                                  case 0:
                                    _context.next = 2;
                                    return (0, _downloadImageNode2.default)((0, _extends3.default)({
                                      id: i.id,
                                      url: i.originalSrc,
                                      prefix: helpers.TYPE_PREFIX
                                    }, helpers));

                                  case 2:
                                    file = _context.sent;

                                    i.localFile___NODE = file;

                                  case 4:
                                  case "end":
                                    return _context.stop();
                                }
                              }
                            }, _callee, undefined);
                          }));

                          return function (_x4) {
                            return _ref3.apply(this, arguments);
                          };
                        }()));

                      case 3:
                        if (!(node.metafields && helpers.imageMetafields && helpers.imageMetafields.product)) {
                          _context2.next = 6;
                          break;
                        }

                        _context2.next = 6;
                        return _promise2.default.all((0, _parseImageMetafields2.default)(node, helpers.imageMetafields.product, helpers));

                      case 6:

                        // Storefront & Admin APIs return differnet price formats
                        // For some reason the Admin API outputs prices as 'cents' (i.e. multipled by 100)
                        // so we need to correc this to match what we expect in the Storefront API
                        // as that will be more commonly used on the client side
                        if (node.priceRange) {
                          node.priceRange.minVariantPrice.amount = node.priceRange.minVariantPrice.amount / 100;
                          node.priceRange.maxVariantPrice.amount = node.priceRange.maxVariantPrice.amount / 100;
                        }

                        console.log('product', node);

                        return _context2.abrupt("return", node);

                      case 9:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, undefined);
              }));

              return function (_x3) {
                return _ref2.apply(this, arguments);
              };
            }());


            data.forEach(function () {
              var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(d) {
                var node;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.next = 2;
                        return ProductNode(d);

                      case 2:
                        node = _context3.sent;

                        helpers.createNode(node);

                      case 4:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3, undefined);
              }));

              return function (_x5) {
                return _ref4.apply(this, arguments);
              };
            }());

            return _context4.abrupt("return", true);

          case 3:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function products(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = products;