"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var Material = require("../../models/gestionStockModels/MaterialModel");
var Supplier = require("../../models/gestionStockModels/SupplierModel");
var Machine = require("../../models/gestionStockModels/MachineModel");
var Location = require("../../models/gestionStockModels/LocationModel");
var Category = require("../../models/gestionStockModels/CategoryModel");

// Create Material with existence checks
exports.createMaterial = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
    var _req$body, supplier, manufacturer, reference, description, minimumStock, currentStock, orderLot, location, critical, consumable, machines, comment, photo, price, category, existingSupplier, existingLocation, existingCategory, foundMachines, newMaterial;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, supplier = _req$body.supplier, manufacturer = _req$body.manufacturer, reference = _req$body.reference, description = _req$body.description, minimumStock = _req$body.minimumStock, currentStock = _req$body.currentStock, orderLot = _req$body.orderLot, location = _req$body.location, critical = _req$body.critical, consumable = _req$body.consumable, machines = _req$body.machines, comment = _req$body.comment, photo = _req$body.photo, price = _req$body.price, category = _req$body.category; // Check if Supplier exists
          _context.next = 4;
          return Supplier.findById(supplier);
        case 4:
          existingSupplier = _context.sent;
          if (existingSupplier) {
            _context.next = 7;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            error: "Supplier not found"
          }));
        case 7:
          _context.next = 9;
          return Location.findById(location);
        case 9:
          existingLocation = _context.sent;
          if (existingLocation) {
            _context.next = 12;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            error: "Location not found"
          }));
        case 12:
          _context.next = 14;
          return Category.findById(category);
        case 14:
          existingCategory = _context.sent;
          if (existingCategory) {
            _context.next = 17;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            error: "Category not found"
          }));
        case 17:
          if (!(machines && machines.length > 0)) {
            _context.next = 23;
            break;
          }
          _context.next = 20;
          return Machine.find({
            _id: {
              $in: machines
            }
          });
        case 20:
          foundMachines = _context.sent;
          if (!(foundMachines.length !== machines.length)) {
            _context.next = 23;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            error: "One or more machines not found"
          }));
        case 23:
          // Create new Material
          newMaterial = new Material({
            supplier: supplier,
            manufacturer: manufacturer,
            reference: reference,
            description: description,
            minimumStock: minimumStock,
            currentStock: currentStock,
            orderLot: orderLot,
            location: location,
            critical: critical,
            consumable: consumable,
            machines: machines,
            comment: comment,
            photo: photo,
            price: price,
            category: category
          });
          _context.next = 26;
          return newMaterial.save();
        case 26:
          res.status(201).json(newMaterial);
          _context.next = 33;
          break;
        case 29:
          _context.prev = 29;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          res.status(500).json({
            error: "Failed to create material"
          });
        case 33:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 29]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

// Get all materials with populated references

