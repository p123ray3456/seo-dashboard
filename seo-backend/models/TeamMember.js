const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  role: {
    type: String,
    default: "SEO Strategist"
  },

  status: {
    type: String,
    default: "Active"
  }

}, { timestamps: true });

module.exports = mongoose.model("TeamMember", teamMemberSchema);