document.addEventListener('DOMContentLoaded', () => {

    const games = [
        {
            "id": 1,
            "title": "Half-Life 2",
            "developer": "Valve Corporation",
            // Estructura de datos restaurada al original
            "controls": {
                "Move Forward": "W", "Move Back": "S", "Strafe Left": "A", "Strafe Right": "D",
                "Jump": "Space", "Crouch": "LCtrl", "Primary Fire": "Mouse 1", "Secondary Fire": "Mouse 2",
                "Use / Interact": "E", "Reload": "R", "Flashlight": "F", "Sprint": "LShift", "Gravity Gun": "G",
                "Quick Save": "F5", "Quick Load": "F9"
            }
        }
    ];

    const gameListContainer = document.getElementById('gameList');

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
     * Genera el HTML para una representación de teclado 100%
     */
    function getKeyboardHtml() {
        const main = [
            ["Esc", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"],
            ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", {key: "Backspace", class: "key-long"}],
            [{key: "Tab", class: "key-tab"}, "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", {key: "\\", class: "key-tab"}],
            [{key: "Caps Lock", class: "key-caps"}, "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", {key: "Enter", class: "key-enter"}],
            [{key: "LShift", class: "key-shift"}, "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", {key: "RShift", class: "key-shift"}],
            [{key: "LCtrl", class: "key-bottom"}, "LSuper", "LAlt", {key: "Space", class: "key-space"}, "RAlt", "RSuper", "Menu", {key: "RCtrl", class: "key-bottom"}]
        ];
        const nav = [
            ["PrtScr", "ScrLk", "Pause"],
            ["Insert", "Home", "Page Up"],
            ["Delete", "End", "Page Dn"]
        ];
        const arrows = [
            [{key: "Up", id: "Up"}],
            ["Left", "Down", "Right"]
        ];

        const buildBlock = (block) => block.map(row => 
            `<div class="keyboard-row">${row.map(item => {
                const key = typeof item === 'object' ? item.key : item;
                const cls = typeof item === 'object' ? item.class : '';
                return `<div class="key ${cls}" data-key="${key}">${key}</div>`;
            }).join('')}</div>`
        ).join('');
        
        return `
            <div class="keyboard-display">
                <div class="keyboard-main-block">${buildBlock(main)}</div>
                <div class="keyboard-nav-numpad-block">
                    <div class="keyboard-nav-block">${buildBlock(nav)}</div>
                    <div style="height: 20px;"></div>
                    <div class="keyboard-arrows-block">
                         <div class="keyboard-row" style="justify-content: center;">
                            <div class="key" data-key="Up">Up</div>
                        </div>
                        <div class="keyboard-row">
                            <div class="key" data-key="Left">Left</div>
                            <div class="key" data-key="Down">Down</div>
                            <div class="key" data-key="Right">Right</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function displayGames(gamesToDisplay) {
        gameListContainer.innerHTML = '';
        if (gamesToDisplay.length === 0) { return; }

        gamesToDisplay.forEach(game => {
            const gameCard = document.createElement('div');
            gameCard.classList.add('game-card');
            
            gameCard.innerHTML = `
                <h2>${game.title}</h2>
                <div class="controls-container">
                    ${getKeyboardHtml()}
                    ${getMouseHtml()}
                </div>
            `;
            
            // Lógica de resaltado restaurada a la original
            const boundControls = Object.values(game.controls);
            boundControls.forEach(controlName => {
                const elements = gameCard.querySelectorAll(`[data-key="${controlName}"]`);
                elements.forEach(el => {
                    const className = el.classList.contains('mouse-button') ? 'mouse-bound' : 'key-bound';
                    el.classList.add(className);
                });
            });
            
            gameListContainer.appendChild(gameCard);
        });
    }

    // El buscador no necesita cambios, se omite por brevedad pero debe permanecer en tu código
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (event) => {
        // ... Lógica de búsqueda sin cambios ...
    });

    displayGames(games);
});