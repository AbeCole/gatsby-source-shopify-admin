'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createCollectionNodes = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _pIteration = require('p-iteration');

var _fp = require('lodash/fp');

var _lib = require('../lib');

var _file = require('./file');

var _metafields = require('./metafields');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createCollectionNodes = exports.createCollectionNodes = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(_ref2) {
        var clients = _ref2.clients,
            nodeHelpers = _ref2.nodeHelpers,
            imageHelpers = _ref2.imageHelpers,
            debugHelpers = _ref2.debugHelpers;
        var CollectionNode;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        CollectionNode = nodeHelpers.createNodeFactory("COLLECTION", function () {
                            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(node) {
                                return _regenerator2.default.wrap(function _callee$(_context) {
                                    while (1) {
                                        switch (_context.prev = _context.next) {
                                            case 0:
                                                if (!node.image) {
                                                    _context.next = 4;
                                                    break;
                                                }

                                                _context.next = 3;
                                                return (0, _file.downloadImageAndCreateFileNode)((0, _extends3.default)({
                                                    id: node.image.id,
                                                    url: node.image.src,
                                                    prefix: nodeHelpers.TYPE_PREFIX
                                                }, imageHelpers));

                                            case 3:
                                                node.image.localFile___NODE = _context.sent;

                                            case 4:
                                                return _context.abrupt('return', node);

                                            case 5:
                                            case 'end':
                                                return _context.stop();
                                        }
                                    }
                                }, _callee, undefined);
                            }));

                            return function (_x2) {
                                return _ref3.apply(this, arguments);
                            };
                        }());
                        _context3.t0 = _pIteration.forEach;
                        _context3.next = 4;
                        return (0, _lib.queryAll)(clients.storefront, ['shop', 'collections'], queryCollections);

                    case 4:
                        _context3.t1 = _context3.sent;

                        _context3.t2 = function () {
                            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(collection) {
                                var _ref5, data, collectionData, metafields, node;

                                return _regenerator2.default.wrap(function _callee2$(_context2) {
                                    while (1) {
                                        switch (_context2.prev = _context2.next) {
                                            case 0:
                                                _context2.next = 2;
                                                return (0, _lib.queryOnce)({
                                                    client: clients.admin,
                                                    query: queryCollectionMetafields,
                                                    args: { first: 1, query: 'handle:\'' + collection.handle + '\'' },
                                                    attempts: 15
                                                });

                                            case 2:
                                                _ref5 = _context2.sent;
                                                data = _ref5.data;
                                                collectionData = (0, _fp.get)(["collections", "edges"], data)[0];
                                                metafields = (0, _fp.get)(["node", "metafields", "edges"], collectionData);

                                                if (metafields) collection.metafields = metafields.map(function (edge) {
                                                    return edge.node;
                                                });

                                                if (collection.products) collection.products___NODE = collection.products.edges.map(function (edge) {
                                                    return nodeHelpers.generateNodeId("PRODUCT", edge.node.id);
                                                });

                                                _context2.next = 10;
                                                return CollectionNode(collection);

                                            case 10:
                                                node = _context2.sent;

                                                if (collection.handle === 'shop') {
                                                    console.log('collection', collection.handle, node);
                                                }
                                                nodeHelpers.createNode(node);

                                            case 13:
                                            case 'end':
                                                return _context2.stop();
                                        }
                                    }
                                }, _callee2, undefined);
                            }));

                            return function (_x3) {
                                return _ref4.apply(this, arguments);
                            };
                        }();

                        _context3.next = 8;
                        return (0, _context3.t0)(_context3.t1, _context3.t2);

                    case 8:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function createCollectionNodes(_x) {
        return _ref.apply(this, arguments);
    };
}();

// internal libs

// external libs

var queryCollectionMetafields = (0, _metafields.queryMetafields)({
    queryRoot: "collections",
    args: {
        first: "Int!",
        query: "String"
    }
    // query: `
    //       edges {
    //           node {
    //               metafields(first: 10) {
    //                   edges {
    //                       node {
    //                           namespace
    //                           key
    //                           value
    //                           valueType
    //                           description
    //                       }
    //                   }
    //               }
    //           }
    //       }
    //   `
});

var queryCollections = '\nquery($first: Int!, $after: String) {\n    shop {\n        collections(first: $first, after: $after) {\n            pageInfo {\n                hasNextPage\n            }\n            edges {\n                cursor\n                node {\n                    id\n                    handle\n                    title\n                    description\n                    descriptionHtml\n                    image {\n                        id\n                        altText\n                        src\n                    }\n                    products(first: 50) {\n                        edges {\n                            node {\n                                id\n                            }\n                        }\n                    }\n                }\n            }\n        }\n    }\n}\n';