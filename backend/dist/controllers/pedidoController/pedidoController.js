"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var Pedido = require("../../models/pedido/Pedido");
var Material = require("../../models/gestionStockModels/MaterialModel");
var Solicitante = require("../../models/pedido/solicitanteModel");
var Tipo = require("../../models/pedido/tipoModel");
var Supplier = require("../../models/gestionStockModels/SupplierModel");
var TableStatus = require("../../models/pedido/TableStatus");
var mongoose = require("mongoose");

// Create Pedido with existence checks
exports.createPedido = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
    var _req$body, tipo, descripcionInterna, fabricante, referencia, descripcionProveedor, solicitante, cantidad, precioUnidad, importePedido, fechaSolicitud, proveedor, comentario, pedir, introducidaSAP, aceptado, date_receiving, direccion, weeks, table_status, recepcionado, qrCode, ano, existingTipo, existingMaterial, existingSolicitante, existingSupplier, existingTableStatus, calculatedDateReceiving, acceptanceDate, newPedidoData, newPedido, savedPedido;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, tipo = _req$body.tipo, descripcionInterna = _req$body.descripcionInterna, fabricante = _req$body.fabricante, referencia = _req$body.referencia, descripcionProveedor = _req$body.descripcionProveedor, solicitante = _req$body.solicitante, cantidad = _req$body.cantidad, precioUnidad = _req$body.precioUnidad, importePedido = _req$body.importePedido, fechaSolicitud = _req$body.fechaSolicitud, proveedor = _req$body.proveedor, comentario = _req$body.comentario, pedir = _req$body.pedir, introducidaSAP = _req$body.introducidaSAP, aceptado = _req$body.aceptado, date_receiving = _req$body.date_receiving, direccion = _req$body.direccion, weeks = _req$body.weeks, table_status = _req$body.table_status, recepcionado = _req$body.recepcionado, qrCode = _req$body.qrCode, ano = _req$body.ano; // Check if Tipo exists
          _context.next = 4;
          return Tipo.findById(tipo);
        case 4:
          existingTipo = _context.sent;
          if (existingTipo) {
            _context.next = 7;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            error: "Tipo not found"
          }));
        case 7:
          _context.next = 9;
          return Material.findById(referencia);
        case 9:
          existingMaterial = _context.sent;
          if (existingMaterial) {
            _context.next = 12;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            error: "Material not found"
          }));
        case 12:
          _context.next = 14;
          return Solicitante.findById(solicitante);
        case 14:
          existingSolicitante = _context.sent;
          if (existingSolicitante) {
            _context.next = 17;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            error: "Solicitante not found"
          }));
        case 17:
          if (!proveedor) {
            _context.next = 23;
            break;
          }
          _context.next = 20;
          return Supplier.findById(proveedor);
        case 20:
          existingSupplier = _context.sent;
          if (existingSupplier) {
            _context.next = 23;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            error: "Supplier not found"
          }));
        case 23:
          if (!table_status) {
            _context.next = 29;
            break;
          }
          _context.next = 26;
          return TableStatus.findById(table_status);
        case 26:
          existingTableStatus = _context.sent;
          if (existingTableStatus) {
            _context.next = 29;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            error: "Table status not found"
          }));
        case 29:
          // Calculate date_receiving if aceptado is provided but date_receiving is not
          calculatedDateReceiving = date_receiving;
          if (aceptado && !date_receiving) {
            acceptanceDate = new Date(aceptado);
            calculatedDateReceiving = new Date(acceptanceDate);
            calculatedDateReceiving.setDate(acceptanceDate.getDate() + 14); // Add 2 weeks (14 days)
          }

          // Set default values
          newPedidoData = {
            tipo: tipo,
            descripcionInterna: descripcionInterna,
            fabricante: fabricante,
            referencia: referencia,
            descripcionProveedor: descripcionProveedor,
            solicitante: solicitante,
            cantidad: cantidad,
            precioUnidad: precioUnidad,
            importePedido: importePedido,
            fechaSolicitud: fechaSolicitud || new Date(),
            proveedor: proveedor,
            comentario: comentario,
            pedir: pedir,
            introducidaSAP: introducidaSAP,
            aceptado: aceptado,
            date_receiving: calculatedDateReceiving,
            direccion: direccion,
            weeks: weeks,
            table_status: table_status,
            recepcionado: recepcionado,
            qrCode: qrCode,
            ano: ano || new Date().getFullYear()
          }; // Create new Pedido
          newPedido = new Pedido(newPedidoData); // Save will trigger the pre-save hook to populate material-related fields
          _context.next = 35;
          return newPedido.save();
        case 35:
          _context.next = 37;
          return Pedido.findById(newPedido._id).populate("tipo", "name").populate("referencia", "description price").populate("solicitante", "name email number").populate("proveedor", "name").populate("table_status", "name");
        case 37:
          savedPedido = _context.sent;
          res.status(201).json(savedPedido);
          _context.next = 45;
          break;
        case 41:
          _context.prev = 41;
          _context.t0 = _context["catch"](0);
          console.error("Error creating pedido:", _context.t0);
          res.status(500).json({
            message: "Error creating pedido",
            error: _context.t0.message
          });
        case 45:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 41]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

