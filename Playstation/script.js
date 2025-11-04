// Invocación de los Componentes Estructurales
const controllerContainer = document.getElementById('ps-controller'); // CAMBIADO
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

let mappedKeys = new Map();

// --- LÓGICA DE MAPEO ---

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
    
    // Aplicar color semitransparente a la superposición
    keyElement.style.backgroundColor = hexToRgba(defaultColor, 0.6);
    keyElement.style.color = '#000000';
    keyElement.style.boxShadow = 'none';
}

function removeKeyFromLegend(keyId) {
    const mapping = mappedKeys.get(keyId);
    if (!mapping) return;
    mapping.keyElement.style.backgroundColor = 'rgba(255, 0, 0, 0.0)'; // Volver a transparente
    mapping.keyElement.style.color = '';
    mapping.keyElement.style.boxShadow = '';
    mapping.legendItem.remove();
    mappedKeys.delete(keyId);
}

// Función Auxiliar para convertir Hex a Rgba
function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// --- CÁNTICOS DE ATENCIÓN ---

controllerContainer.addEventListener('click', (event) => {
    const keyElement = event.target.closest('.mappable');
    if (keyElement) {
        const keyId = keyElement.dataset.keyId;
        if (keyId) {
            if (mappedKeys.has(keyId)) {
                removeKeyFromLegend(keyId);
            } else {
                addKeyToLegend(keyId, keyElement);
            }
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
            mapping.keyElement.style.backgroundColor = hexToRgba(color, 0.6);
        }
    }
});

legendContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
        const keyId = event.target.closest('.legend-item').dataset.keyId;
        removeKeyFromLegend(keyId);
    }
});


// --- RITO DE EXPORTACIÓN ESQUEMÁTICA (NUEVA ORDEN) ---
async function performSchematicExport(format = 'png') {
    if (mappedKeys.size === 0) {
        alert("No hay botones mapeados para generar un diagrama.");
        return;
    }

    const controllerElement = document.querySelector('#ps-controller'); // CAMBIADO
    if (!controllerElement) {
        console.error("Error: No se pudo encontrar el elemento '#ps-controller'");
        alert("Error de exportación: Elemento del controlador no encontrado.");
        return;
    }

    try {
        const controllerCanvas = await html2canvas(controllerElement, { 
            scale: 2, 
            backgroundColor: null, // Capturar con transparencia
            useCORS: true 
        });

        const padding = 50;
        const legendSectionWidth = 500;
        const legendItemHeight = 35;
        const categorySpacing = 40;
        const textPadding = 10;
        
        const finalCanvas = document.createElement('canvas');
        const ctx = finalCanvas.getContext('2d');

        const controllerDrawX = padding;
        const controllerDrawY = padding;

        let legendHeight = 0;
        const categorizedKeys = {};
        for (const tagName in tagColors) { categorizedKeys[tagName] = []; }
        mappedKeys.forEach(mapping => {
            const tag = mapping.legendItem.querySelector('.tag-selector').value;
            if (categorizedKeys[tag]) { categorizedKeys[tag].push(mapping); }
        });

        for (const tagName in categorizedKeys) {
            if (categorizedKeys[tagName].length > 0) {
                legendHeight += legendItemHeight;
                legendHeight += legendItemHeight * categorizedKeys[tagName].length;
                legendHeight += categorySpacing;
            }
        }
        legendHeight = Math.max(legendHeight, 100);

        finalCanvas.width = controllerCanvas.width + legendSectionWidth + (3 * padding);
        finalCanvas.height = Math.max(controllerCanvas.height + (2 * padding), legendHeight + padding);

        if (format !== 'png') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
        }
        
        ctx.drawImage(controllerCanvas, controllerDrawX, controllerDrawY);

        const legendDrawX = controllerDrawX + controllerCanvas.width + padding;
        let currentLegendY = padding;

        ctx.textBaseline = 'middle';

        for (const tagName in categorizedKeys) {
            if (categorizedKeys[tagName].length > 0) {
                ctx.font = 'bold 22px monospace';
                const categoryColor = tagColors[tagName];
                
                ctx.fillStyle = categoryColor;
                ctx.fillRect(legendDrawX, currentLegendY, legendSectionWidth, legendItemHeight);
                ctx.strokeStyle = '#000000';
                ctx.strokeRect(legendDrawX, currentLegendY, legendSectionWidth, legendItemHeight);
                
                ctx.fillStyle = '#000000';
                ctx.fillText(tagName, legendDrawX + textPadding, currentLegendY + legendItemHeight / 2, legendSectionWidth - textPadding * 2);
                currentLegendY += legendItemHeight + (textPadding / 2);

                ctx.font = 'bold 20px monospace';
                categorizedKeys[tagName].forEach(mapping => {
                    const keyId = mapping.keyElement.dataset.keyId;
                    const description = mapping.legendItem.querySelector('.description-input').value || 'Sin descripción';
                    const displayText = `${keyId}: ${description}`;
                    
                    ctx.fillStyle = '#000000';
                    ctx.fillText(displayText, legendDrawX + textPadding, currentLegendY + legendItemHeight / 2, legendSectionWidth - textPadding * 2);
                    currentLegendY += legendItemHeight;
                });
                currentLegendY += categorySpacing;
            }
        }
        
        const { jsPDF } = window.jspdf;

        if (format === 'pdf') {
            const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [finalCanvas.width, finalCanvas.height] });
            pdf.addImage(finalCanvas.toDataURL('image/jpeg'), 'JPEG', 0, 0, finalCanvas.width, finalCanvas.height);
            pdf.save('ps-schematic.pdf'); // CAMBIADO
        } else {
            const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
            const link = document.createElement('a');
            link.href = finalCanvas.toDataURL(mimeType, format === 'jpeg' ? 0.9 : undefined);
            link.download = `ps-schematic.${format}`; // CAMBIADO
            link.click();
        }
    } catch (error) {
        console.error("Error durante la exportación esquemática:", error);
        alert(`Un error ocurrió durante la exportación: ${error.message}. Revisa la consola.`);
    }
}

// --- CÁNTICOS DE ATENCIÓN PARA EXPORTACIÓN ---
exportPngBtn.addEventListener('click', () => performSchematicExport('png'));
exportJpgBtn.addEventListener('click', () => performSchematicExport('jpeg'));
exportPdfBtn.addEventListener('click', () => performSchematicExport('pdf'));