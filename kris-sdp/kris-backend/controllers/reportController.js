const { generateReport } = require('../services/jasperService');
const path = require('path');
const fs = require('fs');

exports.createReport = async (req, res) => {
  const { fromDate, toDate, format, reportType } = req.body;

  try {
    const filePath = await generateReport(fromDate, toDate, format, reportType);
    const fileName = path.basename(filePath);
    res.status(200).json({ success: true, file: fileName });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to generate report.' });
  }
};

exports.downloadReport = (req, res) => {
    const fileName = req.params.filename;
    const filePath = path.join(__dirname, '../output', fileName);
  
    fs.exists(filePath, (exists) => {
      if (!exists) {
        return res.status(404).json({ message: 'File not found' });
      }
      res.download(filePath);
    });
  };
