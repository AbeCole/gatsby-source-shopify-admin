"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _fetchShopifyData = require("../helpers/fetchShopifyData");

var _fetchShopifyData2 = _interopRequireDefault(_fetchShopifyData);

var _shopifyQuery = require("../helpers/shopifyQuery");

var _shopifyQuery2 = _interopRequireDefault(_shopifyQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var collectionsQuery = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(props) {
    var restrictedQuery = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var lastRun, query;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return props.cache.get("lastRun");

          case 2:
            lastRun = _context.sent;

            // todo: we should store the last run date and then only fetch products updated since that date
            // then we can compare the diff i.e. add/remove/update, rather than completely fresh data
            // console.log('Collections fetching', lastRun, lastRun ? `(query: "updated_at:>${lastRun}")` : '')
            query = "{\n    collections(query: \"updated_at:>'2020-04-04 00:00:00'\"" + (restrictedQuery ? ", first: 1" : "") + ") {\n      edges {\n        node {\n          id\n          handle\n          title\n          description\n          descriptionHtml\n          publishedOnCurrentPublication\n          image {\n            id\n            altText\n            src\n          }\n          products(first: 100) {\n            edges {\n              node {\n                id\n              }\n            }\n          }\n          metafields(first: 100) {\n            edges {\n              node {\n                id\n                namespace\n                key\n                value\n                valueType\n                description\n              }\n            }\n          }\n        }\n      }\n    }\n  }";

            if (!restrictedQuery) {
              _context.next = 6;
              break;
            }

            return _context.abrupt("return", (0, _shopifyQuery2.default)(props.client, query).then(function (resp) {
              return resp.data.collections.edges.map(function (c) {
                return (0, _extends3.default)({}, c.node, {
                  products: c.node.products ? c.node.products.edges.map(function (v) {
                    return v.node;
                  }) : null,
                  metafields: c.node.metafields ? c.node.metafields.edges.map(function (v) {
                    return v.node;
                  }) : null
                });
              });
            }));

          case 6:
            return _context.abrupt("return", (0, _fetchShopifyData2.default)("collections", props, query, {
              Product: "products",
              Metafield: "metafields"
            }));

          case 7:
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