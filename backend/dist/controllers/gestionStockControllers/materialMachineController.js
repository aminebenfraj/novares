"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var MachineMaterial = require("../../models/gestionStockModels/MachineMaterialModel");
var Material = require("../../models/gestionStockModels/MaterialModel");
var mongoose = require("mongoose");

// Helper function to validate ObjectId
var isValidObjectId = function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
};
exports.allocateStock = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
    var _req$body, materialId, allocations, userId, material, totalRequestedStock, totalUsedStock, validUserId, _iterator, _step, _step$value, machineId, allocatedStock, machineMaterial, historyEntry, _historyEntry, materialHistoryEntry;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, materialId = _req$body.materialId, allocations = _req$body.allocations, userId = _req$body.userId; // Validate material existence
          _context.next = 4;
          return Material.findById(materialId);
        case 4:
          material = _context.sent;
          if (material) {
            _context.next = 7;
            break;
          }
          return _context.abrupt("return", res.status(404).json({
            error: "Material not found"
          }));
        case 7:
          // Check if enough stock is available
          totalRequestedStock = allocations.reduce(function (sum, alloc) {
            return sum + Number.parseInt(alloc.allocatedStock);
          }, 0);
          if (!(totalRequestedStock > material.currentStock)) {
            _context.next = 10;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            error: "Total allocated stock exceeds available stock."
          }));
        case 10:
          totalUsedStock = 0; // Track how much stock has been allocated
          // Validate userId if provided
          validUserId = null;
          if (userId && isValidObjectId(userId)) {
            validUserId = mongoose.Types.ObjectId(userId);
          }
          _iterator = _createForOfIteratorHelper(allocations);
          _context.prev = 14;
          _iterator.s();
        case 16:
          if ((_step = _iterator.n()).done) {
            _context.next = 42;
            break;
          }
          _step$value = _step.value, machineId = _step$value.machineId, allocatedStock = _step$value.allocatedStock;
          if (!(allocatedStock <= 0)) {
            _context.next = 20;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            error: "Allocated stock must be greater than 0."
          }));
        case 20:
          if (!(totalUsedStock + Number.parseInt(allocatedStock) > material.currentStock)) {
            _context.next = 22;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            error: "Not enough stock available. Only ".concat(material.currentStock - totalUsedStock, " left.")
          }));
        case 22:
          _context.next = 24;
          return MachineMaterial.findOne({
            material: materialId,
            machine: machineId
          });
        case 24:
          machineMaterial = _context.sent;
          if (!machineMaterial) {
            _context.next = 34;
            break;
          }
          // Create history entry without changedBy first
          historyEntry = {
            previousStock: machineMaterial.allocatedStock,
            newStock: Number.parseInt(allocatedStock),
            date: new Date(),
            comment: "Stock updated manually."
          }; // Only add changedBy if we have a valid userId
          if (validUserId) {
            historyEntry.changedBy = validUserId;
          }

          // Add to history
          machineMaterial.history.push(historyEntry);
          machineMaterial.allocatedStock = Number.parseInt(allocatedStock);
          _context.next = 32;
          return machineMaterial.save();
        case 32:
          _context.next = 39;
          break;
        case 34:
          // Create history entry without changedBy first
          _historyEntry = {
            previousStock: 0,
            newStock: Number.parseInt(allocatedStock),
            date: new Date(),
            comment: "Initial allocation."
          }; // Only add changedBy if we have a valid userId
          if (validUserId) {
            _historyEntry.changedBy = validUserId;
          }

          // Create new allocation with history
          machineMaterial = new MachineMaterial({
            material: materialId,
            machine: machineId,
            allocatedStock: Number.parseInt(allocatedStock),
            history: [_historyEntry]
          });
          _context.next = 39;
          return machineMaterial.save();
        case 39:
          totalUsedStock += Number.parseInt(allocatedStock); // Update used stock
        case 40:
          _context.next = 16;
          break;
        case 42:
          _context.next = 47;
          break;
        case 44:
          _context.prev = 44;
          _context.t0 = _context["catch"](14);
          _iterator.e(_context.t0);
        case 47:
          _context.prev = 47;
          _iterator.f();
          return _context.finish(47);
        case 50:
          // Update the material's current stock by subtracting the total allocated stock
          material.currentStock -= totalUsedStock;

          // Add a record to material history
          materialHistoryEntry = {
            changeDate: new Date(),
            description: "Allocated ".concat(totalUsedStock, " units to machines.")
          }; // Only add changedBy if we have a valid userId
          if (validUserId) {
            materialHistoryEntry.changedBy = validUserId;
          }
          material.materialHistory.push(materialHistoryEntry);
          _context.next = 56;
          return material.save();
        case 56:
          return _context.abrupt("return", res.status(200).json({
            message: "Stock successfully allocated with validation.",
            updatedStock: material.currentStock
          }));
        case 59:
          _context.prev = 59;
          _context.t1 = _context["catch"](0);
          console.error("Allocation error:", _context.t1);
          return _context.abrupt("return", res.status(500).json({
            error: _context.t1.message
          }));
        case 63:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 59], [14, 44, 47, 50]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

