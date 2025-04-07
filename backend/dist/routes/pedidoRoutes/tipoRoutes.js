"use strict";

var express = require("express");
var _require = require("../../controllers/pedidoController/tipoController"),
  getAllTipos = _require.getAllTipos,
  getTipoById = _require.getTipoById,
  createTipo = _require.createTipo,
  updateTipo = _require.updateTipo,
  deleteTipo = _require.deleteTipo;
var router = express.Router();

// GET all tipos
router.get("/", getAllTipos);

// GET a single tipo by ID
router.get("/:id", getTipoById);

// POST a new tipo
router.post("/", createTipo);

// PUT (update) a tipo
router.put("/:id", updateTipo);

// DELETE a tipo
router["delete"]("/:id", deleteTipo);
module.exports = router;