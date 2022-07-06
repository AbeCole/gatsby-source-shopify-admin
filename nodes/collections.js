'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _downloadImageNode = require('../helpers/downloadImageNode');

var _downloadImageNode2 = _interopRequireDefault(_downloadImageNode);

var _parseImageMetafields = require('../helpers/parseImageMetafields');

var _parseImageMetafields2 = _interopRequireDefault(_parseImageMetafields);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var collections = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(data, helpers) {
    var CollectionNode, transformData;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            CollectionNode = helpers.createNodeFactory('COLLECTION');

            transformData = function () {
              var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(nodeId, node) {
                var imageNode;
                return _regenerator2.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        if (!node.image) {
                          _context.next = 5;
                          break;
                        }

                        _context.next = 3;
                        return (0, _downloadImageNode2.default)((0, _extends3.default)({
                          id: node.image.id,
                          url: node.image.src,
                          parentNodeId: nodeId,
                          prefix: helpers.TYPE_PREFIX
                        }, helpers));

                      case 3:
                        imageNode = _context.sent;

                        node.image.localFile = {
                          id: imageNode.id
                        };

                      case 5:
                        if (!(node.metafields && helpers.imageMetafields && helpers.imageMetafields.collection)) {
                          _context.next = 8;
                          break;
                        }

                        _context.next = 8;
                        return _promise2.default.all((0, _parseImageMetafields2.default)(node, helpers.imageMetafields.collection, helpers));

                      case 8:
                        return _context.abrupt('return', node);

                      case 9:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, undefined);
              }));

              return function transformData(_x3, _x4) {
                return _ref2.apply(this, arguments);
              };
            }();

            return _context3.abrupt('return', _promise2.default.all(data.map(function () {
              var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(d) {
                var id, transformedData, node;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        if (d.products) {
                          d.products = d.products.map(function (p) {
                            return helpers.createNodeId('PRODUCT' + p.id);
                          });
                        }

                        id = helpers.createNodeId('COLLECTION' + d.id);
                        _context2.next = 4;
                        return transformData(id, d);

                      case 4:
                        transformedData = _context2.sent;
                        _context2.next = 7;
                        return CollectionNode(transformedData);

                      case 7:
                        node = _context2.sent;
                        return _context2.abrupt('return', helpers.createNode((0, _extends3.default)({}, node, {
                          id: id
                        })));

                      case 9:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                }, _callee2, undefined);
              }));

              return function (_x5) {
                return _ref3.apply(this, arguments);
              };
            }())));

          case 3:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function collections(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = collections;