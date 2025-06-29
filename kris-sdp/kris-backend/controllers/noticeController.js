const noticeModel = require("../models/noticeModel");

// Get all notice
exports.getAllNotice = (req, res) => {
  noticeModel.getAllNotice((err, results) => {
    if (err) {
      console.error("Error fetching all Notice:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

// Add new notice
exports.addNotice = (req, res) => {
  const { Heading, Date, Description, Admin_ID } = req.body;
  if (!Heading || !Date || !Description || !Admin_ID) {
    return res.status(400).json({ error: "Heading, Date, Admin_ID and Description are required" });
  }

  noticeModel.addNotice({ Heading, Date, Description, Admin_ID }, (err, results) => {
    if (err) {
      console.error("Error adding Notice:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ Notice_ID: results.insertId, Heading, Date, Description, Admin_ID });
  });
};

// Update existing notice
exports.updateNotice = (req, res) => {
  const { id } = req.params;
  const { Heading, Date, Description, Admin_ID } = req.body;

  if (!Heading || !Date || !Admin_ID || !Description) {
    return res.status(400).json({ error: "Heading, Date, Admin_ID and Description are required" });
  }

  noticeModel.updateNotice(id, { Heading, Date, Description, Admin_ID}, (err, results) => {
    if (err) {
      console.error("Error updating notice:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "notice updated successfully" });
  });
};

// Delete notice
exports.deleteNotice = (req, res) => {
  const { id } = req.params;
  
  noticeModel.deleteNotice(id, (err, results) => {
    if (err) {
      console.error("Error deleting notice:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "notice deleted successfully" });
  });
};

