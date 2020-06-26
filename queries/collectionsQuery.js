"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _fetchShopifyData = require("../helpers/fetchShopifyData");

var _fetchShopifyData2 = _interopRequireDefault(_fetchShopifyData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var collectionsQuery = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(props) {
    var lastRun;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return props.cache.get("lastRun");

          case 2:
            lastRun = _context.sent;
            return _context.abrupt("return", (0, _fetchShopifyData2.default)("collections", props, "{\n      collections(query: \"updated_at:>'2020-04-04 00:00:00'\") {\n        edges {\n          node {\n            id\n            handle\n            title\n            description\n            descriptionHtml\n            image {\n              id\n              altText\n              src\n            }\n            products {\n              edges {\n                node {\n                  id\n                }\n              }\n            }\n            metafields {\n              edges {\n                node {\n                  id\n                  namespace\n                  key\n                  value\n                  valueType\n                  description\n                }\n              }\n            }\n          }\n        }\n      }\n    }", {
              Product: "products",
              Metafield: "metafields"
            }));

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function collectionsQuery(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = collectionsQuery;