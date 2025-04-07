"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var MassProduction = require("../models/MassProductionModel");
var ProductDesignation = require("../models/ProductDesignationModel");
var User = require("../models/UserModel");
var sendEmail = require("../utils/emailService"); // ✅ Import Nodemailer service
var mongoose = require("mongoose");
exports.createMassProduction = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
    var _req$body, id, status, status_type, project_n, product_designation, description, customer, technical_skill, initial_request, request_original, feasibility, validation_for_offer, customer_offer, customer_order, ok_for_lunch, kick_off, design, facilities, p_p_tuning, process_qualif, qualification_confirmation, ppap_submission_date, ppap_submitted, closure, comment, next_review, mlo, tko, cv, pt1, pt2, sop, assignedRole, assignedEmail, customerExists, validProducts, days_until_ppap_submission, today, ppapDate, newMassProduction, emailSubject, emailBody;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          console.log("🔍 Received Data:", req.body); // ✅ Debugging log
          _req$body = req.body, id = _req$body.id, status = _req$body.status, status_type = _req$body.status_type, project_n = _req$body.project_n, product_designation = _req$body.product_designation, description = _req$body.description, customer = _req$body.customer, technical_skill = _req$body.technical_skill, initial_request = _req$body.initial_request, request_original = _req$body.request_original, feasibility = _req$body.feasibility, validation_for_offer = _req$body.validation_for_offer, customer_offer = _req$body.customer_offer, customer_order = _req$body.customer_order, ok_for_lunch = _req$body.ok_for_lunch, kick_off = _req$body.kick_off, design = _req$body.design, facilities = _req$body.facilities, p_p_tuning = _req$body.p_p_tuning, process_qualif = _req$body.process_qualif, qualification_confirmation = _req$body.qualification_confirmation, ppap_submission_date = _req$body.ppap_submission_date, ppap_submitted = _req$body.ppap_submitted, closure = _req$body.closure, comment = _req$body.comment, next_review = _req$body.next_review, mlo = _req$body.mlo, tko = _req$body.tko, cv = _req$body.cv, pt1 = _req$body.pt1, pt2 = _req$body.pt2, sop = _req$body.sop, assignedRole = _req$body.assignedRole, assignedEmail = _req$body.assignedEmail; // ✅ Ensure customer exists and has "Customer" role
          _context.next = 5;
          return User.findById(customer);
        case 5:
          customerExists = _context.sent;
          if (!(!customerExists || !customerExists.roles.includes("Customer"))) {
            _context.next = 8;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            error: "Invalid customer ID or user is not a customer"
          }));
        case 8:
          if (!(!assignedRole || !assignedEmail)) {
            _context.next = 11;
            break;
          }
          console.error("❌ Missing assignedRole or assignedEmail:", {
            assignedRole: assignedRole,
            assignedEmail: assignedEmail
          });
          return _context.abrupt("return", res.status(400).json({
            error: "Assigned role and email are required"
          }));
        case 11:
          if (Array.isArray(product_designation)) {
            _context.next = 13;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            error: "Product designation must be an array of IDs"
          }));
        case 13:
          console.log("🔍 Raw product_designation received:", product_designation);
          if (!(product_designation.length === 0)) {
            _context.next = 16;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            error: "No valid product designation IDs provided"
          }));
        case 16:
          _context.next = 18;
          return ProductDesignation.find({
            _id: {
              $in: product_designation
            }
          });
        case 18:
          validProducts = _context.sent;
          if (!(validProducts.length !== product_designation.length)) {
            _context.next = 21;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            error: "Some product designations are invalid or do not exist in the database",
            missingIds: product_designation.filter(function (id) {
              return !validProducts.some(function (product) {
                return product._id.toString() === id.toString();
              });
            })
          }));
        case 21:
          // ✅ Calculate days until PPAP submission
          days_until_ppap_submission = null;
          if (ppap_submission_date) {
            today = new Date();
            ppapDate = new Date(ppap_submission_date);
            if (!isNaN(ppapDate)) {
              days_until_ppap_submission = Math.max(0, Math.ceil((ppapDate - today) / (1000 * 60 * 60 * 24)));
            }
          }
          console.log("✅ Valid Products in DB:", validProducts);

          // ✅ Create new MassProduction entry
          newMassProduction = new MassProduction({
            id: id,
            status: status,
            status_type: status_type,
            project_n: project_n,
            product_designation: validProducts.map(function (product) {
              return product._id;
            }),
            // ✅ Store only valid ObjectIds
            description: description,
            customer: customer,
            technical_skill: technical_skill,
            initial_request: initial_request,
            request_original: request_original,
            feasibility: feasibility,
            validation_for_offer: validation_for_offer,
            customer_offer: customer_offer,
            customer_order: customer_order,
            ok_for_lunch: ok_for_lunch,
            kick_off: kick_off,
            design: design,
            facilities: facilities,
            p_p_tuning: p_p_tuning,
            process_qualif: process_qualif,
            qualification_confirmation: qualification_confirmation,
            // Add this line
            ppap_submission_date: ppap_submission_date,
            ppap_submitted: ppap_submitted,
            closure: closure,
            comment: comment,
            next_review: next_review,
            mlo: mlo,
            tko: tko,
            cv: cv,
            pt1: pt1,
            pt2: pt2,
            sop: sop,
            days_until_ppap_submission: days_until_ppap_submission,
            assignedRole: assignedRole,
            assignedEmail: assignedEmail
          });
          _context.next = 27;
          return newMassProduction.save();
        case 27:
          console.log("✅ Mass Production Saved:", newMassProduction);

          // ✅ Send email notification to assigned user
          emailSubject = "Mass Production Task Assigned to ".concat(assignedRole);
          emailBody = "\n      <h3>Dear ".concat(assignedRole, ",</h3>\n      <p>A new mass production task has been assigned to your role.</p>\n      <p><strong>Project:</strong> ").concat(project_n, "</p>\n      <p><strong>Description:</strong> ").concat(description, "</p>\n      <p>Please log in and complete the missing fields.</p>\n      <a href=\"http://your-frontend-url.com/mass-production/").concat(newMassProduction._id, "\">View Task</a>\n    ");
          _context.prev = 30;
          _context.next = 33;
          return sendEmail(assignedEmail, emailSubject, emailBody);
        case 33:
          console.log("\uD83D\uDCE7 Email sent successfully to ".concat(assignedEmail));
          _context.next = 39;
          break;
        case 36:
          _context.prev = 36;
          _context.t0 = _context["catch"](30);
          console.error("❌ Error sending email:", _context.t0.message);
        case 39:
          res.status(201).json({
            message: "Mass Production task created & email sent!",
            newMassProduction: newMassProduction
          });
          _context.next = 46;
          break;
        case 42:
          _context.prev = 42;
          _context.t1 = _context["catch"](0);
          console.error("❌ Error creating MassProduction:", _context.t1);
          res.status(500).json({
            error: "Server error",
            details: _context.t1.message
          });
        case 46:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 42], [30, 36]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

