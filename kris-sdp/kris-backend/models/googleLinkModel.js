const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../googleLink.json');

exports.getLink = () => {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data).link;
};

exports.updateLink = (newLink) => {
  const updated = { link: newLink };
  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
};
