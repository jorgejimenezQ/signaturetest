import signatureService from './services/index.js';
import { MemeSearchService } from './services/MemeSearchService.js';
import { SignatureMemeEditor } from './modules/cardEditors/SignatureMemeEditor.js';

// --- DOM Elements ---
const editSelection = document.getElementById('editSelection');
const selectedCellLabel = document.getElementById('selectedCellLabel');
const gridCells = document.querySelectorAll('.grid-cell');
const submitCardBtn = document.getElementById('submitCardBtn');
const cancelBtn = document.getElementById('cancelBtn');
const cardPopup = document.getElementById('cardPopup');
const popupImage = document.getElementById('popupImage');
const closePopup = document.getElementById('closePopup');

// --- Application State ---
let selectedCellId = null;
let selectedCellElement = null;
let currentEditor = null; // Instance of our current card editor

// Initialize MemeSearchService (used internally by the editor)
const memeSearchService = new MemeSearchService();
memeSearchService.init(); // Editor will create its own instance if needed

// Setup grid cell click events.
gridCells.forEach((cell) => {
    cell.addEventListener('click', () => {
        selectedCellId = cell.getAttribute('data-cell');
        selectedCellElement = cell;
        selectedCellLabel.textContent = selectedCellId;
        editSelection.style.display = 'block';

        // Initialize our plug-and-play editor (SignatureMemeEditor in this case)
        currentEditor = new SignatureMemeEditor();
        currentEditor.init(editSelection);
    });
});

// Setup Submit button event.
submitCardBtn.addEventListener('click', async () => {
    if (!currentEditor.isValid()) {
        alert('Please complete the card (sign and select a meme) before submitting.');
        return;
    }
    try {
        const compositeDataUrl = await currentEditor.getComposite();
        const card = signatureService.addCard(selectedCellId, { composite: compositeDataUrl });
        updateGridCell(selectedCellElement, card);
        editSelection.style.display = 'none';
        showCardPopup(card);
        selectedCellId = null;
        selectedCellElement = null;
    } catch (err) {
        console.error('Error merging images:', err);
        alert('Failed to merge meme and signature.');
    }
});

// Cancel event.
cancelBtn.addEventListener('click', () => {
    editSelection.style.display = 'none';
    selectedCellId = null;
    selectedCellElement = null;
});

// Update grid cell with composite card.
function updateGridCell(cellElement, card) {
    cellElement.innerHTML = '';
    const container = document.createElement('div');
    container.className = 'card-content';
    const compositeImg = document.createElement('img');
    compositeImg.src = card.composite;
    compositeImg.alt = 'Composite Card';
    container.appendChild(compositeImg);
    cellElement.appendChild(container);
}

// Show modal popup with composite card.
function showCardPopup(card) {
    popupImage.src = card.composite;
    cardPopup.style.display = 'block';
}
closePopup.addEventListener('click', () => {
    cardPopup.style.display = 'none';
});