// Get all pedidos with pagination, filtering, and search
exports.getAllPedidos = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var _req$query, _req$query$page, page, _req$query$limit, limit, _req$query$search, search, _req$query$sortBy, sortBy, _req$query$sortOrder, sortOrder, tipo, fabricante, proveedor, solicitante, recepcionado, pedir, anoDesde, anoHasta, fechaDesde, fechaHasta, table_status, minImporte, maxImporte, filter, supplierByName, tipoByName, solicitanteByName, statusByName, exactMatch, tipoMatches, solicitanteMatches, materialMatches, supplierMatches, _tipoMatches, _solicitanteMatches, _materialMatches, _supplierMatches, sort, totalPedidos, totalPages, pedidos;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$query = req.query, _req$query$page = _req$query.page, page = _req$query$page === void 0 ? 1 : _req$query$page, _req$query$limit = _req$query.limit, limit = _req$query$limit === void 0 ? 10 : _req$query$limit, _req$query$search = _req$query.search, search = _req$query$search === void 0 ? "" : _req$query$search, _req$query$sortBy = _req$query.sortBy, sortBy = _req$query$sortBy === void 0 ? "fechaSolicitud" : _req$query$sortBy, _req$query$sortOrder = _req$query.sortOrder, sortOrder = _req$query$sortOrder === void 0 ? -1 : _req$query$sortOrder, tipo = _req$query.tipo, fabricante = _req$query.fabricante, proveedor = _req$query.proveedor, solicitante = _req$query.solicitante, recepcionado = _req$query.recepcionado, pedir = _req$query.pedir, anoDesde = _req$query.anoDesde, anoHasta = _req$query.anoHasta, fechaDesde = _req$query.fechaDesde, fechaHasta = _req$query.fechaHasta, table_status = _req$query.table_status, minImporte = _req$query.minImporte, maxImporte = _req$query.maxImporte; // Ensure page & limit are valid positive integers
          page = Math.max(Number.parseInt(page, 10) || 1, 1);
          limit = Math.max(Number.parseInt(limit, 10) || 10, 1);

          // Build query filters
          filter = {}; // IMPORTANT: Process reference fields BEFORE building any other part of the query
          // Handle proveedor (supplier) parameter
          if (!proveedor) {
            _context2.next = 18;
            break;
          }
          if (!mongoose.Types.ObjectId.isValid(proveedor)) {
            _context2.next = 10;
            break;
          }
          filter.proveedor = proveedor;
          _context2.next = 18;
          break;
        case 10:
          _context2.next = 12;
          return Supplier.findOne({
            name: {
              $regex: new RegExp(proveedor, "i")
            }
          });
        case 12:
          supplierByName = _context2.sent;
          if (!supplierByName) {
            _context2.next = 17;
            break;
          }
          filter.proveedor = supplierByName._id;
          _context2.next = 18;
          break;
        case 17:
          return _context2.abrupt("return", res.json({
            total: 0,
            page: page,
            limit: limit,
            totalPages: 0,
            data: []
          }));
        case 18:
          if (!tipo) {
            _context2.next = 31;
            break;
          }
          if (!mongoose.Types.ObjectId.isValid(tipo)) {
            _context2.next = 23;
            break;
          }
          filter.tipo = tipo;
          _context2.next = 31;
          break;
        case 23:
          _context2.next = 25;
          return Tipo.findOne({
            name: {
              $regex: new RegExp(tipo, "i")
            }
          });
        case 25:
          tipoByName = _context2.sent;
          if (!tipoByName) {
            _context2.next = 30;
            break;
          }
          filter.tipo = tipoByName._id;
          _context2.next = 31;
          break;
        case 30:
          return _context2.abrupt("return", res.json({
            total: 0,
            page: page,
            limit: limit,
            totalPages: 0,
            data: []
          }));
        case 31:
          if (!solicitante) {
            _context2.next = 44;
            break;
          }
          if (!mongoose.Types.ObjectId.isValid(solicitante)) {
            _context2.next = 36;
            break;
          }
          filter.solicitante = solicitante;
          _context2.next = 44;
          break;
        case 36:
          _context2.next = 38;
          return Solicitante.findOne({
            $or: [{
              name: {
                $regex: new RegExp(solicitante, "i")
              }
            }, {
              email: {
                $regex: new RegExp(solicitante, "i")
              }
            }]
          });
        case 38:
          solicitanteByName = _context2.sent;
          if (!solicitanteByName) {
            _context2.next = 43;
            break;
          }
          filter.solicitante = solicitanteByName._id;
          _context2.next = 44;
          break;
        case 43:
          return _context2.abrupt("return", res.json({
            total: 0,
            page: page,
            limit: limit,
            totalPages: 0,
            data: []
          }));
        case 44:
          if (!table_status) {
            _context2.next = 57;
            break;
          }
          if (!mongoose.Types.ObjectId.isValid(table_status)) {
            _context2.next = 49;
            break;
          }
          filter.table_status = table_status;
          _context2.next = 57;
          break;
        case 49:
          _context2.next = 51;
          return TableStatus.findOne({
            name: {
              $regex: new RegExp(table_status, "i")
            }
          });
        case 51:
          statusByName = _context2.sent;
          if (!statusByName) {
            _context2.next = 56;
            break;
          }
          filter.table_status = statusByName._id;
          _context2.next = 57;
          break;
        case 56:
          return _context2.abrupt("return", res.json({
            total: 0,
            page: page,
            limit: limit,
            totalPages: 0,
            data: []
          }));
        case 57:
          if (!(search && search.trim() !== "")) {
            _context2.next = 103;
            break;
          }
          _context2.next = 60;
          return Pedido.findOne({
            qrCode: search.trim()
          });
        case 60:
          exactMatch = _context2.sent;
          if (!exactMatch) {
            _context2.next = 63;
            break;
          }
          return _context2.abrupt("return", res.status(200).json({
            total: 1,
            page: 1,
            limit: limit,
            totalPages: 1,
            data: [exactMatch]
          }));
        case 63:
          if (!mongoose.Types.ObjectId.isValid(search)) {
            _context2.next = 84;
            break;
          }
          _context2.next = 66;
          return Tipo.find({
            $or: [{
              _id: search
            }, {
              name: {
                $regex: search,
                $options: "i"
              }
            }]
          }).select("_id");
        case 66:
          tipoMatches = _context2.sent;
          _context2.next = 69;
          return Solicitante.find({
            $or: [{
              _id: search
            }, {
              name: {
                $regex: search,
                $options: "i"
              }
            }, {
              email: {
                $regex: search,
                $options: "i"
              }
            }]
          }).select("_id");
        case 69:
          solicitanteMatches = _context2.sent;
          _context2.next = 72;
          return Material.find({
            $or: [{
              _id: search
            }, {
              reference: {
                $regex: search,
                $options: "i"
              }
            }, {
              description: {
                $regex: search,
                $options: "i"
              }
            }]
          }).select("_id");
        case 72:
          materialMatches = _context2.sent;
          _context2.next = 75;
          return Supplier.find({
            $or: [{
              _id: search
            }, {
              name: {
                $regex: search,
                $options: "i"
              }
            }]
          }).select("_id");
        case 75:
          supplierMatches = _context2.sent;
          filter.$or = [];
          if (tipoMatches.length > 0) {
            filter.$or.push({
              tipo: {
                $in: tipoMatches.map(function (t) {
                  return t._id;
                })
              }
            });
          }
          if (solicitanteMatches.length > 0) {
            filter.$or.push({
              solicitante: {
                $in: solicitanteMatches.map(function (s) {
                  return s._id;
                })
              }
            });
          }
          if (materialMatches.length > 0) {
            filter.$or.push({
              referencia: {
                $in: materialMatches.map(function (m) {
                  return m._id;
                })
              }
            });
          }
          if (supplierMatches.length > 0) {
            filter.$or.push({
              proveedor: {
                $in: supplierMatches.map(function (p) {
                  return p._id;
                })
              }
            });
          }

          // Also search in text fields
          filter.$or.push({
            fabricante: {
              $regex: search,
              $options: "i"
            }
          }, {
            descripcionInterna: {
              $regex: search,
              $options: "i"
            }
          }, {
            descripcionProveedor: {
              $regex: search,
              $options: "i"
            }
          }, {
            comentario: {
              $regex: search,
              $options: "i"
            }
          }, {
            qrCode: {
              $regex: search,
              $options: "i"
            }
          });
          _context2.next = 101;
          break;
        case 84:
          // If search is not a valid ObjectId, just search in text fields
          filter.$or = [{
            fabricante: {
              $regex: search,
              $options: "i"
            }
          }, {
            descripcionInterna: {
              $regex: search,
              $options: "i"
            }
          }, {
            descripcionProveedor: {
              $regex: search,
              $options: "i"
            }
          }, {
            comentario: {
              $regex: search,
              $options: "i"
            }
          }, {
            qrCode: {
              $regex: search,
              $options: "i"
            }
          }];

          // Also search in referenced models
          _context2.next = 87;
          return Tipo.find({
            name: {
              $regex: search,
              $options: "i"
            }
          }).select("_id");
        case 87:
          _tipoMatches = _context2.sent;
          _context2.next = 90;
          return Solicitante.find({
            $or: [{
              name: {
                $regex: search,
                $options: "i"
              }
            }, {
              email: {
                $regex: search,
                $options: "i"
              }
            }]
          }).select("_id");
        case 90:
          _solicitanteMatches = _context2.sent;
          _context2.next = 93;
          return Material.find({
            $or: [{
              reference: {
                $regex: search,
                $options: "i"
              }
            }, {
              description: {
                $regex: search,
                $options: "i"
              }
            }]
          }).select("_id");
        case 93:
          _materialMatches = _context2.sent;
          _context2.next = 96;
          return Supplier.find({
            name: {
              $regex: search,
              $options: "i"
            }
          }).select("_id");
        case 96:
          _supplierMatches = _context2.sent;
          if (_tipoMatches.length > 0) {
            filter.$or.push({
              tipo: {
                $in: _tipoMatches.map(function (t) {
                  return t._id;
                })
              }
            });
          }
          if (_solicitanteMatches.length > 0) {
            filter.$or.push({
              solicitante: {
                $in: _solicitanteMatches.map(function (s) {
                  return s._id;
                })
              }
            });
          }
          if (_materialMatches.length > 0) {
            filter.$or.push({
              referencia: {
                $in: _materialMatches.map(function (m) {
                  return m._id;
                })
              }
            });
          }
          if (_supplierMatches.length > 0) {
            filter.$or.push({
              proveedor: {
                $in: _supplierMatches.map(function (p) {
                  return p._id;
                })
              }
            });
          }
        case 101:
          _context2.next = 104;
          break;
        case 103:
          // If no text search but specific field filters are provided, use them
          // Note: We already handled reference fields above, so we only need to add non-reference fields
          if (fabricante) filter.fabricante = fabricante;
        case 104:
          // These filters are always applied regardless of search
          if (recepcionado) filter.recepcionado = recepcionado;
          if (pedir) filter.pedir = pedir;

          // Date and year range filters
          if (anoDesde || anoHasta) {
            filter.ano = {};
            if (anoDesde) filter.ano.$gte = Number.parseInt(anoDesde);
            if (anoHasta) filter.ano.$lte = Number.parseInt(anoHasta);
          }
          if (fechaDesde || fechaHasta) {
            filter.fechaSolicitud = {};
            if (fechaDesde) filter.fechaSolicitud.$gte = new Date(fechaDesde);
            if (fechaHasta) filter.fechaSolicitud.$lte = new Date(fechaHasta);
          }

          // Price range filter
          if (minImporte !== undefined || maxImporte !== undefined) {
            filter.importePedido = {};
            if (minImporte !== undefined) filter.importePedido.$gte = Number.parseFloat(minImporte);
            if (maxImporte !== undefined) filter.importePedido.$lte = Number.parseFloat(maxImporte);
          }

          // Prepare sort options
          sort = {};
          sort[sortBy] = Number.parseInt(sortOrder);

          // Count total matching documents (for pagination)
          _context2.next = 113;
          return Pedido.countDocuments(filter);
        case 113:
          totalPedidos = _context2.sent;
          totalPages = Math.ceil(totalPedidos / limit); // If the requested page is beyond available pages, return an empty array
          if (!(page > totalPages && totalPages > 0)) {
            _context2.next = 117;
            break;
          }
          return _context2.abrupt("return", res.json({
            total: totalPedidos,
            page: page,
            limit: limit,
            totalPages: totalPages,
            data: [] // Empty array if no results
          }));
        case 117:
          _context2.next = 119;
          return Pedido.find(filter).populate("tipo", "name").populate("referencia", "description price reference").populate("solicitante", "name email number").populate("proveedor", "name").populate("table_status", "name color").sort(sort).skip((page - 1) * limit).limit(limit).lean();
        case 119:
          pedidos = _context2.sent;
          // Use lean() for better performance

          res.json({
            total: totalPedidos,
            page: page,
            limit: limit,
            totalPages: totalPages,
            data: pedidos
          });
          _context2.next = 127;
          break;
        case 123:
          _context2.prev = 123;
          _context2.t0 = _context2["catch"](0);
          console.error("Error fetching pedidos:", _context2.t0);
          res.status(500).json({
            message: "Error fetching pedidos",
            error: _context2.t0.message
          });
        case 127:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 123]]);
  }));
  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
