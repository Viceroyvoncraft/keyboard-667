// Invocación de los Componentes Estructurales
const keyboardContainer = document.getElementById('keyboard');
const legendContainer = document.getElementById('legend');
const exportPngBtn = document.getElementById('export-png-btn');
const exportJpgBtn = document.getElementById('export-jpg-btn');
const exportPdfBtn = document.getElementById('export-pdf-btn');

// Data-Codex de Etiquetas y Colores
const tagColors = {
    'Actions': '#FC9C93',
    'Target': '#f1c54cff',
    'Movement': '#7CC690',
    'Game Menus': '#E4A0DB'
};

// Data-Codex de la Disposición Sagrada
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
    [{ text: 'LShift', u: 2.25 }, { text: 'Z', u: 1 }, { text: 'X', u: 1 }, { text: 'C', u: 1 }, { text: 'V', u: 1 }, { text: 'B', u: 1 }, { text: 'N', u: 1 }, { text: 'M', u: 1 }, { text: ',', sub: '<', u: 1 }, { text: '.', sub: '>', u: 1 }, { text: '/', sub: '?', u: 1 }, { text: 'RShift', u: 2.75 }, { u: 1.35 }, { text: '↑', u: 1 },{ u: 1.25 }],
    // Fila 6: Modificadores
    [{ text: 'LCtrl', u: 1.25 }, { text: 'Win', u: 1.25 }, { text: 'Alt', u: 1.25 }, { text: 'Space', u: 6.25 }, { text: 'Alt Gr', u: 1.25 }, { text: 'Win', u: 1.25 }, { text: 'Menu', u: 1.25 }, { text: 'RCtrl', u: 1.25 }, { u: 0.25 }, { text: '←', u: 1 }, { text: '↓', u: 1 }, { text: '→', u: 1 }]
];

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

    const topRow = document.createElement('div');
    topRow.style.display = 'flex';
    topRow.style.width = '100%';
    topRow.style.alignItems = 'center';

    const keyNameSpan = document.createElement('span');
    keyNameSpan.classList.add('legend-key-name');
    keyNameSpan.textContent = keyId;

    const tagSelector = document.createElement('select');
    tagSelector.classList.add('tag-selector');
    for (const tagName in tagColors) {
        const option = document.createElement('option');
        option.value = tagName;
        option.textContent = tagName;
        tagSelector.appendChild(option);
    }

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-btn');
    deleteButton.textContent = 'X';

    topRow.appendChild(keyNameSpan);
    topRow.appendChild(tagSelector);
    topRow.appendChild(deleteButton);

    const descriptionInput = document.createElement('input');
    descriptionInput.type = 'text';
    descriptionInput.classList.add('description-input');
    descriptionInput.placeholder = 'Añade una descripción...';

    legendItem.appendChild(topRow);
    legendItem.appendChild(descriptionInput);
    
    legendContainer.appendChild(legendItem);
    mappedKeys.set(keyId, { keyElement, legendItem });

    const defaultTag = Object.keys(tagColors)[0];
    const defaultColor = tagColors[defaultTag];
    
    keyElement.style.backgroundColor = defaultColor;
    keyElement.style.color = '#000000';
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

