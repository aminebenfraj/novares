const ProductDesignation = require("../models/ProductDesignationModel");

// 🔹 Create a new Product Designation
exports.createProduct = async (req, res) => {
  try {
    const { id, part_name, reference } = req.body;

    // Check if product with same ID exists
    const existingProduct = await ProductDesignation.findOne({ id });
    if (existingProduct) {
      return res.status(400).json({ message: "Product with this ID already exists" });
    }

    const newProduct = new ProductDesignation({ id, part_name, reference });
    await newProduct.save();
    
    res.status(201).json({ message: "Product Designation Created", data: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Error creating product designation", error: error.message });
  }
};

// 🔹 Get all Product Designations
exports.getAllProducts = async (req, res) => {
  try {
    const products = await ProductDesignation.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product designations", error: error.message });
  }
};

// 🔹 Get a single Product Designation by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await ProductDesignation.findOne({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: "Product Designation not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product designation", error: error.message });
  }
};

// 🔹 Update a Product Designation
exports.updateProduct = async (req, res) => {
  try {
    const { part_name, reference } = req.body;
    const updatedProduct = await ProductDesignation.findOneAndUpdate(
      { id: req.params.id },
      { part_name, reference },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product Designation not found" });
    }

    res.status(200).json({ message: "Product Designation Updated", data: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Error updating product designation", error: error.message });
  }
};

// 🔹 Delete a Product Designation
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await ProductDesignation.findOneAndDelete({ id: req.params.id });

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product Designation not found" });
    }

    res.status(200).json({ message: "Product Designation Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product designation", error: error.message });
  }
};
