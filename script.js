document.addEventListener('DOMContentLoaded', () => {

    const games = [
        {
            "id": 1,
            "title": "Half-Life 2",
            "developer": "Valve Corporation",
            "controls": {
                "Move Forward": "W", "Move Back": "S", "Strafe Left": "A", "Strafe Right": "D",
                "Jump": "Space", "Crouch": "Ctrl", "Primary Fire": "Mouse 1", "Secondary Fire": "Mouse 2",
                "Use / Interact": "E", "Reload": "R", "Flashlight": "F", "Sprint": "Shift", "Gravity Gun": "G"
            }
        }
    ];

    const gameListContainer = document.getElementById('gameList');
    const searchInput = document.getElementById('searchInput');

    /**
     * Genera el HTML para el diagrama del ratón.
     */
    function getMouseHtml() {
        return `
            <div class="mouse-display">
                <div class="mouse-body">
                    <div class="mouse-button left" data-key="Mouse 1"></div>
                    <div class="mouse-wheel" data-key="Mouse 3"></div>
                    <div class="mouse-button right" data-key="Mouse 2"></div>
                </div>
                <p>Ratón</p>
            </div>
        `;
    }

    /**
     * Genera el HTML para una representación completa del teclado.
     */
    function getKeyboardHtml() {
        // Matriz que define la disposición y clases de cada tecla
        const layout = [
            ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", {key: "Backspace", class: "key-2x"}],
            [{key: "Tab", class: "key-1-5x"}, "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", {key: "\\", class: "key-1-5x"}],
            [{key: "Caps Lock", class: "key-2x"}, "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", {key: "Enter", class: "key-2x"}],
            [{key: "Shift", class: "key-2-5x"}, "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", {key: "Shift", class: "key-2-5x", id: "RShift"}],
            [{key: "Ctrl", class: "key-1-5x"}, {key: "Alt", class: "key-1-5x"}, {key: "Space", class: "key-space"}, {key: "Alt", class: "key-1-5x"}, {key: "Ctrl", class: "key-1-5x"}]
        ];

        let html = '<div class="keyboard-display">';
        layout.forEach(row => {
            html += '<div class="keyboard-row">';
            row.forEach(item => {
                if (typeof item === 'object') {
                    // ID único para la segunda tecla Shift para diferenciarla, aunque ambas respondan a "Shift"
                    const dataKey = item.id ? item.key : item.key;
                    html += `<div class="key ${item.class}" data-key="${dataKey}">${item.key}</div>`;
                } else {
                    html += `<div class="key" data-key="${item}">${item}</div>`;
                }
            });
            html += '</div>';
        });
        html += '</div>';
        return html;
    }
    
    function displayGames(gamesToDisplay) {
        gameListContainer.innerHTML = '';
        if (gamesToDisplay.length === 0) { return; }

        gamesToDisplay.forEach(game => {
            const gameCard = document.createElement('div');
            gameCard.classList.add('game-card');
            
            gameCard.innerHTML = `
                <h2>${game.title}</h2>
                <p><strong>Desarrollador:</strong> ${game.developer}</p>
                <div class="controls-container">
                    ${getMouseHtml()}
                    ${getKeyboardHtml()}
                </div>
            `;
            
            // Lógica unificada para iluminar controles (ratón y teclado)
            const boundControls = Object.values(game.controls);
            boundControls.forEach(controlName => {
                // querySelectorAll para iluminar ambas teclas Shift/Ctrl si están asignadas
                const controlElements = gameCard.querySelectorAll(`[data-key="${controlName}"]`);
                controlElements.forEach(el => {
                    if(el.classList.contains('mouse-button')) {
                        el.classList.add('mouse-bound');
                    } else {
                        el.classList.add('key-bound');
                    }
                });
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