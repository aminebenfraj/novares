const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { initSocket } = require("./utils/socket"); // Corrected path
const { initCronJobs } = require("./crone/callStatusCron");
require("dotenv").config();

// Routes
const ProductDesignationRoutes = require("./routes/productDesignationRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const massProductionRoutes = require("./routes/massProductionRoutes");
const adminRoutes = require("./routes/adminRoutes");
const feasibilityRoutes = require("./routes/feasibilityRoutes");
const feasibilityDetailRoutes = require("./routes/feasibilityDetailRoutes");
const checkinRoutes = require("./routes/checkinRoutes");
const okForLunchRoutes = require("./routes/okForLunchRoutes");
const validationForOfferRoutes = require("./routes/validationForOfferRoutes");
const kickOffRoutes = require("./routes/kick_offRoutes");
const taskRoutes = require("./routes/taskRoutes");
const designRoutes = require("./routes/designRoutes");
const categoryRoutes = require("./routes/gestionStockRoutes/categoryRoutes");
const locationRoutes = require("./routes/gestionStockRoutes/locationRoutes");
const machineRoutes = require("./routes/gestionStockRoutes/machineRoutes");
const supplierRoutes = require("./routes/gestionStockRoutes/supplierRoutes");
const materialRoutes = require("./routes/gestionStockRoutes/materialRoutes");
const facilitiesRoutes = require("./routes/facilitiesRoutes");
const p_p_tuningRoutes = require("./routes/p_p_tuningRoutes");
const qualificationConfirmationRoutes = require("./routes/qualificationConfirmationRoutes");
const processQualifRoutes = require("./routes/processQualifRoutes");
const pedidoRoutes = require("./routes/pedidoRoutes/pedidoRoutes");
const documentationRoutes = require("./routes/readinessRoutes/documentationRoutes");
const logisticsRoutes = require("./routes/readinessRoutes/logisticsRoutes");
const maintenanceRoutes = require("./routes/readinessRoutes/maintenanceRoutes");
const packagingRoutes = require("./routes/readinessRoutes/packagingRoutes");
const processStatusIndustrialsRoutes = require("./routes/readinessRoutes/processStatusIndustrialsRoutes");
const productProcessRoutes = require("./routes/readinessRoutes/productProcessRoutes");
const runAtRateProductionRoutes = require("./routes/readinessRoutes/runAtRateProductionRoutes");
const safetyRoutes = require("./routes/readinessRoutes/safetyRoutes");
const suppRoutes = require("./routes/readinessRoutes/suppRoutes");
const toolingStatusRoutes = require("./routes/readinessRoutes/toolingStatusRoutes");
const trainingRoutes = require("./routes/readinessRoutes/trainingRoutes");
const validationRoutes = require("./routes/readinessRoutes/validationRoutes");
const machineMaterialRoutes = require("./routes/gestionStockRoutes/machineMaterialRoutes");
const readinessRoutes = require("./routes/readinessRoutes/readinessRoutes");
const solicitanteRoutes = require("./routes/pedidoRoutes/solicitanteRoutes");
const tipoRoutes = require("./routes/pedidoRoutes/tipoRoutes");
const tableStatusRoutes = require("./routes/pedidoRoutes/tableStatusRoutes");
const pedidosRoutes = require("./routes/pedidoRoutes/pedidoRoutes");
const callRoutes = require("./routes/logistic/callRoutes");

const app = express();

// Create HTTP server
const server = http.createServer(app);

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json()); // Removed duplicate app.use(express.json())

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB connected");
})
.catch((error) => {
  console.error("MongoDB connection failed:", error);
});

// Handle Mongoose Deprecation Warning
mongoose.set("strictQuery", false);

// Routes
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
app.use("/api/categories", categoryRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/machines", machineRoutes);
app.use("/api/suppliers", supplierRoutes);
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

// Start Server and Initialize Socket.IO
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);

  // Initialize Socket.IO after server starts
  try {
    const { io, emitNewCall } = initSocket(server);
    app.set("emitNewCall", emitNewCall);
    console.log(`Socket.IO initialized on port ${PORT}`);
  } catch (error) {
    console.error("Failed to initialize Socket.IO:", {
      message: error.message,
      stack: error.stack,
    });
  }

  // Initialize Cron Jobs
  try {
    initCronJobs();
    console.log("Cron jobs initialized successfully");
  } catch (error) {
    console.error("Failed to initialize cron jobs:", {
      message: error.message,
      stack: error.stack,
    });
  }
});