// Get all materials with pagination, filtering, and search
exports.getAllMaterials = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var _req$query, _req$query$page, page, _req$query$limit, limit, _req$query$search, search, _req$query$sortBy, sortBy, _req$query$sortOrder, sortOrder, manufacturer, supplier, category, location, critical, consumable, stockStatus, minPrice, maxPrice, filter, exactMatch, historyMatches, total, _totalPages, paginatedResults, sort, totalMaterials, totalPages, materials;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$query = req.query, _req$query$page = _req$query.page, page = _req$query$page === void 0 ? 1 : _req$query$page, _req$query$limit = _req$query.limit, limit = _req$query$limit === void 0 ? 10 : _req$query$limit, _req$query$search = _req$query.search, search = _req$query$search === void 0 ? "" : _req$query$search, _req$query$sortBy = _req$query.sortBy, sortBy = _req$query$sortBy === void 0 ? "updatedAt" : _req$query$sortBy, _req$query$sortOrder = _req$query.sortOrder, sortOrder = _req$query$sortOrder === void 0 ? -1 : _req$query$sortOrder, manufacturer = _req$query.manufacturer, supplier = _req$query.supplier, category = _req$query.category, location = _req$query.location, critical = _req$query.critical, consumable = _req$query.consumable, stockStatus = _req$query.stockStatus, minPrice = _req$query.minPrice, maxPrice = _req$query.maxPrice; // Ensure page & limit are valid positive integers
          page = Math.max(Number.parseInt(page, 10) || 1, 1);
          limit = Math.max(Number.parseInt(limit, 10) || 10, 1);

          // Build query filters
          filter = {}; // Text search if provided - will search across reference, manufacturer, description
          if (!(search && search.trim() !== "")) {
            _context2.next = 20;
            break;
          }
          _context2.next = 8;
          return Material.findOne({
            reference: search.trim()
          });
        case 8:
          exactMatch = _context2.sent;
          if (!exactMatch) {
            _context2.next = 11;
            break;
          }
          return _context2.abrupt("return", res.status(200).json({
            total: 1,
            page: 1,
            limit: limit,
            totalPages: 1,
            data: [exactMatch]
          }));
        case 11:
          _context2.next = 13;
          return Material.find({
            "referenceHistory.oldReference": search.trim()
          });
        case 13:
          historyMatches = _context2.sent;
          if (!(historyMatches.length > 0)) {
            _context2.next = 19;
            break;
          }
          total = historyMatches.length;
          _totalPages = Math.ceil(total / limit);
          paginatedResults = historyMatches.slice((page - 1) * limit, page * limit);
          return _context2.abrupt("return", res.status(200).json({
            total: total,
            page: page,
            limit: limit,
            totalPages: _totalPages,
            data: paginatedResults,
            matchType: "history"
          }));
        case 19:
          // If no exact matches, use text search
          filter.$or = [{
            reference: {
              $regex: search,
              $options: "i"
            }
          }, {
            manufacturer: {
              $regex: search,
              $options: "i"
            }
          }, {
            description: {
              $regex: search,
              $options: "i"
            }
          }];
        case 20:
          // Add specific filters if provided
          if (manufacturer) filter.manufacturer = manufacturer;
          if (supplier) filter.supplier = supplier;
          if (category) filter.category = category;
          if (location) filter.location = location;
          if (critical !== undefined) filter.critical = critical === "true";
          if (consumable !== undefined) filter.consumable = consumable === "true";

          // Stock status filter
          if (!stockStatus) {
            _context2.next = 36;
            break;
          }
          _context2.t0 = stockStatus;
          _context2.next = _context2.t0 === "out_of_stock" ? 30 : _context2.t0 === "low_stock" ? 32 : _context2.t0 === "in_stock" ? 34 : 36;
          break;
        case 30:
          filter.currentStock = {
            $lte: 0
          };
          return _context2.abrupt("break", 36);
        case 32:
          filter.$and = [{
            currentStock: {
              $gt: 0
            }
          }, {
            $expr: {
              $lte: ["$currentStock", "$minimumStock"]
            }
          }];
          return _context2.abrupt("break", 36);
        case 34:
          filter.$expr = {
            $gt: ["$currentStock", "$minimumStock"]
          };
          return _context2.abrupt("break", 36);
        case 36:
          // Price range filter
          if (minPrice !== undefined || maxPrice !== undefined) {
            filter.price = {};
            if (minPrice !== undefined) filter.price.$gte = Number.parseFloat(minPrice);
            if (maxPrice !== undefined) filter.price.$lte = Number.parseFloat(maxPrice);
          }

          // Prepare sort options
          sort = {};
          sort[sortBy] = Number.parseInt(sortOrder);

          // Count total matching documents (for pagination)
          _context2.next = 41;
          return Material.countDocuments(filter);
        case 41:
          totalMaterials = _context2.sent;
          totalPages = Math.ceil(totalMaterials / limit); // Execute query with all filters, sorting, and pagination
          _context2.next = 45;
          return Material.find(filter).populate("supplier").populate("location").populate("machines").populate("category").sort(sort).skip((page - 1) * limit).limit(limit).lean();
        case 45:
          materials = _context2.sent;
          // Use lean() for better performance

          res.status(200).json({
            total: totalMaterials,
            page: page,
            limit: limit,
            totalPages: totalPages,
            data: materials
          });
          _context2.next = 53;
          break;
        case 49:
          _context2.prev = 49;
          _context2.t1 = _context2["catch"](0);
          console.error("Error fetching materials:", _context2.t1);
          res.status(500).json({
            message: "Error fetching materials",
            error: _context2.t1.message
          });
        case 53:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 49]]);
  }));
  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

