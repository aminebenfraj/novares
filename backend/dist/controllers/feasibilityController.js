"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var Feasibility = require("../models/FeasabilityModel");
var FeasibilityDetail = require("../models/FeasabilityDetailModel");
var Checkin = require("../models/CheckInModel");

// List of all feasibility fields
var feasibilityFields = ["product", "raw_material_type", "raw_material_qty", "packaging", "purchased_part", "injection_cycle_time", "moulding_labor", "press_size", "assembly_finishing_paint_cycle_time", "assembly_finishing_paint_labor", "ppm_level", "pre_study", "project_management", "study_design", "cae_design", "monitoring", "measurement_metrology", "validation", "molds", "special_machines", "checking_fixture", "equipment_painting_prehension", "run_validation", "stock_production_coverage", "is_presentation", "documentation_update"];

// **Create Feasibility with associated Check-in**
exports.createFeasibility = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var feasibilityData, checkin, feasibilityObject, newFeasibility, feasibilityDetails;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          feasibilityData = req.body; // Step 1: Create the Check-in
          _context2.next = 4;
          return Checkin.create(feasibilityData.checkin || {});
        case 4:
          checkin = _context2.sent;
          // Step 2: Construct feasibility object dynamically
          feasibilityObject = feasibilityFields.reduce(function (acc, field) {
            var _feasibilityData$fiel, _feasibilityData$fiel2;
            acc[field] = {
              value: (_feasibilityData$fiel = (_feasibilityData$fiel2 = feasibilityData[field]) === null || _feasibilityData$fiel2 === void 0 ? void 0 : _feasibilityData$fiel2.value) !== null && _feasibilityData$fiel !== void 0 ? _feasibilityData$fiel : false,
              details: null
            };
            return acc;
          }, {}); // Step 3: Create Feasibility record
          newFeasibility = new Feasibility(_objectSpread(_objectSpread({}, feasibilityObject), {}, {
            checkin: checkin._id
          }));
          _context2.next = 9;
          return newFeasibility.save();
        case 9:
          _context2.next = 11;
          return Promise.all(feasibilityFields.map(/*#__PURE__*/function () {
            var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(field) {
              var _feasibilityData$fiel3;
              var _feasibilityData$fiel4, _feasibilityData$fiel5, _feasibilityData$fiel6, _feasibilityData$fiel7, detail;
              return _regeneratorRuntime().wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    if (!((_feasibilityData$fiel3 = feasibilityData[field]) !== null && _feasibilityData$fiel3 !== void 0 && _feasibilityData$fiel3.details)) {
                      _context.next = 6;
                      break;
                    }
                    _context.next = 3;
                    return FeasibilityDetail.create({
                      feasability_id: newFeasibility._id,
                      attribute_name: field,
                      description: ((_feasibilityData$fiel4 = feasibilityData[field]) === null || _feasibilityData$fiel4 === void 0 || (_feasibilityData$fiel4 = _feasibilityData$fiel4.details) === null || _feasibilityData$fiel4 === void 0 ? void 0 : _feasibilityData$fiel4.description) || "Detail for ".concat(field),
                      cost: ((_feasibilityData$fiel5 = feasibilityData[field]) === null || _feasibilityData$fiel5 === void 0 || (_feasibilityData$fiel5 = _feasibilityData$fiel5.details) === null || _feasibilityData$fiel5 === void 0 ? void 0 : _feasibilityData$fiel5.cost) || 0,
                      sales_price: ((_feasibilityData$fiel6 = feasibilityData[field]) === null || _feasibilityData$fiel6 === void 0 || (_feasibilityData$fiel6 = _feasibilityData$fiel6.details) === null || _feasibilityData$fiel6 === void 0 ? void 0 : _feasibilityData$fiel6.sales_price) || 0,
                      comments: ((_feasibilityData$fiel7 = feasibilityData[field]) === null || _feasibilityData$fiel7 === void 0 || (_feasibilityData$fiel7 = _feasibilityData$fiel7.details) === null || _feasibilityData$fiel7 === void 0 ? void 0 : _feasibilityData$fiel7.comments) || ""
                    });
                  case 3:
                    detail = _context.sent;
                    newFeasibility[field].details = detail._id;
                    return _context.abrupt("return", detail);
                  case 6:
                  case "end":
                    return _context.stop();
                }
              }, _callee);
            }));
            return function (_x3) {
              return _ref2.apply(this, arguments);
            };
          }()));
        case 11:
          feasibilityDetails = _context2.sent;
          _context2.next = 14;
          return newFeasibility.save();
        case 14:
          res.status(201).json({
            message: "Feasibility, Check-in, and details created successfully",
            data: {
              feasibility: newFeasibility,
              checkin: checkin,
              details: feasibilityDetails.filter(Boolean)
            }
          });
          _context2.next = 20;
          break;
        case 17:
          _context2.prev = 17;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            message: "Error creating feasibility",
            error: _context2.t0.message
          });
        case 20:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 17]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

