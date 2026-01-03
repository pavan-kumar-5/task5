const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Ensure data directory exists
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Contact form API
app.post("/contact", (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false,
        message: "All required fields must be provided" 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        message: "Please provide a valid email address" 
      });
    }

    const filePath = path.join(dataDir, "contacts.json");
    let contacts = [];

    // Read existing contacts if file exists
    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, "utf8");
        contacts = fileContent ? JSON.parse(fileContent) : [];
      } catch (error) {
        console.error("Error reading contacts file:", error);
        return res.status(500).json({ 
          success: false,
          message: "Error processing your request" 
        });
      }
    }

    // Add new contact
    const newContact = {
      id: Date.now().toString(),
      name,
      email,
      phone: phone || null,
      subject,
      message,
      date: new Date().toISOString(),
      status: "unread"
    };

    contacts.push(newContact);

    // Save to file
    try {
      fs.writeFileSync(filePath, JSON.stringify(contacts, null, 2));
      res.json({ 
        success: true,
        message: "Your message has been sent successfully!",
        data: newContact
      });
    } catch (error) {
      console.error("Error writing to contacts file:", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to save your message. Please try again." 
      });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ 
      success: false,
      message: "An unexpected error occurred. Please try again later." 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
