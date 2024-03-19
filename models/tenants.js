const pool = require("../config/db");

class Tenant {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.phoneNumber = data.phoneNumber;
    this.vLBalance = data.vLBalance;
    this.lastRechargedAt = data.lastRechargedAt;
    this.modeOfPayment = data.modeOfPayment;
  }

  // Implement update and delete methods here (consider authorization checks)

  static async update(id, data) {
    const updateData = { ...data }; // Ensure only allowed fields are updated
    console.log(updateData)
    const [result] = await pool.query(
      "UPDATE Tenant SET ? WHERE TenantID = ?",
      [updateData, id],
    );
    console.log(result)
    return result.affectedRows > 0; // Return true if updated successfully
  }

  static async createTenant(data) {
    try {
      const columns = Object.keys(data).join(', '); // Build comma-separated list of columns
      const placeholders = columns.replace(/([^,]+)/g, '?'); // Replace column names with placeholders
      console.log(placeholders)
      const [result] = await pool.query(
        `INSERT INTO Tenant (${columns}) VALUES (${placeholders})`,
        Object.values(data) // Insert data values as an array
      );
      const insertedId = result.insertId;
      return { id: insertedId, message: 'Tenant created successfully' };
    } catch (err) {
      console.error(err);
      throw err; // Re-throw the error for handling in the route handler
    }
  }

  static async rechargeBalance(id, amount, modeOfPayment) {
    try {
      const [result] = await pool.query(
        `UPDATE Tenant SET vLBalance = vLBalance + ?, lastRechargedAt = NOW(), ModeOfPayment = ? WHERE TenantId = ?`,
        [amount, modeOfPayment, id]
      );

      if (result.affectedRows === 0) {
        throw new Error('Tenant not found');
      }

      console.log(result)
      return { message: 'Tenant VL balance recharged successfully' };
    } catch (err) {
      console.error(err);
      throw err; // Re-throw the error for handling in the route handler
    }
  }


  static async delete(id) {
    const [result] = await pool.query("DELETE FROM Tenant WHERE TenantID = ?", [
      id,
    ]);
    return result.affectedRows > 0; // Return true if deleted successfully
  }
}

module.exports = Tenant;
