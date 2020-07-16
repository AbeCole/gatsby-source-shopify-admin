"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _taggedTemplateLiteral2 = require("babel-runtime/helpers/taggedTemplateLiteral");

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(["{blue gatsby-source-shopify-admin/", "} ", ""], ["{blue gatsby-source-shopify-admin/", "} ", ""]); /* ========================================================
                                                                                                                                                                    sourceNodes
                                                                                                                                                                ======================================================== */

var _graphqlRequest = require("graphql-request");

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

var _gatsbyNodeHelpers = require("gatsby-node-helpers");

var _gatsbyNodeHelpers2 = _interopRequireDefault(_gatsbyNodeHelpers);

var _collectionsQuery = require("./queries/collectionsQuery");

var _collectionsQuery2 = _interopRequireDefault(_collectionsQuery);

var _productsQuery = require("./queries/productsQuery");

var _productsQuery2 = _interopRequireDefault(_productsQuery);

var _collections = require("./nodes/collections");

var _collections2 = _interopRequireDefault(_collections);

var _products = require("./nodes/products");

var _products2 = _interopRequireDefault(_products);

var _shippingRates = require("./nodes/shippingRates");

var _shippingRates2 = _interopRequireDefault(_shippingRates);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TYPE_PREFIX = "shopify";

