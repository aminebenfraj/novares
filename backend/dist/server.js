"use strict";

var express = require("express");
var mongoose = require("mongoose");
var cors = require("cors");
require("dotenv").config();
var ProductDesignationRoutes = require('./routes/productDesignationRoutes');
var userRoutes = require('./routes/userRoutes');
var authRoutes = require("./routes/authRoutes"); // ✅ Add this line
var massProductionRoutes = require("./routes/massProductionRoutes"); // ✅ Add this line
var adminRoutes = require("./routes/adminRoutes");
var feasibilityRoutes = require('./routes/feasibilityRoutes');
var feasibilityDetailRoutes = require('./routes/feasibilityDetailRoutes');
var checkinRoutes = require('./routes/checkinRoutes');
var okForLunchRoutes = require('./routes/okForLunchRoutes');
var validationForOfferRoutes = require('./routes/validationForOfferRoutes');
var kickOffRoutes = require('./routes/kick_offRoutes');
var taskRoutes = require('./routes/taskRoutes');
var designRoutes = require('./routes/designRoutes');
var categoryRoutes = require('./routes/gestionStockRoutes/categoryRoutes');
var locationRoutes = require('./routes/gestionStockRoutes/locationRoutes');
var machineRoutes = require('./routes/gestionStockRoutes/machineRoutes');
var supplierRoutes = require('./routes/gestionStockRoutes/supplierRoutes');
var materialRoutes = require('./routes/gestionStockRoutes/materialRoutes');
var facilitiesRoutes = require('./routes/facilitiesRoutes');
var p_p_tuningRoutes = require("./routes/p_p_tuningRoutes");
var qualificationConfirmationRoutes = require("./routes/qualificationConfirmationRoutes");
var processQualifRoutes = require("./routes/processQualifRoutes");
var pedidoRoutes = require("./routes/pedidoRoutes/pedidoRoutes");
var documentationRoutes = require("./routes/readinessRoutes/documentationRoutes");
var logisticsRoutes = require("./routes/readinessRoutes/logisticsRoutes");
var maintenanceRoutes = require("./routes/readinessRoutes/maintenanceRoutes");
var packagingRoutes = require("./routes/readinessRoutes/packagingRoutes");
var processStatusIndustrialsRoutes = require("./routes/readinessRoutes/processStatusIndustrialsRoutes");
var productProcessRoutes = require("./routes/readinessRoutes/productProcessRoutes");
var runAtRateProductionRoutes = require("./routes/readinessRoutes/runAtRateProductionRoutes");
var safetyRoutes = require("./routes/readinessRoutes/safetyRoutes");
var suppRoutes = require("./routes/readinessRoutes/suppRoutes");
var toolingStatusRoutes = require("./routes/readinessRoutes/toolingStatusRoutes");
var trainingRoutes = require("./routes/readinessRoutes/trainingRoutes");
var validationRoutes = require("./routes/readinessRoutes/validationRoutes");
var machineMaterialRoutes = require("./routes/gestionStockRoutes/machineMaterialRoutes");
var readinessRoutes = require("./routes/readinessRoutes/readinessRoutes");
var solicitanteRoutes = require("./routes/pedidoRoutes/solicitanteRoutes");
var tipoRoutes = require("./routes/pedidoRoutes/tipoRoutes");
var tableStatusRoutes = require("./routes/pedidoRoutes/tableStatusRoutes");
var pedidosRoutes = require("./routes/pedidoRoutes/pedidoRoutes");
var callRoutes = require("./routes/logistic/callRoutes"); // ✅ Add this line
var _require = require("./crone/callStatusCron"),
  initCronJobs = _require.initCronJobs;
var app = express();
var PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(function () {
  console.log('MongoDB connected');
})["catch"](function (error) {
  console.error('MongoDB connection failed:', error);
});
initCronJobs();
app.use("/api/pd", ProductDesignationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/massproduction", massProductionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/feasibility", feasibilityRoutes);
app.use("/api/feasibility-detail", feasibilityDetailRoutes);
app.use("/api/checkins", checkinRoutes);
app.use("/api/okforlunch", okForLunchRoutes);
app.use("/api/validationForOffer", validationForOfferRoutes);
app.use("/api/kickoff", kickOffRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/design", designRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/machines', machineRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/facilities", facilitiesRoutes);
app.use("/api/p_p_tuning", p_p_tuningRoutes);
app.use("/api/qualification_confirmation", qualificationConfirmationRoutes);
app.use("/api/process_qualif", processQualifRoutes);
app.use("/api/pedidos", pedidoRoutes);
app.use("/api/allocate", machineMaterialRoutes);
app.use("/api/Documentation", documentationRoutes);
app.use("/api/Logistics", logisticsRoutes);
app.use("/api/Maintenance", maintenanceRoutes);
app.use("/api/Packaging", packagingRoutes);
app.use("/api/ProcessStatusIndustrials", processStatusIndustrialsRoutes);
app.use("/api/ProductProcesses", productProcessRoutes);
app.use("/api/RunAtRateProduction", runAtRateProductionRoutes);
app.use("/api/Safety", safetyRoutes);
app.use("/api/Supp", suppRoutes);
app.use("/api/ToolingStatus", toolingStatusRoutes);
app.use("/api/Training", trainingRoutes);
app.use("/api/Validation", validationRoutes);
app.use("/api/Readiness", readinessRoutes);
app.use("/api/solicitantes", solicitanteRoutes);
app.use("/api/tipos", tipoRoutes);
app.use("/api/tableStatus", tableStatusRoutes);
app.use("/api/pedido", pedidosRoutes);
app.use("/api/call", callRoutes);
app.listen(PORT, function () {
  console.log("Server is running on port: ".concat(PORT));
});