"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var camelcase = function camelcase(str) {
  return str.replace(/([-_][a-z])/gi, function ($1) {
    return $1.toUpperCase().replace("-", "").replace("_", "");
  });
};

exports.default = camelcase;