exports.sourceNodes = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(_ref2, _ref3) {
    var store = _ref2.store,
        cache = _ref2.cache,
        createNodeId = _ref2.createNodeId,
        actions = _ref2.actions;
    var storeName = _ref3.storeName,
        apiKey = _ref3.apiKey,
        storefrontApiKey = _ref3.storefrontApiKey,
        _ref3$verbose = _ref3.verbose,
        verbose = _ref3$verbose === undefined ? false : _ref3$verbose,
        _ref3$onlyPublished = _ref3.onlyPublished,
        onlyPublished = _ref3$onlyPublished === undefined ? false : _ref3$onlyPublished,
        _ref3$imageMetafields = _ref3.imageMetafields,
        imageMetafields = _ref3$imageMetafields === undefined ? null : _ref3$imageMetafields,
        _ref3$pollInterval = _ref3.pollInterval,
        pollInterval = _ref3$pollInterval === undefined ? 1000 * 10 : _ref3$pollInterval;
    var createNode, touchNode;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            createNode = actions.createNode, touchNode = actions.touchNode;
            return _context2.abrupt("return", new _promise2.default(function () {
              var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(resolve, reject) {
                var _createNodeHelpers;

                var format, client, createNodeFactory, generateNodeId, nodeHelpers, imageHelpers, helpers, shippingRates, collections, products, createTypes, typeDefs;
                return _regenerator2.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        format = function format(msg) {
                          return (0, _chalk2.default)(_templateObject, storeName, msg);
                        };

                        if (verbose) console.log(format("starting: shopify queries > node creation"));

                        client = new _graphqlRequest.GraphQLClient("https://" + storeName + ".myshopify.com/admin/api/2020-04/graphql.json", {
                          headers: {
                            "X-Shopify-Access-Token": apiKey
                          }
                        });
                        createNodeFactory = void 0, generateNodeId = void 0;
                        nodeHelpers = (_createNodeHelpers = (0, _gatsbyNodeHelpers2.default)({
                          typePrefix: TYPE_PREFIX
                        }), createNodeFactory = _createNodeHelpers.createNodeFactory, generateNodeId = _createNodeHelpers.generateNodeId, _createNodeHelpers);

                        nodeHelpers = (0, _extends3.default)({
                          createNode: createNode,
                          createNodeId: createNodeId,
                          touchNode: touchNode,
                          TYPE_PREFIX: TYPE_PREFIX
                        }, nodeHelpers);
                        imageHelpers = (0, _extends3.default)({}, nodeHelpers, { store: store, cache: cache, imageMetafields: imageMetafields });
                        helpers = {
                          store: store,
                          cache: cache,
                          createNodeFactory: createNodeFactory,
                          createNode: createNode,
                          createNodeId: createNodeId,
                          touchNode: touchNode,
                          generateNodeId: generateNodeId,
                          TYPE_PREFIX: TYPE_PREFIX,
                          client: client,
                          imageMetafields: imageMetafields,
                          verbose: verbose,
                          pollInterval: pollInterval,
                          format: format
                        };

                        // todo: try use the same GraphQLClient as above so we dont need axios
                        // todo: add storefont access token to config
                        // todo: add address to the config, this could be the main option to enable feature and allows user to override default address
                        // todo: move this to after the other queries then use the id of any product variant we have
                        // todo: possibly move this all to a separate helper

                        _context.next = 10;
                        return _axios2.default.post("https://" + storeName + ".myshopify.com/api/2020-07/graphql", "mutation {\n          checkoutCreate(input: {\n            lineItems: [{ variantId: \"Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zMTQ1MjE3MzAwODkzOA==\", quantity: 1 }],\n            allowPartialAddresses: true,\n            shippingAddress: {address1: \"1337 Pawnee Street\", city: \"Jeffersonville\", province: \"IN\", country: \"United States\"}\n          }) {\n            checkout {\n              availableShippingRates {\n                ready\n                shippingRates {\n                  handle\n                  title\n                  priceV2 {\n                    amount\n                    currencyCode\n                  }\n                }\n              }\n            }\n            checkoutUserErrors {\n              code\n              field\n              message\n            }\n          }\n        }", {
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
                            console.log("error in response of checkout for shipping rates", resp.data, resp.data.data.checkoutCreate.checkoutUserErrors);
                          }
                        }).catch(function (err) {
                          console.error("error requesting checkout for shipping rates", err);
                        });

                      case 10:
                        shippingRates = _context.sent;


                        (0, _shippingRates2.default)(shippingRates, helpers);

                        if (verbose) {
                          console.time(format("finished"));
                        }

                        if (verbose) {
                          console.log(format("- starting collections query"));
                          console.time(format("collections query"));
                        }

                        _context.next = 16;
                        return (0, _collectionsQuery2.default)(helpers);

                      case 16:
                        collections = _context.sent;


                        if (verbose) {
                          console.timeEnd(format("collections query"));

                          console.log(format("- starting products query"));
                          console.time(format("products query"));
                        }

                        _context.next = 20;
                        return (0, _productsQuery2.default)(helpers);

                      case 20:
                        products = _context.sent;


                        if (verbose) console.timeEnd(format("products query"));

                        if (!products) {
                          _context.next = 27;
                          break;
                        }

                        if (verbose) {
                          console.log(format("- creating products nodes"));
                          console.time(format("products nodes"));
                        }

                        _context.next = 26;
                        return (0, _products2.default)(onlyPublished ? products.filter(function (p) {
                          return p.publishedOnCurrentPublication;
                        }) : products, helpers);

                      case 26:

                        if (verbose) console.timeEnd(format("products nodes"));

                      case 27:
                        if (!collections) {
                          _context.next = 32;
                          break;
                        }

                        if (verbose) {
                          console.log(format("- creating collections nodes"));
                          console.time(format("collections nodes"));
                        }

                        _context.next = 31;
                        return (0, _collections2.default)(collections, helpers);

                      case 31:

                        if (verbose) console.timeEnd(format("collections nodes"));

                      case 32:

                        if (verbose) console.time(format("finished type definitions"));

                        // Gatsby tries to infer all the type definitions
                        // However this doesn't work if fields are set for some products
                        // i.e. if compareAtPrice is only set on 1 out of 100 products, it is
                        // unlikely that Gatsby will pick it up as a field
                        createTypes = actions.createTypes;
                        typeDefs = "\n      type ShopifyProductVariants implements Node {\n        compareAtPrice: String\n        storefrontId: String\n      }\n    ";

                        if (imageMetafields) {
                          typeDefs += "\n        type ShopifyImage implements Node @infer {\n          id: String\n          altText: String\n          originalSrc: String\n          localFile: File\n        }\n      ";
                          if (imageMetafields.collection) {
                            typeDefs += "\n          type ShopifyCollection implements Node {\n            " + imageMetafields.collection.map(function (m) {
                              return m + ": ShopifyImage";
                            }).join("\n") + "\n          }\n        ";
                          }
                        }
                        typeDefs += "\n      type ShopifyProductMetafield implements Node {\n        key: String\n        value: String\n      }\n      type ShopifyCollectionProducts implements Node {\n        metafields: [ShopifyProductMetafield]\n      }\n      type ShopifyProduct implements Node {\n        " + (imageMetafields.product ? imageMetafields.product.map(function (m) {
                          return m + ": ShopifyImage";
                        }).join("\n") : "") + "\n        handle: String\n      }\n    ";
                        createTypes(typeDefs);

                        if (verbose) {
                          console.timeEnd(format("finished type definitions"));

                          console.timeEnd(format("finished"));
                        }

                        resolve(true);

                      case 40:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, undefined);
              }));

              return function (_x3, _x4) {
                return _ref4.apply(this, arguments);
              };
            }()));

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.onPostBootstrap = function () {
  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(_ref6) {
    var cache = _ref6.cache;
    var date;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            date = new Date();
            _context3.next = 3;
            return cache.set("lastRun", date.toISOString());

          case 3:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function (_x5) {
    return _ref5.apply(this, arguments);
  };
}();