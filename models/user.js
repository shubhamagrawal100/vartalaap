const bcrypt = require('bcrypt'); // Install bcrypt for password hashing (npm install bcrypt)

const pool = require('../config/db'); // Assuming a shared database connection

class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.password = data.password; // Hashed password will be stored
  }

  static async create(data) {
    const saltRounds = 10; // Adjust salt rounds as needed for password hashing
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
    const [result] = await pool.query('INSERT INTO User SET ?', { email: data.email, password: hashedPassword });
    return result.insertId;
  }
  
  static async findByEmail(email) {
    const [result] = await pool.query('SELECT * FROM User WHERE email = ?', [email]);
    return result[0] || null; // Return the user object or null if not found
  }

  // ... (implement methods for updating user data if needed)
}

module.exports = User;
