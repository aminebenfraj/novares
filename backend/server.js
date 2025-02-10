const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()
const ProductDesignationRoutes = require('./routes/productDesignationRoutes');
const userRoutes = require('./routes/userRoutes');

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
  
app.get("/", (req, res) => {
  res.send("Welcome to the Project Novares API")
})
app.use("/api/pd", ProductDesignationRoutes);
app.use("/api/users", userRoutes); 

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`)
})