// Get a single pedido by ID
exports.getPedidoById = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var pedido;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return Pedido.findById(req.params.id).populate("tipo", "name").populate("referencia", "description price reference manufacturer").populate("solicitante", "name email number").populate("proveedor", "name contact email phone address").populate("table_status", "name color").lean();
        case 3:
          pedido = _context3.sent;
          if (pedido) {
            _context3.next = 6;
            break;
          }
          return _context3.abrupt("return", res.status(404).json({
            message: "Pedido not found"
          }));
        case 6:
          res.status(200).json(pedido);
          _context3.next = 13;
          break;
        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          console.error("Error fetching pedido by ID:", _context3.t0);
          res.status(500).json({
            message: "Error fetching pedido details",
            error: _context3.t0.message,
            stack: process.env.NODE_ENV === "development" ? _context3.t0.stack : undefined
          });
        case 13:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 9]]);
  }));
  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

// Update a pedido
exports.updatePedido = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var _existingPedido$acept, existingPedido, material, tipo, solicitante, proveedor, tableStatus, acceptanceDate, updatedPedido;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return Pedido.findById(req.params.id);
        case 3:
          existingPedido = _context4.sent;
          if (existingPedido) {
            _context4.next = 6;
            break;
          }
          return _context4.abrupt("return", res.status(404).json({
            message: "Pedido not found"
          }));
        case 6:
          if (!(req.body.referencia && req.body.referencia !== existingPedido.referencia.toString())) {
            _context4.next = 12;
            break;
          }
          _context4.next = 9;
          return Material.findById(req.body.referencia);
        case 9:
          material = _context4.sent;
          if (material) {
            _context4.next = 12;
            break;
          }
          return _context4.abrupt("return", res.status(400).json({
            error: "Material not found"
          }));
        case 12:
          if (!(req.body.tipo && req.body.tipo !== existingPedido.tipo.toString())) {
            _context4.next = 18;
            break;
          }
          _context4.next = 15;
          return Tipo.findById(req.body.tipo);
        case 15:
          tipo = _context4.sent;
          if (tipo) {
            _context4.next = 18;
            break;
          }
          return _context4.abrupt("return", res.status(400).json({
            error: "Tipo not found"
          }));
        case 18:
          if (!(req.body.solicitante && req.body.solicitante !== existingPedido.solicitante.toString())) {
            _context4.next = 24;
            break;
          }
          _context4.next = 21;
          return Solicitante.findById(req.body.solicitante);
        case 21:
          solicitante = _context4.sent;
          if (solicitante) {
            _context4.next = 24;
            break;
          }
          return _context4.abrupt("return", res.status(400).json({
            error: "Solicitante not found"
          }));
        case 24:
          if (!(req.body.proveedor && req.body.proveedor !== (existingPedido.proveedor ? existingPedido.proveedor.toString() : null))) {
            _context4.next = 30;
            break;
          }
          _context4.next = 27;
          return Supplier.findById(req.body.proveedor);
        case 27:
          proveedor = _context4.sent;
          if (proveedor) {
            _context4.next = 30;
            break;
          }
          return _context4.abrupt("return", res.status(400).json({
            error: "Supplier not found"
          }));
        case 30:
          if (!(req.body.table_status && req.body.table_status !== (existingPedido.table_status ? existingPedido.table_status.toString() : null))) {
            _context4.next = 36;
            break;
          }
          _context4.next = 33;
          return TableStatus.findById(req.body.table_status);
        case 33:
          tableStatus = _context4.sent;
          if (tableStatus) {
            _context4.next = 36;
            break;
          }
          return _context4.abrupt("return", res.status(400).json({
            error: "Table status not found"
          }));
        case 36:
          // Calculate date_receiving if aceptado is updated but date_receiving is not provided
          if (req.body.aceptado && req.body.aceptado !== ((_existingPedido$acept = existingPedido.aceptado) === null || _existingPedido$acept === void 0 ? void 0 : _existingPedido$acept.toString()) && !req.body.date_receiving) {
            acceptanceDate = new Date(req.body.aceptado);
            req.body.date_receiving = new Date(acceptanceDate);
            req.body.date_receiving.setDate(acceptanceDate.getDate() + 14); // Add 2 weeks (14 days)
          }

          // Update the pedido fields
          Object.keys(req.body).forEach(function (key) {
            existingPedido[key] = req.body[key];
          });

          // Save the updated pedido (this will trigger the pre-save hook)
          _context4.next = 40;
          return existingPedido.save();
        case 40:
          _context4.next = 42;
          return Pedido.findById(req.params.id).populate("tipo", "name").populate("referencia", "description price reference").populate("solicitante", "name email number").populate("proveedor", "name").populate("table_status", "name color");
        case 42:
          updatedPedido = _context4.sent;
          res.status(200).json(updatedPedido);
          _context4.next = 50;
          break;
        case 46:
          _context4.prev = 46;
          _context4.t0 = _context4["catch"](0);
          console.error("Error updating pedido:", _context4.t0);
          res.status(400).json({
            message: "Error updating pedido",
            error: _context4.t0.message
          });
        case 50:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 46]]);
  }));
  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

