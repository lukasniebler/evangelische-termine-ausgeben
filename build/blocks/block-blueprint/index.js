/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/blocks/block-blueprint/edit.tsx":
/*!*********************************************!*\
  !*** ./src/blocks/block-blueprint/edit.tsx ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ Edit; }\n/* harmony export */ });\n/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ \"./node_modules/@babel/runtime/helpers/esm/slicedToArray.js\");\n/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ \"react/jsx-runtime\");\n/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ \"@wordpress/block-editor\");\n/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ \"@wordpress/components\");\n/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/element */ \"@wordpress/element\");\n/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/api-fetch */ \"@wordpress/api-fetch\");\n/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/i18n */ \"@wordpress/i18n\");\n/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__);\n\n\n// Imports from WordPress libraries\n\n\n\n\n\nfunction Edit(_ref) {\n  var attributes = _ref.attributes,\n    setAttributes = _ref.setAttributes;\n  var props = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)();\n  var id = attributes.id,\n    limit = attributes.limit;\n  var _useState = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)([]),\n    _useState2 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(_useState, 2),\n    events = _useState2[0],\n    setEvents = _useState2[1];\n  var _useState3 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(null),\n    _useState4 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(_useState3, 2),\n    error = _useState4[0],\n    setError = _useState4[1];\n  var _useState5 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(false),\n    _useState6 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(_useState5, 2),\n    loading = _useState6[0],\n    setLoading = _useState6[1];\n  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(function () {\n    if (!id) return;\n    setLoading(true);\n    var queryParams = \"vid=\".concat(id).concat(limit ? \"&itemsPerPage=\".concat(limit) : \"\");\n    _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_5___default()({\n      path: \"evangelische-termine-ausgeben/v1/data?endpoint=events&\".concat(queryParams)\n    }).then(function (data) {\n      var transformedEvents = data.map(function (item) {\n        return {\n          id: item.Veranstaltung.ID,\n          title: item.Veranstaltung._event_TITLE,\n          datum: item.Veranstaltung.DATUM,\n          startRFC: item.Veranstaltung.START_RFC,\n          startTime: item.Veranstaltung.START_UHRZEIT ? item.Veranstaltung.START_UHRZEIT.replace(\".\", \":\") : undefined\n        };\n      });\n      setEvents(transformedEvents);\n      setError(null);\n      setLoading(false);\n    }).catch(function (err) {\n      console.error(\"Error fetching events:\", err);\n      setError((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)(\"Fehler beim Abrufen der Veranstaltungen.\", \"evangelische-termine-ausgeben\"));\n      setLoading(false);\n    });\n  }, [id, limit]);\n  return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, {\n    children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {\n      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {\n        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)(\"Einstellungen\", \"evangelische-termine-ausgeben\"),\n        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {\n          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)(\"Veranstalter ID\", \"evangelische-termine-ausgeben\"),\n          value: id,\n          onChange: function onChange(value) {\n            return setAttributes({\n              id: value\n            });\n          },\n          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)(\"Geben Sie die Veranstalter-ID ein.\", \"evangelische-termine-ausgeben\")\n        }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {\n          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)(\"Anzahl der Veranstaltungen\", \"evangelische-termine-ausgeben\"),\n          value: limit,\n          onChange: function onChange(value) {\n            return setAttributes({\n              limit: value\n            });\n          },\n          min: 1,\n          max: 50\n        })]\n      })\n    }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(\"div\", Object.assign({}, props, {\n      children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(\"h2\", {\n        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)(\"Events\", \"evangelische-termine-ausgeben\")\n      }), loading && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(\"p\", {\n        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)(\"Lade Veranstaltungen...\", \"evangelische-termine-ausgeben\")\n      }), error && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(\"p\", {\n        style: {\n          color: \"red\"\n        },\n        children: error\n      }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(\"dl\", {\n        children: events.map(function (event) {\n          return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, {\n            children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(\"dt\", {\n              children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(\"strong\", {\n                children: event.title\n              })\n            }, event.id), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(\"dd\", {\n              children: [event.datum && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(\"br\", {}), event.datum && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(\"span\", {\n                children: event.datum\n              })]\n            }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(\"dd\", {\n              children: event.startTime && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(\"span\", {\n                children: event.startTime\n              })\n            }, \"\".concat(event.id, \"-dd\"))]\n          });\n        })\n      })]\n    }))]\n  });\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFYLFFBQUEsRUFBRy9CO01BQUssRUFBSyxFQUNqRGdDLHNEQUFBO1FBQUFELFFBQUEsRUFDR25DLE1BQU0sQ0FBQ2dCLEdBQUcsQ0FBQyxVQUFDK0IsS0FBSztVQUFBLE9BQ2hCZCx1REFBQSxDQUFBQyx1REFBQTtZQUFBQyxRQUFBLEdBQ0VDLHNEQUFBO2NBQUFELFFBQUEsRUFDRUMsc0RBQUE7Z0JBQUFELFFBQUEsRUFBU1ksS0FBSyxDQUFDM0I7Y0FBSztZQUFVLEdBRHZCMkIsS0FBSyxDQUFDcEQsRUFBRSxDQUVaLEVBQ2RzQyx1REFBQTtjQUFBRSxRQUFBLEdBQUtZLEtBQUssQ0FBQ3pCLEtBQUssSUFBSWMsc0RBQUEsVUFBTSxFQUFFVyxLQUFLLENBQUN6QixLQUFLLElBQUljLHNEQUFBO2dCQUFBRCxRQUFBLEVBQU9ZLEtBQUssQ0FBQ3pCO2NBQUssRUFBUTtZQUFBLEVBQU0sRUFDbEVjLHNEQUFBO2NBQUFELFFBQUEsRUFBNEJZLEtBQUssQ0FBQ3JCLFNBQVMsSUFBSVUsc0RBQUE7Z0JBQUFELFFBQUEsRUFBT1ksS0FBSyxDQUFDckI7Y0FBUztZQUFRLE1BQUFmLE1BQUEsQ0FBakVvQyxLQUFLLENBQUNwRCxFQUFFLFFBQUssQ0FBMEQ7VUFBQSxFQUNsRjtRQUFBLENBQ0o7TUFBQyxFQUNDO0lBQUEsR0FDRDtFQUFBLEVBQ0w7QUFFUCIsInNvdXJjZXMiOlsid2VicGFjazovL2V2YW5nZWxpc2NoZS10ZXJtaW5lLWF1c2dlYmVuLy4vc3JjL2Jsb2Nrcy9ibG9jay1ibHVlcHJpbnQvZWRpdC50c3g/MGZkMSJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBJbXBvcnRzIGZyb20gV29yZFByZXNzIGxpYnJhcmllc1xuaW1wb3J0IHsgdXNlQmxvY2tQcm9wcywgSW5zcGVjdG9yQ29udHJvbHMgfSBmcm9tIFwiQHdvcmRwcmVzcy9ibG9jay1lZGl0b3JcIjtcbmltcG9ydCB7IFBhbmVsQm9keSwgVGV4dENvbnRyb2wsIFJhbmdlQ29udHJvbCB9IGZyb20gXCJAd29yZHByZXNzL2NvbXBvbmVudHNcIjtcbmltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tIFwiQHdvcmRwcmVzcy9lbGVtZW50XCI7XG5pbXBvcnQgYXBpRmV0Y2ggZnJvbSBcIkB3b3JkcHJlc3MvYXBpLWZldGNoXCI7XG5pbXBvcnQgeyBfXyB9IGZyb20gXCJAd29yZHByZXNzL2kxOG5cIjtcblxuLy8gUmVwcmVzZW50IHRoZSBmaW5hbCBzaW1wbGlmaWVkIGV2ZW50IGRhdGEgc3RydWN0dXJlIHdlJ2xsIHVzZSBpbiB0aGUgZWRpdG9yIFVJXG5pbnRlcmZhY2UgRXZlbnQge1xuICBpZDogc3RyaW5nO1xuICB0aXRsZTogc3RyaW5nO1xuICBkYXR1bT86IHN0cmluZztcbiAgc3RhcnRSRkM/OiBzdHJpbmc7IC8vIFdlJ2xsIHN0b3JlIHN0YXJ0IFJGQyBzbyB3ZSBjYW4gbWFwIHRvIGNhbGVuZGFyXG4gIHN0YXJ0VGltZT86IHN0cmluZzsgLy8gRXh0cmFjdGVkIGZyb20gU1RBUlRfVUhSWkVJVCBmb3IgZGlzcGxheVxufVxuXG4vLyBUaGUgcmF3IEFQSSByZXNwb25zZSBzdHJ1Y3R1cmUgcGVyIGl0ZW0gKGFmdGVyIGZldGNoaW5nIGZyb20gdGhlIGVuZHBvaW50KVxuaW50ZXJmYWNlIEFwaVZlcmFuc3RhbHR1bmcge1xuICBWZXJhbnN0YWx0dW5nOiB7XG4gICAgSUQ6IHN0cmluZztcbiAgICBfZXZlbnRfVElUTEU6IHN0cmluZztcbiAgICBEQVRVTT86IHN0cmluZztcbiAgICBTVEFSVF9SRkM/OiBzdHJpbmc7XG4gICAgU1RBUlRfVUhSWkVJVD86IHN0cmluZztcbiAgICAvLyBPdGhlciBmaWVsZHMgYXJlIGF2YWlsYWJsZSwgYnV0IHdlIG9ubHkgdXNlIHdoYXQgd2UgbmVlZC5cbiAgfTtcbn1cblxuaW50ZXJmYWNlIEF0dHJpYnV0ZXMge1xuICBpZDogc3RyaW5nOyAvLyAndmlkJyBpcyBhIHN0cmluZ1xuICBsaW1pdDogbnVtYmVyO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBFZGl0KHtcbiAgYXR0cmlidXRlcyxcbiAgc2V0QXR0cmlidXRlcyxcbn06IHtcbiAgYXR0cmlidXRlczogQXR0cmlidXRlcztcbiAgc2V0QXR0cmlidXRlczogKG5ld0F0dHJpYnV0ZXM6IFBhcnRpYWw8QXR0cmlidXRlcz4pID0+IHZvaWQ7XG59KSB7XG4gIGNvbnN0IHByb3BzID0gdXNlQmxvY2tQcm9wcygpO1xuICBjb25zdCB7IGlkLCBsaW1pdCB9ID0gYXR0cmlidXRlcztcbiAgY29uc3QgW2V2ZW50cywgc2V0RXZlbnRzXSA9IHVzZVN0YXRlPEV2ZW50W10+KFtdKTtcbiAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1c2VTdGF0ZTxzdHJpbmcgfCBudWxsPihudWxsKTtcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlU3RhdGU8Ym9vbGVhbj4oZmFsc2UpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFpZCkgcmV0dXJuO1xuXG4gICAgc2V0TG9hZGluZyh0cnVlKTtcblxuICAgIGNvbnN0IHF1ZXJ5UGFyYW1zID0gYHZpZD0ke2lkfSR7bGltaXQgPyBgJml0ZW1zUGVyUGFnZT0ke2xpbWl0fWAgOiBcIlwifWA7XG5cbiAgICBhcGlGZXRjaCh7XG4gICAgICBwYXRoOiBgZXZhbmdlbGlzY2hlLXRlcm1pbmUtYXVzZ2ViZW4vdjEvZGF0YT9lbmRwb2ludD1ldmVudHMmJHtxdWVyeVBhcmFtc31gLFxuICAgIH0pXG4gICAgICAudGhlbigoZGF0YTogQXBpVmVyYW5zdGFsdHVuZ1tdKSA9PiB7XG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybWVkRXZlbnRzOiBFdmVudFtdID0gZGF0YS5tYXAoKGl0ZW0pID0+ICh7XG4gICAgICAgICAgaWQ6IGl0ZW0uVmVyYW5zdGFsdHVuZy5JRCxcbiAgICAgICAgICB0aXRsZTogaXRlbS5WZXJhbnN0YWx0dW5nLl9ldmVudF9USVRMRSxcbiAgICAgICAgICBkYXR1bTogaXRlbS5WZXJhbnN0YWx0dW5nLkRBVFVNLFxuICAgICAgICAgIHN0YXJ0UkZDOiBpdGVtLlZlcmFuc3RhbHR1bmcuU1RBUlRfUkZDLFxuICAgICAgICAgIHN0YXJ0VGltZTogaXRlbS5WZXJhbnN0YWx0dW5nLlNUQVJUX1VIUlpFSVRcbiAgICAgICAgICAgID8gaXRlbS5WZXJhbnN0YWx0dW5nLlNUQVJUX1VIUlpFSVQucmVwbGFjZShcIi5cIiwgXCI6XCIpXG4gICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgfSkpO1xuICAgICAgICBzZXRFdmVudHModHJhbnNmb3JtZWRFdmVudHMpO1xuICAgICAgICBzZXRFcnJvcihudWxsKTtcbiAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIGZldGNoaW5nIGV2ZW50czpcIiwgZXJyKTtcbiAgICAgICAgc2V0RXJyb3IoXG4gICAgICAgICAgX18oXG4gICAgICAgICAgICBcIkZlaGxlciBiZWltIEFicnVmZW4gZGVyIFZlcmFuc3RhbHR1bmdlbi5cIixcbiAgICAgICAgICAgIFwiZXZhbmdlbGlzY2hlLXRlcm1pbmUtYXVzZ2ViZW5cIlxuICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XG4gICAgICB9KTtcbiAgfSwgW2lkLCBsaW1pdF0pO1xuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxJbnNwZWN0b3JDb250cm9scz5cbiAgICAgICAgPFBhbmVsQm9keSB0aXRsZT17X18oXCJFaW5zdGVsbHVuZ2VuXCIsIFwiZXZhbmdlbGlzY2hlLXRlcm1pbmUtYXVzZ2ViZW5cIil9PlxuICAgICAgICAgIDxUZXh0Q29udHJvbFxuICAgICAgICAgICAgbGFiZWw9e19fKFwiVmVyYW5zdGFsdGVyIElEXCIsIFwiZXZhbmdlbGlzY2hlLXRlcm1pbmUtYXVzZ2ViZW5cIil9XG4gICAgICAgICAgICB2YWx1ZT17aWR9XG4gICAgICAgICAgICBvbkNoYW5nZT17KHZhbHVlKSA9PiBzZXRBdHRyaWJ1dGVzKHsgaWQ6IHZhbHVlIH0pfVxuICAgICAgICAgICAgaGVscD17X18oXG4gICAgICAgICAgICAgIFwiR2ViZW4gU2llIGRpZSBWZXJhbnN0YWx0ZXItSUQgZWluLlwiLFxuICAgICAgICAgICAgICBcImV2YW5nZWxpc2NoZS10ZXJtaW5lLWF1c2dlYmVuXCJcbiAgICAgICAgICAgICl9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8UmFuZ2VDb250cm9sXG4gICAgICAgICAgICBsYWJlbD17X18oXG4gICAgICAgICAgICAgIFwiQW56YWhsIGRlciBWZXJhbnN0YWx0dW5nZW5cIixcbiAgICAgICAgICAgICAgXCJldmFuZ2VsaXNjaGUtdGVybWluZS1hdXNnZWJlblwiXG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgdmFsdWU9e2xpbWl0fVxuICAgICAgICAgICAgb25DaGFuZ2U9eyh2YWx1ZSkgPT4gc2V0QXR0cmlidXRlcyh7IGxpbWl0OiB2YWx1ZSB9KX1cbiAgICAgICAgICAgIG1pbj17MX1cbiAgICAgICAgICAgIG1heD17NTB9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9QYW5lbEJvZHk+XG4gICAgICA8L0luc3BlY3RvckNvbnRyb2xzPlxuICAgICAgPGRpdiB7Li4ucHJvcHN9PlxuICAgICAgICA8aDI+e19fKFwiRXZlbnRzXCIsIFwiZXZhbmdlbGlzY2hlLXRlcm1pbmUtYXVzZ2ViZW5cIil9PC9oMj5cbiAgICAgICAge2xvYWRpbmcgJiYgKFxuICAgICAgICAgIDxwPlxuICAgICAgICAgICAge19fKFwiTGFkZSBWZXJhbnN0YWx0dW5nZW4uLi5cIiwgXCJldmFuZ2VsaXNjaGUtdGVybWluZS1hdXNnZWJlblwiKX1cbiAgICAgICAgICA8L3A+XG4gICAgICAgICl9XG4gICAgICAgIHtlcnJvciAmJiA8cCBzdHlsZT17eyBjb2xvcjogXCJyZWRcIiB9fT57ZXJyb3J9PC9wPn1cbiAgICAgICAgPGRsPlxuICAgICAgICAgIHtldmVudHMubWFwKChldmVudCkgPT4gKFxuICAgICAgICAgICAgPD5cbiAgICAgICAgICAgICAgPGR0IGtleT17ZXZlbnQuaWR9PlxuICAgICAgICAgICAgICAgIDxzdHJvbmc+e2V2ZW50LnRpdGxlfTwvc3Ryb25nPlxuICAgICAgICAgICAgICA8L2R0PlxuXHRcdFx0ICA8ZGQ+e2V2ZW50LmRhdHVtICYmIDxiciAvPn17ZXZlbnQuZGF0dW0gJiYgPHNwYW4+e2V2ZW50LmRhdHVtfTwvc3Bhbj59PC9kZD5cbiAgICAgICAgICAgICAgPGRkIGtleT17YCR7ZXZlbnQuaWR9LWRkYH0+e2V2ZW50LnN0YXJ0VGltZSAmJiA8c3Bhbj57ZXZlbnQuc3RhcnRUaW1lfTwvc3Bhbj59PC9kZD5cbiAgICAgICAgICAgIDwvPlxuICAgICAgICAgICkpfVxuICAgICAgICA8L2RsPlxuICAgICAgPC9kaXY+XG4gICAgPC8+XG4gICk7XG59XG4iXSwibmFtZXMiOlsidXNlQmxvY2tQcm9wcyIsIkluc3BlY3RvckNvbnRyb2xzIiwiUGFuZWxCb2R5IiwiVGV4dENvbnRyb2wiLCJSYW5nZUNvbnRyb2wiLCJ1c2VFZmZlY3QiLCJ1c2VTdGF0ZSIsImFwaUZldGNoIiwiX18iLCJFZGl0IiwiX3JlZiIsImF0dHJpYnV0ZXMiLCJzZXRBdHRyaWJ1dGVzIiwicHJvcHMiLCJpZCIsImxpbWl0IiwiX3VzZVN0YXRlIiwiX3VzZVN0YXRlMiIsIl9zbGljZWRUb0FycmF5IiwiZXZlbnRzIiwic2V0RXZlbnRzIiwiX3VzZVN0YXRlMyIsIl91c2VTdGF0ZTQiLCJlcnJvciIsInNldEVycm9yIiwiX3VzZVN0YXRlNSIsIl91c2VTdGF0ZTYiLCJsb2FkaW5nIiwic2V0TG9hZGluZyIsInF1ZXJ5UGFyYW1zIiwiY29uY2F0IiwicGF0aCIsInRoZW4iLCJkYXRhIiwidHJhbnNmb3JtZWRFdmVudHMiLCJtYXAiLCJpdGVtIiwiVmVyYW5zdGFsdHVuZyIsIklEIiwidGl0bGUiLCJfZXZlbnRfVElUTEUiLCJkYXR1bSIsIkRBVFVNIiwic3RhcnRSRkMiLCJTVEFSVF9SRkMiLCJzdGFydFRpbWUiLCJTVEFSVF9VSFJaRUlUIiwicmVwbGFjZSIsInVuZGVmaW5lZCIsImNhdGNoIiwiZXJyIiwiY29uc29sZSIsIl9qc3hzIiwiX0ZyYWdtZW50IiwiY2hpbGRyZW4iLCJfanN4IiwibGFiZWwiLCJ2YWx1ZSIsIm9uQ2hhbmdlIiwiaGVscCIsIm1pbiIsIm1heCIsIk9iamVjdCIsImFzc2lnbiIsInN0eWxlIiwiY29sb3IiLCJldmVudCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/blocks/block-blueprint/edit.tsx\n");

