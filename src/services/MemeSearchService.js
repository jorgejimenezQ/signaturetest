import { sortMemes } from '../utilities/mergeSort.js';

// src/services/MemeSearchService.js
export class MemeSearchService {
    constructor() {
        this.memes = [];
        this.initialized = false;
    }

    /**
     * Fetch memes from Imgflip and store them locally.
     */
    async init() {
        if (this.initialized) return;
        try {
            const response = await fetch('https://api.imgflip.com/get_memes');
            if (!response.ok) {
                throw new Error('Error fetching memes');
            }
            const data = await response.json();
            if (data.success && Array.isArray(data.data.memes)) {
                this.memes = data.data.memes;
                // sort memes
                console.log('Memes loaded:', this.memes);
                sortMemes(this.memes);
                console.log('Memes sorted:', this.memes);
            }
            this.initialized = true;
        } catch (e) {
            console.error('Failed to initialize MemeSearchService', e);
        }
    }

    /**
     * Filter memes by name using the provided query (case-insensitive).
     * @param {string} query
     * @returns {Array} Filtered list of meme objects.
     */
    search(query) {
        if (!query) {
            return this.memes;
        }

        // if empty string, return all
        if (query === '') {
            return this.memes;
        }
        return this.memes.filter((meme) => meme.name.toLowerCase().includes(query.toLowerCase()));
    }
}
