/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 352:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const objects = __webpack_require__(995);

const prototypes = __webpack_require__(594);

const specifics = __webpack_require__(184);

let allowNativesAccess = false;

function shouldAllowNativesAccess() {
  return allowNativesAccess;
}

function natively(win, cb) {
  const ifr = win.document.createElement('iframe');
  win.document.head.appendChild(ifr);
  cb(ifr.contentWindow);
  ifr.parentElement.removeChild(ifr);
}

function securely(cb, a, b, c, d, e, f, g, h, i, j) {
  const state = allowNativesAccess;
  allowNativesAccess = true;
  let ret, err;

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

function secure(win, config) {
  natively(win, nativeWin => {
    securely(() => {
      config = config || new nativeWin.Object();
      objects(win, nativeWin, shouldAllowNativesAccess, config.objects || new nativeWin.Object());
      prototypes(win, nativeWin, shouldAllowNativesAccess, config.prototypes || new nativeWin.Object());
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
  for (const object in objects) {
    const apis = objects[object];

    for (let i = 0; i < apis.length; i++) {
      const api = apis[i];
      let native = nativeWin[object][api];

      if (typeof native === 'function') {
        native = native.bind(win[object]);
      }

      nativeWin['Object'].defineProperty(win[object], api + 'S', {
        configurable: false,
        get: function () {
          if (!shouldAllowNativesAccess()) {
            return;
          }

          return native;
        }
      });
    }
  }
};

/***/ }),

/***/ 594:
/***/ ((module) => {

function method(func, shouldAllowNativesAccess) {
  return function (a, b, c, d, e) {
    if (!shouldAllowNativesAccess()) {
      return;
    }

    return func(this, a, b, c, d, e);
  };
}

function descriptor(nativeWin, desc, shouldAllowNativesAccess) {
  const value = desc.value;

  const set = desc.set || (() => {});

  const get = desc.get || (() => value);

  desc.configurable = false;
  delete desc.value;
  delete desc.writable;
  const getter = nativeWin['Function'].prototype.call.bind(get);
  const setter = nativeWin['Function'].prototype.call.bind(set);
  desc.get = method(getter, shouldAllowNativesAccess);
  desc.set = method(setter, shouldAllowNativesAccess);
  return desc;
}

function prototype(win, nativeWin, done, shouldAllowNativesAccess, prototype, property) {
  let proto = win[prototype];
  const arr = new nativeWin.Array();

  while (true) {
    const desc = nativeWin['Object'].getOwnPropertyDescriptor(proto.prototype, property);
    nativeWin['Array'].prototype.push.call(arr, proto.prototype);

    if (desc) {
      break;
    }

    proto = nativeWin['Object'].getPrototypeOf(proto.prototype).constructor;
  }

  const desc = nativeWin['Object'].getOwnPropertyDescriptor(arr[arr.length - 1], property);

  while (arr.length) {
    const proto = nativeWin['Array'].prototype.pop.call(arr);

    if (!done[proto.constructor.name] || !nativeWin['Array'].prototype.includes.call(done[proto.constructor.name], property)) {
      nativeWin['Object'].defineProperty(proto, property + 'S', descriptor(nativeWin, desc, shouldAllowNativesAccess));
      done[proto.constructor.name] = done[proto.constructor.name] || new nativeWin.Array();
      nativeWin['Array'].prototype.push.call(done[proto.constructor.name], property);
    }
  }
}

module.exports = function prototypes(win, nativeWin, shouldAllowNativesAccess, prototypes) {
  const done = new nativeWin.Object();

  for (const proto in prototypes) {
    const native = nativeWin[proto];
    nativeWin['Object'].defineProperty(win, proto + 'S', {
      configurable: false,
      get: function () {
        if (!shouldAllowNativesAccess()) {
          return;
        }

        return native;
      }
    });
    done[proto] = done[proto] || new nativeWin.Array();
    const properties = prototypes[proto];

    for (let i = 0; i < properties.length; i++) {
      const property = properties[i];
      prototype(win, nativeWin, done, shouldAllowNativesAccess, proto, property);
      prototype(win, nativeWin, done, shouldAllowNativesAccess, proto + 'S', property);
    }
  }
};

/***/ }),

/***/ 184:
/***/ ((module) => {

module.exports = function specifics(win, nativeWin, shouldAllowNativesAccess) {
  let getDocumentCurrentScript = nativeWin['Object'].getOwnPropertyDescriptor(win.Document.prototype, 'currentScript').get.bind(win.document);
  nativeWin['Object'].defineProperty(win.document, 'currentScript' + 'S', {
    configurable: false,
    get: function () {
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