// Delete a pedido
exports.deletePedido = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
    var deletedPedido;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return Pedido.findByIdAndDelete(req.params.id);
        case 3:
          deletedPedido = _context5.sent;
          if (deletedPedido) {
            _context5.next = 6;
            break;
          }
          return _context5.abrupt("return", res.status(404).json({
            message: "Pedido not found"
          }));
        case 6:
          res.status(200).json({
            message: "Pedido deleted successfully"
          });
          _context5.next = 13;
          break;
        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](0);
          console.error("Error deleting pedido:", _context5.t0);
          res.status(500).json({
            message: "Error deleting pedido",
            error: _context5.t0.message
          });
        case 13:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 9]]);
  }));
  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

// Get filter options for dropdown menus
exports.getFilterOptions = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
    var field, allowedFields, options, distinctIds;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          field = req.params.field; // Only allow specific fields to be queried
          allowedFields = ["tipo", "fabricante", "proveedor", "solicitante", "recepcionado", "pedir", "ano", "table_status"];
          if (allowedFields.includes(field)) {
            _context6.next = 5;
            break;
          }
          return _context6.abrupt("return", res.status(400).json({
            message: "Invalid field for filter options"
          }));
        case 5:
          options = []; // For non-reference fields, use distinct
          if (!(field === "fabricante" || field === "recepcionado" || field === "pedir" || field === "ano")) {
            _context6.next = 12;
            break;
          }
          _context6.next = 9;
          return Pedido.distinct(field);
        case 9:
          options = _context6.sent;
          _context6.next = 34;
          break;
        case 12:
          _context6.next = 14;
          return Pedido.distinct(field);
        case 14:
          distinctIds = _context6.sent;
          _context6.t0 = field;
          _context6.next = _context6.t0 === "tipo" ? 18 : _context6.t0 === "solicitante" ? 22 : _context6.t0 === "proveedor" ? 26 : _context6.t0 === "table_status" ? 30 : 34;
          break;
        case 18:
          _context6.next = 20;
          return Tipo.find({
            _id: {
              $in: distinctIds
            }
          }).select("name").lean();
        case 20:
          options = _context6.sent;
          return _context6.abrupt("break", 34);
        case 22:
          _context6.next = 24;
          return Solicitante.find({
            _id: {
              $in: distinctIds
            }
          }).select("name email").lean();
        case 24:
          options = _context6.sent;
          return _context6.abrupt("break", 34);
        case 26:
          _context6.next = 28;
          return Supplier.find({
            _id: {
              $in: distinctIds
            }
          }).select("name").lean();
        case 28:
          options = _context6.sent;
          return _context6.abrupt("break", 34);
        case 30:
          _context6.next = 32;
          return TableStatus.find({
            _id: {
              $in: distinctIds
            }
          }).select("name color").lean();
        case 32:
          options = _context6.sent;
          return _context6.abrupt("break", 34);
        case 34:
          res.status(200).json(options);
          _context6.next = 41;
          break;
        case 37:
          _context6.prev = 37;
          _context6.t1 = _context6["catch"](0);
          console.error("Error fetching filter options:", _context6.t1);
          res.status(500).json({
            message: "Error fetching filter options",
            error: _context6.t1.message
          });
        case 41:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 37]]);
  }));
  return function (_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();

// Get statistics for dashboard
exports.getPedidoStats = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(req, res) {
    var currentYear, statusCounts, yearCounts, tipoCounts, totalValue, monthlyTotals, topSolicitantes;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          currentYear = new Date().getFullYear(); // Count pedidos by status
          _context7.next = 4;
          return Pedido.aggregate([{
            $group: {
              _id: "$table_status",
              count: {
                $sum: 1
              }
            }
          }, {
            $lookup: {
              from: "tablestatuses",
              localField: "_id",
              foreignField: "_id",
              as: "status_info"
            }
          }, {
            $unwind: {
              path: "$status_info",
              preserveNullAndEmptyArrays: true
            }
          }, {
            $project: {
              status: "$status_info.name",
              color: "$status_info.color",
              count: 1,
              _id: 0
            }
          }]);
        case 4:
          statusCounts = _context7.sent;
          _context7.next = 7;
          return Pedido.aggregate([{
            $group: {
              _id: "$ano",
              count: {
                $sum: 1
              }
            }
          }, {
            $sort: {
              _id: -1
            }
          }, {
            $project: {
              year: "$_id",
              count: 1,
              _id: 0
            }
          }]);
        case 7:
          yearCounts = _context7.sent;
          _context7.next = 10;
          return Pedido.aggregate([{
            $group: {
              _id: "$tipo",
              count: {
                $sum: 1
              }
            }
          }, {
            $lookup: {
              from: "tipos",
              localField: "_id",
              foreignField: "_id",
              as: "tipo_info"
            }
          }, {
            $unwind: {
              path: "$tipo_info",
              preserveNullAndEmptyArrays: true
            }
          }, {
            $project: {
              tipo: "$tipo_info.name",
              count: 1,
              _id: 0
            }
          }]);
        case 10:
          tipoCounts = _context7.sent;
          _context7.next = 13;
          return Pedido.aggregate([{
            $match: {
              ano: currentYear
            }
          }, {
            $group: {
              _id: null,
              total: {
                $sum: "$importePedido"
              }
            }
          }]);
        case 13:
          totalValue = _context7.sent;
          _context7.next = 16;
          return Pedido.aggregate([{
            $match: {
              ano: currentYear
            }
          }, {
            $group: {
              _id: {
                $month: "$fechaSolicitud"
              },
              total: {
                $sum: "$importePedido"
              },
              count: {
                $sum: 1
              }
            }
          }, {
            $sort: {
              _id: 1
            }
          }, {
            $project: {
              month: "$_id",
              total: 1,
              count: 1,
              _id: 0
            }
          }]);
        case 16:
          monthlyTotals = _context7.sent;
          _context7.next = 19;
          return Pedido.aggregate([{
            $group: {
              _id: "$solicitante",
              count: {
                $sum: 1
              },
              totalValue: {
                $sum: "$importePedido"
              }
            }
          }, {
            $sort: {
              count: -1
            }
          }, {
            $limit: 5
          }, {
            $lookup: {
              from: "solicitantes",
              localField: "_id",
              foreignField: "_id",
              as: "solicitante_info"
            }
          }, {
            $unwind: {
              path: "$solicitante_info",
              preserveNullAndEmptyArrays: true
            }
          }, {
            $project: {
              solicitante: "$solicitante_info.name",
              email: "$solicitante_info.email",
              count: 1,
              totalValue: 1,
              _id: 0
            }
          }]);
        case 19:
          topSolicitantes = _context7.sent;
          res.status(200).json({
            statusCounts: statusCounts,
            yearCounts: yearCounts,
            tipoCounts: tipoCounts,
            totalValue: totalValue.length > 0 ? totalValue[0].total : 0,
            monthlyTotals: monthlyTotals,
            topSolicitantes: topSolicitantes
          });
          _context7.next = 27;
          break;
        case 23:
          _context7.prev = 23;
          _context7.t0 = _context7["catch"](0);
          console.error("Error fetching pedido statistics:", _context7.t0);
          res.status(500).json({
            message: "Error fetching pedido statistics",
            error: _context7.t0.message
          });
        case 27:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 23]]);
  }));
  return function (_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();

// Bulk update pedidos
exports.bulkUpdatePedidos = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(req, res) {
    var _req$body2, ids, updates, existingPedidos, tipo, material, solicitante, proveedor, tableStatus, acceptanceDate, _material, result;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _req$body2 = req.body, ids = _req$body2.ids, updates = _req$body2.updates;
          if (!(!ids || !Array.isArray(ids) || ids.length === 0)) {
            _context8.next = 4;
            break;
          }
          return _context8.abrupt("return", res.status(400).json({
            error: "No pedido IDs provided"
          }));
        case 4:
          if (!(!updates || Object.keys(updates).length === 0)) {
            _context8.next = 6;
            break;
          }
          return _context8.abrupt("return", res.status(400).json({
            error: "No updates provided"
          }));
        case 6:
          _context8.next = 8;
          return Pedido.find({
            _id: {
              $in: ids
            }
          });
        case 8:
          existingPedidos = _context8.sent;
          if (!(existingPedidos.length !== ids.length)) {
            _context8.next = 11;
            break;
          }
          return _context8.abrupt("return", res.status(400).json({
            error: "One or more pedidos not found"
          }));
        case 11:
          if (!updates.tipo) {
            _context8.next = 17;
            break;
          }
          _context8.next = 14;
          return Tipo.findById(updates.tipo);
        case 14:
          tipo = _context8.sent;
          if (tipo) {
            _context8.next = 17;
            break;
          }
          return _context8.abrupt("return", res.status(400).json({
            error: "Tipo not found"
          }));
        case 17:
          if (!updates.referencia) {
            _context8.next = 23;
            break;
          }
          _context8.next = 20;
          return Material.findById(updates.referencia);
        case 20:
          material = _context8.sent;
          if (material) {
            _context8.next = 23;
            break;
          }
          return _context8.abrupt("return", res.status(400).json({
            error: "Material not found"
          }));
        case 23:
          if (!updates.solicitante) {
            _context8.next = 29;
            break;
          }
          _context8.next = 26;
          return Solicitante.findById(updates.solicitante);
        case 26:
          solicitante = _context8.sent;
          if (solicitante) {
            _context8.next = 29;
            break;
          }
          return _context8.abrupt("return", res.status(400).json({
            error: "Solicitante not found"
          }));
        case 29:
          // In the bulkUpdatePedidos function
          if (updates.proveedor === "") {
            updates.proveedor = null;
          }

          // Then continue with your existing validation
          if (!updates.proveedor) {
            _context8.next = 36;
            break;
          }
          _context8.next = 33;
          return Supplier.findById(updates.proveedor);
        case 33:
          proveedor = _context8.sent;
          if (proveedor) {
            _context8.next = 36;
            break;
          }
          return _context8.abrupt("return", res.status(400).json({
            error: "Supplier not found"
          }));
        case 36:
          if (!updates.table_status) {
            _context8.next = 42;
            break;
          }
          _context8.next = 39;
          return TableStatus.findById(updates.table_status);
        case 39:
          tableStatus = _context8.sent;
          if (tableStatus) {
            _context8.next = 42;
            break;
          }
          return _context8.abrupt("return", res.status(400).json({
            error: "Table status not found"
          }));
        case 42:
          // Calculate date_receiving if aceptado is updated but date_receiving is not provided
          if (updates.aceptado && !updates.date_receiving) {
            acceptanceDate = new Date(updates.aceptado);
            updates.date_receiving = new Date(acceptanceDate);
            updates.date_receiving.setDate(acceptanceDate.getDate() + 14); // Add 2 weeks (14 days)
          }

          // For bulk updates, we'll use updateMany for efficiency
          // Note: This won't trigger the pre-save hook, so we need to handle material-related fields manually
          if (!(updates.referencia && (updates.precioUnidad === undefined || updates.proveedor === undefined || updates.descripcionProveedor === undefined))) {
            _context8.next = 48;
            break;
          }
          _context8.next = 46;
          return Material.findById(updates.referencia);
        case 46:
          _material = _context8.sent;
          if (_material) {
            if (updates.precioUnidad === undefined) updates.precioUnidad = _material.price;
            if (updates.proveedor === undefined) updates.proveedor = _material.supplier;
            if (updates.descripcionProveedor === undefined) updates.descripcionProveedor = _material.description;
          }
        case 48:
          // Calculate importePedido if cantidad and precioUnidad are provided
          if (updates.cantidad !== undefined && updates.precioUnidad !== undefined) {
            updates.importePedido = updates.cantidad * updates.precioUnidad;
          }
          _context8.next = 51;
          return Pedido.updateMany({
            _id: {
              $in: ids
            }
          }, {
            $set: updates
          });
        case 51:
          result = _context8.sent;
          res.status(200).json({
            message: "".concat(result.modifiedCount, " pedidos updated successfully"),
            modifiedCount: result.modifiedCount
          });
          _context8.next = 59;
          break;
        case 55:
          _context8.prev = 55;
          _context8.t0 = _context8["catch"](0);
          console.error("Error bulk updating pedidos:", _context8.t0);
          res.status(500).json({
            message: "Error bulk updating pedidos",
            error: _context8.t0.message
          });
        case 59:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[0, 55]]);
  }));
  return function (_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}();

