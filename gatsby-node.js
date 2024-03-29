'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _graphqlRequest = require('graphql-request');

var _collectionsQuery = require('./queries/collectionsQuery');

var _collectionsQuery2 = _interopRequireDefault(_collectionsQuery);

var _productsQuery = require('./queries/productsQuery');

var _productsQuery2 = _interopRequireDefault(_productsQuery);

var _shippingRatesQuery = require('./queries/shippingRatesQuery');

var _shippingRatesQuery2 = _interopRequireDefault(_shippingRatesQuery);

var _collections = require('./nodes/collections');

var _collections2 = _interopRequireDefault(_collections);

var _products = require('./nodes/products');

var _products2 = _interopRequireDefault(_products);

var _shippingRates = require('./nodes/shippingRates');

var _shippingRates2 = _interopRequireDefault(_shippingRates);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { createNodeHelpers } from 'gatsby-node-helpers'
var _require = require('gatsby-node-helpers'),
    createNodeHelpers = _require.createNodeHelpers; /* ========================================================
                                                        sourceNodes
                                                    ======================================================== */

var TYPE_PREFIX = 'shopify';

exports.sourceNodes = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(_ref2, _ref3) {
    var store = _ref2.store,
        cache = _ref2.cache,
        createNodeId = _ref2.createNodeId,
        createContentDigest = _ref2.createContentDigest,
        actions = _ref2.actions,
        getNode = _ref2.getNode,
        getCache = _ref2.getCache;
    var storeName = _ref3.storeName,
        apiKey = _ref3.apiKey,
        storefrontApiKey = _ref3.storefrontApiKey,
        _ref3$verbose = _ref3.verbose,
        verbose = _ref3$verbose === undefined ? false : _ref3$verbose,
        _ref3$onlyPublished = _ref3.onlyPublished,
        onlyPublished = _ref3$onlyPublished === undefined ? false : _ref3$onlyPublished,
        _ref3$imageMetafields = _ref3.imageMetafields,
        imageMetafields = _ref3$imageMetafields === undefined ? null : _ref3$imageMetafields,
        _ref3$relatedCollecti = _ref3.relatedCollectionMetafields,
        relatedCollectionMetafields = _ref3$relatedCollecti === undefined ? null : _ref3$relatedCollecti,
        _ref3$shippingRatesAd = _ref3.shippingRatesAddress,
        shippingRatesAddress = _ref3$shippingRatesAd === undefined ? null : _ref3$shippingRatesAd,
        _ref3$pollInterval = _ref3.pollInterval,
        pollInterval = _ref3$pollInterval === undefined ? 1000 * 10 : _ref3$pollInterval,
        _ref3$restrictQueries = _ref3.restrictQueries,
        restrictQueries = _ref3$restrictQueries === undefined ? false : _ref3$restrictQueries;
    var createNode, touchNode;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            createNode = actions.createNode, touchNode = actions.touchNode;
            return _context2.abrupt('return', new _promise2.default(function () {
              var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(resolve) {
                var format, client, nodeHelpers, createNodeFactory, helpers, collections, products, restrictedProductIds, firstAvailableProduct, shippingRates;
                return _regenerator2.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        format = function format(msg) {
                          return '-- gatsby-source-shopify-admin/' + storeName + ' -- ' + msg;
                        };

                        if (verbose) console.log(format('starting: shopify queries > node creation'));

                        client = new _graphqlRequest.GraphQLClient('https://' + storeName + '.myshopify.com/admin/api/2023-07/graphql.json', {
                          headers: {
                            'X-Shopify-Access-Token': apiKey
                          }
                        });
                        nodeHelpers = createNodeHelpers({
                          typePrefix: TYPE_PREFIX,
                          createNodeId: createNodeId,
                          createContentDigest: createContentDigest
                        });
                        createNodeFactory = nodeHelpers.createNodeFactory;

                        nodeHelpers = (0, _extends3.default)({
                          createNode: createNode,
                          createNodeId: createNodeId,
                          touchNode: touchNode,
                          TYPE_PREFIX: TYPE_PREFIX
                        }, nodeHelpers);

                        helpers = {
                          store: store,
                          cache: cache,
                          createNodeFactory: createNodeFactory,
                          createNode: createNode,
                          createNodeId: createNodeId,
                          getCache: getCache,
                          getNode: getNode,
                          touchNode: touchNode,
                          TYPE_PREFIX: TYPE_PREFIX,
                          client: client,
                          relatedCollectionMetafields: relatedCollectionMetafields,
                          imageMetafields: imageMetafields,
                          verbose: verbose,
                          pollInterval: pollInterval,
                          format: format
                        };


                        if (verbose) {
                          console.time(format('finished'));
                        }

                        if (verbose) {
                          console.log(format('- starting collections query'));
                          console.time(format('collections query'));
                        }

                        _context.next = 11;
                        return (0, _collectionsQuery2.default)(helpers, restrictQueries);

                      case 11:
                        collections = _context.sent;

                        if (collections) {
                          _context.next = 14;
                          break;
                        }

                        throw new Error('There was an issue fetching collections');

                      case 14:

                        if (onlyPublished) collections = collections.filter(function (p) {
                          return p.publishedOnCurrentPublication;
                        });

                        if (!(collections.length === 0)) {
                          _context.next = 17;
                          break;
                        }

                        throw new Error('No collections were returned, check your config ' + (onlyPublished && restrictQueries ? "(onlyPublished && restrictQueries don't work well together)" : ''));

                      case 17:

                        if (verbose) {
                          console.timeEnd(format('collections query'));

                          console.log(format('- starting products query'));
                          console.time(format('products query'));
                        }

                        _context.next = 20;
                        return (0, _productsQuery2.default)(helpers);

                      case 20:
                        products = _context.sent;

                        if (products) {
                          _context.next = 23;
                          break;
                        }

                        throw new Error('There was an issue fetching products');

                      case 23:

                        if (restrictQueries) {
                          // we retrieve all products then we filter to ones in the single collection retrieved above
                          restrictedProductIds = collections[0].products.map(function (p) {
                            return p.id;
                          });

                          products = products.filter(function (p) {
                            return restrictedProductIds.includes(p.id);
                          });
                        }

                        if (verbose) console.timeEnd(format('products query'));

                        if (!(shippingRatesAddress && storefrontApiKey)) {
                          _context.next = 36;
                          break;
                        }

                        firstAvailableProduct = products && products.length ? products.find(function (p) {
                          return p.publishedOnCurrentPublication && p.variants.length;
                        }) : null;

                        if (firstAvailableProduct) {
                          _context.next = 29;
                          break;
                        }

                        throw new Error('No applicable products available, cannot run shipping rates query');

                      case 29:

                        if (verbose) {
                          console.log(format("- starting shipping rates query, using Product Variant ID '" + firstAvailableProduct.variants[0].id + "'"));
                          console.time(format('shipping rates query'));
                        }

                        _context.next = 32;
                        return (0, _shippingRatesQuery2.default)(storeName, shippingRatesAddress, storefrontApiKey, firstAvailableProduct.variants[0].id);

                      case 32:
                        shippingRates = _context.sent;


                        if (verbose) {
                          console.timeEnd(format('shipping rates query'));

                          console.log(format('- creating shipping rates nodes'));
                          console.time(format('shipping rates nodes'));
                        }

                        (0, _shippingRates2.default)(shippingRates, helpers);

                        if (verbose) console.timeEnd(format('shipping rates nodes'));

                      case 36:
                        if (!products) {
                          _context.next = 41;
                          break;
                        }

                        if (verbose) {
                          console.log(format('- creating products nodes'));
                          console.time(format('products nodes'));
                        }

                        _context.next = 40;
                        return (0, _products2.default)(onlyPublished ? products.filter(function (p) {
                          return p.publishedOnCurrentPublication;
                        }) : products, helpers, collections);

                      case 40:

                        if (verbose) console.timeEnd(format('products nodes'));

                      case 41:
                        if (!collections) {
                          _context.next = 46;
                          break;
                        }

                        if (verbose) {
                          console.log(format('- creating collections nodes'));
                          console.time(format('collections nodes'));
                        }

                        _context.next = 45;
                        return (0, _collections2.default)(collections, helpers);

                      case 45:

                        if (verbose) console.timeEnd(format('collections nodes'));

                      case 46:

                        resolve(true);

                      case 47:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, undefined);
              }));

              return function (_x3) {
                return _ref4.apply(this, arguments);
              };
            }()));

          case 2:
          case 'end':
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
            return cache.set('lastRun', date.toISOString());

          case 3:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function (_x4) {
    return _ref5.apply(this, arguments);
  };
}();

