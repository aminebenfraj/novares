const QualificationConfirmation = require("../models/qualification_confirmationModel")
const Task = require("../models/Task")
const User = require("../models/UserModel")
const { sendTaskAssignmentEmail } = require("../utils/emailServicetask")
const mongoose = require("mongoose")

const qualificationConfirmationFields = [
  "using_up_old_stock",
  "using_up_safety_stocks",
  "updating_version_number_mould",
  "updating_version_number_product_label",
  "management_of_manufacturing_programmes",
  "specific_spotting_of_packaging_with_label",
  "management_of_galia_identification_labels",
  "preservation_measure",
  "product_traceability_label_modification",
  "information_to_production",
  "information_to_customer_logistics",
  "information_to_customer_quality",
  "updating_customer_programme_data_sheet",
]

exports.createQualificationConfirmation = async (req, res) => {
  try {
    console.log("📢 Received QualificationConfirmation Data:", JSON.stringify(req.body, null, 2))

    const qualificationConfirmationData = req.body
    if (!qualificationConfirmationData) {
      throw new Error("QualificationConfirmation data is missing!")
    }

    console.log("✅ Step 1: Creating tasks...")
    const taskPromises = qualificationConfirmationFields.map(async (field) => {
      if (qualificationConfirmationData[field]?.task) {
        console.log(`📢 Creating task for ${field}`)
        const newTask = new Task(qualificationConfirmationData[field].task)
        await newTask.save()
        return newTask._id
      }
      return null
    })

    const createdTaskIds = await Promise.all(taskPromises)
    console.log("✅ Task creation completed:", createdTaskIds)

    console.log("✅ Step 2: Formatting QualificationConfirmation Data...")
    const formattedQualificationConfirmationData = qualificationConfirmationFields.reduce((acc, field, index) => {
      acc[field] = {
        value: qualificationConfirmationData[field]?.value ?? false,
        task: createdTaskIds[index] || null,
      }
      return acc
    }, {})

    console.log("✅ Step 3: Saving QualificationConfirmation...", formattedQualificationConfirmationData)
    const newQualificationConfirmation = new QualificationConfirmation(formattedQualificationConfirmationData)
    await newQualificationConfirmation.save()

    console.log("✅ QualificationConfirmation created successfully:", newQualificationConfirmation)
    res
      .status(201)
      .json({ message: "QualificationConfirmation created successfully", data: newQualificationConfirmation })
  } catch (error) {
    console.error("❌ Error creating QualificationConfirmation:", error)
    res.status(500).json({ message: "Internal Server Error", error: error.message })
  }
}

exports.getAllQualificationConfirmations = async (req, res) => {
  try {
    console.log("📢 Fetching all QualificationConfirmations...")

    const qualificationConfirmations = await QualificationConfirmation.find().populate(
      qualificationConfirmationFields.map((field) => ({ path: `${field}.task`, model: "Task" })),
    )

    if (!qualificationConfirmations || qualificationConfirmations.length === 0) {
      return res.status(404).json({ message: "No QualificationConfirmations found." })
    }

    console.log("✅ QualificationConfirmations fetched successfully:", qualificationConfirmations)
    res.status(200).json(qualificationConfirmations)
  } catch (error) {
    console.error("❌ Error fetching QualificationConfirmations:", error.message)
    res.status(500).json({ message: "Error fetching QualificationConfirmations", error: error.message })
  }
}

exports.getQualificationConfirmationById = async (req, res) => {
  try {
    const { id } = req.params

    console.log("📢 Fetching QualificationConfirmation for ID:", id)

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid QualificationConfirmation ID format." })
    }

    const qualificationConfirmation = await QualificationConfirmation.findById(id)
      .populate({
        path: qualificationConfirmationFields.map((field) => `${field}.task`).join(" "),
        model: "Task",
      })
      .lean()

    if (!qualificationConfirmation) {
      return res.status(404).json({ message: "QualificationConfirmation not found." })
    }

    res.status(200).json(qualificationConfirmation)
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message })
  }
}

