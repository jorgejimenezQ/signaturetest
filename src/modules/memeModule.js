// src/modules/memeModule.js
export class MemeModule {
    /**
     * Fetch the list of meme templates.
     * @returns {Promise<Array>} Array of meme objects ({ id, name, url, ... })
     */
    async fetchMemeList() {
        try {
            const response = await fetch('https://api.imgflip.com/get_memes');
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const data = await response.json();
            if (data.success && data.data.memes.length > 0) {
                return data.data.memes;
            }
            return [];
        } catch (error) {
            console.error('Failed to fetch meme list:', error);
            return [];
        }
    }
}
