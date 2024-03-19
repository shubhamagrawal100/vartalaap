const express = require("express");
const passport = require("../config/passport");
const Contact = require("../models/contacts");
const csvtojson = require("csvtojson"); // Install csvtojson library (npm install csvtojson)

const router = express.Router();

// ... (other route definitions)


//get contact by id. 
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.getContactById(id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(contact);
  } catch (err) {
    res.status(400).json({ message: err.message }); // Handle errors appropriately
  }
});

//update contact details 
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const result = await Contact.updateContact(id, updateData);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message }); // Handle errors appropriately
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteContact(id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message }); // Handle errors appropriately
  }
});

// Bulk contact update using CSV (POST)
router.post(
  "/bulk-update",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (!req.files || !req.files.contacts) {
      return res.status(400).json({ message: "Missing contacts CSV file" });
    }
    try {
      const contacts = await csvtojson.fromString(
        req.files.contacts.data.toString(),
      );
      const insertedContacts = [];
      for (const contact of contacts) {
        const newContact = await Contact.create(contact);
        insertedContacts.push(newContact);
      }
      res
        .status(201)
        .json({
          message: "Contacts imported successfully",
          data: insertedContacts,
        });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error importing contacts" });
    }
  },
);

module.exports = router;
