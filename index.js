require("dotenv").config();
const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");
// const contacts = require("./repo");
const connectDB = require("./config/db");
const Contact = require("./models/contacts");

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());

app.get("/", async (req, res) => {
  const records = await Contact.find();
  const contactsRecords = records.map(
    ({ _id, fname, lname, company, phone, email }) => ({
      id: _id,
      fname,
      lname,
      company,
      email,
      phone,
    })
  );

  // const records = await contacts.getAll();
  res.send(contactsRecords);
});

app.post("/", async (req, res) => {
  try {
    req.body = JSON.parse(Object.keys(req.body)[0]);
  } catch (err) {
    console.log(err);
  }

  console.log(req.body);

  const contact = await Contact.create(req.body);
  const { _id: id, fname: firstName, lname, company, phone, email } = contact;
  const data = { id, fname: firstName, lname, company, email, phone };
  // let contact = await contacts.create(req.body);
  res.send(data);
});

app.put("/:id", (req, res) => {
  const { id } = req.params;
  try {
    req.body = JSON.parse(Object.keys(req.body)[0]);
  } catch (err) {
    console.log(err);
  }

  console.log(req.body);

  Contact.findByIdAndUpdate(id, req.body)
    .then(() => res.sendStatus(200))
    .catch((err) => res.send(err));
  // await contacts.update(id, req.body);
});

app.delete("/:id", (req, res) => {
  const { id } = req.params;
  Contact.findByIdAndDelete(id)
    .then(() => res.sendStatus(200))
    .catch((err) => res.send(err));
  // await contacts.delete(id);
});

app.listen(process.env.PORT || 3000, () => console.log("server has started!"));