// **Get All Feasibilities with Check-in**
exports.getAllFeasibilities = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var feasibilities;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          console.log("📢 Fetching all feasibilities...");

          // Ensure feasibilityFields is defined before using it in populate()
          if (!(!Array.isArray(feasibilityFields) || feasibilityFields.length === 0)) {
            _context3.next = 4;
            break;
          }
          throw new Error("feasibilityFields is not defined or empty.");
        case 4:
          _context3.next = 6;
          return Feasibility.find().populate("checkin").populate({
            path: feasibilityFields.map(function (field) {
              return "".concat(field, ".details");
            }).join(" "),
            // Join to avoid array issues
            model: "FeasabilityDetail"
          });
        case 6:
          feasibilities = _context3.sent;
          res.status(200).json(feasibilities);
          _context3.next = 14;
          break;
        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](0);
          console.error("❌ Error fetching feasibilities:", _context3.t0.message);
          res.status(500).json({
            message: "Error fetching feasibilities. Please try again later.",
            error: _context3.t0.message
          });
        case 14:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 10]]);
  }));
  return function (_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();

// **Get a Single Feasibility with its Check-in and Details**
var mongoose = require("mongoose");
exports.getFeasibilityById = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var id, feasibility;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          id = req.params.id;
          console.log("📢 Fetching feasibility for ID:", id);

          // 1️⃣ **Validate MongoDB ObjectId**
          if (mongoose.Types.ObjectId.isValid(id)) {
            _context4.next = 6;
            break;
          }
          console.error("❌ Invalid ID format:", id);
          return _context4.abrupt("return", res.status(400).json({
            message: "Invalid feasibility ID format."
          }));
        case 6:
          if (!(!Array.isArray(feasibilityFields) || feasibilityFields.length === 0)) {
            _context4.next = 9;
            break;
          }
          console.error("❌ feasibilityFields is not defined or empty.");
          return _context4.abrupt("return", res.status(500).json({
            message: "Server error: feasibilityFields is not set."
          }));
        case 9:
          _context4.next = 11;
          return Feasibility.findById(id).populate("checkin").populate({
            path: feasibilityFields.map(function (field) {
              return "".concat(field, ".details");
            }).join(" "),
            // Convert array to string
            model: "FeasabilityDetail"
          }).lean();
        case 11:
          feasibility = _context4.sent;
          if (feasibility) {
            _context4.next = 15;
            break;
          }
          console.warn("⚠️ Feasibility not found for ID:", id);
          return _context4.abrupt("return", res.status(404).json({
            message: "Feasibility not found."
          }));
        case 15:
          console.log("✅ Feasibility fetched successfully:", feasibility);
          res.status(200).json(feasibility);
          _context4.next = 23;
          break;
        case 19:
          _context4.prev = 19;
          _context4.t0 = _context4["catch"](0);
          console.error("❌ Error fetching feasibility:", _context4.t0.message);
          res.status(500).json({
            message: "Internal Server Error",
            error: _context4.t0.message
          });
        case 23:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 19]]);
  }));
  return function (_x6, _x7) {
    return _ref4.apply(this, arguments);
  };
}();

