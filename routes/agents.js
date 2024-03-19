const express = require("express");
const passport = require("../config/passport");
const Agent = require("../models/agents");

const router = express.Router();



  router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const agent = await Agent.getAgentById(id);
      if (!agent) {
        return res.status(404).json({ message: 'Agent not found' });
      }
      res.json(agent);
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' }); // Handle unexpected errors
    }
  });

  router.patch('/agents/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const result = await Agent.updateAgent(id, updateData);
      res.json(result);
    } catch (err) {
      res.status(400).json({ message: err.message }); // Handle errors appropriately
    }
  });

  router.delete('/agents/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await Agent.deleteAgent(id);
      res.json(result);
    } catch (err) {
      res.status(404).json({ message: err.message }); // Handle errors appropriately (e.g., 404 for not found)
    }
  });


module.exports = router;