// Get all stock allocations
exports.getAllAllocations = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var allocations;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return MachineMaterial.find().populate("machine material");
        case 3:
          allocations = _context2.sent;
          return _context2.abrupt("return", res.status(200).json(allocations));
        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          return _context2.abrupt("return", res.status(500).json({
            error: _context2.t0.message
          }));
        case 10:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 7]]);
  }));
  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

// Get stock allocation for a specific material
exports.getMaterialAllocations = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var materialId, allocations;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          materialId = req.params.materialId;
          _context3.next = 4;
          return MachineMaterial.find({
            material: materialId
          }).populate("machine");
        case 4:
          allocations = _context3.sent;
          return _context3.abrupt("return", res.status(200).json(allocations));
        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](0);
          return _context3.abrupt("return", res.status(500).json({
            error: _context3.t0.message
          }));
        case 11:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 8]]);
  }));
  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

// Get stock allocation history for a machine
exports.getMachineStockHistory = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var machineId, history;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          machineId = req.params.machineId;
          _context4.next = 4;
          return MachineMaterial.find({
            machine: machineId
          }).populate("material").select("history material");
        case 4:
          history = _context4.sent;
          return _context4.abrupt("return", res.status(200).json(history));
        case 8:
          _context4.prev = 8;
          _context4.t0 = _context4["catch"](0);
          return _context4.abrupt("return", res.status(500).json({
            error: _context4.t0.message
          }));
        case 11:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 8]]);
  }));
  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

// Update a specific allocation
exports.updateAllocation = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
    var id, _req$body2, allocatedStock, userId, comment, allocation, material, stockDifference, historyEntry, materialHistoryEntry;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          id = req.params.id;
          _req$body2 = req.body, allocatedStock = _req$body2.allocatedStock, userId = _req$body2.userId, comment = _req$body2.comment; // Find the allocation
          _context5.next = 5;
          return MachineMaterial.findById(id);
        case 5:
          allocation = _context5.sent;
          if (allocation) {
            _context5.next = 8;
            break;
          }
          return _context5.abrupt("return", res.status(404).json({
            error: "Allocation not found"
          }));
        case 8:
          _context5.next = 10;
          return Material.findById(allocation.material);
        case 10:
          material = _context5.sent;
          if (material) {
            _context5.next = 13;
            break;
          }
          return _context5.abrupt("return", res.status(404).json({
            error: "Material not found"
          }));
        case 13:
          // Calculate stock difference
          stockDifference = Number.parseInt(allocatedStock) - allocation.allocatedStock; // Check if enough stock is available if increasing allocation
          if (!(stockDifference > 0 && stockDifference > material.currentStock)) {
            _context5.next = 16;
            break;
          }
          return _context5.abrupt("return", res.status(400).json({
            error: "Not enough stock available. Only ".concat(material.currentStock, " units available.")
          }));
        case 16:
          // Create history entry without changedBy first
          historyEntry = {
            previousStock: allocation.allocatedStock,
            newStock: Number.parseInt(allocatedStock),
            date: new Date(),
            comment: comment || "Stock updated from ".concat(allocation.allocatedStock, " to ").concat(allocatedStock, ".")
          }; // Validate userId if provided
          if (userId && isValidObjectId(userId)) {
            historyEntry.changedBy = mongoose.Types.ObjectId(userId);
          }

          // Add to history
          allocation.history.push(historyEntry);

          // Update allocation
          allocation.allocatedStock = Number.parseInt(allocatedStock);
          _context5.next = 22;
          return allocation.save();
        case 22:
          if (!(stockDifference !== 0)) {
            _context5.next = 29;
            break;
          }
          // If stockDifference is positive, we're adding more to the machine, so subtract from material stock
          // If stockDifference is negative, we're removing from the machine, so add back to material stock
          material.currentStock -= stockDifference;

          // Add a record to material history
          materialHistoryEntry = {
            changeDate: new Date(),
            description: stockDifference > 0 ? "Allocated ".concat(stockDifference, " additional units to machine ").concat(allocation.machine, ".") : "Returned ".concat(Math.abs(stockDifference), " units from machine ").concat(allocation.machine, ".")
          }; // Only add changedBy if we have a valid userId
          if (userId && isValidObjectId(userId)) {
            materialHistoryEntry.changedBy = mongoose.Types.ObjectId(userId);
          }
          material.materialHistory.push(materialHistoryEntry);
          _context5.next = 29;
          return material.save();
        case 29:
          return _context5.abrupt("return", res.status(200).json({
            message: "Allocation updated successfully",
            allocation: allocation,
            updatedMaterialStock: material.currentStock
          }));
        case 32:
          _context5.prev = 32;
          _context5.t0 = _context5["catch"](0);
          console.error("Update allocation error:", _context5.t0);
          return _context5.abrupt("return", res.status(500).json({
            error: _context5.t0.message
          }));
        case 36:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 32]]);
  }));
  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();