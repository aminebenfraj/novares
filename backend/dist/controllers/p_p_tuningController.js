"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var P_P_Tuning = require("../models/pPTuningModel");
var Task = require("../models/Task");
var mongoose = require("mongoose");
var p_p_tuningFields = ["product_process_tuning", "functional_validation_test", "dimensional_validation_test", "aspect_validation_test", "supplier_order_modification", "acceptation_of_supplier", "capability", "manufacturing_of_control_parts", "product_training", "process_training", "purchase_file", "means_technical_file_data", "means_technical_file_manufacturing", "means_technical_file_maintenance", "tooling_file", "product_file", "internal_process"];
exports.createP_P_Tuning = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var p_p_tuningData, taskPromises, createdTaskIds, formattedP_P_TuningData, newP_P_Tuning;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          console.log("📢 Received P_P_Tuning Data:", JSON.stringify(req.body, null, 2));
          p_p_tuningData = req.body;
          if (p_p_tuningData) {
            _context2.next = 5;
            break;
          }
          throw new Error("P_P_Tuning data is missing!");
        case 5:
          console.log("✅ Step 1: Creating tasks...");
          taskPromises = p_p_tuningFields.map(/*#__PURE__*/function () {
            var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(field) {
              var _p_p_tuningData$field;
              var newTask;
              return _regeneratorRuntime().wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    if (!((_p_p_tuningData$field = p_p_tuningData[field]) !== null && _p_p_tuningData$field !== void 0 && _p_p_tuningData$field.task)) {
                      _context.next = 6;
                      break;
                    }
                    console.log("\uD83D\uDCE2 Creating task for ".concat(field));
                    newTask = new Task(p_p_tuningData[field].task);
                    _context.next = 5;
                    return newTask.save();
                  case 5:
                    return _context.abrupt("return", newTask._id);
                  case 6:
                    return _context.abrupt("return", null);
                  case 7:
                  case "end":
                    return _context.stop();
                }
              }, _callee);
            }));
            return function (_x3) {
              return _ref2.apply(this, arguments);
            };
          }());
          _context2.next = 9;
          return Promise.all(taskPromises);
        case 9:
          createdTaskIds = _context2.sent;
          console.log("✅ Task creation completed:", createdTaskIds);
          console.log("✅ Step 2: Formatting P_P_Tuning Data...");
          formattedP_P_TuningData = p_p_tuningFields.reduce(function (acc, field, index) {
            var _p_p_tuningData$field2, _p_p_tuningData$field3;
            acc[field] = {
              value: (_p_p_tuningData$field2 = (_p_p_tuningData$field3 = p_p_tuningData[field]) === null || _p_p_tuningData$field3 === void 0 ? void 0 : _p_p_tuningData$field3.value) !== null && _p_p_tuningData$field2 !== void 0 ? _p_p_tuningData$field2 : false,
              task: createdTaskIds[index] || null
            };
            return acc;
          }, {});
          console.log("✅ Step 3: Saving P_P_Tuning...", formattedP_P_TuningData);
          newP_P_Tuning = new P_P_Tuning(formattedP_P_TuningData);
          _context2.next = 17;
          return newP_P_Tuning.save();
        case 17:
          console.log("✅ P_P_Tuning created successfully:", newP_P_Tuning);
          res.status(201).json({
            message: "P_P_Tuning created successfully",
            data: newP_P_Tuning
          });
          _context2.next = 25;
          break;
        case 21:
          _context2.prev = 21;
          _context2.t0 = _context2["catch"](0);
          console.error("❌ Error creating P_P_Tuning:", _context2.t0);
          res.status(500).json({
            message: "Internal Server Error",
            error: _context2.t0.message
          });
        case 25:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 21]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
