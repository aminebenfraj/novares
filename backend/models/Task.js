const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  check: { type: Boolean, default: false },
  role: { 
    type: String, 
    required: false,
    enum: [
      "Admin", "Manager", "Project Manager", "Business Manager", 
      "Financial Leader", "Manufacturing Eng. Manager", 
      "Manufacturing Eng. Leader", "Tooling Manager", 
      "Automation Leader", "SAP Leader", "Methodes UAP1&3", 
      "Methodes UAP2", "Maintenance Manager", 
      "Maintenance Leader UAP2", "Purchasing Manager", 
      "Logistic Manager", "Logistic Leader UAP1", 
      "Logistic Leader UAP2", "Logistic Leader", 
      "POE Administrator", "Material Administrator", 
      "Warehouse Leader UAP1", "Warehouse Leader UAP2", 
      "Prod. Plant Manager UAP1", "Prod. Plant Manager UAP2", 
      "Quality Manager", "Quality Leader UAP1", 
      "Quality Leader UAP2", "Quality Leader UAP3", 
      "Laboratory Leader", "Customer", "User", 
      "PRODUCCION", "LOGISTICA"
    ] 
  },
  assignedUsers: [ // Changed from assignedUser to assignedUsers
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: false 
    }
  ],
  planned: { type: Date, required: false },
  done: { type: Date },
  comments: { type: String },
  filePath: { type: String }
});

module.exports = mongoose.model("Task", TaskSchema);
