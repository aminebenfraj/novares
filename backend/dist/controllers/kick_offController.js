"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var KickOff = require("../models/kickoff");
var Task = require("../models/Task");
var kickOffFields = ["timeScheduleApproved", "modificationLaunchOrder", "projectRiskAssessment", "standardsImpact", "validationOfCosts"];
exports.createKickOff = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var kickOffData, taskPromises, createdTaskIds, formattedKickOffData, newKickOff;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          console.log("📢 Received Kick-Off Data:", JSON.stringify(req.body, null, 2));
          kickOffData = req.body; // ✅ Step 1: Create tasks separately and store their _ids
          taskPromises = kickOffFields.map(/*#__PURE__*/function () {
            var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(field) {
              var _kickOffData$field;
              var newTask;
              return _regeneratorRuntime().wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    if (!((_kickOffData$field = kickOffData[field]) !== null && _kickOffData$field !== void 0 && _kickOffData$field.task)) {
                      _context.next = 5;
                      break;
                    }
                    newTask = new Task(kickOffData[field].task);
                    _context.next = 4;
                    return newTask.save();
                  case 4:
                    return _context.abrupt("return", newTask._id);
                  case 5:
                    return _context.abrupt("return", null);
                  case 6:
                  case "end":
                    return _context.stop();
                }
              }, _callee);
            }));
            return function (_x3) {
              return _ref2.apply(this, arguments);
            };
          }());
          _context2.next = 6;
          return Promise.all(taskPromises);
        case 6:
          createdTaskIds = _context2.sent;
          // ✅ Step 2: Build the Kick-Off object with task _ids
          formattedKickOffData = kickOffFields.reduce(function (acc, field, index) {
            var _kickOffData$field$va, _kickOffData$field2;
            acc[field] = {
              value: (_kickOffData$field$va = (_kickOffData$field2 = kickOffData[field]) === null || _kickOffData$field2 === void 0 ? void 0 : _kickOffData$field2.value) !== null && _kickOffData$field$va !== void 0 ? _kickOffData$field$va : false,
              task: createdTaskIds[index] || null // Store only the ObjectId
            };
            return acc;
          }, {}); // ✅ Step 3: Save the Kick-Off entry
          newKickOff = new KickOff(formattedKickOffData);
          _context2.next = 11;
          return newKickOff.save();
        case 11:
          console.log("✅ Kick-Off created successfully:", newKickOff);
          res.status(201).json({
            message: "Kick-Off created successfully",
            data: newKickOff
          });
          _context2.next = 19;
          break;
        case 15:
          _context2.prev = 15;
          _context2.t0 = _context2["catch"](0);
          console.error("❌ Error creating Kick-Off:", _context2.t0.message);
          res.status(500).json({
            message: "Internal Server Error",
            error: _context2.t0.message
          });
        case 19:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 15]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

// **Get All Kick-Offs with Tasks**

