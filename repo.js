const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

class ContactsRepo {
  constructor(filename) {
    if (!filename) {
      throw new Error("Creating a repository requires a filename");
    }

    this.filename = filename;
    this.path = path.join(__dirname, this.filename);
    try {
      fs.accessSync(this.path);
    } catch (err) {
      fs.writeFileSync(this.path, "[]");
    }
  }

  async writeAll(records) {
    await fs.promises.writeFile(this.path, JSON.stringify(records, null, 2));
  }

  async getAll() {
    return JSON.parse(
      await fs.promises.readFile(this.path, { encoding: "utf-8" })
    );
  }

  randomId() {
    return crypto.randomBytes(4).toString("hex");
  }

  async create(record) {
    record.id = this.randomId();

    const records = await this.getAll();
    records.push(record);
    await this.writeAll(records);
    return record;
  }

  async update(id, attrs) {
    const records = await this.getAll();
    const recordToUpdate = records.find((record) => (record.id = id));

    Object.assign(recordToUpdate, attrs);
    await this.writeAll(records);
  }

  async delete(id) {
    let records = await this.getAll();
    records = records.filter((record) => record.id !== id);
    await this.writeAll(records);
  }
}

module.exports = new ContactsRepo("contacts.json");