legendContainer.addEventListener('change', (event) => {
    if (event.target.classList.contains('tag-selector')) {
        const selectedTag = event.target.value;
        const color = tagColors[selectedTag];
        const keyId = event.target.closest('.legend-item').dataset.keyId;
        const mapping = mappedKeys.get(keyId);
        if (mapping) {
            mapping.keyElement.style.backgroundColor = color;
            mapping.keyElement.style.color = '#000000';
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


// --- RITO DE EXPORTACIÓN ESQUEMÁTICA (VERSIÓN FINAL Y ABSOLUTA) ---
async function performSchematicExport(format = 'png') {
    if (mappedKeys.size === 0) {
        alert("No hay teclas mapeadas para generar un diagrama.");
        return;
    }

    const keyboardElement = document.querySelector('#keyboard');
    keyboardElement.style.backgroundColor = '#d6d6d6';
    const keyboardCanvas = await html2canvas(keyboardElement, { scale: 2, backgroundColor: null });
    keyboardElement.style.backgroundColor = '';

    const padding = 50;
    const legendSectionWidth = 500;
    const legendItemHeight = 35; // Aumentado para la nueva fuente
    const categorySpacing = 40;
    const textPadding = 10;
    
    const finalCanvas = document.createElement('canvas');
    const ctx = finalCanvas.getContext('2d');

    const keyboardDrawX = padding;
    const keyboardDrawY = padding;

    // Clasificar y medir la altura necesaria de la leyenda
    let legendHeight = 0;
    const categorizedKeys = {};
    for (const tagName in tagColors) {
        categorizedKeys[tagName] = [];
    }
    mappedKeys.forEach(mapping => {
        const tag = mapping.legendItem.querySelector('.tag-selector').value;
        if (categorizedKeys[tag]) {
            categorizedKeys[tag].push(mapping);
        }
    });

    for (const tagName in categorizedKeys) {
        if (categorizedKeys[tagName].length > 0) {
            legendHeight += legendItemHeight; // Altura para el título de la categoría
            legendHeight += legendItemHeight * categorizedKeys[tagName].length; // Altura para los items
            legendHeight += categorySpacing; // Espacio después de la categoría
        }
    }

    finalCanvas.width = keyboardCanvas.width + legendSectionWidth + (3 * padding);
    finalCanvas.height = Math.max(keyboardCanvas.height, legendHeight) + (2 * padding);

    if (format !== 'png') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
    }
    
    ctx.drawImage(keyboardCanvas, keyboardDrawX, keyboardDrawY);

    const legendDrawX = keyboardDrawX + keyboardCanvas.width + padding;
    let currentLegendY = padding;

    ctx.textBaseline = 'middle';

    for (const tagName in categorizedKeys) {
        if (categorizedKeys[tagName].length > 0) {
            ctx.font = 'bold 22px monospace';
            const categoryColor = tagColors[tagName];
            
            // Dibujar recuadro de título de categoría
            ctx.fillStyle = categoryColor;
            ctx.fillRect(legendDrawX, currentLegendY, legendSectionWidth - padding, legendItemHeight);
            ctx.strokeStyle = '#000000';
            ctx.strokeRect(legendDrawX, currentLegendY, legendSectionWidth - padding, legendItemHeight);
            
            // Dibujar texto de título
            ctx.fillStyle = '#000000';
            ctx.fillText(tagName, legendDrawX + textPadding, currentLegendY + legendItemHeight / 2, legendSectionWidth - padding - textPadding * 2);
            currentLegendY += legendItemHeight + (textPadding / 2);

            // --- CAMBIO FINAL: GLIFOS DE LEYENDA AUMENTADOS ---
            ctx.font = 'bold 20px monospace'; // Fuente más grande y en negrita
            categorizedKeys[tagName].forEach(mapping => {
                const keyId = mapping.keyElement.dataset.keyId;
                const description = mapping.legendItem.querySelector('.description-input').value || 'Sin descripción';
                const displayText = `${keyId}: ${description}`;
                
                ctx.fillStyle = '#000000';
                ctx.fillText(displayText, legendDrawX + textPadding, currentLegendY + legendItemHeight / 2, legendSectionWidth - padding - textPadding * 2);
                currentLegendY += legendItemHeight;
            });
            currentLegendY += categorySpacing;
        }
    }
    
    const { jsPDF } = window.jspdf;

    if (format === 'pdf') {
        const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [finalCanvas.width, finalCanvas.height] });
        pdf.addImage(finalCanvas.toDataURL('image/png'), 'PNG', 0, 0, finalCanvas.width, finalCanvas.height);
        pdf.save('keyboard-schematic.pdf');
    } else {
        const mimeType = format === 'jpeg' ? 'image/jpeg' : `image/${format}`;
        const link = document.createElement('a');
        link.href = finalCanvas.toDataURL(mimeType);
        link.download = `keyboard-schematic.${format}`;
        link.click();
    }
}

// --- CÁNTICOS DE ATENCIÓN PARA EXPORTACIÓN ---
exportPngBtn.addEventListener('click', () => performSchematicExport('png'));
exportJpgBtn.addEventListener('click', () => performSchematicExport('jpeg'));
exportPdfBtn.addEventListener('click', () => performSchematicExport('pdf'));

// --- RITO DE INICIACIÓN ---
renderKeyboard();