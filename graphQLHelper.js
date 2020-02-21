'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.buildQuery = exports.buildArgs = exports.buildArgDefinitions = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var buildArgDefinitions = exports.buildArgDefinitions = function buildArgDefinitions(args) {
    return (0, _keys2.default)(args).map(function (arg) {
        return '$' + arg + ': ' + args[arg];
    }).join(',');
};

var buildArgs = exports.buildArgs = function buildArgs(args) {
    return (0, _keys2.default)(args).map(function (arg) {
        return arg + ': $' + arg;
    }).join(',');
};

var buildQuery = exports.buildQuery = function buildQuery(_ref) {
    var queryRoot = _ref.queryRoot,
        args = _ref.args,
        query = _ref.query;
    return '\nquery(' + buildArgDefinitions(args) + ') {\n    ' + queryRoot + '(' + buildArgs(args) + ') {\n        ' + query + '\n    }\n}';
};