// Export pedidos to CSV
exports.exportPedidos = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9(req, res) {
    var ids, filter, idArray, pedidos, csvHeader, csvRows, csv;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          ids = req.query.ids;
          filter = {}; // If specific IDs are provided, filter by them
          if (ids) {
            idArray = ids.split(",");
            filter = {
              _id: {
                $in: idArray
              }
            };
          }

          // Get pedidos with populated fields
          _context9.next = 6;
          return Pedido.find(filter).populate("tipo", "name").populate("referencia", "description reference").populate("solicitante", "name email").populate("proveedor", "name").populate("table_status", "name").lean();
        case 6:
          pedidos = _context9.sent;
          // Create CSV header
          csvHeader = ["ID", "Tipo", "Descripción Interna", "Fabricante", "Referencia", "Descripción Proveedor", "Solicitante", "Cantidad", "Precio Unidad", "Importe Pedido", "Fecha Solicitud", "Proveedor", "Comentario", "Pedir", "Introducida SAP", "Aceptado", "Fecha Recepción", "Dirección", "Semanas", "Estado", "Recepcionado", "QR Code", "Año"].join(","); // Create CSV rows
          csvRows = pedidos.map(function (pedido) {
            return [pedido._id, pedido.tipo ? pedido.tipo.name : "", pedido.descripcionInterna || "", pedido.fabricante || "", pedido.referencia ? pedido.referencia.reference : "", pedido.descripcionProveedor || "", pedido.solicitante ? pedido.solicitante.name : "", pedido.cantidad || 0, pedido.precioUnidad || 0, pedido.importePedido || 0, pedido.fechaSolicitud ? new Date(pedido.fechaSolicitud).toISOString().split("T")[0] : "", pedido.proveedor ? pedido.proveedor.name : "", (pedido.comentario || "").replace(/,/g, ";").replace(/\n/g, " "),
            // Replace commas and newlines
            pedido.pedir || "", pedido.introducidaSAP ? new Date(pedido.introducidaSAP).toISOString().split("T")[0] : "", pedido.aceptado ? new Date(pedido.aceptado).toISOString().split("T")[0] : "", pedido.date_receiving ? new Date(pedido.date_receiving).toISOString().split("T")[0] : "", (pedido.direccion || "").replace(/,/g, ";"),
            // Replace commas
            pedido.weeks || "", pedido.table_status ? pedido.table_status.name : "", pedido.recepcionado || "", pedido.qrCode || "", pedido.ano || ""].join(",");
          }); // Combine header and rows
          csv = [csvHeader].concat(_toConsumableArray(csvRows)).join("\n"); // Set headers for file download
          res.setHeader("Content-Type", "text/csv");
          res.setHeader("Content-Disposition", "attachment; filename=pedidos_".concat(new Date().toISOString().split("T")[0], ".csv"));

          // Send the CSV data
          res.send(csv);
          _context9.next = 19;
          break;
        case 15:
          _context9.prev = 15;
          _context9.t0 = _context9["catch"](0);
          console.error('Error exporting pedidos:", error);ng pedidos:', _context9.t0);
          res.status(500).json({
            message: "Error exporting pedidos",
            error: _context9.t0.message
          });
        case 19:
        case "end":
          return _context9.stop();
      }
    }, _callee9, null, [[0, 15]]);
  }));
  return function (_x17, _x18) {
    return _ref9.apply(this, arguments);
  };
}();

