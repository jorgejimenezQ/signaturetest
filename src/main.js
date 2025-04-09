// src/main.js
import { SignatureModule } from './modules/signatureModule.js';
import { MemeModule } from './modules/memeModule.js';
import signatureService from './services/index.js';

// --- DOM Elements ---
const gridContainer = document.getElementById('gridContainer');
const editSelection = document.getElementById('editSelection');
const selectedCellLabel = document.getElementById('selectedCellLabel');
const signatureCanvas = document.getElementById('signatureCanvas');
const memeSelect = document.getElementById('memeSelect');
const memePreview = document.getElementById('memePreview');
const submitCardBtn = document.getElementById('submitCardBtn');
const cancelBtn = document.getElementById('cancelBtn');

// Modal popup elements for final composite display
const cardPopup = document.getElementById('cardPopup');
const popupImage = document.getElementById('popupImage');
const closePopup = document.getElementById('closePopup');

// --- Modules ---
let signatureModule = null; // will initialize when popup opens
const memeModule = new MemeModule();

// --- State ---
let selectedCellId = null;
let selectedCellElement = null;

// --- Helper: Populate Meme Dropdown ---
async function populateMemeDropdown() {
    const memes = await memeModule.fetchMemeList();
    // Clear current options
    memeSelect.innerHTML = '';
    if (memes.length === 0) {
        memeSelect.innerHTML = `<option value="">No memes available</option>`;
        return;
    }
    // Add a default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select a meme';
    memeSelect.appendChild(defaultOption);
    // Populate dropdown with meme options
    memes.forEach((meme) => {
        const option = document.createElement('option');
        option.value = meme.url; // using URL as the value
        option.textContent = meme.name;
        memeSelect.appendChild(option);
    });
}

// --- Update Meme Preview on Dropdown Change ---
memeSelect.addEventListener('change', () => {
    const selectedUrl = memeSelect.value;
    if (selectedUrl) {
        // Set and display the meme preview image.
        memePreview.style.display = 'block';
        memePreview.src = selectedUrl;
        // When the meme image loads, adjust dimensions.
        memePreview.onload = () => {
            // Get the container (signatureContainer) width.
            const container = document.getElementById('signatureContainer');
            const containerWidth = container.offsetWidth;
            // Calculate the aspect ratio from the meme's natural dimensions.
            const aspectRatio = memePreview.naturalHeight / memePreview.naturalWidth;
            // Compute the new height based on the container's width.
            const newHeight = containerWidth * aspectRatio;

            // Set the container's and meme preview's height.
            container.style.height = `${newHeight}px`;
            memePreview.style.height = `${newHeight}px`;
            // Also adjust the signature canvas's height.
            signatureCanvas.style.height = `${newHeight}px`;

            // Optionally, force a re-run of the signature module’s resize logic.
            // (We call the internal method _resizeCanvas() here for simplicity.)
            if (signatureModule && typeof signatureModule._resizeCanvas === 'function') {
                signatureModule._resizeCanvas();
            }
        };
    } else {
        memePreview.style.display = 'none';
        memePreview.src = '';
    }
});

// --- Grid Cell Click Event ---
// When a cell is clicked, store its ID and element, then show the popup for editing.
const gridCells = document.querySelectorAll('.grid-cell');
gridCells.forEach((cell) => {
    cell.addEventListener('click', () => {
        selectedCellId = cell.getAttribute('data-cell');
        selectedCellElement = cell;
        selectedCellLabel.textContent = selectedCellId;
        // Show the editSelection overlay
        editSelection.style.display = 'block';
        // Initialize the signature module on the canvas and clear any previous strokes
        signatureModule = new SignatureModule(signatureCanvas);
        signatureModule.clear();
        // Hide any previous meme preview
        memePreview.style.display = 'none';
        memePreview.src = '';
        // Populate the meme dropdown
        populateMemeDropdown();
    });
});

// --- Utility: Merge Meme and Signature ---
// Merge the meme image (background) with the signature drawn on the canvas.
function mergeMemeAndSignature(memeUrl, canvasEl) {
    return new Promise((resolve, reject) => {
        const offscreen = document.createElement('canvas');
        offscreen.width = canvasEl.width;
        offscreen.height = canvasEl.height;
        const ctx = offscreen.getContext('2d');

        const memeImg = new Image();
        memeImg.crossOrigin = 'anonymous'; // set if needed
        memeImg.src = memeUrl;
        memeImg.onload = () => {
            // Draw the meme as background
            ctx.drawImage(memeImg, 0, 0, offscreen.width, offscreen.height);
            // Overlay the signature (which has a transparent background)
            ctx.drawImage(canvasEl, 0, 0);
            resolve(offscreen.toDataURL());
        };
        memeImg.onerror = (err) => {
            reject(err);
        };
    });
}

// --- Submit Button Event ---
// When the user clicks Submit, merge the signature and meme, update the grid cell,
// save the composite image, and show the full‑page modal popup.
submitCardBtn.addEventListener('click', async () => {
    if (!signatureModule || signatureModule.isEmpty()) {
        alert('Please sign before submitting.');
        return;
    }
    const memeUrl = memeSelect.value;
    if (!memeUrl) {
        alert('Please select a meme from the dropdown.');
        return;
    }

    try {
        const compositeDataUrl = await mergeMemeAndSignature(memeUrl, signatureCanvas);
        // Save the composite card via our service.
        const card = signatureService.addCard(selectedCellId, {
            composite: compositeDataUrl,
        });
        console.log('Saved card:', card);
        // Update the grid cell to display the composite image.
        updateGridCell(selectedCellElement, card);
        // Hide the editSelection overlay.
        editSelection.style.display = 'none';
        // Show the full‑page modal popup.
        showCardPopup(card);
        // Reset selection state.
        selectedCellId = null;
        selectedCellElement = null;
    } catch (err) {
        console.error('Error merging images:', err);
        alert('Failed to merge meme and signature.');
    }
});

// --- Cancel Button Event ---
cancelBtn.addEventListener('click', () => {
    editSelection.style.display = 'none';
    selectedCellId = null;
    selectedCellElement = null;
});

// --- Update Grid Cell ---
// Update the grid cell to show the composite card image.
function updateGridCell(cellElement, card) {
    cellElement.innerHTML = ''; // clear previous content
    const container = document.createElement('div');
    container.className = 'card-content';
    const compositeImg = document.createElement('img');
    compositeImg.src = card.composite;
    compositeImg.alt = 'Composite Card';
    container.appendChild(compositeImg);
    cellElement.appendChild(container);
}

// --- Show Modal Popup Covering the Page ---
// Display the composite card in a full-page modal popup.
function showCardPopup(card) {
    popupImage.src = card.composite;
    cardPopup.style.display = 'block';
}

// --- Close Modal Popup Event ---
closePopup.addEventListener('click', () => {
    cardPopup.style.display = 'none';
});
