"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _values = require("babel-runtime/core-js/object/values");

var _values2 = _interopRequireDefault(_values);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parseShopifyType = function parseShopifyType(id) {
  return id.split("/")[3];
};

var parseBulkData = function parseBulkData(data) {
  var childAttributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var ret = [];
  data.split("\n").filter(function (l) {
    return l;
  }).forEach(function (l) {
    var obj = JSON.parse(l);
    if (!obj.__parentId) {
      var children = {};
      (0, _values2.default)(childAttributes).forEach(function (k) {
        return children[k] = [];
      });
      ret.push((0, _extends3.default)({}, obj, children));
      return;
    }

    var parent = ret.find(function (o) {
      return o.id === obj.__parentId;
    });
    if (parent) {
      var type = parseShopifyType(obj.id);
      if (childAttributes[type]) {
        parent[childAttributes[type]].push(obj);
        return;
      }

      // todo: probably needs error handling here, we only get here if a
      // matching parent is found, but the Shopify object type isn't matched
      // essentially at the moment this node is ignored without any notification
      console.error("Matched a parent but no matching childAttributes assignment for type " + type + ", consider adding this to the childAttributes mapping", childAttributes, parent);
      return;
    }

    console.error("Parent/child match not found in parseBulkData, we should be handling this error better, id, __parentId", id, __parentId);
  });

  return ret;
};

// childAttributes should be passed in as an object with key/value pairs, where
// the key represents the matching Shopify object type, and the value represents
// the GraphQL attribute
//
// For example 'collections' have a 'products' attribute. Fetching these over
// the bulk API will separate them out, so we need to stich back together.
// The products have an ID similar to 'gid:\/\/shopify\/Product\/XXXXX', so
// the Shopify object type is 'Product'. We want those products to be
// returned when we querying 'products' on the 'collections'. Therefore we would
// use 'fetchBulkData("http://...", { 'Product': 'products' })'

var fetchBulkData = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(url, childAttributes) {
    var bulkData;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return fetch(url).then(function (r) {
              return r.text();
            });

          case 2:
            bulkData = _context.sent;
            return _context.abrupt("return", parseBulkData(bulkData, childAttributes));

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function fetchBulkData(_x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = fetchBulkData;