/***/ }),

/***/ "./src/blocks/block-blueprint/index.tsx":
/*!**********************************************!*\
  !*** ./src/blocks/block-blueprint/index.tsx ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ \"react/jsx-runtime\");\n/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/blocks */ \"@wordpress/blocks\");\n/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ \"./src/blocks/block-blueprint/edit.tsx\");\n/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./save */ \"./src/blocks/block-blueprint/save.tsx\");\n/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./block.json */ \"./src/blocks/block-blueprint/block.json\");\n/* harmony import */ var _output_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./output.css */ \"./src/blocks/block-blueprint/output.css\");\n\n\n\n\n\n\n(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_4__.name, {\n  icon: {\n    src: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(\"svg\", {\n      id: \"Ebene_1\",\n      xmlns: \"http://www.w3.org/2000/svg\",\n      viewBox: \"0 0 512 512\",\n      children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(\"rect\", {\n        x: \"60.05\",\n        y: \"115.69\",\n        width: \"112.94\",\n        height: \"280.62\",\n        rx: \"5.73\",\n        ry: \"5.73\",\n        fill: \"evenodd\",\n        strokeWidth: \"0\"\n      }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(\"rect\", {\n        x: \"199.53\",\n        y: \"115.69\",\n        width: \"112.94\",\n        height: \"280.62\",\n        rx: \"5.73\",\n        ry: \"5.73\",\n        fill: \"evenodd\",\n        strokeWidth: \"0\"\n      }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(\"rect\", {\n        x: \"339.01\",\n        y: \"115.69\",\n        width: \"112.94\",\n        height: \"280.62\",\n        rx: \"5.73\",\n        ry: \"5.73\",\n        fill: \"evenodd\",\n        strokeWidth: \"0\"\n      })]\n    })\n  },\n  __experimentalLabel: function __experimentalLabel(attributes, _ref) {\n    var context = _ref.context;\n    var title = attributes.title;\n    if (context === 'list-view' && title) {\n      return title;\n    }\n  },\n  // @see ./edit.js\n  edit: _edit__WEBPACK_IMPORTED_MODULE_2__[\"default\"],\n  // @see ./save.js\n  save: _save__WEBPACK_IMPORTED_MODULE_3__[\"default\"]\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvYmxvY2tzL2Jsb2NrLWJsdWVwcmludC9pbmRleC50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFzRDtBQUU1QjtBQUNBO0FBQ1U7QUFDZDtBQUV0QkEsb0VBQWlCLENBQUVHLDZDQUFvQixFQUFFO0VBQ3hDRSxJQUFJLEVBQUU7SUFDTEMsR0FBRyxFQUFFQyx1REFBQTtNQUFLQyxFQUFFLEVBQUMsU0FBUztNQUFDQyxLQUFLLEVBQUMsNEJBQTRCO01BQUNDLE9BQU8sRUFBQyxhQUFhO01BQUFDLFFBQUEsR0FBQ0Msc0RBQUE7UUFBTUMsQ0FBQyxFQUFDLE9BQU87UUFBQ0MsQ0FBQyxFQUFDLFFBQVE7UUFBQ0MsS0FBSyxFQUFDLFFBQVE7UUFBQ0MsTUFBTSxFQUFDLFFBQVE7UUFBQ0MsRUFBRSxFQUFDLE1BQU07UUFBQ0MsRUFBRSxFQUFDLE1BQU07UUFBQ0MsSUFBSSxFQUFDLFNBQVM7UUFBQ0MsV0FBVyxFQUFDO01BQUcsRUFBRSxFQUFBUixzREFBQTtRQUFNQyxDQUFDLEVBQUMsUUFBUTtRQUFDQyxDQUFDLEVBQUMsUUFBUTtRQUFDQyxLQUFLLEVBQUMsUUFBUTtRQUFDQyxNQUFNLEVBQUMsUUFBUTtRQUFDQyxFQUFFLEVBQUMsTUFBTTtRQUFDQyxFQUFFLEVBQUMsTUFBTTtRQUFDQyxJQUFJLEVBQUMsU0FBUztRQUFDQyxXQUFXLEVBQUM7TUFBRyxFQUFFLEVBQUFSLHNEQUFBO1FBQU1DLENBQUMsRUFBQyxRQUFRO1FBQUNDLENBQUMsRUFBQyxRQUFRO1FBQUNDLEtBQUssRUFBQyxRQUFRO1FBQUNDLE1BQU0sRUFBQyxRQUFRO1FBQUNDLEVBQUUsRUFBQyxNQUFNO1FBQUNDLEVBQUUsRUFBQyxNQUFNO1FBQUNDLElBQUksRUFBQyxTQUFTO1FBQUNDLFdBQVcsRUFBQztNQUFHLEVBQUU7SUFBQTtHQUM1WjtFQUNEQyxtQkFBbUIsRUFBRSxTQUFyQkEsbUJBQW1CQSxDQUFHQyxVQUFlLEVBQUFDLElBQUEsRUFBc0I7SUFBQSxJQUFsQkMsT0FBTyxHQUFBRCxJQUFBLENBQVBDLE9BQU87SUFDL0MsSUFBUUMsS0FBSyxHQUFLSCxVQUFVLENBQXBCRyxLQUFLO0lBRWIsSUFBSUQsT0FBTyxLQUFLLFdBQVcsSUFBSUMsS0FBSyxFQUFFO01BQ3JDLE9BQU9BLEtBQUs7SUFDYjtFQUNELENBQUM7RUFDRDtFQUNBQyxJQUFJLEVBQUV6Qiw2Q0FBSTtFQUVWO0VBQ0FDLElBQUksRUFBSkEsNkNBQUlBO0NBQ0csQ0FBRSIsInNvdXJjZXMiOlsid2VicGFjazovL2V2YW5nZWxpc2NoZS10ZXJtaW5lLWF1c2dlYmVuLy4vc3JjL2Jsb2Nrcy9ibG9jay1ibHVlcHJpbnQvaW5kZXgudHN4Pzk3ZDkiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcmVnaXN0ZXJCbG9ja1R5cGUgfSBmcm9tICdAd29yZHByZXNzL2Jsb2Nrcyc7XG5cbmltcG9ydCBFZGl0IGZyb20gJy4vZWRpdCc7XG5pbXBvcnQgc2F2ZSBmcm9tICcuL3NhdmUnO1xuaW1wb3J0IG1ldGFkYXRhIGZyb20gJy4vYmxvY2suanNvbic7XG5pbXBvcnQgJy4vb3V0cHV0LmNzcyc7XG5cbnJlZ2lzdGVyQmxvY2tUeXBlKCBtZXRhZGF0YS5uYW1lIGFzIGFueSwge1xuXHRpY29uOiB7XG5cdFx0c3JjOiA8c3ZnIGlkPVwiRWJlbmVfMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDUxMiA1MTJcIj48cmVjdCB4PVwiNjAuMDVcIiB5PVwiMTE1LjY5XCIgd2lkdGg9XCIxMTIuOTRcIiBoZWlnaHQ9XCIyODAuNjJcIiByeD1cIjUuNzNcIiByeT1cIjUuNzNcIiBmaWxsPVwiZXZlbm9kZFwiIHN0cm9rZVdpZHRoPVwiMFwiLz48cmVjdCB4PVwiMTk5LjUzXCIgeT1cIjExNS42OVwiIHdpZHRoPVwiMTEyLjk0XCIgaGVpZ2h0PVwiMjgwLjYyXCIgcng9XCI1LjczXCIgcnk9XCI1LjczXCIgZmlsbD1cImV2ZW5vZGRcIiBzdHJva2VXaWR0aD1cIjBcIi8+PHJlY3QgeD1cIjMzOS4wMVwiIHk9XCIxMTUuNjlcIiB3aWR0aD1cIjExMi45NFwiIGhlaWdodD1cIjI4MC42MlwiIHJ4PVwiNS43M1wiIHJ5PVwiNS43M1wiIGZpbGw9XCJldmVub2RkXCIgc3Ryb2tlV2lkdGg9XCIwXCIvPjwvc3ZnPlxuXHR9LFxuXHRfX2V4cGVyaW1lbnRhbExhYmVsOiAoYXR0cmlidXRlczogYW55LCB7IGNvbnRleHQgfTogYW55KSA9PiB7XG5cdFx0Y29uc3QgeyB0aXRsZSB9ID0gYXR0cmlidXRlcztcblxuXHRcdGlmIChjb250ZXh0ID09PSAnbGlzdC12aWV3JyAmJiB0aXRsZSkge1xuXHRcdFx0cmV0dXJuIHRpdGxlO1xuXHRcdH1cblx0fSxcblx0Ly8gQHNlZSAuL2VkaXQuanNcblx0ZWRpdDogRWRpdCxcblxuXHQvLyBAc2VlIC4vc2F2ZS5qc1xuXHRzYXZlLFxufSBhcyBhbnkgKTtcbiJdLCJuYW1lcyI6WyJyZWdpc3RlckJsb2NrVHlwZSIsIkVkaXQiLCJzYXZlIiwibWV0YWRhdGEiLCJuYW1lIiwiaWNvbiIsInNyYyIsIl9qc3hzIiwiaWQiLCJ4bWxucyIsInZpZXdCb3giLCJjaGlsZHJlbiIsIl9qc3giLCJ4IiwieSIsIndpZHRoIiwiaGVpZ2h0IiwicngiLCJyeSIsImZpbGwiLCJzdHJva2VXaWR0aCIsIl9fZXhwZXJpbWVudGFsTGFiZWwiLCJhdHRyaWJ1dGVzIiwiX3JlZiIsImNvbnRleHQiLCJ0aXRsZSIsImVkaXQiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/blocks/block-blueprint/index.tsx\n");

