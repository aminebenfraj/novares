const ProductDesignation = require("../models/ProductDesignationModel")

// 🔹 Create a new Product Designation
exports.createProduct = async (req, res) => {
  try {
    const { part_name, reference } = req.body

    const newProduct = new ProductDesignation({ part_name, reference })
    await newProduct.save()

    res.status(201).json({
      message: "Product Designation Created",
      data: {
        id: newProduct._id,
        part_name: newProduct.part_name,
        reference: newProduct.reference,
        createdAt: newProduct.createdAt,
        updatedAt: newProduct.updatedAt,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Error creating product designation", error: error.message })
  }
}

// 🔹 Get all Product Designations
exports.getAllProducts = async (req, res) => {
  try {
    const products = await ProductDesignation.find()
    // Transform MongoDB _id to id for frontend consistency
    const transformedProducts = products.map((product) => ({
      id: product._id,
      part_name: product.part_name,
      reference: product.reference,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }))
    res.status(200).json(transformedProducts)
  } catch (error) {
    res.status(500).json({ message: "Error fetching product designations", error: error.message })
  }
}

// 🔹 Get a single Product Designation by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await ProductDesignation.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: "Product Designation not found" })
    }
    // Transform MongoDB _id to id for frontend consistency
    res.status(200).json({
      id: product._id,
      part_name: product.part_name,
      reference: product.reference,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    })
  } catch (error) {
    res.status(500).json({ message: "Error fetching product designation", error: error.message })
  }
}

// 🔹 Update a Product Designation
exports.updateProduct = async (req, res) => {
  try {
    const { part_name, reference } = req.body
    const updatedProduct = await ProductDesignation.findByIdAndUpdate(
      req.params.id,
      { part_name, reference },
      { new: true, runValidators: true },
    )

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product Designation not found" })
    }

    // Transform MongoDB _id to id for frontend consistency
    res.status(200).json({
      message: "Product Designation Updated",
      data: {
        id: updatedProduct._id,
        part_name: updatedProduct.part_name,
        reference: updatedProduct.reference,
        createdAt: updatedProduct.createdAt,
        updatedAt: updatedProduct.updatedAt,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Error updating product designation", error: error.message })
  }
}

// 🔹 Delete a Product Designation
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await ProductDesignation.findByIdAndDelete(req.params.id)

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product Designation not found" })
    }

    res.status(200).json({ message: "Product Designation Deleted" })
  } catch (error) {
    res.status(500).json({ message: "Error deleting product designation", error: error.message })
  }
}
