// Invocación de los Componentes Estructurales
const keyboardContainer = document.getElementById('keyboard');
const legendContainer = document.getElementById('legend');
const contentToExport = document.querySelector('.main-container');
const exportPngBtn = document.getElementById('export-png-btn');
const exportPdfBtn = document.getElementById('export-pdf-btn');

// Data-Codex de la Disposición Consagrada (Versión Definitiva)
const keyboardLayout = [
    // Fila 1: Funciones
    [{ text: 'Esc', u: 1 }, { u: 1 }, { text: 'F1', u: 1 }, { text: 'F2', u: 1 }, { text: 'F3', u: 1 }, { text: 'F4', u: 1 }, { u: 0.5 }, { text: 'F5', u: 1 }, { text: 'F6', u: 1 }, { text: 'F7', u: 1 }, { text: 'F8', u: 1 }, { u: 0.5 }, { text: 'F9', u: 1 }, { text: 'F10', u: 1 }, { text: 'F11', u: 1 }, { text: 'F12', u: 1 }, { u: 0.25 }, { text: 'PrtSc', u: 1 }, { text: 'Scroll Lock', u: 1 }, { text: 'Pause Break', u: 1 }],
    // Fila 2: Números
    [{ text: '`', sub: '~', u: 1 }, { text: '1', sub: '!', u: 1 }, { text: '2', sub: '@', u: 1 }, { text: '3', sub: '#', u: 1 }, { text: '4', sub: '$', u: 1 }, { text: '5', sub: '%', u: 1 }, { text: '6', sub: '^', u: 1 }, { text: '7', sub: '&', u: 1 }, { text: '8', sub: '*', u: 1 }, { text: '9', sub: '(', u: 1 }, { text: '0', sub: ')', u: 1 }, { text: '-', sub: '_', u: 1 }, { text: '=', sub: '+', u: 1 }, { text: 'Backspace', u: 2 }, { u: 0.25 }, { text: 'Insert', u: 1 }, { text: 'Home', u: 1 }, { text: 'PgUp', u: 1 }],
    // Fila 3: QWERTY
    [{ text: 'Tab', u: 1.5 }, { text: 'Q', u: 1 }, { text: 'W', u: 1 }, { text: 'E', u: 1 }, { text: 'R', u: 1 }, { text: 'T', u: 1 }, { text: 'Y', u: 1 }, { text: 'U', u: 1 }, { text: 'I', u: 1 }, { text: 'O', u: 1 }, { text: 'P', u: 1 }, { text: '[', sub: '{', u: 1 }, { text: ']', sub: '}', u: 1 }, { text: '\\', sub: '|', u: 1.5 }, { u: 0.25 }, { text: 'Delete', u: 1 }, { text: 'End', u: 1 }, { text: 'PgDn', u: 1 }],
    // Fila 4: ASDF (Home Row)
    [{ text: 'Caps Lock', u: 1.75 }, { text: 'A', u: 1 }, { text: 'S', u: 1 }, { text: 'D', u: 1 }, { text: 'F', u: 1 }, { text: 'G', u: 1 }, { text: 'H', u: 1 }, { text: 'J', u: 1 }, { text: 'K', u: 1 }, { text: 'L', u: 1 }, { text: ';', sub: ':', u: 1 }, { text: "'", sub: '"', u: 1 }, { text: 'Enter', u: 2.25 },{ u: 3 }],
    // Fila 5: ZXCV (Bottom Alpha Row)
    [{ text: 'Shift', u: 2.25 }, { text: 'Z', u: 1 }, { text: 'X', u: 1 }, { text: 'C', u: 1 }, { text: 'V', u: 1 }, { text: 'B', u: 1 }, { text: 'N', u: 1 }, { text: 'M', u: 1 }, { text: ',', sub: '<', u: 1 }, { text: '.', sub: '>', u: 1 }, { text: '/', sub: '?', u: 1 }, { text: 'Shift', u: 2.75 }, { u: 1.35 }, { text: '↑', u: 1 },{ u: 1.25 }],
    
    // ==================================================================
    // === FILAS INFERIORES CORREGIDAS PARA ALINEACIÓN PERFECTA ===
    // ==================================================================
    
    
// Fila 6: Modificadores
    [{ text: 'Ctrl', u: 1.25 }, { text: 'Win', u: 1.25 }, { text: 'Alt', u: 1.25 }, { text: 'Space', u: 6.25 }, { text: 'Alt', u: 1.25 }, { text: 'Win', u: 1.25 }, { text: 'Menu', u: 1.25 }, { text: 'Ctrl', u: 1.25 }, { u: 0.25 }, { text: '←', u: 1 }, { text: '↓', u: 1 }, { text: '→', u: 1 }]
];