// ✅ Get all MassProduction entries (with filtering, pagination)
exports.getAllMassProductions = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var _req$query, status, customer, _req$query$page, page, _req$query$limit, limit, filter, massProductions;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$query = req.query, status = _req$query.status, customer = _req$query.customer, _req$query$page = _req$query.page, page = _req$query$page === void 0 ? 1 : _req$query$page, _req$query$limit = _req$query.limit, limit = _req$query$limit === void 0 ? 10 : _req$query$limit;
          filter = {};
          if (status) filter.status = status;
          if (customer) filter.customer = customer;
          _context2.next = 7;
          return MassProduction.find(filter).populate("customer", "username email").populate("product_designation", "part_name reference").populate("feasibility").populate("validation_for_offer", null, "validationForOffer") // ✅ FIX: Specify model name
          .populate("ok_for_lunch").populate("kick_off").populate("design").populate("facilities").populate("p_p_tuning").populate("process_qualif").populate("qualification_confirmation") // Add this line
          .sort({
            createdAt: -1
          }).skip((page - 1) * limit).limit(Number.parseInt(limit));
        case 7:
          massProductions = _context2.sent;
          res.json(massProductions);
          _context2.next = 15;
          break;
        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](0);
          console.error("❌ Error fetching MassProductions:", _context2.t0);
          res.status(500).json({
            error: "Server error"
          });
        case 15:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 11]]);
  }));
  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

