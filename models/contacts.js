const mongoose = require("mongoose");

const contactSchema = mongoose.Schema(
  {
    fname: String,
    lname: String,
    company: String,
    phone: String,
    email: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
