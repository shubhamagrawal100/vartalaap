const pool = require("../config/db");

class Agent {
  constructor(id, tenantId, name, email, phone, tags = [], attributes = {}) {
    this.id = id;
    this.tenantId = tenantId;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.tags = tags; // Array of tags
    this.attributes = attributes; // Object for custom attributes
  }

  static async createAgent(tenantId, data) {
    try {
      const { name, email, phone, tags = [], attributes = {} } = data;
      const [result] = await pool.query(
        'INSERT INTO Agent (tenantId, name, email, phoneNumber, tags, attributes) VALUES (?, ?, ?, ?, ?, ?)',
        [tenantId, name, email, phone, JSON.stringify(tags), JSON.stringify(attributes)]
      );
        
      const insertedId = result.insertId;
      return "Agent added sucessfully";
    } catch (err) {
      console.error(err);
      throw err; // Re-throw the error for handling in the route handler
    }
  }

  static async getAgentById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM Agent WHERE AgentId = ?', [id]);
      if (rows.length === 0) {
        return null;
      }

      const agent = new Agent(
        rows[0].AgentID,
        rows[0].TenantID,
        rows[0].Name,
        rows[0].Email,
        rows[0].PhoneNumber,
        rows[0].Tags || [], // Handle potential null value
        rows[0].Attributes || {} // Handle potential null value
      );

      return agent;
    }catch (err) {
      console.error(err);
      throw err; // Re-throw the error for handling in the route handler
    }
  }

  static async updateAgent(id, updateData) {
    try {
      const allowedUpdates = ['name', 'email', 'phone']; // Allowed update fields
      const updates = Object.keys(updateData).filter((field) => allowedUpdates.includes(field));
  
      if (updates.length === 0) {
        return { message: 'No update fields provided' };
      }
  
      const updateSet = updates.map((field) => `${field} = ?`).join(', ');
      const updateValues = [updateData[updates[0]], ...updateData.slice(1)]; // Extract update values
  
      const [result] = await pool.query(
        `UPDATE Agent SET ${updateSet} WHERE id = ?`,
        [...updateValues, id]
      );
  
      if (result.affectedRows === 0) {
        throw new Error('Agent not found');
      }
  
      return { message: 'Agent updated successfully' };
    } catch (err) {
      console.error(err);
      throw err; // Re-throw the error for handling in the route handler
    }
  }

  static async deleteAgent(id) {
    try {
      const [result] = await pool.query('DELETE FROM Agent WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        throw new Error('Agent not found');
      }
      return { message: 'Agent deleted successfully' };
    } catch (err) {
      console.error(err);
      throw err; // Re-throw the error for handling in the route handler
    }
  }
}


// Implement static methods for CRUD operations
module.exports = Agent;
