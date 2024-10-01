// backend/controllers/albumController.js
const Album = require('../models/Album');
const path = require('path');
const fs = require('fs');

// Crear álbum
exports.createAlbum = async (req, res) => {
  try {
    const { title, artist, year, genre } = req.body;

    // Guardar la portada del álbum e información de las pistas
    const coverImage = req.files['coverImage'] ? req.files['coverImage'][0].filename : null;
    const tracks = req.files['tracks'] ? req.files['tracks'].map(track => track.filename) : [];

    const newAlbum = new Album({ title, artist, year, genre, coverImage, tracks });
    await newAlbum.save();

    res.status(201).json(newAlbum);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el álbum', error });
  }
};

// Obtener todos los álbumes
exports.getAlbums = async (req, res) => {
  try {
    const albums = await Album.find();
    res.json(albums);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los álbumes', error });
  }
};

// Obtener un álbum por ID
exports.getAlbum = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) return res.status(404).json({ message: 'Álbum no encontrado' });
    res.json(album);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el álbum', error });
  }
};

// Actualizar álbum
exports.updateAlbum = async (req, res) => {
  try {
    const { title, artist, year, genre } = req.body;
    const album = await Album.findById(req.params.id);

    if (!album) return res.status(404).json({ message: 'Álbum no encontrado' });

    album.title = title;
    album.artist = artist;
    album.year = year;
    album.genre = genre;

    if (req.files['coverImage']) {
      album.coverImage = req.files['coverImage'][0].filename;
    }
    if (req.files['tracks']) {
      album.tracks = req.files['tracks'].map(track => track.filename);
    }

    await album.save();
    res.json(album);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el álbum', error });
  }
};

// Eliminar álbum
exports.deleteAlbum = async (req, res) => {
  try {
    const album = await Album.findByIdAndDelete(req.params.id);
    if (!album) return res.status(404).json({ message: 'Álbum no encontrado' });

    res.json({ message: 'Álbum eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el álbum', error });
  }
};
