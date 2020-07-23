"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _camelcase = require("./camelcase");

var _camelcase2 = _interopRequireDefault(_camelcase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parseRelatedCollectionMetafields = function parseRelatedCollectionMetafields(node, fieldNames, helpers, collections) {
  return fieldNames.forEach(function (fieldName) {
    var metafield = node.metafields.find(function (m) {
      return m.key === fieldName;
    });
    if (!metafield || !metafield.value) return null;

    var matchingCollection = collections.find(function (c) {
      return c.handle === metafield.value;
    });
    if (matchingCollection) {
      node[(0, _camelcase2.default)(fieldName) + "___NODE"] = helpers.generateNodeId("COLLECTION", matchingCollection.id);
    }
  });
};

exports.default = parseRelatedCollectionMetafields;