/***/ }),

/***/ "./src/blocks/block-blueprint/save.tsx":
/*!*********************************************!*\
  !*** ./src/blocks/block-blueprint/save.tsx ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ save; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ \"react/jsx-runtime\");\n/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ \"@wordpress/block-editor\");\n/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);\n\n\nfunction save(_ref) {\n  var attributes = _ref.attributes;\n  var blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save();\n  return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n    children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(\"div\", Object.assign({}, blockProps, {\n      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(\"h2\", {\n        children: [\"Hello World! \", attributes.title]\n      })\n    }))\n  });\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvYmxvY2tzL2Jsb2NrLWJsdWVwcmludC9zYXZlLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBd0Q7QUFXMUMsU0FBVUMsSUFBSUEsQ0FBQUMsSUFBQSxFQUEwQjtFQUFBLElBQXZCQyxVQUFVLEdBQUFELElBQUEsQ0FBVkMsVUFBVTtFQUN2QyxJQUFNQyxVQUFVLEdBQUdKLGtFQUFhLENBQUNDLElBQUksRUFBRTtFQUN2QyxPQUNJSSxzREFBQSxDQUFBQyx1REFBQTtJQUFBQyxRQUFBLEVBQ0lGLHNEQUFBLFFBQUFHLE1BQUEsQ0FBQUMsTUFBQSxLQUFTTCxVQUFVO01BQUFHLFFBQUEsRUFFakJHLHVEQUFBO1FBQUFILFFBQUEsb0JBQWtCSixVQUFVLENBQUNRLEtBQUs7TUFBQTtJQUFNO0VBQ3BDLEVBQ1A7QUFFVCIsInNvdXJjZXMiOlsid2VicGFjazovL2V2YW5nZWxpc2NoZS10ZXJtaW5lLWF1c2dlYmVuLy4vc3JjL2Jsb2Nrcy9ibG9jay1ibHVlcHJpbnQvc2F2ZS50c3g/YTQ2OSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VCbG9ja1Byb3BzIH0gZnJvbSBcIkB3b3JkcHJlc3MvYmxvY2stZWRpdG9yXCI7XG5cbmludGVyZmFjZSBTYXZlUHJvcHMge1xuICBhdHRyaWJ1dGVzOiB7XG4gICAgY29sb3I6IHN0cmluZztcbiAgICB0YWJzVWlkOiBzdHJpbmc7XG4gICAgYmxvY2tJZDogc3RyaW5nO1xuICAgIHRpdGxlOiBzdHJpbmc7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNhdmUoeyBhdHRyaWJ1dGVzIH06IFNhdmVQcm9wcykge1xuICBjb25zdCBibG9ja1Byb3BzID0gdXNlQmxvY2tQcm9wcy5zYXZlKCk7XG4gIHJldHVybiAoXG4gICAgICA8PlxuICAgICAgICAgIDxkaXYgey4uLmJsb2NrUHJvcHN9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPGgyPkhlbGxvIFdvcmxkISB7YXR0cmlidXRlcy50aXRsZX08L2gyPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgPC8+XG4gICk7XG59XG4iXSwibmFtZXMiOlsidXNlQmxvY2tQcm9wcyIsInNhdmUiLCJfcmVmIiwiYXR0cmlidXRlcyIsImJsb2NrUHJvcHMiLCJfanN4IiwiX0ZyYWdtZW50IiwiY2hpbGRyZW4iLCJPYmplY3QiLCJhc3NpZ24iLCJfanN4cyIsInRpdGxlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/blocks/block-blueprint/save.tsx\n");

/***/ }),

