// Invocación de los Componentes Estructurales
const controllerContainer = document.querySelector('.main-container'); // Listen on a parent containing all mappables
const legendContainer = document.getElementById('legend');
const exportPngBtn = document.getElementById('export-png-btn');
const exportJpgBtn = document.getElementById('export-jpg-btn');
const exportPdfBtn = document.getElementById('export-pdf-btn');

// Data-Codex de Etiquetas y Colores (reutilizado)
const tagColors = {
    'Actions': '#FC9C93',
    'Target': '#f1c54cff',
    'Movement': '#7CC690',
    'Game Menus': '#E4A0DB'
};

let mappedKeys = new Map();

// --- LÓGICA DE MAPEO (Reutilizada y Adaptada del Teclado) ---

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
    // Apply semi-transparent color to the overlay
    keyElement.style.backgroundColor = hexToRgba(defaultColor, 0.6); // Use 60% opacity
    // Ensure text color contrasts if needed (though text is hidden)
    keyElement.style.color = '#000000';
    // Remove conflicting box-shadow if present from base mappable style
    keyElement.style.boxShadow = 'none';
}

function removeKeyFromLegend(keyId) {
    const mapping = mappedKeys.get(keyId);
    if (!mapping) return;

    // Reset styles by clearing the inline properties
    mapping.keyElement.style.backgroundColor = ''; // Crucial: Set to empty string
    mapping.keyElement.style.color = '';
    mapping.keyElement.style.boxShadow = ''; // Also reset any other inline styles applied

    // Remove from legend and map
    mapping.legendItem.remove();
    mappedKeys.delete(keyId);
}

// Helper function to convert hex color to rgba
function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}


// --- CÁNTICOS DE ATENCIÓN (Adaptados para el Controlador) ---

// Listen on the main container to catch clicks on all mappable elements
controllerContainer.addEventListener('click', (event) => {
    const keyElement = event.target.closest('.mappable');
    if (keyElement) {
        // Check if the click is within the controller div or dpad/fbuttons if they exist
        const controllerDiv = document.getElementById('xbox-controller');
        const dpadDiv = document.getElementById('dpad');
        const fbuttonsDiv = document.getElementById('fbuttons');

        // Ensure the element belongs to one of the interactive areas
        if (controllerDiv?.contains(keyElement) || dpadDiv?.contains(keyElement) || fbuttonsDiv?.contains(keyElement)) {
            const keyId = keyElement.dataset.keyId;
            if (keyId) { // Ensure keyId exists
                 if (mappedKeys.has(keyId)) {
                     removeKeyFromLegend(keyId);
                 } else {
                     addKeyToLegend(keyId, keyElement);
                 }
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
            // Apply semi-transparent color
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


// --- RITO DE EXPORTACIÓN ESQUEMÁTICA (NUEVA ORDEN - VERIFICADO) ---
async function performSchematicExport(format = 'png') {
    if (mappedKeys.size === 0) {
        alert("No hay botones mapeados para generar un diagrama.");
        return;
    }

    // Target the specific controller element for capture
    const controllerElement = document.querySelector('#xbox-controller');
    if (!controllerElement) {
        console.error("Error: Could not find controller element '#xbox-controller'");
        alert("Error during export: Controller element not found.");
        return;
    }

    // Include Dpad and Fbuttons if they exist outside controller div for capture
    const dpadElement = document.getElementById('dpad');
    const fbuttonsElement = document.getElementById('fbuttons');

    // Create a temporary container to hold all elements for capture
    const captureContainer = document.createElement('div');
    captureContainer.style.position = 'relative'; // Or absolute, depending on layout needs
    captureContainer.style.width = controllerElement.offsetWidth + 'px'; // Match controller size
    captureContainer.style.height = controllerElement.offsetHeight + 'px';

    // Clone controller and append
    const controllerClone = controllerElement.cloneNode(true);
    captureContainer.appendChild(controllerClone);

    // Clone and absolutely position dpad/fbuttons relative to container if they exist
    if (dpadElement) {
        const dpadClone = dpadElement.cloneNode(true);
        dpadClone.style.position = 'absolute';
        dpadClone.style.top = dpadElement.offsetTop + 'px';
        dpadClone.style.left = dpadElement.offsetLeft + 'px';
        captureContainer.appendChild(dpadClone);
    }
    if (fbuttonsElement) {
        const fbuttonsClone = fbuttonsElement.cloneNode(true);
        fbuttonsClone.style.position = 'absolute';
        fbuttonsClone.style.top = fbuttonsElement.offsetTop + 'px';
        fbuttonsClone.style.left = fbuttonsElement.offsetLeft + 'px'; // Or right, adjust as needed
        captureContainer.appendChild(fbuttonsClone);
    }

     // Append to body temporarily for rendering, but keep off-screen
     captureContainer.style.position = 'absolute';
     captureContainer.style.left = '-9999px';
     captureContainer.style.top = '0';
     document.body.appendChild(captureContainer);


    try {
        // Capture the combined container
        const controllerCanvas = await html2canvas(captureContainer, { // Capture the container
             scale: 2,
             backgroundColor: null,
             useCORS: true
             });

        // --- Rest of the function remains the same ---
        const padding = 50;
        const legendSectionWidth = 500;
        const legendItemHeight = 35; // Adjusted for new font
        const categorySpacing = 40;
        const textPadding = 10;

        const finalCanvas = document.createElement('canvas');
        const ctx = finalCanvas.getContext('2d');

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

        const controllerDrawX = padding;
        const controllerDrawY = padding;
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
            pdf.save('controller-schematic.pdf');
        } else {
            const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
            const link = document.createElement('a');
            link.href = finalCanvas.toDataURL(mimeType, format === 'jpeg' ? 0.9 : undefined);
            link.download = `controller-schematic.${format}`;
            link.click();
        }
    } catch (error) {
        console.error("Error during schematic export:", error);
        alert(`An error occurred during export: ${error.message}. Check the console for details.`);
    } finally {
         // Clean up the temporary container
         document.body.removeChild(captureContainer);
    }
}


// --- CÁNTICOS DE ATENCIÓN PARA EXPORTACIÓN ---
exportPngBtn.addEventListener('click', () => performSchematicExport('png'));
exportJpgBtn.addEventListener('click', () => performSchematicExport('jpeg'));
exportPdfBtn.addEventListener('click', () => performSchematicExport('pdf'));