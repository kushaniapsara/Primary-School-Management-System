const googleLinkModel = require('../models/googleLinkModel');

exports.getLink = (req, res) => {
  try {
    const link = googleLinkModel.getLink();
    res.json({ link });
  } catch (error) {
    res.status(500).json({ error: 'Failed to read link.' });
  }
};

exports.updateLink = (req, res) => {
  const { link } = req.body;

  if (!link) {
    return res.status(400).json({ error: 'Link is required' });
  }

  try {
    googleLinkModel.updateLink(link);
    res.json({ message: 'Link updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update link.' });
  }
};
