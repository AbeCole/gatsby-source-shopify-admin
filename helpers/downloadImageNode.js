'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _gatsbySourceFilesystem = require('gatsby-source-filesystem');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var downloadImageNode = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref2) {
    var id = _ref2.id,
        url = _ref2.url,
        createNode = _ref2.createNode,
        createNodeId = _ref2.createNodeId,
        getCache = _ref2.getCache,
        getNode = _ref2.getNode,
        touchNode = _ref2.touchNode,
        store = _ref2.store,
        cache = _ref2.cache,
        _ref2$prefix = _ref2.prefix,
        prefix = _ref2$prefix === undefined ? '' : _ref2$prefix;
    var fileNodeID, mediaDataCacheKey, cacheMediaData, node, fileNode;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            fileNodeID = void 0;
            mediaDataCacheKey = prefix + '__Media__' + url;
            _context.next = 4;
            return cache.get(mediaDataCacheKey);

          case 4:
            cacheMediaData = _context.sent;

            if (!cacheMediaData) {
              _context.next = 10;
              break;
            }

            fileNodeID = cacheMediaData.fileNodeID;
            node = getNode(fileNodeID);

            touchNode(node);

            return _context.abrupt('return', node);

          case 10:
            _context.prev = 10;
            _context.next = 13;
            return (0, _gatsbySourceFilesystem.createRemoteFileNode)({
              url: url,
              store: store,
              cache: cache,
              createNode: createNode,
              createNodeId: createNodeId,
              getCache: getCache
            });

          case 13:
            fileNode = _context.sent;

            if (!fileNode) {
              _context.next = 19;
              break;
            }

            fileNodeID = fileNode.id;
            _context.next = 18;
            return cache.set(mediaDataCacheKey, { fileNodeID: fileNodeID });

          case 18:
            return _context.abrupt('return', fileNode);

          case 19:
            _context.next = 24;
            break;

          case 21:
            _context.prev = 21;
            _context.t0 = _context['catch'](10);

            console.error('downloadImageNode error', _context.t0);

          case 24:
            return _context.abrupt('return', undefined);

          case 25:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[10, 21]]);
  }));

  return function downloadImageNode(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = downloadImageNode;