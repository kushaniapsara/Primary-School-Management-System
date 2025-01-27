/*const Item = require('../models/itemModel');

const getAllItems = (req, res) => {
    Item.getAll((err, results) => {
        if (err) {
            res.status(500).json({ error: 'Database error', details: err });
        } else {
            res.status(200).json(results);
        }
    });
};

const createItem = (req, res) => {
    const { name, price } = req.body;
    if (!name || !price) {
        return res.status(400).json({ error: 'Name and price are required' });
    }
    Item.create({ name, price }, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Database error', details: err });
        } else {
            res.status(201).json({ id: results.insertId, name, price });
        }
    });
};

module.exports = {
    getAllItems,
    createItem,
};*/