exports.createSchemaCustomization = function (_ref7) {
  var actions = _ref7.actions;
  var createTypes = actions.createTypes;

  // Gatsby tries to infer all the type definitions
  // However this doesn't work if fields are set for some products
  // i.e. if compareAtPrice is only set on 1 out of 100 products, it is
  // unlikely that Gatsby will pick it up as a field

  var typeDefs = '\n    type ShopifyProductVariants implements Node {\n      compareAtPrice: String\n      storefrontId: String\n      image: ShopifyImage\n    }\n    type ShopifyImage implements Node {\n      localFile: File @link(from: "localFile.id")\n    }\n    type ShopifyProduct implements Node {\n      images: [ShopifyImage]\n      variants: [ShopifyProductVariants]\n      relatedPr: ShopifyCollection\n    }\n    type ShopifyProductVariantsImage implements Node {\n      localFile: File\n    }\n    type ShopifyCollection implements Node {\n      image: ShopifyImage\n      products: [ShopifyProduct] @link(by: "id")\n    }\n    ';

  // if (imageMetafields) {
  // typeDefs += `
  //   type ShopifyImage implements Node @infer {
  //     id: String
  //     altText: String
  //     originalSrc: String
  //     localFile: File
  //   }
  // `
  // if (imageMetafields.collection) {
  //   typeDefs += `
  //     type ShopifyCollection implements Node {
  //       ${imageMetafields.collection
  //         .map((m) => `${camelcase(m)}: ShopifyImage`)
  //         .join('\n')}
  //     }
  //   `
  // }
  // }

  // typeDefs += `
  //   type ShopifyProductMetafield implements Node {
  //     key: String
  //     value: String
  //   }
  //   type ShopifyCollectionProducts implements Node {
  //     metafields: [ShopifyProductMetafield]
  //   }
  //   type ShopifyProduct implements Node {
  //     ${
  //       imageMetafields && imageMetafields.product
  //         ? imageMetafields.product
  //             .map((m) => `${camelcase(m)}: ShopifyImage`)
  //             .join('\n')
  //         : ''
  //     }
  //       ${
  //         relatedCollectionMetafields
  //           ? relatedCollectionMetafields
  //               .map((m) => `${camelcase(m)}: ShopifyCollection`)
  //               .join('\n')
  //           : ''
  //       }
  //     handle: String
  //   }
  // `

  createTypes(typeDefs);
};