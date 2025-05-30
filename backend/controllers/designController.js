const Design = require("../models/DesignModel")
const Task = require("../models/Task")
const User = require("../models/UserModel")
const { sendTaskAssignmentEmail } = require("../utils/emailServicetask")
const mongoose = require("mongoose")

const designFields = [
  "Validation_of_the_validation",
  "Modification_of_bought_product",
  "Modification_of_tolerance",
  "Modification_of_checking_fixtures",
  "Modification_of_Product_FMEA",
  "Modification_of_part_list_form",
  "Modification_of_control_plan",
  "Modification_of_Process_FMEA",
  "Modification_of_production_facilities",
  "Modification_of_tools",
  "Modification_of_packaging",
  "Modification_of_information_system",
  "Updating_of_drawings",
]

exports.createDesign = async (req, res) => {
  try {
    console.log("📢 Received Design Data:", JSON.stringify(req.body, null, 2))

    const designData = req.body

    // ✅ Step 1: Create tasks separately and store their _ids
    const taskPromises = designFields.map(async (field) => {
      if (designData[field]?.task) {
        const newTask = new Task(designData[field].task)
        await newTask.save()
        return newTask._id // Return the task _id
      }
      return null
    })

    const createdTaskIds = await Promise.all(taskPromises)

    // ✅ Step 2: Build the Design object with task _ids
    const formattedDesignData = designFields.reduce((acc, field, index) => {
      acc[field] = {
        value: designData[field]?.value ?? false,
        task: createdTaskIds[index] || null, // Store only the ObjectId
      }
      return acc
    }, {})

    // ✅ Step 3: Save the Design entry
    const newDesign = new Design(formattedDesignData)
    await newDesign.save()

    console.log("✅ Design created successfully:", newDesign)

    res.status(201).json({
      message: "Design created successfully",
      data: newDesign,
    })
  } catch (error) {
    console.error("❌ Error creating Design:", error.message)
    res.status(500).json({ message: "Internal Server Error", error: error.message })
  }
}

exports.getAllDesigns = async (req, res) => {
  try {
    console.log("📢 Fetching all Designs...")

    const designs = await Design.find().populate({
      path: designFields.map((field) => `${field}.task`).join(" "),
      model: "Task",
    })

    console.log("✅ Designs fetched successfully:", designs)

    res.status(200).json(designs)
  } catch (error) {
    console.error("❌ Error fetching Designs:", error.message)
    res.status(500).json({ message: "Error fetching Designs", error: error.message })
  }
}

exports.getDesignById = async (req, res) => {
  try {
    const { id } = req.params

    console.log("📢 Fetching Design for ID:", id)

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Design ID format." })
    }

    const design = await Design.findById(id)
      .populate({
        path: designFields.map((field) => `${field}.task`).join(" "),
        model: "Task",
      })
      .lean()

    if (!design) {
      return res.status(404).json({ message: "Design not found." })
    }

    res.status(200).json(design)
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message })
  }
}

exports.updateDesign = async (req, res) => {
  try {
    const designData = req.body
    const designId = req.params.id

    const existingDesign = await Design.findById(designId).populate({
      path: designFields.map((field) => `${field}.task`).join(" "),
      model: "Task",
    })

    if (!existingDesign) {
      return res.status(404).json({ message: "Design not found" })
    }

    // Store the previous state to compare assigned users for email notifications
    const previousAssignedUsers = {}
    designFields.forEach((field) => {
      if (existingDesign[field]?.task?.assignedUsers) {
        previousAssignedUsers[field] = [...existingDesign[field].task.assignedUsers]
      } else {
        previousAssignedUsers[field] = []
      }
    })

    // Step 1: Update design fields dynamically
    designFields.forEach((field) => {
      existingDesign[field].value = designData[field]?.value ?? false
    })

    await existingDesign.save()

    // Step 2: Update Tasks dynamically
    await Promise.all(
      designFields.map(async (field) => {
        if (designData[field]?.task) {
          if (existingDesign[field].task) {
            await Task.findByIdAndUpdate(existingDesign[field].task, designData[field].task, {
              new: true,
            })
          } else {
            const newTask = await Task.create(designData[field].task)
            existingDesign[field].task = newTask._id
            await existingDesign.save()
          }
        }
      }),
    )

    // Step 3: Process email notifications for newly assigned users
    await processEmailNotifications(designData, previousAssignedUsers, "Design")

    res.status(200).json({ message: "Design and Tasks updated", data: existingDesign })
  } catch (error) {
    res.status(500).json({ message: "Error updating Design", error: error.message })
  }
}

// Helper function to process email notifications
async function processEmailNotifications(designData, previousAssignedUsers, sectionName) {
  try {
    // Field config for better email content
    const fieldConfig = {}
    designFields.forEach((field) => {
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
    for (const field of designFields) {
      const currentAssignedUsers = designData[field]?.task?.assignedUsers || []
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
                taskDescription: fieldConfig[field]?.description || "Task assignment for design process",
                sectionName: sectionName,
                sectionUrl: "/design",
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

exports.deleteDesign = async (req, res) => {
  console.log(req.params.id)
  try {
    const design = await Design.findById(req.params.id)
    if (!design) {
      return res.status(404).json({ message: "Design not found" })
    }

    // Step 1: Delete the associated tasks
    const taskIds = designFields.map((field) => design[field]?.task._id).filter(Boolean)
    await Task.deleteMany({ _id: { $in: taskIds } })

    // Step 2: Delete the Design record itself
    await Design.findByIdAndDelete(req.params.id)

    res.status(200).json({ message: "Design and associated tasks deleted" })
  } catch (error) {
    res.status(500).json({ message: "Error deleting Design", error: error.message })
  }
}
