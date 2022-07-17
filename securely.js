/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 352:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var objects = __webpack_require__(995);

var prototypes = __webpack_require__(594);

var specifics = __webpack_require__(184);

var allowNativesAccess = false;

function shouldAllowNativesAccess() {
  return allowNativesAccess;
}

function natively(win, cb) {
  var ifr = win.document.createElement('iframe');
  win.document.head.appendChild(ifr);
  cb(ifr.contentWindow);
  ifr.parentElement.removeChild(ifr);
}

function securely(cb, a, b, c, d, e, f, g, h, i, j) {
  var state = allowNativesAccess;
  allowNativesAccess = true;
  var ret, err;

  try {
    ret = cb(a, b, c, d, e, f, g, h, i, j);
  } catch (e) {
    err = e;
  }

  if (!state) {
    allowNativesAccess = false;
  }

  if (err) {
    throw err;
  }

  return ret;
}

function secure(win) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    objects: {},
    prototypes: {}
  };
  natively(win, function (nativeWin) {
    securely(function () {
      objects(win, nativeWin, shouldAllowNativesAccess, config.objects || {});
      prototypes(win, nativeWin, shouldAllowNativesAccess, config.prototypes || {});
      specifics(win, nativeWin, shouldAllowNativesAccess);
    });
  });
  return securely;
}

module.exports = secure;

/***/ }),

/***/ 995:
/***/ ((module) => {

module.exports = function objects(win, nativeWin, shouldAllowNativesAccess, objects) {
  for (var object in objects) {
    var apis = objects[object];

    var _loop = function _loop(i) {
      var api = apis[i];
      var native = nativeWin[object][api];

      if (typeof native === 'function') {
        native = native.bind(win[object]);
      }

      nativeWin['Object'].defineProperty(win[object], api + 'S', {
        configurable: false,
        get: function get() {
          if (!shouldAllowNativesAccess()) {
            return;
          }

          return native;
        }
      });
    };

    for (var i = 0; i < apis.length; i++) {
      _loop(i);
    }
  }
};

/***/ }),

/***/ 594:
/***/ ((module) => {

function zzz(func, shouldAllowNativesAccess) {
  return function (a, b, c, d, e) {
    if (!shouldAllowNativesAccess()) {
      return;
    }

    return func(this, a, b, c, d, e);
  };
}

function xxx(nativeWin, desc, shouldAllowNativesAccess) {
  var value = desc.value;

  var set = desc.set || function () {};

  var get = desc.get || function () {
    return value;
  };

  desc.configurable = false;
  delete desc.value;
  delete desc.writable;
  var getter = nativeWin['Function'].prototype.call.bind(get);
  var setter = nativeWin['Function'].prototype.call.bind(set);
  desc.get = zzz(getter, shouldAllowNativesAccess);
  desc.set = zzz(setter, shouldAllowNativesAccess);
  return desc;
}

function yyy(win, nativeWin, done, shouldAllowNativesAccess, prototype, property) {
  var proto = win[prototype];
  var arr = [];

  while (true) {
    var _desc = nativeWin['Object'].getOwnPropertyDescriptor(proto.prototype, property);

    nativeWin['Array'].prototype.push.call(arr, proto.prototype);

    if (_desc) {
      break;
    }

    proto = nativeWin['Object'].getPrototypeOf(proto.prototype).constructor;
  }

  var desc = nativeWin['Object'].getOwnPropertyDescriptor(arr[arr.length - 1], property);

  while (arr.length) {
    var _proto = nativeWin['Array'].prototype.pop.call(arr);

    if (!done[_proto.constructor.name] || !nativeWin['Array'].prototype.includes.call(done[_proto.constructor.name], property)) {
      nativeWin['Object'].defineProperty(_proto, property + 'S', xxx(nativeWin, desc, shouldAllowNativesAccess));
      done[_proto.constructor.name] = done[_proto.constructor.name] || [];
      nativeWin['Array'].prototype.push.call(done[_proto.constructor.name], property);
    }
  }
}

module.exports = function prototypes(win, nativeWin, shouldAllowNativesAccess, prototypes) {
  var done = new nativeWin.Object();

  var _loop = function _loop(prototype) {
    var native = nativeWin[prototype];
    nativeWin['Object'].defineProperty(win, prototype + 'S', {
      configurable: false,
      get: function get() {
        if (!shouldAllowNativesAccess()) {
          return;
        }

        return native;
      }
    });
    done[prototype] = done[prototype] || [];
    var properties = prototypes[prototype];

    for (var i = 0; i < properties.length; i++) {
      var property = properties[i];
      yyy(win, nativeWin, done, shouldAllowNativesAccess, prototype, property);
      yyy(win, nativeWin, done, shouldAllowNativesAccess, prototype + 'S', property);
    }
  };

  for (var prototype in prototypes) {
    _loop(prototype);
  }
};

/***/ }),

/***/ 184:
/***/ ((module) => {

module.exports = function specifics(win, nativeWin, shouldAllowNativesAccess) {
  var getDocumentCurrentScript = nativeWin['Object'].getOwnPropertyDescriptor(win.Document.prototype, 'currentScript').get.bind(win.document);
  nativeWin['Object'].defineProperty(win.document, 'currentScript' + 'S', {
    configurable: false,
    get: function get() {
      if (!shouldAllowNativesAccess()) {
        return;
      }

      return getDocumentCurrentScript();
    }
  });
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/* harmony import */ var _src_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(352);
/* harmony import */ var _src_index__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_src_index__WEBPACK_IMPORTED_MODULE_0__);


(function (win) {
  Object.defineProperty(win, 'SECURE', {
    value: (_src_index__WEBPACK_IMPORTED_MODULE_0___default())
  });
})(window);
})();

/******/ })()
;