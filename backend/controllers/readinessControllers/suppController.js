const Supp = require("../../models/readiness/SuppModel")
const Validation = require("../../models/readiness/ValidationModel")

const suppFields = [
  "componentsRawMaterialAvailable",
  "packagingDefined",
  "partsAccepted",
  "purchasingRedFilesTransferred",
  "automaticProcurementEnabled",
]

exports.createSupp = async (req, res) => {
  try {
    console.log("📢 Received Supp Data:", JSON.stringify(req.body, null, 2))

    const suppData = req.body

    // ✅ Step 1: Create validations separately and store their _ids
    const validationPromises = suppFields.map(async (field) => {
      if (suppData[field]?.details) {
        // Convert boolean ok_nok to string if needed
        const details = { ...suppData[field].details }

        // Handle ok_nok conversion from boolean to string
        if (typeof details.ok_nok === "boolean") {
          details.ok_nok = details.ok_nok === true ? "OK" : "NOK"
        }

        // Ensure all fields have default values if missing
        const validationData = {
          tko: details.tko || false,
          ot: details.ot || false,
          ot_op: details.ot_op || false,
          is: details.is || false,
          sop: details.sop || false,
          ok_nok: details.ok_nok || "",
          who: details.who || "",
          when: details.when || "",
          validation_check: details.validation_check || false,
          comment: details.comment || "",
        }

        const newValidation = new Validation(validationData)
        await newValidation.save()
        return newValidation._id // Return the validation _id
      }
      return null
    })

    const createdValidationIds = await Promise.all(validationPromises)

    // ✅ Step 2: Build the Supp object with validation _ids
    const formattedSuppData = suppFields.reduce((acc, field, index) => {
      acc[field] = {
        value: suppData[field]?.value ?? false,
        details: createdValidationIds[index] || null, // Store only the ObjectId
      }
      return acc
    }, {})

    // ✅ Step 3: Save the Supp entry
    const newSupp = new Supp(formattedSuppData)
    await newSupp.save()

    console.log("✅ Supp created successfully:", newSupp)

    res.status(201).json({
      message: "Supp created successfully",
      data: newSupp,
    })
  } catch (error) {
    console.error("❌ Error creating Supp:", error.message)
    res.status(500).json({ message: "Internal Server Error", error: error.message })
  }
}

// Get all supps with validations
exports.getAllSupps = async (req, res) => {
  try {
    console.log("📢 Fetching all Supps...")

    const supps = await Supp.find().populate({
      path: suppFields.map((field) => `${field}.details`).join(" "),
      model: "Validation",
    })

    console.log("✅ Supps fetched successfully:", supps)

    res.status(200).json(supps)
  } catch (error) {
    console.error("❌ Error fetching Supps:", error.message)
    res.status(500).json({ message: "Error fetching Supps", error: error.message })
  }
}

// Get a single supp by ID with validations
const mongoose = require("mongoose")

exports.getSuppById = async (req, res) => {
  try {
    const { id } = req.params

    console.log("📢 Fetching Supp for ID:", id)

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Supp ID format." })
    }

    const supp = await Supp.findById(id)
      .populate({
        path: suppFields.map((field) => `${field}.details`).join(" "),
        model: "Validation",
      })
      .lean()

    if (!supp) {
      return res.status(404).json({ message: "Supp not found." })
    }

    res.status(200).json(supp)
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message })
  }
}

// Update Supp and Validations
exports.updateSupp = async (req, res) => {
  try {
    const suppData = req.body
    const suppId = req.params.id

    const existingSupp = await Supp.findById(suppId)
    if (!existingSupp) {
      return res.status(404).json({ message: "Supp not found" })
    }

    // Step 1: Update supp fields dynamically
    suppFields.forEach((field) => {
      existingSupp[field].value = suppData[field]?.value ?? false
    })

    await existingSupp.save()

    // Step 2: Update Validations dynamically
    await Promise.all(
      suppFields.map(async (field) => {
        if (suppData[field]?.details) {
          // Convert boolean ok_nok to string if needed
          const details = { ...suppData[field].details }

          // Handle ok_nok conversion from boolean to string
          if (typeof details.ok_nok === "boolean") {
            details.ok_nok = details.ok_nok === true ? "OK" : "NOK"
          }

          // Ensure all fields have default values if missing
          const validationData = {
            tko: details.tko || false,
            ot: details.ot || false,
            ot_op: details.ot_op || false,
            is: details.is || false,
            sop: details.sop || false,
            ok_nok: details.ok_nok || "",
            who: details.who || "",
            when: details.when || "",
            validation_check: details.validation_check || false,
            comment: details.comment || "",
          }

          if (existingSupp[field].details) {
            await Validation.findByIdAndUpdate(existingSupp[field].details, validationData, {
              new: true,
            })
          } else {
            const newValidation = await Validation.create(validationData)
            existingSupp[field].details = newValidation._id
            await existingSupp.save()
          }
        }
      }),
    )

    res.status(200).json({ message: "Supp and Validations updated", data: existingSupp })
  } catch (error) {
    res.status(500).json({ message: "Error updating Supp", error: error.message })
  }
}

// Delete Supp and Associated Validations
exports.deleteSupp = async (req, res) => {
  try {
    const supp = await Supp.findById(req.params.id)
    if (!supp) {
      return res.status(404).json({ message: "Supp not found" })
    }

    // Step 1: Delete the associated validations
    const validationIds = suppFields.map((field) => supp[field]?.details).filter(Boolean)
    await Validation.deleteMany({ _id: { $in: validationIds } })

    // Step 2: Delete the Supp record itself
    await Supp.findByIdAndDelete(req.params.id)

    res.status(200).json({ message: "Supp and associated validations deleted" })
  } catch (error) {
    res.status(500).json({ message: "Error deleting Supp", error: error.message })
  }
}

