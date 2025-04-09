import { BaseCardEditor } from './BaseCardEditor.js';
import { SignatureModule } from '../signatureModule.js';
import { mergeMemeAndSignature } from '../../utilities/mergeMemeSignature.js';
import { MemeSearchService } from '../../services/MemeSearchService.js';

export class SignatureMemeEditor extends BaseCardEditor {
    constructor(options = {}) {
        super();
        // DOM references will be set upon init.
        this.container = null;
        this.signatureContainer = null;
        this.memePreview = null;
        this.signatureCanvas = null;
        this.memeSearchInput = null;
        this.memeSearchResults = null;
        this.signatureModule = null;
        this.selectedMemeUrl = null;

        // Create our own instance of MemeSearchService for local search.
        this.memeSearchService = new MemeSearchService();
        // Optionally, accept extra configuration via options.
        this.options = Object.assign({}, options);
    }

    /**
     * Initialize the editor within the provided container.
     * Expects the container to have the following child elements by ID:
     *   #signatureContainer, #memePreview, #signatureCanvas,
     *   #memeSearchInput, and #memeSearchResults.
     * @param {HTMLElement} containerElement
     */
    async init(containerElement) {
        this.container = containerElement;
        this.signatureContainer = containerElement.querySelector('#signatureContainer');
        this.memePreview = containerElement.querySelector('#memePreview');
        this.signatureCanvas = containerElement.querySelector('#signatureCanvas');
        this.memeSearchInput = containerElement.querySelector('#memeSearchInput');
        this.memeSearchResults = containerElement.querySelector('#memeSearchResults');

        // Initialize the signature pad.
        this.signatureModule = new SignatureModule(this.signatureCanvas);
        this.signatureModule.clear();

        // Initialize meme search service and set up search functionality.
        await this.memeSearchService.init();
        this.setupMemeSearch();

        // When the meme preview loads, adjust the container height to match its aspect ratio.
        this.memePreview.addEventListener('load', () => {
            const containerWidth = this.signatureContainer.offsetWidth;
            const aspectRatio = this.memePreview.naturalHeight / this.memePreview.naturalWidth;
            const newHeight = containerWidth * aspectRatio;
            this.signatureContainer.style.height = `${newHeight}px`;
            this.memePreview.style.height = `${newHeight}px`;
            this.signatureCanvas.style.height = `${newHeight}px`;
            if (this.signatureModule && typeof this.signatureModule._resizeCanvas === 'function') {
                this.signatureModule._resizeCanvas();
            }
        });
    }

    /**
     * Set up meme search input and results.
     */
    setupMemeSearch() {
        // Render initial results (all memes).
        this.renderMemeResults(this.memeSearchService.search(''));

        this.memeSearchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            const results = this.memeSearchService.search(query);
            this.renderMemeResults(results);
        });

        this.memeSearchInput.addEventListener('focus', () => {
            this.renderMemeResults(this.memeSearchService.search(''));
        });
    }

    /**
     * Render meme search results inside the memeSearchResults container.
     * @param {Array} memes
     */
    renderMemeResults(memes) {
        this.memeSearchResults.innerHTML = '';
        if (!memes.length) {
            this.memeSearchResults.innerHTML = '<p>No results found.</p>';
            return;
        }
        memes.forEach((meme) => {
            const resultDiv = document.createElement('div');
            resultDiv.className = 'meme-result';
            resultDiv.title = meme.name;

            const thumb = document.createElement('img');
            thumb.src = meme.url;
            thumb.alt = meme.name;

            const label = document.createElement('div');
            label.textContent = meme.name;

            resultDiv.appendChild(thumb);
            resultDiv.appendChild(label);

            // When a meme result is clicked, set it as selected.
            resultDiv.addEventListener('click', () => {
                this.setSelectedMemeUrl(meme.url);
                this.memeSearchResults.innerHTML = '';
                this.memeSearchInput.value = meme.name;
            });

            this.memeSearchResults.appendChild(resultDiv);
        });
    }

    /**
     * Returns true if both a signature has been provided and a meme has been selected.
     * @returns {boolean}
     */
    isValid() {
        return this.signatureModule && !this.signatureModule.isEmpty() && !!this.selectedMemeUrl;
    }

    /**
     * Returns a Promise that resolves to the composite merged image as a data URL.
     * @returns {Promise<string>}
     */
    getComposite() {
        return mergeMemeAndSignature(this.selectedMemeUrl, this.signatureCanvas);
    }

    /**
     * Clears the editor's input.
     */
    clear() {
        if (this.signatureModule) {
            this.signatureModule.clear();
        }
        this.selectedMemeUrl = null;
        if (this.memePreview) {
            this.memePreview.style.display = 'none';
            this.memePreview.src = '';
        }
        if (this.memeSearchInput) {
            this.memeSearchInput.value = '';
        }
        if (this.memeSearchResults) {
            this.memeSearchResults.innerHTML = '';
        }
    }

    /**
     * Sets the selected meme URL and updates the preview.
     * @param {string} url
     */
    setSelectedMemeUrl(url) {
        this.selectedMemeUrl = url;
        if (url && this.memePreview) {
            this.memePreview.src = url;
            this.memePreview.style.display = 'block';
        } else if (this.memePreview) {
            this.memePreview.style.display = 'none';
            this.memePreview.src = '';
        }
    }
}
