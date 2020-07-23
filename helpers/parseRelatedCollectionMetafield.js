"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var parseRelatedCollectionMetafield = function parseRelatedCollectionMetafield(node, fieldName, helpers, collections) {
  var metafield = node.metafields.find(function (m) {
    return m.key === fieldName;
  });
  if (!metafield || !metafield.value) return null;

  var matchingCollection = collections.find(function (c) {
    return c.handle === metafield.value;
  });
  if (matchingCollection) {
    node.relatedCollection___NODE = helpers.generateNodeId("COLLECTION", matchingCollection.id);
  }

  return null;
};

exports.default = parseRelatedCollectionMetafield;