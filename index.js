const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");
const contacts = require("./repo");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());

app.get("/", async (req, res) => {
  const records = await contacts.getAll();
  res.send(records);
});

app.post("/", async (req, res) => {
  req.body = JSON.parse(Object.keys(req.body)[0]);
  console.log(req.body);
  const { fname } = req.body;
  if (!fname) {
    return res.status(500).json({ message: "first name is required" });
  }

  let contact = await contacts.create(req.body);
  res.send(contact);
});

app.put("/:id", async (req, res) => {
  const { id } = req.params;

  await contacts.update(id, req.body);
  res.send(200);
});

app.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await contacts.delete(id);
  res.send(200);
});

app.listen(process.env.PORT || 3000, () => console.log("server has started!"));