exports.getAllP_P_Tuning = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var p_p_tuning;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          console.log("📢 Fetching all P_P_Tuning...");
          _context3.next = 4;
          return P_P_Tuning.find().populate(p_p_tuningFields.map(function (field) {
            return {
              path: "".concat(field, ".task"),
              model: "Task"
            };
          }));
        case 4:
          p_p_tuning = _context3.sent;
          if (!(!p_p_tuning || p_p_tuning.length === 0)) {
            _context3.next = 7;
            break;
          }
          return _context3.abrupt("return", res.status(404).json({
            message: "No P_P_Tuning found."
          }));
        case 7:
          console.log("✅ P_P_Tuning fetched successfully:", p_p_tuning);
          res.status(200).json(p_p_tuning);
          _context3.next = 15;
          break;
        case 11:
          _context3.prev = 11;
          _context3.t0 = _context3["catch"](0);
          console.error("❌ Error fetching P_P_Tuning:", _context3.t0.message);
          res.status(500).json({
            message: "Error fetching P_P_Tuning",
            error: _context3.t0.message
          });
        case 15:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 11]]);
  }));
  return function (_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();
exports.getP_P_TuningById = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var id, p_p_tuning;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          id = req.params.id;
          console.log("📢 Fetching P_P_Tuning for ID:", id);
          if (mongoose.Types.ObjectId.isValid(id)) {
            _context4.next = 5;
            break;
          }
          return _context4.abrupt("return", res.status(400).json({
            message: "Invalid P_P_Tuning ID format."
          }));
        case 5:
          _context4.next = 7;
          return P_P_Tuning.findById(id).populate({
            path: p_p_tuningFields.map(function (field) {
              return "".concat(field, ".task");
            }).join(" "),
            model: "Task"
          }).lean();
        case 7:
          p_p_tuning = _context4.sent;
          if (p_p_tuning) {
            _context4.next = 10;
            break;
          }
          return _context4.abrupt("return", res.status(404).json({
            message: "P_P_Tuning not found."
          }));
        case 10:
          res.status(200).json(p_p_tuning);
          _context4.next = 16;
          break;
        case 13:
          _context4.prev = 13;
          _context4.t0 = _context4["catch"](0);
          res.status(500).json({
            message: "Internal Server Error",
            error: _context4.t0.message
          });
        case 16:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 13]]);
  }));
  return function (_x6, _x7) {
    return _ref4.apply(this, arguments);
  };
}();
exports.updateP_P_Tuning = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
    var p_p_tuningData, p_p_tuningId, existingP_P_Tuning;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          p_p_tuningData = req.body;
          p_p_tuningId = req.params.id;
          _context6.next = 5;
          return P_P_Tuning.findById(p_p_tuningId);
        case 5:
          existingP_P_Tuning = _context6.sent;
          if (existingP_P_Tuning) {
            _context6.next = 8;
            break;
          }
          return _context6.abrupt("return", res.status(404).json({
            message: "P_P_Tuning not found"
          }));
        case 8:
          // Step 1: Update P_P_Tuning fields dynamically
          p_p_tuningFields.forEach(function (field) {
            var _p_p_tuningData$field4, _p_p_tuningData$field5;
            existingP_P_Tuning[field].value = (_p_p_tuningData$field4 = (_p_p_tuningData$field5 = p_p_tuningData[field]) === null || _p_p_tuningData$field5 === void 0 ? void 0 : _p_p_tuningData$field5.value) !== null && _p_p_tuningData$field4 !== void 0 ? _p_p_tuningData$field4 : false;
          });
          _context6.next = 11;
          return existingP_P_Tuning.save();
        case 11:
          _context6.next = 13;
          return Promise.all(p_p_tuningFields.map(/*#__PURE__*/function () {
            var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(field) {
              var _p_p_tuningData$field6;
              var newTask;
              return _regeneratorRuntime().wrap(function _callee5$(_context5) {
                while (1) switch (_context5.prev = _context5.next) {
                  case 0:
                    if (!((_p_p_tuningData$field6 = p_p_tuningData[field]) !== null && _p_p_tuningData$field6 !== void 0 && _p_p_tuningData$field6.task)) {
                      _context5.next = 12;
                      break;
                    }
                    if (!existingP_P_Tuning[field].task) {
                      _context5.next = 6;
                      break;
                    }
                    _context5.next = 4;
                    return Task.findByIdAndUpdate(existingP_P_Tuning[field].task, p_p_tuningData[field].task, {
                      "new": true
                    });
                  case 4:
                    _context5.next = 12;
                    break;
                  case 6:
                    _context5.next = 8;
                    return Task.create(p_p_tuningData[field].task);
                  case 8:
                    newTask = _context5.sent;
                    existingP_P_Tuning[field].task = newTask._id;
                    _context5.next = 12;
                    return existingP_P_Tuning.save();
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
          res.status(200).json({
            message: "P_P_Tuning and Tasks updated",
            data: existingP_P_Tuning
          });
          _context6.next = 19;
          break;
        case 16:
          _context6.prev = 16;
          _context6.t0 = _context6["catch"](0);
          res.status(500).json({
            message: "Error updating P_P_Tuning",
            error: _context6.t0.message
          });
        case 19:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 16]]);
  }));
  return function (_x8, _x9) {
    return _ref5.apply(this, arguments);
  };
}();
exports.deleteP_P_Tuning = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(req, res) {
    var p_p_tuning, taskIds;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          console.log(req.params.id);
          _context7.prev = 1;
          _context7.next = 4;
          return P_P_Tuning.findById(req.params.id);
        case 4:
          p_p_tuning = _context7.sent;
          if (p_p_tuning) {
            _context7.next = 7;
            break;
          }
          return _context7.abrupt("return", res.status(404).json({
            message: "P_P_Tuning not found"
          }));
        case 7:
          // Step 1: Delete the associated tasks
          taskIds = p_p_tuningFields.map(function (field) {
            var _p_p_tuning$field;
            return (_p_p_tuning$field = p_p_tuning[field]) === null || _p_p_tuning$field === void 0 || (_p_p_tuning$field = _p_p_tuning$field.task) === null || _p_p_tuning$field === void 0 ? void 0 : _p_p_tuning$field._id;
          }).filter(Boolean);
          _context7.next = 10;
          return Task.deleteMany({
            _id: {
              $in: taskIds
            }
          });
        case 10:
          _context7.next = 12;
          return P_P_Tuning.findByIdAndDelete(req.params.id);
        case 12:
          res.status(200).json({
            message: "P_P_Tuning and associated tasks deleted"
          });
          _context7.next = 18;
          break;
        case 15:
          _context7.prev = 15;
          _context7.t0 = _context7["catch"](1);
          res.status(500).json({
            message: "Error deleting P_P_Tuning",
            error: _context7.t0.message
          });
        case 18:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[1, 15]]);
  }));
  return function (_x11, _x12) {
    return _ref7.apply(this, arguments);
  };
}();