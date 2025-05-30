const ProcessQualif = require("../models/process_qualifModel")
const Task = require("../models/Task")
const User = require("../models/UserModel")
const { sendTaskAssignmentEmail } = require("../utils/emailServicetask")
const mongoose = require("mongoose")

const processQualifFields = [
  "updating_of_capms",
  "modification_of_customer_logistics",
  "qualification_of_supplier",
  "presentation_of_initial_samples",
  "filing_of_initial_samples",
  "information_on_modification_implementation",
  "full_production_run",
  "request_for_dispensation",
  "process_qualification",
  "initial_sample_acceptance",
]

exports.createProcessQualif = async (req, res) => {
  try {
    console.log("📢 Received ProcessQualif Data:", JSON.stringify(req.body, null, 2))

    const processQualifData = req.body
    if (!processQualifData) {
      throw new Error("ProcessQualif data is missing!")
    }

    console.log("✅ Step 1: Creating tasks...")
    const taskPromises = processQualifFields.map(async (field) => {
      if (processQualifData[field]?.task) {
        console.log(`📢 Creating task for ${field}`)
        const newTask = new Task(processQualifData[field].task)
        await newTask.save()
        return newTask._id
      }
      return null
    })

    const createdTaskIds = await Promise.all(taskPromises)
    console.log("✅ Task creation completed:", createdTaskIds)

    console.log("✅ Step 2: Formatting ProcessQualif Data...")
    const formattedProcessQualifData = processQualifFields.reduce((acc, field, index) => {
      acc[field] = {
        value: processQualifData[field]?.value ?? false,
        task: createdTaskIds[index] || null,
      }
      return acc
    }, {})

    console.log("✅ Step 3: Saving ProcessQualif...", formattedProcessQualifData)
    const newProcessQualif = new ProcessQualif(formattedProcessQualifData)
    await newProcessQualif.save()

    console.log("✅ ProcessQualif created successfully:", newProcessQualif)
    res.status(201).json({ message: "ProcessQualif created successfully", data: newProcessQualif })
  } catch (error) {
    console.error("❌ Error creating ProcessQualif:", error)
    res.status(500).json({ message: "Internal Server Error", error: error.message })
  }
}

exports.getAllProcessQualifs = async (req, res) => {
  try {
    console.log("📢 Fetching all ProcessQualifs...")

    const processQualifs = await ProcessQualif.find().populate(
      processQualifFields.map((field) => ({ path: `${field}.task`, model: "Task" })),
    )

    if (!processQualifs || processQualifs.length === 0) {
      return res.status(404).json({ message: "No ProcessQualifs found." })
    }

    console.log("✅ ProcessQualifs fetched successfully:", processQualifs)
    res.status(200).json(processQualifs)
  } catch (error) {
    console.error("❌ Error fetching ProcessQualifs:", error.message)
    res.status(500).json({ message: "Error fetching ProcessQualifs", error: error.message })
  }
}

exports.getProcessQualifById = async (req, res) => {
  try {
    const { id } = req.params

    console.log("📢 Fetching ProcessQualif for ID:", id)

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ProcessQualif ID format." })
    }

    const processQualif = await ProcessQualif.findById(id)
      .populate({
        path: processQualifFields.map((field) => `${field}.task`).join(" "),
        model: "Task",
      })
      .lean()

    if (!processQualif) {
      return res.status(404).json({ message: "ProcessQualif not found." })
    }

    res.status(200).json(processQualif)
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message })
  }
}

exports.updateProcessQualif = async (req, res) => {
  try {
    const processQualifData = req.body
    const processQualifId = req.params.id

    const existingProcessQualif = await ProcessQualif.findById(processQualifId).populate({
      path: processQualifFields.map((field) => `${field}.task`).join(" "),
      model: "Task",
    })

    if (!existingProcessQualif) {
      return res.status(404).json({ message: "ProcessQualif not found" })
    }

    // Store the previous state to compare assigned users for email notifications
    const previousAssignedUsers = {}
    processQualifFields.forEach((field) => {
      if (existingProcessQualif[field]?.task?.assignedUsers) {
        previousAssignedUsers[field] = [...existingProcessQualif[field].task.assignedUsers]
      } else {
        previousAssignedUsers[field] = []
      }
    })

    // Step 1: Update ProcessQualif fields dynamically
    processQualifFields.forEach((field) => {
      existingProcessQualif[field].value = processQualifData[field]?.value ?? false
    })

    await existingProcessQualif.save()

    // Step 2: Update Tasks dynamically
    await Promise.all(
      processQualifFields.map(async (field) => {
        if (processQualifData[field]?.task) {
          if (existingProcessQualif[field].task) {
            await Task.findByIdAndUpdate(existingProcessQualif[field].task, processQualifData[field].task, {
              new: true,
            })
          } else {
            const newTask = await Task.create(processQualifData[field].task)
            existingProcessQualif[field].task = newTask._id
            await existingProcessQualif.save()
          }
        }
      }),
    )

    // Step 3: Process email notifications for newly assigned users
    await processEmailNotifications(processQualifData, previousAssignedUsers, "Process Qualification")

    res.status(200).json({ message: "ProcessQualif and Tasks updated", data: existingProcessQualif })
  } catch (error) {
    res.status(500).json({ message: "Error updating ProcessQualif", error: error.message })
  }
}

// Helper function to process email notifications
async function processEmailNotifications(processQualifData, previousAssignedUsers, sectionName) {
  try {
    // Field config for better email content
    const fieldConfig = {}
    processQualifFields.forEach((field) => {
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
    for (const field of processQualifFields) {
      const currentAssignedUsers = processQualifData[field]?.task?.assignedUsers || []
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
                taskDescription: fieldConfig[field]?.description || "Task assignment for process qualification",
                sectionName: sectionName,
                sectionUrl: "/process-qualification",
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

exports.deleteProcessQualif = async (req, res) => {
  console.log(req.params.id)
  try {
    const processQualif = await ProcessQualif.findById(req.params.id)
    if (!processQualif) {
      return res.status(404).json({ message: "ProcessQualif not found" })
    }

    // Step 1: Delete the associated tasks
    const taskIds = processQualifFields.map((field) => processQualif[field]?.task?._id).filter(Boolean)
    await Task.deleteMany({ _id: { $in: taskIds } })

    // Step 2: Delete the ProcessQualif record itself
    await ProcessQualif.findByIdAndDelete(req.params.id)

    res.status(200).json({ message: "ProcessQualif and associated tasks deleted" })
  } catch (error) {
    res.status(500).json({ message: "Error deleting ProcessQualif", error: error.message })
  }
}
