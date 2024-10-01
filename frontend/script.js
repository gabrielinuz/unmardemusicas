const albumForm = document.getElementById('albumForm');
const albumsList = document.getElementById('albumsList');

// Obtener álbumes actualizado (con nombre de pista):
const fetchAlbums = async () => {
  const response = await fetch('http://localhost:5000/albums');
  const albums = await response.json();
  
  albumsList.innerHTML = albums.map(album => `
    <li>
      <img src="http://localhost:5000/images/${album.coverImage}" width="100">
      <h3>${album.title} - ${album.artist} (${album.year})</h3>
      <p>${album.genre}</p>
      
      <h4>Pistas:</h4>
      <ul>
        ${album.tracks.map(track => `
          <li>
            <span>${track.split('.')[0]}: </span> <!-- Mostrar el nombre sin la extensión -->
            <br>
            <audio controls>
              <source src="http://localhost:5000/tracks/${track}" type="audio/${track.split('.').pop()}">
              Tu navegador no soporta el elemento <code>audio</code>.
            </audio>
          </li>
        `).join('')}
      </ul>

      <button onclick="deleteAlbum('${album._id}')">Eliminar</button>
    </li>
  `).join('');
};


// Crear álbum
albumForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append('title', document.getElementById('title').value);
  formData.append('artist', document.getElementById('artist').value);
  formData.append('year', document.getElementById('year').value);
  formData.append('genre', document.getElementById('genre').value);
  formData.append('coverImage', document.getElementById('coverImage').files[0]);
  
  Array.from(document.getElementById('tracks').files).forEach(file => {
    formData.append('tracks', file);
  });

  await fetch('http://localhost:5000/albums', {
    method: 'POST',
    body: formData
  });

  fetchAlbums(); // Actualiza la lista de álbumes
});

// Eliminar álbum
const deleteAlbum = async (id) => {
  await fetch(`http://localhost:5000/albums/${id}`, { method: 'DELETE' });
  fetchAlbums();
};

// Inicializar la lista de álbumes al cargar la página
fetchAlbums();
