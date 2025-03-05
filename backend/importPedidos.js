const mongoose = require('mongoose');
const xlsx = require('xlsx');
const dotenv = require('dotenv');
const path = require('path');
const moment = require('moment');
const Pedido = require('./models/Pedido'); // Adjust path if needed

dotenv.config(); // Load environment variables from .env

// Ensure MongoDB URI is set
if (!process.env.MONGODB_URI) {
  console.error("❌ Missing MONGODB_URI in .env file.");
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Load Excel file
const filePath = path.join(__dirname, "Gestion pedidos.xlsx");
const workbook = xlsx.readFile(filePath);
const sheetName = "Pedidos"; // Ensure this matches the sheet name exactly

if (!workbook.Sheets[sheetName]) {
  console.error(`❌ Sheet '${sheetName}' not found in the Excel file.`);
  process.exit(1);
}

const sheet = workbook.Sheets[sheetName];
const jsonData = xlsx.utils.sheet_to_json(sheet);

if (jsonData.length === 0) {
  console.error("❌ The sheet is empty or data couldn't be read.");
  process.exit(1);
}

// Helper function to safely parse numbers (allow empty string for invalid values)
const parseNumber = (value) => {
  if (typeof value === "string") {
    value = value.replace(",", ".").trim(); // Handle European decimal format
  }
  const num = Number(value);
  return isNaN(num) ? "" : num;
};

// Helper function to safely parse dates (allow empty string for invalid values)
const parseDate = (value) => {
  if (!value || value === "") return "";
  const date = moment(value, ["DD/MM/YYYY", "YYYY-MM-DD"], true);
  return date.isValid() ? date.toISOString() : "";
};

// Helper function to safely parse booleans (convert ' si' to true, else false)
const parseBoolean = (value) => {
  return typeof value === "string" && value.trim().toLowerCase() === "si";
};

// Transform data
const transformedData = jsonData.map(row => ({
  tipo: row["Unnamed: 0"] || "",
  descripcionInterna: row["DESCRIPCION INTERNA // MOTIVO DE COMPRA"] || "",
  fabricante: row["FABRICANTE"] || "",
  referencia: row["REFERENCIA"] || "",
  descripcionProveedor: row["DESCRIPCION PROVEEDOR"] || "",
  solicitante: row["SOLICITANTE"] || "",
  cantidad: parseNumber(row["CANTIDAD"]),
  precioUnidad: parseNumber(row["PRECIO\nUNIDAD"]),
  importePedido: parseNumber(row["IMPORTE PEDIDO"]),
  fechaSolicitud: parseDate(row["FECHA SOLICITUD"]),
  proveedor: row["PROVEEDOR"] || "",
  comentario: row["COMENTARIO"] || "",
  pedir: row["PEDIR"] || "",
  introducidaSAP: parseDate(row["INTRODUCIDA SAP"]),
  aceptado: parseDate(row["ACEPTADO"]),
  direccion: row["DIRECCION"] || "",
  recepcionPrevista: parseDate(row["RECEPCION PREVISTA"]),
  recepcionado: parseBoolean(row["RECEPCIONADO"]),
  ano: parseNumber(row["AÑO"])
}));

// Log transformed data to verify
console.log("🔍 Transformed Data Sample:", transformedData.slice(0, 5)); // Show first 5 records

if (transformedData.length === 0) {
  console.error("❌ No valid data found to insert.");
  mongoose.connection.close();
  process.exit(1);
}

// Insert into MongoDB
Pedido.insertMany(transformedData)
  .then(() => {
    console.log(`✅ Successfully inserted ${transformedData.length} records into MongoDB.`);
    mongoose.connection.close();
  })
  .catch(err => {
    console.error("❌ Error inserting data:", err);
    mongoose.connection.close();
  });
