const db = require('../config/db'); // Import the database connection

const getImagesForActivity = async (req, res) => {
    const { activityId } = req.params;
  
    try {
      const query = 'SELECT Image_Path FROM ActivityImages WHERE Activity_ID = ?';
      const [rows] = await db.execute(query, [activityId]);
  
      if (rows.length > 0) {
        res.json(rows); // Send all the image paths for the given activity
      } else {
        res.status(404).json({ message: 'No images found for this activity' });
      }
    } catch (error) {
      console.error('Error fetching images', error);
      res.status(500).json({ message: 'Database error' });
    }
  };
  
  module.exports = { getImagesForActivity };
  