exports.updateQualificationConfirmation = async (req, res) => {
  try {
    const qualificationConfirmationData = req.body
    const qualificationConfirmationId = req.params.id

    const existingQualificationConfirmation = await QualificationConfirmation.findById(
      qualificationConfirmationId,
    ).populate({
      path: qualificationConfirmationFields.map((field) => `${field}.task`).join(" "),
      model: "Task",
    })

    if (!existingQualificationConfirmation) {
      return res.status(404).json({ message: "QualificationConfirmation not found" })
    }

    // Store the previous state to compare assigned users for email notifications
    const previousAssignedUsers = {}
    qualificationConfirmationFields.forEach((field) => {
      if (existingQualificationConfirmation[field]?.task?.assignedUsers) {
        previousAssignedUsers[field] = [...existingQualificationConfirmation[field].task.assignedUsers]
      } else {
        previousAssignedUsers[field] = []
      }
    })

    // Step 1: Update QualificationConfirmation fields dynamically
    qualificationConfirmationFields.forEach((field) => {
      existingQualificationConfirmation[field].value = qualificationConfirmationData[field]?.value ?? false
    })

    await existingQualificationConfirmation.save()

    // Step 2: Update Tasks dynamically
    await Promise.all(
      qualificationConfirmationFields.map(async (field) => {
        if (qualificationConfirmationData[field]?.task) {
          if (existingQualificationConfirmation[field].task) {
            await Task.findByIdAndUpdate(
              existingQualificationConfirmation[field].task,
              qualificationConfirmationData[field].task,
              {
                new: true,
              },
            )
          } else {
            const newTask = await Task.create(qualificationConfirmationData[field].task)
            existingQualificationConfirmation[field].task = newTask._id
            await existingQualificationConfirmation.save()
          }
        }
      }),
    )

    // Step 3: Process email notifications for newly assigned users
    await processEmailNotifications(qualificationConfirmationData, previousAssignedUsers, "Qualification Confirmation")

    res
      .status(200)
      .json({ message: "QualificationConfirmation and Tasks updated", data: existingQualificationConfirmation })
  } catch (error) {
    res.status(500).json({ message: "Error updating QualificationConfirmation", error: error.message })
  }
}

// Helper function to process email notifications
async function processEmailNotifications(qualificationConfirmationData, previousAssignedUsers, sectionName) {
  try {
    // Field config for better email content
    const fieldConfig = {}
    qualificationConfirmationFields.forEach((field) => {
      fieldConfig[field] = {
        label: field
          .replace(/([A-Z])/g, " $1")
          .replace(/_/g, " ")
          .trim(),
        description: `Configuration for ${field
          .replace(/([A-Z])/g, " $1")
          .replace(/_/g, " ")
          .trim()
          .toLowerCase()}`,
      }
    })

    // Process each field to find newly assigned users
    for (const field of qualificationConfirmationFields) {
      const currentAssignedUsers = qualificationConfirmationData[field]?.task?.assignedUsers || []
      const previousUsers = previousAssignedUsers[field] || []

      // Find newly assigned users (users in current but not in previous)
      const newlyAssignedUsers = currentAssignedUsers.filter((userId) => !previousUsers.includes(userId))

      if (newlyAssignedUsers.length > 0) {
        console.log(`📧 Found ${newlyAssignedUsers.length} newly assigned users for field: ${field}`)

        // Get user details for each newly assigned user
        for (const userId of newlyAssignedUsers) {
          try {
            const user = await User.findById(userId)

            if (user && user.email) {
              // Send email notification
              await sendTaskAssignmentEmail({
                to: user.email,
                username: user.username || user.name || "Team Member",
                taskName: fieldConfig[field]?.label || field,
                taskDescription: fieldConfig[field]?.description || "Task assignment for qualification confirmation",
                sectionName: sectionName,
                sectionUrl: "/qualification-confirmation",
                specificInstruction: `you should login and check the ${sectionName} section ${fieldConfig[field]?.label} tab`,
              })

              console.log(`✅ Email sent to ${user.email} for task: ${field}`)
            } else {
              console.log(`⚠️ User not found or no email for userId: ${userId}`)
            }
          } catch (emailError) {
            console.error(`❌ Error sending email for user ${userId}:`, emailError)
          }
        }
      }
    }

    return true
  } catch (error) {
    console.error("❌ Error processing email notifications:", error)
    return false
  }
}

exports.deleteQualificationConfirmation = async (req, res) => {
  console.log(req.params.id)
  try {
    const qualificationConfirmation = await QualificationConfirmation.findById(req.params.id)
    if (!qualificationConfirmation) {
      return res.status(404).json({ message: "QualificationConfirmation not found" })
    }

    // Step 1: Delete the associated tasks
    const taskIds = qualificationConfirmationFields
      .map((field) => qualificationConfirmation[field]?.task?._id)
      .filter(Boolean)
    await Task.deleteMany({ _id: { $in: taskIds } })

    // Step 2: Delete the QualificationConfirmation record itself
    await QualificationConfirmation.findByIdAndDelete(req.params.id)

    res.status(200).json({ message: "QualificationConfirmation and associated tasks deleted" })
  } catch (error) {
    res.status(500).json({ message: "Error deleting QualificationConfirmation", error: error.message })
  }
}
