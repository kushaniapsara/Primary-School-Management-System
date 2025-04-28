const db = require('../config/db'); // Import the database connection

const getImagesForActivity = (req, res) => {
    const { activityId } = req.params;

    const query = 'SELECT Image_ID, Image_Path, Caption FROM ActivityImages WHERE Activity_ID = ?';

    db.query(query, [activityId], (error, results) => {
        if (error) {
            console.error('Error fetching images', error);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length > 0) {
            res.json(results);
        } else {
            res.status(404).json({ message: 'No images found for this activity' });
        }
    });
};



const deleteImage = (req, res) => {
    const { imageId } = req.params;
  
    // Ensure imageId is valid before proceeding
    if (!imageId) {
      return res.status(400).json({ message: 'Image ID is required' });
    }
  
    // Query to delete the image based on Image_ID
    const query = 'DELETE FROM ActivityImages WHERE Image_ID = ?';
  
    db.query(query, [imageId], (error, results) => {
      if (error) {
        console.error('Error deleting image', error);
        return res.status(500).json({ message: 'Database error' });
      }
  
      if (results.affectedRows > 0) {
        res.json({ message: 'Image deleted successfully' });
      } else {
        res.status(404).json({ message: 'Image not found' });
      }
    });
  };
  


module.exports = { getImagesForActivity, deleteImage, };