// **Update Feasibility and Check-in**
exports.updateFeasibility = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
    var feasibilityData, feasibilityId, existingFeasibility;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          feasibilityData = req.body;
          feasibilityId = req.params.id;
          _context6.next = 5;
          return Feasibility.findById(feasibilityId);
        case 5:
          existingFeasibility = _context6.sent;
          if (existingFeasibility) {
            _context6.next = 8;
            break;
          }
          return _context6.abrupt("return", res.status(404).json({
            message: "Feasibility not found"
          }));
        case 8:
          // Step 1: Update feasibility fields dynamically
          feasibilityFields.forEach(function (field) {
            var _feasibilityData$fiel8, _feasibilityData$fiel9;
            existingFeasibility[field].value = (_feasibilityData$fiel8 = (_feasibilityData$fiel9 = feasibilityData[field]) === null || _feasibilityData$fiel9 === void 0 ? void 0 : _feasibilityData$fiel9.value) !== null && _feasibilityData$fiel8 !== void 0 ? _feasibilityData$fiel8 : false;
          });
          _context6.next = 11;
          return existingFeasibility.save();
        case 11:
          _context6.next = 13;
          return Promise.all(feasibilityFields.map(/*#__PURE__*/function () {
            var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(field) {
              var _feasibilityData$fiel10;
              var newDetail;
              return _regeneratorRuntime().wrap(function _callee5$(_context5) {
                while (1) switch (_context5.prev = _context5.next) {
                  case 0:
                    if (!((_feasibilityData$fiel10 = feasibilityData[field]) !== null && _feasibilityData$fiel10 !== void 0 && _feasibilityData$fiel10.details)) {
                      _context5.next = 12;
                      break;
                    }
                    if (!existingFeasibility[field].details) {
                      _context5.next = 6;
                      break;
                    }
                    _context5.next = 4;
                    return FeasibilityDetail.findByIdAndUpdate(existingFeasibility[field].details, feasibilityData[field].details, {
                      "new": true
                    });
                  case 4:
                    _context5.next = 12;
                    break;
                  case 6:
                    _context5.next = 8;
                    return FeasibilityDetail.create(_objectSpread({
                      feasability_id: feasibilityId,
                      attribute_name: field
                    }, feasibilityData[field].details));
                  case 8:
                    newDetail = _context5.sent;
                    existingFeasibility[field].details = newDetail._id;
                    _context5.next = 12;
                    return existingFeasibility.save();
                  case 12:
                  case "end":
                    return _context5.stop();
                }
              }, _callee5);
            }));
            return function (_x10) {
              return _ref6.apply(this, arguments);
            };
          }()));
        case 13:
          if (!feasibilityData.checkin) {
            _context6.next = 16;
            break;
          }
          _context6.next = 16;
          return Checkin.findByIdAndUpdate(existingFeasibility.checkin, feasibilityData.checkin);
        case 16:
          res.status(200).json({
            message: "Feasibility and Check-in updated",
            data: existingFeasibility
          });
          _context6.next = 22;
          break;
        case 19:
          _context6.prev = 19;
          _context6.t0 = _context6["catch"](0);
          res.status(500).json({
            message: "Error updating feasibility",
            error: _context6.t0.message
          });
        case 22:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 19]]);
  }));
  return function (_x8, _x9) {
    return _ref5.apply(this, arguments);
  };
}();

// **Delete Feasibility and its Associated Check-in**
exports.deleteFeasibility = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(req, res) {
    var feasibility;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return Feasibility.findById(req.params.id);
        case 3:
          feasibility = _context7.sent;
          if (feasibility) {
            _context7.next = 6;
            break;
          }
          return _context7.abrupt("return", res.status(404).json({
            message: "Feasibility not found"
          }));
        case 6:
          if (!feasibility.checkin) {
            _context7.next = 9;
            break;
          }
          _context7.next = 9;
          return Checkin.findByIdAndDelete(feasibility.checkin);
        case 9:
          _context7.next = 11;
          return FeasibilityDetail.deleteMany({
            feasability_id: req.params.id
          });
        case 11:
          _context7.next = 13;
          return Feasibility.findByIdAndDelete(req.params.id);
        case 13:
          res.status(200).json({
            message: "Feasibility, Check-in, and related details deleted"
          });
          _context7.next = 19;
          break;
        case 16:
          _context7.prev = 16;
          _context7.t0 = _context7["catch"](0);
          res.status(500).json({
            message: "Error deleting feasibility",
            error: _context7.t0.message
          });
        case 19:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 16]]);
  }));
  return function (_x11, _x12) {
    return _ref7.apply(this, arguments);
  };
}();