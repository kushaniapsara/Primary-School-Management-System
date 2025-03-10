const db = require('../config/db'); // Import the database connection

const getImagesForActivity = (req, res) => {
    const { activityId } = req.params;

    const query = 'SELECT Image_Path FROM ActivityImages WHERE Activity_ID = ?';

    db.query(query, [activityId], (error, results) => {
        if (error) {
            console.error('Error fetching images', error);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length > 0) {
            res.json(results); // Send all the image paths for the given activity
        } else {
            res.status(404).json({ message: 'No images found for this activity' });
        }
    });
};

module.exports = { getImagesForActivity };
