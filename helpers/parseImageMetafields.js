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

var _downloadImageNode = require("./downloadImageNode");

var _downloadImageNode2 = _interopRequireDefault(_downloadImageNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parseImageMetafields = function parseImageMetafields(node, fields, helpers) {
  return fields.map(function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(metafieldKey) {
      var metafield, fileNodeId;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              metafield = node.metafields.find(function (m) {
                return m.key === metafieldKey;
              });
              // this is very basic 'URL validation', something better should be done here
              // this was added because if you passed a non-valid URL to 'downloadImageAndCreateFileNode'
              // it would throw an error and stop the build process

              if (!(!metafield || !metafield.value.startsWith("http"))) {
                _context.next = 3;
                break;
              }

              return _context.abrupt("return", null);

            case 3:
              _context.next = 5;
              return (0, _downloadImageNode2.default)((0, _extends3.default)({
                id: metafield.id,
                url: metafield.value,
                prefix: helpers.TYPE_PREFIX
              }, helpers));

            case 5:
              fileNodeId = _context.sent;

              if (fileNodeId) {
                node[metafieldKey] = {
                  id: metafield.id,
                  originalSrc: metafield.value,
                  localFile___NODE: fileNodeId
                };
              }

              return _context.abrupt("return", null);

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }()).filter(function (m) {
    return m;
  });
};

exports.default = parseImageMetafields;