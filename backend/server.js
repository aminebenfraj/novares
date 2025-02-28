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








app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`)
})

