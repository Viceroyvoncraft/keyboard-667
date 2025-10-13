document.addEventListener('DOMContentLoaded', () => {

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
                "Gravity Gun": "G"
            }
        },
        {
            "id": 2,
            "title": "Cyberpunk 2077",
            "developer": "CD Projekt Red",
 "release_date": "2020-12-10",
            "genre": "Action role-playing",
            "notes": "Controles de movimiento y combate rápidos.",
            "controls": {
                "Move Forward": "W",
 "Move Back": "S",
 "Strafe Left": "A",
 "Strafe Right": "D",
 "Jump": "Space",
 "Sprint": "Shift",
 "Crouch": "C",
 "Interact": "F",
 "Scanner": "Tab",
                "Aim": "Mouse 2",
                "Attack": "Mouse 1",
                "Reload": "R"
            }
        }
    ];

    const gameListContainer = document.getElementById('gameList');
    const searchInput = document.getElementById('searchInput');

    /**
     * Genera el HTML para una representación simplificada del teclado.
     * @returns {string} - Una cadena de texto con el HTML del teclado.
     */
    function getKeyboardHtml() {
        return `
            <div class="keyboard-display">
                <div class="keyboard-row">
                    <div class="key" data-key="Q">Q</div>
                    <div class="key" data-key="W">W</div>
                    <div class="key" data-key="E">E</div>
                    <div class="key" data-key="R">R</div>
                    <div class="key" data-key="T">T</div>
                    <div class="key" data-key="Y">Y</div>
                </div>
                <div class="keyboard-row">
                    <div class="key" data-key="A">A</div>
                    <div class="key" data-key="S">S</div>
                    <div class="key" data-key="D">D</div>
                    <div class="key" data-key="F">F</div>
                    <div class="key" data-key="G">G</div>
                </div>
                <div class="keyboard-row">
                    <div class="key key-wide" data-key="Shift">Shift</div>
                    <div class="key" data-key="Z">Z</div>
                    <div class="key" data-key="X">X</div>
                    <div class="key" data-key="C">C</div>
                    <div class="key" data-key="V">V</div>
                </div>
                <div class="keyboard-row">
                    <div class="key" data-key="Ctrl">Ctrl</div>
                    <div class="key key-space" data-key="Space"></div>
                    <div class="key" data-key="Tab">Tab</div>
                </div>
            </div>
        `;
    }

    function displayGames(gamesToDisplay) {
        gameListContainer.innerHTML = '';
        if (gamesToDisplay.length === 0) {
            gameListContainer.innerHTML = '<p>No se encontraron juegos.</p>';
            return;
        }

        gamesToDisplay.forEach(game => {
            const gameCard = document.createElement('div');
            gameCard.classList.add('game-card');
            
            let controlsText = '';
            for (const action in game.controls) {
                if (game.controls[action].includes("Mouse")) {
                    controlsText += `<p><strong>${action}:</strong> ${game.controls[action]}</p>`;
                }
            }

            gameCard.innerHTML = `
                <h2>${game.title}</h2>
                <p><strong>Desarrollador:</strong> ${game.developer}</p>
                <p><strong>Notas:</strong> ${game.notes}</p>
                <div class="mouse-controls">
                    <h3>Controles del Ratón:</h3>
                    ${controlsText.length > 0 ? controlsText : "<p>No especificados.</p>"}
                </div>
                <h3>Disposición de Teclado:</h3>
                ${getKeyboardHtml()}
            `;

            // Ahora, ilumina las teclas correspondientes DENTRO de la tarjeta que acabamos de crear.
            const boundKeys = Object.values(game.controls);
            boundKeys.forEach(keyName => {
                // Buscamos la tecla solo dentro del contexto de la tarjeta actual.
                const keyElement = gameCard.querySelector(`.key[data-key="${keyName}"]`);
                if (keyElement) {
                    keyElement.classList.add('key-bound');
                }
            });
            
            gameListContainer.appendChild(gameCard);
        });
    }

    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredGames = games.filter(g => 
            g.title.toLowerCase().includes(searchTerm) || 
            g.developer.toLowerCase().includes(searchTerm)
        );
        displayGames(filteredGames);
    });

    displayGames(games);
});