const pool = require("../config/db");

class Contact {

  constructor(id, tenantId, name, email, phone, tags = [], attributes = {}, optIn = false) {
    this.id = id;
    this.tenantId = tenantId;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.tags = tags;
    this.attributes = attributes;
    this.optIn = optIn; // Boolean indicating opt-in for communication
  }

 static async getAllContacts(tenantId) {
  try {
    const [rows] = await pool.query('SELECT * FROM Contact WHERE tenantId = ?', [tenantId]);
    return rows.map((row) => new Contact(row.id, row.tenantId, row.name, row.email, row.phone));
  } catch (err) {
    console.error(err);
    throw err; // Re-throw the error for handling in the route handler
  }
}

static async getContactById(id) {
  try {
    const [rows] = await pool.query('SELECT * FROM Contact WHERE id = ?', [id]);
    if (rows.length === 0) {
      return null;
    }
    return new Contact(rows[0].id, rows[0].tenantId, rows[0].name, rows[0].email, rows[0].phone);
  } catch (err) {
    console.error(err);
    throw err; // Re-throw the error for handling in the route handler
  }
}

static async createContact(tenantId, data) {
  try {
    const { name, email, phone, tags = [], attributes = {}, optIn = false } = data;
    const [result] = await pool.query(
      'INSERT INTO Contacts (tenantId, name, email, phoneNumber, tags, attributes, optIn) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [tenantId, name, email, phone, JSON.stringify(tags), JSON.stringify(attributes), optIn]
    );

    const insertedId = result.insertId;
    return new Contact(insertedId, tenantId, name, email, phone, tags, attributes, optIn);
  } catch (err) {
    console.error(err);
    throw err; // Re-throw the error for handling in the route handler
  }
}

static async updateContact(id, updateData) {
  try {
    const allowedUpdates = ['name', 'email', 'phone', 'tags', 'attributes', 'optIn']; // Allowed update fields
    const updates = Object.keys(updateData).filter((field) => allowedUpdates.includes(field));

    if (updates.length === 0) {
      return { message: 'No update fields provided' };
    }

    let updateSet = '';
    let updateValues = [];
    for (const field of updates) {
      if (field === 'tags') {
        // Handle tags as an array
        const newTags = updateData.tags || []; // Use default empty array if not provided
        updateSet += `tags = ?,`;
        updateValues.push(newTags); // Push the tags array directly
      } else {
        updateSet += `${field} = ?,`;
        updateValues.push(updateData[field]);
      }
    }
    updateSet = updateSet.slice(0, -1); // Remove trailing comma

    const [result] = await pool.query(
      `UPDATE Contact SET ${updateSet} WHERE id = ?`,
      [...updateValues, id]
    );
    if (result.affectedRows === 0) {
      throw new Error('Contact not found');
    }
    return { message: 'Contact updated successfully' }; 
  } catch (err) {
    console.error(err);
    throw err; // Re-throw the error for handling in the route handler
  }
}

static async deleteContact(id) {
  try {
    const [result] = await pool.query('DELETE FROM Contact WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      throw new Error('Contact not found');
    }

    return { message: 'Contact deleted successfully' };
  } catch (err) {
    console.error(err);
    throw err; // Re-throw the error for handling in the route handler
  }
}
}

// Implement static methods for CRUD operations
module.exports = Contact;