exports.getAllKickOffs = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var kickOffs;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          console.log("📢 Fetching all Kick-Offs...");
          _context3.next = 4;
          return KickOff.find().populate({
            path: kickOffFields.map(function (field) {
              return "".concat(field, ".task");
            }).join(" "),
            model: "Task"
          });
        case 4:
          kickOffs = _context3.sent;
          console.log("✅ Kick-Offs fetched successfully:", kickOffs);
          res.status(200).json(kickOffs);
          _context3.next = 13;
          break;
        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          console.error("❌ Error fetching Kick-Offs:", _context3.t0.message);
          res.status(500).json({
            message: "Error fetching Kick-Offs",
            error: _context3.t0.message
          });
        case 13:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 9]]);
  }));
  return function (_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();
// **Get a Single Kick-Off with Tasks**
var mongoose = require("mongoose");
exports.getKickOffById = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var id, kickOff;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          id = req.params.id;
          console.log("📢 Fetching Kick-Off for ID:", id);
          if (mongoose.Types.ObjectId.isValid(id)) {
            _context4.next = 5;
            break;
          }
          return _context4.abrupt("return", res.status(400).json({
            message: "Invalid Kick-Off ID format."
          }));
        case 5:
          _context4.next = 7;
          return KickOff.findById(id).populate({
            path: kickOffFields.map(function (field) {
              return "".concat(field, ".task");
            }).join(" "),
            model: "Task"
          }).lean();
        case 7:
          kickOff = _context4.sent;
          if (kickOff) {
            _context4.next = 10;
            break;
          }
          return _context4.abrupt("return", res.status(404).json({
            message: "Kick-Off not found."
          }));
        case 10:
          res.status(200).json(kickOff);
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

// **Update Kick-Off and Tasks**
exports.updateKickOff = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
    var kickOffData, kickOffId, existingKickOff;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          kickOffData = req.body;
          kickOffId = req.params.id;
          _context6.next = 5;
          return KickOff.findById(kickOffId);
        case 5:
          existingKickOff = _context6.sent;
          if (existingKickOff) {
            _context6.next = 8;
            break;
          }
          return _context6.abrupt("return", res.status(404).json({
            message: "Kick-Off not found"
          }));
        case 8:
          // Step 1: Update kick-off fields dynamically
          kickOffFields.forEach(function (field) {
            var _kickOffData$field$va2, _kickOffData$field3;
            existingKickOff[field].value = (_kickOffData$field$va2 = (_kickOffData$field3 = kickOffData[field]) === null || _kickOffData$field3 === void 0 ? void 0 : _kickOffData$field3.value) !== null && _kickOffData$field$va2 !== void 0 ? _kickOffData$field$va2 : false;
          });
          _context6.next = 11;
          return existingKickOff.save();
        case 11:
          _context6.next = 13;
          return Promise.all(kickOffFields.map(/*#__PURE__*/function () {
            var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(field) {
              var _kickOffData$field4;
              var newTask;
              return _regeneratorRuntime().wrap(function _callee5$(_context5) {
                while (1) switch (_context5.prev = _context5.next) {
                  case 0:
                    if (!((_kickOffData$field4 = kickOffData[field]) !== null && _kickOffData$field4 !== void 0 && _kickOffData$field4.task)) {
                      _context5.next = 12;
                      break;
                    }
                    if (!existingKickOff[field].task) {
                      _context5.next = 6;
                      break;
                    }
                    _context5.next = 4;
                    return Task.findByIdAndUpdate(existingKickOff[field].task, kickOffData[field].task, {
                      "new": true
                    });
                  case 4:
                    _context5.next = 12;
                    break;
                  case 6:
                    _context5.next = 8;
                    return Task.create(kickOffData[field].task);
                  case 8:
                    newTask = _context5.sent;
                    existingKickOff[field].task = newTask._id;
                    _context5.next = 12;
                    return existingKickOff.save();
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
            message: "Kick-Off and Tasks updated",
            data: existingKickOff
          });
          _context6.next = 19;
          break;
        case 16:
          _context6.prev = 16;
          _context6.t0 = _context6["catch"](0);
          res.status(500).json({
            message: "Error updating Kick-Off",
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

// **Delete Kick-Off and Associated Tasks**
exports.deleteKickOff = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(req, res) {
    var kickOff, taskIds;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return KickOff.findById(req.params.id);
        case 3:
          kickOff = _context7.sent;
          if (kickOff) {
            _context7.next = 6;
            break;
          }
          return _context7.abrupt("return", res.status(404).json({
            message: "Kick-Off not found"
          }));
        case 6:
          // Step 1: Delete the associated tasks
          taskIds = kickOffFields.map(function (field) {
            var _kickOff$field;
            return (_kickOff$field = kickOff[field]) === null || _kickOff$field === void 0 ? void 0 : _kickOff$field.task;
          }).filter(Boolean);
          _context7.next = 9;
          return Task.deleteMany({
            _id: {
              $in: taskIds
            }
          });
        case 9:
          _context7.next = 11;
          return KickOff.findByIdAndDelete(req.params.id);
        case 11:
          res.status(200).json({
            message: "Kick-Off and associated tasks deleted"
          });
          _context7.next = 17;
          break;
        case 14:
          _context7.prev = 14;
          _context7.t0 = _context7["catch"](0);
          res.status(500).json({
            message: "Error deleting Kick-Off",
            error: _context7.t0.message
          });
        case 17:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 14]]);
  }));
  return function (_x11, _x12) {
    return _ref7.apply(this, arguments);
  };
}();