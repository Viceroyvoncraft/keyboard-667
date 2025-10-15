// Invocación de los Componentes Estructurales
const keyboardContainer = document.getElementById('keyboard');
const legendContainer = document.getElementById('legend');
const exportPngBtn = document.getElementById('export-png-btn');
const exportJpgBtn = document.getElementById('export-jpg-btn');
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
    // Fila 6: Modificadores
    [{ text: 'Ctrl', u: 1.25 }, { text: 'Win', u: 1.25 }, { text: 'Alt', u: 1.25 }, { text: 'Space', u: 6.25 }, { text: 'Alt', u: 1.25 }, { text: 'Win', u: 1.25 }, { text: 'Menu', u: 1.25 }, { text: 'Ctrl', u: 1.25 }, { u: 0.25 }, { text: '←', u: 1 }, { text: '↓', u: 1 }, { text: '→', u: 1 }]
];

// Cogitator para Rastrear Teclas Mapeadas
let mappedKeys = new Map();

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
    keyElement.style.color = '#FFFFFF';
    keyElement.style.boxShadow = 'none';
}

function removeKeyFromLegend(keyId) {
    const mapping = mappedKeys.get(keyId);
    if (!mapping) return;
    mapping.keyElement.style.backgroundColor = '';
    mapping.keyElement.style.color = '';
    mapping.keyElement.style.boxShadow = '';
    mapping.legendItem.remove();
    mappedKeys.delete(keyId);
}

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
            mapping.keyElement.style.color = '#FFFFFF';
            mapping.keyElement.style.boxShadow = 'none';
        }
    }
});

legendContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
        const keyId = event.target.closest('.legend-item').dataset.keyId;
        removeKeyFromLegend(keyId);
    }
});

// --- RITOS DE EXPORTACIÓN (VERSIÓN FINAL Y PURIFICADA) ---
async function performExport(format, quality = 1.0) {
    // 1. Clonar el contenedor principal que ya tiene todos los estilos y la estructura correcta.
    const elementToCapture = document.querySelector('.main-container').cloneNode(true);
    
    // 2. Crear un contenedor temporal para posicionar el clon fuera de la pantalla.
    const offscreenContainer = document.createElement('div');
    offscreenContainer.style.position = 'absolute';
    offscreenContainer.style.left = '-9999px';
    offscreenContainer.style.top = '0';
    
    // 3. Añadir el clon al contenedor temporal y luego al cuerpo del documento.
    offscreenContainer.appendChild(elementToCapture);
    document.body.appendChild(offscreenContainer);
    
    try {
        const canvas = await html2canvas(elementToCapture, {
            // Se usa el color de fondo del elemento clonado, que ahora está definido en el CSS.
            useCORS: true,
            scale: 2 // Escala para mayor resolución
        });

        if (format === 'pdf') {
            const imageData = canvas.toDataURL('image/png');
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
            pdf.addImage(imageData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save('keyboard-mapping.pdf');
        } else {
            const mimeType = `image/${format}`;
            const fileExtension = format;
            const link = document.createElement('a');
            link.href = canvas.toDataURL(mimeType, quality);
            link.download = `keyboard-mapping.${fileExtension}`;
            link.click();
        }
    } finally {
        // 4. Purgar el contenedor temporal y su clon, sin dejar rastro.
        document.body.removeChild(offscreenContainer);
    }
}

exportPngBtn.addEventListener('click', () => performExport('png'));
exportJpgBtn.addEventListener('click', () => performExport('jpeg', 0.9));
exportPdfBtn.addEventListener('click', () => performExport('pdf'));

// --- RITO DE INICIACIÓN ---
renderKeyboard();