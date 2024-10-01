// backend/models/Album.js
const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String },
  coverImage: { type: String },
  tracks: [{ type: String }]
});

module.exports = mongoose.model('Album', albumSchema);
