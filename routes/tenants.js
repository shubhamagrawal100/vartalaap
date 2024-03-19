const express = require("express");
const passport = require("../config/passport");
const Tenant = require("../models/tenants");
const Contact = require("../models/contacts");
const Agent = require("../models/agents");



const router = express.Router();

// Add tenant (POST)
router.post("/", async (req, res) => {
  try {
    const newTenant = await Tenant.create(req.body);
    res
      .status(201)
      .json({ message: "Tenant created successfully", id: newTenant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating tenant" });
  }
});

// Get tenant by ID (GET)
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { role } = req.user;
    if (
      role !== "admin" &&
      role !== "tenant" &&
      req.user.id !== parseInt(req.params.id)
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }
    try {
      const tenant = await Tenant.getById(req.params.id);
      if (!tenant) {
        return res.status(404).json({ message: "Tenant not found" });
      }
      res.json(tenant);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching tenant" });
    }
  },
);

// Update tenant (PUT) (implement logic based on your needs)
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body; // Updated tenant data
  
      const result = await Tenant.update(id, updatedData);
      res.json(result);
    } catch (err) {
      res.status(400).json({ message: err.message }); // Handle errors appropriately
    }
  },
);

// Insert into tenant (POST) 
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const insertData = req.body; // Updated tenant data
      const result = await Tenant.createTenant(insertData);
      res.json(result);
    } catch (err) {
      console.log(err)
      res.status(400).json({ message: err.message }); // Handle errors appropriately
    }
  },
);

// Recharge balance
router.put('/:id/recharge', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, modeOfPayment } = req.body; // Recharge amount from request body
    console.log(modeOfPayment)
    const result = await Tenant.rechargeBalance(id, amount, modeOfPayment);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message }); // Handle errors appropriately
  }
});

// Delete tenant (DELETE) (implement logic with authorization checks)
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // Implement logic to delete tenant and related data (e.g., agents, contacts) with authorization checks
  },
);

//create agent against a tenant
router.post('/:tenantId/agents', async (req, res) => {
  try {
    const { tenantId } = req.params;
    const newAgentData = req.body;
    console.log(newAgentData)
    const agent = await Agent.createAgent(tenantId, newAgentData);
    res.status(201).json(agent); // Created status code for successful creation
  } catch (err) {
    res.status(400).json({ message: err.message }); // Handle errors appropriately
  }
});

router.post('/:tenantId/createcontact', async (req, res) => {
  try {
    const { tenantId } = req.params;
    const newContactData = req.body;
    const contact = await Contact.createContact(tenantId, newContactData);
    res.status(201).json(contact); // Created status code for successful creation
  } catch (err) {
    res.status(400).json({ message: err.message }); // Handle errors appropriately
  }
});

module.exports = router;
