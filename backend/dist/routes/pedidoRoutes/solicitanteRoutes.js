"use strict";

var express = require("express");
var router = express.Router();
var _require = require("../../controllers/pedidoController/solicitanteController"),
  getAllSolicitantes = _require.getAllSolicitantes,
  getSolicitanteById = _require.getSolicitanteById,
  createSolicitante = _require.createSolicitante,
  updateSolicitante = _require.updateSolicitante,
  deleteSolicitante = _require.deleteSolicitante;

// GET all solicitantes
router.get("/", getAllSolicitantes);

// GET a single solicitante by ID
router.get("/:id", getSolicitanteById);

// POST a new solicitante
router.post("/", createSolicitante);

// PUT (update) a solicitante
router.put("/:id", updateSolicitante);

// DELETE a solicitante
router["delete"]("/:id", deleteSolicitante);
module.exports = router;