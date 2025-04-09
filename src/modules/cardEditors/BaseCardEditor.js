export class BaseCardEditor {
    constructor() {
        if (new.target === BaseCardEditor) {
            throw new TypeError('Cannot instantiate BaseCardEditor directly');
        }
    }

    /**
     * Initialize the editor UI inside the given container element.
     * @param {HTMLElement} containerElement
     */
    init(containerElement) {
        throw new Error('init() must be implemented by subclasses');
    }

    /**
     * Returns true if the editor’s input is valid (e.g. meme selected, signature provided).
     * @returns {boolean}
     */
    isValid() {
        throw new Error('isValid() must be implemented by subclasses');
    }

    /**
     * Returns a Promise that resolves to the composite output (e.g. a merged image data URL).
     * @returns {Promise<string>}
     */
    getComposite() {
        throw new Error('getComposite() must be implemented by subclasses');
    }

    /**
     * Resets the editor's internal state.
     */
    clear() {
        throw new Error('clear() must be implemented by subclasses');
    }
}
