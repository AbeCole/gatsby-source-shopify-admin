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

var _shopifyQuery = require("../helpers/shopifyQuery");

var _shopifyQuery2 = _interopRequireDefault(_shopifyQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var productsQuery = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(props) {
    var query;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            query = "{\n    products {\n      edges {\n        node {\n          id\n          storefrontId\n          handle\n          title\n          description\n          descriptionHtml\n          tags\n          productType\n          vendor\n          createdAt\n          publishedOnCurrentPublication\n          images {\n            edges {\n              node {\n                id\n                altText\n                originalSrc\n              }\n            }\n          }\n          options {\n            id\n            name\n            values\n          }\n          priceRange {\n            minVariantPrice {\n              amount\n              currencyCode\n            }\n            maxVariantPrice {\n              amount\n              currencyCode\n            }\n          }\n          metafields {\n            edges {\n              node {\n                id\n                namespace\n                key\n                value\n                valueType\n                description\n              }\n            }\n          }\n          variants {\n            edges {\n              node {\n                id\n                title\n                sku\n                price\n                compareAtPrice\n                availableForSale\n                selectedOptions {\n                  name\n                  value\n                }\n                weight\n                weightUnit\n                image {\n                  altText\n                  id\n                  originalSrc\n                }\n                metafields {\n                  edges {\n                    node {\n                      id\n                      namespace\n                      key\n                      value\n                      valueType\n                      description\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }";
            return _context.abrupt("return", (0, _fetchShopifyData2.default)("products", props, query, {
              ProductVariant: "variants",
              ProductImage: "images",
              Metafield: "metafields"
            }));

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function productsQuery(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = productsQuery;