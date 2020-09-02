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

var productsQuery = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(props) {
    var restrictedQuery = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var query;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            query = "{\n    products" + (restrictedQuery ? "(first: 1)" : "") + " {\n      edges {\n        node {\n          id\n          storefrontId\n          handle\n          title\n          description\n          descriptionHtml\n          tags\n          productType\n          vendor\n          createdAt\n          publishedOnCurrentPublication\n          images" + (restrictedQuery ? "(first: 20)" : "") + " {\n            edges {\n              node {\n                id\n                altText\n                originalSrc\n              }\n            }\n          }\n          options {\n            id\n            name\n            values\n          }\n          priceRange {\n            minVariantPrice {\n              amount\n              currencyCode\n            }\n            maxVariantPrice {\n              amount\n              currencyCode\n            }\n          }\n          metafields" + (restrictedQuery ? "(first: 40)" : "") + " {\n            edges {\n              node {\n                id\n                namespace\n                key\n                value\n                valueType\n                description\n              }\n            }\n          }\n          variants" + (restrictedQuery ? "(first: 30)" : "") + " {\n            edges {\n              node {\n                id\n                title\n                sku\n                price\n                compareAtPrice\n                availableForSale\n                selectedOptions {\n                  name\n                  value\n                }\n                weight\n                weightUnit\n                image {\n                  altText\n                  id\n                  originalSrc\n                }\n                metafields" + (restrictedQuery ? "(first: 20)" : "") + " {\n                  edges {\n                    node {\n                      id\n                      namespace\n                      key\n                      value\n                      valueType\n                      description\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }";

            if (!restrictedQuery) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", (0, _shopifyQuery2.default)(props.client, query).then(function (resp) {
              return resp.data.products.edges.map(function (c) {
                return (0, _extends3.default)({}, c.node, {
                  images: c.node.images ? c.node.images.edges.map(function (v) {
                    return v.node;
                  }) : null,
                  metafields: c.node.metafields ? c.node.metafields.edges.map(function (m) {
                    return m.node;
                  }) : null,
                  variants: c.node.variants ? c.node.variants.edges.map(function (v) {
                    return (0, _extends3.default)({}, v.node, {
                      metafields: v.node.metafields ? v.node.metafields.edges.map(function (m) {
                        return m.node;
                      }) : null
                    });
                  }) : null
                });
              });
            }));

          case 3:
            return _context.abrupt("return", (0, _fetchShopifyData2.default)("products", props, query, {
              ProductVariant: "variants",
              ProductImage: "images",
              Metafield: "metafields"
            }));

          case 4:
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