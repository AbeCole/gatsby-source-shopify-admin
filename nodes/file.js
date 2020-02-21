"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.downloadImageAndCreateFileNode = undefined;

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _gatsbySourceFilesystem = require("gatsby-source-filesystem");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var downloadImageAndCreateFileNode = exports.downloadImageAndCreateFileNode = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref2) {
        var _ref2$prefix = _ref2.prefix,
            prefix = _ref2$prefix === undefined ? "" : _ref2$prefix,
            id = _ref2.id,
            url = _ref2.url,
            createNode = _ref2.createNode,
            createNodeId = _ref2.createNodeId,
            touchNode = _ref2.touchNode,
            store = _ref2.store,
            cache = _ref2.cache;
        var fileNodeID, mediaDataCacheKey, cacheMediaData, fileNode;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        fileNodeID = void 0;
                        mediaDataCacheKey = prefix + "__Media__" + url;
                        _context.next = 4;
                        return cache.get(mediaDataCacheKey);

                    case 4:
                        cacheMediaData = _context.sent;

                        if (!cacheMediaData) {
                            _context.next = 9;
                            break;
                        }

                        fileNodeID = cacheMediaData.fileNodeID;
                        touchNode({ nodeId: fileNodeID });

                        return _context.abrupt("return", fileNodeID);

                    case 9:
                        _context.next = 11;
                        return (0, _gatsbySourceFilesystem.createRemoteFileNode)({ url: url, store: store, cache: cache, createNode: createNode, createNodeId: createNodeId });

                    case 11:
                        fileNode = _context.sent;

                        if (!fileNode) {
                            _context.next = 17;
                            break;
                        }

                        fileNodeID = fileNode.id;
                        _context.next = 16;
                        return cache.set(mediaDataCacheKey, { fileNodeID: fileNodeID });

                    case 16:
                        return _context.abrupt("return", fileNodeID);

                    case 17:
                        return _context.abrupt("return", undefined);

                    case 18:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function downloadImageAndCreateFileNode(_x) {
        return _ref.apply(this, arguments);
    };
}();
// external libs