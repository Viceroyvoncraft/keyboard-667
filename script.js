// Espera a que el Documento Modelo de Objetos (DOM) esté completamente cargado.
document.addEventListener('DOMContentLoaded', () => {

    // Referencias a los elementos sagrados del DOM.
    const gameListContainer = document.getElementById('gameList');
    const searchInput = document.getElementById('searchInput');

    // Variable para almacenar los datos de los juegos una vez cargados.
    let games = [];

    // Función asíncrona para comulgar con el noosferio de datos (games.json).
    async function fetchGames() {
        try {
            const response = await fetch('games.json');
            games = await response.json();
            displayGames(games); // Muestra todos los juegos inicialmente.
        } catch (error) {
            console.error('Fallo al obtener los datos de los juegos:', error);
            gameListContainer.innerHTML = '<p>Error al cargar la base de datos de juegos.</p>';
        }
    }

    // Función para renderizar la lista de juegos en la página.
    function displayGames(gamesToDisplay) {
        gameListContainer.innerHTML = ''; // Limpia el contenedor antes de mostrar nuevos datos.

        if (gamesToDisplay.length === 0) {
            gameListContainer.innerHTML = '<p>No se encontraron juegos que coincidan con la búsqueda.</p>';
            return;
        }

        gamesToDisplay.forEach(game => {
            const gameCard = document.createElement('div');
            gameCard.classList.add('game-card');

            // La estructura HTML de cada tarjeta de juego.
            gameCard.innerHTML = `
                <h2>${game.title}</h2>
                <p><strong>Developer:</strong> ${game.developer}</p>
                <p><strong>Year:</strong> ${game.release_year}</p>
                <p><strong>Genre:</strong> ${game.genre}</p>
                <p><strong>Notes:</strong> ${game.notes}</p>
            `;

            gameListContainer.appendChild(gameCard);
        });
    }

    // Escucha los eventos de entrada en la barra de búsqueda.
    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredGames = games.filter(game => {
            return game.title.toLowerCase().includes(searchTerm) ||
                   game.developer.toLowerCase().includes(searchTerm);
        });
        displayGames(filteredGames);
    });

    // Inicia el proceso al cargar la página.
    fetchGames();
});