"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createProductNodes = undefined;

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _prettyjson = require("prettyjson");

var _prettyjson2 = _interopRequireDefault(_prettyjson);

var _pIteration = require("p-iteration");

var _fp = require("lodash/fp");

var _lib = require("../lib");

var _file = require("./file");

var _metafields = require("./metafields");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// external libs

var createProductNodes = exports.createProductNodes = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(_ref2) {
        var clients = _ref2.clients,
            nodeHelpers = _ref2.nodeHelpers,
            imageHelpers = _ref2.imageHelpers,
            debugHelpers = _ref2.debugHelpers,
            imageMetafields = _ref2.imageMetafields;
        var ProductNode;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        ProductNode = nodeHelpers.createNodeFactory("PRODUCT", function () {
                            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(node) {
                                return _regenerator2.default.wrap(function _callee3$(_context3) {
                                    while (1) {
                                        switch (_context3.prev = _context3.next) {
                                            case 0:
                                                if (!(node.images && node.images.edges)) {
                                                    _context3.next = 4;
                                                    break;
                                                }

                                                _context3.next = 3;
                                                return (0, _pIteration.map)(node.images.edges, function () {
                                                    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(edge) {
                                                        return _regenerator2.default.wrap(function _callee$(_context) {
                                                            while (1) {
                                                                switch (_context.prev = _context.next) {
                                                                    case 0:
                                                                        _context.next = 2;
                                                                        return (0, _file.downloadImageAndCreateFileNode)((0, _extends3.default)({
                                                                            id: edge.node.id,
                                                                            url: edge.node.originalSrc,
                                                                            prefix: nodeHelpers.TYPE_PREFIX
                                                                        }, imageHelpers));

                                                                    case 2:
                                                                        edge.node.localFile___NODE = _context.sent;
                                                                        return _context.abrupt("return", edge.node);

                                                                    case 4:
                                                                    case "end":
                                                                        return _context.stop();
                                                                }
                                                            }
                                                        }, _callee, undefined);
                                                    }));

                                                    return function (_x3) {
                                                        return _ref4.apply(this, arguments);
                                                    };
                                                }());

                                            case 3:
                                                node.images = _context3.sent;

                                            case 4:
                                                if (!(node.metafields && imageMetafields)) {
                                                    _context3.next = 7;
                                                    break;
                                                }

                                                _context3.next = 7;
                                                return _promise2.default.all(imageMetafields.map(function () {
                                                    var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(metafieldKey) {
                                                        var metafield;
                                                        return _regenerator2.default.wrap(function _callee2$(_context2) {
                                                            while (1) {
                                                                switch (_context2.prev = _context2.next) {
                                                                    case 0:
                                                                        metafield = node.metafields.find(function (m) {
                                                                            return m.key === metafieldKey;
                                                                        });
                                                                        // this is very basic 'URL validation', something better should be done here
                                                                        // this was added because if you passed a non-valid URL to 'downloadImageAndCreateFileNode'
                                                                        // it would throw an error and stop the build process

                                                                        if (!(!metafield || !metafield.value.startsWith('http'))) {
                                                                            _context2.next = 5;
                                                                            break;
                                                                        }

                                                                        node[metafieldKey] = 'test';
                                                                        _context2.next = 11;
                                                                        break;

                                                                    case 5:
                                                                        _context2.t0 = metafield.value;
                                                                        _context2.t1 = metafield.value;
                                                                        _context2.next = 9;
                                                                        return (0, _file.downloadImageAndCreateFileNode)((0, _extends3.default)({
                                                                            id: metafield.value,
                                                                            url: metafield.value,
                                                                            prefix: nodeHelpers.TYPE_PREFIX
                                                                        }, imageHelpers));

                                                                    case 9:
                                                                        _context2.t2 = _context2.sent;
                                                                        node[metafieldKey] = {
                                                                            id: _context2.t0,
                                                                            originalSrc: _context2.t1,
                                                                            localFile___NODE: _context2.t2
                                                                        };

                                                                    case 11:
                                                                    case "end":
                                                                        return _context2.stop();
                                                                }
                                                            }
                                                        }, _callee2, undefined);
                                                    }));

                                                    return function (_x4) {
                                                        return _ref5.apply(this, arguments);
                                                    };
                                                }()));

                                            case 7:
                                                return _context3.abrupt("return", node);

                                            case 8:
                                            case "end":
                                                return _context3.stop();
                                        }
                                    }
                                }, _callee3, undefined);
                            }));

                            return function (_x2) {
                                return _ref3.apply(this, arguments);
                            };
                        }());
                        _context5.t0 = _pIteration.forEach;
                        _context5.next = 4;
                        return (0, _lib.queryAll)(clients.storefront, ["shop", "products"], queryProducts);

                    case 4:
                        _context5.t1 = _context5.sent;

                        _context5.t2 = function () {
                            var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(product) {
                                var _ref7, data, productData, metafields, variants, node;

                                return _regenerator2.default.wrap(function _callee4$(_context4) {
                                    while (1) {
                                        switch (_context4.prev = _context4.next) {
                                            case 0:
                                                _context4.next = 2;
                                                return (0, _lib.queryOnce)({
                                                    client: clients.admin,
                                                    query: queryProductMetafields,
                                                    args: { first: 1, query: "handle:'" + product.handle + "'" },
                                                    attempts: 15
                                                });

                                            case 2:
                                                _ref7 = _context4.sent;
                                                data = _ref7.data;
                                                productData = (0, _fp.get)(["products", "edges"], data)[0];

                                                // set the metafields and variants

                                                metafields = (0, _fp.get)(["node", "metafields", "edges"], productData);

                                                if (metafields) {
                                                    product.metafields = metafields.map(function (edge) {
                                                        return edge.node;
                                                    });
                                                }

                                                variants = (0, _fp.get)(["node", "variants", "edges"], productData);

                                                if (variants) {
                                                    product.variants = variants.map(function (edge) {
                                                        edge.node.metafields = (0, _fp.get)(["node", "metafields", "edges"], edge).map(function (edge) {
                                                            return edge.node;
                                                        });
                                                        return edge.node;
                                                    });
                                                }

                                                _context4.next = 11;
                                                return ProductNode(product);

                                            case 11:
                                                node = _context4.sent;

                                                nodeHelpers.createNode(node);

                                            case 13:
                                            case "end":
                                                return _context4.stop();
                                        }
                                    }
                                }, _callee4, undefined);
                            }));

                            return function (_x5) {
                                return _ref6.apply(this, arguments);
                            };
                        }();

                        _context5.next = 8;
                        return (0, _context5.t0)(_context5.t1, _context5.t2);

                    case 8:
                    case "end":
                        return _context5.stop();
                }
            }
        }, _callee5, undefined);
    }));

    return function createProductNodes(_x) {
        return _ref.apply(this, arguments);
    };
}();