// Get filter options for dropdowns
exports.getFilterOptions = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var field, allowedFields, options, distinctIds;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          field = req.params.field; // Only allow specific fields to be queried
          allowedFields = ["manufacturer", "supplier", "category", "location"];
          if (allowedFields.includes(field)) {
            _context3.next = 5;
            break;
          }
          return _context3.abrupt("return", res.status(400).json({
            message: "Invalid field for filter options"
          }));
        case 5:
          options = [];
          if (!(field === "manufacturer")) {
            _context3.next = 12;
            break;
          }
          _context3.next = 9;
          return Material.distinct(field);
        case 9:
          options = _context3.sent;
          _context3.next = 30;
          break;
        case 12:
          _context3.next = 14;
          return Material.distinct(field);
        case 14:
          distinctIds = _context3.sent;
          _context3.t0 = field;
          _context3.next = _context3.t0 === "supplier" ? 18 : _context3.t0 === "category" ? 22 : _context3.t0 === "location" ? 26 : 30;
          break;
        case 18:
          _context3.next = 20;
          return Supplier.find({
            _id: {
              $in: distinctIds
            }
          });
        case 20:
          options = _context3.sent;
          return _context3.abrupt("break", 30);
        case 22:
          _context3.next = 24;
          return Category.find({
            _id: {
              $in: distinctIds
            }
          });
        case 24:
          options = _context3.sent;
          return _context3.abrupt("break", 30);
        case 26:
          _context3.next = 28;
          return Location.find({
            _id: {
              $in: distinctIds
            }
          });
        case 28:
          options = _context3.sent;
          return _context3.abrupt("break", 30);
        case 30:
          res.status(200).json(options);
          _context3.next = 36;
          break;
        case 33:
          _context3.prev = 33;
          _context3.t1 = _context3["catch"](0);
          res.status(500).json({
            message: "Error fetching filter options",
            error: _context3.t1.message
          });
        case 36:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 33]]);
  }));
  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

// Get a single material by ID
exports.getMaterialById = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var material;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return Material.findById(req.params.id).populate("supplier").populate("location").populate("machines").populate("category");
        case 3:
          material = _context4.sent;
          if (material) {
            _context4.next = 6;
            break;
          }
          return _context4.abrupt("return", res.status(404).json({
            message: "Material not found"
          }));
        case 6:
          res.status(200).json(material);
          _context4.next = 13;
          break;
        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](0);
          console.error("Error fetching material by ID:", _context4.t0);
          res.status(500).json({
            message: "Error fetching material details",
            error: _context4.t0.message,
            stack: process.env.NODE_ENV === "development" ? _context4.t0.stack : undefined
          });
        case 13:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 9]]);
  }));
  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

// Update a material
exports.updateMaterial = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
    var existingMaterial, material;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return Material.findById(req.params.id);
        case 3:
          existingMaterial = _context5.sent;
          if (existingMaterial) {
            _context5.next = 6;
            break;
          }
          return _context5.abrupt("return", res.status(404).json({
            message: "Material not found"
          }));
        case 6:
          // Check if the reference is being updated and handle reference history
          if (req.body.reference && req.body.reference !== existingMaterial.reference) {
            // If referenceHistory is not provided in the request but reference is changing,
            // we need to add it automatically
            if (!req.body.referenceHistory) {
              req.body.referenceHistory = existingMaterial.referenceHistory || [];
              req.body.referenceHistory.push({
                oldReference: existingMaterial.reference,
                changedDate: new Date(),
                changedBy: req.user ? req.user._id : null,
                comment: "Reference changed from ".concat(existingMaterial.reference, " to ").concat(req.body.reference)
              });
            }
          }
          _context5.next = 9;
          return Material.findByIdAndUpdate(req.params.id, req.body, {
            "new": true
          });
        case 9:
          material = _context5.sent;
          res.status(200).json(material);
          _context5.next = 16;
          break;
        case 13:
          _context5.prev = 13;
          _context5.t0 = _context5["catch"](0);
          res.status(400).json({
            message: _context5.t0.message
          });
        case 16:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 13]]);
  }));
  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

// Delete a material
exports.deleteMaterial = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
    var material;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return Material.findByIdAndDelete(req.params.id);
        case 3:
          material = _context6.sent;
          if (material) {
            _context6.next = 6;
            break;
          }
          return _context6.abrupt("return", res.status(404).json({
            message: "Material not found"
          }));
        case 6:
          res.status(200).json({
            message: "Material deleted successfully"
          });
          _context6.next = 12;
          break;
        case 9:
          _context6.prev = 9;
          _context6.t0 = _context6["catch"](0);
          res.status(500).json({
            message: _context6.t0.message
          });
        case 12:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 9]]);
  }));
  return function (_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();