// Generate QR code for a pedido
exports.generateQRCode = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee10(req, res) {
    var id, pedido;
    return _regeneratorRuntime().wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          id = req.params.id; // Find the pedido
          _context10.next = 4;
          return Pedido.findById(id);
        case 4:
          pedido = _context10.sent;
          if (pedido) {
            _context10.next = 7;
            break;
          }
          return _context10.abrupt("return", res.status(404).json({
            message: "Pedido not found"
          }));
        case 7:
          if (!pedido.qrCode) {
            _context10.next = 9;
            break;
          }
          return _context10.abrupt("return", res.status(200).json({
            qrCode: pedido.qrCode,
            pedidoId: pedido._id
          }));
        case 9:
          _context10.next = 11;
          return pedido.generateQRCode();
        case 11:
          res.status(200).json({
            qrCode: pedido.qrCode,
            pedidoId: pedido._id
          });
          _context10.next = 18;
          break;
        case 14:
          _context10.prev = 14;
          _context10.t0 = _context10["catch"](0);
          console.error("Error generating QR code:", _context10.t0);
          res.status(500).json({
            message: "Error generating QR code",
            error: _context10.t0.message
          });
        case 18:
        case "end":
          return _context10.stop();
      }
    }, _callee10, null, [[0, 14]]);
  }));
  return function (_x19, _x20) {
    return _ref10.apply(this, arguments);
  };
}();

