// backend/app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const albumController = require('./controllers/albumController');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/musicAlbumsDBV1')
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.log('Error al conectar a MongoDB:', err));

// Configuración de Multer para imágenes y pistas
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isImage = file.mimetype.startsWith('image/');
    const uploadFolder = isImage ? 'uploads/images/' : 'uploads/tracks/';
    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Rutas CRUD de álbumes
app.post('/albums', upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'tracks', maxCount: 10 }]), albumController.createAlbum);
app.get('/albums', albumController.getAlbums);
app.get('/albums/:id', albumController.getAlbum);
app.put('/albums/:id', upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'tracks', maxCount: 10 }]), albumController.updateAlbum);
app.delete('/albums/:id', albumController.deleteAlbum);

// Servidor escuchando
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