// internal libs

var queryProductMetafields = (0, _metafields.queryMetafields)({
    queryRoot: "products",
    args: {
        first: "Int!",
        query: "String"
    },
    query: "\n        edges {\n            node {\n                metafields(first: 30) {\n                    edges {\n                        node {\n                            namespace\n                            key\n                            value\n                            valueType\n                            description\n                        }\n                    }\n                }\n                variants(first:10){\n                    edges {\n                        node {\n                            id\n                            title\n                            sku\n                            price\n                            compareAtPrice\n                            availableForSale\n                            selectedOptions {\n                                name\n                                value\n                            }\n                            image {\n                                src: originalSrc\n                            }\n                            metafields(first: 30) {\n                                edges {\n                                    node {\n                                        namespace\n                                        key\n                                        value\n                                        valueType\n                                        description\n                                    }\n                                }\n                            }\n                        }\n                    }\n                }\n            }\n        }\n    "
});

var queryProducts = "\nquery($first: Int!, $after: String) {\n    shop {\n        products(first: $first, after: $after) {\n            pageInfo {\n                hasNextPage\n            }\n            edges {\n                cursor\n                node {\n                    id\n                    handle\n                    title\n                    description\n                    descriptionHtml\n                    tags\n                    productType\n                    vendor\n                    createdAt\n                    images(first: 250) {\n                        edges {\n                            node {\n                                id\n                                altText\n                                originalSrc\n                            }\n                        }\n                    }\n                    options {\n                        id\n                        name\n                        values\n                    }\n                    priceRange {\n                        minVariantPrice {\n                            amount\n                            currencyCode\n                        }\n                        maxVariantPrice {\n                            amount\n                            currencyCode\n                        }\n                    }\n                    variants(first: 250) {\n                        edges {\n                            node {\n                                id\n                                title\n                                sku\n                                price\n                                compareAtPrice\n                                availableForSale\n                                selectedOptions {\n                                    name\n                                    value\n                                }\n                                weight\n                                weightUnit\n                                image {\n                                    altText\n                                    id\n                                    originalSrc\n                                }\n                            }\n                        }\n                    }\n                }\n            }\n        }\n    }\n}\n";