// ✅ Get a single MassProduction by ID
exports.getMassProductionById = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var massProduction;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return MassProduction.findById(req.params.id).populate("customer", "username email").populate("product_designation", "part_name reference").populate("feasibility").populate("validation_for_offer", null, "validationForOffer") // ✅ FIX: Specify model name
          .populate("ok_for_lunch").populate("kick_off").populate("design").populate("facilities").populate("p_p_tuning").populate("process_qualif").populate("qualification_confirmation");
        case 3:
          massProduction = _context3.sent;
          if (massProduction) {
            _context3.next = 6;
            break;
          }
          return _context3.abrupt("return", res.status(404).json({
            error: "MassProduction not found"
          }));
        case 6:
          res.json(massProduction);
          _context3.next = 13;
          break;
        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          console.error("❌ Error fetching MassProduction by ID:", _context3.t0);
          res.status(500).json({
            error: "Server error"
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

// ✅ Update a MassProduction entry
exports.updateMassProduction = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var updatedData, customerExists, validProducts, today, ppapDate, updatedMassProduction;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          updatedData = req.body; // ✅ Ensure customer exists if updating it
          if (!updatedData.customer) {
            _context4.next = 8;
            break;
          }
          _context4.next = 5;
          return User.findById(updatedData.customer);
        case 5:
          customerExists = _context4.sent;
          if (!(!customerExists || customerExists.role !== "customer")) {
            _context4.next = 8;
            break;
          }
          return _context4.abrupt("return", res.status(400).json({
            error: "Invalid customer ID or user is not a customer"
          }));
        case 8:
          if (!updatedData.product_designation) {
            _context4.next = 16;
            break;
          }
          if (Array.isArray(updatedData.product_designation)) {
            _context4.next = 11;
            break;
          }
          return _context4.abrupt("return", res.status(400).json({
            error: "Product designation must be an array of IDs"
          }));
        case 11:
          _context4.next = 13;
          return ProductDesignation.find({
            _id: {
              $in: updatedData.product_designation
            }
          });
        case 13:
          validProducts = _context4.sent;
          if (!(validProducts.length !== updatedData.product_designation.length)) {
            _context4.next = 16;
            break;
          }
          return _context4.abrupt("return", res.status(400).json({
            error: "Some product designations are invalid"
          }));
        case 16:
          // ✅ Calculate days until PPAP submission if updated
          if (updatedData.ppap_submission_date) {
            today = new Date();
            ppapDate = new Date(updatedData.ppap_submission_date);
            updatedData.days_until_ppap_submission = Math.max(0, Math.ceil((ppapDate - today) / (1000 * 60 * 60 * 24))); // Convert to days
          }
          _context4.next = 19;
          return MassProduction.findByIdAndUpdate(req.params.id, {
            $set: updatedData
          }, {
            "new": true,
            runValidators: true
          } // ✅ Ensures validation on update
          );
        case 19:
          updatedMassProduction = _context4.sent;
          if (updatedMassProduction) {
            _context4.next = 22;
            break;
          }
          return _context4.abrupt("return", res.status(404).json({
            error: "MassProduction not found"
          }));
        case 22:
          res.json(updatedMassProduction);
          _context4.next = 29;
          break;
        case 25:
          _context4.prev = 25;
          _context4.t0 = _context4["catch"](0);
          console.error("❌ Error updating MassProduction:", _context4.t0);
          res.status(500).json({
            error: "Server error"
          });
        case 29:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 25]]);
  }));
  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

// ✅ Delete a MassProduction entry
exports.deleteMassProduction = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
    var deletedMassProduction;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return MassProduction.findByIdAndDelete(req.params.id);
        case 3:
          deletedMassProduction = _context5.sent;
          if (deletedMassProduction) {
            _context5.next = 6;
            break;
          }
          return _context5.abrupt("return", res.status(404).json({
            error: "MassProduction not found"
          }));
        case 6:
          res.json({
            message: "MassProduction deleted successfully"
          });
          _context5.next = 13;
          break;
        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](0);
          console.error("❌ Error deleting MassProduction:", _context5.t0);
          res.status(500).json({
            error: "Server error"
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