// Get pedido by QR code
exports.getPedidoByQRCode = /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee11(req, res) {
    var qrCode, pedido;
    return _regeneratorRuntime().wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          qrCode = req.params.qrCode;
          _context11.next = 4;
          return Pedido.findOne({
            qrCode: qrCode
          }).populate("tipo", "name").populate("referencia", "description price reference manufacturer").populate("solicitante", "name email number").populate("proveedor", "name contact email phone address").populate("table_status", "name color").lean();
        case 4:
          pedido = _context11.sent;
          if (pedido) {
            _context11.next = 7;
            break;
          }
          return _context11.abrupt("return", res.status(404).json({
            message: "Pedido not found"
          }));
        case 7:
          res.status(200).json(pedido);
          _context11.next = 14;
          break;
        case 10:
          _context11.prev = 10;
          _context11.t0 = _context11["catch"](0);
          console.error("Error fetching pedido by QR code:", _context11.t0);
          res.status(500).json({
            message: "Error fetching pedido",
            error: _context11.t0.message
          });
        case 14:
        case "end":
          return _context11.stop();
      }
    }, _callee11, null, [[0, 10]]);
  }));
  return function (_x21, _x22) {
    return _ref11.apply(this, arguments);
  };
}();
// Get pedidos by QR code
exports.getPedidoByQRCode = /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee12(req, res) {
    var qrCode, pedido;
    return _regeneratorRuntime().wrap(function _callee12$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          qrCode = req.params.qrCode;
          _context12.next = 4;
          return Pedido.findOne({
            qrCode: qrCode
          }).populate("tipo", "name").populate("referencia", "description price reference manufacturer").populate("solicitante", "name email number").populate("proveedor", "name contact email phone address").populate("table_status", "name color").lean();
        case 4:
          pedido = _context12.sent;
          if (pedido) {
            _context12.next = 7;
            break;
          }
          return _context12.abrupt("return", res.status(404).json({
            message: "Pedido not found"
          }));
        case 7:
          res.status(200).json(pedido);
          _context12.next = 14;
          break;
        case 10:
          _context12.prev = 10;
          _context12.t0 = _context12["catch"](0);
          console.error("Error fetching pedido by QR code:", _context12.t0);
          res.status(500).json({
            message: "Error fetching pedido",
            error: _context12.t0.message
          });
        case 14:
        case "end":
          return _context12.stop();
      }
    }, _callee12, null, [[0, 10]]);
  }));
  return function (_x23, _x24) {
    return _ref12.apply(this, arguments);
  };
}();