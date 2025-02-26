
const Material = require("../../models/gestionStockModels/MaterialModel");
const Supplier = require("../../models/gestionStockModels/SupplierModel");
const Machine = require("../../models/gestionStockModels/MachineModel");
const Location = require("../../models/gestionStockModels/LocationModel");
const Category = require("../../models/gestionStockModels/CategoryModel");

// Create Material with existence checks
exports.createMaterial = async (req, res) => {
  try {
    const {
      supplier,
      manufacturer,
      reference,
      description,
      minimumStock,
      currentStock,
      orderLot,
      location,
      critical,
      consumable,
      machines,
      comment,
      photo,
      price,
      category
    } = req.body;

    // Check if Supplier exists
    const existingSupplier = await Supplier.findById(supplier);
    if (!existingSupplier) {
      return res.status(400).json({ error: "Supplier not found" });
    }

    // Check if Location exists
    const existingLocation = await Location.findById(location);
    if (!existingLocation) {
      return res.status(400).json({ error: "Location not found" });
    }

    // Check if Category exists
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(400).json({ error: "Category not found" });
    }

    // Check if Machines exist
    if (machines && machines.length > 0) {
      const foundMachines = await Machine.find({ _id: { $in: machines } });
      if (foundMachines.length !== machines.length) {
        return res.status(400).json({ error: "One or more machines not found" });
      }
    }

    // Create new Material
    const newMaterial = new Material({
      supplier,
      manufacturer,
      reference,
      description,
      minimumStock,
      currentStock,
      orderLot,
      location,
      critical,
      consumable,
      machines,
      comment,
      photo,
      price,
      category
    });

    await newMaterial.save();
    res.status(201).json(newMaterial);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create material" });
  }
};


// Get all materials with populated references
exports.getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.find()
      .populate("supplier")
      .populate("location")
      .populate("machines")
      .populate("category");
    res.status(200).json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single material by ID
exports.getMaterialById = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id)
      .populate("supplier")
      .populate("location")
      .populate("machines")
      .populate("category");
console.log(material);

    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    res.status(200).json(material);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a material
exports.updateMaterial = async (req, res) => {
  try {
    const material = await Material.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    res.status(200).json(material);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a material
exports.deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findByIdAndDelete(req.params.id);
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }
    res.status(200).json({ message: "Material deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
