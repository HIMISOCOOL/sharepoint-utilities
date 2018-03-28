/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var forEach = function forEach(iteratee, enumerable) {
  var index = 0;
  var enumerator = enumerable.getEnumerator();

  while (enumerator.moveNext()) {
    if (iteratee(enumerator.get_current(), index++, enumerable) === false) {
      break;
    }
  }
};

var map = function map(iteratee, enumerable) {
  var index = -1;
  var enumerator = enumerable.getEnumerator();
  var result = [];

  while (enumerator.moveNext()) {
    result[++index] = iteratee(enumerator.get_current(), index, enumerable);
  }

  return result;
};

exports.toArray = function (enumerable) {
  var collection = [];
  forEach(function (item) {
    collection.push(item);
  }, enumerable);
  return collection;
};

var some = function some(iteratee, enumerable) {
  var val = false;
  forEach(function (item, i) {
    if (iteratee(item, i, enumerable)) {
      val = true;
      return false;
    }
  }, enumerable);
  return val;
};

var every = function every(iteratee, enumerable) {
  var val = true;
  var hasitems = false;
  forEach(function (item, i) {
    hasitems = true;

    if (!iteratee(item, i, enumerable)) {
      val = false;
      return false;
    }
  }, enumerable);
  return hasitems && val;
};

var find = function find(iteratee, enumerable) {
  var val;
  forEach(function (item, i) {
    if (iteratee(item, i, enumerable)) {
      val = item;
      return false;
    }
  }, enumerable);
  return val;
};

var reduce = function reduce(iteratee, accumulator, enumerable) {
  forEach(function (item, i) {
    accumulator = iteratee(accumulator, item, i, enumerable);
  }, enumerable);
  return accumulator;
};

var groupBy = function groupBy(iteratee, enumerable) {
  return reduce(function (result, value) {
    var key = iteratee(value);

    if (Object.prototype.hasOwnProperty.call(result, key)) {
      result[key].push(value);
    } else result[key] = [value];

    return result;
  }, {}, enumerable);
};

var matches = function matches(source, enumerable) {
  return function (item) {
    for (var prop in source) {
      var compare_val = source[prop];
      var value = void 0;

      if (item instanceof SP.ListItem) {
        value = item.get_item(prop);

        if (value instanceof SP.FieldLookupValue || value instanceof SP.FieldUserValue) {
          value = value.get_lookupId();

          if (compare_val instanceof SP.User) {
            compare_val = compare_val.get_id();
          } else if (compare_val instanceof SP.FieldLookupValue || compare_val instanceof SP.FieldUserValue) {
            compare_val = compare_val.get_lookupId();
          }
        } else if (value instanceof SP.FieldUrlValue) {
          value = value.get_url() + ';#' + value.get_description();

          if (compare_val instanceof SP.FieldUrlValue) {
            compare_val = compare_val.get_url() + ';#' + compare_val.get_description();
          }
        }
      } else value = item[prop];

      return value === compare_val;
    }
  };
};

var property = function property(props) {
  var properties = Array.isArray(props) ? props : [props];
  return function (item) {
    if (item instanceof SP.ListItem) {
      return properties.every(function (prop) {
        return item.get_item(prop);
      });
    }

    return properties.every(function (prop) {
      return item[prop];
    });
  };
};

var filter = function filter(predicate, enumerable) {
  var predicateType = Object.prototype.toString.call(predicate);

  switch (predicateType) {
    case '[object Function]':
      {
        var items_1 = [];
        var filter_1 = predicate;
        forEach(function (item, i) {
          if (filter_1(item, i, enumerable)) items_1.push(item);
        }, enumerable);
        return items_1;
      }

    case 'object':
      return filter(matches(predicate, enumerable), enumerable);

    case 'string':
    case '[object Array]':
      return filter(property(predicate), enumerable);
  }

  return null;
};

var firstOrDefault = function firstOrDefault(iteratee, enumerable) {
  var index = 0;
  var enumerator = enumerable.getEnumerator();

  if (enumerator.moveNext()) {
    var current = enumerator.get_current();

    if (iteratee) {
      if (iteratee(current, index++, enumerable)) return current;
    } else return current;
  }

  return null;
};

var executeQuery$ = function executeQuery$(context, data) {
  var deferred = (NWF$ || $).Deferred();
  context.executeQueryAsync(function (sender, args) {
    return deferred.resolve(data, args, sender);
  }, function (sender, args) {
    return deferred.reject(args, sender);
  });
  return deferred.promise();
};

var getQueryResult = function getQueryResult(queryText, list) {
  var query = new SP.CamlQuery();
  query.set_viewXml(queryText);
  return list.getItems(query);
};

exports.default = {
  forEach: forEach,
  map: map,
  toArray: exports.toArray,
  some: some,
  every: every,
  find: find,
  reduce: reduce,
  groupBy: groupBy,
  filter: filter,
  firstOrDefault: firstOrDefault,
  executeQuery$: executeQuery$,
  getQueryResult: getQueryResult
};

/***/ })
/******/ ]);