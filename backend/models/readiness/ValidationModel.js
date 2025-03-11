const mongoose = require('mongoose');

const ValidationSchema = new mongoose.Schema({
    tko: { type: Boolean, default: false },  
    ot: { type: Boolean, default: false },   
    ot_op: { type: Boolean, default: false }, 
    is: { type: Boolean, default: false },   
    sop: { type: Boolean, default: false },  
    ok_nok: { type: String, enum: ["OK", "NOK"], required: true },  
    comments: { type: String, default: "" },  
    who: { type: String, required: true },   
    when: { type: Date, required: true },    
    validation_check: { type: Boolean, default: false } 
}, { timestamps: true });

module.exports = mongoose.model("Validation", ValidationSchema);

