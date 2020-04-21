'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['{blue gatsby-source-shopify-admin/', '} ', ''], ['{blue gatsby-source-shopify-admin/', '} ', '']);
/* ========================================================
    sourceNodes
======================================================== */

var _nodes = require('./nodes');

var _graphqlRequest = require('graphql-request');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _gatsbyNodeHelpers = require('gatsby-node-helpers');

var _gatsbyNodeHelpers2 = _interopRequireDefault(_gatsbyNodeHelpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TYPE_PREFIX = "shopify";

exports.sourceNodes = function () {
        var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref2, _ref3) {
                var _createNodeHelpers;

                var _ref2$boundActionCrea = _ref2.boundActionCreators,
                    createNode = _ref2$boundActionCrea.createNode,
                    touchNode = _ref2$boundActionCrea.touchNode,
                    store = _ref2.store,
                    cache = _ref2.cache,
                    createNodeId = _ref2.createNodeId,
                    actions = _ref2.actions;
                var storeName = _ref3.storeName,
                    apiKey = _ref3.apiKey,
                    adminApiKey = _ref3.adminApiKey,
                    _ref3$verbose = _ref3.verbose,
                    verbose = _ref3$verbose === undefined ? false : _ref3$verbose,
                    _ref3$imageMetafields = _ref3.imageMetafields,
                    imageMetafields = _ref3$imageMetafields === undefined ? null : _ref3$imageMetafields;
                var format, storefront, admin, createNodeFactory, generateNodeId, nodeHelpers, clients, imageHelpers, debugHelpers, timerLabel;
                return _regenerator2.default.wrap(function _callee$(_context) {
                        while (1) {
                                switch (_context.prev = _context.next) {
                                        case 0:

                                                // const { createTypes } = actions
                                                // let typeDefs = `
                                                //   type ShopifyImage implements Node @infer {
                                                //     id: String
                                                //     altText: String
                                                //     originalSrc: String
                                                //     localFile: File
                                                //   }
                                                // `
                                                // if (imageMetafields.product) {
                                                //   typeDefs += `type ShopifyProduct implements Node @infer {
                                                //     ${imageMetafields.product.map(m => `${m}: ShopifyImage`).join('\n')}
                                                //   }`
                                                // }
                                                // createTypes(typeDefs)

                                                format = function format(msg) {
                                                        return (0, _chalk2.default)(_templateObject, storeName, msg);
                                                };

                                                if (verbose) console.log(format("starting data fetch"));

                                                storefront = new _graphqlRequest.GraphQLClient('https://' + storeName + '.myshopify.com/api/graphql', {
                                                        headers: {
                                                                'X-Shopify-Storefront-Access-Token': apiKey
                                                        }
                                                });
                                                admin = new _graphqlRequest.GraphQLClient('https://' + storeName + '.myshopify.com/admin/api/graphql.json', {
                                                        headers: {
                                                                'X-Shopify-Access-Token': adminApiKey
                                                        }
                                                });
                                                createNodeFactory = void 0, generateNodeId = void 0;
                                                nodeHelpers = (_createNodeHelpers = (0, _gatsbyNodeHelpers2.default)({ typePrefix: TYPE_PREFIX }), createNodeFactory = _createNodeHelpers.createNodeFactory, generateNodeId = _createNodeHelpers.generateNodeId, _createNodeHelpers);
                                                clients = { admin: admin, storefront: storefront };

                                                nodeHelpers = (0, _extends3.default)({
                                                        createNode: createNode,
                                                        createNodeId: createNodeId,
                                                        touchNode: touchNode,
                                                        TYPE_PREFIX: TYPE_PREFIX
                                                }, nodeHelpers);
                                                imageHelpers = (0, _extends3.default)({}, nodeHelpers, { store: store, cache: cache });
                                                debugHelpers = { format: format, verbose: verbose };
                                                timerLabel = format("finished data fetch");

                                                if (verbose) console.time(timerLabel);

                                                _context.next = 14;
                                                return _promise2.default.all([(0, _nodes.createProductNodes)({ clients: clients, nodeHelpers: nodeHelpers, imageHelpers: imageHelpers, debugHelpers: debugHelpers, imageMetafields: imageMetafields.product }), (0, _nodes.createCollectionNodes)({ clients: clients, nodeHelpers: nodeHelpers, imageHelpers: imageHelpers, debugHelpers: debugHelpers, imageMetafields: imageMetafields.collection })]
                                                //createPolicyNodes({ storefrontClient })
                                                );

                                        case 14:

                                                if (verbose) console.timeEnd(timerLabel);

                                        case 15:
                                        case 'end':
                                                return _context.stop();
                                }
                        }
                }, _callee, undefined);
        }));

        return function (_x, _x2) {
                return _ref.apply(this, arguments);
        };
}();