/***/ "./src/blocks/block-blueprint/output.css":
/*!***********************************************!*\
  !*** ./src/blocks/block-blueprint/output.css ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvYmxvY2tzL2Jsb2NrLWJsdWVwcmludC9vdXRwdXQuY3NzIiwibWFwcGluZ3MiOiI7QUFBQSIsInNvdXJjZXMiOlsid2VicGFjazovL2V2YW5nZWxpc2NoZS10ZXJtaW5lLWF1c2dlYmVuLy4vc3JjL2Jsb2Nrcy9ibG9jay1ibHVlcHJpbnQvb3V0cHV0LmNzcz9hNDhjIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/blocks/block-blueprint/output.css\n");

/***/ }),

/***/ "react/jsx-runtime":
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
/***/ (function(module) {

module.exports = window["ReactJSXRuntime"];

/***/ }),

/***/ "@wordpress/api-fetch":
/*!**********************************!*\
  !*** external ["wp","apiFetch"] ***!
  \**********************************/
/***/ (function(module) {

module.exports = window["wp"]["apiFetch"];

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ (function(module) {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ (function(module) {

module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ (function(module) {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ (function(module) {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ (function(module) {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ _arrayLikeToArray; }\n/* harmony export */ });\nfunction _arrayLikeToArray(r, a) {\n  (null == a || a > r.length) && (a = r.length);\n  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];\n  return n;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vYXJyYXlMaWtlVG9BcnJheS5qcyIsIm1hcHBpbmdzIjoiOzs7O0FBQUE7QUFDQTtBQUNBLGdDQUFnQyxPQUFPO0FBQ3ZDO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9ldmFuZ2VsaXNjaGUtdGVybWluZS1hdXNnZWJlbi8uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS9hcnJheUxpa2VUb0FycmF5LmpzPzlmNzMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gX2FycmF5TGlrZVRvQXJyYXkociwgYSkge1xuICAobnVsbCA9PSBhIHx8IGEgPiByLmxlbmd0aCkgJiYgKGEgPSByLmxlbmd0aCk7XG4gIGZvciAodmFyIGUgPSAwLCBuID0gQXJyYXkoYSk7IGUgPCBhOyBlKyspIG5bZV0gPSByW2VdO1xuICByZXR1cm4gbjtcbn1cbmV4cG9ydCB7IF9hcnJheUxpa2VUb0FycmF5IGFzIGRlZmF1bHQgfTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js\n");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ _arrayWithHoles; }\n/* harmony export */ });\nfunction _arrayWithHoles(r) {\n  if (Array.isArray(r)) return r;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vYXJyYXlXaXRoSG9sZXMuanMiLCJtYXBwaW5ncyI6Ijs7OztBQUFBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2V2YW5nZWxpc2NoZS10ZXJtaW5lLWF1c2dlYmVuLy4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL2FycmF5V2l0aEhvbGVzLmpzPzU0NDkiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gX2FycmF5V2l0aEhvbGVzKHIpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkocikpIHJldHVybiByO1xufVxuZXhwb3J0IHsgX2FycmF5V2l0aEhvbGVzIGFzIGRlZmF1bHQgfTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js\n");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ _iterableToArrayLimit; }\n/* harmony export */ });\nfunction _iterableToArrayLimit(r, l) {\n  var t = null == r ? null : \"undefined\" != typeof Symbol && r[Symbol.iterator] || r[\"@@iterator\"];\n  if (null != t) {\n    var e,\n      n,\n      i,\n      u,\n      a = [],\n      f = !0,\n      o = !1;\n    try {\n      if (i = (t = t.call(r)).next, 0 === l) {\n        if (Object(t) !== t) return;\n        f = !1;\n      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);\n    } catch (r) {\n      o = !0, n = r;\n    } finally {\n      try {\n        if (!f && null != t[\"return\"] && (u = t[\"return\"](), Object(u) !== u)) return;\n      } finally {\n        if (o) throw n;\n      }\n    }\n    return a;\n  }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vaXRlcmFibGVUb0FycmF5TGltaXQuanMiLCJtYXBwaW5ncyI6Ijs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLFlBQVksa0VBQWtFO0FBQ3RGLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2V2YW5nZWxpc2NoZS10ZXJtaW5lLWF1c2dlYmVuLy4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL2l0ZXJhYmxlVG9BcnJheUxpbWl0LmpzP2ZlZjUiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gX2l0ZXJhYmxlVG9BcnJheUxpbWl0KHIsIGwpIHtcbiAgdmFyIHQgPSBudWxsID09IHIgPyBudWxsIDogXCJ1bmRlZmluZWRcIiAhPSB0eXBlb2YgU3ltYm9sICYmIHJbU3ltYm9sLml0ZXJhdG9yXSB8fCByW1wiQEBpdGVyYXRvclwiXTtcbiAgaWYgKG51bGwgIT0gdCkge1xuICAgIHZhciBlLFxuICAgICAgbixcbiAgICAgIGksXG4gICAgICB1LFxuICAgICAgYSA9IFtdLFxuICAgICAgZiA9ICEwLFxuICAgICAgbyA9ICExO1xuICAgIHRyeSB7XG4gICAgICBpZiAoaSA9ICh0ID0gdC5jYWxsKHIpKS5uZXh0LCAwID09PSBsKSB7XG4gICAgICAgIGlmIChPYmplY3QodCkgIT09IHQpIHJldHVybjtcbiAgICAgICAgZiA9ICExO1xuICAgICAgfSBlbHNlIGZvciAoOyAhKGYgPSAoZSA9IGkuY2FsbCh0KSkuZG9uZSkgJiYgKGEucHVzaChlLnZhbHVlKSwgYS5sZW5ndGggIT09IGwpOyBmID0gITApO1xuICAgIH0gY2F0Y2ggKHIpIHtcbiAgICAgIG8gPSAhMCwgbiA9IHI7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmICghZiAmJiBudWxsICE9IHRbXCJyZXR1cm5cIl0gJiYgKHUgPSB0W1wicmV0dXJuXCJdKCksIE9iamVjdCh1KSAhPT0gdSkpIHJldHVybjtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChvKSB0aHJvdyBuO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYTtcbiAgfVxufVxuZXhwb3J0IHsgX2l0ZXJhYmxlVG9BcnJheUxpbWl0IGFzIGRlZmF1bHQgfTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js\n");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js":
/*!********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ _nonIterableRest; }\n/* harmony export */ });\nfunction _nonIterableRest() {\n  throw new TypeError(\"Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\");\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vbm9uSXRlcmFibGVSZXN0LmpzIiwibWFwcGluZ3MiOiI7Ozs7QUFBQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9ldmFuZ2VsaXNjaGUtdGVybWluZS1hdXNnZWJlbi8uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS9ub25JdGVyYWJsZVJlc3QuanM/MzJlNCJdLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBfbm9uSXRlcmFibGVSZXN0KCkge1xuICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIGRlc3RydWN0dXJlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZS5cXG5JbiBvcmRlciB0byBiZSBpdGVyYWJsZSwgbm9uLWFycmF5IG9iamVjdHMgbXVzdCBoYXZlIGEgW1N5bWJvbC5pdGVyYXRvcl0oKSBtZXRob2QuXCIpO1xufVxuZXhwb3J0IHsgX25vbkl0ZXJhYmxlUmVzdCBhcyBkZWZhdWx0IH07Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js\n");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/slicedToArray.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ _slicedToArray; }\n/* harmony export */ });\n/* harmony import */ var _arrayWithHoles_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayWithHoles.js */ \"./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js\");\n/* harmony import */ var _iterableToArrayLimit_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./iterableToArrayLimit.js */ \"./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js\");\n/* harmony import */ var _unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./unsupportedIterableToArray.js */ \"./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js\");\n/* harmony import */ var _nonIterableRest_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./nonIterableRest.js */ \"./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js\");\n\n\n\n\nfunction _slicedToArray(r, e) {\n  return (0,_arrayWithHoles_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(r) || (0,_iterableToArrayLimit_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(r, e) || (0,_unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(r, e) || (0,_nonIterableRest_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"])();\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vc2xpY2VkVG9BcnJheS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFpRDtBQUNZO0FBQ1k7QUFDdEI7QUFDbkQ7QUFDQSxTQUFTLDhEQUFjLE9BQU8sb0VBQW9CLFVBQVUsMEVBQTBCLFVBQVUsK0RBQWU7QUFDL0ciLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9ldmFuZ2VsaXNjaGUtdGVybWluZS1hdXNnZWJlbi8uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS9zbGljZWRUb0FycmF5LmpzPzFkZjkiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGFycmF5V2l0aEhvbGVzIGZyb20gXCIuL2FycmF5V2l0aEhvbGVzLmpzXCI7XG5pbXBvcnQgaXRlcmFibGVUb0FycmF5TGltaXQgZnJvbSBcIi4vaXRlcmFibGVUb0FycmF5TGltaXQuanNcIjtcbmltcG9ydCB1bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheSBmcm9tIFwiLi91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheS5qc1wiO1xuaW1wb3J0IG5vbkl0ZXJhYmxlUmVzdCBmcm9tIFwiLi9ub25JdGVyYWJsZVJlc3QuanNcIjtcbmZ1bmN0aW9uIF9zbGljZWRUb0FycmF5KHIsIGUpIHtcbiAgcmV0dXJuIGFycmF5V2l0aEhvbGVzKHIpIHx8IGl0ZXJhYmxlVG9BcnJheUxpbWl0KHIsIGUpIHx8IHVuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KHIsIGUpIHx8IG5vbkl0ZXJhYmxlUmVzdCgpO1xufVxuZXhwb3J0IHsgX3NsaWNlZFRvQXJyYXkgYXMgZGVmYXVsdCB9OyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/@babel/runtime/helpers/esm/slicedToArray.js\n");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js ***!
  \*******************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ _unsupportedIterableToArray; }\n/* harmony export */ });\n/* harmony import */ var _arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayLikeToArray.js */ \"./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js\");\n\nfunction _unsupportedIterableToArray(r, a) {\n  if (r) {\n    if (\"string\" == typeof r) return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(r, a);\n    var t = {}.toString.call(r).slice(8, -1);\n    return \"Object\" === t && r.constructor && (t = r.constructor.name), \"Map\" === t || \"Set\" === t ? Array.from(r) : \"Arguments\" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(r, a) : void 0;\n  }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBcUQ7QUFDckQ7QUFDQTtBQUNBLHFDQUFxQyxnRUFBZ0I7QUFDckQsY0FBYztBQUNkLCtMQUErTCxnRUFBZ0I7QUFDL007QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2V2YW5nZWxpc2NoZS10ZXJtaW5lLWF1c2dlYmVuLy4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5LmpzPzE1NzkiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGFycmF5TGlrZVRvQXJyYXkgZnJvbSBcIi4vYXJyYXlMaWtlVG9BcnJheS5qc1wiO1xuZnVuY3Rpb24gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KHIsIGEpIHtcbiAgaWYgKHIpIHtcbiAgICBpZiAoXCJzdHJpbmdcIiA9PSB0eXBlb2YgcikgcmV0dXJuIGFycmF5TGlrZVRvQXJyYXkociwgYSk7XG4gICAgdmFyIHQgPSB7fS50b1N0cmluZy5jYWxsKHIpLnNsaWNlKDgsIC0xKTtcbiAgICByZXR1cm4gXCJPYmplY3RcIiA9PT0gdCAmJiByLmNvbnN0cnVjdG9yICYmICh0ID0gci5jb25zdHJ1Y3Rvci5uYW1lKSwgXCJNYXBcIiA9PT0gdCB8fCBcIlNldFwiID09PSB0ID8gQXJyYXkuZnJvbShyKSA6IFwiQXJndW1lbnRzXCIgPT09IHQgfHwgL14oPzpVaXxJKW50KD86OHwxNnwzMikoPzpDbGFtcGVkKT9BcnJheSQvLnRlc3QodCkgPyBhcnJheUxpa2VUb0FycmF5KHIsIGEpIDogdm9pZCAwO1xuICB9XG59XG5leHBvcnQgeyBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkgYXMgZGVmYXVsdCB9OyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js\n");

/***/ }),

/***/ "./src/blocks/block-blueprint/block.json":
/*!***********************************************!*\
  !*** ./src/blocks/block-blueprint/block.json ***!
  \***********************************************/
/***/ (function(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"evangelische-termine-ausgeben/block-blueprint","version":"1.0.0","title":"Blueprint","category":"design","description":"Creates a blueprint block.","supports":{"html":false},"attributes":{"title":{"type":"string","default":"Blueprint"},"id":{"type":"string","default":"562"},"limit":{"type":"number","default":10}},"textdomain":"evangelische-termine-ausgeben","editorScript":"file:./index.ts","editorStyle":"file:./index.css","style":"file:./style-index.css"}');

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
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval-source-map devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/blocks/block-blueprint/index.tsx");
/******/ 	
/******/ })()
;