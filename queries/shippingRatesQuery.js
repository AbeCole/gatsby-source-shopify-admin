"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// todo: try use the same GraphQLClient as main thread so we dont need axios
// todo: move this to after the other queries then use the id of any product variant we have
var shippingRatesQuery = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(storeName, shippingRatesAddress, storefrontApiKey) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", _axios2.default.post("https://" + storeName + ".myshopify.com/api/2020-07/graphql", "mutation {\n        checkoutCreate(input: {\n          lineItems: [{ variantId: \"Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zMTQ1MjE3MzAwODkzOA==\", quantity: 1 }],\n          allowPartialAddresses: true,\n          shippingAddress: {\n            address1: \"" + shippingRatesAddress.address1 + "\",\n            city: \"" + shippingRatesAddress.city + "\",\n            province: \"" + shippingRatesAddress.province + "\",\n            country: \"" + shippingRatesAddress.country + "\"\n          }\n        }) {\n          checkout {\n            availableShippingRates {\n              ready\n              shippingRates {\n                handle\n                title\n                priceV2 {\n                  amount\n                  currencyCode\n                }\n              }\n            }\n          }\n          checkoutUserErrors {\n            code\n            field\n            message\n          }\n        }\n      }", {
              headers: {
                "X-Shopify-Storefront-Access-Token": storefrontApiKey,
                "Content-Type": "application/graphql",
                Accept: "application/json"
              }
            }).then(function (resp) {
              if (resp.data) {
                // todo: maybe add operational chaining here
                if (resp.data.data && resp.data.data.checkoutCreate && resp.data.data.checkoutCreate.checkout && resp.data.data.checkoutCreate.checkout.availableShippingRates.ready) {
                  return resp.data.data.checkoutCreate.checkout.availableShippingRates.shippingRates;
                }
                // todo: better error handling when response doesn't match this structure
                console.log("error in response of checkout for shipping rates: ", resp.data);
                console.log("error in response of checkout for shipping rates (checkoutCreate):", resp.data.data.checkoutCreate.checkoutUserErrors);
              }
            }).catch(function (err) {
              console.error("error requesting checkout for shipping rates", err);
            }));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function shippingRatesQuery(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = shippingRatesQuery;