// Cogitator para Rastrear Teclas Mapeadas
let mappedKeys = new Map();

/**
 * Rito de Forjado del Teclado.
 */
function renderKeyboard() {
    keyboardContainer.innerHTML = '';
    keyboardLayout.forEach(row => {
        row.forEach(keyData => {
            const element = document.createElement('div');
            const columnSpan = Math.round(keyData.u * 4);
            element.style.gridColumn = `span ${columnSpan}`;
            if (keyData.text) {
                element.classList.add('key');
                element.dataset.keyId = keyData.text;
                const mainText = document.createElement('span');
                mainText.textContent = keyData.text;
                element.appendChild(mainText);
                if (keyData.sub) {
                    const subText = document.createElement('span');
                    subText.classList.add('key-sub-text');
                    subText.textContent = keyData.sub;
                    element.appendChild(subText);
                }
            } else {
                element.classList.add('key-spacer');
            }
            keyboardContainer.appendChild(element);
        });
    });
}

/**
 * Litania de Adición a la Leyenda.
 */
function addKeyToLegend(keyId, keyElement) {
    const legendItem = document.createElement('div');
    legendItem.classList.add('legend-item');
    legendItem.dataset.keyId = keyId;
    legendItem.innerHTML = `
        <span class="legend-key-name">${keyId}</span>
        <input type="color" class="legend-color-picker" value="#ff8c00">
        <button class="delete-btn">X</button>
    `;
    legendContainer.appendChild(legendItem);
    mappedKeys.set(keyId, { keyElement, legendItem });
    const colorPicker = legendItem.querySelector('.legend-color-picker');
    keyElement.style.backgroundColor = colorPicker.value;
}

/**
 * Rito de Eliminación de la Leyenda.
 */
function removeKeyFromLegend(keyId) {
    const mapping = mappedKeys.get(keyId);
    if (!mapping) return;
    mapping.keyElement.style.backgroundColor = '';
    mapping.legendItem.remove();
    mappedKeys.delete(keyId);
}

// --- CÁNTICOS DE ATENCIÓN (Event Listeners) ---
keyboardContainer.addEventListener('click', (event) => {
    const keyElement = event.target.closest('.key');
    if (keyElement) {
        const keyId = keyElement.dataset.keyId;
        if (mappedKeys.has(keyId)) {
            removeKeyFromLegend(keyId);
        } else {
            addKeyToLegend(keyId, keyElement);
        }
    }
});

legendContainer.addEventListener('input', (event) => {
    if (event.target.classList.contains('legend-color-picker')) {
        const color = event.target.value;
        const keyId = event.target.closest('.legend-item').dataset.keyId;
        const mapping = mappedKeys.get(keyId);
        if (mapping) {
            mapping.keyElement.style.backgroundColor = color;
        }
    }
});

legendContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
        const keyId = event.target.closest('.legend-item').dataset.keyId;
        removeKeyFromLegend(keyId);
    }
});

// --- RITOS DE EXPORTACIÓN ---
function exportAsPNG() {
    html2canvas(contentToExport).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'keyboard-mapping.png';
        link.click();
    });
}

function exportAsPDF() {
    const { jsPDF } = window.jspdf;
    html2canvas(contentToExport).then(canvas => {
        const imageData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });
        pdf.addImage(imageData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('keyboard-mapping.pdf');
    });
}

exportPngBtn.addEventListener('click', exportAsPNG);
exportPdfBtn.addEventListener('click', exportAsPDF);

// --- RITO DE INICIACIÓN ---
renderKeyboard();