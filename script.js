// DOM Element Hooks
const keyboardContainer = document.getElementById('keyboard');
const legendContainer = document.getElementById('legend');
const exportPngBtn = document.getElementById('export-png-btn');
const exportJpgBtn = document.getElementById('export-jpg-btn');
const exportPdfBtn = document.getElementById('export-pdf-btn');

// Data Codex for Tags and Colors
const tagColors = {
    'Actions': '#FC9C93',
    'Target': '#f1c54cff',
    'Movement': '#7CC690',
    'Game Menus': '#E4A0DB'
};

// Keyboard Layout Definition
const keyboardLayout = [
    // Row 1: Function Keys
    [{ text: 'Esc', u: 1 }, { u: 1 }, { text: 'F1', u: 1 }, { text: 'F2', u: 1 }, { text: 'F3', u: 1 }, { text: 'F4', u: 1 }, { u: 0.5 }, { text: 'F5', u: 1 }, { text: 'F6', u: 1 }, { text: 'F7', u: 1 }, { text: 'F8', u: 1 }, { u: 0.5 }, { text: 'F9', u: 1 }, { text: 'F10', u: 1 }, { text: 'F11', u: 1 }, { text: 'F12', u: 1 }, { u: 0.25 }, { text: 'PrtSc', u: 1 }, { text: 'Scroll Lock', u: 1 }, { text: 'Pause Break', u: 1 }],
    // Row 2: Number Row
    [{ text: '`', sub: '~', u: 1 }, { text: '1', sub: '!', u: 1 }, { text: '2', sub: '@', u: 1 }, { text: '3', sub: '#', u: 1 }, { text: '4', sub: '$', u: 1 }, { text: '5', sub: '%', u: 1 }, { text: '6', sub: '^', u: 1 }, { text: '7', sub: '&', u: 1 }, { text: '8', sub: '*', u: 1 }, { text: '9', sub: '(', u: 1 }, { text: '0', sub: ')', u: 1 }, { text: '-', sub: '_', u: 1 }, { text: '=', sub: '+', u: 1 }, { text: 'Backspace', u: 2 }, { u: 0.25 }, { text: 'Insert', u: 1 }, { text: 'Home', u: 1 }, { text: 'PgUp', u: 1 }],
    // Row 3: QWERTY
    [{ text: 'Tab', u: 1.5 }, { text: 'Q', u: 1 }, { text: 'W', u: 1 }, { text: 'E', u: 1 }, { text: 'R', u: 1 }, { text: 'T', u: 1 }, { text: 'Y', u: 1 }, { text: 'U', u: 1 }, { text: 'I', u: 1 }, { text: 'O', u: 1 }, { text: 'P', u: 1 }, { text: '[', sub: '{', u: 1 }, { text: ']', sub: '}', u: 1 }, { text: '\\', sub: '|', u: 1.5 }, { u: 0.25 }, { text: 'Delete', u: 1 }, { text: 'End', u: 1 }, { text: 'PgDn', u: 1 }],
    // Row 4: Home Row
    [{ text: 'Caps Lock', u: 1.75 }, { text: 'A', u: 1 }, { text: 'S', u: 1 }, { text: 'D', u: 1 }, { text: 'F', u: 1 }, { text: 'G', u: 1 }, { text: 'H', u: 1 }, { text: 'J', u: 1 }, { text: 'K', u: 1 }, { text: 'L', u: 1 }, { text: ';', sub: ':', u: 1 }, { text: "'", sub: '"', u: 1 }, { text: 'Enter', u: 2.25 },{ u: 3 }],
    // Row 5: Bottom Alpha Row
    [{ text: 'LShift', u: 2.25 }, { text: 'Z', u: 1 }, { text: 'X', u: 1 }, { text: 'C', u: 1 }, { text: 'V', u: 1 }, { text: 'B', u: 1 }, { text: 'N', u: 1 }, { text: 'M', u: 1 }, { text: ',', sub: '<', u: 1 }, { text: '.', sub: '>', u: 1 }, { text: '/', sub: '?', u: 1 }, { text: 'RShift', u: 2.75 }, { u: 1.35 }, { text: '↑', u: 1 },{ u: 1.25 }],
    // Row 6: Modifiers
    [{ text: 'LCtrl', u: 1.25 }, { text: 'Win', u: 1.25 }, { text: 'Alt', u: 1.25 }, { text: 'Space', u: 6.25 }, { text: 'Alt Gr', u: 1.25 }, { text: 'Win', u: 1.25 }, { text: 'Menu', u: 1.25 }, { text: 'RCtrl', u: 1.25 }, { u: 0.25 }, { text: '←', u: 1 }, { text: '↓', u: 1 }, { text: '→', u: 1 }]
];

