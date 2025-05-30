const KickOff = require("../models/kickoff")
const Task = require("../models/Task")
const User = require("../models/UserModel")
const { sendTaskAssignmentEmail } = require("../utils/emailServicetask")

const kickOffFields = [
  "timeScheduleApproved",
  "modificationLaunchOrder",
  "projectRiskAssessment",
  "standardsImpact",
  "validationOfCosts",
]

exports.createKickOff = async (req, res) => {
  try {
    console.log("📢 Received Kick-Off Data:", JSON.stringify(req.body, null, 2))

    const kickOffData = req.body

    // ✅ Step 1: Create tasks separately and store their _ids
    const taskPromises = kickOffFields.map(async (field) => {
      if (kickOffData[field]?.task) {
        const newTask = new Task(kickOffData[field].task)
        await newTask.save()
        return newTask._id // Return the task _id
      }
      return null
    })

    const createdTaskIds = await Promise.all(taskPromises)

    // ✅ Step 2: Build the Kick-Off object with task _ids
    const formattedKickOffData = kickOffFields.reduce((acc, field, index) => {
      acc[field] = {
        value: kickOffData[field]?.value ?? false,
        task: createdTaskIds[index] || null, // Store only the ObjectId
      }
      return acc
    }, {})

    // ✅ Step 3: Save the Kick-Off entry
    const newKickOff = new KickOff(formattedKickOffData)
    await newKickOff.save()

    console.log("✅ Kick-Off created successfully:", newKickOff)

    res.status(201).json({
      message: "Kick-Off created successfully",
      data: newKickOff,
    })
  } catch (error) {
    console.error("❌ Error creating Kick-Off:", error.message)
    res.status(500).json({ message: "Internal Server Error", error: error.message })
  }
}

// **Get All Kick-Offs with Tasks**
exports.getAllKickOffs = async (req, res) => {
  try {
    console.log("📢 Fetching all Kick-Offs...")

    const kickOffs = await KickOff.find().populate({
      path: kickOffFields.map((field) => `${field}.task`).join(" "),
      model: "Task",
    })

    console.log("✅ Kick-Offs fetched successfully:", kickOffs)

    res.status(200).json(kickOffs)
  } catch (error) {
    console.error("❌ Error fetching Kick-Offs:", error.message)
    res.status(500).json({ message: "Error fetching Kick-Offs", error: error.message })
  }
}

// **Get a Single Kick-Off with Tasks**
const mongoose = require("mongoose")

exports.getKickOffById = async (req, res) => {
  try {
    const { id } = req.params

    console.log("📢 Fetching Kick-Off for ID:", id)

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Kick-Off ID format." })
    }

    const kickOff = await KickOff.findById(id)
      .populate({
        path: kickOffFields.map((field) => `${field}.task`).join(" "),
        model: "Task",
      })
      .lean()

    if (!kickOff) {
      return res.status(404).json({ message: "Kick-Off not found." })
    }

    res.status(200).json(kickOff)
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message })
  }
}

// **Update Kick-Off and Tasks**
exports.updateKickOff = async (req, res) => {
  try {
    const kickOffData = req.body
    const kickOffId = req.params.id

    const existingKickOff = await KickOff.findById(kickOffId).populate({
      path: kickOffFields.map((field) => `${field}.task`).join(" "),
      model: "Task",
    })

    if (!existingKickOff) {
      return res.status(404).json({ message: "Kick-Off not found" })
    }

    // Store the previous state to compare assigned users for email notifications
    const previousAssignedUsers = {}
    kickOffFields.forEach((field) => {
      if (existingKickOff[field]?.task?.assignedUsers) {
        previousAssignedUsers[field] = [...existingKickOff[field].task.assignedUsers]
      } else {
        previousAssignedUsers[field] = []
      }
    })

    // Step 1: Update kick-off fields dynamically
    kickOffFields.forEach((field) => {
      existingKickOff[field].value = kickOffData[field]?.value ?? false
    })

    await existingKickOff.save()

    // Step 2: Update Tasks dynamically
    await Promise.all(
      kickOffFields.map(async (field) => {
        if (kickOffData[field]?.task) {
          if (existingKickOff[field].task) {
            await Task.findByIdAndUpdate(existingKickOff[field].task, kickOffData[field].task, {
              new: true,
            })
          } else {
            const newTask = await Task.create(kickOffData[field].task)
            existingKickOff[field].task = newTask._id
            await existingKickOff.save()
          }
        }
      }),
    )

    // Step 3: Process email notifications for newly assigned users
    await processEmailNotifications(kickOffData, previousAssignedUsers, "Kick-Off")

    res.status(200).json({ message: "Kick-Off and Tasks updated", data: existingKickOff })
  } catch (error) {
    console.error("❌ Error updating Kick-Off:", error)
    res.status(500).json({ message: "Error updating Kick-Off", error: error.message })
  }
}

// Helper function to process email notifications
async function processEmailNotifications(kickOffData, previousAssignedUsers, sectionName) {
  try {
    // Field config for better email content
    const fieldConfig = {}
    kickOffFields.forEach((field) => {
      fieldConfig[field] = {
        label: field.replace(/([A-Z])/g, " $1").trim(),
        description: `Configuration for ${field
          .replace(/([A-Z])/g, " $1")
          .trim()
          .toLowerCase()}`,
      }
    })

    // Process each field to find newly assigned users
    for (const field of kickOffFields) {
      const currentAssignedUsers = kickOffData[field]?.task?.assignedUsers || []
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
                taskDescription: fieldConfig[field]?.description || "Task assignment for kick-off process",
                sectionName: sectionName,
                sectionUrl: "/kick-off",
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

// **Delete Kick-Off and Associated Tasks**
exports.deleteKickOff = async (req, res) => {
  try {
    const kickOff = await KickOff.findById(req.params.id)
    if (!kickOff) {
      return res.status(404).json({ message: "Kick-Off not found" })
    }

    // Step 1: Delete the associated tasks
    const taskIds = kickOffFields.map((field) => kickOff[field]?.task).filter(Boolean)
    await Task.deleteMany({ _id: { $in: taskIds } })

    // Step 2: Delete the Kick-Off record itself
    await KickOff.findByIdAndDelete(req.params.id)

    res.status(200).json({ message: "Kick-Off and associated tasks deleted" })
  } catch (error) {
    res.status(500).json({ message: "Error deleting Kick-Off", error: error.message })
  }
}
