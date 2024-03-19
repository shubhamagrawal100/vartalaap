const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const errorHandler = require("./utils/errorhandler"); // Error handler middleware

// Configuration files
const db = require("./config/db");
const passport = require("./config/passport");
// console.log(passport)
const app = express();
const port = process.env.PORT || 3000;

// Connect to MySQL database
// db.connect();

// Body parser middleware
app.use(bodyParser.json());

// CORS middleware
app.use(cors());

// Initialize Passport.js
app.use(passport.initialize());

// API routes (replace with actual route handlers)
app.use("/auth", require("./routes/auth"));
app.use("/tenants", require("./routes/tenants"));
app.use("/agents", require("./routes/agents")); // Implement similar structure
app.use("/contacts", require("./routes/contacts")); // Implement similar structure

// Error handler middleware (place at the end)
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