// State management for mapped keys
let mappedKeys = new Map();

/**
 * Renders the keyboard layout to the DOM based on the keyboardLayout definition.
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
 * Adds a selected key to the legend for mapping.
 * @param {string} keyId - The unique identifier for the key.
 * @param {HTMLElement} keyElement - The DOM element of the key.
 */
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
    descriptionInput.placeholder = 'Add a description...';

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

/**
 * Removes a key from the legend and unmaps it.
 * @param {string} keyId - The unique identifier for the key to remove.
 */
function removeKeyFromLegend(keyId) {
    const mapping = mappedKeys.get(keyId);
    if (!mapping) return;
    mapping.keyElement.style.backgroundColor = '';
    mapping.keyElement.style.color = '';
    mapping.keyElement.style.boxShadow = '';
    mapping.legendItem.remove();
    mappedKeys.delete(keyId);
}

// --- EVENT LISTENERS ---

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


// --- SCHEMATIC EXPORT FUNCTIONALITY (Final Version) ---
async function performSchematicExport(format = 'png') {
    if (mappedKeys.size === 0) {
        alert("No keys are mapped to generate a diagram.");
        return;
    }

    const keyboardElement = document.querySelector('#keyboard');
    keyboardElement.style.backgroundColor = '#d6d6d6';
    const keyboardCanvas = await html2canvas(keyboardElement, { scale: 2, backgroundColor: null });
    keyboardElement.style.backgroundColor = '';

    const padding = 150;
    const columnWidth = 350;
    const rowHeight = 150;
    const lineHeight = 45;
    const textPadding = 10;
    const itemSpacing = 15;
    
    const finalCanvas = document.createElement('canvas');
    const ctx = finalCanvas.getContext('2d');

    const keyboardRect = keyboardElement.getBoundingClientRect();
    const keyboardCenterX = keyboardRect.left + keyboardRect.width / 2;
    const keyboardCenterY = keyboardRect.top + keyboardRect.height / 2;

    const leftKeys = [], rightKeys = [], topKeys = [], bottomKeys = [];
    mappedKeys.forEach(mapping => {
        const keyRect = mapping.keyElement.getBoundingClientRect();
        const keyCenterX = keyRect.left + keyRect.width / 2;
        const keyCenterY = keyRect.top + keyRect.height / 2;
        const deltaX = Math.abs(keyCenterX - keyboardCenterX) / keyboardRect.width;
        const deltaY = Math.abs(keyCenterY - keyboardCenterY) / keyboardRect.height;
        if (deltaY > deltaX) {
            if (keyCenterY < keyboardCenterY) topKeys.push(mapping);
            else bottomKeys.push(mapping);
        } else {
            if (keyCenterX < keyboardCenterX) leftKeys.push(mapping);
            else rightKeys.push(mapping);
        }
    });

    leftKeys.sort((a, b) => a.keyElement.getBoundingClientRect().top - b.keyElement.getBoundingClientRect().top);
    rightKeys.sort((a, b) => a.keyElement.getBoundingClientRect().top - b.keyElement.getBoundingClientRect().top);
    topKeys.sort((a, b) => a.keyElement.getBoundingClientRect().left - b.keyElement.getBoundingClientRect().left);
    bottomKeys.sort((a, b) => a.keyElement.getBoundingClientRect().left - b.keyElement.getBoundingClientRect().left);

    const originalWidth = keyboardCanvas.width + (2 * columnWidth) + (2 * padding);
    const originalHeight = keyboardCanvas.height + (2 * rowHeight) + (2 * padding);
    
    const MAX_WIDTH = 1920;
    const MAX_HEIGHT = 1080;
    const scaleFactor = Math.min(1, MAX_WIDTH / originalWidth, MAX_HEIGHT / originalHeight);

    finalCanvas.width = originalWidth * scaleFactor;
    finalCanvas.height = originalHeight * scaleFactor;

    ctx.scale(scaleFactor, scaleFactor);

    if (format !== 'png') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, originalWidth, originalHeight);
    }
    
    const keyboardDrawX = (originalWidth - keyboardCanvas.width) / 2;
    const keyboardDrawY = (originalHeight - keyboardCanvas.height) / 2;
    ctx.drawImage(keyboardCanvas, keyboardDrawX, keyboardDrawY);

    ctx.font = 'bold 22px monospace';
    ctx.lineWidth = 1.5;

    const drawGuidanceVector = (mapping, textPos) => {
        const keyElement = mapping.keyElement;
        const keyRect = keyElement.getBoundingClientRect();
        const keyCenterX = keyboardDrawX + (keyRect.left - keyboardRect.left + keyRect.width / 2) * 2;
        const keyCenterY = keyboardDrawY + (keyRect.top - keyboardRect.top + keyRect.height / 2) * 2;
        const description = `${keyElement.dataset.keyId}: ${mapping.legendItem.querySelector('.description-input').value || 'No description'}`;
        const color = tagColors[mapping.legendItem.querySelector('.tag-selector').value];

        ctx.textBaseline = 'middle';
        
        const textMetrics = ctx.measureText(description);
        const textWidth = Math.min(textMetrics.width, (textPos.dir === 'horizontal' ? columnWidth : (keyboardCanvas.width / (topKeys.length || 1))) - textPadding * 2);
        const textHeight = parseInt(ctx.font, 10);
        const rectWidth = textWidth + textPadding * 2;
        const rectHeight = textHeight + textPadding * 2;
        let rectX, rectY;
        let connectionPointX, connectionPointY;

        ctx.textAlign = textPos.align;
        
        if (textPos.dir === 'horizontal') {
            rectY = textPos.y - rectHeight / 2;
            if (textPos.align === 'right') {
                rectX = textPos.x - rectWidth;
                connectionPointX = rectX + rectWidth;
            } else { // left
                rectX = textPos.x;
                connectionPointX = rectX;
            }
            connectionPointY = textPos.y;
        } else { // vertical
            rectX = textPos.x - rectWidth / 2;
            connectionPointX = textPos.x;
            if (textPos.y < keyCenterY) { // top
                rectY = textPos.y;
                connectionPointY = rectY + rectHeight;
            } else { // bottom
                rectY = textPos.y - rectHeight;
                connectionPointY = rectY;
            }
        }
        
        // Draw Box
        ctx.fillStyle = color;
        ctx.fillRect(rectX, rectY, rectWidth, rectHeight);
        ctx.strokeStyle = '#000000';
        ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);
        
        // Draw Text
        ctx.fillStyle = '#000000';
        const textDrawX = textPos.align === 'center' ? textPos.x : (textPos.align === 'right' ? rectX + rectWidth - textPadding : rectX + textPadding);
        ctx.fillText(description, textDrawX, textPos.y, textWidth);

        // Draw Vector
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(keyCenterX, keyCenterY);
        if (textPos.dir === 'horizontal') {
            const turnPointX = connectionPointX + (textPos.align === 'right' ? 20 : -20);
            ctx.lineTo(turnPointX, keyCenterY);
            ctx.lineTo(turnPointX, connectionPointY);
            ctx.lineTo(connectionPointX, connectionPointY);
        } else { // vertical
            const turnPointY = connectionPointY + (textPos.y < keyCenterY ? -20 : 20);
            ctx.lineTo(keyCenterX, turnPointY);
            ctx.lineTo(connectionPointX, turnPointY);
            ctx.lineTo(connectionPointX, connectionPointY);
        }
        ctx.stroke();
        
        return { width: rectWidth, height: rectHeight };
    };
    
    let currentY = keyboardDrawY;
    leftKeys.forEach(mapping => { 
        drawGuidanceVector(mapping, { x: keyboardDrawX - padding, y: currentY, align: 'right', dir: 'horizontal' }); 
        currentY += lineHeight; 
    });
    
    currentY = keyboardDrawY;
    rightKeys.forEach(mapping => { 
        drawGuidanceVector(mapping, { x: keyboardDrawX + keyboardCanvas.width + padding, y: currentY, align: 'left', dir: 'horizontal' }); 
        currentY += lineHeight; 
    });
    
    // Dynamic spacing logic
    let currentX = keyboardDrawX;
    topKeys.forEach(mapping => {
        const rectInfo = drawGuidanceVector(mapping, { x: currentX, y: keyboardDrawY - padding, align: 'left', dir: 'vertical' }); 
        currentX += rectInfo.width + itemSpacing;
    });

    currentX = keyboardDrawY;
    bottomKeys.forEach(mapping => { 
        const rectInfo = drawGuidanceVector(mapping, { x: currentX, y: keyboardDrawY + keyboardCanvas.height + padding, align: 'left', dir: 'vertical' }); 
        currentX += rectInfo.width + itemSpacing;
    });

    if (format === 'pdf') {
        const { jsPDF } = window.jspdf;
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

// --- EXPORT BUTTON EVENT LISTENERS ---
exportPngBtn.addEventListener('click', () => performSchematicExport('png'));
exportJpgBtn.addEventListener('click', () => performSchematicExport('jpeg'));
exportPdfBtn.addEventListener('click', () => performSchematicExport('pdf'));

// --- INITIALIZATION ---
renderKeyboard();