"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.queryMetafields = undefined;

var _graphQLHelper = require("../graphQLHelper");

var queryMetafields = exports.queryMetafields = function queryMetafields(_ref) {
    var queryRoot = _ref.queryRoot,
        args = _ref.args,
        _ref$query = _ref.query,
        query = _ref$query === undefined ? "\n        edges {\n            node {\n                metafields(first: 50) {\n                    edges {\n                        node {\n                            namespace\n                            key\n                            value\n                            valueType\n                            description\n                        }\n                    }\n                }\n            }\n        }" : _ref$query;
    return (0, _graphQLHelper.buildQuery)({
        queryRoot: queryRoot,
        args: args,
        query: query
    });
};
// internal libs