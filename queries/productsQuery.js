"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fetchShopifyData = require("../helpers/fetchShopifyData");

var _fetchShopifyData2 = _interopRequireDefault(_fetchShopifyData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var productsQuery = function productsQuery(props) {
  return (0, _fetchShopifyData2.default)("products", props, "{\n      products {\n        edges {\n          node {\n            id\n            storefrontId\n            handle\n            title\n            description\n            descriptionHtml\n            tags\n            productType\n            vendor\n            createdAt\n            images {\n              edges {\n                node {\n                  id\n                  altText\n                  originalSrc\n                }\n              }\n            }\n            options {\n              id\n              name\n              values\n            }\n            priceRange {\n              minVariantPrice {\n                amount\n                currencyCode\n              }\n              maxVariantPrice {\n                amount\n                currencyCode\n              }\n            }\n            metafields {\n              edges {\n                node {\n                  id\n                  namespace\n                  key\n                  value\n                  valueType\n                  description\n                }\n              }\n            }\n            variants {\n              edges {\n                node {\n                  id\n                  title\n                  sku\n                  price\n                  compareAtPrice\n                  availableForSale\n                  selectedOptions {\n                    name\n                    value\n                  }\n                  weight\n                  weightUnit\n                  image {\n                    altText\n                    id\n                    originalSrc\n                  }\n                  metafields {\n                    edges {\n                      node {\n                        namespace\n                        key\n                        value\n                        valueType\n                        description\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }", {
    ProductVariant: 'variants',
    ProductImage: 'images',
    Metafield: 'metafields'
  });
};

exports.default = productsQuery;