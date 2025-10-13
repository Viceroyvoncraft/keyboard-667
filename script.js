// Espera a que la estructura sagrada (DOM) esté completamente construida.
document.addEventListener('DOMContentLoaded', () => {

    // --- EL NOOSFERIO DE DATOS ---
    // Un único registro completo que sirve como arquetipo para todos los demás.
    // ¡Deberás replicar esta estructura para cada juego que añadas!
    const games = [
        {
            "id": 1,
            "title": "Half-Life 2",
            "developer": "Valve Corporation",
            "publisher": "Valve Corporation",
            "release_date": "2004-11-16",
            "genre": "First-person shooter",
            "notes": "Un juego fundamental que estableció muchos de los estándares de control modernos para los FPS en PC.",
            "controls": {
                "Move Forward": "W",
                "Move Back": "S",
                "Strafe Left": "A",
                "Strafe Right": "D",
                "Jump": "Space",
                "Crouch": "Ctrl",
                "Primary Fire": "Mouse 1",
                "Secondary Fire": "Mouse 2",
                "Use / Interact": "E",
                "Reload": "R",
                "Flashlight": "F",
                "Sprint": "Shift",
                "Next Weapon": "Mouse Wheel Down",
                "Previous Weapon": "Mouse Wheel Up",
                "Gravity Gun": "G"
            }
        }
        // ... ¡Añade aquí los demás juegos, siguiendo esta misma estructura completa!
    ];

    // --- REFERENCIAS A ELEMENTOS DEL DOM ---
    const gameListContainer = document.getElementById('gameList');
    const searchInput = document.getElementById('searchInput');

    // --- FUNCIONES SAGRADAS ---

    /**
     * Renderiza las tarjetas de juego en el contenedor principal.
     * @param {Array} gamesToDisplay - El array de juegos a mostrar.
     */
    function displayGames(gamesToDisplay) {
        gameListContainer.innerHTML = '';

        if (gamesToDisplay.length === 0) {
            gameListContainer.innerHTML = '<p>No se encontraron juegos que coincidan con la búsqueda.</p>';
            return;
        }

        gamesToDisplay.forEach(game => {
            const gameCard = document.createElement('div');
            gameCard.classList.add('game-card');
            
            // Lógica para construir la lista de controles dinámicamente
            let controlsHtml = '<ul>';
            for (const action in game.controls) {
                controlsHtml += `<li><strong>${action}:</strong> ${game.controls[action]}</li>`;
            }
            controlsHtml += '</ul>';

            // Se usa una plantilla literal para construir el contenido de la tarjeta.
            gameCard.innerHTML = `
                <h2>${game.title}</h2>
                <p><strong>Desarrollador:</strong> ${game.developer}</p>
                <p><strong>Año de lanzamiento:</strong> ${new Date(game.release_date).getFullYear()}</p>
                <p><strong>Género:</strong> ${game.genre}</p>
                <p><strong>Notas:</strong> ${game.notes}</p>
                <h3>Controles de Teclado:</h3>
                ${controlsHtml}
            `;
            
            gameListContainer.appendChild(gameCard);
        });
    }

    // --- LÓGICA DE BÚSQUEDA ---
    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredGames = games.filter(game => {
            return game.title.toLowerCase().includes(searchTerm) ||
                   game.developer.toLowerCase().includes(searchTerm);
        });
        displayGames(filteredGames);
    });

    // --- INVOCACIÓN INICIAL ---
    displayGames(games);
});