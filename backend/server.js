const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()
const ProductDesignationRoutes = require('./routes/productDesignationRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require("./routes/authRoutes"); // ✅ Add this line
const massProductionRoutes = require("./routes/massProductionRoutes"); // ✅ Add this line
const adminRoutes = require("./routes/adminRoutes");
const feasibilityRoutes = require('./routes/feasibilityRoutes');
const feasibilityDetailRoutes = require('./routes/feasibilityDetailRoutes');
const checkinRoutes = require('./routes/checkinRoutes');
const okForLunchRoutes = require('./routes/okForLunchRoutes');
const validationForOfferRoutes = require('./routes/validationForOfferRoutes');
const kickOffRoutes = require('./routes/kick_offRoutes');
const taskRoutes = require('./routes/taskRoutes');
const designRoutes = require('./routes/designRoutes');
const categoryRoutes = require('./routes/gestionStockRoutes/categoryRoutes');
const locationRoutes = require('./routes/gestionStockRoutes/locationRoutes');
const machineRoutes = require('./routes/gestionStockRoutes/machineRoutes');
const supplierRoutes = require('./routes/gestionStockRoutes/supplierRoutes');
const materialRoutes = require('./routes/gestionStockRoutes/materialRoutes');
const facilitiesRoutes = require('./routes/facilitiesRoutes');
const p_p_tuningRoutes = require("./routes/p_p_tuningRoutes");
const qualificationConfirmationRoutes = require("./routes/qualificationConfirmationRoutes");
const processQualifRoutes = require("./routes/processQualifRoutes");
const pedidoRoutes = require("./routes/pedidoRoutes");
const documentationRoutes = require("./routes/readinessRoutes/DocumentationRoutes");
const logisticsRoutes = require("./routes/readinessRoutes/LogisticsRoutes");
const maintenanceRoutes = require("./routes/readinessRoutes/maintenanceRoutes");
const packagingRoutes = require("./routes/readinessRoutes/packagingRoutes");
const processStatusIndustrialsRoutes = require("./routes/readinessRoutes/processStatusIndustrialsRoutes");
const productProcessRoutes = require("./routes/readinessRoutes/productProcessRoutes");
const runAtRateProductionRoutes = require("./routes/readinessRoutes/runAtRateProductionRoutes");
const safetyRoutes = require("./routes/readinessRoutes/safetyRoutes");
const suppliersRoutes = require("./routes/readinessRoutes/suppliersRoutes");
const toolingStatusRoutes = require("./routes/readinessRoutes/toolingStatusRoutes");
const trainingRoutes = require("./routes/readinessRoutes/trainingRoutes");
const validationRoutes = require("./routes/readinessRoutes/validationRoutes");
const machineMaterialRoutes = require("./routes/gestionStockRoutes/machineMaterialRoutes");


const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('MongoDB connected');
  }).catch((error) => {
    console.error('MongoDB connection failed:', error);
  });
  
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
app.use("/api/Documentation",documentationRoutes );
app.use("/api/Logistics", logisticsRoutes);
app.use("/api/Maintenance", maintenanceRoutes);
app.use("/api/Packaging", packagingRoutes);
app.use("/api/ProcessStatusIndustrials", processStatusIndustrialsRoutes);
app.use("/api/ProductProcesses", productProcessRoutes);
app.use("/api/RunAtRateProduction", runAtRateProductionRoutes);
app.use("/api/Safety", safetyRoutes);
app.use("/api/Suppliers", suppliersRoutes);
app.use("/api/ToolingStatus", toolingStatusRoutes);
app.use("/api/Training", trainingRoutes);
app.use("/api/Validation", validationRoutes);









app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`)
})

